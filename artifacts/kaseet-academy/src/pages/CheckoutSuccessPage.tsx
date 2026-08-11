import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
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

const DARK = '#0D0B14';
const CREAM = '#F5F4F0';
const CREAM_CARD = '#FDFCF8';
const INK = '#18202F';
const INK2 = '#4B5563';
const GREEN = '#16a34a';
const GOLD = '#E6A817';
const CREAM_LINE = 'rgba(24,32,47,.1)';
const F = "'Tajawal', 'Cairo', Arial, sans-serif";

const API = '/api';

const COURSE_NAMES: Record<string, string> = {
  voiceover:           'أساسيات التعليق والأداء الصوتي',
  'voiceover-basics':  'أساسيات التعليق والأداء الصوتي',
  presenter:           'الدورة المكثّفة: المذيع المحترف',
  'public-speaking':   'فن الخطابة والإلقاء الجماهيري المؤثّر',
  'arabic-language':   'تمكين اللغة العربية وفنون التحرير اللغوي',
};

export default function CheckoutSuccessPage() {
  const search = useLocation()[0].split('?')[1] ?? '';
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id') ?? '';

  const [status, setStatus] = useState<'loading' | 'confirmed' | 'pending' | 'error'>('loading');
  const [order, setOrder] = useState<Order | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) { setStatus('error'); return; }

    let timeout: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const resp = await fetch(`${API}/checkout/status?session_id=${encodeURIComponent(sessionId)}`, {
          credentials: 'include',
        });
        const data = await resp.json();

        if (data.status && data.status !== 'pending') {
          setOrder(data.order);
          setStatus('confirmed');
          return;
        }

        setAttempts(a => a + 1);
        if (attempts < 30) {
          // Poll every 2 seconds for up to 60 seconds
          timeout = setTimeout(poll, 2000);
        } else {
          setStatus('pending');
        }
      } catch {
        setStatus('error');
      }
    }

    poll();
    return () => clearTimeout(timeout);
  }, [sessionId]);

  const courseName = order ? (COURSE_NAMES[order.courseSlug] ?? order.courseSlug) : '';
  const modeLabel = order?.mode === 'onsite' ? 'حضوري' : 'مباشر تفاعلي';
  const isLive = order?.mode === 'live';

  const waMsg = order
    ? encodeURIComponent(
        `مرحباً 👋 تمّ تسجيلي في ${courseName} — ${modeLabel} (الدفعة #${order.cohortId}، الطلب ${order.id})`,
      )
    : '';

  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: F, direction: 'rtl', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 100 }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 20px 60px' }}>

        {/* Loading */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="ka-spin" style={{ width: 48, height: 48, border: `4px solid ${CREAM_LINE}`, borderTopColor: DARK, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
            <h2 style={{ fontWeight: 800, fontSize: 22, color: INK, margin: '0 0 8px' }}>جارٍ تأكيد الدفع…</h2>
            <p style={{ color: INK2, fontSize: 14 }}>ستصلك رسالة تأكيد خلال دقيقة</p>
          </div>
        )}

        {/* Pending (webhook not yet received) */}
        {status === 'pending' && (
          <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '32px 28px', textAlign: 'center' }}>
            <Clock size={48} style={{ color: GOLD, marginBottom: 16 }} />
            <h2 style={{ fontWeight: 800, fontSize: 22, color: INK, margin: '0 0 12px' }}>جارٍ معالجة الدفع</h2>
            <p style={{ color: INK2, fontSize: 14, margin: '0 0 24px' }}>
              استلمنا طلبك وسيصلك تأكيد الحجز عبر واتساب والبريد خلال دقائق.
              رقم الطلب: <strong>—</strong>
            </p>
            <a
              href={`https://wa.me/962790000000?text=${encodeURIComponent('مرحباً، أتحقّق من حالة دفعي في كاسيت أكاديمي')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.3)', borderRadius: 12, padding: '10px 18px', color: GREEN, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
            >
              <MessageCircle size={17} /> تواصل مع مستشارتك
            </a>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '32px 28px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 800, fontSize: 22, color: INK, margin: '0 0 12px' }}>حدث خطأ</h2>
            <p style={{ color: INK2, fontSize: 14, margin: '0 0 24px' }}>لم نتمكّن من التحقّق من حالة دفعك. تواصل معنا وسنحلّ الأمر فوراً.</p>
            <a
              href="https://wa.me/962790000000"
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: DARK, borderRadius: 12, padding: '10px 20px', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
            >
              <MessageCircle size={17} /> تواصل معنا
            </a>
          </div>
        )}

        {/* Confirmed */}
        {status === 'confirmed' && order && (
          <div>
            {/* Success card */}
            <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '32px 28px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <CheckCircle size={44} style={{ color: GREEN, flexShrink: 0 }} />
                <div>
                  <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: INK }}>تمّ تثبيت مقعدك ✅</h2>
                  <div style={{ fontSize: 13, color: INK2, marginTop: 4 }}>رقم الطلب: <b>{order.id}</b></div>
                </div>
              </div>

              <InfoRow label="البرنامج" value={`${courseName} — ${modeLabel}`} />
              <InfoRow label="الدفعة" value={`#${order.cohortId}`} />
              <InfoRow label="المدفوع" value={
                isLive
                  ? `$${order.totalUSD}`
                  : `${order.paidJOD} ديناراً`
              } />
              {!isLive && order.remainingJOD > 0 && (
                <InfoRow label="المتبقّي" value={`${order.remainingJOD} ديناراً`} highlight />
              )}
            </div>

            {/* Installment note */}
            {!isLive && order.remainingJOD > 0 && (
              <div style={{ background: 'rgba(255,193,7,.09)', border: '1px solid rgba(255,193,7,.3)', borderRadius: 14, padding: '14px 18px', marginBottom: 16, fontSize: 13.5, color: INK2 }}>
                ستتواصل معك مستشارتك قبل بدء الدورة بيومين لترتيب الدفعات الباقية — تحويلاً أو نقداً.
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/962790000000?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: DARK, borderRadius: 12, padding: '12px 0', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
              >
                <MessageCircle size={17} /> تحدّث مع مستشارتك
              </a>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(courseName)}&details=${encodeURIComponent(`كاسيت أكاديمي — الطلب ${order.id}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', border: `1.5px solid ${CREAM_LINE}`, borderRadius: 12, padding: '12px 0', color: INK, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
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
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: highlight ? 15 : 14, fontWeight: highlight ? 800 : 500, color: highlight ? '#dc2626' : '#4B5563' }}>
      <span style={{ color: '#18202F' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
