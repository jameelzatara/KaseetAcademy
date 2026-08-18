// ── Privacy Policy — بيركلي للصوتيات المسموعة (كاسيت أكاديمي) ─
// مسوّدة مهنية — تحتاج مراجعة محامٍ أردني مرخَّص قبل النشر
import { useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const S = {
  page:    { minHeight: '100dvh', background: '#FDFBF7', direction: 'rtl' as const },
  wrap:    { maxWidth: 820, margin: '0 auto', padding: '140px 24px 80px', direction: 'rtl' as const },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(123,45,96,0.08)', border: '1px solid rgba(123,45,96,0.22)', color: '#7B2D60', fontSize: 13, fontWeight: 700, marginBottom: 18 },
  h1:      { fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 'clamp(26px,4vw,40px)', color: '#1A2533', margin: '0 0 8px', lineHeight: 1.25 },
  date:    { fontFamily: 'Poppins, sans-serif', fontSize: 12.5, color: 'rgba(26,37,51,0.44)', margin: '0 0 48px', direction: 'ltr' as const, display: 'block' },
  rule:    { height: 1, background: 'linear-gradient(to left, rgba(123,45,96,0.18), transparent)', margin: '40px 0' },
  h2:      { fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 'clamp(17px,2.2vw,22px)', color: '#7B2D60', margin: '0 0 16px' },
  p:       { fontFamily: 'Tajawal, sans-serif', fontWeight: 400, fontSize: 15.5, color: 'rgba(26,37,51,0.75)', lineHeight: 1.95, margin: '0 0 14px', textAlign: 'right' as const },
  ul:      { paddingRight: 20, margin: '0 0 14px', listStyleType: 'disc' as const },
  li:      { fontFamily: 'Tajawal, sans-serif', fontSize: 15.5, color: 'rgba(26,37,51,0.72)', lineHeight: 1.9, marginBottom: 6 },
  info:    { background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.20)', borderRadius: 14, padding: '20px 22px', marginBottom: 14 },
  table:   { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 },
  th:      { fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5, color: '#7B2D60', padding: '10px 14px', textAlign: 'right' as const, borderBottom: '1px solid rgba(123,45,96,0.18)', background: 'rgba(123,45,96,0.06)' },
  td:      { fontFamily: 'Tajawal, sans-serif', fontSize: 13.5, color: 'rgba(26,37,51,0.72)', padding: '10px 14px', borderBottom: '1px solid rgba(26,37,51,0.07)', lineHeight: 1.7, textAlign: 'right' as const },
};

const CONTACT = {
  name:    'بيركلي للصوتيات المسموعة',
  brand:   'كاسيت أكاديمي · استوديو كاسيت',
  tax:     '200189476',
  address: 'شارع باريس، مجمع حجازي البيّر، شارع عبد الرحيم الحاج محمد 67، عمّان، الأردن',
  email:   'info@kaseet.com',
  phone:   '+962 79 023 4483',
  wa:      '+962 77 105 2222',
  hours:   'من 10:00 صباحاً حتى 8:00 مساءً',
};

export default function PrivacyPolicyPage() {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);
  return (
    <div style={S.page}>
      <Navbar />
      <main id="main" style={S.wrap}>

        <PageBreadcrumb crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'سياسة الخصوصية' }]} theme="light" />
        <div style={{ marginBottom: 28 }} />
        <div style={S.badge}>سياسة الخصوصية</div>
        <h1 style={S.h1}>سياسة الخصوصية وحماية البيانات</h1>
        <span style={S.date}>آخر تحديث: [تاريخ النشر] — إصدار 1.0</span>

        {/* ── 1 ── */}
        <h2 style={S.h2}>1. مقدمة وتعريفات</h2>
        <p style={S.p}>
          تُصدر هذه السياسة عن شركة <strong style={{ color: '#1A2533' }}>{CONTACT.name}</strong>، المسجّلة في المملكة الأردنية الهاشمية
          برقم ضريبي {CONTACT.tax}، وتمارس نشاطها التجاري تحت العلامة التجارية <strong style={{ color: '#1A2533' }}>{CONTACT.brand}</strong>.
        </p>
        <p style={S.p}>
          نلتزم بحماية بياناتك الشخصية وفق نظام حماية البيانات الأردني المعمول به. بتصفّح موقعنا أو التسجيل في أي من برامجنا التدريبية، فإنك توافق على الشروط الواردة في هذه السياسة.
        </p>
        <div style={S.info}>
          <strong style={{ color: '#FFC107', display: 'block', marginBottom: 8, fontFamily: 'Tajawal, sans-serif', fontSize: 14 }}>تعريفات أساسية</strong>
          <ul style={S.ul}>
            <li style={S.li}><strong>"البيانات الشخصية"</strong>: أي معلومات تُعرَّف بها أو يمكن من خلالها تعريفك كشخص طبيعي.</li>
            <li style={S.li}><strong>"المعالجة"</strong>: أي عملية تُجرى على البيانات الشخصية بما فيها الجمع والتخزين والاستخدام.</li>
            <li style={S.li}><strong>"المتدرب"</strong>: كل شخص سجّل في برنامج تدريبي أو استفسر عنه.</li>
            <li style={S.li}><strong>"المنصة"</strong>: الموقع الإلكتروني kaseet.com وأنظمة إدارة التعلم المرتبطة به.</li>
          </ul>
        </div>
        <div style={S.rule} />

        {/* ── 2 ── */}
        <h2 style={S.h2}>2. البيانات التي نجمعها</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>نوع البيانات</th>
              <th style={S.th}>أمثلة</th>
              <th style={S.th}>مصدر الجمع</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.td}>بيانات هوية</td>
              <td style={S.td}>الاسم الكامل، الجنس، الجنسية</td>
              <td style={S.td}>نماذج التسجيل</td>
            </tr>
            <tr>
              <td style={S.td}>بيانات تواصل</td>
              <td style={S.td}>البريد الإلكتروني، رقم الهاتف، واتساب</td>
              <td style={S.td}>نماذج التسجيل والاستفسار</td>
            </tr>
            <tr>
              <td style={S.td}>بيانات مالية</td>
              <td style={S.td}>إيصالات الدفع، آخر 4 أرقام البطاقة</td>
              <td style={S.td}>بوابات الدفع المعتمدة</td>
            </tr>
            <tr>
              <td style={S.td}>بيانات صوتية ومرئية</td>
              <td style={S.td}>تسجيلات التدريب، الملفات الصوتية</td>
              <td style={S.td}>الجلسات التدريبية (بموافقتك)</td>
            </tr>
            <tr>
              <td style={S.td}>بيانات تقنية</td>
              <td style={S.td}>عنوان IP، نوع المتصفح، الصفحات المزارة</td>
              <td style={S.td}>تلقائياً عبر الموقع</td>
            </tr>
            <tr>
              <td style={S.td}>بيانات تواصل مع الدعم</td>
              <td style={S.td}>رسائل واتساب، البريد الإلكتروني، ملاحظات الاستشارة</td>
              <td style={S.td}>التواصل المباشر</td>
            </tr>
          </tbody>
        </table>
        <div style={S.rule} />

        {/* ── 3 ── */}
        <h2 style={S.h2}>3. أسباب الجمع والأسس القانونية</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>تنفيذ العقد:</strong> معالجة التسجيل، تنظيم الجلسات، منح الشهادات.</li>
          <li style={S.li}><strong>المصلحة المشروعة:</strong> تحسين خدماتنا وتطوير مناهجنا التدريبية.</li>
          <li style={S.li}><strong>الالتزام القانوني:</strong> الامتثال للمتطلبات الضريبية والمحاسبية الأردنية.</li>
          <li style={S.li}><strong>الموافقة الصريحة:</strong> إرسال النشرات التسويقية والعروض الترويجية (يمكنك سحب موافقتك في أي وقت).</li>
        </ul>
        <div style={S.rule} />

        {/* ── 4 ── */}
        <h2 style={S.h2}>4. مشاركة البيانات مع أطراف ثالثة</h2>
        <p style={S.p}>لا نبيع بياناتك الشخصية ولا نُتاجر بها. نشاركها فقط في الحالات التالية:</p>
        <ul style={S.ul}>
          <li style={S.li}>مزوّدو بوابات الدفع الإلكتروني — لإتمام المعاملات المالية فحسب.</li>
          <li style={S.li}>منصات البث المباشر — لتمكينك من حضور الجلسات عبر الإنترنت.</li>
          <li style={S.li}>تطبيق وجيز — لإصدار الشهادات المعتمدة (الاسم الكامل وعنوان البريد الإلكتروني فقط).</li>
          <li style={S.li}>الجهات الحكومية والقضائية — عند الطلب القانوني الملزم.</li>
          <li style={S.li}>مقدّمو الاستضافة السحابية — بموجب اتفاقيات معالجة بيانات صارمة.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 5 ── */}
        <h2 style={S.h2}>5. الاحتفاظ بالبيانات ومدتها</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>نوع البيانات</th>
              <th style={S.th}>مدة الاحتفاظ</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={S.td}>بيانات المتدربين النشطين</td><td style={S.td}>طوال فترة الاشتراك + سنة</td></tr>
            <tr><td style={S.td}>السجلات المالية والإيصالات</td><td style={S.td}>7 سنوات (الحد الأدنى وفق النظام الأردني)</td></tr>
            <tr><td style={S.td}>الملفات الصوتية التدريبية</td><td style={S.td}>حتى انتهاء الدورة + 30 يوماً إلا بموافقتك</td></tr>
            <tr><td style={S.td}>سجلات التواصل والدعم</td><td style={S.td}>سنة واحدة من آخر تواصل</td></tr>
            <tr><td style={S.td}>البيانات التسويقية</td><td style={S.td}>حتى سحب الموافقة أو 3 سنوات أيهما أقرب</td></tr>
          </tbody>
        </table>
        <div style={S.rule} />

        {/* ── 6 ── */}
        <h2 style={S.h2}>6. حقوقك كموضوع بيانات</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong>حق الوصول:</strong> طلب نسخة من بياناتك المحفوظة لدينا.</li>
          <li style={S.li}><strong>حق التصحيح:</strong> تصحيح أي بيانات غير دقيقة أو ناقصة.</li>
          <li style={S.li}><strong>حق المحو:</strong> طلب حذف بياناتك (مع مراعاة الالتزامات القانونية).</li>
          <li style={S.li}><strong>حق تقييد المعالجة:</strong> تقييد استخدام بياناتك في ظروف معينة.</li>
          <li style={S.li}><strong>حق الاعتراض:</strong> الاعتراض على معالجة بياناتك للأغراض التسويقية في أي وقت.</li>
          <li style={S.li}><strong>حق النقل:</strong> الحصول على بياناتك بصيغة مقروءة آلياً لنقلها.</li>
        </ul>
        <p style={S.p}>لممارسة أي من هذه الحقوق، تواصل معنا على <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFC107' }}>{CONTACT.email}</a> أو واتساب {CONTACT.wa}. سنردّ خلال 15 يوم عمل.</p>
        <div style={S.rule} />

        {/* ── 7 ── */}
        <h2 style={S.h2}>7. الأمن والحماية</h2>
        <ul style={S.ul}>
          <li style={S.li}>نشفّر البيانات المنقولة باستخدام بروتوكول TLS 1.2 أو أعلى (HTTPS).</li>
          <li style={S.li}>لا نخزّن كلمات المرور نصاً صريحاً — نستخدم خوارزميات تجزئة آمنة (bcrypt/argon2).</li>
          <li style={S.li}>يقتصر وصول الموظفين على البيانات اللازمة لأداء مهامهم.</li>
          <li style={S.li}>نجري نسخاً احتياطياً دورياً مشفّراً لقواعد البيانات.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 8 ── */}
        <h2 style={S.h2}>8. ملفات تعريف الارتباط (Cookies)</h2>
        <p style={S.p}>
          نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. لمزيد من التفاصيل حول أنواع الكوكيز التي نستخدمها وكيفية إدارتها، يُرجى الاطلاع على{' '}
          <a href="/cookies" style={{ color: '#FFC107' }}>سياسة الكوكيز</a>.
        </p>
        <div style={S.rule} />

        {/* ── 9 ── */}
        <h2 style={S.h2}>9. الروابط الخارجية</h2>
        <p style={S.p}>
          قد يحتوي موقعنا على روابط لمواقع خارجية مثل وجيز وخرائط Google. لا نتحمل أي مسؤولية عن سياسات الخصوصية أو ممارسات هذه المواقع. ننصحك بمراجعة سياسة الخصوصية لكل موقع تزوره.
        </p>
        <div style={S.rule} />

        {/* ── 10 ── */}
        <h2 style={S.h2}>10. بيانات الأطفال</h2>
        <p style={S.p}>
          خدماتنا موجّهة للبالغين (18 سنة فأكثر). لا نجمع بيانات الأشخاص دون هذا السن عن قصد. إذا علمت أن طفلاً قدّم بياناته دون علمك، تواصل معنا فوراً لحذفها.
        </p>
        <div style={S.rule} />

        {/* ── 11 ── */}
        <h2 style={S.h2}>11. التحديثات على هذه السياسة</h2>
        <p style={S.p}>
          نحتفظ بحق تحديث هذه السياسة في أي وقت. سنُبلّغك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع. مواصلة استخدام خدماتنا بعد إشعار التحديث يُعدّ قبولاً للتغييرات.
        </p>
        <div style={S.rule} />

        {/* ── 12 ── */}
        <h2 style={S.h2}>12. التواصل والشكاوى</h2>
        <div style={S.info}>
          <p style={{ ...S.p, margin: 0 }}>
            <strong style={{ color: '#1A2533' }}>{CONTACT.name}</strong><br/>
            {CONTACT.brand}<br/>
            {CONTACT.address}<br/>
            البريد: <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFC107' }}>{CONTACT.email}</a><br/>
            هاتف: <span dir="ltr">{CONTACT.phone}</span> · واتساب: <span dir="ltr">{CONTACT.wa}</span><br/>
            {CONTACT.hours}
          </p>
        </div>
        <p style={S.p}>
          إذا رأيت أننا لم نُعالج شكواك بشكل مُرضٍ، يحق لك التقدّم بشكوى إلى الجهة المختصة بحماية البيانات في المملكة الأردنية الهاشمية.
        </p>

      </main>
      <SiteFooter />
    </div>
  );
}
