/**
 * Course pricing config — single source of truth for charge amounts.
 * The frontend never dictates amounts; the server computes from this config.
 */

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
 * Server-owned catalog — single source of truth for which cohort IDs are
 * valid for each (courseSlug, mode) combination. The frontend passes cohort IDs
 * back for convenience, but the server validates them here before any hold or
 * PaymentIntent is created. Unknown or mismatched cohorts are rejected.
 *
 * ⚠️  Keep in sync with:
 *   - artifacts/kaseet-academy/src/data/cohorts.json  (short courses)
 *   - artifacts/kaseet-academy/src/data/masterclasses.ts (masterclasses)
 *
 * Multiple active cohorts per (courseSlug, mode) are supported.
 * When a new cohort is added, append its numeric ID to the relevant array.
 */
export const COHORT_CATALOG: Record<string, { onsite?: readonly number[]; live?: readonly number[] }> = {
  // ── Masterclasses (IDs from masterclasses.ts cohortIdOnsite/cohortIdLive) ──
  "masar-soti":    { onsite: [301], live: [302] },
  "masar-khataba": { onsite: [303], live: [304] },
  "masar-elami":   { onsite: [305], live: [306] },

  // ── Short courses (IDs from cohorts.json — updated 2026-08-17) ──
  voiceover: {
    onsite: [126, 130, 132, 135, 137, 139, 140, 142],
    live:   [127, 128, 129, 131, 133, 134, 136, 138, 141, 143],
  },
  presenter:        { onsite: [202] },
  "public-speaking":  { onsite: [201] },
  "arabic-language":  { live: [203] },
};

/**
 * Validates that `cohortId` belongs to the server catalog for this course+mode.
 * Throws a typed error string if the combination is not allowed.
 * Returns the validated cohortId so callers can use it downstream.
 */
export function validateCohort(
  courseSlug: string,
  mode: "onsite" | "live",
  cohortId: number,
): number {
  const catalog = COHORT_CATALOG[courseSlug];
  if (!catalog) throw new Error("INVALID_COURSE");
  const allowed = mode === "onsite" ? catalog.onsite : catalog.live;
  if (!allowed) throw new Error("MODE_NOT_AVAILABLE");
  if (!allowed.includes(cohortId)) throw new Error("COHORT_MISMATCH");
  return cohortId;
}
