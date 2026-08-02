// ── Instructors Section ─────────────────────────────────────
import { Users, Clock, Globe, Award, Tv, GraduationCap, Mic } from 'lucide-react';
import SectionHeader, { Gold } from './SectionHeader';

const F  = 'Tajawal, sans-serif';
const FP = "'Poppins', sans-serif";
const GOLD = '#FFC107';

// ── card colours matching the reference design ────────────────
const CARD_BG     = 'rgba(13, 18, 38, 0.92)';
const CARD_BORDER = 'rgba(255,255,255,0.09)';
const HEADER_BG   = 'rgba(18, 25, 52, 0.95)';
const BIO_BG      = 'rgba(20, 28, 56, 0.75)';

type IconComponent = typeof Users;

interface Badge {
  icon: IconComponent;
  label: string;
}

interface Instructor {
  initials: string;
  name: string;
  role: string;
  badges: Badge[];
  bio: string;
}

const INSTRUCTORS: Instructor[] = [
  {
    initials: 'ي.ع',
    name:  'يسار عبده',
    role:  'مدربة إعلامية وخبيرة تعليق صوتي',
    badges: [
      { icon: Users,         label: '3,000+ طالب مدرّب'        },
      { icon: Clock,         label: 'خبرة 20+ سنة'             },
      { icon: Globe,         label: 'معتمدة لدى الأمم المتحدة'  },
    ],
    bio: 'مدربة معتمدة لدى الأمم المتحدة والمؤسسات الوطنية، بخبرة تزيد على عشرين عامًا في الإعلام والتعليق الصوتي والتدريب المهني. تحمل درجة البكالوريوس في اللغة الإنجليزية وعلم الأصوات (Phonetics)، ودرجة الماجستير في حقوق الإنسان والتنمية البشرية. خبرتها تشمل الدبلجة، الأخبار، الأفلام الوثائقية، الكتب الصوتية، والتعليق الصوتي الإعلاني.',
  },
  {
    initials: 'ر.ع',
    name:  'رنا العزام',
    role:  'إعلامية ومدربة أداء ومختصة بالتحرير اللغوي',
    badges: [
      { icon: Tv,            label: 'قنوات فضائية وإذاعات'            },
      { icon: Award,         label: 'جوائز إعلامية'                   },
      { icon: GraduationCap, label: 'بكالوريوس لغة عربية — اليرموك'   },
    ],
    bio: 'الإعلامية رنا محمد العزام معدة ومقدمة برامج فضائية وإذاعية وبودكاست معتمدة. تنقلت بين كبرى المؤسسات الإعلامية مثل قناة رؤيا الفضائية وقناة صاد وإذاعة حياة FM. عملت لسنوات محررة ومدققة لغوية في مجمع اللغة العربية ومذيعة في إذاعة المجمع. قدّمت برامج تدريبية متخصصة لطلبة الإعلام في جامعة البتراء ولمؤسسات حكومية كبرى، وحازت لأفضل إنتاج إعلاني حول المرأة العربية.',
  },
  {
    initials: 'ع.د',
    name:  'عمر الدرابكة',
    role:  'معلق صوتي محترف ومدرب أداء وإلقاء',
    badges: [
      { icon: Mic,           label: 'مئات الأعمال المسجلة'           },
      { icon: Clock,         label: 'خبرة 12+ سنة'                   },
      { icon: GraduationCap, label: 'دبلوم إعلام — فلوريدا'          },
    ],
    bio: 'معلق صوتي محترف ومدرب أداء وإلقاء. سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا. ويمتلك خبرة واسعة في التدريب الصوتي والتمكين اللغوي تتجاوز 12 عامًا.',
  },
];

function InstructorCard({ ins }: { ins: Instructor }) {
  const IconBadge = ({ icon: Icon, label }: Badge) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 8, padding: '5px 11px',
      fontFamily: F, fontSize: 12.5, fontWeight: 600,
      color: 'rgba(252,251,251,0.72)',
      whiteSpace: 'nowrap' as const,
    }}>
      <Icon size={13} color={GOLD} strokeWidth={2} style={{ flexShrink: 0 }} />
      {label}
    </div>
  );

  return (
    <div style={{
      borderRadius: 18,
      overflow: 'hidden',
      background: CARD_BG,
      border: `1px solid ${CARD_BORDER}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.38)',
      direction: 'rtl',
    }}>
      {/* ── Header ── */}
      <div style={{
        background: HEADER_BG,
        padding: '22px 24px 20px',
      }}>
        {/* name + role + avatar row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          {/* name + role (right side, RTL = natural start) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,26px)',
              color: 'rgba(252,251,251,0.97)', lineHeight: 1.2, marginBottom: 6,
            }}>
              {ins.name}
            </div>
            <div style={{
              fontFamily: F, fontWeight: 700, fontSize: 14,
              color: GOLD, lineHeight: 1.4,
            }}>
              {ins.role}
            </div>
          </div>

          {/* Initials avatar */}
          <div style={{
            width: 66, height: 66, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${GOLD} 0%, #e6a800 100%)`,
            border: `3px solid rgba(255,193,7,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255,193,7,0.25)',
          }}>
            <span style={{
              fontFamily: FP, fontWeight: 800, fontSize: 18,
              color: '#0d1125', letterSpacing: '0.04em',
            }}>
              {ins.initials}
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {ins.badges.map(b => <IconBadge key={b.label} {...b} />)}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* ── Bio ── */}
      <div style={{ background: BIO_BG, padding: '20px 24px' }}>
        <p style={{
          fontFamily: F, fontWeight: 400,
          fontSize: 'clamp(13.5px,1.4vw,15px)',
          color: 'rgba(252,251,251,0.68)',
          lineHeight: 1.95, margin: 0,
          textAlign: 'right',
        }}>
          {ins.bio}
        </p>
      </div>
    </div>
  );
}

export default function InstructorsSection() {
  return (
    <section className="section-block relative overflow-hidden" dir="rtl">
      {/* subtle ambient glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -60, right: '10%',
        width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,193,7,0.05) 0%, transparent 68%)',
        filter: 'blur(70px)',
      }} />

      <div className="relative mx-auto px-4" style={{ maxWidth: 860, zIndex: 1 }}>
        <SectionHeader
          badge="خبراؤنا في التدريس"
          heading={<>وراء كل صوت ناجح <Gold>خبير يُلهمه</Gold></>}
          description="فريق مدربينا جمعهم عقود من الخبرة في الإعلام والتعليق الصوتي والخطابة — جاهزون ليرافقوك في كل خطوة من رحلتك."
          style={{ marginBottom: 48 }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {INSTRUCTORS.map(ins => <InstructorCard key={ins.name} ins={ins} />)}
        </div>
      </div>
    </section>
  );
}
