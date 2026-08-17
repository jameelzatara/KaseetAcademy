/**
 * PaymentModal — embedded Stripe Elements checkout for Kaseet masterclass pages.
 * Redesigned: custom mode/plan cards, order summary, progress stepper, icon fields.
 */
import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise } from '../lib/stripeClient';
import {
  Lock, ShieldCheck, CheckCircle2, X, AlertCircle,
  MapPin, Wifi, User, Phone, Mail, Globe, Building2,
  CalendarDays, ArrowLeft,
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
  phone: string;
  email: string;
  country: string;
  city: string;
  mode: 'onsite' | 'live';
  plan: 'full' | 'deposit';
}

/* ── Progress stepper ──────────────────────────────── */
function Stepper({ step }: { step: Step }) {
  const current = step === 'form' ? 1 : step === 'payment' ? 2 : 3;
  const steps = ['بياناتك', 'الدفع', 'تم الحجز'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
      {steps.map((label, i) => {
        const idx   = i + 1;
        const done  = idx < current;
        const active = idx === current;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              <div style={{ width: 48, height: 2, background: i + 1 < current ? GRN : CBR, margin: '0 4px', marginBottom: 18, transition: 'background .3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Order summary card ────────────────────────────── */
function OrderSummary({
  courseTitle, mode, cohortStartAr, cohortDays,
  priceJOD, priceUSD, plan,
}: {
  courseTitle: string; mode: 'onsite' | 'live';
  cohortStartAr: string; cohortDays: string;
  priceJOD: number; priceUSD: number;
  plan: 'full' | 'deposit';
}) {
  const isOnsite  = mode === 'onsite';
  const accentCol = isOnsite ? GLD : CYN;
  const charge    = isOnsite
    ? (plan === 'deposit' ? `${DEPOSIT_JOD} JOD الآن` : `${priceJOD} JOD`)
    : `$${priceUSD}`;

  return (
    <div style={{
      background: isOnsite ? GS : CS,
      border: `1px solid ${isOnsite ? GL : CL}`,
      borderRadius: 14, padding: '14px 16px', marginBottom: 22,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
    }}>
      <div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: OFF }}>{courseTitle}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
          {isOnsite
            ? <MapPin size={12} color={accentCol} strokeWidth={2.5} />
            : <Wifi size={12} color={accentCol} strokeWidth={2.5} />
          }
          <span style={{ fontFamily: F, fontSize: 12.5, color: accentCol, fontWeight: 700 }}>
            {isOnsite ? 'حضوري · استوديو كاسيت' : 'مباشر تفاعلي · Online LIVE'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <CalendarDays size={12} color={MUT} strokeWidth={2} />
          <span style={{ fontFamily: F, fontSize: 12, color: MUT }}>يبدأ {cohortStartAr} · {cohortDays}</span>
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontFamily: FP, fontSize: 22, fontWeight: 800, color: accentCol, lineHeight: 1 }}>{charge}</div>
        {isOnsite && plan === 'deposit' && (
          <div style={{ fontFamily: F, fontSize: 11, color: MUT, marginTop: 3 }}>والباقي {priceJOD - DEPOSIT_JOD} JOD لاحقاً</div>
        )}
      </div>
    </div>
  );
}

/* ── custom input field ────────────────────────────── */
function Field({
  icon, placeholder, value, onChange, type = 'text', dir = 'rtl', required,
}: {
  icon: React.ReactNode; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string; dir?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: CARD2, border: `1px solid ${focused ? GL : CBR}`,
      borderRadius: 12, padding: '11px 14px', transition: 'border-color .2s',
    }}>
      <span style={{ color: focused ? GLD : MUT, flexShrink: 0, display: 'flex', transition: 'color .2s' }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder + (required ? ' *' : '')}
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={dir}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: F, fontSize: 14, color: OFF,
          '::placeholder': { color: MUT },
        } as CSSProperties}
      />
    </div>
  );
}

/* ── Stripe payment form ────────────────────────────── */
function StripePaymentForm({
  priceJOD, priceUSD, plan, mode, onSuccess, onError,
}: {
  priceJOD: number; priceUSD: number;
  plan: 'full' | 'deposit'; mode: 'onsite' | 'live';
  onSuccess: () => void; onError: (msg: string) => void;
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
    firstName: '', lastName: '', phone: '', email: '',
    country: 'الأردن', city: '', mode: initialMode, plan: 'deposit',
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
        setForm(f => ({ ...f, mode: initialMode }));
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
    if (!form.firstName.trim() || !form.phone.trim()) {
      setFormErr('الاسم الأول ورقم الجوال إلزاميان'); return;
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
            phone:     form.phone.trim(),
            email:     form.email.trim() || undefined,
            country:   form.country || 'الأردن',
            city:      form.city.trim() || undefined,
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
      {/* backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.76)', zIndex: 1000, backdropFilter: 'blur(6px)' }} />

      {/* panel */}
      <div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: BG, border: `1px solid ${CBR}`, borderRadius: 24,
            width: '100%', maxWidth: 520, maxHeight: '92dvh', overflowY: 'auto',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7)', pointerEvents: 'auto',
          }}
        >
          {/* ── modal header ── */}
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: BG, borderBottom: `1px solid ${CBR}`, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', align: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', marginLeft: 10 }}>
                <Lock size={15} color={GLD} />
              </div>
              <div>
                <div style={{ fontFamily: FP, fontSize: 14.5, fontWeight: 800, color: OFF }}>حجز مقعد في الماستركلاس</div>
                <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 1 }}>دفع آمن عبر Stripe</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${CBR}`, cursor: 'pointer', color: MUT, padding: 7, borderRadius: 9, display: 'flex', transition: 'background .2s' }} aria-label="إغلاق">
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '22px 22px 28px' }}>

            {/* stepper — form/payment/success steps */}
            {(step === 'form' || step === 'payment' || step === 'success') && (
              <Stepper step={step} />
            )}

            {/* ── STEP 1: FORM ──────────────────────── */}
            {step === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                {/* ① أسلوب التعلّم — Mode Cards */}
                <div>
                  <SectionLabel>① أسلوب التعلّم</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* حضوري */}
                    <button
                      onClick={() => setForm(f => ({ ...f, mode: 'onsite' }))}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: form.mode === 'onsite' ? GS : CARD,
                        border: `2px solid ${form.mode === 'onsite' ? GLD : CBR}`,
                        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                        transition: 'all .2s', textAlign: 'right',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        {/* custom radio dot */}
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', border: `2px solid ${form.mode === 'onsite' ? GLD : MUT}`,
                          background: form.mode === 'onsite' ? GLD : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          transition: 'all .2s',
                        }}>
                          {form.mode === 'onsite' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <MapPin size={13} color={form.mode === 'onsite' ? GLD : MUT} strokeWidth={2.2} />
                            <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.mode === 'onsite' ? OFF : LT }}>حضوري</span>
                          </div>
                          <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>استوديو كاسيت · عمّان · 15 أيلول</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: FP, fontSize: 20, fontWeight: 700, color: form.mode === 'onsite' ? GLD : LT }}>{priceJOD}</div>
                        <div style={{ fontFamily: F, fontSize: 11, color: MUT }}>JOD</div>
                      </div>
                    </button>

                    {/* مباشر تفاعلي */}
                    <button
                      onClick={() => setForm(f => ({ ...f, mode: 'live' }))}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: form.mode === 'live' ? CS : CARD,
                        border: `2px solid ${form.mode === 'live' ? CYN : CBR}`,
                        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                        transition: 'all .2s', textAlign: 'right',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', border: `2px solid ${form.mode === 'live' ? CYN : MUT}`,
                          background: form.mode === 'live' ? CYN : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          transition: 'all .2s',
                        }}>
                          {form.mode === 'live' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Wifi size={13} color={form.mode === 'live' ? CYN : MUT} strokeWidth={2.2} />
                            <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.mode === 'live' ? OFF : LT }}>مباشر تفاعلي</span>
                            <span style={{ fontFamily: F, fontSize: 10.5, color: CYN, background: CS, border: `1px solid ${CL}`, padding: '1px 7px', borderRadius: 999 }}>Online LIVE</span>
                          </div>
                          <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>عن بُعد من أي مكان · 16 أيلول</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontFamily: FP, fontSize: 20, fontWeight: 700, color: form.mode === 'live' ? CYN : LT }}>${priceUSD}</div>
                        <div style={{ fontFamily: F, fontSize: 11, color: MUT }}>USD</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ② خطة الدفع — Plan Cards (onsite only) */}
                {isOnsite && (
                  <div>
                    <SectionLabel>② خطّة الدفع</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* تقسيط */}
                      <button
                        onClick={() => setForm(f => ({ ...f, plan: 'deposit' }))}
                        style={{
                          background: form.plan === 'deposit' ? GS : CARD,
                          border: `2px solid ${form.plan === 'deposit' ? GLD : CBR}`,
                          borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                          transition: 'all .2s', textAlign: 'right', width: '100%',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%', border: `2px solid ${form.plan === 'deposit' ? GLD : MUT}`,
                            background: form.plan === 'deposit' ? GLD : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                            transition: 'all .2s',
                          }}>
                            {form.plan === 'deposit' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                              <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.plan === 'deposit' ? OFF : LT }}>تقسيط مريح</span>
                              <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, background: GLD, color: '#0F1A2E', padding: '2px 9px', borderRadius: 999 }}>موصى به</span>
                            </div>
                            <div style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                              ادفع <strong style={{ color: GLD }}>{DEPOSIT_JOD} ديناراً</strong> الآن · والباقي {priceJOD - DEPOSIT_JOD} على دفعتين أثناء الدورة
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
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
                          display: 'flex', alignItems: 'center', gap: 10,
                          background: form.plan === 'full' ? GS : CARD,
                          border: `2px solid ${form.plan === 'full' ? GLD : CBR}`,
                          borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                          transition: 'all .2s', textAlign: 'right', width: '100%',
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', border: `2px solid ${form.plan === 'full' ? GLD : MUT}`,
                          background: form.plan === 'full' ? GLD : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          transition: 'all .2s',
                        }}>
                          {form.plan === 'full' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
                        </div>
                        <div>
                          <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.plan === 'full' ? OFF : LT }}>دفعة واحدة</div>
                          <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 2 }}>{priceJOD} دينار كاملة</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* ③ بياناتك */}
                <div>
                  <SectionLabel>{isOnsite ? '③' : '②'} بياناتك</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Field icon={<User size={15} />} placeholder="الاسم الأول" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} required />
                      <Field icon={<User size={15} />} placeholder="اسم العائلة" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} />
                    </div>
                    <Field icon={<Phone size={15} />} placeholder="رقم الجوال (مع رمز الدولة)" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} dir="ltr" required />
                    <Field icon={<Mail size={15} />} placeholder="البريد الإلكتروني (اختياري)" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" dir="ltr" />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Field icon={<Globe size={15} />} placeholder="الدولة" value={form.country} onChange={v => setForm(f => ({ ...f, country: v }))} />
                      <Field icon={<Building2 size={15} />} placeholder="المدينة" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
                    </div>
                  </div>
                </div>

                {/* order summary */}
                <OrderSummary
                  courseTitle={courseTitle} mode={form.mode}
                  cohortStartAr={cohortStartAr} cohortDays={cohortDays}
                  priceJOD={priceJOD} priceUSD={priceUSD} plan={form.plan}
                />

                {/* error */}
                {formErr && (
                  <div style={{ display: 'flex', gap: 10, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.28)', borderRadius: 12, padding: '12px 14px' }}>
                    <AlertCircle size={18} color={ERR} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: ERR, lineHeight: 1.5 }}>{formErr}</span>
                  </div>
                )}

                {/* CTA */}
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
                    {!loading && <ArrowLeft size={15} />}
                  </button>
                  {/* security badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: F, fontSize: 11.5, color: MUT }}>
                      <Lock size={11} color={MUT} /> مشفّر 100% عبر Stripe
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="30" height="10" viewBox="0 0 48 16" aria-label="Visa"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="50%" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#fff">VISA</text></svg>
                      <svg width="20" height="13" viewBox="0 0 34 22" aria-label="Mastercard"><circle cx="12" cy="11" r="11" fill="#EB001B"/><circle cx="22" cy="11" r="11" fill="#F79E1B"/><path d="M17 4.3a11 11 0 0 1 0 13.4A11 11 0 0 1 17 4.3z" fill="#FF5F00"/></svg>
                      <svg width="30" height="12" viewBox="0 0 50 20" aria-label="Apple Pay"><rect width="50" height="20" rx="4" fill="#000"/><text x="50%" y="14.5" textAnchor="middle" fontFamily="'-apple-system',sans-serif" fontWeight="600" fontSize="10" fill="#fff">Apple Pay</text></svg>
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
                      { icon: <User size={14} color={GLD} />,         text: `المدرّب: ${cohortTrainer}` },
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
