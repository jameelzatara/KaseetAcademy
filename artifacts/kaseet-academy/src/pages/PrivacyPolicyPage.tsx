// ── Privacy Policy Page ───────────────────────────────────────
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

const F = 'Tajawal, sans-serif';

const SECTIONS = [
  {
    title: 'المعلومات التي نجمعها',
    body: 'نجمع المعلومات التي تقدّمها مباشرةً عند التسجيل في دوراتنا أو التواصل معنا، وتشمل: الاسم، رقم الهاتف، البريد الإلكتروني، ومدينة الإقامة. كذلك نجمع معلومات تقنية مُجمَّعة عن استخدام الموقع بهدف تحسين تجربتك.',
  },
  {
    title: 'كيف نستخدم معلوماتك',
    body: 'نستخدم المعلومات المُجمَّعة لتقديم الخدمات التعليمية، التواصل معك بشأن الدورات والمواعيد، إرسال تأكيدات التسجيل، وتحسين محتوى برامجنا. لن نبيع معلوماتك لأطراف ثالثة ولن نشاركها إلا بموافقتك أو وفق ما يقتضيه القانون.',
  },
  {
    title: 'حماية البيانات',
    body: 'نتّخذ تدابير تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرّح به أو الإفصاح أو التعديل أو الإتلاف. يقتصر الوصول إلى بياناتك على الموظفين الذين يحتاجون إليها لأداء مهامهم.',
  },
  {
    title: 'ملفات الارتباط (Cookies)',
    body: 'يستخدم موقعنا ملفات ارتباط ضرورية لضمان عمله بشكل سليم، وملفات ارتباط تحليلية مُجمَّعة لفهم أنماط الاستخدام. يمكنك ضبط إعدادات ملفات الارتباط من متصفحك في أي وقت.',
  },
  {
    title: 'حقوقك',
    body: 'يحق لك في أي وقت طلب الاطلاع على بياناتك الشخصية المحفوظة لدينا، طلب تصحيحها أو تحديثها، أو طلب حذفها وفق القوانين السارية. للتواصل بشأن أي من هذه الطلبات، راسلنا على: info@kaseetmedia.com.',
  },
  {
    title: 'التعديلات على هذه السياسة',
    body: 'نحتفظ بحق تعديل سياسة الخصوصية هذه في أي وقت. ستُنشر أي تعديلات جوهرية على هذه الصفحة مع تحديث تاريخ "آخر تحديث". ننصح بمراجعة هذه الصفحة دورياً.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div dir="rtl" style={{ background: '#1A2533', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'rgba(0,0,0,0.30)', borderBottom: '1px solid rgba(255,193,7,0.12)', padding: '120px 24px 52px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 999,
            background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
            color: '#FFC107', fontSize: 12.5, fontFamily: F, fontWeight: 700,
            marginBottom: 16,
          }}>قانوني</span>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(28px,4vw,40px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            سياسة الخصوصية
          </h1>
          <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(203,213,225,0.55)', margin: 0 }}>
            آخر تحديث: يوليو 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '52px 24px 80px' }}>
        <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(226,232,240,0.80)', lineHeight: 1.9, margin: '0 0 40px' }}>
          تصف هذه السياسة الطريقة التي تتعامل بها أكاديمية كاسيت ميديا مع المعلومات الشخصية التي تُجمَع عبر موقعنا الإلكتروني وخدماتنا التعليمية. باستخدامك لخدماتنا، فإنك توافق على الممارسات الواردة في هذه الوثيقة.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '28px 28px',
            }}>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: '#FFC107', margin: '0 0 14px' }}>
                {s.title}
              </h2>
              <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(226,232,240,0.75)', lineHeight: 1.9, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 52, padding: '24px 28px', background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.18)', borderRadius: 14 }}>
          <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(255,255,255,0.80)', margin: '0 0 8px', fontWeight: 700 }}>
            للتواصل بشأن الخصوصية
          </p>
          <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(203,213,225,0.65)', margin: 0, lineHeight: 1.8 }}>
            البريد الإلكتروني: info@kaseetmedia.com
            <br/>واتساب: +962 77 105 2222
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
