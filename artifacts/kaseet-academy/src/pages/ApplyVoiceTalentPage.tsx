// ── Apply — Voice Talent Page ─────────────────────────────────
import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import { CheckCircle, Mic, ChevronDown, Home, ArrowLeft } from 'lucide-react';
import { GOLD, OFF, F, FP, INNER } from './shared/coursePageHelpers';

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
      tracks: prev.tracks.includes(t) ? prev.tracks.filter(x => x !== t) : [...prev.tracks, t],
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
      <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520, position: 'relative', zIndex: 3 }}>
            <CheckCircle size={52} color={GOLD} style={{ marginBottom: 20 }} />
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
              <ArrowLeft size={14} /> العودة إلى الرئيسية
            </a>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .vt-hero-grid { grid-template-columns: 1fr !important; }
          .vt-hero-img  { display: none !important; }
          .vt-form-2col { grid-template-columns: 1fr !important; }
        }
        .vt-input:focus  { border-color: rgba(255,193,7,0.55) !important; }
        .vt-select:focus { border-color: rgba(255,193,7,0.55) !important; outline: none; }
        .vt-select option { background: #101922; color: #fff; }
        .vt-track-btn:hover { border-color: rgba(255,193,7,0.35) !important; }
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
            <span style={{ fontFamily: F, fontSize: 12.5, color: GOLD }}>تقديم موهبة صوتية</span>
          </nav>

          <div className="vt-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.12fr 0.88fr', gap: 52, alignItems: 'center', position: 'relative', zIndex: 3 }}>

            {/* text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GOLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999, marginBottom: 20 }}>
                <Mic size={12} strokeWidth={2.2} /> تقديم موهبة صوتية
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.22, letterSpacing: -1.2, margin: '0 0 0', color: OFF }}>
                انضم إلى مجتمع كاسيت{' '}<br />
                <span style={{ color: GOLD }}>الصوتي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 520, marginTop: 16, lineHeight: 1.85 }}>
                أخبرنا عن موهبتك الصوتية وسنساعدك في اختيار المسار الأنسب — من التعليق الصوتي إلى الإعلام والبودكاست.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
                {[
                  '٤ مسارات للاختيار',
                  'مبتدئ ومحترف مرحّب',
                  'رد خلال ٢–٣ أيام',
                  'تقييم شخصي مجاني',
                ].map(txt => (
                  <span key={txt} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: `1px solid ${CBR}`, padding: '9px 14px', borderRadius: 10, fontFamily: F, fontSize: 13, color: LT }}>
                    {txt}
                  </span>
                ))}
              </div>
            </div>

            {/* cover image */}
            <div className="vt-hero-img" style={{ position: 'relative', maxWidth: 380, marginInline: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: `radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)`, filter: 'blur(8px)', zIndex: 0 }} />
              <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, aspectRatio: '3/4', boxShadow: '0 34px 90px rgba(0,0,0,.55)', zIndex: 1 }}>
                <img
                  src="/voice-talent-cover.png"
                  alt="استوديو تسجيل كاسيت"
                  fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,25,34,.92) 0%, rgba(16,25,34,.28) 35%, transparent 60%)' }} />
                <span style={{ position: 'absolute', top: 18, right: 18, zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(16,25,34,.74)', backdropFilter: 'blur(6px)', border: `1px solid ${GL}`, color: GOLD, fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '7px 13px', borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
                  استوديو كاسيت الأكاديمي
                </span>
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', zIndex: 3, padding: '22px 22px 24px' }}>
                  <span style={{ fontFamily: FP, fontSize: 36, fontWeight: 700, color: GOLD, lineHeight: 0.95 }}>🎙️</span>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: LT, marginTop: 6 }}>صوتك بداية رحلتك</div>
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
              <div className="vt-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
            </div>

            {/* ٢ — Background */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٢</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>الخلفية الصوتية</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="مستوى خبرتك الصوتية" required>
                  <div style={{ position: 'relative' }}>
                    <select className="vt-select" value={form.experience} onChange={e => set('experience', e.target.value)}
                      required style={selectStyle}>
                      <option value="">اختر مستواك الحالي</option>
                      {EXP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={16} color="rgba(255,255,255,.40)"
                      style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </Field>
                <Field label="رابط عيّنة صوتية أو حساب إنستغرام (اختياري)">
                  <input className="vt-input" value={form.sampleLink} onChange={e => set('sampleLink', e.target.value)}
                    type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }} />
                </Field>
              </div>
            </div>

            {/* ٣ — Tracks */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٣</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>المسارات التي تهمّك</h2>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, margin: '0 0 16px 42px' }}>يمكنك اختيار أكثر من مسار</p>
              <div className="vt-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                {TRACK_OPTIONS.map(t => {
                  const active = form.tracks.includes(t);
                  return (
                    <button key={t} type="button" onClick={() => toggleTrack(t)} className="vt-track-btn" style={{
                      fontFamily: F, fontWeight: 700, fontSize: 13.5,
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'right',
                      background: active ? 'rgba(255,193,7,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(255,193,7,0.45)' : CBR}`,
                      color: active ? GOLD : LT, transition: 'all 0.18s',
                    }}>{t}</button>
                  );
                })}
              </div>
            </div>

            {/* ٤ — Goal */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٤</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>هدفك من الانضمام</h2>
              </div>
              <Field label="أخبرنا عن هدفك" required>
                <textarea className="vt-input" value={form.goal} onChange={e => set('goal', e.target.value)}
                  required rows={4} placeholder="ما الذي تأمل في تحقيقه بعد الانتهاء من البرنامج؟"
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }} />
              </Field>
            </div>

            {/* ٥ — Additional */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: '28px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: GS, border: `1px solid ${GL}`, fontFamily: FP, fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>٥</span>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: 0 }}>معلومات إضافية</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="كيف عرفت عن كاسيت أكاديمي؟">
                  <div style={{ position: 'relative' }}>
                    <select className="vt-select" value={form.howFound} onChange={e => set('howFound', e.target.value)}
                      style={selectStyle}>
                      <option value="">اختر...</option>
                      {HOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={16} color="rgba(255,255,255,.40)"
                      style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </Field>
                <Field label="أي ملاحظات أو أسئلة إضافية (اختياري)">
                  <textarea className="vt-input" value={form.notes} onChange={e => set('notes', e.target.value)}
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
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التقديم 🎙️'}
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
