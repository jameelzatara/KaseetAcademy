// ── Refund Policy Page ────────────────────────────────────────
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

const F = 'Tajawal, sans-serif';
const GOLD = '#FFC107';

const TIERS = [
  { period: 'قبل ٧ أيام أو أكثر من بدء الدورة', refund: 'استرداد كامل ١٠٠٪', color: 'rgba(37,211,102,0.14)', border: 'rgba(37,211,102,0.30)', text: '#4ade80' },
  { period: 'بين ٣ و٧ أيام من بدء الدورة',       refund: 'استرداد ٥٠٪ من قيمة الاشتراك', color: 'rgba(255,193,7,0.10)', border: 'rgba(255,193,7,0.28)', text: GOLD },
  { period: 'أقل من ٣ أيام من بدء الدورة',       refund: 'لا يوجد استرداد نقدي (رصيد دراسي)', color: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)', text: 'rgba(255,255,255,0.65)' },
  { period: 'بعد بدء الدورة',                    refund: 'لا يوجد استرداد', color: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.18)', text: 'rgba(252,165,165,0.80)' },
];

export default function RefundPolicyPage() {
  return (
    <div dir="rtl" style={{ background: '#1A2533', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div style={{ background: 'rgba(0,0,0,0.30)', borderBottom: '1px solid rgba(255,193,7,0.12)', padding: '120px 24px 52px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 999,
            background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
            color: GOLD, fontSize: 12.5, fontFamily: F, fontWeight: 700, marginBottom: 16,
          }}>قانوني</span>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(28px,4vw,40px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            سياسة الاسترداد
          </h1>
          <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(203,213,225,0.55)', margin: 0 }}>
            آخر تحديث: يوليو 2025
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '52px 24px 80px' }}>
        <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(226,232,240,0.80)', lineHeight: 1.9, margin: '0 0 40px' }}>
          نسعى دائماً لضمان رضاك التام. فيما يلي سياستنا الواضحة للاسترداد بحسب توقيت طلب الإلغاء.
        </p>

        {/* Refund tiers table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 44 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 0 0',
            padding: '12px 20px',
          }}>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: 'rgba(255,255,255,0.55)' }}>التوقيت</span>
            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: 'rgba(255,255,255,0.55)' }}>نسبة الاسترداد</span>
          </div>
          {TIERS.map((t, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
              background: t.color, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '16px 20px', alignItems: 'center',
            }}>
              <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.5 }}>{t.period}</p>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: t.text, margin: 0 }}>{t.refund}</p>
            </div>
          ))}
        </div>

        {/* Additional notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { title: 'الرصيد الدراسي', body: 'يمكن استخدام الرصيد الدراسي في الالتحاق بأي دورة أخرى من دوراتنا خلال سنة كاملة من تاريخ منحه.' },
            { title: 'حالات الاسترداد الاستثنائية', body: 'في حالة إلغاء الدورة من قِبل الأكاديمية لأي سبب كان، يحق للمتدرب استرداد كامل المبلغ المدفوع أو تحويله إلى دورة بديلة.' },
            { title: 'طريقة الاسترداد', body: 'يُعاد المبلغ إلى نفس وسيلة الدفع المستخدمة خلال ٥–١٠ أيام عمل من تأكيد طلب الاسترداد.' },
            { title: 'تقديم طلب الاسترداد', body: 'لتقديم طلب الاسترداد يُرجى التواصل عبر واتساب +962 77 105 2222 أو البريد الإلكتروني info@kaseetmedia.com مع ذكر اسمك وتاريخ التسجيل.' },
          ].map((n, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '22px 24px',
            }}>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 10px' }}>{n.title}</h3>
              <p style={{ fontFamily: F, fontSize: 14.5, color: 'rgba(226,232,240,0.75)', margin: 0, lineHeight: 1.85 }}>{n.body}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
