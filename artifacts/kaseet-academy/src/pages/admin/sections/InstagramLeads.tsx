/** Section 10 — عملاء إنستغرام (تحليلات الحملات). Admin only. */
import { useEffect, useState } from 'react';
import { Plus, Pencil, RefreshCw } from 'lucide-react';
import { api, fmtDate } from '../api';
import { Modal, Field, TableCard, useToast } from '../components';

interface Campaign {
  id: number; campaignName: string; carouselRef: string | null; keywords: string | null;
  leadCount: number; conversionCount: number; notes: string | null;
  campaignDate: string | null; createdAt: string;
}

const emptyForm = { campaignName: '', carouselRef: '', keywords: '', leadCount: '', conversionCount: '', campaignDate: '', notes: '' };

export default function InstagramLeads() {
  const toast = useToast();
  const [rows, setRows] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'new' } | { mode: 'edit'; row: Campaign } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    api<{ leads: Campaign[] }>('/admin/instagram-leads')
      .then(d => setRows(d.leads))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  function openEdit(r: Campaign) {
    setForm({
      campaignName: r.campaignName, carouselRef: r.carouselRef ?? '', keywords: r.keywords ?? '',
      leadCount: String(r.leadCount), conversionCount: String(r.conversionCount),
      campaignDate: r.campaignDate ?? '', notes: r.notes ?? '',
    });
    setErr('');
    setModal({ mode: 'edit', row: r });
  }

  async function save() {
    if (!form.campaignName.trim()) { setErr('اسم الحملة مطلوب'); return; }
    const body = {
      campaignName: form.campaignName.trim(),
      carouselRef: form.carouselRef.trim() || null,
      keywords: form.keywords.trim() || null,
      leadCount: form.leadCount ? Number(form.leadCount) : 0,
      conversionCount: form.conversionCount ? Number(form.conversionCount) : 0,
      campaignDate: form.campaignDate || null,
      notes: form.notes.trim() || null,
    };
    try {
      if (modal?.mode === 'new') {
        await api('/admin/instagram-leads', { method: 'POST', body });
        toast('أُضيفت الحملة');
      } else if (modal?.mode === 'edit') {
        await api(`/admin/instagram-leads/${modal.row.id}`, { method: 'PUT', body });
        toast('حُدّثت الحملة');
      }
      setModal(null); setErr('');
      load();
    } catch (e: any) { setErr(e.message); }
  }

  const convRate = (r: Campaign) => r.leadCount > 0 ? Math.round((r.conversionCount / r.leadCount) * 100) : null;

  return (
    <>
      <TableCard
        title="حملات إنستغرام"
        loading={loading}
        empty={!loading && rows.length === 0 && 'لا حملات بعد — أضيفي أول حملة'}
        actions={<>
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
          <button className="ka-btn ka-btn--violet ka-btn--sm" onClick={() => { setForm(emptyForm); setErr(''); setModal({ mode: 'new' }); }}><Plus size={14} /> حملة جديدة</button>
        </>}
      >
        <table>
          <thead><tr><th>الحملة</th><th>المنشور</th><th>الكلمات المفتاحية</th><th>العملاء</th><th>التحويلات</th><th>نسبة التحويل</th><th>تاريخ الحملة</th><th>ملاحظات</th><th /></tr></thead>
          <tbody>
            {rows.map(r => {
              const rate = convRate(r);
              return (
                <tr key={r.id}>
                  <td style={{ color: 'var(--t1)', fontWeight: 700 }}>{r.campaignName}</td>
                  <td>
                    {r.carouselRef
                      ? (/^https?:\/\//.test(r.carouselRef)
                          ? <a href={r.carouselRef} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--violet)' }}>عرض المنشور ↗</a>
                          : <span className="num" style={{ fontSize: 11.5, color: 'var(--t4)' }}>{r.carouselRef}</span>)
                      : '—'}
                  </td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.keywords ?? '—'}</td>
                  <td className="num">{r.leadCount}</td>
                  <td className="num" style={{ color: '#6FD79B', fontWeight: 700 }}>{r.conversionCount}</td>
                  <td className="num" style={rate != null && rate >= 20 ? { color: 'var(--gold)', fontWeight: 700 } : undefined}>{rate != null ? `${rate}%` : '—'}</td>
                  <td>{r.campaignDate ? fmtDate(r.campaignDate) : '—'}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.notes ?? '—'}</td>
                  <td><button className="ka-icon-btn" title="تعديل" onClick={() => openEdit(r)}><Pencil size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal title={modal.mode === 'new' ? 'حملة إنستغرام جديدة' : `تعديل: ${modal.mode === 'edit' ? modal.row.campaignName : ''}`} onClose={() => setModal(null)} width={480}>
          {err && <div className="ka-form-err">{err}</div>}
          <Field label="اسم الحملة *"><input value={form.campaignName} onChange={e => setForm(f => ({ ...f, campaignName: e.target.value }))} placeholder="مثال: حملة دورة التعليق — آب" /></Field>
          <Field label="رابط أو مرجع المنشور"><input dir="ltr" value={form.carouselRef} onChange={e => setForm(f => ({ ...f, carouselRef: e.target.value }))} placeholder="https://instagram.com/p/…" /></Field>
          <Field label="الكلمات المفتاحية"><input value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder="تعليق صوتي، دورة، عمّان" /></Field>
          <div className="ka-grid2">
            <Field label="عدد العملاء المحتملين"><input type="number" min={0} value={form.leadCount} onChange={e => setForm(f => ({ ...f, leadCount: e.target.value }))} placeholder="0" /></Field>
            <Field label="عدد التحويلات (اشتراكات)"><input type="number" min={0} value={form.conversionCount} onChange={e => setForm(f => ({ ...f, conversionCount: e.target.value }))} placeholder="0" /></Field>
          </div>
          <Field label="تاريخ الحملة"><input type="date" value={form.campaignDate} onChange={e => setForm(f => ({ ...f, campaignDate: e.target.value }))} /></Field>
          <Field label="ملاحظات"><textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></Field>
          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={save}>✓ حفظ</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setModal(null)}>إلغاء</button>
          </div>
        </Modal>
      )}
    </>
  );
}
