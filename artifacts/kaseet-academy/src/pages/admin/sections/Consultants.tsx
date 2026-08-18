/** Section 8 — المستشارون. Admin sees all + CRUD; consultant sees own stats only. */
import { useEffect, useState } from 'react';
import { Plus, Pencil, RefreshCw } from 'lucide-react';
import { api, COURSE_NAMES } from '../api';
import { Modal, Field, StatusBadge, KpiCard, TableCard, useToast } from '../components';
import { useAdminAuth } from '../context';

interface Perf {
  id: number; name: string; isActive: boolean;
  ordersAll: number; orders30d: number; revenueJOD: number;
  conversionRate: number | null; topCourse: string | null;
}
interface Account { id: number; name: string; email: string; isActive: boolean }

const emptyForm = { name: '', email: '', password: '', isActive: true };

export default function Consultants() {
  const { user } = useAdminAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();
  const [rows, setRows] = useState<Perf[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'new' } | { mode: 'edit'; row: Account } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    const jobs: Promise<any>[] = [
      api<{ performance: Perf[] }>('/admin/consultants/performance').then(d => setRows(d.performance)),
    ];
    if (isAdmin) jobs.push(api<{ consultants: Account[] }>('/admin/consultants').then(d => setAccounts(d.consultants)).catch(() => {}));
    Promise.all(jobs).catch(e => toast(e.message, 'err')).finally(() => setLoading(false));
  };
  useEffect(load, [isAdmin]);

  async function save() {
    if (!form.name.trim() || !form.email.trim()) { setErr('الاسم والبريد مطلوبان'); return; }
    if (modal?.mode === 'new' && !form.password) { setErr('كلمة المرور مطلوبة'); return; }
    try {
      if (modal?.mode === 'new') {
        await api('/admin/consultants', { method: 'POST', body: { name: form.name.trim(), email: form.email.trim(), password: form.password } });
        toast('أُضيفت المستشارة');
      } else if (modal?.mode === 'edit') {
        const body: any = { name: form.name.trim(), email: form.email.trim(), isActive: form.isActive };
        if (form.password) body.password = form.password;
        await api(`/admin/consultants/${modal.row.id}`, { method: 'PUT', body });
        toast('حُدّثت البيانات');
      }
      setModal(null);
      load();
    } catch (e: any) { setErr(e.message); }
  }

  // Consultant self-view: KPI cards for their own performance
  if (!isAdmin) {
    const me = rows.find(r => r.id === user?.id) ?? rows[0];
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
        </div>
        <div className="ka-kpis">
          <KpiCard label="طلبات عبر إحالاتك" value={me ? String(me.ordersAll) : '—'} sub={me ? `${me.orders30d} في آخر 30 يوماً` : undefined} loading={loading} />
          <KpiCard label="إيرادات إحالاتك" gold value={me ? `${me.revenueJOD.toLocaleString('ar-JO')} د.أ` : '—'} loading={loading} />
          <KpiCard label="نسبة التحويل" value={me?.conversionRate != null ? `${me.conversionRate}%` : '—'} loading={loading} />
          <KpiCard label="أكثر دورة إحالةً" value={me?.topCourse ? (COURSE_NAMES[me.topCourse] ?? me.topCourse) : '—'} loading={loading} />
        </div>
      </>
    );
  }

  const email = (id: number) => accounts.find(a => a.id === id)?.email ?? '—';

  return (
    <>
      <TableCard
        title="أداء المستشارين"
        loading={loading}
        empty={!loading && rows.length === 0 && 'لا مستشارين بعد'}
        actions={<>
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
          <button className="ka-btn ka-btn--violet ka-btn--sm" onClick={() => { setForm(emptyForm); setErr(''); setModal({ mode: 'new' }); }}><Plus size={14} /> مستشارة جديدة</button>
        </>}
      >
        <table>
          <thead><tr>
            <th>الاسم</th><th>البريد</th><th>الطلبات المُحالة</th><th>آخر 30 يوماً</th><th>الإيرادات</th><th>نسبة التحويل</th><th>أكثر دورة</th><th>الحالة</th><th />
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{r.name}</td>
                <td style={{ direction: 'ltr', textAlign: 'right' }}>{email(r.id)}</td>
                <td className="num">{r.ordersAll}</td>
                <td className="num">{r.orders30d}</td>
                <td className="num" style={{ color: '#6FD79B', fontWeight: 700 }}>{r.revenueJOD.toLocaleString('ar-JO')} د.أ</td>
                <td className="num">{r.conversionRate != null ? `${r.conversionRate}%` : '—'}</td>
                <td>{r.topCourse ? (COURSE_NAMES[r.topCourse] ?? r.topCourse) : '—'}</td>
                <td><StatusBadge tone={r.isActive ? 'green' : 'gray'}>{r.isActive ? 'فعّالة' : 'معطَّلة'}</StatusBadge></td>
                <td>
                  <button className="ka-icon-btn" title="تعديل" onClick={() => {
                    const acct = accounts.find(a => a.id === r.id);
                    setForm({ name: r.name, email: acct?.email ?? '', password: '', isActive: r.isActive });
                    setErr('');
                    setModal({ mode: 'edit', row: acct ?? { id: r.id, name: r.name, email: '', isActive: r.isActive } });
                  }}><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal title={modal.mode === 'new' ? 'مستشارة جديدة' : `تعديل: ${modal.mode === 'edit' ? modal.row.name : ''}`} onClose={() => setModal(null)} width={440}>
          {err && <div className="ka-form-err">{err}</div>}
          <Field label="الاسم"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="البريد الإلكتروني"><input type="email" dir="ltr" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
          <Field label={modal.mode === 'new' ? 'كلمة المرور' : 'كلمة مرور جديدة (اتركيها فارغة للإبقاء)'}>
            <input type="password" dir="ltr" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </Field>
          {modal.mode === 'edit' && (
            <div className="ka-checkbox-row">
              <input type="checkbox" id="cActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
              <label htmlFor="cActive">الحساب فعّال (يمكنها تسجيل الدخول)</label>
            </div>
          )}
          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={save}>✓ حفظ</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setModal(null)}>إلغاء</button>
          </div>
        </Modal>
      )}
    </>
  );
}
