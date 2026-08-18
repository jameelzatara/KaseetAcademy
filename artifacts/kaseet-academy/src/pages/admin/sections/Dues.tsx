/** Section 3 — المستحقّات. Admin only. */
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, COURSE_NAMES, waLink, fmtDate } from '../api';
import { TableCard, useToast } from '../components';
import type { DueRow } from '@workspace/admin-types';

export default function Dues() {
  const toast = useToast();
  const [rows, setRows] = useState<DueRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api<{ dues: DueRow[] }>('/admin/dues')
      .then(d => setRows(d.dues))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const totalDue = rows.reduce((s, r) => s + Number(r.remaining_jod), 0);

  return (
    <TableCard
      title={<>المستحقّات <span className="num" style={{ color: 'var(--gold)', fontSize: 13 }}>{totalDue.toLocaleString('ar-JO')} د.أ</span></>}
      loading={loading}
      empty={!loading && rows.length === 0 && 'لا مستحقّات — جميع الطلبات مسدَّدة 🎉'}
      actions={<button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>}
    >
      <table>
        <thead><tr>
          <th>الطالب</th><th>الهاتف</th><th>الدورة</th><th>الإجمالي</th><th>المدفوع</th><th>المتبقّي</th><th>الاستحقاق القادم</th><th />
        </tr></thead>
        <tbody>
          {rows.map(r => {
            const name = `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim() || '—';
            const overdue = r.next_due_at && new Date(r.next_due_at).getTime() < Date.now();
            const waText = `أهلاً ${r.first_name ?? ''}،\nنذكّركم بأنّ لديكم دفعة متبقّية بقيمة ${r.remaining_jod} دينار أردني لطلب رقم ${r.id}.\nنرجو ترتيب الدفع في أقرب وقت ممكن. شكراً!`;
            return (
              <tr key={r.id}>
                <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{name}<div className="num" style={{ fontSize: 10.5, color: 'var(--t4)', direction: 'ltr', textAlign: 'right' }}>{r.id}</div></td>
                <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{r.phone ?? '—'}</td>
                <td>{COURSE_NAMES[r.course_slug] ?? r.course_slug} <span className="num" style={{ color: 'var(--t4)' }}>#{r.cohort_id}</span></td>
                <td className="num">{r.total_jod} د.أ</td>
                <td className="num" style={{ color: '#6FD79B' }}>{r.paid_jod} د.أ</td>
                <td className="num" style={{ color: 'var(--gold)', fontWeight: 700 }}>{r.remaining_jod} د.أ</td>
                <td style={overdue ? { color: '#F0918A', fontWeight: 700 } : undefined}>{fmtDate(r.next_due_at)}{overdue ? ' ⚠️' : ''}</td>
                <td>
                  {r.phone && (
                    <a href={waLink(r.phone, waText)} target="_blank" rel="noopener noreferrer" className="ka-btn ka-btn--ghost ka-btn--sm" style={{ textDecoration: 'none', color: '#6FD79B' }}>
                      💬 تذكير
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
