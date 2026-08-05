// ── Terms & Conditions Page ───────────────────────────────────
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

const F = 'Tajawal, sans-serif';

const SECTIONS = [
  {
    title: 'القبول بالشروط',
    body: 'باستخدامك لموقع أكاديمية كاسيت ميديا أو التسجيل في أي من برامجنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام خدماتنا.',
  },
  {
    title: 'الخدمات التعليمية',
    body: 'تقدّم أكاديمية كاسيت ميديا برامج تدريبية في مجالات الأداء الصوتي والتعليق والإعلام والخطابة. تتضمن برامجنا جلسات حضورية في استوديوهاتنا في عمّان، ودورات مباشرة أونلاين. يتحمّل المتدرب مسؤولية اختيار البرنامج المناسب لمستواه.',
  },
  {
    title: 'التسجيل وحجز المقعد',
    body: 'يُعدّ المقعد محجوزاً عند إتمام عملية الدفع وتأكيدها. المقاعد محدودة في كل دفعة ولا تحتجز دون دفع. يحق للأكاديمية رفض أي تسجيل لا يستوفي شروط البرنامج المحددة.',
  },
  {
    title: 'الملكية الفكرية',
    body: 'جميع المحتويات التعليمية المُقدَّمة في الدورات — بما فيها المقاطع الصوتية والمرئية والمواد المطبوعة — هي ملكية حصرية لأكاديمية كاسيت ميديا ومحمية بقوانين الملكية الفكرية. يُحظر نشرها أو إعادة توزيعها دون إذن خطي مسبق.',
  },
  {
    title: 'سلوك المتدرب',
    body: 'يلتزم المتدرب بالاحترام المتبادل مع المدربين والمتدربين الآخرين، والحضور في المواعيد المحددة، والمشاركة الإيجابية في أنشطة البرنامج. تحتفظ الأكاديمية بحق إنهاء تسجيل أي متدرب يُخل بالبيئة التعليمية.',
  },
  {
    title: 'الشهادة والاعتماد',
    body: 'تُمنح شهادة الإتمام للمتدربين الذين استوفوا متطلبات الحضور والتقييم لكل برنامج. الشهادة الصادرة معتمدة من منصة وجيز وقابلة للمشاركة على المنصات المهنية.',
  },
  {
    title: 'تعديل الشروط',
    body: 'تحتفظ أكاديمية كاسيت ميديا بحق تعديل هذه الشروط في أي وقت. التعديلات الجوهرية تُنشر على هذه الصفحة ويُعدّ استمرار استخدام الخدمة موافقةً عليها.',
  },
];

export default function TermsPage() {
  return (
    <div dir="rtl" style={{ background: '#1A2533', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      <div style={{ background: 'rgba(0,0,0,0.30)', borderBottom: '1px solid rgba(255,193,7,0.12)', padding: '120px 24px 52px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 999,
            background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
            color: '#FFC107', fontSize: 12.5, fontFamily: F, fontWeight: 700, marginBottom: 16,
          }}>قانوني</span>
          <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(28px,4vw,40px)', color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            الشروط والأحكام
          </h1>
          <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(203,213,225,0.55)', margin: 0 }}>
            آخر تحديث: يوليو 2025
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '52px 24px 80px' }}>
        <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(226,232,240,0.80)', lineHeight: 1.9, margin: '0 0 40px' }}>
          تحكم هذه الشروط والأحكام علاقتك بأكاديمية كاسيت ميديا وتحدّد حقوق وواجبات كلا الطرفين. يُرجى قراءتها بعناية قبل الالتحاق بأي من برامجنا.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '26px 28px',
            }}>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: '#FFC107', margin: '0 0 12px' }}>
                {`${i + 1}. ${s.title}`}
              </h2>
              <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(226,232,240,0.75)', lineHeight: 1.9, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: F, fontSize: 13.5, color: 'rgba(203,213,225,0.45)', margin: '40px 0 0', lineHeight: 1.8 }}>
          في حال وجود أي استفسار حول هذه الشروط، يُرجى التواصل معنا على: info@kaseetmedia.com
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
