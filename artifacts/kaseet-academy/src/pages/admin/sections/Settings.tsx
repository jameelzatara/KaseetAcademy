/** Section 11 — الإعدادات. Admin only: password note + email log with resend. */
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api, fmtDateTime } from '../api';
import { StatusBadge, TableCard, useToast } from '../components';

interface EmailLog {
  id: number; order_id: string | null; to_address: string; subject: string;
  tag: string | null; status: string; error: string | null; sent_at: string;
}

export default function Settings() {
  const toast = useToast();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api<{ logs: EmailLog[] }>('/admin/email-log')
      .then(d => setLogs(d.logs))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function resend(id: number) {
    setBusy(id);
    try {
      await api(`/admin/email-log/${id}/resend`, { method: 'POST' });
      toast('أُعيد الإرسال ✅');
      load();
    } catch (e: any) { toast(e.message, 'err'); }
    finally { setBusy(null); }
  }

  return (
    <>
      <div className="ka-card" style={{ marginBottom: 20, maxWidth: 560 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800 }}>كلمة مرور المدير</h3>
        <p style={{ fontSize: 12.5, color: 'var(--t4)', margin: 0, lineHeight: 1.7 }}>
          كلمة مرور المدير محفوظة كمتغيّر سرّي في بيئة الاستضافة (ADMIN_PASSWORD) ولا تُعدَّل من هنا.
          لتغييرها: حدّثي قيمة السرّ في إعدادات Replit ثم أعيدي تشغيل الخادم.
        </p>
      </div>

      <TableCard
        title="سجلّ البريد الإلكتروني"
        loading={loading}
        empty={!loading && logs.length === 0 && 'لا رسائل بعد'}
        actions={<button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>}
      >
        <table>
          <thead><tr><th>الطلب</th><th>المستلم</th><th>الموضوع</th><th>الحالة</th><th>الخطأ</th><th>الوقت</th><th /></tr></thead>
          <tbody>
            {logs.map(e => (
              <tr key={e.id}>
                <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{e.order_id ?? '—'}</td>
                <td style={{ direction: 'ltr', textAlign: 'right' }}>{e.to_address}</td>
                <td>{e.subject}</td>
                <td><StatusBadge tone={e.status === 'sent' ? 'green' : 'red'}>{e.status === 'sent' ? 'أُرسل' : 'فشل'}</StatusBadge></td>
                <td style={{ color: '#F0918A', fontSize: 11.5, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.error ?? '—'}</td>
                <td>{fmtDateTime(e.sent_at)}</td>
                <td>
                  {e.status !== 'sent' && (
                    <button className="ka-btn ka-btn--ghost ka-btn--sm" disabled={busy === e.id} onClick={() => resend(e.id)}>
                      {busy === e.id ? '…' : '↩ إعادة إرسال'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}
