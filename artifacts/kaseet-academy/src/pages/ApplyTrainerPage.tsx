// ── Apply — Trainer Page ──────────────────────────────────────
import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import { CheckCircle, GraduationCap, ChevronDown, Home, ArrowLeft } from 'lucide-react';
import { GOLD, OFF, F, FP, INNER } from './shared/coursePageHelpers';

const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const CARD = 'rgba(255,255,255,0.04)';
const CBR  = 'rgba(255,255,255,0.08)';
const GS   = 'rgba(255,193,7,0.09)';
const GL   = 'rgba(255,193,7,0.26)';

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
  fontFamily: F, fontSize: 14.5, color: OFF, direction: 'rtl',
  background: 'rgba(255,255,255,0.05)', border: `1px solid ${CBR}`,
  borderRadius: 10, padding: '12px 16px', outline: 'none',
  transition: 'border-color 0.2s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  width: '100%',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  paddingLeft: 40,
  cursor: 'pointer',
  background: 'rgba(16,25,34,0.98)',
  color: OFF,
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
    } catch { /* show success anyway */ }
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520, position: 'relative', zIndex: 3 }}>
            <CheckCircle size={52} color={GOLD} style={{ marginBottom: 20 }} />
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,36px)', color: OFF, margin: '0 0 16px' }}>
              شكراً! وصل طلبك بنجاح 🎓
            </h1>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, lineHeight: 1.85, margin: '0 0 32px' }}>
              سيراجع فريقنا ملفّك ويتواصل معك خلال ٣–٥ أيام عمل لتحديد خطوات الانضمام.
            </p>
            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: F, fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 12,
              background: GS, border: `1px solid ${GL}`,
              color: GOLD, textDecoration: 'none',
            }}>
              <ArrowLeft size={14} /> العودة إلى الرئيسية
            </a>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .tr-hero-grid { grid-template-columns: 1fr !important; }
          .tr-hero-vis  { display: none !important; }
          .tr-form-2col { grid-template-columns: 1fr !important; }
        }
        .tr-input:focus  { border-color: rgba(255,193,7,0.55) !important; }
        .tr-select:focus { border-color: rgba(255,193,7,0.55) !important; outline: none; }
        .tr-select option { background: #101922; color: #fff; }
        .tr-chip-btn:hover { border-color: rgba(255,193,7,0.35) !important; }
        :focus-visible { outline: 2px solid #FFC107 !important; outline-offset: 3px !important; border-radius: 4px !important; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section className="sec sec--hero" style={{ padding: '0 0 80px' }}>
        <div style={INNER}>

          {/* breadcrumb */}
          <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 96, marginBottom: 32 }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 12.5, color: MUT, textDecoration: 'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: 11 }}>/</span>
            <span style={{ fontFamily: F, fontSize: 12.5, color: GOLD }}>التسجيل كمدرب</span>
          </nav>

          <div className="tr-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.12fr 0.88fr', gap: 52, alignItems: 'center', position: 'relative', zIndex: 3 }}>

            {/* text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GOLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999, marginBottom: 20 }}>
                <GraduationCap size={12} strokeWidth={2.2} /> تقديم مدرب
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.22, letterSpacing: -1.2, margin: '0 0 0', color: OFF }}>
                انضم إلى فريق{' '}<br />
                <span style={{ color: GOLD }}>مدربي كاسيت</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 520, marginTop: 16, lineHeight: 1.85 }}>
                نبحث عن مدربين ذوي خبرة وشغف حقيقي بتطوير المواهب الصوتية والإعلامية. أخبرنا عنك وسنتواصل معك.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
                {[
                  '٧ تخصصات متاحة',
                  'بيئة تدريب احترافية',
                  'استوديو كاسيت المجهّز',
                  'رد خلال ٣–٥ أيام',
                ].map(txt => (
                  <span key={txt} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: `1px solid ${CBR}`, padding: '9px 14px', borderRadius: 10, fontFamily: F, fontSize: 13, color: LT }}>
                    {txt}
                  </span>
                ))}
              </div>
            </div>

            {/* visual — trainer stats card matching MasarSoti hero-shot style */}
            <div className="tr-hero-vis" style={{ position: 'relative', maxWidth: 380, marginInline: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: `radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.18), transparent 68%)`, filter: 'blur(8px)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1, borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, boxShadow: '0 34px 90px rgba(0,0,0,.55)', background: 'rgba(16,25,34,0.80)', backdropFilter: 'blur(12px)' }}>
                {/* header strip */}
                <div style={{ padding: '22px 22px 18px', borderBottom: `1px solid ${CBR}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                    <GraduationCap size={20} color={GOLD} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>مدرب كاسيت أكاديمي</div>
                    <div style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>شريك في بناء الأجيال الصوتية</div>
                  </div>
                </div>

                {/* spec rows */}
                <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'التعليق الصوتي', active: true },
                    { label: 'الإعلام والتقديم التلفزيوني', active: false },
                    { label: 'الخطابة والتواصل العام', active: true },
                    { label: 'البودكاست والمحتوى الرقمي', active: false },
                    { label: 'اللغة العربية والنطق', active: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: 9,
                      background: item.active ? 'rgba(255,193,7,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${item.active ? GL : CBR}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ fontFamily: F, fontSize: 13, color: item.active ? GOLD : LT, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
                      {item.active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>

                {/* footer stat */}
                <div style={{ margin: '0 22px 22px', padding: '14px', background: GS, border: `1px solid ${GL}`, borderRadius: 12, textAlign: 'center' }}>
                  <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 28, color: GOLD, lineHeight: 1 }}>+٣٠</span>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 4 }}>طالب لكل مدرب سنوياً</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Form sections ── */}
      <section className="sec sec--faq" style={{ padding: '0 0 96px' }}>
        <div style={{ ...INNER, position: 'relative', zIndex: 3, maxWidth: 760 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ١ — Personal */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>١</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>المعلومات الشخصية</h2>
              </div>
              <div className="tr-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="الاسم الكامل" required>
                  <input className="tr-input" value={form.fullName} onChange={e => set('fullName', e.target.value)}
                    required placeholder="اسمك الكامل" style={inputStyle} />
                </Field>
                <Field label="المدينة" required>
                  <input className="tr-input" value={form.city} onChange={e => set('city', e.target.value)}
                    required placeholder="عمّان..." style={inputStyle} />
                </Field>
                <Field label="رقم الهاتف (واتساب)" required>
                  <input className="tr-input" value={form.phone} onChange={e => set('phone', e.target.value)}
                    required type="tel" placeholder="+962 7X XXX XXXX"
                    style={{ ...inputStyle, direction: 'ltr' }} />
                </Field>
                <Field label="البريد الإلكتروني" required>
                  <input className="tr-input" value={form.email} onChange={e => set('email', e.target.value)}
                    required type="email" placeholder="your@email.com"
                    style={{ ...inputStyle, direction: 'ltr' }} />
                </Field>
              </div>
            </div>

            {/* ٢ — Expertise */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٢</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>الخبرة والتخصص</h2>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, margin: '0 0 14px 40px' }}>اختر مجالات تخصصك (يمكن اختيار أكثر من واحد)</p>
              <div className="tr-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 16 }}>
                {SPEC_OPTIONS.map(s => {
                  const active = form.specializations.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => toggle('specializations', s)} className="tr-chip-btn" style={{
                      fontFamily: F, fontWeight: 700, fontSize: 13, padding: '11px 12px',
                      borderRadius: 9, cursor: 'pointer', textAlign: 'right',
                      background: active ? 'rgba(255,193,7,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(255,193,7,0.45)' : CBR}`,
                      color: active ? GOLD : LT, transition: 'all 0.18s',
                    }}>{s}</button>
                  );
                })}
              </div>
              <div className="tr-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="سنوات الخبرة" required>
                  <input className="tr-input" value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}
                    required type="number" min="1" max="40" placeholder="مثال: 5" style={inputStyle} />
                </Field>
              </div>
              <div style={{ marginTop: 14 }}>
                <Field label="أبرز أعمالك أو محطاتك المهنية">
                  <textarea className="tr-input" value={form.notableWork} onChange={e => set('notableWork', e.target.value)}
                    rows={3} placeholder="محطات تلفزيونية، إذاعية، حملات إعلانية..."
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }} />
                </Field>
              </div>
            </div>

            {/* ٣ — Links */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٣</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>الروابط والملف المهني</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="رابط ملف الأعمال أو الموقع الشخصي">
                  <input className="tr-input" value={form.portfolio} onChange={e => set('portfolio', e.target.value)}
                    type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }} />
                </Field>
                <Field label="رابط يوتيوب / إنستغرام / لينكدإن">
                  <input className="tr-input" value={form.social} onChange={e => set('social', e.target.value)}
                    type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }} />
                </Field>
              </div>
            </div>

            {/* ٤ — Availability */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٤</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>التوفر وطريقة التدريس</h2>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, margin: '0 0 14px 40px' }}>أوقات توفّرك للتدريس</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                {AVAIL_OPTIONS.map(a => {
                  const active = form.availability.includes(a);
                  return (
                    <button key={a} type="button" onClick={() => toggle('availability', a)} className="tr-chip-btn" style={{
                      fontFamily: F, fontWeight: 700, fontSize: 13, padding: '9px 16px',
                      borderRadius: 9, cursor: 'pointer',
                      background: active ? 'rgba(74,130,196,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(74,130,196,0.45)' : CBR}`,
                      color: active ? '#93c5fd' : LT, transition: 'all 0.18s',
                    }}>{a}</button>
                  );
                })}
              </div>
              <Field label="طريقة التدريس المفضّلة" required>
                <div style={{ position: 'relative' }}>
                  <select className="tr-select" value={form.teachingFormat} onChange={e => set('teachingFormat', e.target.value)}
                    required style={selectStyle}>
                    <option value="">اختر...</option>
                    {FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={16} color="rgba(255,255,255,.40)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </Field>
            </div>

            {/* ٥ — Why Kaseet */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٥</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>لماذا كاسيت؟</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="لماذا تريد الانضمام لفريق مدربي كاسيت أكاديمي؟" required>
                  <textarea className="tr-input" value={form.whyKaseet} onChange={e => set('whyKaseet', e.target.value)}
                    required rows={4} placeholder="أخبرنا عن رؤيتك ودوافعك..."
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }} />
                </Field>
                <Field label="ملاحظات إضافية (اختياري)">
                  <textarea className="tr-input" value={form.notes} onChange={e => set('notes', e.target.value)}
                    rows={3} placeholder="أي شيء آخر تودّ إضافته..."
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }} />
                </Field>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              fontFamily: F, fontWeight: 800, fontSize: 16,
              padding: '16px 32px', borderRadius: 14,
              background: loading ? 'rgba(255,193,7,0.50)' : GOLD,
              border: 'none', color: '#18202F',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: loading ? 'none' : '0 4px 20px rgba(255,193,7,0.28)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'جاري الإرسال...' : 'إرسال طلب الانضمام 🎓'}
            </button>

            <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(203,213,225,0.40)', textAlign: 'center', margin: 0 }}>
              بالإرسال توافق على{' '}
              <a href="/terms" style={{ color: 'rgba(255,193,7,0.65)', textDecoration: 'none' }}>الشروط والأحكام</a>
              {' '}و{' '}
              <a href="/privacy-policy" style={{ color: 'rgba(255,193,7,0.65)', textDecoration: 'none' }}>سياسة الخصوصية</a>
            </p>

          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
