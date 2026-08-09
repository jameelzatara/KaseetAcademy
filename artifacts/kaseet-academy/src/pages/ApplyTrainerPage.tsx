// ── Apply — Trainer Page ──────────────────────────────────────
import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import BackButton from '@/components/BackButton';
import { CheckCircle, GraduationCap, ChevronDown } from 'lucide-react';

const F    = 'Tajawal, sans-serif';
const GOLD = '#FFC107';
const CARD = 'rgba(255,255,255,0.03)';
const LINE = 'rgba(255,255,255,0.08)';

type FormData = {
  fullName: string; email: string; phone: string; city: string;
  specializations: string[]; yearsExp: string; notableWork: string;
  portfolio: string; social: string;
  availability: string[]; teachingFormat: string;
  whyKaseet: string; notes: string;
};

const INITIAL: FormData = {
  fullName: '', email: '', phone: '', city: '',
  specializations: [], yearsExp: '', notableWork: '',
  portfolio: '', social: '',
  availability: [], teachingFormat: '',
  whyKaseet: '', notes: '',
};

const SPEC_OPTIONS   = ['التعليق الصوتي', 'الإعلام والتقديم التلفزيوني', 'الخطابة والتواصل العام', 'التمثيل الصوتي', 'البودكاست والمحتوى الرقمي', 'اللغة العربية والنطق', 'أخرى'];
const AVAIL_OPTIONS  = ['أيام الأسبوع (السبت–الأربعاء)', 'الخميس', 'الجمعة', 'عطل نهاية الأسبوع', 'مساءً فقط'];
const FORMAT_OPTIONS = ['حضوري في الاستوديو', 'مباشر تفاعلي (Online LIVE)', 'كلاهما'];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'rgba(255,255,255,0.82)' }}>
        {label}{required && <span style={{ color: GOLD, marginRight: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: F, fontSize: 14.5, color: '#fff', direction: 'rtl',
  background: 'rgba(255,255,255,0.06)', border: `1px solid ${LINE}`,
  borderRadius: 10, padding: '12px 16px', outline: 'none',
  transition: 'border-color 0.2s',
};

export default function ApplyTrainerPage() {
  const [form, setForm]           = useState<FormData>(INITIAL);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  const set = (k: keyof FormData, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const toggle = (k: 'specializations' | 'availability', v: string) => {
    setForm(prev => ({
      ...prev,
      [k]: (prev[k] as string[]).includes(v)
        ? (prev[k] as string[]).filter(x => x !== v)
        : [...(prev[k] as string[]), v],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !form.specializations.length) return;
    setLoading(true);
    try {
      await fetch('/api/apply/trainer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch { /* API not yet connected */ }
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <BackButton />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <CheckCircle size={56} color={GOLD} style={{ marginBottom: 20 }}/>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,36px)', color: '#fff', margin: '0 0 16px' }}>
              شكراً! وصل طلبك بنجاح 🎓
            </h1>
            <p style={{ fontFamily: F, fontSize: 15.5, color: 'rgba(203,213,225,0.72)', lineHeight: 1.85, margin: '0 0 32px' }}>
              سيراجع فريقنا ملفّك ويتواصل معك خلال ٣–٥ أيام عمل لتحديد خطوات الانضمام.
            </p>
            <a href="/" style={{
              display: 'inline-block', fontFamily: F, fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 12,
              background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.36)',
              color: GOLD, textDecoration: 'none',
            }}>العودة إلى الرئيسية</a>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: '#fff' }}>
      <BackButton />

      {/* Hero */}
      <div style={{ background: 'rgba(0,0,0,0.30)', borderBottom: '1px solid rgba(255,193,7,0.12)', padding: '120px 24px 52px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <GraduationCap size={22} color={GOLD}/>
            <span style={{
              padding: '4px 14px', borderRadius: 999,
              background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
              color: GOLD, fontSize: 12.5, fontFamily: F, fontWeight: 700,
            }}>تقديم مدرب</span>
          </div>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,38px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            انضم إلى فريق مدربي كاسيت
          </h1>
          <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(203,213,225,0.68)', margin: 0, lineHeight: 1.75 }}>
            نبحث عن مدربين ذوي خبرة وشغف حقيقي بتطوير المواهب الصوتية والإعلامية. أخبرنا عنك.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '52px 24px 80px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Section 1: Personal */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 20px' }}>١. المعلومات الشخصية</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="الاسم الكامل" required>
                <input value={form.fullName} onChange={e => set('fullName', e.target.value)}
                  required placeholder="اسمك الكامل" style={inputStyle}/>
              </Field>
              <Field label="المدينة" required>
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  required placeholder="عمّان..." style={inputStyle}/>
              </Field>
              <Field label="رقم الهاتف (واتساب)" required>
                <input value={form.phone} onChange={e => set('phone', e.target.value)}
                  required type="tel" placeholder="+962 7X XXX XXXX"
                  style={{ ...inputStyle, direction: 'ltr' }}/>
              </Field>
              <Field label="البريد الإلكتروني" required>
                <input value={form.email} onChange={e => set('email', e.target.value)}
                  required type="email" placeholder="your@email.com"
                  style={{ ...inputStyle, direction: 'ltr' }}/>
              </Field>
            </div>
          </section>

          {/* Section 2: Expertise */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 8px' }}>٢. الخبرة والتخصص</h2>
            <p style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(203,213,225,0.55)', margin: '0 0 16px' }}>اختر مجالات تخصصك (يمكن اختيار أكثر من واحد)</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 18 }}>
              {SPEC_OPTIONS.map(s => {
                const active = form.specializations.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggle('specializations', s)}
                    style={{
                      fontFamily: F, fontWeight: 700, fontSize: 13, padding: '11px 12px',
                      borderRadius: 9, cursor: 'pointer', textAlign: 'right',
                      background: active ? 'rgba(255,193,7,0.14)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(255,193,7,0.45)' : 'rgba(255,255,255,0.09)'}`,
                      color: active ? GOLD : 'rgba(255,255,255,0.72)', transition: 'all 0.18s',
                    }}
                  >{s}</button>
                );
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="سنوات الخبرة" required>
                <input value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}
                  required type="number" min="1" max="40" placeholder="مثال: 5" style={inputStyle}/>
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="أبرز أعمالك أو محطاتك المهنية">
                <textarea value={form.notableWork} onChange={e => set('notableWork', e.target.value)}
                  rows={3} placeholder="محطات تلفزيونية، إذاعية، حملات إعلانية..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }}/>
              </Field>
            </div>
          </section>

          {/* Section 3: Links */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 20px' }}>٣. الروابط والملف المهني</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="رابط ملف الأعمال أو الموقع الشخصي">
                <input value={form.portfolio} onChange={e => set('portfolio', e.target.value)}
                  type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }}/>
              </Field>
              <Field label="رابط يوتيوب / إنستغرام / لينكدإن">
                <input value={form.social} onChange={e => set('social', e.target.value)}
                  type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }}/>
              </Field>
            </div>
          </section>

          {/* Section 4: Availability */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 8px' }}>٤. التوفر وطريقة التدريس</h2>
            <p style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(203,213,225,0.55)', margin: '0 0 14px' }}>أوقات توفّرك للتدريس</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {AVAIL_OPTIONS.map(a => {
                const active = form.availability.includes(a);
                return (
                  <button key={a} type="button" onClick={() => toggle('availability', a)}
                    style={{
                      fontFamily: F, fontWeight: 700, fontSize: 13, padding: '9px 14px',
                      borderRadius: 9, cursor: 'pointer',
                      background: active ? 'rgba(74,130,196,0.14)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(74,130,196,0.45)' : 'rgba(255,255,255,0.09)'}`,
                      color: active ? '#93c5fd' : 'rgba(255,255,255,0.72)', transition: 'all 0.18s',
                    }}
                  >{a}</button>
                );
              })}
            </div>
            <Field label="طريقة التدريس المفضّلة" required>
              <div style={{ position: 'relative' }}>
                <select value={form.teachingFormat} onChange={e => set('teachingFormat', e.target.value)}
                  required style={{ ...inputStyle, width: '100%', appearance: 'none', paddingLeft: 40, cursor: 'pointer' }}>
                  <option value="">اختر...</option>
                  {FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={16} color="rgba(255,255,255,0.40)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
              </div>
            </Field>
          </section>

          {/* Section 5: Why Kaseet */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '28px 26px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 20px' }}>٥. لماذا كاسيت؟</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="لماذا تريد الانضمام لفريق مدربي كاسيت أكاديمي؟" required>
                <textarea value={form.whyKaseet} onChange={e => set('whyKaseet', e.target.value)}
                  required rows={4} placeholder="أخبرنا عن رؤيتك ودوافعك..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }}/>
              </Field>
              <Field label="ملاحظات إضافية (اختياري)">
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                  rows={3} placeholder="أي شيء آخر تودّ إضافته..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }}/>
              </Field>
            </div>
          </section>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              fontFamily: F, fontWeight: 800, fontSize: 16,
              padding: '16px 32px', borderRadius: 14,
              background: loading ? 'rgba(255,193,7,0.50)' : GOLD,
              border: 'none', color: '#18202F', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
              boxShadow: '0 4px 20px rgba(255,193,7,0.28)',
            }}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب الانضمام 🎓'}
          </button>

          <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(203,213,225,0.40)', textAlign: 'center', margin: 0 }}>
            بالإرسال توافق على{' '}
            <a href="/terms" style={{ color: 'rgba(255,193,7,0.65)', textDecoration: 'none' }}>الشروط والأحكام</a>
            {' '}و{' '}
            <a href="/privacy-policy" style={{ color: 'rgba(255,193,7,0.65)', textDecoration: 'none' }}>سياسة الخصوصية</a>
          </p>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
