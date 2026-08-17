/**
 * PaymentModal — embedded Stripe Elements checkout for Kaseet masterclass pages.
 * Steps: form → payment → success
 */
import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise } from '../lib/stripeClient';
import { Lock, ShieldCheck, CheckCircle2, X } from 'lucide-react';

/* ── design tokens (match masterclass page palette) ─── */
const GLD  = '#FFC107';
const BG   = '#0D1117';
const CARD = '#131B27';
const CBR  = 'rgba(255,255,255,0.08)';
const GL   = 'rgba(255,193,7,0.25)';
const GS   = 'rgba(255,193,7,0.08)';
const F    = "'Tajawal', sans-serif";
const FP   = "'Plus Jakarta Sans', 'Tajawal', sans-serif";
const MUT  = '#8A97AE';
const OFF  = '#f8fafc';
const LT   = '#CBD5E1';
const ERR  = '#f87171';
const DEPOSIT_JOD = 50;

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

/* ── inner payment form (must be inside <Elements>) ── */
function StripePaymentForm({
  priceJOD, priceUSD, plan, mode,
  onSuccess, onError,
}: {
  priceJOD: number; priceUSD: number;
  plan: 'full' | 'deposit'; mode: 'onsite' | 'live';
  onSuccess: () => void; onError: (msg: string) => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying]     = useState(false);
  const [payErr, setPayErr]     = useState<string | null>(null);
  const [ready, setReady]       = useState(false);

  const chargeAmount = mode === 'live'
    ? `$${priceUSD}`
    : plan === 'deposit'
      ? `${DEPOSIT_JOD} ديناراً`
      : `${priceJOD} ديناراً`;

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true);
    setPayErr(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href.split('?')[0] + '?payment_return=1',
      },
      redirect: 'if_required',
    });
    if (error) {
      const msg = error.message ?? 'حدث خطأ غير متوقع — حاول مجدداً.';
      setPayErr(msg);
      setPaying(false);
      onError(msg);
    } else {
      // Payment confirmed without redirect → proceed to success
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* security header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: GS, border: `1px solid ${GL}`, borderRadius: 14, padding: '14px 16px' }}>
        <Lock size={18} color={GLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: OFF }}>دفع آمن عبر Stripe</div>
          <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 2 }}>بياناتك مشفَّرة ولا تمرّ بخوادمنا إطلاقاً</div>
        </div>
      </div>

      {/* stripe elements */}
      <div>
        <PaymentElement
          onReady={() => setReady(true)}
          options={{ layout: 'tabs' }}
        />
      </div>

      {/* error */}
      {payErr && (
        <div style={{ fontFamily: F, fontSize: 13.5, color: ERR, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 10, padding: '10px 14px' }}>
          {payErr}
        </div>
      )}

      {/* pay button */}
      <button
        onClick={handlePay}
        disabled={paying || !ready}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', background: (paying || !ready) ? '#5a4a10' : GLD, color: '#0F1A2E',
          fontFamily: FP, fontWeight: 800, fontSize: 16, padding: '15px 24px',
          borderRadius: 14, border: 'none', cursor: (paying || !ready) ? 'not-allowed' : 'pointer',
          transition: 'background .2s',
        }}
      >
        <Lock size={15} />
        {paying ? 'جاري المعالجة...' : `ادفع ${chargeAmount} وثبّت مقعدك`}
      </button>

      {/* assurance lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          'ضمان الجلسة الأولى — استرداد كامل خلال 24 ساعة',
          'التسجيل يُثبَّت فور الدفع، ويصلك تأكيد على بريدك',
          'مقعدك محجوز لك وحدك',
        ].map(line => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: F, fontSize: 13, color: LT }}>
            <CheckCircle2 size={14} color={GLD} style={{ flexShrink: 0 }} />
            {line}
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
}: PaymentModalProps) {
  const [step, setStep]             = useState<Step>('form');
  const [form, setForm]             = useState<FormState>({
    firstName: '', lastName: '', phone: '', email: '',
    country: 'الأردن', city: '', mode: 'onsite', plan: 'deposit',
  });
  const [loading, setLoading]       = useState(false);
  const [formErr, setFormErr]       = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piId, setPiId]             = useState<string | null>(null);
  const [orderId, setOrderId]       = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paidCurrency, setPaidCurrency] = useState<string>('JOD');
  const [remaining, setRemaining]   = useState<number>(0);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      // Check if we're returning from a 3D Secure redirect
      const params = new URLSearchParams(window.location.search);
      const returnPiId  = params.get('payment_intent');
      const returnStatus = params.get('redirect_status');
      if (returnPiId && returnStatus === 'succeeded') {
        setPiId(returnPiId);
        setStep('polling');
        pollOrder(returnPiId);
      } else {
        setStep('form');
        setClientSecret(null);
        setPiId(null);
        setOrderId(null);
        setFormErr(null);
        setLoading(false);
      }
    }
  }, [isOpen]);

  // Prevent body scroll when open
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
        const res = await fetch(`/api/checkout/pi-status?pi_id=${encodeURIComponent(paymentIntentId)}`);
        if (!res.ok) continue;
        const data = await res.json() as { status: string; order?: { id: string; paidJOD: number; remainingJOD: number; totalUSD: number; mode: string; plan: string } };
        if (data.status === 'paid_full' || data.status === 'deposit_paid') {
          if (data.order) {
            setOrderId(data.order.id);
            if (data.order.mode === 'live') {
              setPaidAmount(data.order.totalUSD);
              setPaidCurrency('USD');
              setRemaining(0);
            } else {
              setPaidAmount(data.order.paidJOD);
              setPaidCurrency('JOD');
              setRemaining(data.order.remainingJOD);
            }
          }
          setStep('success');
          return;
        }
        if (data.status === 'failed' || data.status === 'refunded') {
          setStep('error');
          return;
        }
      }
      // Timed out — cannot confirm yet; webhook will create the order shortly
      setStep('pending');
    } catch {
      // Network error during polling — show pending with contact info
      setStep('pending');
    }
  }, []);

  const handleFormSubmit = async () => {
    if (!form.firstName.trim() || !form.phone.trim()) {
      setFormErr('الاسم الأول ورقم الجوال إلزاميان');
      return;
    }
    setFormErr(null);
    setLoading(true);
    try {
      const cohortId = form.mode === 'onsite' ? cohortIdOnsite : cohortIdLive;
      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId,
          courseSlug,
          mode: form.mode,
          plan: form.mode === 'live' ? 'full' : form.plan,
          cohortStartAr,
          cohortDays,
          cohortTimeAr,
          cohortTrainer,
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
        setFormErr(data.error ?? 'حدث خطأ — حاول مجدداً');
        setLoading(false);
        return;
      }
      setClientSecret(data.clientSecret);
      setPiId(data.paymentIntentId ?? null);
      setOrderId(data.orderId ?? null);
      // Compute expected amounts for display
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
      colorPrimary:    GLD,
      colorBackground: '#1A2535',
      colorText:       '#FFFFFF',
      colorDanger:     '#C2453C',
      fontFamily:      'Tajawal, sans-serif',
      borderRadius:    '12px',
      spacingUnit:     '4px',
    },
  };

  if (!isOpen) return null;

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 1000, backdropFilter: 'blur(4px)' }}
      />

      {/* panel */}
      <div
        dir="rtl"
        style={{
          position: 'fixed', inset: 0, zIndex: 1001, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: BG, border: `1px solid ${CBR}`, borderRadius: 22,
            width: '100%', maxWidth: 520, maxHeight: '92dvh', overflowY: 'auto',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)', pointerEvents: 'auto',
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px 0' }}>
            <div>
              <div style={{ fontFamily: FP, fontSize: 15, fontWeight: 800, color: OFF }}>{courseTitle}</div>
              <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 2 }}>
                يبدأ {cohortStartAr} · {cohortDays} · {cohortTimeAr}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUT, padding: 6, borderRadius: 8, display: 'flex' }}
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: '20px 22px 24px' }}>

            {/* ── STEP 1: FORM ─────────────────────────── */}
            {step === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* mode selection */}
                <div>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: LT, marginBottom: 10 }}>أسلوب التعلّم</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {([
                      { value: 'onsite', label: 'حضوري — استوديو كاسيت، عمّان', price: `${priceJOD} JOD` },
                      { value: 'live',   label: 'مباشر تفاعلي (Online LIVE)',    price: `$${priceUSD} USD` },
                    ] as const).map(opt => (
                      <label key={opt.value} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: form.mode === opt.value ? GS : CARD,
                        border: `1px solid ${form.mode === opt.value ? GL : CBR}`,
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                        transition: 'all .15s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input
                            type="radio" name="mode" value={opt.value}
                            checked={form.mode === opt.value}
                            onChange={() => setForm(f => ({ ...f, mode: opt.value }))}
                            style={{ accentColor: GLD, width: 16, height: 16 }}
                          />
                          <span style={{ fontFamily: F, fontSize: 14, color: OFF }}>{opt.label}</span>
                        </div>
                        <span style={{ fontFamily: FP, fontSize: 15, fontWeight: 700, color: GLD }}>{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* plan selection (onsite only) */}
                {form.mode === 'onsite' && (
                  <div>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: LT, marginBottom: 10 }}>خطّة الدفع</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{
                        background: form.plan === 'deposit' ? GS : CARD,
                        border: `1px solid ${form.plan === 'deposit' ? GL : CBR}`,
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <input
                            type="radio" name="plan" value="deposit"
                            checked={form.plan === 'deposit'}
                            onChange={() => setForm(f => ({ ...f, plan: 'deposit' }))}
                            style={{ accentColor: GLD, width: 16, height: 16 }}
                          />
                          <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: OFF }}>تقسيط مريح</span>
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#0F1A2E', padding: '2px 8px', borderRadius: 999 }}>موصى به</span>
                        </div>
                        <div style={{ marginRight: 26, fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                          ادفع <b style={{ color: GLD }}>{DEPOSIT_JOD} ديناراً</b> الآن · والباقي {priceJOD - DEPOSIT_JOD} على دفعتين أثناء الدورة<br />
                          <span style={{ color: MUT, fontSize: 12 }}>✓ بلا فوائد &nbsp; ✓ بلا رسوم إضافية</span>
                        </div>
                      </label>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: form.plan === 'full' ? GS : CARD,
                        border: `1px solid ${form.plan === 'full' ? GL : CBR}`,
                        borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                      }}>
                        <input
                          type="radio" name="plan" value="full"
                          checked={form.plan === 'full'}
                          onChange={() => setForm(f => ({ ...f, plan: 'full' }))}
                          style={{ accentColor: GLD, width: 16, height: 16 }}
                        />
                        <span style={{ fontFamily: F, fontSize: 14, color: OFF }}>دفعة واحدة — {priceJOD} ديناراً</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* customer fields */}
                <div>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: LT, marginBottom: 10 }}>بياناتك</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input
                        placeholder="الاسم الأول *"
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        style={inputStyle}
                      />
                      <input
                        placeholder="اسم العائلة"
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <input
                      placeholder="رقم الجوال (مع رمز الدولة) *"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      style={inputStyle}
                      dir="ltr"
                    />
                    <input
                      placeholder="البريد الإلكتروني (اختياري)"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      style={inputStyle}
                      type="email"
                      dir="ltr"
                    />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input
                        placeholder="المدينة"
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        style={inputStyle}
                      />
                      <input
                        placeholder="الدولة"
                        value={form.country}
                        onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {formErr && (
                  <div style={{ fontFamily: F, fontSize: 13.5, color: ERR, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 10, padding: '10px 14px' }}>
                    {formErr}
                  </div>
                )}

                <button
                  onClick={handleFormSubmit}
                  disabled={loading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', background: loading ? '#5a4a10' : GLD, color: '#0F1A2E',
                    fontFamily: FP, fontWeight: 800, fontSize: 16, padding: '15px 24px',
                    borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'جاري التحضير...' : 'متابعة للدفع ←'}
                </button>
              </div>
            )}

            {/* ── STEP 2: STRIPE ELEMENTS ──────────────── */}
            {step === 'payment' && clientSecret && (
              <Elements
                stripe={getStripePromise()}
                options={{ clientSecret, locale: 'ar', appearance: stripeAppearance }}
              >
                <StripePaymentForm
                  priceJOD={priceJOD} priceUSD={priceUSD}
                  plan={form.plan} mode={form.mode}
                  onSuccess={handlePaySuccess}
                  onError={() => setStep('error')}
                />
              </Elements>
            )}

            {/* ── STEP: POLLING ────────────────────────── */}
            {(step === 'polling' || (step === 'payment' && !clientSecret)) && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${CBR}`, borderTopColor: GLD, margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontFamily: F, fontSize: 15, color: LT }}>جاري تأكيد الدفع…</div>
                <div style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6 }}>قد يستغرق لحظة — لا تغلق هذه النافذة</div>
              </div>
            )}

            {/* ── STEP 3: SUCCESS ──────────────────────── */}
            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,.12)', border: '2px solid rgba(34,197,94,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ShieldCheck size={28} color="#4ade80" />
                </div>
                <div style={{ fontFamily: FP, fontSize: 20, fontWeight: 800, color: OFF, marginBottom: 6 }}>تمّ تثبيت مقعدك ✅</div>

                {orderId && (
                  <div style={{ fontFamily: F, fontSize: 13.5, color: MUT, marginBottom: 20 }}>
                    رقم الطلب: <span style={{ color: GLD, fontWeight: 700 }}>{orderId}</span>
                  </div>
                )}

                <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px', textAlign: 'right', marginBottom: 20 }}>
                  <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.9 }}>
                    <div>📅 يبدأ <b style={{ color: OFF }}>{cohortStartAr}</b> · {cohortDays} · {cohortTimeAr}</div>
                    <div>👤 المدرّب: <b style={{ color: OFF }}>{cohortTrainer}</b></div>
                    {paidAmount > 0 && (
                      <div>
                        💳 المدفوع: <b style={{ color: GLD }}>{paidAmount} {paidCurrency}</b>
                        {remaining > 0 && <> · المتبقّي: <b style={{ color: MUT }}>{remaining} JOD</b></>}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.8, marginBottom: 24 }}>
                  📧 أرسلنا إيصال الدفع وتفاصيل التسجيل إلى بريدك.<br />
                  لم يصلك؟ تفقّد مجلد الرسائل غير المرغوب فيها.
                </div>

                <button
                  onClick={onClose}
                  style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 28px', cursor: 'pointer' }}
                >
                  إغلاق
                </button>
              </div>
            )}

            {/* ── STEP: PENDING (timeout/network — cannot confirm yet) ── */}
            {step === 'pending' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,193,7,.10)', border: `2px solid ${GL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ShieldCheck size={28} color={GLD} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 18, fontWeight: 800, color: OFF, marginBottom: 8 }}>الدفع قيد المعالجة</div>
                <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.85, maxWidth: 340, marginInline: 'auto', marginBottom: 20 }}>
                  تلقّينا طلبك — سنُرسل إليك إيصال التسجيل بمجرد تأكيد الدفع من Stripe.
                  عادةً لا يتجاوز ذلك دقيقة واحدة.
                </div>
                {orderId && (
                  <div style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 20 }}>
                    رقم الطلب: <span style={{ color: GLD, fontWeight: 700 }}>{orderId}</span>
                  </div>
                )}
                <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 12, padding: '14px 18px', textAlign: 'right', marginBottom: 24, direction: 'rtl' }}>
                  <div style={{ fontFamily: F, fontSize: 13, color: MUT }}>
                    لم يصلك إيصال خلال 5 دقائق؟ تواصل معنا:
                  </div>
                  <a
                    href="https://wa.me/962771052222"
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontFamily: F, fontSize: 13.5, fontWeight: 700, color: '#25D366', textDecoration: 'none' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    واتساب كاسيت (+962 77 105 2222)
                  </a>
                </div>
                <button
                  onClick={onClose}
                  style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 28px', cursor: 'pointer' }}
                >
                  إغلاق
                </button>
              </div>
            )}

            {/* ── STEP: ERROR ──────────────────────────── */}
            {step === 'error' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontFamily: FP, fontSize: 18, fontWeight: 800, color: ERR, marginBottom: 12 }}>تعذّر إتمام الدفع</div>
                <div style={{ fontFamily: F, fontSize: 14, color: MUT, marginBottom: 24 }}>
                  يرجى المحاولة مرة أخرى أو التواصل مع المستشارة.
                </div>
                <button
                  onClick={() => setStep('form')}
                  style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 28px', cursor: 'pointer' }}
                >
                  حاول مجدداً
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

const inputStyle: CSSProperties = {
  flex: 1, minWidth: 0,
  background: CARD, border: `1px solid ${CBR}`, borderRadius: 10,
  padding: '11px 13px', fontFamily: F, fontSize: 14, color: OFF,
  outline: 'none',
};
