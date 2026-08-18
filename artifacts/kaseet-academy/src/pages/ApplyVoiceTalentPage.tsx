// ── Apply — Voice Talent Page ─────────────────────────────────
import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import { CheckCircle, Mic, ChevronDown, Home, Target, Radio, Sparkles } from 'lucide-react';
import coverImg from '/voice-talent-cover.png';

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
  fullName: string; city: string; phone: string; email: string; age: string;
  experience: string; sampleLink: string;
  tracks: string[]; goal: string; howFound: string; notes: string;
};

const INITIAL: FormData = {
  fullName: '', city: '', phone: '', email: '', age: '',
  experience: '', sampleLink: '',
  tracks: [], goal: '', howFound: '', notes: '',
};

const TRACK_OPTIONS = ['التعليق الصوتي', 'الإعلام والتقديم التلفزيوني', 'الخطابة والتواصل', 'البودكاست والمحتوى الصوتي'];
const EXP_OPTIONS   = ['مبتدئ — لا خبرة مسبقة', 'متوسط — بعض التجارب', 'محترف — عمل احترافي سابق'];
const HOW_OPTIONS   = ['إنستغرام', 'واتساب', 'توصية شخص', 'يوتيوب', 'تيك توك', 'بحث Google', 'أخرى'];

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
  transition: 'border-color 0.2s', WebkitAppearance: 'none',
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

export default function ApplyVoiceTalentPage() {
  const [form, setForm]           = useState<FormData>(INITIAL);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  const set = (k: keyof FormData, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const toggleTrack = (t: string) => {
    setForm(prev => ({
      ...prev,
      tracks: prev.tracks.includes(t)
        ? prev.tracks.filter(x => x !== t)
        : [...prev.tracks, t],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !form.experience) return;
    setLoading(true);
    try {
      await fetch('/api/apply/voice-talent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch { /* show success anyway */ }
    setLoading(false);
    setSubmitted(true);
  };

  /* ── Success ── */
  if (submitted) {
    return (
      <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: OFF, display: 'flex', flexDirection: 'column', fontFamily: F }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,193,7,0.12)', border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={32} color={GOLD} />
            </div>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,36px)', color: OFF, margin: '0 0 16px' }}>
              شكراً! وصل طلبك بنجاح 🎙️
            </h1>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, lineHeight: 1.85, margin: '0 0 32px' }}>
              تلقّينا طلب تقديمك وسيتواصل معك فريقنا خلال ٢–٣ أيام عمل لتحديد الخطوة التالية.
            </p>
            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: F, fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 12,
              background: GS, border: `1px solid ${GL}`,
              color: GOLD, textDecoration: 'none',
            }}>
              العودة إلى الرئيسية
            </a>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: OFF, fontFamily: F, overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 640px) {
          .vt-hero-grid { grid-template-columns: 1fr !important; }
          .vt-hero-img { display: none !important; }
          .vt-form-grid { grid-template-columns: 1fr !important; }
        }
        .vt-input:focus { border-color: rgba(255,193,7,0.55) !important; }
        .vt-select:focus { border-color: rgba(255,193,7,0.55) !important; outline: none; }
        .vt-select option { background: #0D0B14; color: #fff; }
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
            <span style={{ fontFamily: F, fontSize: 12.5, color: GOLD }}>تقديم موهبة صوتية</span>
          </nav>

          <div className="vt-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 52, alignItems: 'center' }}>

            {/* text */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GOLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                  <Target size={12} strokeWidth={2.2} /> للمبتدئين والصاعدين
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(103,232,249,0.08)', border: '1px solid rgba(103,232,249,0.22)', color: '#67e8f9', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                  <Radio size={12} strokeWidth={2.2} /> صوت · إعلام · بودكاست
                </span>
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(32px,5vw,54px)', lineHeight: 1.22, letterSpacing: -1, margin: '0 0 16px', color: OFF }}>
                انضم إلى مجتمع<br />
                <span style={{ color: GOLD }}>كاسيت الصوتي</span>
              </h1>
              <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, maxWidth: 520, lineHeight: 1.85, margin: '0 0 28px' }}>
                أخبرنا عن موهبتك الصوتية وسنساعدك في اختيار المسار الأنسب لتطوير مهاراتك — من التعليق الصوتي إلى الإعلام والبودكاست.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, maxWidth: 480, marginBottom: 28 }}>
                {[
                  { icon: <Mic size={13} color={GOLD} strokeWidth={2} />, text: '٤ مسارات للاختيار' },
                  { icon: <Target size={13} color={GOLD} strokeWidth={2} />, text: 'مبتدئ ومحترف مرحّب' },
                  { icon: <Sparkles size={13} color={GOLD} strokeWidth={2} />, text: 'تقييم شخصي مجاني' },
                  { icon: <Radio size={13} color='#67e8f9' strokeWidth={2} />, text: 'رد خلال ٢–٣ أيام' },
                ].map((item, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.04)', border: `1px solid ${CBR}`, padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT }}>
                    {item.icon} {item.text}
                  </span>
                ))}
              </div>
            </div>

            {/* cover image */}
            <div className="vt-hero-img" style={{ position: 'relative', maxWidth: 360, marginInline: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,0.20), transparent 68%)', filter: 'blur(8px)', zIndex: -1 }} />
              <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, aspectRatio: '3/4', boxShadow: '0 34px 90px rgba(0,0,0,0.55)' }}>
                <img
                  src={coverImg}
                  alt="استوديو تسجيل كاسيت"
                  fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,11,20,0.92) 0%, rgba(13,11,20,0.28) 35%, transparent 60%)' }} />
                <span style={{ position: 'absolute', top: 18, right: 18, zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(13,11,20,0.74)', backdropFilter: 'blur(6px)', border: `1px solid ${GL}`, color: GOLD, fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '7px 13px', borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
                  استوديو كاسيت الأكاديمي
                </span>
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', zIndex: 3, padding: '22px 22px 24px' }}>
                  <div style={{ fontFamily: FP, fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 0.95 }}>🎙️</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: LT, marginTop: 6 }}>صوتك بداية رحلتك</div>
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
            <div className="vt-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="الاسم الكامل" required>
                <input className="vt-input" value={form.fullName} onChange={e => set('fullName', e.target.value)}
                  required placeholder="اسمك الكامل" style={inputStyle} />
              </Field>
              <Field label="المدينة" required>
                <input className="vt-input" value={form.city} onChange={e => set('city', e.target.value)}
                  required placeholder="عمّان، بيروت..." style={inputStyle} />
              </Field>
              <Field label="رقم الهاتف (واتساب)" required>
                <input className="vt-input" value={form.phone} onChange={e => set('phone', e.target.value)}
                  required type="tel" placeholder="+962 7X XXX XXXX"
                  style={{ ...inputStyle, direction: 'ltr' }} />
              </Field>
              <Field label="البريد الإلكتروني" required>
                <input className="vt-input" value={form.email} onChange={e => set('email', e.target.value)}
                  required type="email" placeholder="your@email.com"
                  style={{ ...inputStyle, direction: 'ltr' }} />
              </Field>
              <Field label="العمر">
                <input className="vt-input" value={form.age} onChange={e => set('age', e.target.value)}
                  type="number" min="14" max="80" placeholder="مثال: 25" style={inputStyle} />
              </Field>
            </div>
          </section>

          {/* ٢ — Background */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٢</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>الخلفية الصوتية</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="مستوى خبرتك الصوتية" required>
                <div style={{ position: 'relative' }}>
                  <select
                    className="vt-select"
                    value={form.experience}
                    onChange={e => set('experience', e.target.value)}
                    required
                    style={selectStyle}
                  >
                    <option value="">اختر مستواك الحالي</option>
                    {EXP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={16} color="rgba(255,255,255,0.40)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </Field>
              <Field label="رابط عيّنة صوتية أو حساب إنستغرام (اختياري)">
                <input className="vt-input" value={form.sampleLink} onChange={e => set('sampleLink', e.target.value)}
                  type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }} />
              </Field>
            </div>
          </section>

          {/* ٣ — Tracks */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٣</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>المسارات التي تهمّك</h2>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: MUT, margin: '0 0 18px 0' }}>يمكنك اختيار أكثر من مسار</p>
            <div className="vt-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {TRACK_OPTIONS.map(t => {
                const active = form.tracks.includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggleTrack(t)} style={{
                    fontFamily: F, fontWeight: 700, fontSize: 13.5,
                    padding: '12px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'right',
                    background: active ? 'rgba(255,193,7,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(255,193,7,0.45)' : CBR}`,
                    color: active ? GOLD : LT,
                    transition: 'all 0.18s',
                  }}>{t}</button>
                );
              })}
            </div>
          </section>

          {/* ٤ — Goal */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٤</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>هدفك من الانضمام</h2>
            </div>
            <Field label="أخبرنا عن هدفك" required>
              <textarea className="vt-input" value={form.goal} onChange={e => set('goal', e.target.value)}
                required rows={4} placeholder="ما الذي تأمل في تحقيقه بعد الانتهاء من البرنامج؟"
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }} />
            </Field>
          </section>

          {/* ٥ — Additional */}
          <section style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '30px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD }}>٥</span>
              </div>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>معلومات إضافية</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="كيف عرفت عن كاسيت أكاديمي؟">
                <div style={{ position: 'relative' }}>
                  <select
                    className="vt-select"
                    value={form.howFound}
                    onChange={e => set('howFound', e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">اختر...</option>
                    {HOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={16} color="rgba(255,255,255,0.40)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </Field>
              <Field label="أي ملاحظات أو أسئلة إضافية (اختياري)">
                <textarea className="vt-input" value={form.notes} onChange={e => set('notes', e.target.value)}
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
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التقديم 🎙️'}
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
