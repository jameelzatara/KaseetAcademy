// ── Fixed currency conversion table (updated quarterly by Wajeez) ──
// Last updated: 2026-08 · Base: JOD (1 JOD ≈ 1.41 USD)

export type CurrencyCode =
  // Gulf
  | 'JOD' | 'USD' | 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR'
  // Mashreq + Nile
  | 'EGP' | 'IQD' | 'LBP' | 'SYP'
  // Maghreb
  | 'MAD' | 'TND' | 'DZD' | 'LYD'
  // Other Arab
  | 'YER' | 'SDG'
  // European
  | 'EUR' | 'GBP';

/** How many units of the currency equal 1 JOD */
export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  // Gulf
  JOD: 1,
  USD: 1.41,
  SAR: 5.29,
  AED: 5.18,
  KWD: 0.43,
  QAR: 5.13,
  BHD: 0.53,
  OMR: 0.54,
  // Mashreq + Nile
  EGP:  68.50,
  IQD:  1845,
  LBP:  126500,
  SYP:  18200,
  // Maghreb
  MAD:  13.90,
  TND:  4.35,
  DZD:  189,
  LYD:  6.75,
  // Other Arab
  YER:  353,
  SDG:  870,
  // European
  EUR:  1.28,
  GBP:  1.10,
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
  IQD: 'ع.د',
  LBP: 'ل.ل',
  SYP: 'ل.س',
  MAD: 'د.م',
  TND: 'د.ت',
  DZD: 'دج',
  LYD: 'د.ل',
  YER: 'ر.ي',
  SDG: 'ج.س',
  EUR: '€',
  GBP: '£',
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
  IQD: 'الدينار العراقي',
  LBP: 'الليرة اللبنانية',
  SYP: 'الليرة السورية',
  MAD: 'الدرهم المغربي',
  TND: 'الدينار التونسي',
  DZD: 'الدينار الجزائري',
  LYD: 'الدينار الليبي',
  YER: 'الريال اليمني',
  SDG: 'الجنيه السوداني',
  EUR: 'اليورو',
  GBP: 'الجنيه الإسترليني',
};

// Rounding table — round UP to nearest of these values
const ROUND: Partial<Record<CurrencyCode, number>> = {
  JOD: 5,
  USD: 5,
  SAR: 25,
  AED: 25,
  KWD: 1,
  QAR: 25,
  BHD: 1,
  OMR: 1,
  EGP: 50,
  IQD: 5000,
  LBP: 50000,
  SYP: 5000,
  MAD: 5,
  TND: 1,
  DZD: 50,
  LYD: 1,
  YER: 25,
  SDG: 50,
  EUR: 5,
  GBP: 5,
};

/** Ordered list — governs display order in the currency picker */
export const CURRENCY_LIST: CurrencyCode[] = [
  // Gulf first (most users)
  'JOD', 'USD', 'SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR',
  // Mashreq + Nile
  'EGP', 'IQD', 'LBP', 'SYP',
  // Maghreb
  'MAD', 'TND', 'DZD', 'LYD',
  // Other Arab
  'YER', 'SDG',
  // European
  'EUR', 'GBP',
];

/** Convert JOD base price to target currency, with rounding.
 *  Pass `liveRates` from `useExchangeRates` to use up-to-date rates. */
export function convertPrice(
  jodPrice: number,
  to: CurrencyCode,
  liveRates?: Partial<Record<CurrencyCode, number>>,
): number {
  if (to === 'JOD') return jodPrice;
  const rate = liveRates?.[to] ?? CURRENCY_RATES[to];
  const raw = jodPrice * rate;
  const roundTo = ROUND[to];
  if (roundTo) return Math.ceil(raw / roundTo) * roundTo;
  return Math.round(raw * 10) / 10;
}

/** Format a price in the given currency. */
export function formatPrice(price: number, code: CurrencyCode): string {
  const sym = CURRENCY_SYMBOLS[code];
  // Format number: integers as-is, large numbers with comma separators
  const n = price >= 1000
    ? price.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : Number.isInteger(price) ? price : price.toFixed(1);
  // Symbol-before currencies
  if (code === 'USD') return `$${n}`;
  if (code === 'EUR') return `€${n}`;
  if (code === 'GBP') return `£${n}`;
  // All others: number then symbol (Arabic convention)
  return `${n} ${sym}`;
}
