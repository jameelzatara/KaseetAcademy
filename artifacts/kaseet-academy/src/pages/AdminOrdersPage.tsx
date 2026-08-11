import { useState, useEffect, useCallback } from 'react';
import { Lock, RefreshCw, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import cohortsData from '@/data/cohorts.json';

// ── Types ─────────────────────────────────────────────────
interface Installment {
  seq: 1 | 2 | 3;
  amountJOD: number;
  method: string;
  paidAt: string | null;
  reference?: string;
}

interface Order {
  id: string;
  cohortId: number;
  courseSlug: string;
  mode: string;
  plan: string;
  customer: { firstName: string; lastName: string; email?: string; phone: string; country: string };
  firstName?: string; lastName?: string; phone?: string; email?: string; country?: string;
  totalJOD: number;
  totalUSD: number;
  paidJOD: number;
  remainingJOD: number;
  status: string;
  installments: Installment[];
  createdAt: string;
}

interface KpiData {
  revenue:    { thisMonth: number; lastMonth: number; delta: number | null };
  dues:       { total: number; count: number };
  seats:      { cohortId: number; available: number }[];
  newOrders:  { last7: number; last14: number; delta: number | null };
  completion: { pct: number | null; pctLast: number | null; delta: number | null };
}

// ── Cohort lookup (static) ─────────────────────────────────
interface CohortRow { id: number; course: string; mode: string; start_ar: string; days: string; time_ar: string }
const ALL_COHORTS = (cohortsData.cohorts as CohortRow[]);

// ── Design tokens ──────────────────────────────────────────
const DARK  = '#0D0B14';
const CREAM = '#F5F4F0';
const CREAM_CARD = '#FDFCF8';
const INK   = '#18202F';
const INK2  = '#4B5563';
const GREEN = '#16a34a';
const GOLD  = '#D97706';
const CREAM_LINE = 'rgba(24,32,47,.1)';
const F = "'Tajawal', 'Cairo', Arial, sans-serif";

const COURSE_NAMES: Record<string, string> = {
  voiceover:         'أساسيات التعليق',
  'voiceover-basics':'أساسيات التعليق',
  presenter:         'المذيع المحترف',
  'public-speaking': 'فن الخطابة',
  'arabic-language': 'اللغة العربية',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  deposit_paid:   { label: 'حجز مدفوع',    color: GOLD },
  paid_full:      { label: 'مدفوع كاملاً', color: GREEN },
  partially_paid: { label: 'مدفوع جزئياً', color: '#2563eb' },
  completed:      { label: 'مكتمل',        color: GREEN },
  refunded:       { label: 'مُسترَد',       color: '#dc2626' },
  overbooked:     { label: 'حجز زائد ⚠️',  color: '#dc2626' },
  pending:        { label: 'معلّق',         color: INK2 },
};

// ── WhatsApp templates ─────────────────────────────────────
function waLink(phone: string, text: string) {
  const clean = phone.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

function waTemplates(order: Order) {
  const name    = order.firstName ?? order.customer?.firstName ?? '';
  const id      = order.id;
  const course  = COURSE_NAMES[order.courseSlug] ?? order.courseSlug;
  const phone   = order.phone ?? order.customer?.phone ?? '';
  const rem     = order.remainingJOD ?? 0;

  return [
    {
      label: '📋 تأكيد التسجيل',
      text:  `أهلاً ${name} 🎉\nتمّ تأكيد تسجيلك في ${course} بنجاح!\nرقم طلبك: ${id}\nإذا كان لديك أيّ استفسار لا تتردّد في التواصل معنا.`,
    },
    {
      label: '💳 تذكير بالدفعة',
      text:  `أهلاً ${name}،\nنذكّركم بأنّ لديكم دفعة متبقّية بقيمة ${rem} دينار أردني لطلب رقم ${id}.\nنرجو ترتيب الدفع في أقرب وقت ممكن. شكراً!`,
    },
    {
      label: '📅 تذكير بموعد الدورة',
      text:  `أهلاً ${name} 👋\nنذكّركم بأنّ موعد دورة ${course} على وشك البدء.\nنتطلّع إلى رؤيتكم! أيّ استفسار؟ تفضّلوا بالتواصل.`,
    },
  ].map(t => ({ ...t, href: waLink(phone, t.text) }));
}

const API = '/api';

export default function AdminOrdersPage() {
  const [authed,       setAuthed]       = useState(false);
  const [password,     setPassword]     = useState('');
  const [loginErr,     setLoginErr]     = useState('');
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [payingOrder,  setPayingOrder]  = useState<{ id: string; seq: 1 | 2 | 3 } | null>(null);
  const [payMethod,    setPayMethod]    = useState<'cash' | 'bank_transfer'>('cash');
  const [payRef,       setPayRef]       = useState('');
  const [kpi,          setKpi]          = useState<KpiData | null>(null);
  const [kpiLoading,   setKpiLoading]   = useState(false);
  const [waOpen,       setWaOpen]       = useState<string | null>(null);

  async function login() {
    const resp = await fetch(`${API}/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ password }),
    });
    if (resp.ok) { setAuthed(true); }
    else setLoginErr('كلمة المرور غير صحيحة');
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const url = statusFilter
      ? `${API}/admin/orders?status=${statusFilter}`
      : `${API}/admin/orders`;
    const resp = await fetch(url, { credentials: 'include' });
    if (resp.ok) { const d = await resp.json(); setOrders(d.orders ?? []); }
    setLoading(false);
  }, [statusFilter]);

  const fetchKpi = useCallback(async () => {
    setKpiLoading(true);
    try {
      const resp = await fetch(`${API}/admin/kpi`, { credentials: 'include' });
      if (resp.ok) setKpi(await resp.json());
    } finally { setKpiLoading(false); }
  }, []);

  useEffect(() => { if (authed) { fetchOrders(); fetchKpi(); } }, [statusFilter, authed]);

  async function recordPayment() {
    if (!payingOrder) return;
    const resp = await fetch(`${API}/admin/orders/${payingOrder.id}/payment`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ seq: payingOrder.seq, method: payMethod, reference: payRef }),
    });
    if (resp.ok) { setPayingOrder(null); setPayRef(''); fetchOrders(); fetchKpi(); }
  }

  // ── Login screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: F, direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <Lock size={36} style={{ color: INK, marginBottom: 16 }} />
          <h2 style={{ margin: '0 0 24px', fontWeight: 800, fontSize: 22, color: INK }}>لوحة الإدارة</h2>
          <input
            type="password" placeholder="كلمة المرور" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontSize: 15, color: INK, background: '#fff', boxSizing: 'border-box', textAlign: 'center', marginBottom: 12 }}
          />
          {loginErr && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>{loginErr}</div>}
          <button
            onClick={login}
            style={{ width: '100%', padding: '12px 0', background: DARK, color: '#fff', border: 'none', borderRadius: 12, fontFamily: F, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  // ── Seats available in cohorts (merged with static data) ──
  const upcomingCohorts = kpi?.seats
    .map(s => {
      const c = ALL_COHORTS.find(c => c.id === s.cohortId);
      return c ? { ...s, ...c } : null;
    })
    .filter(Boolean) as (CohortRow & { available: number })[] | undefined;

  // Total seats available across all open cohorts in 14 days window
  const totalAvailable = upcomingCohorts?.reduce((sum, c) => sum + c.available, 0) ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: F, direction: 'rtl', paddingTop: 80 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>

        {/* ── KPI dashboard ──────────────────────────────── */}
        <h1 style={{ margin: '0 0 20px', fontWeight: 900, fontSize: 26, color: INK }}>لوحة التحكّم</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 32 }}>
          {/* 1. Revenue this month */}
          <KpiCard
            label="الإيرادات المُحصَّلة هذا الشهر"
            value={kpi ? `${kpi.revenue.thisMonth.toLocaleString('ar-JO')} د.أ` : '—'}
            delta={kpi?.revenue.delta ?? null}
            deltaUnit="%"
            loading={kpiLoading}
          />
          {/* 2. Outstanding dues — gold card */}
          <KpiCard
            label="المستحقّات غير المسدَّدة"
            value={kpi ? `${kpi.dues.total.toLocaleString('ar-JO')} د.أ` : '—'}
            sub={kpi ? `من ${kpi.dues.count} طلب` : undefined}
            loading={kpiLoading}
            accent={GOLD}
          />
          {/* 3. Available seats */}
          <KpiCard
            label="المقاعد المتاحة"
            value={kpiLoading ? '—' : String(totalAvailable)}
            sub={upcomingCohorts?.length ? `${upcomingCohorts.length} دفعة` : undefined}
            loading={kpiLoading}
          />
          {/* 4. New orders (7 days) */}
          <KpiCard
            label="طلبات جديدة (7 أيام)"
            value={kpi ? String(kpi.newOrders.last7) : '—'}
            delta={kpi?.newOrders.delta ?? null}
            deltaUnit=" طلب"
            loading={kpiLoading}
          />
          {/* 5. Completion rate */}
          <KpiCard
            label="نسبة إتمام الدفع (أقساط)"
            value={kpi?.completion.pct != null ? `${kpi.completion.pct}%` : '—'}
            delta={kpi?.completion.delta ?? null}
            deltaUnit=" نقطة"
            loading={kpiLoading}
          />
        </div>

        {/* ── Orders section ──────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: INK }}>الطلبات</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontSize: 13, color: INK, background: '#fff', cursor: 'pointer' }}
            >
              <option value="">كلّ الحالات</option>
              <option value="deposit_paid">حجز مدفوع</option>
              <option value="partially_paid">مدفوع جزئياً</option>
              <option value="paid_full">مدفوع كاملاً</option>
              <option value="completed">مكتمل</option>
              <option value="refunded">مُسترَد</option>
            </select>
            <button
              onClick={() => { fetchOrders(); fetchKpi(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontWeight: 700, fontSize: 13, color: INK, background: '#fff', cursor: 'pointer' }}
            >
              <RefreshCw size={14} /> تحديث
            </button>
          </div>
        </div>

        {loading && <p style={{ color: INK2, textAlign: 'center' }}>جارٍ التحميل…</p>}
        {!loading && orders.length === 0 && (
          <p style={{ color: INK2, textAlign: 'center' }}>لا توجد طلبات</p>
        )}

        {orders.map(order => {
          const st       = STATUS_LABELS[order.status] ?? { label: order.status, color: INK2 };
          const isOpen   = expanded === order.id;
          const pending  = order.installments?.filter(i => !i.paidAt && i.amountJOD > 0) ?? [];
          const phone    = order.phone ?? order.customer?.phone ?? '';
          const firstName= order.firstName ?? order.customer?.firstName ?? '';
          const lastName = order.lastName  ?? order.customer?.lastName ?? '';
          const email    = order.email ?? order.customer?.email ?? '';
          const country  = order.country ?? order.customer?.country ?? '';
          const templates= waTemplates({ ...order, phone, firstName });

          return (
            <div key={order.id} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 16, marginBottom: 10, overflow: 'hidden' }}>
              {/* Header row */}
              <div
                onClick={() => setExpanded(isOpen ? null : order.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer', flexWrap: 'wrap' }}
              >
                <span style={{ fontWeight: 800, fontSize: 13, color: INK, fontVariantNumeric: 'tabular-nums', direction: 'ltr' }}>{order.id}</span>
                <span style={{ fontSize: 13, color: INK2 }}>{COURSE_NAMES[order.courseSlug] ?? order.courseSlug} · {order.mode === 'onsite' ? 'حضوري' : 'أونلاين'}</span>
                <span style={{ fontSize: 12, color: INK2 }}>#{order.cohortId}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 13, color: INK }}>{firstName} {lastName}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: st.color, background: `${st.color}18`, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
                {(order.remainingJOD ?? 0) > 0 && (
                  <span style={{ fontSize: 12.5, color: '#dc2626', fontWeight: 700 }}>متبقّي: {order.remainingJOD} د.أ</span>
                )}
                {isOpen ? <ChevronUp size={15} style={{ color: INK2 }} /> : <ChevronDown size={15} style={{ color: INK2 }} />}
              </div>

              {/* Details panel */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${CREAM_LINE}`, padding: '18px 18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 16 }}>
                    <Detail label="الهاتف"   value={phone || '—'} />
                    <Detail label="البريد"   value={email || '—'} />
                    <Detail label="الدولة"   value={country || '—'} />
                    <Detail label="الإجمالي" value={order.mode === 'live' ? `$${order.totalUSD}` : `${order.totalJOD} د.أ`} />
                    <Detail label="المدفوع"  value={order.mode === 'live' ? `$${order.totalUSD}` : `${order.paidJOD} د.أ`} />
                    <Detail label="المتبقّي" value={(order.remainingJOD ?? 0) > 0 ? `${order.remainingJOD} د.أ` : '—'} />
                    <Detail label="تاريخ الطلب" value={new Date(order.createdAt).toLocaleDateString('ar-JO')} />
                  </div>

                  {/* Installments */}
                  {(order.installments?.length ?? 0) > 1 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 8 }}>الدفعات</div>
                      {order.installments.map(inst => (
                        <div key={inst.seq} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, fontSize: 13.5, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, color: INK }}>#{inst.seq}</span>
                          <span style={{ color: INK2 }}>{inst.amountJOD} د.أ</span>
                          <span style={{ color: INK2 }}>{inst.method === 'stripe' ? 'Stripe' : inst.method === 'cash' ? 'نقداً' : 'تحويل'}</span>
                          {inst.paidAt ? (
                            <span style={{ color: GREEN, fontWeight: 700 }}>✓ {new Date(inst.paidAt).toLocaleDateString('ar-JO')}</span>
                          ) : (
                            <span style={{ color: GOLD }}>معلّقة</span>
                          )}
                          {!inst.paidAt && inst.amountJOD > 0 && (
                            <button
                              onClick={() => setPayingOrder({ id: order.id, seq: inst.seq })}
                              style={{ marginRight: 'auto', padding: '4px 12px', background: DARK, color: '#fff', border: 'none', borderRadius: 8, fontFamily: F, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                            >
                              سجّل الدفع
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp templates */}
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => setWaOpen(waOpen === order.id ? null : order.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.3)', borderRadius: 10, color: GREEN, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: F }}
                    >
                      💬 رسائل واتساب
                    </button>
                    {waOpen === order.id && (
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {templates.map(t => (
                          <a
                            key={t.label}
                            href={t.href}
                            target="_blank" rel="noopener noreferrer"
                            style={{ padding: '6px 13px', background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.25)', borderRadius: 8, color: GREEN, fontWeight: 600, fontSize: 12.5, textDecoration: 'none', whiteSpace: 'nowrap' }}
                          >
                            {t.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Record payment modal ──────────────────────────── */}
      {payingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,11,20,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, direction: 'rtl' }}>
          <div style={{ background: CREAM_CARD, borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 380, margin: '0 16px', fontFamily: F }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: 800, fontSize: 20, color: INK }}>تسجيل دفعة يدوية</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 6 }}>وسيلة الدفع</label>
              <select
                value={payMethod} onChange={e => setPayMethod(e.target.value as any)}
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontSize: 14, color: INK, background: '#fff' }}
              >
                <option value="cash">نقداً</option>
                <option value="bank_transfer">تحويل بنكي</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 6 }}>رقم المرجع (اختياري)</label>
              <input
                value={payRef} onChange={e => setPayRef(e.target.value)}
                placeholder="رقم التحويل أو الإيصال"
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontSize: 14, color: INK, background: '#fff', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={recordPayment}
                style={{ flex: 1, padding: '11px 0', background: DARK, color: '#fff', border: 'none', borderRadius: 12, fontFamily: F, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                تأكيد
              </button>
              <button onClick={() => { setPayingOrder(null); setPayRef(''); }}
                style={{ flex: 1, padding: '11px 0', background: 'transparent', color: INK, border: `1.5px solid ${CREAM_LINE}`, borderRadius: 12, fontFamily: F, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function KpiCard({
  label, value, sub, delta, deltaUnit, loading, accent,
}: {
  label: string; value: string; sub?: string;
  delta?: number | null; deltaUnit?: string;
  loading?: boolean; accent?: string;
}) {
  const borderColor = accent ? `${accent}40` : CREAM_LINE;
  const bg          = accent ? `${accent}08` : CREAM_CARD;

  return (
    <div style={{ background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: '18px 16px' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: INK2, marginBottom: 6, lineHeight: 1.4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: accent ?? INK, lineHeight: 1 }}>
        {loading ? <span style={{ opacity: .35 }}>—</span> : value}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: INK2, marginTop: 4 }}>{sub}</div>}
      {delta != null && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, fontWeight: 700, color: delta > 0 ? GREEN : delta < 0 ? '#dc2626' : INK2 }}>
          {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {delta > 0 ? '+' : ''}{delta}{deltaUnit} عن الفترة السابقة
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}: </span>
      <span style={{ fontSize: 13.5, color: '#18202F', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
