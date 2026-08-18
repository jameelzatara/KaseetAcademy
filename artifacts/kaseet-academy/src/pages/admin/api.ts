/** Admin API helper — session-cookie fetch with Arabic error surfacing. */
const API = '/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const resp = await fetch(`${API}${path}`, {
    method: opts.method ?? 'GET',
    credentials: 'include',
    headers: opts.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  let data: any = null;
  try { data = await resp.json(); } catch { /* empty body */ }
  if (!resp.ok) throw new ApiError(resp.status, data?.error ?? `خطأ (${resp.status})`);
  return data as T;
}

// ── Shared domain constants ────────────────────────────────
export const COURSE_NAMES: Record<string, string> = {
  voiceover:             'أساسيات التعليق',
  'voiceover-basics':    'أساسيات التعليق',
  'voiceover-live':      'أساسيات التعليق (مباشر)',
  presenter:             'المذيع المحترف',
  'public-speaking':     'فن الخطابة',
  'arabic-language':     'اللغة العربية',
  'masterclass-elam':    'ماستركلاس الإعلام',
  'masterclass-voice':   'ماستركلاس التعليق',
  'masterclass-khataba': 'ماستركلاس الخطابة',
};

export const ORDER_STATUS: Record<string, { label: string; tone: 'green' | 'gold' | 'violet' | 'red' | 'gray' | 'blue' }> = {
  deposit_paid:   { label: 'حجز مدفوع',    tone: 'gold' },
  paid_full:      { label: 'مدفوع كاملاً', tone: 'green' },
  partially_paid: { label: 'مدفوع جزئياً', tone: 'blue' },
  completed:      { label: 'مكتمل',        tone: 'green' },
  refunded:       { label: 'مُسترَد',       tone: 'red' },
  cancelled:      { label: 'ملغى',          tone: 'red' },
  overbooked:     { label: 'حجز زائد',      tone: 'red' },
  pending:        { label: 'معلّق',          tone: 'gray' },
};

export function waLink(phone: string, text: string) {
  const clean = (phone ?? '').replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function fmtDate(d: string | Date | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ar-JO', { dateStyle: 'medium' });
}

export function fmtDateTime(d: string | Date | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleString('ar-JO', { dateStyle: 'short', timeStyle: 'short' });
}
