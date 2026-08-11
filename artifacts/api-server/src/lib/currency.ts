/**
 * FX config — تحصيل بالدولار دائماً.
 * تُحدَّث يدوياً كلّ ربع سنة.
 */
export const FX = {
  base: "JOD",
  updated: "2026-08-01",
  rates: {
    JOD: 1,
    USD: 1.41,
    SAR: 5.29,
    AED: 5.18,
    KWD: 0.43,
    QAR: 5.13,
    BHD: 0.53,
    OMR: 0.54,
    EGP: 68.5,
  },
  round: { JOD: 5, USD: 5, SAR: 25, AED: 25, EGP: 50 },
} as const;

/** التحصيل بالدولار دائماً */
export const CHARGE_CURRENCY = "usd";

/** الدفعة الأولى للحضوري ثابتة: 50 دينار */
export const DEPOSIT_JOD = 50;

/** يحوّل دينار أردني → دولار (تقريب لأعلى) */
export function jodToChargeUSD(amountJOD: number): number {
  return Math.ceil(amountJOD * FX.rates.USD);
}

/** يحوّل مبلغ دولار → أصغر وحدة (سنت) */
export function toMinorUSD(amountUSD: number): number {
  return Math.round(amountUSD * 100);
}

/**
 * يقسّم إجمالي الدورة الحضورية إلى 3 دفعات:
 * [50 دينار حجز, X, بقية]
 */
export function splitInstallments(
  totalJOD: number,
): [number, number, number] {
  const rest = totalJOD - DEPOSIT_JOD;
  const each = Math.round(rest / 2);
  return [DEPOSIT_JOD, each, rest - each];
}
