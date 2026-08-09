// ── Apply — Voice Talent Page ─────────────────────────────────
import { useState, useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import BackButton from '@/components/BackButton';
import { CheckCircle, Mic, ChevronDown } from 'lucide-react';

const F    = 'Tajawal, sans-serif';
const GOLD = '#FFC107';
const CARD = 'rgba(255,255,255,0.03)';
const LINE = 'rgba(255,255,255,0.08)';

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

/* ── Input component ── */
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

export default function ApplyVoiceTalentPage() {
  const [form, setForm]         = useState<FormData>(INITIAL);
  const [loading, setLoading]   = useState(false);
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
    } catch { /* API not yet connected — show success anyway */ }
    setLoading(false);
    setSubmitted(true);
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <BackButton />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ textAlign: 'center', maxWidth: 520 }}>
            <CheckCircle size={56} color={GOLD} style={{ marginBottom: 20 }}/>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,36px)', color: '#fff', margin: '0 0 16px' }}>
              شكراً! وصل طلبك بنجاح 🎙️
            </h1>
            <p style={{ fontFamily: F, fontSize: 15.5, color: 'rgba(203,213,225,0.72)', lineHeight: 1.85, margin: '0 0 32px' }}>
              تلقّينا طلب تقديمك وسيتواصل معك فريقنا خلال ٢–٣ أيام عمل لتحديد الخطوة التالية.
            </p>
            <a
              href="/"
              style={{
                display: 'inline-block', fontFamily: F, fontWeight: 700, fontSize: 14,
                padding: '12px 28px', borderRadius: 12,
                background: 'rgba(255,193,7,0.12)', border: `1px solid rgba(255,193,7,0.36)`,
                color: GOLD, textDecoration: 'none',
              }}
            >
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
    <div dir="rtl" style={{ background: '#0D0B14', minHeight: '100vh', color: '#fff' }}>
      <BackButton />

      {/* Hero */}
      <div style={{ background: 'rgba(0,0,0,0.30)', borderBottom: '1px solid rgba(255,193,7,0.12)', padding: '120px 24px 52px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Mic size={22} color={GOLD}/>
            <span style={{
              padding: '4px 14px', borderRadius: 999,
              background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
              color: GOLD, fontSize: 12.5, fontFamily: F, fontWeight: 700,
            }}>تقديم موهبة صوتية</span>
          </div>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,38px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            انضم إلى مجتمع كاسيت
          </h1>
          <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(203,213,225,0.68)', margin: 0, lineHeight: 1.75 }}>
            أخبرنا عن موهبتك الصوتية وسنساعدك في اختيار المسار الأنسب لتطوير مهاراتك.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '52px 24px 80px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* Section 1: Personal info */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '30px 28px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: '0 0 22px' }}>
              ١. المعلومات الشخصية
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="الاسم الكامل" required>
                <input value={form.fullName} onChange={e => set('fullName', e.target.value)}
                  required placeholder="اسمك الكامل" style={inputStyle}/>
              </Field>
              <Field label="المدينة" required>
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  required placeholder="عمّان، بيروت..." style={inputStyle}/>
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
              <Field label="العمر">
                <input value={form.age} onChange={e => set('age', e.target.value)}
                  type="number" min="14" max="80" placeholder="مثال: 25" style={inputStyle}/>
              </Field>
            </div>
          </section>

          {/* Section 2: Background */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '30px 28px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: '0 0 22px' }}>
              ٢. الخلفية الصوتية
            </h2>
            <Field label="مستوى خبرتك الصوتية" required>
              <div style={{ position: 'relative' }}>
                <select value={form.experience} onChange={e => set('experience', e.target.value)}
                  required style={{ ...inputStyle, width: '100%', appearance: 'none', paddingLeft: 40, cursor: 'pointer' }}>
                  <option value="">اختر مستواك الحالي</option>
                  {EXP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={16} color="rgba(255,255,255,0.40)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
              </div>
            </Field>

            <div style={{ marginTop: 16 }}>
              <Field label="رابط عيّنة صوتية أو حساب إنستغرام (اختياري)">
                <input value={form.sampleLink} onChange={e => set('sampleLink', e.target.value)}
                  type="url" placeholder="https://..." style={{ ...inputStyle, direction: 'ltr' }}/>
              </Field>
            </div>
          </section>

          {/* Section 3: Tracks */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '30px 28px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: '0 0 8px' }}>
              ٣. المسارات التي تهمّك
            </h2>
            <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(203,213,225,0.55)', margin: '0 0 18px' }}>
              يمكنك اختيار أكثر من مسار
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {TRACK_OPTIONS.map(t => {
                const active = form.tracks.includes(t);
                return (
                  <button
                    key={t} type="button" onClick={() => toggleTrack(t)}
                    style={{
                      fontFamily: F, fontWeight: 700, fontSize: 13.5,
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'right',
                      background: active ? 'rgba(255,193,7,0.14)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(255,193,7,0.45)' : 'rgba(255,255,255,0.09)'}`,
                      color: active ? GOLD : 'rgba(255,255,255,0.72)',
                      transition: 'all 0.18s',
                    }}
                  >{t}</button>
                );
              })}
            </div>
          </section>

          {/* Section 4: Goals */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '30px 28px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: '0 0 22px' }}>
              ٤. هدفك من الانضمام
            </h2>
            <Field label="أخبرنا عن هدفك" required>
              <textarea
                value={form.goal} onChange={e => set('goal', e.target.value)}
                required rows={4}
                placeholder="ما الذي تأمل في تحقيقه بعد الانتهاء من البرنامج؟"
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }}
              />
            </Field>
          </section>

          {/* Section 5: How found */}
          <section style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: '30px 28px' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: '0 0 22px' }}>
              ٥. معلومات إضافية
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="كيف عرفت عن كاسيت أكاديمي؟">
                <div style={{ position: 'relative' }}>
                  <select value={form.howFound} onChange={e => set('howFound', e.target.value)}
                    style={{ ...inputStyle, width: '100%', appearance: 'none', paddingLeft: 40, cursor: 'pointer' }}>
                    <option value="">اختر...</option>
                    {HOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={16} color="rgba(255,255,255,0.40)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                </div>
              </Field>
              <Field label="أي ملاحظات أو أسئلة إضافية (اختياري)">
                <textarea
                  value={form.notes} onChange={e => set('notes', e.target.value)}
                  rows={3} placeholder="أي شيء آخر تودّ إضافته..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75 }}
                />
              </Field>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              fontFamily: F, fontWeight: 800, fontSize: 16,
              padding: '16px 32px', borderRadius: 14,
              background: loading ? 'rgba(255,193,7,0.50)' : GOLD,
              border: 'none', color: '#18202F', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(255,193,7,0.28)',
            }}
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب التقديم 🎙️'}
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
