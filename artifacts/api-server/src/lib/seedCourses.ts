/**
 * Seeds the courses table from the static pricing config + cohorts metadata.
 * Idempotent: only runs when the table is empty.
 * After seeding, the DB is the editable source for the admin panel;
 * static files remain the fallback for the public site until the UI task wires them.
 */
import { pool } from "@workspace/db";
import { COURSE_PRICING, COURSE_NAMES } from "./pricing.js";
import { logger } from "./logger.js";

// hours/sessions per course+mode (mirrors cohorts.json "courses" block)
const COURSE_META: Record<string, { onsite?: { hours: number; sessions: number }; live?: { hours: number; sessions: number } }> = {
  "masar-soti":      { onsite: { hours: 44, sessions: 22 }, live: { hours: 44, sessions: 22 } },
  "masar-elami":     { onsite: { hours: 40, sessions: 20 }, live: { hours: 40, sessions: 20 } },
  "masar-khataba":   { onsite: { hours: 44, sessions: 22 }, live: { hours: 44, sessions: 22 } },
  voiceover:         { onsite: { hours: 16, sessions: 8 },  live: { hours: 12, sessions: 6 } },
  "public-speaking": { onsite: { hours: 16, sessions: 8 },  live: { hours: 12, sessions: 6 } },
  presenter:         { onsite: { hours: 16, sessions: 8 } },
  "arabic-language": { live:   { hours: 12, sessions: 6 } },
};

const ADVANCED = new Set(["masar-soti", "masar-khataba", "masar-elami", "presenter"]);
// "voiceover-basics" is an alias of "voiceover" in pricing — skip duplicates
const SKIP = new Set(["voiceover-basics"]);

export async function seedCoursesIfEmpty(): Promise<void> {
  try {
    const { rows } = await pool.query(`SELECT COUNT(*) AS c FROM courses`);
    if (Number(rows[0].c) > 0) return;

    for (const [slug, pricing] of Object.entries(COURSE_PRICING)) {
      if (SKIP.has(slug)) continue;
      const meta = COURSE_META[slug] ?? {};
      await pool.query(
        `INSERT INTO courses (
           slug, name_ar, level, status,
           onsite_enabled, onsite_price_jod, onsite_hours, onsite_sessions, onsite_capacity,
           live_enabled, live_price_usd, live_hours, live_sessions, live_capacity
         ) VALUES ($1,$2,$3,'active',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (slug) DO NOTHING`,
        [
          slug,
          COURSE_NAMES[slug] ?? slug,
          ADVANCED.has(slug) ? "advanced" : "beginner",
          !!pricing.onsite,
          pricing.onsite?.totalJOD ?? null,
          meta.onsite?.hours ?? null,
          meta.onsite?.sessions ?? null,
          pricing.onsite ? 10 : null,
          !!pricing.live,
          pricing.live?.totalUSD ?? null,
          meta.live?.hours ?? null,
          meta.live?.sessions ?? null,
          pricing.live ? 10 : null,
        ],
      );
    }
    logger.info("courses table seeded from pricing config");
  } catch (err) {
    logger.warn({ err }, "seedCoursesIfEmpty failed (non-fatal)");
  }
}
