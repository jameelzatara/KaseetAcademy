import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Info, ChevronRight, ChevronLeft, Lock, CreditCard, MessageCircle, Check, ChevronDown } from 'lucide-react';
import { currentCohorts } from '@/data/currentCohorts';
import { useCoursePricing } from '@/hooks/useCoursePricing';

// ─── Types ────────────────────────────────────────────────
type Mode = 'onsite' | 'live';
type Plan = 'full' | 'deposit';

interface Cohort {
  id: number; course: string; mode: Mode; status: string;
  trainer: string; start: string; start_ar: string; days: string;
  time_ar: string; platform: string; capacity: number;
  enrolled: number; remaining: number;
}

interface Customer {
  firstName: string; lastName: string; email: string;
  phone: string; country: string; city: string;
}

const COURSE_NAMES: Record<string, string> = {
  voiceover:           'أساسيات التعليق والأداء الصوتي',
  'voiceover-basics':  'أساسيات التعليق والأداء الصوتي',
  presenter:           'الدورة المكثّفة: المذيع المحترف',
  'public-speaking':   'فن الخطابة والإلقاء الجماهيري المؤثّر',
  'arabic-language':   'تمكين اللغة العربية وفنون التحرير اللغوي',
};

const DEPOSIT_JOD = 50;
const FX_USD = 1.41;

function jodToUSD(jod: number) { return Math.ceil(jod * FX_USD); }
function splitInstallments(total: number): [number, number, number] {
  const rest = total - DEPOSIT_JOD;
  const each = Math.round(rest / 2);
  return [DEPOSIT_JOD, each, rest - each];
}

// ─── Phone: country dial-code list ───────────────────────
// Arab countries first, then international
const DIAL_COUNTRIES = [
  { code: '962', flag: '🇯🇴', label: 'الأردن',          min: 9,  max: 9  },
  { code: '966', flag: '🇸🇦', label: 'السعودية',        min: 9,  max: 9  },
  { code: '971', flag: '🇦🇪', label: 'الإمارات',        min: 9,  max: 9  },
  { code: '965', flag: '🇰🇼', label: 'الكويت',          min: 8,  max: 8  },
  { code: '974', flag: '🇶🇦', label: 'قطر',             min: 8,  max: 8  },
  { code: '973', flag: '🇧🇭', label: 'البحرين',         min: 8,  max: 8  },
  { code: '968', flag: '🇴🇲', label: 'عُمان',           min: 8,  max: 8  },
  { code: '20',  flag: '🇪🇬', label: 'مصر',             min: 10, max: 10 },
  { code: '963', flag: '🇸🇾', label: 'سوريا',           min: 9,  max: 9  },
  { code: '961', flag: '🇱🇧', label: 'لبنان',           min: 7,  max: 8  },
  { code: '970', flag: '🇵🇸', label: 'فلسطين',          min: 9,  max: 9  },
  { code: '964', flag: '🇮🇶', label: 'العراق',          min: 10, max: 10 },
  { code: '967', flag: '🇾🇪', label: 'اليمن',           min: 9,  max: 9  },
  { code: '218', flag: '🇱🇾', label: 'ليبيا',           min: 9,  max: 10 },
  { code: '212', flag: '🇲🇦', label: 'المغرب',          min: 9,  max: 9  },
  { code: '213', flag: '🇩🇿', label: 'الجزائر',         min: 9,  max: 9  },
  { code: '216', flag: '🇹🇳', label: 'تونس',            min: 8,  max: 8  },
  { code: '249', flag: '🇸🇩', label: 'السودان',         min: 9,  max: 9  },
  { code: '252', flag: '🇸🇴', label: 'الصومال',         min: 8,  max: 9  },
  null, // separator
  { code: '1',   flag: '🇺🇸', label: 'الولايات المتحدة', min: 10, max: 10 },
  { code: '44',  flag: '🇬🇧', label: 'المملكة المتحدة', min: 10, max: 10 },
  { code: '49',  flag: '🇩🇪', label: 'ألمانيا',         min: 9,  max: 11 },
  { code: '33',  flag: '🇫🇷', label: 'فرنسا',           min: 9,  max: 9  },
  { code: '90',  flag: '🇹🇷', label: 'تركيا',           min: 10, max: 10 },
  { code: '98',  flag: '🇮🇷', label: 'إيران',           min: 10, max: 10 },
  { code: '92',  flag: '🇵🇰', label: 'باكستان',         min: 10, max: 10 },
  { code: '91',  flag: '🇮🇳', label: 'الهند',           min: 10, max: 10 },
  { code: '61',  flag: '🇦🇺', label: 'أستراليا',        min: 9,  max: 9  },
  { code: '1',   flag: '🇨🇦', label: 'كندا',            min: 10, max: 10 },
] as const;

type DialCountry = Exclude<typeof DIAL_COUNTRIES[number], null>;

/** Drop leading zero from local number, prepend country code → E.164 without + */
function buildPhone(dialCode: string, local: string): string {
  const digits = local.replace(/\D/g, '').replace(/^0+/, '');
  return `${dialCode}${digits}`;
}

function validatePhone(dialCode: string, local: string): string | null {
  const digits = local.replace(/\D/g, '').replace(/^0+/, '');
  const entry = DIAL_COUNTRIES.find(c => c && c.code === dialCode) as DialCountry | undefined;
  if (!entry) return 'اختر رمز الدولة';
  if (digits.length < entry.min) return `رقم الهاتف قصير، المطلوب ${entry.min} أرقام على الأقل`;
  if (digits.length > entry.max) return `رقم الهاتف طويل، الحدّ الأقصى ${entry.max} أرقام`;
  return null;
}

// ─── Design tokens ────────────────────────────────────────
const DARK = '#0D0B14';
const CREAM = '#F5F4F0';
const CREAM_CARD = '#FDFCF8';
const INK = '#18202F';
const INK2 = '#4B5563';
const GOLD = '#E6A817';
const GREEN = '#16a34a';
const CREAM_LINE = 'rgba(24,32,47,.1)';
const F = "'Tajawal', 'Cairo', Arial, sans-serif";

const API = '/api';

// ─── Advisor config ───────────────────────────────────────
const ADVISORS: Record<Mode, { name: string; phone: string }> = {
  onsite: { name: 'آية', phone: '962790234483' },
  live:   { name: 'ياقوت', phone: '962771052222' },
};

// ─── Helpers ──────────────────────────────────────────────
function useQuery() {
  // Wouter's useLocation returns only the path; query string lives in window.location.search
  return new URLSearchParams(window.location.search);
}

// ─── Main Component ───────────────────────────────────────
export default function CheckoutPage() {
  const query = useQuery();
  const courseSlug = query.get('course') ?? '';
  const cohortIdParam = parseInt(query.get('cohort') ?? '0', 10);
  const modeParam = (query.get('mode') ?? 'live') as Mode;

  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<Plan>(modeParam === 'live' ? 'full' : 'deposit');
  const [customer, setCustomer] = useState<Customer>({
    firstName: '', lastName: '', email: '', phone: '', country: 'الأردن', city: '',
  });
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [dialCode,  setDialCode]  = useState('962'); // Jordan default
  const [localPhone, setLocalPhone] = useState('');

  // ── Live prices from DB ───────────────────────────────────
  const { pricing: apiPricing, loading: pricingLoading } = useCoursePricing(courseSlug);

  const cohort = (currentCohorts as Cohort[]).find(
    (c) => c.id === cohortIdParam && c.mode === modeParam,
  );
  const courseName = COURSE_NAMES[courseSlug] ?? courseSlug;
  const modeLabel = modeParam === 'onsite' ? 'حضوري' : 'مباشر تفاعلي (Online LIVE)';

  // ── Mode validity check — mirrors server-side guard in checkout.ts ──
  const isLive = modeParam === 'live';
  const modeAvailable = apiPricing
    ? isLive
      ? apiPricing.liveEnabled && apiPricing.livePriceUSD !== null
      : apiPricing.onsiteEnabled && apiPricing.onsitePriceJOD !== null
    : true; // unknown until loaded — let the loading gate handle it

  // Redirect if invalid — wait until pricing has loaded before redirecting
  useEffect(() => {
    if (!pricingLoading && (!cohort || !apiPricing || !modeAvailable)) navigate('/');
  }, [cohort, apiPricing, pricingLoading, modeAvailable]);

  if (pricingLoading) return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F }}>
      <span style={{ color: INK2, fontSize: 15 }}>جارٍ التحميل…</span>
    </div>
  );

  if (!cohort || !apiPricing || !modeAvailable) return null;

  // ── Amounts (from live DB prices, mode already validated above) ──
  const totalJOD = apiPricing.onsitePriceJOD ?? 0;
  const totalUSD = apiPricing.livePriceUSD ?? 0;
  const [dep, inst2, inst3] = splitInstallments(totalJOD);

  const nowJOD = isLive ? 0 : plan === 'full' ? totalJOD : dep;
  const nowUSD = isLive ? totalUSD : jodToUSD(nowJOD);
  const showFxNotice = !isLive; // JOD courses need FX disclosure

  // ── Step 2 → 3 advance ────────────────────────────────────
  function advanceToStep3() {
    if (!customer.firstName) { setError('الاسم الأول مطلوب'); return; }
    const phoneErr = validatePhone(dialCode, localPhone);
    if (phoneErr) { setError(phoneErr); return; }
    // Build E.164-style phone and store in customer
    const fullPhone = buildPhone(dialCode, localPhone);
    setCustomer(c => ({ ...c, phone: fullPhone }));
    setError('');
    setStep(3);
  }

  // ── Submit ────────────────────────────────────────────────
  const handlePay = useCallback(async () => {
    // Ensure phone is built (in case customer was set before dialCode synced)
    const fullPhone = buildPhone(dialCode, localPhone);
    const custToSend = { ...customer, phone: fullPhone || customer.phone };
    if (!custToSend.firstName || !custToSend.phone) {
      setError('الاسم الأول والهاتف مطلوبان');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`${API}/checkout/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cohortId: cohort.id,
          courseSlug,
          mode: modeParam,
          plan,
          cohortCapacity: cohort.capacity,
          cohortEnrolled: cohort.enrolled,
          cohortStartAr: cohort.start_ar,
          cohortDays: cohort.days,
          cohortTimeAr: cohort.time_ar,
          cohortTrainer: cohort.trainer,
          cohortPlatform: cohort.platform,
          customer: custToSend,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        if (data.error === 'CAP_REACHED') {
          setError('للأسف نفدت مقاعد هذه الدفعة. جرّب دفعة أخرى.');
        } else {
          setError(data.error ?? 'حدث خطأ، حاول مجدداً');
        }
        setLoading(false);
        return;
      }
      // Redirect to Stripe
      window.location.href = data.url;
    } catch {
      setError('تعذّر الاتصال بالخادم، تحقّق من الإنترنت وأعد المحاولة');
      setLoading(false);
    }
  }, [customer, cohort, courseSlug, modeParam, plan, dialCode, localPhone]);

  // ── Progress bar ──────────────────────────────────────────
  const steps = ['اختيار الخطّة', 'بياناتك', 'الدفع الآمن'];

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: F, direction: 'rtl', paddingTop: 80 }}>
      {/* Header */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 0' }}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate(`/courses/${courseSlug}`)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 13.5, fontWeight: 700, color: INK2, marginBottom: 24 }}
        >
          <ChevronRight size={15} /> العودة
        </button>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
          {steps.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: n < 3 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: done ? GREEN : active ? DARK : 'rgba(24,32,47,.12)',
                    color: done || active ? '#fff' : INK2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                  }}>
                    {done ? <Check size={13} strokeWidth={3} /> : n}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? INK : INK2 }}>{label}</span>
                </div>
                {n < 3 && <div style={{ flex: 1, height: 2, background: done ? GREEN : 'rgba(24,32,47,.1)', borderRadius: 2 }} />}
              </div>
            );
          })}
        </div>

        {/* Course badge */}
        <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: INK2, marginBottom: 4 }}>{modeLabel}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: INK }}>{courseName}</div>
          <div style={{ fontSize: 13.5, color: INK2, marginTop: 4 }}>
            الدفعة #{cohort.id} · {cohort.start_ar} · {cohort.days} · {cohort.time_ar}
          </div>
          <div style={{ fontSize: 13, color: INK2, marginTop: 2 }}>{cohort.trainer} · {cohort.platform}</div>
        </div>

        {/* ── STEP 1: Plan ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            {isLive ? (
              <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: INK }}>دفعة واحدة كاملة</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: INK, marginTop: 8 }}>${totalUSD} <span style={{ fontSize: 14, fontWeight: 600, color: INK2 }}>دولار</span></div>
              </div>
            ) : (
              <>
                {/* Deposit option */}
                <PlanCard
                  selected={plan === 'deposit'}
                  onSelect={() => setPlan('deposit')}
                  title="التقسيط — حجز مقعد الآن"
                  badge="الأكثر اختياراً"
                  rows={[
                    { label: 'تدفع الآن (حجز المقعد)', value: `${dep} د.أ`, highlight: true },
                    { label: 'الدفعة الثانية', value: `${inst2} د.أ` },
                    { label: 'الدفعة الثالثة', value: `${inst3} د.أ` },
                    { label: 'الإجمالي', value: `${totalJOD} د.أ` },
                  ]}
                  note="الدفعتان الثانية والثالثة تُرتَّبان مع مستشارتك أثناء الدورة — تحويلاً أو نقداً."
                />
                {/* Full payment option */}
                <PlanCard
                  selected={plan === 'full'}
                  onSelect={() => setPlan('full')}
                  title="الدفعة الكاملة"
                  rows={[{ label: 'تدفع الآن', value: `${totalJOD} د.أ`, highlight: true }]}
                />
              </>
            )}

            {/* FX notice for JOD courses */}
            {showFxNotice && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(255,193,7,.09)', border: '1px solid rgba(255,193,7,.35)', borderRadius: 14, padding: '16px 18px', marginBottom: 16 }}>
                <Info size={17} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <b style={{ display: 'block', fontSize: 15, color: INK }}>
                    سعر البرنامج: {plan === 'full' ? totalJOD : dep} ديناراً أردنياً
                  </b>
                  <span style={{ display: 'block', fontSize: 14, color: INK2, marginTop: 4 }}>
                    يُحصَّل ما يعادل <b>${nowUSD}</b> بالدولار الأمريكي
                  </span>
                  <small style={{ display: 'block', fontSize: 12.5, color: INK2, marginTop: 6, opacity: .75 }}>
                    قد يضيف بنكك عمولة تحويل عملة تتراوح بين 2% و3%
                  </small>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '14px 0', background: DARK, color: '#fff', border: 'none', borderRadius: 14, fontFamily: F, fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              التالي <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Customer form ──────────────────────── */}
        {step === 2 && (
          <div>
            <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 20px', fontWeight: 800, fontSize: 17, color: INK }}>بياناتك</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="الاسم الأول *" value={customer.firstName}
                    onChange={v => setCustomer(c => ({ ...c, firstName: v }))} placeholder="محمد" />
                  <Field label="اسم العائلة" value={customer.lastName}
                    onChange={v => setCustomer(c => ({ ...c, lastName: v }))} placeholder="الأحمد" />
                </div>
                <Field label="البريد الإلكتروني" value={customer.email} type="email"
                  onChange={v => setCustomer(c => ({ ...c, email: v }))} placeholder="name@example.com" />
                <PhoneField
                  dialCode={dialCode}
                  localPhone={localPhone}
                  onDialChange={setDialCode}
                  onLocalChange={setLocalPhone}
                />
                <Field label="الدولة *" value={customer.country}
                  onChange={v => setCustomer(c => ({ ...c, country: v }))} placeholder="الأردن" />
                <Field label="المدينة" value={customer.city}
                  onChange={v => setCustomer(c => ({ ...c, city: v }))} placeholder="عمّان" />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 14, fontSize: 14, color: '#dc2626', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              onClick={advanceToStep3}
              disabled={!customer.firstName || !localPhone}
              style={{ width: '100%', padding: '14px 0', background: !customer.firstName || !localPhone ? 'rgba(24,32,47,.25)' : DARK, color: '#fff', border: 'none', borderRadius: 14, fontFamily: F, fontWeight: 800, fontSize: 16, cursor: !customer.firstName || !localPhone ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              التالي <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 3: Review & Pay ───────────────────────── */}
        {step === 3 && (
          <div>
            <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 16, padding: '20px 24px', marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: 17, color: INK }}>ملخّص الطلب</h3>
              <Row label="الاسم" value={`${customer.firstName} ${customer.lastName}`.trim()} />
              {customer.email && <Row label="البريد" value={customer.email} />}
              <Row label="الهاتف" value={customer.phone} />
              <Row label="الدورة" value={`${courseName} — ${modeLabel}`} />
              <Row label="الدفعة" value={`#${cohort.id} · ${cohort.start_ar}`} />
              <div style={{ borderTop: `1px solid ${CREAM_LINE}`, marginTop: 12, paddingTop: 12 }}>
                {isLive ? (
                  <Row label="المبلغ المستحقّ" value={`$${totalUSD}`} bold />
                ) : plan === 'full' ? (
                  <Row label="المبلغ المستحقّ" value={`${totalJOD} د.أ (ما يعادل $${nowUSD})`} bold />
                ) : (
                  <>
                    <Row label="إجمالي الدورة" value={`${totalJOD} د.أ`} />
                    <Row label="تدفع الآن (حجز المقعد)" value={`${dep} د.أ (ما يعادل $${nowUSD})`} bold />
                    <Row label="يبقى بعد الحجز" value={`${totalJOD - dep} د.أ`} />
                  </>
                )}
              </div>
            </div>

            {showFxNotice && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(255,193,7,.09)', border: '1px solid rgba(255,193,7,.35)', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
                <Info size={17} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <b style={{ display: 'block', fontSize: 14, color: INK }}>سعر البرنامج: {plan === 'full' ? totalJOD : dep} ديناراً أردنياً</b>
                  <span style={{ display: 'block', fontSize: 13, color: INK2, marginTop: 3 }}>يُحصَّل ما يعادل <b>${nowUSD}</b> بالدولار الأمريكي</span>
                  <small style={{ display: 'block', fontSize: 12, color: INK2, marginTop: 4, opacity: .75 }}>قد يضيف بنكك عمولة تحويل عملة تتراوح بين 2% و3%</small>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 14, fontSize: 14, color: '#dc2626', fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              style={{ width: '100%', padding: '15px 0', background: loading ? 'rgba(24,32,47,.4)' : DARK, color: '#fff', border: 'none', borderRadius: 14, fontFamily: F, fontWeight: 800, fontSize: 16, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}
            >
              <Lock size={17} /> {loading ? 'جارٍ التوجيه…' : `ادفع الآن ← $${nowUSD}`}
            </button>

            {/* Alternative payment */}
            <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 14, padding: '16px 20px', marginBottom: 14 }}>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: INK }}>تفضّل الدفع بالدينار الأردني؟</p>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: INK2 }}>تحويل بنكي أو إي فواتيركم — تُرتّبه معك مستشارتك خلال دقائق.</p>
              <a
                href={`https://wa.me/${ADVISORS[modeParam].phone}?text=${encodeURIComponent('أرغب في التسجيل وأفضّل الدفع بالدينار الأردني')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.3)', borderRadius: 10, padding: '9px 16px', color: GREEN, fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}
              >
                <MessageCircle size={16} /> تحدّث مع {ADVISORS[modeParam].name} لترتيب الدفع
              </a>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', fontSize: 12.5, color: INK2, opacity: .75, marginBottom: 32 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Lock size={13} /> دفع آمن عبر Stripe</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><CreditCard size={13} /> فيزا · ماستركارد · Apple Pay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────
function PlanCard({ selected, onSelect, title, badge, rows, note }: {
  selected: boolean; onSelect: () => void; title: string;
  badge?: string; rows: { label: string; value: string; highlight?: boolean }[];
  note?: string;
}) {
  const CREAM_CARD = '#FDFCF8';
  const INK = '#18202F';
  const INK2 = '#4B5563';
  const CREAM_LINE = 'rgba(24,32,47,.1)';
  const F = "'Tajawal', 'Cairo', Arial, sans-serif";
  return (
    <div
      onClick={onSelect}
      style={{ background: CREAM_CARD, border: `2px solid ${selected ? INK : CREAM_LINE}`, borderRadius: 16, padding: '18px 20px', marginBottom: 12, cursor: 'pointer', transition: 'border-color .15s', position: 'relative' }}
    >
      {badge && (
        <span style={{ position: 'absolute', top: -10, right: 16, background: '#E6A817', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 20, fontFamily: F }}>
          {badge}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? INK : CREAM_LINE}`, background: selected ? INK : 'transparent', flexShrink: 0, transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: INK }}>{title}</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: r.highlight ? 15 : 13.5, fontWeight: r.highlight ? 800 : 500, color: r.highlight ? INK : INK2, borderTop: i > 0 ? `1px solid ${CREAM_LINE}` : 'none', paddingTop: i > 0 ? 8 : 0, marginTop: i > 0 ? 8 : 0 }}>
          <span>{r.label}</span>
          <span>{r.value}</span>
        </div>
      ))}
      {note && <p style={{ margin: '12px 0 0', fontSize: 12.5, color: INK2 }}>{note}</p>}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  const INK = '#18202F';
  const INK2 = '#4B5563';
  const CREAM_LINE = 'rgba(24,32,47,.1)';
  const F = "'Tajawal', 'Cairo', Arial, sans-serif";
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 10, fontFamily: F, fontSize: 14, color: INK, background: '#fff', boxSizing: 'border-box', outline: 'none', direction: 'rtl' }}
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  const INK = '#18202F';
  const INK2 = '#4B5563';
  const CREAM_LINE = 'rgba(24,32,47,.1)';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 15 : 14, fontWeight: bold ? 800 : 500, color: bold ? INK : INK2, marginBottom: 8 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

// ── PhoneField ────────────────────────────────────────────
// Country picker (flag + dial code) + numeric local input
// Drops leading zero automatically; font-size 16px prevents iOS zoom
function PhoneField({
  dialCode, localPhone, onDialChange, onLocalChange,
}: {
  dialCode: string;
  localPhone: string;
  onDialChange: (code: string) => void;
  onLocalChange: (local: string) => void;
}) {
  const INK  = '#18202F';
  const INK2 = '#4B5563';
  const CREAM_LINE = 'rgba(24,32,47,.1)';
  const F    = "'Tajawal', 'Cairo', Arial, sans-serif";

  const selected = DIAL_COUNTRIES.find(c => c && c.code === dialCode) as DialCountry | undefined;

  function handleLocalChange(val: string) {
    // Allow digits and common separators; we strip non-digits when building E.164
    const cleaned = val.replace(/[^\d\s\-()]/g, '');
    onLocalChange(cleaned);
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK2, marginBottom: 6 }}>
        رقم الهاتف (واتساب) *
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Country picker */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={dialCode}
            onChange={e => onDialChange(e.target.value)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '10px 32px 10px 10px',
              border: `1.5px solid ${CREAM_LINE}`,
              borderRadius: 10,
              fontFamily: F,
              fontSize: 14,
              color: INK,
              background: '#fff',
              cursor: 'pointer',
              minWidth: 110,
              direction: 'ltr',
            }}
          >
            {DIAL_COUNTRIES.map((c, i) =>
              c === null
                ? <option key={`sep-${i}`} disabled>──────────</option>
                : <option key={`${c.code}-${i}`} value={c.code}>{c.flag} +{c.code}</option>
            )}
          </select>
          <ChevronDown
            size={14}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: INK2, pointerEvents: 'none' }}
          />
        </div>

        {/* Number input */}
        <input
          type="tel"
          inputMode="numeric"
          value={localPhone}
          onChange={e => handleLocalChange(e.target.value)}
          placeholder={selected?.min === 9 ? '7xxxxxxxx' : selected?.min === 8 ? '8xxxxxxx' : 'xxxxxxxxxx'}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: `1.5px solid ${CREAM_LINE}`,
            borderRadius: 10,
            fontFamily: F,
            fontSize: 16, // 16px prevents iOS auto-zoom on focus
            color: INK,
            background: '#fff',
            direction: 'ltr',
            outline: 'none',
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: INK2, marginTop: 5, opacity: .75 }}>
        أدخل الرقم بدون الصفر الأوّل — مثال: {selected?.code === '962' ? '791234567' : '501234567'}
      </div>
    </div>
  );
}
