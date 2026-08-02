// ── Instructors Section ─────────────────────────────────────
import { Users, Clock, Globe, Award, Tv, GraduationCap, Mic } from 'lucide-react';

const F   = 'Tajawal, sans-serif';
const FP  = "'Poppins', sans-serif";
const GOLD = '#FFC107';

// ── light palette (matches LBG sections in course page) ──────
const SECTION_BG  = '#F5F4F0';
const CARD_BG     = '#F5F4F0';
const CARD_BORDER = 'rgba(0,0,0,0.08)';
const BIO_BG      = '#ffffff';
const NAME_COLOR  = '#1e293b';
const ROLE_COLOR  = '#92670a';   // dark gold — readable on light bg
const BADGE_TEXT  = '#475569';
const BIO_TEXT    = '#475569';

type IconComponent = typeof Users;

interface Badge {
  icon: IconComponent;
  label: string;
}

export interface Instructor {
  initials: string;
  photo?: string;          // real portrait — optional, falls back to initials
  name: string;
  role: string;
  badges: Badge[];
  bio: string;
}

const DEFAULT_INSTRUCTORS: Instructor[] = [
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
      background: 'rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.10)',
      borderRadius: 8, padding: '5px 11px',
      fontFamily: F, fontSize: 12.5, fontWeight: 600,
      color: BADGE_TEXT,
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
      boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
      direction: 'rtl',
    }}>
      {/* ── Header: photo + name + role + badges ── */}
      <div style={{ padding: '22px 24px 20px' }}>
        {/* name + role + photo row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16, marginBottom: 16,
        }}>
          {/* Photo or initials fallback — first in DOM = rightmost in RTL */}
          {ins.photo ? (
            <img
              src={ins.photo}
              alt={ins.name}
              style={{
                width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                objectFit: 'cover', objectPosition: 'center top',
                border: `3px solid rgba(255,193,7,0.45)`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
              }}
            />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${GOLD} 0%, #e6a800 100%)`,
              border: `3px solid rgba(255,193,7,0.35)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255,193,7,0.22)',
            }}>
              <span style={{
                fontFamily: FP, fontWeight: 800, fontSize: 17,
                color: '#0d1125', letterSpacing: '0.04em',
              }}>
                {ins.initials}
              </span>
            </div>
          )}

          {/* name + role — after photo in DOM = left side in RTL */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(20px,2.2vw,24px)',
              color: NAME_COLOR, lineHeight: 1.2, marginBottom: 5,
            }}>
              {ins.name}
            </div>
            <div style={{
              fontFamily: F, fontWeight: 700, fontSize: 13.5,
              color: ROLE_COLOR, lineHeight: 1.4,
            }}>
              {ins.role}
            </div>
          </div>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {ins.badges.map(b => <IconBadge key={b.label} {...b} />)}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', marginInline: 24 }} />

      {/* ── Bio in white box ── */}
      <div style={{ background: BIO_BG, margin: 16, borderRadius: 12, padding: '16px 20px' }}>
        <p style={{
          fontFamily: F, fontWeight: 400,
          fontSize: 'clamp(13.5px,1.4vw,15px)',
          color: BIO_TEXT,
          lineHeight: 1.95, margin: 0,
          textAlign: 'right',
        }}>
          {ins.bio}
        </p>
      </div>
    </div>
  );
}

interface Props {
  instructors?: Instructor[];
}

export default function InstructorsSection({ instructors = DEFAULT_INSTRUCTORS }: Props) {
  return (
    <section
      dir="rtl"
      style={{
        background: SECTION_BG,
        paddingBlock: 'clamp(48px,5vw,80px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 clamp(16px,4vw,40px)' }}>

        {/* Section title — light style (gold bar + dark text) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 4, height: 30, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
          <h2 style={{
            fontFamily: F, fontWeight: 900,
            fontSize: 'clamp(22px,2.8vw,30px)',
            color: NAME_COLOR, margin: 0, lineHeight: 1.2,
          }}>
            خبراؤنا في التدريس
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {instructors.map(ins => <InstructorCard key={ins.name} ins={ins} />)}
        </div>
      </div>
    </section>
  );
}
