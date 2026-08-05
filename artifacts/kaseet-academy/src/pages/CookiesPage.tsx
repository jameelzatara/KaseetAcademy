// ── Cookies Policy Page ───────────────────────────────────────
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';

const F = 'Tajawal, sans-serif';
const GOLD = '#FFC107';

const COOKIE_TYPES = [
  {
    name: 'ملفات الارتباط الضرورية',
    desc: 'ضرورية لعمل الموقع وتوفير الخدمات الأساسية كالتنقل وتأمين الصفحات. لا يمكن إيقافها.',
    examples: 'جلسة المتصفح، الأمان، تفضيلات اللغة.',
    required: true,
  },
  {
    name: 'ملفات الارتباط التحليلية',
    desc: 'تساعدنا على فهم كيفية استخدام الزوار للموقع، وذلك بشكل مُجمَّع ومجهول الهوية.',
    examples: 'Google Analytics — عدد الزيارات، مصادر الزيارة، أكثر الصفحات مشاهدةً.',
    required: false,
  },
  {
    name: 'ملفات الارتباط الوظيفية',
    desc: 'تتذكّر تفضيلاتك وإعداداتك لتقديم تجربة أكثر تخصيصاً.',
    examples: 'تفضيلات اللغة، آخر الصفحات التي زرتها.',
    required: false,
  },
];

export default function CookiesPage() {
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
            سياسة ملفات الارتباط (Cookies)
          </h1>
          <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(203,213,225,0.55)', margin: 0 }}>
            آخر تحديث: يوليو 2025
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '52px 24px 80px' }}>
        <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(226,232,240,0.80)', lineHeight: 1.9, margin: '0 0 40px' }}>
          تشرح هذه السياسة ما هي ملفات الارتباط وكيف يستخدمها موقع أكاديمية كاسيت ميديا. ملفات الارتباط (Cookies) ملفات نصية صغيرة تُخزَّن على جهازك عند زيارة الموقع.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 44 }}>
          {COOKIE_TYPES.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.required ? 'rgba(37,211,102,0.20)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 16, padding: '24px 26px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 16.5, color: GOLD, margin: 0 }}>{c.name}</h2>
                {c.required && (
                  <span style={{
                    fontFamily: F, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999,
                    background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.28)',
                    color: '#4ade80', flexShrink: 0,
                  }}>ضروري</span>
                )}
              </div>
              <p style={{ fontFamily: F, fontSize: 14.5, color: 'rgba(226,232,240,0.75)', margin: '0 0 10px', lineHeight: 1.85 }}>
                {c.desc}
              </p>
              <p style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(203,213,225,0.45)', margin: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.55)' }}>أمثلة: </strong>{c.examples}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.18)',
          borderRadius: 14, padding: '22px 26px',
        }}>
          <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: GOLD, margin: '0 0 10px' }}>التحكم في ملفات الارتباط</h3>
          <p style={{ fontFamily: F, fontSize: 14.5, color: 'rgba(226,232,240,0.75)', margin: 0, lineHeight: 1.85 }}>
            يمكنك في أي وقت ضبط إعدادات ملفات الارتباط من متصفحك أو حذفها. ابحث في إعدادات متصفحك عن "ملفات تعريف الارتباط" أو "Cookies" للاطلاع على التعليمات المناسبة. ملاحظة: تعطيل بعض ملفات الارتباط قد يؤثر على أداء الموقع.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
