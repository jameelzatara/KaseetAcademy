/** Section 7 — المشتركون. Admin only. */
import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, COURSE_NAMES, ORDER_STATUS, fmtDate } from '../api';
import { Modal, StatusBadge, TableCard, useToast } from '../components';

interface Subscriber {
  email: string | null; firstName: string | null; lastName: string | null;
  phone: string | null; country: string | null; courses: string[];
  orderCount: number; totalPaidJOD: number; lastOrderAt: string;
}
interface HistOrder { id: string; course_slug: string; mode: string; plan: string; total_jod: number; paid_jod: number; remaining_jod: number; status: string; created_at: string }

export default function Subscribers() {
  const toast = useToast();
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<Subscriber | null>(null);
  const [hist, setHist] = useState<HistOrder[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api<{ subscribers: Subscriber[] }>('/admin/subscribers')
      .then(d => setSubs(d.subscribers))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => subs.filter(s => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return `${s.firstName ?? ''} ${s.lastName ?? ''}`.toLowerCase().includes(q)
      || (s.email ?? '').toLowerCase().includes(q)
      || (s.phone ?? '').includes(q);
  }), [subs, search]);

  async function openHistory(s: Subscriber) {
    setOpen(s);
    setHistLoading(true);
    try {
      const qs = s.email ? `email=${encodeURIComponent(s.email)}` : `phone=${encodeURIComponent(s.phone ?? '')}`;
      const d = await api<{ orders: HistOrder[] }>(`/admin/subscribers/orders?${qs}`);
      setHist(d.orders);
    } catch (e: any) { toast(e.message, 'err'); }
    finally { setHistLoading(false); }
  }

  return (
    <>
      <TableCard
        title={<>المشتركون <span className="num" style={{ color: 'var(--t4)', fontSize: 13 }}>({filtered.length})</span></>}
        loading={loading}
        empty={!loading && filtered.length === 0 && 'لا مشتركين مطابقين'}
        actions={<>
          <input className="ka-search" placeholder="بحث بالاسم أو البريد أو الهاتف…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
        </>}
      >
        <table>
          <thead><tr>
            <th>الاسم</th><th>البريد</th><th>الهاتف</th><th>الدولة</th><th>الدورات</th><th>الطلبات</th><th>إجمالي المدفوع</th><th>آخر طلب</th>
          </tr></thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} className="clickable" onClick={() => openHistory(s)}>
                <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{`${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || '—'}</td>
                <td style={{ direction: 'ltr', textAlign: 'right' }}>{s.email ?? '—'}</td>
                <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{s.phone ?? '—'}</td>
                <td>{s.country ?? '—'}</td>
                <td><span className="ka-pills">{s.courses.map(c => <span key={c} className="ka-pill">{COURSE_NAMES[c] ?? c}</span>)}</span></td>
                <td className="num">{s.orderCount}</td>
                <td className="num" style={{ color: '#6FD79B', fontWeight: 700 }}>{s.totalPaidJOD.toLocaleString('ar-JO')} د.أ</td>
                <td>{fmtDate(s.lastOrderAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {open && (
        <Modal title={`سجلّ ${`${open.firstName ?? ''} ${open.lastName ?? ''}`.trim() || 'المشترك'}`} onClose={() => setOpen(null)} width={640}>
          {histLoading ? <div className="ka-empty">جارٍ التحميل…</div>
            : hist.length === 0 ? <div className="ka-empty">لا طلبات</div>
            : (
              <div className="ka-table-wrap">
                <table>
                  <thead><tr><th>الطلب</th><th>الدورة</th><th>الخطة</th><th>المدفوع</th><th>المتبقّي</th><th>الحالة</th><th>التاريخ</th></tr></thead>
                  <tbody>
                    {hist.map(o => {
                      const st = ORDER_STATUS[o.status] ?? { label: o.status, tone: 'gray' as const };
                      return (
                        <tr key={o.id}>
                          <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{o.id}</td>
                          <td>{COURSE_NAMES[o.course_slug] ?? o.course_slug}</td>
                          <td>{o.plan === 'full' ? 'كاملة' : 'عربون'}</td>
                          <td className="num">{o.paid_jod} د.أ</td>
                          <td className="num">{Number(o.remaining_jod) > 0 ? `${o.remaining_jod} د.أ` : '—'}</td>
                          <td><StatusBadge tone={st.tone}>{st.label}</StatusBadge></td>
                          <td>{fmtDate(o.created_at)}</td>
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
