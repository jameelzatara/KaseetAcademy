/**
 * Course pricing config — single source of truth for charge amounts.
 * The frontend never dictates amounts; the server computes from this config.
 */
import { pool } from "@workspace/db";

export interface OnsitePricing {
  totalJOD: number;
}
export interface LivePricing {
  totalUSD: number;
}
export interface CoursePricing {
  onsite?: OnsitePricing;
  live?: LivePricing;
}

export const COURSE_PRICING: Record<string, CoursePricing> = {
  voiceover:          { onsite: { totalJOD: 218 }, live: { totalUSD: 150 } },
  "voiceover-basics": { onsite: { totalJOD: 218 }, live: { totalUSD: 150 } },
  presenter:          { onsite: { totalJOD: 250 } },
  "public-speaking":  { onsite: { totalJOD: 180 }, live: { totalUSD: 150 } },
  "arabic-language":  { live: { totalUSD: 150 } },
  // ── Masterclasses ─────────────────────────────────────────
  "masar-soti":       { onsite: { totalJOD: 550 }, live: { totalUSD: 750 } },
  "masar-khataba":    { onsite: { totalJOD: 500 }, live: { totalUSD: 700 } },
  "masar-elami":      { onsite: { totalJOD: 700 }, live: { totalUSD: 1000 } },
};

export const COURSE_NAMES: Record<string, string> = {
  voiceover:           "أساسيات التعليق والأداء الصوتي",
  "voiceover-basics":  "أساسيات التعليق والأداء الصوتي",
  presenter:           "الدورة المكثّفة: المذيع المحترف",
  "public-speaking":   "فن الخطابة والإلقاء الجماهيري المؤثّر",
  "arabic-language":   "تمكين اللغة العربية وفنون التحرير اللغوي",
  // ── Masterclasses ─────────────────────────────────────────
  "masar-soti":        "ماستركلاس التعليق والأداء الصوتي",
  "masar-khataba":     "ماستركلاس فن الخطابة والتواصل القيادي",
  "masar-elami":       "ماستركلاس الإعلام المتكامل",
};

export function getPricing(
  courseSlug: string,
  mode: "onsite" | "live",
): OnsitePricing | LivePricing | null {
  const course = COURSE_PRICING[courseSlug];
  if (!course) return null;
  if (mode === "onsite") return course.onsite ?? null;
  return course.live ?? null;
}

/**
 * Server-owned catalog — which cohort IDs are valid for each masterclass
 * (courseSlug, mode) combination. Masterclasses (masterclasses.ts) aren't
 * backed by the `cohorts` table, so they stay on this static whitelist.
 *
 * ⚠️  Keep in sync with artifacts/kaseet-academy/src/data/masterclasses.ts
 *     (cohortIdOnsite/cohortIdLive).
 */
export const COHORT_CATALOG: Record<string, { onsite?: readonly number[]; live?: readonly number[] }> = {
  "masar-soti":    { onsite: [301], live: [302] },
  "masar-khataba": { onsite: [303], live: [304] },
  "masar-elami":   { onsite: [305], live: [306] },
};

/**
 * Validates that `cohortId` belongs to this course+mode before any hold or
 * PaymentIntent is created. Masterclasses check the static catalog above;
 * every other course (the short courses driven by the trainer's roster
 * spreadsheet, see lib/db/scripts/import-cohorts.ts) is validated live
 * against the `cohorts` table, so a re-import never needs a matching code
 * change here. Throws a typed error string if the combination isn't allowed.
 */
export async function validateCohort(
  courseSlug: string,
  mode: "onsite" | "live",
  cohortId: number,
): Promise<number> {
  const catalog = COHORT_CATALOG[courseSlug];
  if (catalog) {
    const allowed = mode === "onsite" ? catalog.onsite : catalog.live;
    if (!allowed) throw new Error("MODE_NOT_AVAILABLE");
    if (!allowed.includes(cohortId)) throw new Error("COHORT_MISMATCH");
    return cohortId;
  }

  const { rows } = await pool.query(
    `SELECT 1 FROM cohorts WHERE id = $1 AND course_slug = $2 AND mode = $3 LIMIT 1`,
    [cohortId, courseSlug, mode],
  );
  if (!rows.length) throw new Error("COHORT_MISMATCH");
  return cohortId;
}
