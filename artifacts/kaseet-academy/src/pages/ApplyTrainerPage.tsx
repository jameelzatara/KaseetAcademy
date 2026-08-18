// ── Apply — Trainer Page ──────────────────────────────────────
import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import { CheckCircle, GraduationCap, ChevronDown, Home, Users, Mic2, BookOpen, Sparkles } from 'lucide-react';

const F    = "'Tajawal', sans-serif";
const FP   = "'Poppins', sans-serif";
const GOLD = '#FFC107';
const OFF  = 'rgba(252,251,251,0.96)';
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
  background: 'rgba(255,255,255,0.06)', border: `1px solid ${CBR}`,
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
  background: 'rgba(13,11,20,0.95)',
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
      <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: OFF, display: 'flex', flexDirection: 'column', fontFamily: F }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={32} color={GOLD} />
            </div>
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
            }}>العودة إلى الرئيسية</a>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: OFF, fontFamily: F, overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 640px) {
          .tr-hero-visual { display: none !important; }
          .tr-form-grid { grid-template-columns: 1fr !important; }
          .tr-spec-grid { grid-template-columns: 1fr !important; }
        }
        .tr-input:focus { border-color: rgba(255,193,7,0.55) !important; }
        .tr-select:focus { border-color: rgba(255,193,7,0.55) !important; outline: none; }
        .tr-select option { background: #0D0B14; color: #fff; }
        :focus-visible { outline: 2px solid #FFC107 !important; outline-offset: 3px !important; border-radius: 4px !important; }
      `}</style>

      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '0 0 72px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

          {/* breadcrumb */}
          <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 96, marginBottom: 36 }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 12.5, color: MUT, textDecoration: 'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: 11 }}>/</span>
            <span style={{ fontFamily: F, fontSize: 12.5, color: GOLD }}>التسجيل كمدرب</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 52, alignItems: 'center' }}>

            {/* text */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GOLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                  <GraduationCap size={12} strokeWidth={2.2} /> للمحترفين والمتخصصين
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(103,232,249,0.08)', border: '1px solid rgba(103,232,249,0.22)', color: '#67e8f9', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                  <Mic2 size={12} strokeWidth={2.2} /> إعلام · صوت · خطابة
                </span>
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.22, letterSpacing: -1, margin: '0 0 16px', color: OFF }}>
                انضم إلى فريق<br />
                <span style={{ color: GOLD }}>مدربي كاسيت</span>
              </h1>
              <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, maxWidth: 520, lineHeight: 1.85, margin: '0 0 28px' }}>
                نبحث عن مدربين ذوي خبرة وشغف حقيقي بتطوير المواهب الصوتية والإعلامية. أخبرنا عنك وسنتواصل معك.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, maxWidth: 480, marginBottom: 28 }}>
                {[
                  { icon: <BookOpen size={13} color={GOLD} strokeWidth={2} />, text: '٧ تخصصات متاحة' },
                  { icon: <Users size={13} color={GOLD} strokeWidth={2} />, text: 'بيئة تدريب احترافية' },
                  { icon: <Sparkles size={13} color={GOLD} strokeWidth={2} />, text: 'استوديو كاسيت المجهّز' },
                  { icon: <GraduationCap size={13} color='#67e8f9' strokeWidth={2} />, text: 'رد خلال ٣–٥ أيام' },
                ].map((item, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${CBR}`, padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT }}>
                    {item.icon} {item.text}
                  </span>
                ))}
              </div>
            </div>

            {/* visual card */}
            <div className="tr-hero-visual" style={{ position: 'relative', maxWidth: 360, marginInline: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,0.18), transparent 68%)', filter: 'blur(8px)', zIndex: -1 }} />
              <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, boxShadow: '0 34px 90px rgba(0,0,0,0.55)', background: 'rgba(255,255,255,0.03)' }}>
                {/* decorative visual */}
                <div style={{ padding: '36px 28px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(255,193,7,0.08)', border: `1px solid ${GL}`, borderRadius: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                      <GraduationCap size={20} color={GOLD} />
                    </div>
                    <div>
                      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: OFF }}>مدرب كاسيت أكاديمي</div>
                      <div style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>شريك في بناء الأجيال الصوتية</div>
                    </div>
                  </div>
                  {[
                    { label: 'التعليق الصوتي', active: true },
                    { label: 'الإعلام والتقديم', active: false },
                    { label: 'الخطابة والتواصل', active: true },
                    { label: 'البودكاست الرقمي', active: false },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.active ? GL : CBR}`, borderRadius: 10 }}>
                      <span style={{ fontFamily: F, fontSize: 13, color: item.active ? GOLD : LT, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
                      {item.active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />}
                    </div>
                  ))}
                  <div style={{ marginTop: 4, padding: '12px 14px', background: 'rgba(255,193,7,0.10)', border: `1px solid ${GL}`, borderRadius: 10, textAlign: 'center' }}>
                    <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 22, color: GOLD }}>٣٠+</span>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>طالب لكل مدرب سنوياً</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <main style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px 80px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ١ — Personal */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>١</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>المعلومات الشخصية</h2>
            </div>
            <div className="tr-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
          </section>

          {/* ٢ — Expertise */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٢</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>الخبرة والتخصص</h2>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: MUT, margin: '0 0 16px 0' }}>اختر مجالات تخصصك (يمكن اختيار أكثر من واحد)</p>
            <div className="tr-spec-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 18 }}>
              {SPEC_OPTIONS.map(s => {
                const active = form.specializations.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggle('specializations', s)} style={{
                    fontFamily: F, fontWeight: 700, fontSize: 13, padding: '11px 12px',
                    borderRadius: 10, cursor: 'pointer', textAlign: 'right',
                    background: active ? 'rgba(255,193,7,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(255,193,7,0.45)' : CBR}`,
                    color: active ? GOLD : LT, transition: 'all 0.18s',
                  }}>{s}</button>
                );
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="سنوات الخبرة" required>
                <input className="tr-input" value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}
                  required type="number" min="1" max="40" placeholder="مثال: 5" style={inputStyle} />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="أبرز أعمالك أو محطاتك المهنية">
                <textarea className="tr-input" value={form.notableWork} onChange={e => set('notableWork', e.target.value)}
                  rows={3} placeholder="محطات تلفزيونية، إذاعية، حملات إعلانية..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }} />
              </Field>
            </div>
          </section>

          {/* ٣ — Links */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٣</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>الروابط والملف المهني</h2>
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
          </section>

          {/* ٤ — Availability */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٤</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>التوفر وطريقة التدريس</h2>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: MUT, margin: '0 0 14px 0' }}>أوقات توفّرك للتدريس</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {AVAIL_OPTIONS.map(a => {
                const active = form.availability.includes(a);
                return (
                  <button key={a} type="button" onClick={() => toggle('availability', a)} style={{
                    fontFamily: F, fontWeight: 700, fontSize: 13, padding: '9px 16px',
                    borderRadius: 10, cursor: 'pointer',
                    background: active ? 'rgba(103,232,249,0.10)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(103,232,249,0.40)' : CBR}`,
                    color: active ? '#67e8f9' : LT, transition: 'all 0.18s',
                  }}>{a}</button>
                );
              })}
            </div>
            <Field label="طريقة التدريس المفضّلة" required>
              <div style={{ position: 'relative' }}>
                <select
                  className="tr-select"
                  value={form.teachingFormat}
                  onChange={e => set('teachingFormat', e.target.value)}
                  required
                  style={selectStyle}
                >
                  <option value="">اختر...</option>
                  {FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={16} color="rgba(255,255,255,0.40)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </Field>
          </section>

          {/* ٥ — Why Kaseet */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٥</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>لماذا كاسيت؟</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          </section>

          {/* Submit */}
          <div style={{ paddingTop: 4 }}>
            <button type="submit" disabled={loading} style={{
              width: '100%', fontFamily: F, fontWeight: 800, fontSize: 16,
              padding: '17px 32px', borderRadius: 14,
              background: loading ? 'rgba(255,193,7,0.50)' : GOLD,
              border: 'none', color: '#18202F',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: loading ? 'none' : '0 4px 24px rgba(255,193,7,0.30)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'جاري الإرسال...' : 'إرسال طلب الانضمام 🎓'}
            </button>
            <p style={{ fontFamily: F, fontSize: 12, color: MUT, textAlign: 'center', margin: '16px 0 0' }}>
              بالإرسال توافق على{' '}
              <a href="/terms" style={{ color: 'rgba(255,193,7,0.65)', textDecoration: 'none' }}>الشروط والأحكام</a>
              {' '}و{' '}
              <a href="/privacy-policy" style={{ color: 'rgba(255,193,7,0.65)', textDecoration: 'none' }}>سياسة الخصوصية</a>
            </p>
          </div>

        </form>
      </main>

      <SiteFooter />
    </div>
  );
}
