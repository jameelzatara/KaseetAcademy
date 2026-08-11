import { useState, useEffect } from 'react';
import { Lock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

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
  totalJOD: number;
  totalUSD: number;
  paidJOD: number;
  remainingJOD: number;
  status: string;
  installments: Installment[];
  createdAt: string;
}

const DARK = '#0D0B14';
const CREAM = '#F5F4F0';
const CREAM_CARD = '#FDFCF8';
const INK = '#18202F';
const INK2 = '#4B5563';
const GREEN = '#16a34a';
const CREAM_LINE = 'rgba(24,32,47,.1)';
const F = "'Tajawal', 'Cairo', Arial, sans-serif";

const COURSE_NAMES: Record<string, string> = {
  voiceover: 'أساسيات التعليق',
  'voiceover-basics': 'أساسيات التعليق',
  presenter: 'المذيع المحترف',
  'public-speaking': 'فن الخطابة',
  'arabic-language': 'اللغة العربية',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  deposit_paid:  { label: 'حجز مدفوع', color: '#d97706' },
  paid_full:     { label: 'مدفوع كاملاً', color: GREEN },
  partially_paid:{ label: 'مدفوع جزئياً', color: '#2563eb' },
  completed:     { label: 'مكتمل', color: GREEN },
  refunded:      { label: 'مُسترَد', color: '#dc2626' },
  pending:       { label: 'معلّق', color: INK2 },
};

const API = '/api';

export default function AdminOrdersPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [payingOrder, setPayingOrder] = useState<{ id: string; seq: 1 | 2 | 3 } | null>(null);
  const [payMethod, setPayMethod] = useState<'cash' | 'bank_transfer'>('cash');
  const [payRef, setPayRef] = useState('');

  async function login() {
    const resp = await fetch(`${API}/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ password }),
    });
    if (resp.ok) { setAuthed(true); fetchOrders(); }
    else setLoginErr('كلمة المرور غير صحيحة');
  }

  async function fetchOrders() {
    setLoading(true);
    const url = statusFilter ? `${API}/admin/orders?status=${statusFilter}` : `${API}/admin/orders`;
    const resp = await fetch(url, { credentials: 'include' });
    if (resp.ok) {
      const data = await resp.json();
      setOrders(data.orders ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { if (authed) fetchOrders(); }, [statusFilter, authed]);

  async function recordPayment() {
    if (!payingOrder) return;
    const resp = await fetch(`${API}/admin/orders/${payingOrder.id}/payment`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ seq: payingOrder.seq, method: payMethod, reference: payRef }),
    });
    if (resp.ok) { setPayingOrder(null); setPayRef(''); fetchOrders(); }
  }

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

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: F, direction: 'rtl', paddingTop: 80 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: INK }}>الطلبات</h1>
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
              onClick={fetchOrders}
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
          const st = STATUS_LABELS[order.status] ?? { label: order.status, color: INK2 };
          const isOpen = expanded === order.id;
          const pendingInst = order.installments?.filter(i => !i.paidAt && i.amountJOD > 0);

          return (
            <div key={order.id} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 16, marginBottom: 10, overflow: 'hidden' }}>
              {/* Header row */}
              <div
                onClick={() => setExpanded(isOpen ? null : order.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', cursor: 'pointer', flexWrap: 'wrap' }}
              >
                <span style={{ fontWeight: 800, fontSize: 14, color: INK }}>{order.id}</span>
                <span style={{ fontSize: 13, color: INK2 }}>{COURSE_NAMES[order.courseSlug] ?? order.courseSlug} · {order.mode === 'onsite' ? 'حضوري' : 'أونلاين'}</span>
                <span style={{ fontSize: 13, color: INK2 }}>#{order.cohortId}</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 13, color: INK }}>{order.customer.firstName} {order.customer.lastName}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: st.color, background: `${st.color}18`, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
                {order.remainingJOD > 0 && (
                  <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 700 }}>متبقّي: {order.remainingJOD} د.أ</span>
                )}
                {isOpen ? <ChevronUp size={16} style={{ color: INK2 }} /> : <ChevronDown size={16} style={{ color: INK2 }} />}
              </div>

              {/* Details */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${CREAM_LINE}`, padding: '18px 18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 16 }}>
                    <Detail label="الهاتف" value={order.customer.phone} />
                    <Detail label="البريد" value={order.customer.email ?? '—'} />
                    <Detail label="الدولة" value={order.customer.country} />
                    <Detail label="الإجمالي" value={order.mode === 'live' ? `$${order.totalUSD}` : `${order.totalJOD} د.أ`} />
                    <Detail label="المدفوع" value={order.mode === 'live' ? `$${order.totalUSD}` : `${order.paidJOD} د.أ`} />
                    <Detail label="المتبقّي" value={order.remainingJOD > 0 ? `${order.remainingJOD} د.أ` : '—'} />
                    <Detail label="تاريخ الطلب" value={new Date(order.createdAt).toLocaleDateString('ar-JO')} />
                  </div>

                  {/* Installments */}
                  {order.installments?.length > 1 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 8 }}>الدفعات</div>
                      {order.installments.map(inst => (
                        <div key={inst.seq} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, fontSize: 13.5 }}>
                          <span style={{ fontWeight: 700, color: INK }}>#{inst.seq}</span>
                          <span style={{ color: INK2 }}>{inst.amountJOD} د.أ</span>
                          <span style={{ color: INK2 }}>{inst.method === 'stripe' ? 'Stripe' : inst.method === 'cash' ? 'نقداً' : 'تحويل'}</span>
                          {inst.paidAt ? (
                            <span style={{ color: GREEN, fontWeight: 700 }}>✓ {new Date(inst.paidAt).toLocaleDateString('ar-JO')}</span>
                          ) : (
                            <span style={{ color: '#d97706' }}>معلّقة</span>
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

                  {/* WhatsApp link */}
                  <a
                    href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${order.customer.firstName}، هذا تذكير بدفعتك في كاسيت أكاديمي — طلب ${order.id}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.3)', borderRadius: 10, color: GREEN, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}
                  >
                    تذكير واتساب
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Record payment modal */}
      {payingOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,11,20,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, direction: 'rtl' }}>
          <div style={{ background: CREAM_CARD, borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 380, margin: '0 16px', fontFamily: F }}>
            <h3 style={{ margin: '0 0 20px', fontWeight: 800, fontSize: 20, color: INK }}>تسجيل دفعة يدوية</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 6 }}>وسيلة الدفع</label>
              <select value={payMethod} onChange={e => setPayMethod(e.target.value as any)}
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontSize: 14, color: INK, background: '#fff' }}>
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
              <button onClick={() => setPayingOrder(null)}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}: </span>
      <span style={{ fontSize: 13.5, color: '#18202F', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
