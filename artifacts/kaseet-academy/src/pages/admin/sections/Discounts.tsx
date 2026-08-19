/** Section 6 — أكواد الخصم. Staff create (consultant: bounded policy); admin toggles/deletes any. */
import { useEffect, useState } from 'react';
import { Plus, Trash2, Copy, RefreshCw, Pencil } from 'lucide-react';
import { api, COURSE_NAMES, fmtDate } from '../api';
import { Modal, Field, StatusBadge, UsageBar, ConfirmDialog, TableCard, useToast } from '../components';
import { useAdminAuth } from '../context';
import type { DiscountCode, Course } from '@workspace/admin-types';

type CourseOpt = Pick<Course, 'slug' | 'nameAr'>;

const emptyForm = { code: '', type: 'percent' as 'percent' | 'fixed', value: '', maxUses: '', appliesTo: 'all', expiresAt: '' };

export default function Discounts() {
  const { user } = useAdminAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [courses, setCourses] = useState<CourseOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [err, setErr] = useState('');
  const [deleting, setDeleting] = useState<DiscountCode | null>(null);
  const [editing, setEditing] = useState<DiscountCode | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editErr, setEditErr] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api<{ codes: DiscountCode[] }>('/admin/discount-codes').then(d => setCodes(d.codes)),
      api<{ courses: CourseOpt[] }>('/admin/courses').then(d => setCourses(d.courses)).catch(() => {}),
    ]).catch(e => toast(e.message, 'err')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const canEdit = (c: DiscountCode) => isAdmin || c.createdById === user?.id;

  async function create() {
    if (!form.code.trim() || !form.value) { setErr('الكود والقيمة مطلوبان'); return; }
    try {
      await api('/admin/discount-codes', {
        method: 'POST',
        body: {
          code: form.code.trim().toUpperCase(),
          type: form.type,
          value: Number(form.value),
          appliesTo: form.appliesTo,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        },
      });
      toast('أُنشئ الكود');
      setModal(false); setForm(emptyForm); setErr('');
      load();
    } catch (e: any) { setErr(e.message); }
  }

  async function toggle(c: DiscountCode) {
    try {
      await api(`/admin/discount-codes/${c.id}`, { method: 'PUT', body: { isActive: !c.isActive } });
      setCodes(prev => prev.map(x => x.id === c.id ? { ...x, isActive: !c.isActive } : x));
      toast(c.isActive ? 'عُطّل الكود' : 'فُعّل الكود');
    } catch (e: any) { toast(e.message, 'err'); }
  }

  function openEdit(c: DiscountCode) {
    setEditForm({
      code: c.code,
      type: c.type as 'percent' | 'fixed',
      value: String(Number(c.value)),
      maxUses: c.maxUses != null ? String(c.maxUses) : '',
      appliesTo: c.appliesTo,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '',
    });
    setEditErr('');
    setEditing(c);
  }

  async function saveEdit() {
    if (!editing) return;
    if (!editForm.value) { setEditErr('القيمة مطلوبة'); return; }
    const body: Record<string, unknown> = {
      maxUses: editForm.maxUses ? Number(editForm.maxUses) : null,
      expiresAt: editForm.expiresAt || null,
    };
    // value/type/appliesTo are admin-only server-side — only send them for admins,
    // matching the create form's isAdmin gating.
    if (isAdmin) {
      body.value = Number(editForm.value);
      body.type = editForm.type;
      body.appliesTo = editForm.appliesTo;
    }
    try {
      await api(`/admin/discount-codes/${editing.id}`, { method: 'PUT', body });
      toast('حُدّث الكود');
      setEditing(null);
      load();
    } catch (e: any) { setEditErr(e.message); }
  }

  async function doDelete() {
    if (!deleting) return;
    try {
      await api(`/admin/discount-codes/${deleting.id}`, { method: 'DELETE' });
      toast('حُذف الكود');
      setDeleting(null);
      load();
    } catch (e: any) { toast(e.message, 'err'); setDeleting(null); }
  }

  function copyCode(code: string) {
    navigator.clipboard?.writeText(code).then(() => toast(`نُسخ: ${code}`)).catch(() => {});
  }

  const expired = (c: DiscountCode) => c.expiresAt != null && new Date(c.expiresAt).getTime() < Date.now();

  return (
    <>
      <TableCard
        title="أكواد الخصم"
        loading={loading}
        empty={!loading && codes.length === 0 && 'لا أكواد بعد — أنشئي أول كود'}
        actions={<>
          <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
          <button className="ka-btn ka-btn--violet ka-btn--sm" onClick={() => { setForm(emptyForm); setErr(''); setModal(true); }}><Plus size={14} /> كود جديد</button>
        </>}
      >
        <table>
          <thead><tr>
            <th>الكود</th><th>النوع</th><th>القيمة</th><th>ينطبق على</th><th>الاستخدام</th><th>الانتهاء</th><th>أنشأته</th><th>الحالة</th><th />
          </tr></thead>
          <tbody>
            {codes.map(c => (
              <tr key={c.id}>
                <td><button className="ka-code-chip" onClick={() => copyCode(c.code)} title="نسخ"><Copy size={12} /> {c.code}</button></td>
                <td>{c.type === 'percent' ? 'نسبة %' : 'مبلغ ثابت'}</td>
                <td className="num">{c.type === 'percent' ? `${Number(c.value)}%` : `${Number(c.value)} د.أ`}</td>
                <td>{c.appliesTo === 'all' ? 'كلّ الدورات' : (COURSE_NAMES[c.appliesTo] ?? courses.find(x => x.slug === c.appliesTo)?.nameAr ?? c.appliesTo)}</td>
                <td><UsageBar used={c.usedCount} max={c.maxUses} /></td>
                <td>{expired(c) ? <StatusBadge tone="red">منتهي · {fmtDate(c.expiresAt)}</StatusBadge> : fmtDate(c.expiresAt)}</td>
                <td>{c.createdBy}</td>
                <td><StatusBadge tone={c.isActive && !expired(c) ? 'green' : 'gray'}>{c.isActive ? (expired(c) ? 'منتهي' : 'فعّال') : 'معطَّل'}</StatusBadge></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {canEdit(c) && (
                      <button className={`ka-toggle-btn${c.isActive ? ' is-on' : ''}`} style={{ padding: '5px 10px', fontSize: 11.5 }} onClick={() => toggle(c)}>
                        {c.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                    )}
                    {canEdit(c) && (
                      <button className="ka-icon-btn" title="تعديل بيانات الكود" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                    )}
                    {isAdmin && c.usedCount === 0 && (
                      <button className="ka-icon-btn" title="حذف" onClick={() => setDeleting(c)}><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal title="كود خصم جديد" sub="الكود يعمل فوراً على صفحة الدفع بمجرّد الحفظ." onClose={() => setModal(false)}>
          {err && <div className="ka-form-err">{err}</div>}
          <div className="ka-grid2">
            <Field label="الكود">
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER25" style={{ textTransform: 'uppercase' }} />
            </Field>
            <Field label="النوع">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                <option value="percent">نسبة مئوية %</option>
                {isAdmin && <option value="fixed">مبلغ ثابت (دينار)</option>}
              </select>
            </Field>
          </div>
          <div className="ka-grid2">
            <Field label="القيمة" hint={!isAdmin ? 'حدّ المستشارة: نسبة حتى 20%' : undefined}>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="20" />
            </Field>
            <Field label="الحدّ الأقصى للاستخدام" hint={!isAdmin ? 'إلزامي حتى 100 استخدام' : 'اتركه فارغاً لعدم التحديد'}>
              <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder={isAdmin ? '∞' : '100'} />
            </Field>
          </div>
          <Field label="ينطبق على الدورات">
            <select value={form.appliesTo} onChange={e => setForm(f => ({ ...f, appliesTo: e.target.value }))}>
              <option value="all">كلّ الدورات</option>
              {courses.map(c => <option key={c.slug} value={c.slug}>{c.nameAr}</option>)}
            </select>
          </Field>
          <Field label="تاريخ الانتهاء">
            <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
          </Field>
          <div className="ka-hint-box">
            <span>⚠️</span>
            <span>يُنشَأ الكود بحالة <b>فعّال</b> تلقائياً. يمكن تعطيله لاحقاً من الجدول — ولا يمكن حذفه إن استُخدم ولو مرّة.</span>
          </div>
          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={create}>✓ إنشاء الكود</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setModal(false)}>إلغاء</button>
          </div>
        </Modal>
      )}

      {editing && (
        <Modal title={`تعديل الكود: ${editing.code}`} sub={editing.usedCount > 0 ? `استُخدم هذا الكود ${editing.usedCount} مرّة — التعديل لا يؤثر على الطلبات السابقة.` : undefined} onClose={() => setEditing(null)}>
          {editErr && <div className="ka-form-err">{editErr}</div>}
          <div className="ka-grid2">
            <Field label="النوع" hint={!isAdmin ? 'تعديل النوع للمدير فقط' : undefined}>
              <select value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value as any }))} disabled={!isAdmin}>
                <option value="percent">نسبة مئوية %</option>
                <option value="fixed">مبلغ ثابت (دينار)</option>
              </select>
            </Field>
            <Field label="القيمة" hint={!isAdmin ? 'تعديل القيمة للمدير فقط' : undefined}>
              <input type="number" value={editForm.value} onChange={e => setEditForm(f => ({ ...f, value: e.target.value }))} disabled={!isAdmin} />
            </Field>
          </div>
          <Field label="الحدّ الأقصى للاستخدام" hint={!isAdmin ? 'حتى 100 استخدام' : 'اتركه فارغاً لعدم التحديد'}>
            <input type="number" value={editForm.maxUses} onChange={e => setEditForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="∞" />
          </Field>
          <Field label="ينطبق على الدورات" hint={!isAdmin ? 'تعديل الدورة للمدير فقط' : undefined}>
            <select value={editForm.appliesTo} onChange={e => setEditForm(f => ({ ...f, appliesTo: e.target.value }))} disabled={!isAdmin}>
              <option value="all">كلّ الدورات</option>
              {courses.map(c => <option key={c.slug} value={c.slug}>{c.nameAr}</option>)}
            </select>
          </Field>
          <Field label="تاريخ الانتهاء">
            <input type="date" value={editForm.expiresAt} onChange={e => setEditForm(f => ({ ...f, expiresAt: e.target.value }))} />
          </Field>
          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={saveEdit}>✓ حفظ التعديلات</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setEditing(null)}>إلغاء</button>
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="حذف الكود" message={`سيتم حذف الكود «${deleting.code}» نهائياً.`} confirmLabel="حذف" danger
          onConfirm={doDelete} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
