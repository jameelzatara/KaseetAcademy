/**
 * Import/seed script — reads the trainer's cohort roster spreadsheet and
 * upserts it into the `cohorts` + `cohort_seats` tables.
 *
 * Usage: pnpm --filter @workspace/db run import-cohorts <path-to-xlsx>
 *
 * Expected columns (in this exact order, header row is skipped):
 *   رقم الدفعة | البرنامج | النمط | الحالة | المدرّب | البداية | الانتهاء |
 *   الأيام | الوقت (نظام) | الوقت (عرض) | السعة | المسجّلون | المتبقّي |
 *   الامتلاء % | المنصّة
 *
 * "رقم الدفعة" and "الحالة" are read but not stored — cohort status is
 * always computed live from start_date + capacity/enrolled, never from a
 * manually-entered column, so it can't go stale between imports.
 *
 * Matching / upsert rule (natural key: courseSlug + mode + trainer + startDate):
 *   - No match  → INSERT a new cohort (new id from cohorts_id_seq) + a new
 *                 cohort_seats row, using the sheet's capacity AND enrolled
 *                 as the starting values.
 *   - Match     → UPDATE the cohort's schedule fields + cohort_seats.capacity,
 *                 but NEVER touch cohort_seats.enrolled — that counter is the
 *                 live site's checkout truth and must not regress because of
 *                 a periodic spreadsheet export.
 *
 * A row with an invalid date range (end before start) is skipped with a
 * warning rather than guessed at — fix the sheet and re-run.
 */
import ExcelJS from "exceljs";
import { pool } from "@workspace/db";

const PROGRAM_MAP: Record<string, { courseSlug: string; level: "beginner" | "advanced" }> = {
  "اساسيات التعليق الصوتي": { courseSlug: "voiceover", level: "beginner" },
  "التعليق الصوتي الوثائقي (مستوى متقدم)": { courseSlug: "voiceover", level: "advanced" },
  "التعليق الصوتي الرد الالي والاعلانات (مستوى متقدم)": { courseSlug: "voiceover", level: "advanced" },
};

const MODE_MAP: Record<string, string> = {
  "مباشر تفاعلي": "live",
  "حضوري": "onsite",
};

function cleanStr(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function cleanNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Accepts an ExcelJS Date cell value or a "D-M-YYYY" / "D/M/YYYY" string. Returns ISO YYYY-MM-DD or null. */
function parseDate(v: unknown): string | null {
  if (v instanceof Date) {
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = cleanStr(v);
  if (!s) return null;
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const parts = s.split(/[-/]/).map((p) => p.trim());
  if (parts.length === 3) {
    const [d, m, y] = parts;
    if (d && m && y && /^\d+$/.test(d) && /^\d+$/.test(m) && /^\d+$/.test(y)) {
      return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }
  return null;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: pnpm --filter @workspace/db run import-cohorts <path-to-xlsx>");
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  if (!sheet) {
    console.error("No sheet found in workbook");
    process.exit(1);
  }

  let inserted = 0, updated = 0, skipped = 0;
  const skipReasons: string[] = [];
  const unknownPrograms = new Set<string>();
  const unknownModes = new Set<string>();

  const client = await pool.connect();
  try {
    for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);
      const get = (col: number) => row.getCell(col).value;

      const programRaw = cleanStr(get(2));
      const modeRaw = cleanStr(get(3));
      const trainerName = cleanStr(get(5));
      const startDate = parseDate(get(6));
      const endDate = parseDate(get(7));
      const daysAr = cleanStr(get(8));
      const time24 = cleanStr(get(9));
      const timeAr = cleanStr(get(10));
      const capacity = cleanNum(get(11));
      const enrolled = cleanNum(get(12));
      const platform = cleanStr(get(15));

      // Entirely blank row — end of data
      if (!programRaw && !modeRaw && !trainerName) continue;

      const missingFields: string[] = [];
      if (!programRaw) missingFields.push("البرنامج");
      if (!modeRaw || !MODE_MAP[modeRaw ?? ""]) missingFields.push(`النمط (${modeRaw ?? "فارغ"})`);
      if (!trainerName) missingFields.push("المدرّب");
      if (!startDate) missingFields.push(`البداية (${cleanStr(get(6)) ?? "فارغ"})`);
      if (!endDate) missingFields.push(`الانتهاء (${cleanStr(get(7)) ?? "فارغ"})`);
      if (!daysAr) missingFields.push("الأيام");
      if (!platform) missingFields.push("المنصّة");
      if (capacity == null) missingFields.push("السعة");
      if (missingFields.length) {
        skipped++;
        skipReasons.push(`Row ${rowNum} (${programRaw ?? "?"}): missing/invalid — ${missingFields.join(", ")}`);
        continue;
      }
      const program = PROGRAM_MAP[programRaw];
      if (!program) {
        unknownPrograms.add(programRaw);
        skipped++;
        skipReasons.push(`Row ${rowNum}: unrecognized program "${programRaw}"`);
        continue;
      }
      const mode = MODE_MAP[modeRaw!];
      if (!mode) {
        unknownModes.add(modeRaw!);
        skipped++;
        skipReasons.push(`Row ${rowNum}: unrecognized mode "${modeRaw}"`);
        continue;
      }
      if (endDate < startDate) {
        skipped++;
        skipReasons.push(`Row ${rowNum}: end date (${endDate}) is before start date (${startDate}) — probably a typo in the sheet, fix and re-import`);
        continue;
      }

      await client.query("BEGIN");
      try {
        const { rows: existing } = await client.query(
          `SELECT id FROM cohorts
           WHERE course_slug = $1 AND mode = $2 AND trainer_name = $3 AND start_date = $4
           LIMIT 1`,
          [program.courseSlug, mode, trainerName, startDate],
        );

        if (existing.length) {
          const id = existing[0].id;
          await client.query(
            `UPDATE cohorts
             SET end_date = $2, days_ar = $3, time_24 = $4, time_ar = $5, platform = $6, level = $7, updated_at = NOW()
             WHERE id = $1`,
            [id, endDate, daysAr, time24, timeAr, platform, program.level],
          );
          await client.query(
            `UPDATE cohort_seats SET capacity = $2, updated_at = NOW() WHERE cohort_id = $1`,
            [id, capacity],
          );
          updated++;
        } else {
          const { rows: idRows } = await client.query(`SELECT nextval('cohorts_id_seq') AS id`);
          const id = Number(idRows[0].id);
          await client.query(
            `INSERT INTO cohorts (id, course_slug, level, mode, trainer_name, start_date, end_date, days_ar, time_24, time_ar, platform)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [id, program.courseSlug, program.level, mode, trainerName, startDate, endDate, daysAr, time24, timeAr, platform],
          );
          await client.query(
            `INSERT INTO cohort_seats (cohort_id, capacity, enrolled, is_open)
             VALUES ($1, $2, $3, true)
             ON CONFLICT (cohort_id) DO NOTHING`,
            [id, capacity, enrolled ?? 0],
          );
          inserted++;
        }
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }

  console.log(`\n✅ Import complete: ${inserted} inserted, ${updated} updated, ${skipped} skipped.`);
  if (skipReasons.length) {
    console.log("\n⚠️  Skipped rows:");
    for (const r of skipReasons) console.log(`  - ${r}`);
  }
  if (unknownPrograms.size) {
    console.log("\n❓ Unrecognized program names (add to PROGRAM_MAP in this script):");
    for (const p of unknownPrograms) console.log(`  - "${p}"`);
  }
  if (unknownModes.size) {
    console.log("\n❓ Unrecognized modes (add to MODE_MAP in this script):");
    for (const m of unknownModes) console.log(`  - "${m}"`);
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
