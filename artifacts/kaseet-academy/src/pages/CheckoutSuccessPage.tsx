import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Clock, MessageCircle, CalendarPlus } from 'lucide-react';

interface Order {
  id: string;
  courseSlug: string;
  cohortId: number;
  mode: string;
  plan: string;
  customer: { firstName: string; lastName: string; email?: string; phone: string };
  totalJOD: number;
  totalUSD: number;
  paidJOD: number;
  remainingJOD: number;
  status: string;
}

const DARK      = '#0D0B14';
const CREAM     = '#F5F4F0';
const CREAM_CARD= '#FDFCF8';
const INK       = '#18202F';
const INK2      = '#4B5563';
const GREEN     = '#16a34a';
const GOLD      = '#E6A817';
const CREAM_LINE= 'rgba(24,32,47,.1)';
const F         = "'Tajawal', 'Cairo', Arial, sans-serif";

const API = '/api';

// ─── Advisor config ───────────────────────────────────────
const ADVISORS: Record<string, { name: string; phone: string }> = {
  onsite: { name: 'آية',   phone: '962790234483' },
  live:   { name: 'ياقوت', phone: '962771052222' },
};
const DEFAULT_ADVISOR = ADVISORS.live;

const COURSE_NAMES: Record<string, string> = {
  voiceover:          'أساسيات التعليق والأداء الصوتي',
  'voiceover-basics': 'أساسيات التعليق والأداء الصوتي',
  presenter:          'الدورة المكثّفة: المذيع المحترف',
  'public-speaking':  'فن الخطابة والإلقاء الجماهيري المؤثّر',
  'arabic-language':  'تمكين اللغة العربية وفنون التحرير اللغوي',
};

// ─── Stages ───────────────────────────────────────────────
// 'loading'  — polling, up to 20 s
// 'confirmed' — order found
// 'pending'  — 20 s passed, no order yet (payment DID go through)
type Stage = 'loading' | 'confirmed' | 'pending';

export default function CheckoutSuccessPage() {
  // ⚠️ IMPORTANT: Wouter's useLocation()[0] returns pathname only — no query string.
  // Always read session_id from the real window.location.search.
  const params    = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id') ?? '';

  const [stage, setStage] = useState<Stage>('loading');
  const [order, setOrder]  = useState<Order | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // If Stripe somehow didn't send session_id, go straight to pending reassurance
    if (!sessionId) {
      setStage('pending');
      return;
    }

    // ── Poll every 2 s for up to 20 s ──────────────────────
    async function checkStatus() {
      if (!mountedRef.current) return;
      try {
        const resp = await fetch(
          `${API}/checkout/status?session_id=${encodeURIComponent(sessionId)}`,
          { credentials: 'include' },
        );
        if (!resp.ok) return; // non-2xx → keep retrying (don't crash)

        const data = await resp.json();
        if (!mountedRef.current) return;

        if (data.status && data.status !== 'pending') {
          // Order confirmed — stop everything, show success
          clearInterval(timerRef.current!);
          clearTimeout(timeoutRef.current!);
          setOrder(data.order);
          setStage('confirmed');
        }
        // else: still pending → do nothing, interval fires again in 2 s
      } catch {
        // Network hiccup — silently retry; never show an error to a paying customer
      }
    }

    // First check immediately, then every 2 s
    checkStatus();
    timerRef.current = setInterval(checkStatus, 2000);

    // After 20 s without confirmation → show reassurance (NOT an error)
    timeoutRef.current = setTimeout(async () => {
      if (!mountedRef.current) return;
      clearInterval(timerRef.current!);

      // Still no order after 20 s — show pending reassurance
      setStage('pending');

      // Alert the team so someone can verify manually
      try {
        await fetch(`${API}/checkout/alert-team`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        // Non-fatal: even if this fails, the user still sees the reassurance screen
      }
    }, 20_000);

    return () => {
      mountedRef.current = false;
      clearInterval(timerRef.current!);
      clearTimeout(timeoutRef.current!);
    };
  }, [sessionId]);

  const courseName = order ? (COURSE_NAMES[order.courseSlug] ?? order.courseSlug) : '';
  const modeLabel  = order?.mode === 'onsite' ? 'حضوري' : 'مباشر تفاعلي';
  const isLive     = order?.mode === 'live';
  const advisor    = order ? (ADVISORS[order.mode] ?? DEFAULT_ADVISOR) : DEFAULT_ADVISOR;

  const waMsg = order
    ? encodeURIComponent(
        `مرحباً 👋 تمّ تسجيلي في ${courseName} — ${modeLabel} (الدفعة #${order.cohortId}، الطلب ${order.id})`,
      )
    : encodeURIComponent('مرحباً، أتحقّق من حالة تسجيلي في كاسيت أكاديمي.');

  // ── Reference number: last 8 chars of session_id ──────────
  const refNum = sessionId.slice(-8).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: F, direction: 'rtl', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 100 }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 20px 60px' }}>

        {/* ① LOADING — polling in progress */}
        {stage === 'loading' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div
              className="ka-spin"
              style={{
                width: 52, height: 52,
                border: `4px solid ${CREAM_LINE}`,
                borderTopColor: DARK,
                borderRadius: '50%',
                margin: '0 auto 24px',
              }}
            />
            <h2 style={{ fontWeight: 800, fontSize: 22, color: INK, margin: '0 0 10px' }}>
              جارٍ تأكيد دفعك…
            </h2>
            <p style={{ color: INK2, fontSize: 14, margin: 0 }}>
              لحظات ونؤكّد تسجيلك. لا تُغلق الصفحة.
            </p>
          </div>
        )}

        {/* ② PENDING — 20 s passed, reassurance (NEVER say "error") */}
        {stage === 'pending' && (
          <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '36px 28px', textAlign: 'center' }}>
            <Clock size={52} style={{ color: GOLD, marginBottom: 18 }} />
            <h2 style={{ fontWeight: 800, fontSize: 22, color: INK, margin: '0 0 14px' }}>
              تمّ استلام دفعك ✅
            </h2>
            <p style={{ color: INK2, fontSize: 14, margin: '0 0 8px', lineHeight: 1.7 }}>
              عمليّة الدفع اكتملت بنجاح. تأكيد التسجيل يستغرق دقيقة أحياناً
              وستصلك رسالة واتساب فور اكتماله.
            </p>
            {refNum && (
              <p style={{ color: INK2, fontSize: 13, margin: '0 0 24px' }}>
                رقم المرجع: <strong style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{refNum}</strong>
              </p>
            )}
            <a
              href={`https://wa.me/${DEFAULT_ADVISOR.phone}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: DARK, borderRadius: 12, padding: '12px 24px',
                color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14,
              }}
            >
              <MessageCircle size={17} /> تحدّث مع مستشارتك
            </a>
          </div>
        )}

        {/* ③ CONFIRMED — full order details */}
        {stage === 'confirmed' && order && (
          <div>
            {/* Success header card */}
            <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '32px 28px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <CheckCircle size={44} style={{ color: GREEN, flexShrink: 0 }} />
                <div>
                  <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: INK }}>تمّ تثبيت مقعدك ✅</h2>
                  <div style={{ fontSize: 13, color: INK2, marginTop: 4 }}>
                    رقم الطلب: <b>{order.id}</b>
                  </div>
                </div>
              </div>

              <InfoRow label="البرنامج"  value={`${courseName} — ${modeLabel}`} />
              <InfoRow label="الدفعة"    value={`#${order.cohortId}`} />
              <InfoRow label="الاسم"     value={`${order.customer.firstName} ${order.customer.lastName}`} />

              {isLive ? (
                <InfoRow label="الإجمالي" value={`${order.totalUSD} USD`} />
              ) : (
                <>
                  <InfoRow label="الإجمالي"   value={`${order.totalJOD} ديناراً`} />
                  <InfoRow label="المدفوع"    value={`${order.paidJOD} ديناراً`} />
                  {order.remainingJOD > 0 && (
                    <InfoRow label="المتبقّي" value={`${order.remainingJOD} ديناراً`} highlight />
                  )}
                </>
              )}
            </div>

            {/* Installment note */}
            {!isLive && order.remainingJOD > 0 && (
              <div style={{
                background: 'rgba(255,193,7,.09)',
                border: '1px solid rgba(255,193,7,.3)',
                borderRadius: 14, padding: '14px 18px', marginBottom: 16,
                fontSize: 13.5, color: INK2,
              }}>
                ستتواصل معك مستشارتك قبل بدء الدورة بيومين لترتيب الدفعات الباقية — تحويلاً أو نقداً.
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${advisor.phone}?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: 160,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: DARK, borderRadius: 12, padding: '12px 0',
                  color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14,
                }}
              >
                <MessageCircle size={17} /> تحدّث مع {advisor.name}
              </a>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(courseName)}&details=${encodeURIComponent(`كاسيت أكاديمي — الطلب ${order.id}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: 160,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'transparent', border: `1.5px solid ${CREAM_LINE}`,
                  borderRadius: 12, padding: '12px 0',
                  color: INK, fontWeight: 700, textDecoration: 'none', fontSize: 14,
                }}
              >
                <CalendarPlus size={17} /> أضِف للتقويم
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .ka-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      marginBottom: 10,
      fontSize: highlight ? 15 : 14,
      fontWeight: highlight ? 800 : 500,
      color: highlight ? '#dc2626' : '#4B5563',
    }}>
      <span style={{ color: '#18202F' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
