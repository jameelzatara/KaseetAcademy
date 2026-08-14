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
