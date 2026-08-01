import { useState } from 'react';
import { Gold } from './SectionHeader';

import coverYasar       from '@assets/course_01_cover_1785428932170.png';
import instructorYasar  from '@assets/course_01_instructor_1785428932171.jpeg';
import coverOmar        from '@assets/course-omar-bg_1785428945248.png';
import instructorOmar   from '@assets/trainer-omar_1785428945248.jpg';
import coverSohaib      from '@assets/cover-public-speaking-tedx_1785428970689.jpeg';
import instructorSohaib from '@assets/instructor-sohaib_1785428970689.jpeg';
import coverRana        from '@assets/cover-arabic-course_1785428982698.png';
import instructorRana   from '@assets/trainer-rana-azzam_1785428982698.JPG';
import coverPresenter   from '@assets/presenter-bg.png';

const F = 'Tajawal, sans-serif';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  types: string[];
  price: string;
  priceLabel: string;
  duration: string;
  durationLabel: string;
  schedule: string;
  urgency?: string;
  shortDesc: string;
  outcomes: string[];
  instructor: { name: string; title: string; photo: string };
  cover: string;
  imgPos: string;
}

const WA_NUMBER = '962771052222';

function waLink(courseTitle: string) {
  const msg = encodeURIComponent(`السلام عليكم، أرغب في التسجيل في دورة: ${courseTitle}`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

const COURSES: Course[] = [
  {
    id: 1, badge: 'الاكثر طلباً',
    title: 'أساسيات التعليق والأداء الصوتي', subtitle: 'المرحلة التأسيسية',
    types: ['وجاهي', 'مباشر تفاعلي'],
    price: 'JD 218', priceLabel: 'رسوم الدورة',
    duration: '8 لقاءات — 16 ساعة', durationLabel: 'التدريب',
    schedule: 'تبدأ أغسطس 2026 — الاثنين والأربعاء | 6:00 - 8:00 مساءً',
    urgency: '🔥 مقاعد محدودة',
    shortDesc: 'منهج متكامل لبناء أداء صوتي احترافي من الصفر – من ضبط مخارج الحروف والتحكم بالتنفس والطبقات الصوتية، إلى بناء ملفك الصوتي الجاهز لسوق العمل، بإشراف مباشر من المدربة يسار عبده.',
    outcomes: ['إتقان النطق والنبرات الاحترافية', 'تقنيات التنفس والتحكم بالإيقاع', 'التسجيل والإنتاج الصوتي', 'بناء ملف صوتي احترافي'],
    instructor: { name: 'يسار عبده', title: 'مدربة الأداء الصوتي', photo: instructorYasar },
    cover: coverYasar, imgPos: 'center top',
  },
  {
    id: 2, badge: 'تعليق صوتي',
    title: 'التعليق الصوتي أونلاين — بث مباشر تفاعلي', subtitle: 'تعليق صوتي',
    types: ['مباشر تفاعلي'],
    price: '$ 150', priceLabel: 'رسوم الدورة',
    duration: '12 ساعة (8 لقاءات)', durationLabel: 'المدة الزمنية',
    schedule: 'تبدأ أغسطس 2026 | عبر الإنترنت',
    shortDesc: 'معلّق صوتي محترف، سجّل مئات الأفلام الوثائقية والإعلانات لكبرى المؤسسات الإعلامية بالخليج والشرق الأوسط. خبرة +12 سنة.',
    outcomes: ['تعليق الأفلام الوثائقية', 'أداء الإعلانات التجارية', 'دبلجة المحتوى الدرامي', 'بناء الهوية الصوتية الخاصة'],
    instructor: { name: 'عمر الدرابكة', title: 'معلّق صوتي محترف ومدرب أداء', photo: instructorOmar },
    cover: coverOmar, imgPos: 'center',
  },
  {
    id: 3, badge: 'خطابة وإلقاء',
    title: 'فن الخطابة والإلقاء الجماهيري المؤثر', subtitle: 'خطابة وإلقاء',
    types: ['مباشر تفاعلي'],
    price: '$ 150', priceLabel: 'رسوم الدورة',
    duration: '12 ساعة (8 لقاءات)', durationLabel: 'المدة الزمنية',
    schedule: 'تبدأ أغسطس 2026 | عبر الإنترنت',
    shortDesc: 'دكتوراه في إدارة الأعمال، خبير تواصل قيادي بخبرة +16 عاماً. اكسر الرهبة وابنِ كاريزما الحضور أمام الجمهور.',
    outcomes: ['التغلب على رهبة المسرح', 'لغة الجسد والكاريزما', 'هيكلة الخطاب المؤثر', 'إدارة التفاعل مع الجمهور'],
    instructor: { name: 'د. صهيب الخوالدة', title: 'خبير تخطيط استراتيجي وتواصل قيادي', photo: instructorSohaib },
    cover: coverSohaib, imgPos: 'center 30%',
  },
  {
    id: 4, badge: 'لغة عربية',
    title: 'تمكين اللغة العربية وفنون التحرير اللغوي', subtitle: 'لغة عربية',
    types: ['مباشر تفاعلي'],
    price: '$ 150', priceLabel: 'رسوم الدورة',
    duration: '16 ساعة (8 لقاءات)', durationLabel: 'المدة الزمنية',
    schedule: 'تبدأ سبتمبر 2026 | عبر الإنترنت',
    shortDesc: 'إعلامية ومحررة لغوية سابقة لمجمع اللغة العربية. أتقن النحو والتحرير والتدقيق اللغوي للمهنيين والإعلاميين.',
    outcomes: ['قواعد النحو التطبيقي', 'التحرير الصحفي الاحترافي', 'التدقيق اللغوي المتقدم', 'الأسلوب الإعلامي الرصين'],
    instructor: { name: 'رنا محمد العزام', title: 'إعلامية ومختصة في التحرير اللغوي', photo: instructorRana },
    cover: coverRana, imgPos: 'center top',
  },
  {
    id: 5, badge: 'إعلام متقدم',
    title: 'المذيع المحترف والإعلامي الشامل', subtitle: 'إعلام متقدم',
    types: ['مباشر تفاعلي'],
    price: '$ 200', priceLabel: 'رسوم الدورة',
    duration: '24 ساعة (8 أيام)', durationLabel: 'المدة الزمنية',
    schedule: 'تبدأ أغسطس 2026 | وجاهي',
    shortDesc: 'دورة مكثفة تجمع التحرير الصحفي، الإلقاء الاحترافي، إدارة الحوار، والتغطية الميدانية — كل ما يصنع إعلامياً شاملاً.',
    outcomes: ['التحرير والإعداد الإخباري', 'الإلقاء وإدارة الحوار', 'التغطية الميدانية المباشرة', 'الحضور التلفزيوني الاحترافي'],
    instructor: { name: 'رنا محمد العزام', title: 'معدة ومقدمة برامج فضائية وبودكاست', photo: instructorRana },
    cover: coverPresenter, imgPos: 'center top',
  },
];

// ── Shared premium glass card ──────────────────────────────
const glass = {
  background:           'rgba(255,255,255,0.035)',
  backdropFilter:       'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border:               '1px solid rgba(255,255,255,0.06)',
} as const;

// ── Featured Card — horizontal split ──────────────────────
function FeaturedCard({ course }: { course: Course }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass,
        borderRadius: 22,
        overflow: 'hidden',
        direction: 'rtl',
        boxShadow: hov ? '0 20px 45px rgba(0,0,0,0.40)' : '0 10px 30px rgba(0,0,0,0.25)',
        border: hov ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'border 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Badge pill — top right absolute */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 10,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 12px', borderRadius: 8,
        background: '#FFC107', color: '#111827',
        fontFamily: F, fontWeight: 900, fontSize: 12,
        boxShadow: '0 2px 12px rgba(255,193,7,0.45)',
      }}>
        {course.badge}
      </div>

      {/* Horizontal flex: text RIGHT | image LEFT */}
      <div className="featured-card-inner" style={{ display: 'flex', position: 'relative' }}>

        {/* ── Text column (right, flex-1) ── */}
        <div style={{
          flex: 1, padding: '32px 32px 28px',
          display: 'flex', flexDirection: 'column', gap: 16,
          textAlign: 'right',
        }}>

          {/* Price + Duration badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              background: '#FFC107', color: '#111827',
              borderRadius: 10, padding: '8px 14px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 20, lineHeight: 1, direction: 'ltr' }}>
                {course.price}
              </div>
              <div style={{ fontFamily: F, fontSize: 10, opacity: 0.7, marginTop: 2, fontWeight: 700 }}>
                {course.priceLabel}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 10, padding: '8px 14px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: F, fontWeight: 700, color: 'rgba(252,251,251,0.90)', fontSize: 13, lineHeight: 1, textAlign: 'right' }}>
                {course.duration}
              </div>
              <div style={{ fontFamily: F, fontSize: 10, color: 'rgba(252,251,251,0.42)', marginTop: 4, textAlign: 'right' }}>
                {course.durationLabel}
              </div>
            </div>
          </div>

          {/* Subtitle + Title */}
          <div>
            <div style={{ fontFamily: F, fontSize: 13, color: 'rgba(252,251,251,0.45)', fontWeight: 500, marginBottom: 6 }}>
              {course.subtitle}
            </div>
            <h3 style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(20px, 2.2vw, 30px)',
              color: 'rgba(252,251,251,0.98)', lineHeight: 1.25,
              margin: 0,
            }}>
              {course.title}
            </h3>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: F, fontWeight: 400,
            fontSize: 15, color: 'rgba(252,251,251,0.62)',
            lineHeight: 1.9, margin: 0,
            display: '-webkit-box' as const,
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {course.shortDesc}
          </p>

          {/* Schedule + urgency bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            padding: '10px 14px', borderRadius: 12,
            background: 'rgba(14,20,36,0.60)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {course.urgency && (
              <span style={{
                background: '#ef4444', color: '#fff',
                fontFamily: F, fontWeight: 800, fontSize: 11,
                padding: '2px 8px', borderRadius: 6, flexShrink: 0,
              }}>
                {course.urgency}
              </span>
            )}
            <span style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(226,232,240,0.65)', flex: 1, textAlign: 'right' }}>
              {course.schedule}
            </span>
            <span style={{ fontSize: 14, flexShrink: 0 }}>📅</span>
          </div>

          {/* Instructor row + CTA */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={course.instructor.photo} alt={course.instructor.name} style={{
                width: 40, height: 40, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'center top',
                border: '2px solid #FFC107', boxShadow: '0 0 10px rgba(255,193,7,0.28)',
                flexShrink: 0,
              }} />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,0.92)' }}>
                  {course.instructor.name}
                </div>
                <div style={{ fontFamily: F, fontSize: 11, color: 'rgba(252,251,251,0.44)' }}>
                  {course.instructor.title}
                </div>
              </div>
            </div>

            <a
              href={waLink(course.title)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: 46, padding: '0 28px', borderRadius: 999,
                fontFamily: F, fontWeight: 700, fontSize: 15,
                background: '#FFC107', color: '#111827',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(255,193,7,0.35)',
                transition: 'transform 250ms, box-shadow 250ms',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(255,193,7,0.50)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 4px 18px rgba(255,193,7,0.35)' })}
            >
              سجّل الآن
              <span style={{ direction: 'ltr' }}>←</span>
            </a>
          </div>
        </div>

        {/* ── Image column (left, lg:w-5/12) ── */}
        <div className="featured-card-img" style={{ position: 'relative', minHeight: 280 }}>
          <img src={course.cover} alt={course.title} style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: course.imgPos,
            display: 'block',
            transform: hov ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.55s ease',
          }} />
          {/* Gradient fade toward the text side (right in RTL = inline-end, visually left of image) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to left, transparent 60%, rgba(20,28,46,0.70) 100%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Bottom Grid Card ───────────────────────────────────────
function GridCard({ course }: { course: Course }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass,
        background: hov ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.035)',
        border: hov ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
        cursor: 'pointer',
        boxShadow: hov ? '0 20px 45px rgba(0,0,0,0.40)' : '0 10px 30px rgba(0,0,0,0.25)',
        transform: hov ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.28s ease',
      }}
    >
      {/* Cover image with title overlaid */}
      <div style={{ position: 'relative', height: 192, overflow: 'hidden', flexShrink: 0 }}>
        {/* Badge */}
        <span style={{
          position: 'absolute', top: 10, right: 10, zIndex: 10,
          background: '#FFC107', color: '#111827',
          fontFamily: F, fontWeight: 700, fontSize: 10,
          padding: '3px 8px', borderRadius: 6,
          boxShadow: '0 2px 8px rgba(255,193,7,0.40)',
        }}>
          • {course.badge}
        </span>

        <img src={course.cover} alt={course.title} style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: course.imgPos,
          display: 'block',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }} />

        {/* Gradient overlay for title readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(14,20,36,0.95) 0%, rgba(14,20,36,0.60) 55%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Title overlaid at bottom */}
        <h3 style={{
          position: 'absolute', bottom: 10, right: 10, left: 10,
          fontFamily: F, fontWeight: 700,
          fontSize: 13, color: '#fff',
          lineHeight: 1.4, margin: 0,
          display: '-webkit-box' as const,
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          textAlign: 'right',
        }}>
          {course.title}
        </h3>

        {/* Hover CTA overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(14,20,36,0.45)',
          opacity: hov ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: hov ? 'auto' : 'none',
        }}>
          <a
            href={waLink(course.title)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              height: 40, padding: '0 22px', borderRadius: 999,
              fontFamily: F, fontWeight: 700, fontSize: 13,
              background: '#FFC107', color: '#111827',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(255,193,7,0.45)',
              whiteSpace: 'nowrap',
              transform: hov ? 'translateY(0)' : 'translateY(6px)',
              transition: 'transform 0.25s ease',
            }}
          >
            سجّل الآن
            <span style={{ direction: 'ltr' }}>←</span>
          </a>
        </div>
      </div>

      {/* Instructor strip */}
      <div style={{
        padding: '10px 12px',
        background: 'rgba(14,20,36,0.55)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <img src={course.instructor.photo} alt={course.instructor.name} style={{
          width: 32, height: 32, borderRadius: '50%',
          objectFit: 'cover', objectPosition: 'center top',
          border: '1.5px solid #FFC107', flexShrink: 0,
        }} />
        <div style={{ textAlign: 'right', minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: '#fff', lineHeight: 1.3 }}>
            {course.instructor.name}
          </div>
          <div style={{
            fontFamily: F, fontSize: 10, color: 'rgba(148,163,184,0.75)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {course.instructor.title}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────
export default function CoursesSection() {
  const featured  = COURSES[0];
  const gridCards = COURSES.slice(1);   // 4 cards in bottom grid

  return (
    <section id="courses" className="section-block relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.10) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1200 }}>

        {/* ── Section header row: title right | search + button left ── */}
        <div className="courses-header-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          marginBottom: 48,
          direction: 'rtl',
        }}>
          {/* Right: badge + heading + subtitle */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              marginBottom: 12,
              padding: '5px 16px', borderRadius: 999,
              background: 'rgba(255,193,7,0.09)', border: '1px solid rgba(255,193,7,0.25)',
              fontFamily: F, fontWeight: 700, fontSize: 12.5, color: '#FFC107',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.70)', flexShrink: 0,
              }} />
              البرامج الأكاديمية
            </div>
            <h2 style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(26px, 3.5vw, 44px)',
              color: 'rgba(252,251,251,0.96)', lineHeight: 1.15, margin: 0,
            }}>
              دوراتنا <Gold>المتميزة</Gold>
            </h2>
            <p style={{
              fontFamily: F, fontWeight: 400,
              fontSize: 15, color: 'rgba(252,251,251,0.58)',
              lineHeight: 1.7, margin: '10px 0 0',
            }}>
              اختر من بين برامجنا الأكثر طلباً — وجاهي أو أونلاين تفاعلي، ومقاعد محدودة.
            </p>
          </div>

          {/* Left: search + browse button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <input
              type="text"
              placeholder="اكتب اسم الدورة أو المدرب ..."
              style={{
                width: 240, height: 44,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                padding: '0 14px',
                fontFamily: F, fontSize: 13, color: 'rgba(252,251,251,0.85)',
                outline: 'none',
                direction: 'rtl',
                transition: 'border-color 200ms',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,0.45)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <a
              href="#courses"
              style={{
                height: 44, padding: '0 20px', borderRadius: 12,
                fontFamily: F, fontWeight: 700, fontSize: 14,
                color: 'rgba(252,251,251,0.70)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.16)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'color 250ms, border-color 250ms, background 250ms',
                display: 'inline-flex', alignItems: 'center',
                textDecoration: 'none',
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.40)', background: 'rgba(255,255,255,0.04)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.70)', borderColor: 'rgba(255,255,255,0.16)', background: 'transparent' })}
            >
              تصفح كل الدورات ←
            </a>
          </div>
        </div>

        {/* ── Featured card (horizontal split) ── */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <FeaturedCard course={featured} />
        </div>

        {/* ── 4-column bottom grid ── */}
        <div className="courses-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}>
          {gridCards.map(c => <GridCard key={c.id} course={c} />)}
        </div>
      </div>

      <style>{`
        /* Featured card: horizontal by default, stack on small screens */
        .featured-card-inner { flex-direction: row; }
        .featured-card-img   { width: 41.666%; flex-shrink: 0; }

        @media (max-width: 900px) {
          .featured-card-inner { flex-direction: column-reverse !important; }
          .featured-card-img   { width: 100% !important; height: 240px !important; }
          .courses-grid        { grid-template-columns: repeat(2, 1fr) !important; }
          .courses-header-row  { flex-direction: column !important; align-items: flex-start !important; }
        }
        @media (max-width: 540px) {
          .courses-grid { grid-template-columns: 1fr !important; }
        }

        /* Input placeholder color */
        input::placeholder { color: rgba(148,163,184,0.55); }
      `}</style>
    </section>
  );
}
