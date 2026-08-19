/** Section 4 — الدفعات والمقاعد. Staff can view; only admin toggles is_open. */
import { useEffect, useState } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { api, COURSE_NAMES, ORDER_STATUS, fmtDate } from '../api';
import { Modal, StatusBadge, useToast } from '../components';
import { useAdminAuth } from '../context';
import { currentCohorts } from '@/data/currentCohorts';
import type { CohortSeat, Order } from '@workspace/admin-types';

// Current cohort metadata lives in the roster imported from the latest schedule.
interface CohortMeta { id: number; course: string; mode: string; start_ar: string; days: string; time_ar: string }

const ALL_COHORTS = currentCohorts as CohortMeta[];

export default function Cohorts() {
  const { user } = useAdminAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();
  const [seats, setSeats] = useState<CohortSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const [cohortOrders, setCohortOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api<{ seats: CohortSeat[] }>('/admin/cohorts')
      .then(d => setSeats(d.seats))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function toggleOpen(cohortId: number, isOpen: boolean) {
    try {
      await api(`/admin/cohorts/${cohortId}/seats`, { method: 'POST', body: { isOpen } });
      setSeats(prev => prev.map(s => s.cohortId === cohortId ? { ...s, isOpen } : s));
      toast(isOpen ? 'فُتح التسجيل' : 'أُغلق التسجيل');
    } catch (e: any) { toast(e.message, 'err'); }
  }

  async function showOrders(cohortId: number) {
    setOpen(cohortId);
    setOrdersLoading(true);
    try {
      const d = await api<{ orders: Order[] }>(`/admin/orders?cohortId=${cohortId}`);
      setCohortOrders(d.orders);
    } catch (e: any) { toast(e.message, 'err'); }
    finally { setOrdersLoading(false); }
  }

  const meta = (id: number) => ALL_COHORTS.find(c => c.id === id);
  const openMeta = open != null ? meta(open) : null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
      </div>
      {loading ? <div className="ka-empty">جارٍ التحميل…</div> : (
        <div className="ka-grid-cards">
          {seats.map(s => {
            const m = meta(s.cohortId);
            const remaining = s.capacity - s.enrolled;
            return (
              <div key={s.cohortId} className="ka-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
                    {m?.course ?? `دفعة #${s.cohortId}`}
                    <span className="num" style={{ color: 'var(--t4)', fontSize: 12, marginInlineStart: 6 }}>#{s.cohortId}</span>
                  </h3>
                  <StatusBadge tone={s.isOpen ? 'green' : 'gray'}>{s.isOpen ? 'مفتوح' : 'مغلق'}</StatusBadge>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--t3)', display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                  <span>{m ? `${m.mode === 'onsite' ? 'حضوري' : 'مباشر'} · ${m.start_ar}` : '—'}</span>
                  {m?.days && <span>{m.days} · {m.time_ar}</span>}
                  <span>
                    السعة <b className="num" style={{ color: 'var(--t1)' }}>{s.capacity}</b> ·
                    المسجّلون <b className="num" style={{ color: 'var(--t1)' }}> {s.enrolled}</b> ·
                    المتبقّي <b className="num" style={{ color: remaining <= 2 ? 'var(--gold)' : '#6FD79B' }}> {remaining}</b>
                  </span>
                  <span className="ka-usage-bar" style={{ width: '100%' }}>
                    <i style={{ width: `${Math.min(100, Math.round((s.enrolled / Math.max(s.capacity, 1)) * 100))}%`, background: remaining <= 0 ? 'var(--red)' : undefined }} />
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={() => showOrders(s.cohortId)}>
                    <Users size={13} /> الطلاب
                  </button>
                  {isAdmin && (
                    <button className={`ka-toggle-btn${s.isOpen ? ' is-on' : ''}`} onClick={() => toggleOpen(s.cohortId, !s.isOpen)}>
                      {s.isOpen ? '✓ التسجيل مفتوح' : 'فتح التسجيل'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {seats.length === 0 && <div className="ka-empty">لا توجد دفعات</div>}
        </div>
      )}

      {open != null && (
        <Modal title={`طلاب الدفعة #${open}${openMeta ? ` — ${openMeta.course}` : ''}`} onClose={() => setOpen(null)} width={640}>
          {ordersLoading ? <div className="ka-empty">جارٍ التحميل…</div>
            : cohortOrders.length === 0 ? <div className="ka-empty">لا طلبات في هذه الدفعة</div>
            : (
              <div className="ka-table-wrap">
                <table>
                  <thead><tr><th>الطالب</th><th>الهاتف</th><th>الحالة</th><th>المتبقّي</th><th>التاريخ</th></tr></thead>
                  <tbody>
                    {cohortOrders.map(o => {
                      const st = ORDER_STATUS[o.status] ?? { label: o.status, tone: 'gray' as const };
                      const name = `${o.firstName ?? o.customer?.firstName ?? ''} ${o.lastName ?? o.customer?.lastName ?? ''}`.trim();
                      return (
                        <tr key={o.id}>
                          <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{name || '—'}</td>
                          <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{o.phone ?? o.customer?.phone ?? '—'}</td>
                          <td><StatusBadge tone={st.tone}>{st.label}</StatusBadge></td>
                          <td className="num">{(o.remainingJOD ?? 0) > 0 ? `${o.remainingJOD} د.أ` : '—'}</td>
                          <td>{fmtDate(o.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </Modal>
      )}
    </>
  );
}
