/** Section 9 — التقييمات الصوتية («سمّعنا صوتك»). Staff. */
import { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { api, waLink, fmtDate } from '../api';
import { Modal, Field, TableCard, useToast } from '../components';
import type { VoiceEvaluation } from '@workspace/admin-types';

const STATUS: Record<string, string> = {
  pending: 'بانتظار المراجعة', reviewed: 'رُوجع', accepted: 'مقبول ✓', rejected: 'مرفوض',
};

const emptyForm = { name: '', phone: '', audioRef: '', reviewer: '', notes: '' };

export default function VoiceEvals() {
  const toast = useToast();
  const [rows, setRows] = useState<VoiceEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    api<{ evaluations: VoiceEvaluation[] }>('/admin/voice-evaluations')
      .then(d => setRows(d.evaluations))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function create() {
    if (!form.name.trim() || !form.phone.trim()) { setErr('الاسم والهاتف مطلوبان'); return; }
    try {
      await api('/admin/voice-evaluations', {
        method: 'POST',
        body: {
          name: form.name.trim(), phone: form.phone.trim(),
          audioRef: form.audioRef.trim() || undefined,
          reviewer: form.reviewer.trim() || undefined,
          notes: form.notes.trim() || undefined,
        },
      });
      toast('أُضيف الطلب');
      setModal(false); setForm(emptyForm); setErr('');
      load();
    } catch (e: any) { setErr(e.message); }
  }

  async function update(id: number, patch: Partial<VoiceEvaluation>) {
    try {
      await api(`/admin/voice-evaluations/${id}`, { method: 'PUT', body: patch });
      setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
    } catch (e: any) { toast(e.message, 'err'); }
  }

  return (
    <>
      <TableCard
        title="التقييمات الصوتية"
        loading={loading}
        empty={!loading && rows.length === 0 && 'لا طلبات تقييم بعد'}
        actions={<>
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
          <button className="ka-btn ka-btn--violet ka-btn--sm" onClick={() => { setForm(emptyForm); setErr(''); setModal(true); }}><Plus size={14} /> طلب جديد</button>
        </>}
      >
        <table>
          <thead><tr><th>الاسم</th><th>الهاتف</th><th>التسجيل</th><th>الحالة</th><th>المُراجِعة</th><th>ملاحظات</th><th>تاريخ الإرسال</th><th /></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{r.name}</td>
                <td className="num" style={{ direction: 'ltr', textAlign: 'right' }}>{r.phone}</td>
                <td>
                  {r.audioRef
                    ? (/^https?:\/\//.test(r.audioRef)
                        ? <a href={r.audioRef} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--violet)' }}>🎧 استماع</a>
                        : <span className="num" style={{ fontSize: 11.5, color: 'var(--t4)' }}>{r.audioRef}</span>)
                    : '—'}
                </td>
                <td>
                  <select className="ka-inline-select" value={r.status} onChange={e => update(r.id, { status: e.target.value as any })}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </td>
                <td>
                  <input className="ka-inline-input" style={{ minWidth: 100 }} defaultValue={r.reviewer ?? ''} placeholder="المُراجِعة…"
                    onBlur={e => { if (e.target.value !== (r.reviewer ?? '')) update(r.id, { reviewer: e.target.value }); }} />
                </td>
                <td>
                  <input className="ka-inline-input" defaultValue={r.notes ?? ''} placeholder="ملاحظة…"
                    onBlur={e => { if (e.target.value !== (r.notes ?? '')) update(r.id, { notes: e.target.value }); }} />
                </td>
                <td>{fmtDate(r.submittedAt)}</td>
                <td>
                  <a href={waLink(r.phone, `أهلاً ${r.name} 👋\nبخصوص طلب التقييم الصوتي في أكاديمية قصيت —`)} target="_blank" rel="noopener noreferrer"
                    className="ka-btn ka-btn--ghost ka-btn--sm" style={{ textDecoration: 'none', color: '#6FD79B' }}>💬</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal title="طلب تقييم صوتي جديد" onClose={() => setModal(false)} width={440}>
          {err && <div className="ka-form-err">{err}</div>}
          <Field label="الاسم"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="الهاتف (مع رمز الدولة)"><input dir="ltr" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+9627XXXXXXXX" /></Field>
          <Field label="رابط أو مرجع التسجيل الصوتي"><input dir="ltr" value={form.audioRef} onChange={e => setForm(f => ({ ...f, audioRef: e.target.value }))} placeholder="https://…" /></Field>
          <Field label="المُراجِعة"><input value={form.reviewer} onChange={e => setForm(f => ({ ...f, reviewer: e.target.value }))} /></Field>
          <Field label="ملاحظات"><textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></Field>
          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={create}>✓ إضافة</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setModal(false)}>إلغاء</button>
          </div>
        </Modal>
      )}
    </>
  );
}
