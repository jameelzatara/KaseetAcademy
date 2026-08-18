/** Section 5 — إدارة الدورات. Staff create/edit (prices admin-only); admin deletes. */
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { Modal, Field, StatusBadge, ConfirmDialog, useToast } from '../components';
import { useAdminAuth } from '../context';

interface Course {
  id: number; slug: string; nameAr: string; level: 'beginner' | 'advanced'; status: 'active' | 'draft' | 'archived';
  onsiteEnabled: boolean; onsitePriceJOD: number | null; onsiteHours: number | null; onsiteSessions: number | null; onsiteCapacity: number | null;
  liveEnabled: boolean; livePriceUSD: number | null; liveHours: number | null; liveSessions: number | null; liveCapacity: number | null;
}

// Arabic → latin slug (matches the prototype's approach)
function slugify(nameAr: string): string {
  const map: Record<string, string> = {
    'أ': 'a', 'إ': 'i', 'آ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'th',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
    'ي': 'y', 'ة': 'a', 'ى': 'a', 'ء': '', ' ': '-',
  };
  let out = 'voiceover-';
  const stripped = nameAr.replace(/\(.*?\)/g, '').trim();
  for (const ch of stripped) out += map[ch] !== undefined ? map[ch] : /[a-z0-9-]/i.test(ch) ? ch.toLowerCase() : '';
  return out.replace(/-+/g, '-').replace(/-$/, '').slice(0, 40);
}

interface FormState {
  slug: string; nameAr: string; advanced: boolean;
  onsiteEnabled: boolean; onsiteHours: string; onsiteSessions: string; onsitePrice: string; capacity: string;
  liveEnabled: boolean; liveHours: string; liveSessions: string; livePrice: string;
}
const emptyForm: FormState = {
  slug: '', nameAr: '', advanced: false,
  onsiteEnabled: false, onsiteHours: '', onsiteSessions: '', onsitePrice: '', capacity: '',
  liveEnabled: false, liveHours: '', liveSessions: '', livePrice: '',
};

export default function Courses() {
  const { user } = useAdminAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'new' } | { mode: 'edit'; course: Course } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [err, setErr] = useState('');
  const [deleting, setDeleting] = useState<Course | null>(null);

  const load = () => {
    setLoading(true);
    api<{ courses: Course[] }>('/admin/courses')
      .then(d => setCourses(d.courses))
      .catch(e => toast(e.message, 'err'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  function openNew() {
    setForm(emptyForm); setErr('');
    setModal({ mode: 'new' });
  }
  function openEdit(c: Course) {
    setForm({
      slug: c.slug, nameAr: c.nameAr, advanced: c.level === 'advanced',
      onsiteEnabled: c.onsiteEnabled, onsiteHours: c.onsiteHours?.toString() ?? '', onsiteSessions: c.onsiteSessions?.toString() ?? '',
      onsitePrice: c.onsitePriceJOD?.toString() ?? '', capacity: (c.onsiteCapacity ?? c.liveCapacity)?.toString() ?? '',
      liveEnabled: c.liveEnabled, liveHours: c.liveHours?.toString() ?? '', liveSessions: c.liveSessions?.toString() ?? '',
      livePrice: c.livePriceUSD?.toString() ?? '',
    });
    setErr('');
    setModal({ mode: 'edit', course: c });
  }

  const num = (s: string) => (s.trim() === '' ? null : Number(s));

  // Auto-activate rule: at least one enabled mode with hours + price complete
  function computeStatus(f: FormState): 'active' | 'draft' {
    const onsiteOk = f.onsiteEnabled && f.onsiteHours && f.onsitePrice;
    const liveOk = f.liveEnabled && f.liveHours && f.livePrice;
    return onsiteOk || liveOk ? 'active' : 'draft';
  }

  async function save() {
    if (!form.nameAr.trim()) { setErr('اسم الدورة مطلوب'); return; }
    const body: Record<string, unknown> = {
      nameAr: form.nameAr.trim(),
      level: form.advanced ? 'advanced' : 'beginner',
      status: computeStatus(form),
      onsiteEnabled: form.onsiteEnabled,
      onsiteHours: num(form.onsiteHours), onsiteSessions: num(form.onsiteSessions),
      onsiteCapacity: num(form.capacity),
      liveEnabled: form.liveEnabled,
      liveHours: num(form.liveHours), liveSessions: num(form.liveSessions),
      liveCapacity: num(form.capacity),
    };
    // Prices: admin-only (create & edit) — consultants omit price fields entirely
    if (isAdmin) {
      body.onsitePriceJOD = num(form.onsitePrice);
      body.livePriceUSD = num(form.livePrice);
    }
    try {
      if (modal?.mode === 'new') {
        await api('/admin/courses', { method: 'POST', body: { slug: form.slug || slugify(form.nameAr), ...body } });
        toast('حُفظت الدورة');
      } else if (modal?.mode === 'edit') {
        await api(`/admin/courses/${modal.course.slug}`, { method: 'PUT', body });
        toast('حُدّثت الدورة');
      }
      setModal(null);
      load();
    } catch (e: any) { setErr(e.message); }
  }

  async function toggleStatus(c: Course) {
    const next = c.status === 'active' ? 'draft' : 'active';
    if (next === 'active') {
      const onsiteOk = c.onsiteEnabled && c.onsiteHours && c.onsitePriceJOD;
      const liveOk = c.liveEnabled && c.liveHours && c.livePriceUSD;
      if (!onsiteOk && !liveOk) { toast('أكملي بيانات نمط واحد على الأقل (ساعات وسعر) قبل التفعيل', 'err'); return; }
    }
    try {
      await api(`/admin/courses/${c.slug}`, { method: 'PUT', body: { status: next } });
      setCourses(prev => prev.map(x => x.slug === c.slug ? { ...x, status: next } : x));
      toast(next === 'active' ? 'فُعّلت الدورة' : 'حُفظت كمسوَّدة');
    } catch (e: any) { toast(e.message, 'err'); }
  }

  async function doDelete() {
    if (!deleting) return;
    try {
      await api(`/admin/courses/${deleting.slug}`, { method: 'DELETE' });
      toast('حُذفت الدورة');
      setDeleting(null);
      load();
    } catch (e: any) { toast(e.message, 'err'); setDeleting(null); }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <button className="ka-btn ka-btn--ghost ka-btn--sm" onClick={load}><RefreshCw size={13} /> تحديث</button>
        <button className="ka-btn ka-btn--violet" onClick={openNew}><Plus size={15} /> دورة جديدة</button>
      </div>
      {loading ? <div className="ka-empty">جارٍ التحميل…</div> : (
        <div className="ka-grid-cards">
          {courses.map(c => (
            <div key={c.slug} className={`ka-card${c.level === 'advanced' ? ' is-advanced' : ''}${c.status !== 'active' ? ' is-draft' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, lineHeight: 1.4 }}>{c.nameAr}</h3>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <StatusBadge tone={c.status === 'active' ? 'green' : 'gray'}>{c.status === 'active' ? 'فعّالة' : c.status === 'archived' ? 'مؤرشفة' : 'مسوَّدة'}</StatusBadge>
                <StatusBadge tone={c.level === 'advanced' ? 'violet' : 'gold'}>{c.level === 'advanced' ? 'متقدّم' : 'مبتدئ'}</StatusBadge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13, color: 'var(--t3)', marginBottom: 16 }}>
                <span>حضوري: {c.onsiteEnabled
                  ? <b style={{ color: 'var(--t1)' }}><span className="num">{c.onsiteHours ?? '؟'}</span> ساعة · <span className="num">{c.onsiteSessions ?? '؟'}</span> جلسات · <span className="num">{c.onsitePriceJOD ?? '؟'}</span> د.أ</b>
                  : <i style={{ color: 'var(--t4)' }}>غير متاح</i>}</span>
                <span>مباشر: {c.liveEnabled
                  ? <b style={{ color: 'var(--t1)' }}><span className="num">{c.liveHours ?? '؟'}</span> ساعة · <span className="num">{c.liveSessions ?? '؟'}</span> جلسات · <span className="num">${c.livePriceUSD ?? '؟'}</span></b>
                  : <i style={{ color: 'var(--t4)' }}>غير متاح</i>}</span>
                <span>السعة: <b className="num" style={{ color: 'var(--t1)' }}>{c.onsiteCapacity ?? c.liveCapacity ?? '—'}</b></span>
                <span className="num" style={{ fontSize: 11, color: 'var(--t4)', direction: 'ltr', textAlign: 'right' }}>/{c.slug}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`ka-toggle-btn${c.status === 'active' ? ' is-on' : ''}`} onClick={() => toggleStatus(c)}>
                  {c.status === 'active' ? '✓ فعّالة' : 'تفعيل'}
                </button>
                <button className="ka-icon-btn" title="تعديل" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                {isAdmin && <button className="ka-icon-btn" title="حذف" onClick={() => setDeleting(c)}><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
          <button className="ka-add-card" onClick={openNew}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(107,91,168,.16)', display: 'grid', placeContent: 'center' }}><Plus size={20} /></span>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>دورة جديدة</span>
          </button>
        </div>
      )}

      {modal && (
        <Modal
          title={modal.mode === 'new' ? 'دورة جديدة' : `تعديل: ${modal.mode === 'edit' ? modal.course.nameAr : ''}`}
          sub="املئي الحقول التسويقية فقط — الاسم التقني والرابط يتولّاهما النظام تلقائياً."
          onClose={() => setModal(null)}
        >
          {err && <div className="ka-form-err">{err}</div>}
          <Field label="اسم الدورة بالعربية *">
            <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
              placeholder="مثال: التعليق الصوتي للإعلانات (مستوى متقدم)" disabled={modal.mode === 'edit'} />
          </Field>
          {modal.mode === 'new' && form.nameAr && (
            <div className="num" style={{ fontSize: 11.5, color: 'var(--t4)', margin: '-8px 0 12px', direction: 'ltr', textAlign: 'left' }}>/{form.slug || slugify(form.nameAr)}</div>
          )}
          <div className="ka-checkbox-row">
            <input type="checkbox" id="cAdvanced" checked={form.advanced} onChange={e => setForm(f => ({ ...f, advanced: e.target.checked }))} />
            <label htmlFor="cAdvanced">هذه دورة من المستوى المتقدّم (لون بنفسجي مميَّز تلقائياً)</label>
          </div>

          <div className="ka-mode-section">
            <h4>النمط الحضوري <StatusBadge tone="gold">اختياري</StatusBadge></h4>
            <div className="ka-checkbox-row">
              <input type="checkbox" id="onsiteEnabled" checked={form.onsiteEnabled} onChange={e => setForm(f => ({ ...f, onsiteEnabled: e.target.checked }))} />
              <label htmlFor="onsiteEnabled">هذه الدورة تُقدَّم حضورياً</label>
            </div>
            {form.onsiteEnabled && <>
              <div className="ka-grid2">
                <Field label="الساعات"><input type="number" value={form.onsiteHours} onChange={e => setForm(f => ({ ...f, onsiteHours: e.target.value }))} placeholder="16" /></Field>
                <Field label="عدد الجلسات"><input type="number" value={form.onsiteSessions} onChange={e => setForm(f => ({ ...f, onsiteSessions: e.target.value }))} placeholder="8" /></Field>
              </div>
              <Field label="السعر (دينار أردني)" hint={!isAdmin ? 'تحديد السعر للمدير فقط' : undefined}>
                <input type="number" value={form.onsitePrice} onChange={e => setForm(f => ({ ...f, onsitePrice: e.target.value }))} placeholder="250"
                  disabled={!isAdmin} />
              </Field>
            </>}
          </div>

          <div className="ka-mode-section">
            <h4>النمط المباشر التفاعلي <StatusBadge tone="gold">اختياري</StatusBadge></h4>
            <div className="ka-checkbox-row">
              <input type="checkbox" id="liveEnabled" checked={form.liveEnabled} onChange={e => setForm(f => ({ ...f, liveEnabled: e.target.checked }))} />
              <label htmlFor="liveEnabled">هذه الدورة تُقدَّم مباشرةً تفاعلياً (أونلاين)</label>
            </div>
            {form.liveEnabled && <>
              <div className="ka-grid2">
                <Field label="الساعات"><input type="number" value={form.liveHours} onChange={e => setForm(f => ({ ...f, liveHours: e.target.value }))} placeholder="16" /></Field>
                <Field label="عدد الجلسات"><input type="number" value={form.liveSessions} onChange={e => setForm(f => ({ ...f, liveSessions: e.target.value }))} placeholder="8" /></Field>
              </div>
              <Field label="السعر (دولار أمريكي)" hint={!isAdmin ? 'تحديد السعر للمدير فقط' : undefined}>
                <input type="number" value={form.livePrice} onChange={e => setForm(f => ({ ...f, livePrice: e.target.value }))} placeholder="250"
                  disabled={!isAdmin} />
              </Field>
            </>}
          </div>

          <Field label="السعة القصوى للدفعة الواحدة">
            <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="13" />
          </Field>

          <div className="ka-hint-box">
            <span>⚠️</span>
            <span>
              {computeStatus(form) === 'active'
                ? <>الدورة ستُحفَظ <b>فعّالة</b> — نمط واحد على الأقل مكتمل الساعات والسعر.</>
                : <>الدورة ستُحفَظ كـ<b>مسوَّدة</b> ولن تظهر على الموقع حتى تُفعَّل — يلزم نمط واحد على الأقلّ بساعاته وسعره كاملَين.</>}
            </span>
          </div>

          <div className="ka-form-actions">
            <button className="ka-btn ka-btn--violet" style={{ flex: 1, justifyContent: 'center' }} onClick={save}>✓ حفظ الدورة</button>
            <button className="ka-btn ka-btn--ghost" onClick={() => setModal(null)}>إلغاء</button>
          </div>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف الدورة"
          message={`سيتم حذف «${deleting.nameAr}» نهائياً. لا يمكن التراجع عن هذا الإجراء.`}
          confirmLabel="حذف نهائي" danger
          onConfirm={doDelete} onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
