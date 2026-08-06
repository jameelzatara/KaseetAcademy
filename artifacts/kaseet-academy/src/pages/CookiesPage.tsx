// ── Cookies Policy — بيركلي للصوتيات المسموعة (كاسيت أكاديمي) ─
// مسوّدة مهنية — تحتاج مراجعة محامٍ أردني مرخَّص قبل النشر
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

const S = {
  page:  { minHeight: '100dvh', background: '#0D0B14', direction: 'rtl' as const },
  wrap:  { maxWidth: 820, margin: '0 auto', padding: '140px 24px 80px', direction: 'rtl' as const },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)', color: '#FFC107', fontSize: 13, fontWeight: 700, marginBottom: 18 },
  h1:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 'clamp(26px,4vw,40px)', color: 'rgba(252,251,251,0.97)', margin: '0 0 8px', lineHeight: 1.25 },
  date:  { fontFamily: 'Poppins, sans-serif', fontSize: 12.5, color: 'rgba(203,213,225,0.44)', margin: '0 0 48px', direction: 'ltr' as const, display: 'block' },
  rule:  { height: 1, background: 'linear-gradient(to left, rgba(255,193,7,0.22), transparent)', margin: '40px 0' },
  h2:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 'clamp(17px,2.2vw,22px)', color: '#FFC107', margin: '0 0 16px' },
  p:     { fontFamily: 'Tajawal, sans-serif', fontWeight: 400, fontSize: 15.5, color: 'rgba(226,232,240,0.75)', lineHeight: 1.95, margin: '0 0 14px', textAlign: 'right' as const },
  ul:    { paddingRight: 20, margin: '0 0 14px', listStyleType: 'disc' as const },
  li:    { fontFamily: 'Tajawal, sans-serif', fontSize: 15.5, color: 'rgba(226,232,240,0.72)', lineHeight: 1.9, marginBottom: 6 },
  info:  { background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.18)', borderRadius: 14, padding: '20px 22px', marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 },
  th:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5, color: '#FFC107', padding: '10px 14px', textAlign: 'right' as const, borderBottom: '1px solid rgba(255,193,7,0.20)', background: 'rgba(255,193,7,0.06)' },
  td:    { fontFamily: 'Tajawal, sans-serif', fontSize: 13.5, color: 'rgba(226,232,240,0.72)', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.7, textAlign: 'right' as const },
};

const CONTACT = {
  email: 'info@kaseet.com',
  wa:    '+962 77 105 2222',
};

export default function CookiesPage() {
  return (
    <div style={S.page}>
      <Navbar />
      <main id="main" style={S.wrap}>

        <div style={S.badge}>سياسة الكوكيز</div>
        <h1 style={S.h1}>سياسة ملفات تعريف الارتباط (Cookies)</h1>
        <span style={S.date}>آخر تحديث: [تاريخ النشر] — إصدار 1.0</span>

        {/* ── 1 ── */}
        <h2 style={S.h2}>1. ما هي ملفات الكوكيز؟</h2>
        <p style={S.p}>
          ملفات الكوكيز هي ملفات نصية صغيرة تُخزَّن على جهازك (حاسوباً أو هاتفاً أو جهازاً لوحياً) عند زيارتك لموقع kaseet.com. تُستخدم هذه الملفات لتحسين تجربتك وتمكين وظائف الموقع الأساسية.
        </p>
        <div style={S.rule} />

        {/* ── 2 ── */}
        <h2 style={S.h2}>2. إعلان عدم التتبع</h2>
        <div style={S.info}>
          <p style={{ ...S.p, margin: 0, color: '#4ade80', fontWeight: 600 }}>
            ✓ لا نستخدم أي أدوات تتبع إعلاني تابعة لأطراف ثالثة (مثل Facebook Pixel أو Google Ads).<br/>
            ✓ لا نشارك بياناتك السلوكية مع شبكات الإعلانات.<br/>
            ✓ لا نقوم بتتبع نشاطك على مواقع أخرى خارج kaseet.com.
          </p>
        </div>
        <div style={S.rule} />

        {/* ── 3 ── */}
        <h2 style={S.h2}>3. أنواع الكوكيز التي نستخدمها</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>النوع</th>
              <th style={S.th}>الغرض</th>
              <th style={S.th}>مدة الصلاحية</th>
              <th style={S.th}>إلزامي؟</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.td}>ضرورية (Session)</td>
              <td style={S.td}>الحفاظ على جلسة المستخدم، منع الطلبات المزوّرة (CSRF)</td>
              <td style={S.td}>حتى إغلاق المتصفح</td>
              <td style={{ ...S.td, color: '#4ade80', fontWeight: 700 }}>نعم</td>
            </tr>
            <tr>
              <td style={S.td}>تفضيلات</td>
              <td style={S.td}>حفظ اللغة والعملة المختارة</td>
              <td style={S.td}>30 يوماً</td>
              <td style={{ ...S.td, color: '#FFA500' }}>اختياري</td>
            </tr>
            <tr>
              <td style={S.td}>تحليلية (أولى)</td>
              <td style={S.td}>قياس عدد الزوار والصفحات الأكثر زيارة (بيانات مجمّعة مجهولة)</td>
              <td style={S.td}>90 يوماً</td>
              <td style={{ ...S.td, color: '#FFA500' }}>اختياري</td>
            </tr>
            <tr>
              <td style={S.td}>أمنية</td>
              <td style={S.td}>كشف المحاولات المشبوهة وحماية الحسابات</td>
              <td style={S.td}>جلسة + 7 أيام</td>
              <td style={{ ...S.td, color: '#4ade80', fontWeight: 700 }}>نعم</td>
            </tr>
          </tbody>
        </table>
        <p style={S.p}>
          <strong style={{ color: 'rgba(252,251,251,0.88)' }}>ملاحظة:</strong> الكوكيز الضرورية والأمنية لا يمكن تعطيلها إذ أنها ضرورية لعمل الموقع بشكل آمن وسليم.
        </p>
        <div style={S.rule} />

        {/* ── 4 ── */}
        <h2 style={S.h2}>4. كيف تدير كوكيز المتصفح</h2>
        <p style={S.p}>يمكنك التحكم في الكوكيز عبر إعدادات متصفحك:</p>
        <ul style={S.ul}>
          <li style={S.li}><strong>Chrome:</strong> الإعدادات ← الخصوصية والأمان ← ملفات تعريف الارتباط</li>
          <li style={S.li}><strong>Firefox:</strong> الإعدادات ← الخصوصية والحماية</li>
          <li style={S.li}><strong>Safari:</strong> الإعدادات ← Safari ← الخصوصية</li>
          <li style={S.li}><strong>Edge:</strong> الإعدادات ← ملفات تعريف الارتباط والبيانات</li>
        </ul>
        <p style={S.p}>
          تنبيه: تعطيل الكوكيز الضرورية قد يُعطّل وظائف جوهرية في الموقع مثل نماذج الحجز وصفحات المحتوى التدريبي.
        </p>
        <div style={S.rule} />

        {/* ── 5 ── */}
        <h2 style={S.h2}>5. الكوكيز المُضمَّنة من أطراف ثالثة</h2>
        <p style={S.p}>يستخدم موقعنا المحتوى المُضمَّن التالي والذي قد يُولّد كوكيز خاصة بتلك المنصات:</p>
        <ul style={S.ul}>
          <li style={S.li}><strong>Instagram (Meta):</strong> مقاطع ريلز مُضمَّنة — تخضع لسياسة خصوصية Meta.</li>
          <li style={S.li}><strong>خرائط Google:</strong> لعرض موقع الاستوديو — تخضع لسياسة خصوصية Google.</li>
          <li style={S.li}><strong>بوابات الدفع:</strong> لإتمام المعاملات المالية بأمان.</li>
        </ul>
        <p style={S.p}>
          لا نتحكم في كوكيز هذه الأطراف. ننصحك بمراجعة سياسات الخصوصية الخاصة بكل منها.
        </p>
        <div style={S.rule} />

        {/* ── 6 ── */}
        <h2 style={S.h2}>6. موافقة الكوكيز وسحبها</h2>
        <p style={S.p}>
          بزيارة موقعنا لأول مرة، ستظهر لك نافذة تطلب موافقتك على الكوكيز الاختيارية (التفضيلية والتحليلية). يمكنك:
        </p>
        <ul style={S.ul}>
          <li style={S.li}>قبول جميع الكوكيز بنقرة واحدة.</li>
          <li style={S.li}>قبول الكوكيز الضرورية فقط.</li>
          <li style={S.li}>تعديل تفضيلاتك لاحقاً عبر زر "إعدادات الكوكيز" في أسفل الصفحة.</li>
          <li style={S.li}>سحب الموافقة في أي وقت دون أن يؤثر ذلك على مشروعية المعالجة السابقة.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 7 ── */}
        <h2 style={S.h2}>7. تحديثات السياسة والتواصل</h2>
        <p style={S.p}>
          قد نُحدّث هذه السياسة دورياً. سيُشار إلى تاريخ آخر تحديث أعلى الصفحة. للاستفسار:
        </p>
        <div style={S.info}>
          <p style={{ ...S.p, margin: 0 }}>
            البريد: <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFC107' }}>{CONTACT.email}</a><br/>
            واتساب: <span dir="ltr">{CONTACT.wa}</span>
          </p>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
