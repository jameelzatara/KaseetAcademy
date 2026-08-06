// ── Fixed currency conversion table (updated quarterly by Wajeez) ──
// Last updated: 2026-08-01 · Base: JOD

export type CurrencyCode = 'JOD' | 'USD' | 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'EGP';

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  JOD: 1,
  USD: 1.41,
  SAR: 5.29,
  AED: 5.18,
  KWD: 0.43,
  QAR: 5.13,
  BHD: 0.53,
  OMR: 0.54,
  EGP: 68.50,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  JOD: 'د.أ',
  USD: '$',
  SAR: 'ر.س',
  AED: 'د.إ',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  BHD: 'د.ب',
  OMR: 'ر.ع',
  EGP: 'ج.م',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  JOD: 'الدينار الأردني',
  USD: 'الدولار الأمريكي',
  SAR: 'الريال السعودي',
  AED: 'الدرهم الإماراتي',
  KWD: 'الدينار الكويتي',
  QAR: 'الريال القطري',
  BHD: 'الدينار البحريني',
  OMR: 'الريال العُماني',
  EGP: 'الجنيه المصري',
};

// Rounding table — round UP to nearest of these values
const ROUND: Partial<Record<CurrencyCode, number>> = {
  JOD: 5, USD: 5, SAR: 25, AED: 25, EGP: 50,
};

export const CURRENCY_LIST: CurrencyCode[] = [
  'JOD', 'USD', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'EGP',
];

/** Convert JOD base price to target currency, with rounding. */
export function convertPrice(jodPrice: number, to: CurrencyCode): number {
  if (to === 'JOD') return jodPrice;
  const raw = jodPrice * CURRENCY_RATES[to];
  const roundTo = ROUND[to];
  if (roundTo) return Math.ceil(raw / roundTo) * roundTo;
  return Math.round(raw * 10) / 10;
}

/** Format a price in the given currency. */
export function formatPrice(price: number, code: CurrencyCode): string {
  const sym = CURRENCY_SYMBOLS[code];
  const n = Number.isInteger(price) ? price : price.toFixed(1);
  if (code === 'USD') return `$${n}`;
  return `${n} ${sym}`;
}
