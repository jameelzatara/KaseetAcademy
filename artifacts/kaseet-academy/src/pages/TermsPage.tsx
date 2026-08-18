// ── Terms & Conditions — بيركلي للصوتيات المسموعة (كاسيت أكاديمي) ─
// مسوّدة مهنية — تحتاج مراجعة محامٍ أردني مرخَّص قبل النشر
import { useEffect } from 'react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const S = {
  page:  { minHeight: '100dvh', background: '#FDFBF7', direction: 'rtl' as const },
  wrap:  { maxWidth: 820, margin: '0 auto', padding: '140px 24px 80px', direction: 'rtl' as const },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(123,45,96,0.08)', border: '1px solid rgba(123,45,96,0.22)', color: '#7B2D60', fontSize: 13, fontWeight: 700, marginBottom: 18 },
  h1:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 'clamp(26px,4vw,40px)', color: '#1A2533', margin: '0 0 8px', lineHeight: 1.25 },
  date:  { fontFamily: 'Poppins, sans-serif', fontSize: 12.5, color: 'rgba(26,37,51,0.44)', margin: '0 0 48px', direction: 'ltr' as const, display: 'block' },
  rule:  { height: 1, background: 'linear-gradient(to left, rgba(123,45,96,0.18), transparent)', margin: '40px 0' },
  h2:    { fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 'clamp(17px,2.2vw,22px)', color: '#7B2D60', margin: '0 0 16px' },
  p:     { fontFamily: 'Tajawal, sans-serif', fontWeight: 400, fontSize: 15.5, color: 'rgba(26,37,51,0.75)', lineHeight: 1.95, margin: '0 0 14px', textAlign: 'right' as const },
  ul:    { paddingRight: 20, margin: '0 0 14px', listStyleType: 'disc' as const },
  li:    { fontFamily: 'Tajawal, sans-serif', fontSize: 15.5, color: 'rgba(26,37,51,0.72)', lineHeight: 1.9, marginBottom: 6 },
  info:  { background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.20)', borderRadius: 14, padding: '20px 22px', marginBottom: 14 },
};

const CONTACT = {
  name:    'بيركلي للصوتيات المسموعة',
  brand:   'كاسيت أكاديمي',
  email:   'info@kaseet.com',
  wa:      '+962 77 105 2222',
};

export default function TermsPage() {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);
  return (
    <div style={S.page}>
      <Navbar />
      <main id="main" style={S.wrap}>

        <PageBreadcrumb crumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'الشروط والأحكام' }]} theme="light" />
        <div style={{ marginBottom: 28 }} />
        <div style={S.badge}>الشروط والأحكام</div>
        <h1 style={S.h1}>الشروط والأحكام العامة لاستخدام الخدمات</h1>
        <span style={S.date}>آخر تحديث: [تاريخ النشر] — إصدار 1.0</span>

        {/* ── 1 ── */}
        <h2 style={S.h2}>1. الأطراف والقبول</h2>
        <p style={S.p}>
          تُبرَم هذه الاتفاقية بينك ("المتدرب" أو "المستخدم") وبين شركة <strong style={{ color: '#1A2533' }}>{CONTACT.name}</strong>، المسجّلة في الأردن والمشغّلة تحت علامة <strong style={{ color: '#1A2533' }}>{CONTACT.brand}</strong>.
        </p>
        <p style={S.p}>
          بتسجيلك في أي برنامج أو دورة أو باستخدام الموقع الإلكتروني، فإنك تُقرّ بقراءة هذه الشروط وفهمها والموافقة عليها. إذا كنت لا توافق على أي من هذه الشروط، يُرجى عدم استخدام خدماتنا.
        </p>
        <div style={S.rule} />

        {/* ── 2 ── */}
        <h2 style={S.h2}>2. وصف الخدمات</h2>
        <p style={S.p}>تقدّم {CONTACT.brand} الخدمات التالية:</p>
        <ul style={S.ul}>
          <li style={S.li}>برامج تدريبية حضورية في استوديو كاسيت بعمّان، الأردن.</li>
          <li style={S.li}>دورات مباشرة تفاعلية عبر الإنترنت (Online LIVE) بجداول أسبوعية ثابتة.</li>
          <li style={S.li}>ماستركلاسات احترافية في الأداء الصوتي، الإعلام، وفن الخطابة.</li>
          <li style={S.li}>استشارات تعليمية مجانية عبر واتساب.</li>
          <li style={S.li}>إصدار شهادات إتمام معتمدة من تطبيق وجيز.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 3 ── */}
        <h2 style={S.h2}>3. التسجيل والأهلية</h2>
        <ul style={S.ul}>
          <li style={S.li}>يُشترط أن يكون عمر المتدرب 18 سنة فأكثر، أو الحصول على موافقة ولي الأمر.</li>
          <li style={S.li}>يُقرّ المتدرب بصحة المعلومات المقدّمة عند التسجيل.</li>
          <li style={S.li}>يحق للأكاديمية رفض أي طلب تسجيل دون إبداء أسباب.</li>
          <li style={S.li}>لا يُسمح بنقل مقعد التدريب إلى طرف آخر إلا بموافقة خطية مسبقة.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 4 ── */}
        <h2 style={S.h2}>4. الرسوم والدفع</h2>
        <ul style={S.ul}>
          <li style={S.li}>الأسعار المعلنة بالدينار الأردني ما لم يُذكر خلاف ذلك صراحةً.</li>
          <li style={S.li}>يُتمّ الحجز فور استلام الرسوم كاملةً أو الدفعة الأولى المتفق عليها.</li>
          <li style={S.li}>نقبل: التحويل البنكي، الدفع الإلكتروني، كروت الفيزا/ماستركارد.</li>
          <li style={S.li}>خيار الدفع على دفعتين متاح لبعض البرامج عند الطلب المسبق.</li>
          <li style={S.li}>تخضع الأسعار للتغيير دون إشعار مسبق؛ لكن الرسوم المدفوعة مسبقاً ثابتة.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 5 ── */}
        <h2 style={S.h2}>5. الجدول الزمني والحضور</h2>
        <ul style={S.ul}>
          <li style={S.li}>يُنشر الجدول المفصّل لكل دورة قبل بدئها بما لا يقل عن 7 أيام.</li>
          <li style={S.li}>تُسجَّل جلسات مباشر تفاعلي (Online LIVE) وتُرفع خلال 24 ساعة في مساحة المتدرب.</li>
          <li style={S.li}>الغياب لا يُسقط الرسوم إلا في حالات مقبولة وموثّقة طبياً أو قانونياً.</li>
          <li style={S.li}>تحتفظ الأكاديمية بحق تأجيل أي جلسة أو تغيير مكانها مع إشعار 48 ساعة.</li>
          <li style={S.li}>في حالة إلغاء الدورة كاملاً من طرف الأكاديمية، يُعاد المبلغ كاملاً خلال 7 أيام عمل.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 6 ── */}
        <h2 style={S.h2}>6. الملكية الفكرية</h2>
        <p style={S.p}>
          جميع المواد التدريبية (فيديوهات، ملفات PDF، مقاطع صوتية، مناهج، اختبارات) ملكية حصرية لـ {CONTACT.brand} ومحمية بموجب قوانين الملكية الفكرية الأردنية والدولية.
        </p>
        <ul style={S.ul}>
          <li style={S.li}>يُحظر إعادة نشر أي مادة تدريبية أو بيعها أو توزيعها دون إذن خطي.</li>
          <li style={S.li}>يُحظر تسجيل الجلسات الحضورية أو المباشرة دون موافقة صريحة مسبقة.</li>
          <li style={S.li}>يحق للمتدرب الاحتفاظ بالمواد لاستخدامه الشخصي والتعليمي فحسب.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 7 ── */}
        <h2 style={S.h2}>7. قواعد السلوك</h2>
        <p style={S.p}>يلتزم المتدرب بما يلي داخل الجلسات (حضورياً ومباشر تفاعلي):</p>
        <ul style={S.ul}>
          <li style={S.li}>الاحترام الكامل للمدربين والمتدربين الآخرين.</li>
          <li style={S.li}>الالتزام بالجداول الزمنية والتعليمات الإدارية.</li>
          <li style={S.li}>عدم استخدام أي معدات أو أنظمة الأكاديمية لأغراض غير تدريبية.</li>
          <li style={S.li}>الامتناع عن أي سلوك مسيء أو تنمّر أو تحرّش.</li>
        </ul>
        <p style={S.p}>
          يحق للأكاديمية فصل أي متدرب يخالف هذه القواعد دون استرداد الرسوم.
        </p>
        <div style={S.rule} />

        {/* ── 8 ── */}
        <h2 style={S.h2}>8. الشهادات والاعتماد</h2>
        <ul style={S.ul}>
          <li style={S.li}>تُمنح الشهادة بعد إتمام متطلبات الدورة كاملةً.</li>
          <li style={S.li}>اعتماد وجيز مشروط بالتسجيل الصحيح وإكمال المتطلبات.</li>
          <li style={S.li}>الشهادة شخصية ولا يمكن نقلها أو التنازل عنها.</li>
          <li style={S.li}>في حالة اكتشاف تزوير أو انتحال هوية، يُلغى الاعتماد فوراً وتُتخذ الإجراءات القانونية اللازمة.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 9 ── */}
        <h2 style={S.h2}>9. حدود المسؤولية</h2>
        <p style={S.p}>
          تبذل {CONTACT.brand} أقصى الجهود لتقديم تدريب عالي الجودة، غير أنها لا تضمن نتائج محددة (كالتوظيف أو مستوى دخل معيّن) نتيجة المشاركة في أي برنامج.
        </p>
        <ul style={S.ul}>
          <li style={S.li}>لا تتحمل الأكاديمية مسؤولية أي أضرار غير مباشرة أو تبعية تنشأ عن استخدام الخدمات.</li>
          <li style={S.li}>الحد الأقصى لمسؤولية الأكاديمية في جميع الأحوال لا يتجاوز مبلغ الرسوم المدفوعة فعلاً.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 10 ── */}
        <h2 style={S.h2}>10. السياسة الخاصة بالبيانات والخصوصية</h2>
        <p style={S.p}>
          تُطبَّق على جمع بياناتك ومعالجتها <a href="/privacy-policy" style={{ color: '#FFC107' }}>سياسة الخصوصية</a> المتكاملة المنشورة على الموقع، والتي تُشكّل جزءاً لا يتجزأ من هذه الشروط.
        </p>
        <div style={S.rule} />

        {/* ── 11 ── */}
        <h2 style={S.h2}>11. التعديلات والإشعارات</h2>
        <p style={S.p}>
          تحتفظ الأكاديمية بحق تعديل هذه الشروط في أي وقت. ستُرسَل الإشعارات عبر البريد الإلكتروني المسجّل. مواصلة استخدام الخدمات يُعدّ قبولاً للتعديلات.
        </p>
        <div style={S.rule} />

        {/* ── 12 ── */}
        <h2 style={S.h2}>12. إنهاء الاتفاقية</h2>
        <ul style={S.ul}>
          <li style={S.li}>يحق للمتدرب الانسحاب وفق شروط الاسترداد المفصّلة في <a href="/refund-policy" style={{ color: '#FFC107' }}>سياسة الاسترداد</a>.</li>
          <li style={S.li}>يحق للأكاديمية إنهاء الاتفاقية فوراً في حال خرق جوهري لهذه الشروط.</li>
        </ul>
        <div style={S.rule} />

        {/* ── 13 ── */}
        <h2 style={S.h2}>13. استمرارية الأحكام</h2>
        <p style={S.p}>
          إذا تبيّن أن أي بند من هذه الشروط غير قابل للتطبيق قانونياً، تبقى سائر الأحكام سارية المفعول الكامل.
        </p>
        <div style={S.rule} />

        {/* ── 14 ── */}
        <h2 style={S.h2}>14. القانون الحاكم والقضاء المختص</h2>
        <p style={S.p}>
          تخضع هذه الشروط لأحكام القانون الأردني. يُعدّ القضاء الأردني صاحب الاختصاص الحصري للفصل في أي نزاع ينشأ عنها.
        </p>
        <div style={S.rule} />

        {/* ── 15 ── */}
        <h2 style={S.h2}>15. التواصل</h2>
        <div style={S.info}>
          <p style={{ ...S.p, margin: 0 }}>
            للاستفسار عن هذه الشروط، تواصل معنا:<br/>
            البريد: <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFC107' }}>{CONTACT.email}</a><br/>
            واتساب: <span dir="ltr">{CONTACT.wa}</span>
          </p>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
