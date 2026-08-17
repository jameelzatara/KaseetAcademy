/**
 * PaymentModal — embedded Stripe Elements checkout for Kaseet masterclass pages.
 * Fully RTL, phone = dial-code selector + number input, email required, back button.
 */
import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise } from '../lib/stripeClient';
import {
  Lock, ShieldCheck, CheckCircle2, X, AlertCircle,
  MapPin, Wifi, User, Phone, Mail, CalendarDays, ArrowRight,
} from 'lucide-react';

/* ── design tokens ─────────────────────────────────── */
const GLD   = '#FFC107';
const BG    = '#0D1117';
const CARD  = '#131B27';
const CARD2 = '#1A2535';
const CBR   = 'rgba(255,255,255,0.08)';
const GL    = 'rgba(255,193,7,0.28)';
const GS    = 'rgba(255,193,7,0.08)';
const CYN   = '#67e8f9';
const CL    = 'rgba(103,232,249,0.22)';
const CS    = 'rgba(103,232,249,0.07)';
const F     = "'Tajawal', sans-serif";
const FP    = "'Plus Jakarta Sans', 'Tajawal', sans-serif";
const MUT   = '#8A97AE';
const OFF   = '#f8fafc';
const LT    = '#CBD5E1';
const ERR   = '#f87171';
const GRN   = '#4ade80';
const DEPOSIT_JOD = 50;
const DEPOSIT_USD = 70;

/* ── country data ───────────────────────────────────── */
interface Country { code: string; dial: string; name: string; flag: string; }
const COUNTRIES: Country[] = [
  { code:'JO', dial:'+962', name:'الأردن',             flag:'🇯🇴' },
  { code:'PS', dial:'+970', name:'فلسطين',             flag:'🇵🇸' },
  { code:'SA', dial:'+966', name:'السعودية',           flag:'🇸🇦' },
  { code:'AE', dial:'+971', name:'الإمارات',           flag:'🇦🇪' },
  { code:'KW', dial:'+965', name:'الكويت',             flag:'🇰🇼' },
  { code:'QA', dial:'+974', name:'قطر',                flag:'🇶🇦' },
  { code:'BH', dial:'+973', name:'البحرين',            flag:'🇧🇭' },
  { code:'OM', dial:'+968', name:'عُمان',              flag:'🇴🇲' },
  { code:'EG', dial:'+20',  name:'مصر',               flag:'🇪🇬' },
  { code:'SY', dial:'+963', name:'سوريا',              flag:'🇸🇾' },
  { code:'LB', dial:'+961', name:'لبنان',              flag:'🇱🇧' },
  { code:'IQ', dial:'+964', name:'العراق',             flag:'🇮🇶' },
  { code:'YE', dial:'+967', name:'اليمن',              flag:'🇾🇪' },
  { code:'LY', dial:'+218', name:'ليبيا',              flag:'🇱🇾' },
  { code:'TN', dial:'+216', name:'تونس',              flag:'🇹🇳' },
  { code:'DZ', dial:'+213', name:'الجزائر',            flag:'🇩🇿' },
  { code:'MA', dial:'+212', name:'المغرب',             flag:'🇲🇦' },
  { code:'SD', dial:'+249', name:'السودان',            flag:'🇸🇩' },
  { code:'SO', dial:'+252', name:'الصومال',            flag:'🇸🇴' },
  { code:'MR', dial:'+222', name:'موريتانيا',          flag:'🇲🇷' },
  { code:'DJ', dial:'+253', name:'جيبوتي',             flag:'🇩🇯' },
  { code:'KM', dial:'+269', name:'جزر القمر',          flag:'🇰🇲' },
  { code:'TR', dial:'+90',  name:'تركيا',              flag:'🇹🇷' },
  { code:'DE', dial:'+49',  name:'ألمانيا',            flag:'🇩🇪' },
  { code:'GB', dial:'+44',  name:'المملكة المتحدة',    flag:'🇬🇧' },
  { code:'US', dial:'+1',   name:'الولايات المتحدة',   flag:'🇺🇸' },
  { code:'CA', dial:'+1',   name:'كندا',               flag:'🇨🇦' },
  { code:'AU', dial:'+61',  name:'أستراليا',           flag:'🇦🇺' },
  { code:'FR', dial:'+33',  name:'فرنسا',              flag:'🇫🇷' },
  { code:'SE', dial:'+46',  name:'السويد',             flag:'🇸🇪' },
  { code:'NL', dial:'+31',  name:'هولندا',             flag:'🇳🇱' },
  { code:'BE', dial:'+32',  name:'بلجيكا',             flag:'🇧🇪' },
  { code:'IT', dial:'+39',  name:'إيطاليا',            flag:'🇮🇹' },
  { code:'ES', dial:'+34',  name:'إسبانيا',            flag:'🇪🇸' },
  { code:'PT', dial:'+351', name:'البرتغال',           flag:'🇵🇹' },
  { code:'GR', dial:'+30',  name:'اليونان',            flag:'🇬🇷' },
  { code:'PL', dial:'+48',  name:'بولندا',             flag:'🇵🇱' },
  { code:'AT', dial:'+43',  name:'النمسا',             flag:'🇦🇹' },
  { code:'CH', dial:'+41',  name:'سويسرا',             flag:'🇨🇭' },
  { code:'DK', dial:'+45',  name:'الدنمارك',           flag:'🇩🇰' },
  { code:'NO', dial:'+47',  name:'النرويج',            flag:'🇳🇴' },
  { code:'FI', dial:'+358', name:'فنلندا',             flag:'🇫🇮' },
  { code:'RU', dial:'+7',   name:'روسيا',              flag:'🇷🇺' },
  { code:'UA', dial:'+380', name:'أوكرانيا',           flag:'🇺🇦' },
  { code:'PK', dial:'+92',  name:'باكستان',            flag:'🇵🇰' },
  { code:'IN', dial:'+91',  name:'الهند',              flag:'🇮🇳' },
  { code:'BD', dial:'+880', name:'بنغلاديش',           flag:'🇧🇩' },
  { code:'MY', dial:'+60',  name:'ماليزيا',            flag:'🇲🇾' },
  { code:'ID', dial:'+62',  name:'إندونيسيا',          flag:'🇮🇩' },
  { code:'PH', dial:'+63',  name:'الفلبين',            flag:'🇵🇭' },
  { code:'SG', dial:'+65',  name:'سنغافورة',           flag:'🇸🇬' },
  { code:'TH', dial:'+66',  name:'تايلاند',            flag:'🇹🇭' },
  { code:'VN', dial:'+84',  name:'فيتنام',             flag:'🇻🇳' },
  { code:'CN', dial:'+86',  name:'الصين',              flag:'🇨🇳' },
  { code:'JP', dial:'+81',  name:'اليابان',            flag:'🇯🇵' },
  { code:'KR', dial:'+82',  name:'كوريا الجنوبية',     flag:'🇰🇷' },
  { code:'NG', dial:'+234', name:'نيجيريا',            flag:'🇳🇬' },
  { code:'GH', dial:'+233', name:'غانا',               flag:'🇬🇭' },
  { code:'KE', dial:'+254', name:'كينيا',              flag:'🇰🇪' },
  { code:'ZA', dial:'+27',  name:'جنوب أفريقيا',       flag:'🇿🇦' },
  { code:'ET', dial:'+251', name:'إثيوبيا',            flag:'🇪🇹' },
  { code:'TZ', dial:'+255', name:'تنزانيا',            flag:'🇹🇿' },
  { code:'BR', dial:'+55',  name:'البرازيل',           flag:'🇧🇷' },
  { code:'MX', dial:'+52',  name:'المكسيك',            flag:'🇲🇽' },
  { code:'AR', dial:'+54',  name:'الأرجنتين',          flag:'🇦🇷' },
  { code:'CO', dial:'+57',  name:'كولومبيا',           flag:'🇨🇴' },
  { code:'CL', dial:'+56',  name:'تشيلي',              flag:'🇨🇱' },
  { code:'NZ', dial:'+64',  name:'نيوزيلندا',          flag:'🇳🇿' },
  { code:'IR', dial:'+98',  name:'إيران',              flag:'🇮🇷' },
  { code:'AF', dial:'+93',  name:'أفغانستان',          flag:'🇦🇫' },
  { code:'NP', dial:'+977', name:'نيبال',              flag:'🇳🇵' },
  { code:'LK', dial:'+94',  name:'سريلانكا',           flag:'🇱🇰' },
  { code:'MM', dial:'+95',  name:'ميانمار',            flag:'🇲🇲' },
];

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug: string;
  courseTitle: string;
  cohortIdOnsite: number;
  cohortIdLive: number;
  cohortStartAr: string;
  cohortDays: string;
  cohortTimeAr: string;
  cohortTrainer: string;
  priceJOD: number;
  priceUSD: number;
  initialMode?: 'onsite' | 'live';
}

type Step = 'form' | 'payment' | 'polling' | 'pending' | 'success' | 'error';

interface FormState {
  firstName: string;
  lastName: string;
  dialCode: string;
  phoneNumber: string;
  email: string;
  country: string;
  mode: 'onsite' | 'live';
  plan: 'full' | 'deposit';
}

/* ── Progress stepper ──────────────────────────────── */
function Stepper({ step }: { step: Step }) {
  const current = step === 'form' ? 1 : step === 'payment' ? 2 : 3;
  // In RTL the first step (بياناتك) is shown first in DOM which renders on the RIGHT
  const steps = ['بياناتك', 'الدفع', 'تم الحجز'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24, direction: 'rtl' }}>
      {steps.map((label, i) => {
        const idx    = i + 1;
        const done   = idx < current;
        const active = idx === current;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? GRN : active ? GLD : 'rgba(255,255,255,.08)',
                border: `2px solid ${done ? GRN : active ? GLD : CBR}`,
                transition: 'all .3s',
              }}>
                {done
                  ? <CheckCircle2 size={14} color="#0F1A2E" strokeWidth={2.5} />
                  : <span style={{ fontFamily: FP, fontSize: 11, fontWeight: 800, color: active ? '#0F1A2E' : MUT }}>{idx}</span>
                }
              </div>
              <span style={{ fontFamily: F, fontSize: 11, color: active ? GLD : done ? GRN : MUT, fontWeight: active ? 700 : 400 }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 44, height: 2, background: i + 1 < current ? GRN : CBR, margin: '0 6px', marginBottom: 18, transition: 'background .3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Order summary card ────────────────────────────── */
function OrderSummary({
  courseTitle, mode, cohortStartAr, cohortDays, priceJOD, priceUSD, plan,
}: {
  courseTitle: string; mode: 'onsite' | 'live';
  cohortStartAr: string; cohortDays: string;
  priceJOD: number; priceUSD: number; plan: 'full' | 'deposit';
}) {
  const isOnsite  = mode === 'onsite';
  const accentCol = isOnsite ? GLD : CYN;
  const charge    = isOnsite
    ? (plan === 'deposit' ? `${DEPOSIT_JOD} JOD الآن` : `${priceJOD} JOD`)
    : `$${priceUSD}`;

  return (
    <div style={{
      background: isOnsite ? GS : CS, border: `1px solid ${isOnsite ? GL : CL}`,
      borderRadius: 14, padding: '14px 16px', marginBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{courseTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            {isOnsite
              ? <MapPin size={11} color={accentCol} strokeWidth={2.5} />
              : <Wifi size={11} color={accentCol} strokeWidth={2.5} />
            }
            <span style={{ fontFamily: F, fontSize: 12, color: accentCol, fontWeight: 700 }}>
              {isOnsite ? 'حضوري · استوديو كاسيت' : 'مباشر تفاعلي · Online LIVE'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <CalendarDays size={11} color={MUT} strokeWidth={2} />
            <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>يبدأ {cohortStartAr} · {cohortDays}</span>
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'left' }}>
          <div style={{ fontFamily: FP, fontSize: 22, fontWeight: 800, color: accentCol, lineHeight: 1 }}>{charge}</div>
          {isOnsite && plan === 'deposit' && (
            <div style={{ fontFamily: F, fontSize: 11, color: MUT, marginTop: 3 }}>والباقي {priceJOD - DEPOSIT_JOD} JOD لاحقاً</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Custom text field ─────────────────────────────── */
function Field({
  icon, placeholder, value, onChange, type = 'text', inputDir = 'rtl', required,
}: {
  icon: React.ReactNode; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string; inputDir?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: CARD2, border: `1.5px solid ${focused ? GLD : CBR}`,
      borderRadius: 12, padding: '12px 14px', transition: 'border-color .2s',
    }}>
      <span style={{ color: focused ? GLD : MUT, flexShrink: 0, display: 'flex', transition: 'color .2s' }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder + (required ? ' *' : '')}
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={inputDir}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: F, fontSize: 14, color: OFF, minWidth: 0,
        } as CSSProperties}
      />
    </div>
  );
}

/* ── Phone field: dial-code selector + number input ── */
function PhoneField({
  dialCode, phoneNumber, onDialChange, onNumberChange,
}: {
  dialCode: string; phoneNumber: string;
  onDialChange: (v: string) => void; onNumberChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const selected = COUNTRIES.find(c => c.dial === dialCode) ?? COUNTRIES[0];

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: CARD2, border: `1.5px solid ${focused ? GLD : CBR}`,
      borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s',
    }}>
      {/* dial-code selector */}
      <div style={{ position: 'relative', flexShrink: 0, borderLeft: `1px solid ${CBR}` }}>
        <select
          value={dialCode}
          onChange={e => onDialChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            appearance: 'none', background: 'transparent', border: 'none', outline: 'none',
            fontFamily: F, fontSize: 13, color: OFF, padding: '12px 8px 12px 28px',
            cursor: 'pointer', direction: 'rtl', paddingRight: 8,
          } as CSSProperties}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.dial} style={{ background: '#1A2535', color: OFF }}>
              {c.flag} {c.name} ({c.dial})
            </option>
          ))}
        </select>
        {/* display: flag + dial code, with chevron */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          padding: '0 6px 0 4px', gap: 4, pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 16 }}>{selected.flag}</span>
          <span style={{ fontFamily: FP, fontSize: 12.5, color: LT, fontWeight: 600 }}>{selected.dial}</span>
          <span style={{ color: MUT, fontSize: 10, marginRight: 2 }}>▾</span>
        </div>
      </div>

      {/* phone number input */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 8, padding: '0 12px' }}>
        <Phone size={14} color={focused ? GLD : MUT} style={{ flexShrink: 0, transition: 'color .2s' }} />
        <input
          type="tel"
          placeholder="رقم الجوال *"
          value={phoneNumber}
          onChange={e => onNumberChange(e.target.value)}
          dir="ltr"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: F, fontSize: 14, color: OFF, minWidth: 0,
          } as CSSProperties}
        />
      </div>
    </div>
  );
}

/* ── Country select dropdown ───────────────────────── */
function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 10,
      background: CARD2, border: `1.5px solid ${focused ? GLD : CBR}`,
      borderRadius: 12, padding: '12px 14px', transition: 'border-color .2s',
    }}>
      <span style={{ color: focused ? GLD : MUT, flexShrink: 0, display: 'flex', fontSize: 15, transition: 'color .2s' }}>🌍</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, appearance: 'none', background: 'transparent', border: 'none', outline: 'none',
          fontFamily: F, fontSize: 14, color: value ? OFF : MUT,
          cursor: 'pointer', direction: 'rtl', minWidth: 0,
        } as CSSProperties}
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.name} style={{ background: '#1A2535', color: OFF }}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
      <span style={{ color: MUT, fontSize: 11, flexShrink: 0 }}>▾</span>
    </div>
  );
}

/* ── Stripe payment form ────────────────────────────── */
function StripePaymentForm({
  priceJOD, priceUSD, plan, mode, onSuccess, onError, onBack,
}: {
  priceJOD: number; priceUSD: number;
  plan: 'full' | 'deposit'; mode: 'onsite' | 'live';
  onSuccess: () => void; onError: (msg: string) => void; onBack: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);
  const [ready, setReady]   = useState(false);

  const chargeAmount = mode === 'live'
    ? `$${priceUSD}`
    : plan === 'deposit' ? `${DEPOSIT_JOD} ديناراً` : `${priceJOD} ديناراً`;

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true); setPayErr(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href.split('?')[0] + '?payment_return=1' },
      redirect: 'if_required',
    });
    if (error) {
      const msg = error.message ?? 'حدث خطأ غير متوقع — حاول مجدداً.';
      setPayErr(msg); setPaying(false); onError(msg);
    } else {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* security bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '12px 14px' }}>
        <Lock size={16} color={GLD} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>دفع آمن عبر Stripe</div>
          <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>بياناتك مشفَّرة ولا تمرّ بخوادمنا إطلاقاً</div>
        </div>
      </div>

      <PaymentElement onReady={() => setReady(true)} options={{ layout: 'tabs' }} />

      {payErr && (
        <div style={{ display: 'flex', gap: 9, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 10, padding: '10px 14px' }}>
          <AlertCircle size={16} color={ERR} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: F, fontSize: 13.5, color: ERR }}>{payErr}</span>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={paying || !ready}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', background: (paying || !ready) ? '#5a4a10' : GLD, color: '#0F1A2E',
          fontFamily: FP, fontWeight: 800, fontSize: 16, padding: '15px 24px',
          borderRadius: 14, border: 'none', cursor: (paying || !ready) ? 'not-allowed' : 'pointer',
          boxShadow: (paying || !ready) ? 'none' : '0 8px 24px rgba(255,193,7,.28)',
          transition: 'all .2s',
        }}
      >
        <Lock size={15} />
        {paying ? 'جاري المعالجة...' : `ادفع ${chargeAmount} وثبّت مقعدك`}
      </button>

      {/* back button */}
      <button
        onClick={onBack}
        disabled={paying}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', background: 'transparent', color: MUT,
          fontFamily: F, fontWeight: 600, fontSize: 13.5, padding: '10px 16px',
          borderRadius: 10, border: `1px solid ${CBR}`, cursor: paying ? 'not-allowed' : 'pointer',
          transition: 'all .2s',
        }}
      >
        <ArrowRight size={14} />
        العودة وتعديل البيانات
      </button>

      {/* assurance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {['ضمان الجلسة الأولى — استرداد كامل خلال 24 ساعة', 'يصلك تأكيد التسجيل فور الدفع على بريدك', 'مقعدك محجوز لك وحدك'].map(line => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12.5, color: LT }}>
            <CheckCircle2 size={13} color={GLD} style={{ flexShrink: 0 }} /> {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── main modal ────────────────────────────────────── */
export default function PaymentModal({
  isOpen, onClose,
  courseSlug, courseTitle,
  cohortIdOnsite, cohortIdLive,
  cohortStartAr, cohortDays, cohortTimeAr, cohortTrainer,
  priceJOD, priceUSD,
  initialMode = 'onsite',
}: PaymentModalProps) {
  const [step, setStep]             = useState<Step>('form');
  const [form, setForm]             = useState<FormState>({
    firstName: '', lastName: '', dialCode: '+962', phoneNumber: '',
    email: '', country: 'الأردن', mode: initialMode, plan: 'deposit',
  });
  const [loading, setLoading]       = useState(false);
  const [formErr, setFormErr]       = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piId, setPiId]             = useState<string | null>(null);
  const [orderId, setOrderId]       = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paidCurrency, setPaidCurrency] = useState<string>('JOD');
  const [remaining, setRemaining]   = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      const params       = new URLSearchParams(window.location.search);
      const returnPiId   = params.get('payment_intent');
      const returnStatus = params.get('redirect_status');
      if (returnPiId && returnStatus === 'succeeded') {
        setPiId(returnPiId); setStep('polling'); pollOrder(returnPiId);
      } else {
        setStep('form'); setClientSecret(null); setPiId(null);
        setOrderId(null); setFormErr(null); setLoading(false);
        setForm(f => ({ ...f, mode: initialMode, plan: initialMode === 'live' ? 'full' : 'deposit' }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const pollOrder = useCallback(async (paymentIntentId: string) => {
    setStep('polling');
    try {
      for (let i = 0; i < 18; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const res  = await fetch(`/api/checkout/pi-status?pi_id=${encodeURIComponent(paymentIntentId)}`);
        if (!res.ok) continue;
        const data = await res.json() as {
          status: string;
          order?: { id: string; paidJOD: number; remainingJOD: number; totalUSD: number; mode: string; plan: string };
        };
        if (data.status === 'paid_full' || data.status === 'deposit_paid') {
          if (data.order) {
            setOrderId(data.order.id);
            if (data.order.mode === 'live') {
              setPaidAmount(data.order.totalUSD); setPaidCurrency('USD'); setRemaining(0);
            } else {
              setPaidAmount(data.order.paidJOD); setPaidCurrency('JOD'); setRemaining(data.order.remainingJOD);
            }
          }
          setStep('success'); return;
        }
        if (data.status === 'failed' || data.status === 'refunded') { setStep('error'); return; }
      }
      setStep('pending');
    } catch { setStep('pending'); }
  }, []);

  const handleFormSubmit = async () => {
    const fullPhone = (form.dialCode + form.phoneNumber.trim()).replace(/\s+/g, '');
    if (!form.firstName.trim()) {
      setFormErr('الاسم الأول إلزامي'); return;
    }
    if (!form.phoneNumber.trim()) {
      setFormErr('رقم الجوال إلزامي'); return;
    }
    if (!form.email.trim()) {
      setFormErr('البريد الإلكتروني إلزامي'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormErr('البريد الإلكتروني غير صحيح'); return;
    }
    setFormErr(null); setLoading(true);
    try {
      const cohortId = form.mode === 'onsite' ? cohortIdOnsite : cohortIdLive;
      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId, courseSlug, mode: form.mode,
          plan: form.mode === 'live' ? 'full' : form.plan,
          cohortStartAr, cohortDays, cohortTimeAr, cohortTrainer,
          cohortPlatform: form.mode === 'onsite' ? 'استوديو كاسيت' : 'Google Meet',
          customer: {
            firstName: form.firstName.trim(),
            lastName:  form.lastName.trim() || undefined,
            phone:     fullPhone,
            email:     form.email.trim(),
            country:   form.country || 'الأردن',
          },
        }),
      });
      const data = await res.json() as { clientSecret?: string; paymentIntentId?: string; orderId?: string; error?: string };
      if (!res.ok || !data.clientSecret) {
        setFormErr(data.error ?? 'حدث خطأ — حاول مجدداً'); setLoading(false); return;
      }
      setClientSecret(data.clientSecret);
      setPiId(data.paymentIntentId ?? null);
      setOrderId(data.orderId ?? null);
      if (form.mode === 'live') {
        setPaidAmount(priceUSD); setPaidCurrency('USD'); setRemaining(0);
      } else if (form.plan === 'deposit') {
        setPaidAmount(DEPOSIT_JOD); setPaidCurrency('JOD'); setRemaining(priceJOD - DEPOSIT_JOD);
      } else {
        setPaidAmount(priceJOD); setPaidCurrency('JOD'); setRemaining(0);
      }
      setStep('payment');
    } catch {
      setFormErr('تعذّر الاتصال بالخادم — تحقق من اتصالك وحاول مجدداً');
    }
    setLoading(false);
  };

  const handlePaySuccess = useCallback(() => {
    if (piId) pollOrder(piId);
  }, [piId, pollOrder]);

  const handleBack = useCallback(() => {
    setStep('form');
    setClientSecret(null);
  }, []);

  const stripeAppearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: GLD, colorBackground: '#1A2535', colorText: '#FFFFFF',
      colorDanger: '#C2453C', fontFamily: 'Tajawal, sans-serif',
      borderRadius: '12px', spacingUnit: '4px',
    },
  };

  if (!isOpen) return null;

  const isOnsite = form.mode === 'onsite';

  return (
    <>
      {/* single overlay — closes on backdrop click, centers the card */}
      <div
        onClick={onClose}
        dir="rtl"
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
      >
        {/* modal card — stops click propagation so clicking inside doesn't close modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: BG, border: `1px solid ${CBR}`, borderRadius: 24,
            width: '100%', maxWidth: 520, maxHeight: '92dvh', overflowY: 'auto',
            boxShadow: '0 40px 100px rgba(0,0,0,0.75)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* ── sticky header ── */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10, background: BG,
            borderBottom: `1px solid ${CBR}`, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: GS,
                border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0,
              }}>
                <Lock size={15} color={GLD} />
              </div>
              <div>
                <div style={{ fontFamily: FP, fontSize: 14.5, fontWeight: 800, color: OFF }}>حجز مقعد في الماستركلاس</div>
                <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 1 }}>دفع آمن عبر Stripe</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,.06)', border: `1px solid ${CBR}`,
                cursor: 'pointer', color: MUT, padding: 7, borderRadius: 9,
                display: 'flex', transition: 'background .2s', flexShrink: 0,
              }}
              aria-label="إغلاق"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── scrollable body ── */}
          <div style={{ padding: '22px 20px 28px', flex: 1 }}>

            {(step === 'form' || step === 'payment' || step === 'success') && (
              <Stepper step={step} />
            )}

            {/* ── STEP 1: FORM ──────────────────────── */}
            {step === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ① أسلوب التعلّم */}
                <div>
                  <SectionLabel>① أسلوب التعلّم</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* حضوري */}
                    <button
                      onClick={() => setForm(f => ({ ...f, mode: 'onsite' }))}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 12,
                        background: form.mode === 'onsite' ? GS : CARD,
                        border: `2px solid ${form.mode === 'onsite' ? GLD : CBR}`,
                        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                        transition: 'all .2s', textAlign: 'right',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${form.mode === 'onsite' ? GLD : MUT}`,
                          background: form.mode === 'onsite' ? GLD : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all .2s',
                        }}>
                          {form.mode === 'onsite' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                        </div>
                        <div style={{ textAlign: 'right', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <MapPin size={12} color={form.mode === 'onsite' ? GLD : MUT} strokeWidth={2.2} />
                            <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.mode === 'onsite' ? OFF : LT }}>حضوري</span>
                          </div>
                          <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 2 }}>استوديو كاسيت · عمّان · {cohortStartAr}</div>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'left' }}>
                        <div style={{ fontFamily: FP, fontSize: 20, fontWeight: 700, color: form.mode === 'onsite' ? GLD : LT, lineHeight: 1 }}>{priceJOD}</div>
                        <div style={{ fontFamily: F, fontSize: 11, color: MUT }}>JOD</div>
                      </div>
                    </button>

                    {/* مباشر تفاعلي */}
                    <button
                      onClick={() => setForm(f => ({ ...f, mode: 'live', plan: 'full' }))}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 12,
                        background: form.mode === 'live' ? CS : CARD,
                        border: `2px solid ${form.mode === 'live' ? CYN : CBR}`,
                        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                        transition: 'all .2s', textAlign: 'right',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${form.mode === 'live' ? CYN : MUT}`,
                          background: form.mode === 'live' ? CYN : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all .2s',
                        }}>
                          {form.mode === 'live' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                        </div>
                        <div style={{ textAlign: 'right', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <Wifi size={12} color={form.mode === 'live' ? CYN : MUT} strokeWidth={2.2} />
                            <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.mode === 'live' ? OFF : LT }}>مباشر تفاعلي</span>
                            <span style={{ fontFamily: F, fontSize: 10, color: CYN, background: CS, border: `1px solid ${CL}`, padding: '1px 6px', borderRadius: 999 }}>Online LIVE</span>
                          </div>
                          <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 2 }}>عن بُعد من أي مكان · {cohortStartAr}</div>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'left' }}>
                        <div style={{ fontFamily: FP, fontSize: 20, fontWeight: 700, color: form.mode === 'live' ? CYN : LT, lineHeight: 1 }}>${priceUSD}</div>
                        <div style={{ fontFamily: F, fontSize: 11, color: MUT }}>USD</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ② خطة الدفع (حضوري فقط) */}
                {isOnsite && (
                  <div>
                    <SectionLabel>② خطّة الدفع</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* تقسيط */}
                      <button
                        onClick={() => setForm(f => ({ ...f, plan: 'deposit' }))}
                        style={{
                          width: '100%', background: form.plan === 'deposit' ? GS : CARD,
                          border: `2px solid ${form.plan === 'deposit' ? GLD : CBR}`,
                          borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                          transition: 'all .2s', textAlign: 'right',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                            border: `2px solid ${form.plan === 'deposit' ? GLD : MUT}`,
                            background: form.plan === 'deposit' ? GLD : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all .2s',
                          }}>
                            {form.plan === 'deposit' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.plan === 'deposit' ? OFF : LT }}>تقسيط مريح</span>
                              <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, background: GLD, color: '#0F1A2E', padding: '2px 8px', borderRadius: 999 }}>موصى به</span>
                            </div>
                            <div style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                              ادفع <strong style={{ color: GLD }}>{DEPOSIT_JOD} ديناراً</strong> الآن · والباقي {priceJOD - DEPOSIT_JOD} على دفعتين أثناء الدورة
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                              {['بلا فوائد', 'بلا رسوم إضافية'].map(t => (
                                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: MUT }}>
                                  <CheckCircle2 size={11} color={GRN} /> {t}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* دفعة واحدة */}
                      <button
                        onClick={() => setForm(f => ({ ...f, plan: 'full' }))}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                          background: form.plan === 'full' ? GS : CARD,
                          border: `2px solid ${form.plan === 'full' ? GLD : CBR}`,
                          borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                          transition: 'all .2s', textAlign: 'right',
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${form.plan === 'full' ? GLD : MUT}`,
                          background: form.plan === 'full' ? GLD : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all .2s',
                        }}>
                          {form.plan === 'full' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.plan === 'full' ? OFF : LT }}>دفعة واحدة</div>
                          <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 2 }}>{priceJOD} دينار كاملة</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* بياناتك */}
                <div>
                  <SectionLabel>{isOnsite ? '③' : '②'} بياناتك</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* الاسم */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <Field icon={<User size={15} />} placeholder="الاسم الأول" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} required />
                      <Field icon={<User size={15} />} placeholder="اسم العائلة" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} />
                    </div>

                    {/* الهاتف */}
                    <PhoneField
                      dialCode={form.dialCode}
                      phoneNumber={form.phoneNumber}
                      onDialChange={v => {
                        const c = COUNTRIES.find(x => x.dial === v);
                        setForm(f => ({ ...f, dialCode: v, country: c?.name ?? f.country }));
                      }}
                      onNumberChange={v => setForm(f => ({ ...f, phoneNumber: v }))}
                    />

                    {/* البريد */}
                    <Field
                      icon={<Mail size={15} />}
                      placeholder="البريد الإلكتروني"
                      value={form.email}
                      onChange={v => setForm(f => ({ ...f, email: v }))}
                      type="email"
                      inputDir="ltr"
                      required
                    />

                    {/* الدولة */}
                    <CountrySelect
                      value={form.country}
                      onChange={v => setForm(f => ({ ...f, country: v }))}
                    />
                  </div>
                </div>

                {/* ملخص الطلب */}
                <OrderSummary
                  courseTitle={courseTitle} mode={form.mode}
                  cohortStartAr={cohortStartAr} cohortDays={cohortDays}
                  priceJOD={priceJOD} priceUSD={priceUSD} plan={form.plan}
                />

                {/* خطأ */}
                {formErr && (
                  <div style={{ display: 'flex', gap: 10, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.28)', borderRadius: 12, padding: '12px 14px' }}>
                    <AlertCircle size={18} color={ERR} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: ERR, lineHeight: 1.5 }}>{formErr}</span>
                  </div>
                )}

                {/* زر المتابعة */}
                <div>
                  <button
                    onClick={handleFormSubmit}
                    disabled={loading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                      width: '100%', background: loading ? '#5a4a10' : GLD, color: '#0F1A2E',
                      fontFamily: FP, fontWeight: 800, fontSize: 16, padding: '15px 24px',
                      borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 8px 26px rgba(255,193,7,.30)',
                      transition: 'all .2s',
                    }}
                  >
                    <Lock size={15} />
                    {loading ? 'جاري التحضير...' : 'متابعة للدفع'}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F, fontSize: 11, color: MUT, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={10} color={MUT} /> مشفّر 100% عبر Stripe
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="30" height="10" viewBox="0 0 48 16"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="50%" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#fff">VISA</text></svg>
                      <svg width="20" height="13" viewBox="0 0 34 22"><circle cx="12" cy="11" r="11" fill="#EB001B"/><circle cx="22" cy="11" r="11" fill="#F79E1B"/><path d="M17 4.3a11 11 0 0 1 0 13.4A11 11 0 0 1 17 4.3z" fill="#FF5F00"/></svg>
                      <svg width="34" height="12" viewBox="0 0 50 20"><rect width="50" height="20" rx="4" fill="#000"/><text x="50%" y="14.5" textAnchor="middle" fontFamily="'-apple-system',sans-serif" fontWeight="600" fontSize="10" fill="#fff">Apple Pay</text></svg>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── STEP 2: STRIPE ELEMENTS ──────────── */}
            {step === 'payment' && clientSecret && (
              <Elements stripe={getStripePromise()} options={{ clientSecret, locale: 'ar', appearance: stripeAppearance }}>
                <StripePaymentForm
                  priceJOD={priceJOD} priceUSD={priceUSD}
                  plan={form.plan} mode={form.mode}
                  onSuccess={handlePaySuccess}
                  onError={() => setStep('error')}
                  onBack={handleBack}
                />
              </Elements>
            )}

            {/* ── POLLING ──────────────────────────── */}
            {(step === 'polling' || (step === 'payment' && !clientSecret)) && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', border: `3px solid ${CBR}`, borderTopColor: GLD, margin: '0 auto 18px', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: OFF }}>جاري تأكيد الدفع…</div>
                <div style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6 }}>قد يستغرق لحظة — لا تغلق هذه النافذة</div>
              </div>
            )}

            {/* ── SUCCESS ──────────────────────────── */}
            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(74,222,128,.10)', border: `2px solid rgba(74,222,128,.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={30} color={GRN} strokeWidth={2} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 22, fontWeight: 800, color: OFF, marginBottom: 4 }}>تمّ تثبيت مقعدك! 🎉</div>
                <div style={{ fontFamily: F, fontSize: 14, color: MUT, marginBottom: 22 }}>مرحباً بك في ماستركلاس كاسيت</div>
                {orderId && (
                  <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 18 }}>
                    رقم الطلب: <span style={{ color: GLD, fontWeight: 700 }}>{orderId}</span>
                  </div>
                )}
                <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px 18px', textAlign: 'right', marginBottom: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {[
                      { icon: <CalendarDays size={14} color={GLD} />, text: `يبدأ ${cohortStartAr} · ${cohortDays} · ${cohortTimeAr}` },
                      { icon: <User size={14} color={GLD} />, text: `المدرّب: ${cohortTrainer}` },
                      ...(paidAmount > 0 ? [{
                        icon: <CheckCircle2 size={14} color={GRN} />,
                        text: `المدفوع: ${paidAmount} ${paidCurrency}${remaining > 0 ? ` · المتبقّي: ${remaining} JOD` : ''}`,
                      }] : []),
                    ].map(({ icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: F, fontSize: 13.5, color: LT }}>
                        {icon} {text}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.8, marginBottom: 22 }}>
                  📧 أرسلنا إيصال الدفع وتفاصيل التسجيل إلى بريدك.<br />
                  لم يصلك؟ تفقّد مجلد الرسائل غير المرغوب فيها.
                </div>
                <button onClick={onClose} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 32px', cursor: 'pointer' }}>
                  إغلاق
                </button>
              </div>
            )}

            {/* ── PENDING ──────────────────────────── */}
            {step === 'pending' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,193,7,.10)', border: `2px solid ${GL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ShieldCheck size={30} color={GLD} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 19, fontWeight: 800, color: OFF, marginBottom: 8 }}>الدفع قيد المعالجة</div>
                <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.85, maxWidth: 340, marginInline: 'auto', marginBottom: 20 }}>
                  تلقّينا طلبك — سنُرسل إليك إيصال التسجيل فور تأكيد الدفع. عادةً لا يتجاوز ذلك دقيقة واحدة.
                </div>
                {orderId && <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 18 }}>رقم الطلب: <span style={{ color: GLD, fontWeight: 700 }}>{orderId}</span></div>}
                <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 12, padding: '14px 18px', textAlign: 'right', marginBottom: 24 }}>
                  <div style={{ fontFamily: F, fontSize: 13, color: MUT }}>لم يصلك إيصال خلال 5 دقائق؟ تواصل معنا:</div>
                  <a href="https://wa.me/962771052222" target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontFamily: F, fontSize: 13.5, fontWeight: 700, color: '#25D366', textDecoration: 'none' }}>
                    واتساب كاسيت (+962 77 105 2222)
                  </a>
                </div>
                <button onClick={onClose} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 32px', cursor: 'pointer' }}>إغلاق</button>
              </div>
            )}

            {/* ── ERROR ────────────────────────────── */}
            {step === 'error' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(248,113,113,.10)', border: '2px solid rgba(248,113,113,.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <AlertCircle size={30} color={ERR} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 18, fontWeight: 800, color: ERR, marginBottom: 10 }}>تعذّر إتمام الدفع</div>
                <div style={{ fontFamily: F, fontSize: 14, color: MUT, marginBottom: 24, lineHeight: 1.8 }}>
                  يرجى المحاولة مرة أخرى أو التواصل مع المستشارة عبر واتساب.
                </div>
                <button onClick={() => setStep('form')} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '11px 32px', cursor: 'pointer' }}>حاول مجدداً</button>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #8A97AE; }
        select option { background: #1A2535; color: #f8fafc; }
      `}</style>
    </>
  );
}

/* ── small section label ─────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 10 }}>
      {children}
    </div>
  );
}
