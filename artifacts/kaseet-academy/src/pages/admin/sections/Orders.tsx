/** Section 2 — الطلبات. Staff (consultants see only their referred orders — enforced server-side). */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { api, COURSE_NAMES, ORDER_STATUS, waLink, fmtDate } from '../api';
import { Modal, Field, StatusBadge, TableCard, useToast } from '../components';
import { useAdminAuth } from '../context';
import { currentCohorts } from '@/data/currentCohorts';
import type { Order } from '@workspace/admin-types';

export type { Order };

interface CohortRow { id: number; course: string; mode: string; start_ar: string }
const ALL_COHORTS = currentCohorts as CohortRow[];

function orderName(o: Order) {
  return `${o.firstName ?? o.customer?.firstName ?? ''} ${o.lastName ?? o.customer?.lastName ?? ''}`.trim();
}
function orderPhone(o: Order) { return o.phone ?? o.customer?.phone ?? ''; }
function orderEmail(o: Order) { return o.email ?? o.customer?.email ?? ''; }

function waTemplates(o: Order) {
  const name = o.firstName ?? o.customer?.firstName ?? '';
  const course = COURSE_NAMES[o.courseSlug] ?? o.courseSlug;
  const rem = o.remainingJOD ?? 0;
  return [
    { label: '📋 تأكيد التسجيل', text: `أهلاً ${name} 🎉\nتمّ تأكيد تسجيلك في ${course} بنجاح!\nرقم طلبك: ${o.id}\nإذا كان لديك أيّ استفسار لا تتردّد في التواصل معنا.` },
    { label: '💳 تذكير بالدفعة', text: `أهلاً ${name}،\nنذكّركم بأنّ لديكم دفعة متبقّية بقيمة ${rem} دينار أردني لطلب رقم ${o.id}.\nنرجو ترتيب الدفع في أقرب وقت ممكن. شكراً!` },
    { label: '📅 تذكير بموعد الدورة', text: `أهلاً ${name} 👋\nنذكّركم بأنّ موعد دورة ${course} على وشك البدء.\nنتطلّع إلى رؤيتكم!` },
  ].map(t => ({ ...t, href: waLink(orderPhone(o), t.text) }));
}

export default function Orders() {
  const { user } = useAdminAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();

  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch]   = useState('');
  const [statusF, setStatusF] = useState('');
  const [cohortF, setCohortF] = useState('');
  const [duesF, setDuesF]     = useState(false);
  const [fromF, setFromF]     = useState('');
  const [toF, setToF]         = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('أهلاً {الاسم} 👋\n');
  const [paying, setPaying]   = useState<{ id: string; seq: 1 | 2 | 3 } | null>(null);
  const [payMethod, setPayMethod] = useState<'cash' | 'bank_transfer'>('cash');
  const [payRef, setPayRef]   = useState('');
  const [waOpen, setWaOpen]   = useState<string | null>(null);
  const [busy, setBusy]       = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (statusF) qs.set('status', statusF);
      if (cohortF) qs.set('cohortId', cohortF);
      if (duesF)   qs.set('hasDues', '1');
      const d = await api<{ orders: Order[] }>(`/admin/orders${qs.size ? `?${qs}` : ''}`);
      setOrders(d.orders ?? []);
    } catch (e: any) { toast(e.message, 'err'); }
    finally { setLoading(false); }
  }, [statusF, cohortF, duesF, toast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = useMemo(() => orders.filter(o => {
    if (fromF && new Date(o.createdAt) < new Date(fromF)) return false;
    if (toF && new Date(o.createdAt) > new Date(`${toF}T23:59:59`)) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return orderName(o).toLowerCase().includes(q)
      || orderPhone(o).toLowerCase().includes(q)
      || orderEmail(o).toLowerCase().includes(q)
      || o.id.toLowerCase().includes(q);
  }), [orders, search, fromF, toF]);

  async function updateStatus(id: string, status: string) {
    try {
      await api(`/admin/orders/${id}/status`, { method: 'POST', body: { status } });
      toast('تم تحديث الحالة');
      fetchOrders();
    } catch (e: any) { toast(e.message, 'err'); }
  }

  async function recordPayment() {
    if (!paying) return;
    try {
      await api(`/admin/orders/${paying.id}/payment`, { method: 'POST', body: { seq: paying.seq, method: payMethod, reference: payRef } });
      toast('سُجّلت الدفعة');
      setPaying(null); setPayRef('');
      fetchOrders();
    } catch (e: any) { toast(e.message, 'err'); }
  }

  async function resendEmail(id: string) {
    setBusy(id);
    try {
      await api(`/admin/orders/${id}/resend-email`, { method: 'POST' });
      toast('أُرسل البريد ✅');
    } catch (e: any) { toast(e.message, 'err'); }
    finally { setBusy(null); }
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedOrders = filtered.filter(o => selected.has(o.id));

  return (
    <>
      <TableCard
        title={<>الطلبات <span className="num" style={{ color: 'var(--t4)', fontSize: 13 }}>({filtered.length})</span></>}
        loading={loading}
        empty={!loading && filtered.length === 0 && 'لا توجد طلبات مطابقة'}
        actions={<>
          <input className="ka-search" placeholder="بحث بالاسم أو الهاتف أو البريد…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="ka-inline-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="">كلّ الحالات</option>
            {Object.entries(ORDER_STATUS).filter(([k]) => k !== 'overbooked').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="ka-inline-select" value={cohortF} onChange={e => setCohortF(e.target.value)}>
            <option value="">كلّ الدفعات</option>
            {ALL_COHORTS.map(c => <option key={c.id} value={c.id}>#{c.id} — {c.course}</option>)}
          </select>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--t3)', cursor: 'pointer' }}>
            <input type="checkbox" checked={duesF} onChange={e => setDuesF(e.target.checked)} style={{ accentColor: 'var(--violetbtn)' }} /> مستحقّات فقط
          </label>
          <input className="ka-inline-select" type="date" value={fromF} onChange={e => setFromF(e.target.value)} title="من تاريخ" />
          <input className="ka-inline-select" type="date" value={toF} onChange={e => setToF(e.target.value)} title="إلى تاريخ" />
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={fetchOrders}><RefreshCw size={13} /> تحديث</button>
          {selected.size > 0 && (
            <button className="ka-btn ka-btn--gold ka-btn--sm" onClick={() => setBulkOpen(true)}>
              💬 رسالة جماعية ({selected.size})
            </button>
          )}
        </>}
      >
        <table>
          <thead><tr>
            <th style={{ width: 34 }} />
            <th>رقم الطلب</th><th>الطالب</th><th>الدورة</th><th>الدفعة</th><th>الحالة</th><th>المتبقّي</th><th>التاريخ</th><th />
          </tr></thead>
          <tbody>
            {filtered.map(o => {
              const st = ORDER_STATUS[o.status] ?? { label: o.status, tone: 'gray' as const };
              const isOpen = expanded === o.id;
              return (
                <FragmentRow key={o.id}
                  o={o} st={st} isOpen={isOpen} isAdmin={isAdmin}
                  checked={selected.has(o.id)} onCheck={() => toggleSelect(o.id)}
                  onToggle={() => setExpanded(isOpen ? null : o.id)}
                  onStatus={s => updateStatus(o.id, s)}
                  onPay={seq => setPaying({ id: o.id, seq })}
                  onResend={() => resendEmail(o.id)} busy={busy === o.id}
                  waOpen={waOpen === o.id} onWa={() => setWaOpen(waOpen === o.id ? null : o.id)}
                />
              );
            })}
          </tbody>
        </table>
      </TableCard>

      {/* Record payment modal */}
      {paying && (
        <Modal title="تسجيل دفعة يدوية" onClose={() => setPaying(null)} width={400}>
          <Field label="وسيلة الدفع">
            <select value={payMethod} onChange={e => setPayMethod(e.target.value as any)}>
              <option value="cash">نقداً</option>
              <option value="bank_transfer">تحويل بنكي</option>
            </select>
          </Field>
          <Field label="رقم المرجع (اختياري)">
            <input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="رقم التحويل أو الإيصال" />
          </Field>
          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={recordPayment}>تأكيد</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setPaying(null)}>إلغاء</button>
          </div>
        </Modal>
      )}

      {/* Bulk WhatsApp modal */}
      {bulkOpen && (
        <Modal title="رسالة واتساب جماعية" sub="اكتبي الرسالة — {الاسم} تُستبدَل باسم كل طالب، ثم افتحي المحادثات واحدة واحدة." onClose={() => setBulkOpen(false)}>
          <Field label="نصّ الرسالة">
            <textarea rows={5} value={bulkText} onChange={e => setBulkText(e.target.value)} />
          </Field>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
            {selectedOrders.map(o => {
              const text = bulkText.replaceAll('{الاسم}', o.firstName ?? o.customer?.firstName ?? '');
              return (
                <a key={o.id} href={waLink(orderPhone(o), text)} target="_blank" rel="noopener noreferrer"
                  className="ka-btn ka-btn--ghost ka-btn--sm" style={{ justifyContent: 'space-between', textDecoration: 'none' }}>
                  <span>{orderName(o)}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--t4)', direction: 'ltr' }}>{orderPhone(o)}</span>
                </a>
              );
            })}
          </div>
        </Modal>
      )}
    </>
  );
}

// ── Row + expandable panel ─────────────────────────────────
function FragmentRow({ o, st, isOpen, isAdmin, checked, onCheck, onToggle, onStatus, onPay, onResend, busy, waOpen, onWa }: {
  o: Order; st: { label: string; tone: any }; isOpen: boolean; isAdmin: boolean;
  checked: boolean; onCheck: () => void; onToggle: () => void;
  onStatus: (s: string) => void; onPay: (seq: 1 | 2 | 3) => void;
  onResend: () => void; busy: boolean; waOpen: boolean; onWa: () => void;
}) {
  const email = o.email ?? o.customer?.email ?? '';
  const templates = waTemplates(o);
  return (
    <>
      <tr className="clickable" onClick={onToggle}>
        <td onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={checked} onChange={onCheck} style={{ accentColor: 'var(--violetbtn)' }} />
        </td>
        <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{o.id}</td>
        <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{orderName(o) || '—'}</td>
        <td>{COURSE_NAMES[o.courseSlug] ?? o.courseSlug} · {o.mode === 'onsite' ? 'حضوري' : 'مباشر'}</td>
        <td className="num">#{o.cohortId}</td>
        <td><StatusBadge tone={st.tone}>{st.label}</StatusBadge></td>
        <td>{(o.remainingJOD ?? 0) > 0 ? <span style={{ color: '#F0918A', fontWeight: 700 }}><span className="num">{o.remainingJOD}</span> د.أ</span> : '—'}</td>
        <td>{fmtDate(o.createdAt)}</td>
        <td>{isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</td>
      </tr>
      {isOpen && (
        <tr><td colSpan={9} style={{ padding: 0 }}>
          <div className="ka-expand-panel">
            <div className="ka-detail-grid">
              <div><div className="dl">الهاتف</div><div className="dv num" style={{ direction: 'ltr', textAlign: 'right' }}>{orderPhone(o) || '—'}</div></div>
              <div><div className="dl">البريد</div><div className="dv" style={{ direction: 'ltr', textAlign: 'right' }}>{email || '—'}</div></div>
              <div><div className="dl">الدولة</div><div className="dv">{o.country ?? o.customer?.country ?? '—'}</div></div>
              <div><div className="dl">الإجمالي</div><div className="dv num">{o.mode === 'live' ? `$${o.totalUSD}` : `${o.totalJOD} د.أ`}</div></div>
              <div><div className="dl">المدفوع</div><div className="dv num">{o.mode === 'live' ? `$${o.totalUSD}` : `${o.paidJOD} د.أ`}</div></div>
              {o.discountCode && <div><div className="dl">كود الخصم</div><div className="dv num">{o.discountCode}</div></div>}
            </div>

            {/* Installments timeline */}
            {(o.installments?.length ?? 0) > 1 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t3)', marginBottom: 8 }}>الدفعات</div>
                {o.installments.map(inst => (
                  <div key={inst.seq} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, fontSize: 13, flexWrap: 'wrap' }}>
                    <span className="num" style={{ fontWeight: 700 }}>#{inst.seq}</span>
                    <span className="num" style={{ color: 'var(--t3)' }}>{inst.amountJOD} د.أ</span>
                    <span style={{ color: 'var(--t4)' }}>{inst.method === 'stripe' ? 'Stripe' : inst.method === 'cash' ? 'نقداً' : 'تحويل'}</span>
                    {inst.paidAt
                      ? <span style={{ color: '#6FD79B', fontWeight: 700 }}>✓ {fmtDate(inst.paidAt)}</span>
                      : <span style={{ color: 'var(--gold)' }}>معلّقة</span>}
                    {!inst.paidAt && inst.amountJOD > 0 && isAdmin && (
                      <button className="ka-btn ka-btn--violet ka-btn--sm" style={{ marginInlineStart: 'auto' }} onClick={() => onPay(inst.seq)}>سجّل الدفع</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {isAdmin && (
                <select className="ka-inline-select" value={o.status} onChange={e => onStatus(e.target.value)}>
                  {['deposit_paid', 'partially_paid', 'completed', 'refunded', 'cancelled'].map(s => (
                    <option key={s} value={s}>{ORDER_STATUS[s]?.label ?? s}</option>
                  ))}
                </select>
              )}
              <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={onWa}>💬 رسائل واتساب</button>
              {isAdmin && email && (
                <button className="ka-btn ka-btn--ghost ka-btn--sm" disabled={busy} onClick={onResend}>
                  📧 {busy ? 'جارٍ الإرسال…' : 'إعادة إرسال البريد'}
                </button>
              )}
            </div>
            {waOpen && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {templates.map(t => (
                  <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" className="ka-btn ka-btn--ghost ka-btn--sm" style={{ textDecoration: 'none', color: '#6FD79B' }}>
                    {t.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </td></tr>
      )}
    </>
  );
}
