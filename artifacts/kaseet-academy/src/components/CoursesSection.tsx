import { useState } from 'react';

// ── Course images ──────────────────────────────────────────
import coverYasar      from '@assets/course_01_cover_1785428932170.png';
import instructorYasar from '@assets/course_01_instructor_1785428932171.jpeg';
import coverOmar       from '@assets/course-omar-bg_1785428945248.png';
import instructorOmar  from '@assets/trainer-omar_1785428945248.jpg';
import coverSohaib     from '@assets/cover-public-speaking-tedx_1785428970689.jpeg';
import instructorSohaib from '@assets/instructor-sohaib_1785428970689.jpeg';
import coverRana       from '@assets/cover-arabic-course_1785428982698.png';
import instructorRana  from '@assets/trainer-rana-azzam_1785428982698.JPG';

// ── Course data ────────────────────────────────────────────
interface Course {
  id: number;
  title: string;
  level: string;
  types: string[];          // badge labels
  price: string;
  startDate: string;
  sessions: string;
  hours: string;
  shortDesc: string;
  instructor: { name: string; title: string; photo: string };
  cover: string;
}

const COURSES: Course[] = [
  {
    id: 1,
    title: 'أساسيات التعليق والأداء الصوتي',
    level: 'المرحلة الأساسية',
    types: ['وجاهي', 'مباشر تفاعلي'],
    price: '218 JD',
    startDate: 'أغسطس 2026',
    sessions: '16 لقاءً',
    hours: '+50 ساعة',
    shortDesc: 'برنامج تأسيسي شامل يأخذك من الصفر إلى الاحتراف في التعليق الصوتي — مع مدربة معتمدة دولياً بخبرة تجاوز عشرين عاماً في الإعلام والتعليق والدبلجة.',
    instructor: { name: 'يسار عبده', title: 'خبيرة تعليق صوتي معتمدة لدى الأمم المتحدة', photo: instructorYasar },
    cover: coverYasar,
  },
  {
    id: 2,
    title: 'التعليق الصوتي أونلاين — بث مباشر تفاعلي',
    level: 'تعليق صوتي',
    types: ['مباشر تفاعلي'],
    price: '150$',
    startDate: 'أغسطس 2026',
    sessions: '8 لقاءات',
    hours: '12 ساعة',
    shortDesc: 'معلّق صوتي محترف، سجّل مئات الأفلام الوثائقية والإعلانات لكبرى المؤسسات الإعلامية بالخليج والشرق الأوسط. خبرة +12 سنة.',
    instructor: { name: 'عمر الدرابكة', title: 'معلّق صوتي محترف ومدرب أداء', photo: instructorOmar },
    cover: coverOmar,
  },
  {
    id: 3,
    title: 'فن الخطابة والإلقاء الجماهيري المؤثر',
    level: 'خطابة وإلقاء',
    types: ['مباشر تفاعلي'],
    price: '150$',
    startDate: 'أغسطس 2026',
    sessions: '8 لقاءات',
    hours: '12 ساعة',
    shortDesc: 'دكتوراه في إدارة الأعمال، خبير تواصل قيادي بخبرة +16 عاماً. اكسر الرهبة وابنِ كاريزما الحضور أمام الجمهور.',
    instructor: { name: 'د. صهيب الخوالدة', title: 'خبير تخطيط استراتيجي وتواصل قيادي', photo: instructorSohaib },
    cover: coverSohaib,
  },
  {
    id: 4,
    title: 'تمكين اللغة العربية وفنون التحرير اللغوي',
    level: 'لغة عربية',
    types: ['مباشر تفاعلي'],
    price: '150$',
    startDate: 'سبتمبر 2026',
    sessions: '8 لقاءات',
    hours: '16 ساعة',
    shortDesc: 'إعلامية ومحررة لغوية سابقة لمجمع اللغة العربية. أتقن النحو والتحرير والتدقيق اللغوي للمهنيين والإعلاميين.',
    instructor: { name: 'رنا محمد العزام', title: 'إعلامية ومختصة في التحرير اللغوي', photo: instructorRana },
    cover: coverRana,
  },
  {
    id: 5,
    title: 'المذيع المحترف والإعلامي الشامل',
    level: 'إعلام متقدم',
    types: ['مباشر تفاعلي'],
    price: '200$',
    startDate: 'أغسطس 2026',
    sessions: '8 أيام',
    hours: '24 ساعة',
    shortDesc: 'دورة مكثفة تجمع التحرير الصحفي، الإلقاء الاحترافي، إدارة الحوار، والتغطية الميدانية — كل ما يصنع إعلامياً شاملاً.',
    instructor: { name: 'رنا محمد العزام', title: 'معدة ومقدمة برامج فضائية وبودكاست', photo: instructorRana },
    cover: instructorRana, // no separate cover — use portrait
  },
];

// ── Shared background style (same as Reels) ───────────────
const sectionBg = {
  backgroundColor: '#1e293b',
  backgroundImage: [
    'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '85px 85px',
} as const;

// ── TypeBadge ─────────────────────────────────────────────
function TypeBadge({ label }: { label: string }) {
  const live = label.includes('مباشر');
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 11px',
        borderRadius: 99,
        fontSize: 11.5,
        fontWeight: 700,
        fontFamily: 'Tajawal, sans-serif',
        background: live ? 'rgba(255,193,7,0.13)' : 'rgba(99,179,237,0.15)',
        border: `1px solid ${live ? 'rgba(255,193,7,0.35)' : 'rgba(99,179,237,0.35)'}`,
        color: live ? '#FFC107' : '#90cdf4',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {live && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#FFC107',
          boxShadow: '0 0 5px rgba(255,193,7,0.7)',
          flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
}

// ── Featured card (Course 1) ───────────────────────────────
function FeaturedCard({ course }: { course: Course }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.45)',
        marginBottom: 'clamp(24px,3vh,36px)',
      }}
    >
      {/* Cover image */}
      <div style={{ flex: '0 0 42%', position: 'relative', minHeight: 320 }}>
        <img
          src={course.cover}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
        {/* gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to left, rgba(30,41,59,0.8) 0%, transparent 60%)',
        }} />
      </div>

      {/* Info */}
      <div style={{
        flex: 1,
        padding: 'clamp(24px,3vw,40px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 14,
        textAlign: 'right',
      }}>
        {/* Badges + price row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, color: '#FFC107', fontSize: 'clamp(24px,2.8vw,34px)', lineHeight: 1, direction: 'ltr' }}>
              {course.price}
            </div>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11, color: 'rgba(252,251,251,0.55)' }}>تسجيل مبكر</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {course.types.map(t => <TypeBadge key={t} label={t} />)}
          </div>
        </div>

        {/* Level */}
        <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 13, color: 'rgba(252,251,251,0.55)', fontWeight: 500 }}>
          {course.level}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
          fontSize: 'clamp(20px,2.4vw,30px)',
          color: 'rgba(252,251,251,0.96)',
          lineHeight: 1.3, margin: 0,
        }}>
          {course.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
          fontSize: 'clamp(13px,1.3vw,15px)',
          color: 'rgba(252,251,251,0.65)',
          lineHeight: 1.75, margin: 0,
        }}>
          {course.shortDesc}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 18, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {[
            { icon: '📅', text: `تنطلق: ${course.startDate}` },
            { icon: '🎙️', text: course.sessions },
            { icon: '⏱️', text: course.hours },
          ].map(({ icon, text }) => (
            <span key={text} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'Tajawal, sans-serif', fontSize: 12.5,
              color: 'rgba(252,251,251,0.60)',
            }}>
              <span style={{ fontSize: 13 }}>{icon}</span>
              {text}
            </span>
          ))}
        </div>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5, color: 'rgba(252,251,251,0.9)' }}>
              {course.instructor.name}
            </div>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11.5, color: 'rgba(252,251,251,0.50)' }}>
              {course.instructor.title}
            </div>
          </div>
          <img
            src={course.instructor.photo}
            alt={course.instructor.name}
            style={{
              width: 44, height: 44, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid #FFC107',
              boxShadow: '0 0 10px rgba(255,193,7,0.3)',
              flexShrink: 0,
            }}
          />
        </div>

        {/* CTA */}
        <button
          style={{
            alignSelf: 'flex-end',
            fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15,
            padding: '12px 28px', borderRadius: 99,
            background: '#FFC107', color: '#111827',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(255,193,7,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', boxShadow: '0 6px 24px rgba(255,193,7,0.5)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 4px 18px rgba(255,193,7,0.35)' })}
        >
          سجّل الآن
          <span style={{ direction: 'ltr' }}>←</span>
        </button>
      </div>
    </div>
  );
}

// ── Small course card ──────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(v => !v)} // touch-friendly toggle
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '4/5',
        background: '#0f172a',
        border: hovered ? '1px solid rgba(255,193,7,0.40)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: hovered ? '0 0 24px rgba(255,193,7,0.15), 0 12px 40px rgba(0,0,0,0.6)' : '0 6px 24px rgba(0,0,0,0.4)',
        transition: 'border 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Cover image */}
      <img
        src={course.cover}
        alt={course.title}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
          transition: 'transform 0.5s ease, filter 0.4s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1.0)',
          filter: hovered ? 'brightness(0.28) blur(1px)' : 'brightness(0.55)',
        }}
      />

      {/* Always-on gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(30,41,59,0.98) 0%, rgba(30,41,59,0.80) 100%)'
          : 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.25) 60%, transparent 100%)',
        transition: 'background 0.4s',
      }} />

      {/* Badge — top-right (RTL: visual right) */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end',
      }}>
        {course.types.map(t => <TypeBadge key={t} label={t} />)}
      </div>

      {/* DEFAULT state — bottom info strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 16px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
        textAlign: 'right',
        opacity: hovered ? 0 : 1,
        transform: hovered ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.25s, transform 0.25s',
        pointerEvents: hovered ? 'none' : 'auto',
      }}>
        {/* Course title */}
        <div style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
          fontSize: 'clamp(13px,1.3vw,15px)',
          color: 'rgba(252,251,251,0.96)',
          lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.title}
        </div>

        {/* Instructor row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: 'rgba(252,251,251,0.58)' }}>
            {course.instructor.name}
          </span>
          <img src={course.instructor.photo} alt={course.instructor.name}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #FFC107', flexShrink: 0 }} />
        </div>

        {/* Price + date strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.10)',
          paddingTop: 8, marginTop: 2,
        }}>
          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11.5, color: 'rgba(252,251,251,0.48)', direction: 'ltr' }}>
            {course.startDate}
          </span>
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700,
            fontSize: 14, color: '#FFC107', direction: 'ltr',
          }}>
            {course.price}
          </span>
        </div>

        {/* CTA hint */}
        <div style={{
          fontFamily: 'Tajawal, sans-serif', fontSize: 11.5,
          color: 'rgba(252,251,251,0.38)',
          textAlign: 'center', letterSpacing: '0.02em',
        }}>
          التفاصيل ←
        </div>
      </div>

      {/* HOVER state — full details */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '20px 16px 18px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 10,
        textAlign: 'right',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.30s 0.05s, transform 0.30s 0.05s',
        pointerEvents: hovered ? 'auto' : 'none',
      }}>
        <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11, color: 'rgba(252,251,251,0.50)', fontWeight: 500 }}>
          {course.level}
        </div>
        <div style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
          fontSize: 'clamp(14px,1.4vw,16px)', color: 'rgba(252,251,251,0.97)',
          lineHeight: 1.35,
        }}>
          {course.title}
        </div>
        <p style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
          fontSize: 12.5, color: 'rgba(252,251,251,0.65)',
          lineHeight: 1.7, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.shortDesc}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {[
            { val: course.price,     lbl: 'السعر' },
            { val: course.startDate, lbl: 'البداية' },
            { val: course.sessions,  lbl: 'الجلسات' },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, color: '#FFC107', direction: 'ltr' }}>{val}</div>
              <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 10.5, color: 'rgba(252,251,251,0.45)' }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Instructor row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: 'rgba(252,251,251,0.75)', fontWeight: 600 }}>
            {course.instructor.name}
          </span>
          <img src={course.instructor.photo} alt={course.instructor.name}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #FFC107', flexShrink: 0 }} />
        </div>

        {/* CTA button */}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
            padding: '10px 0', borderRadius: 10,
            background: '#FFC107', color: '#111827',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { opacity: '0.9', transform: 'translateY(-1px)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { opacity: '1', transform: 'none' })}
        >
          اكتشف الدورة
          <span style={{ direction: 'ltr' }}>←</span>
        </button>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────
export default function CoursesSection() {
  const [featured] = COURSES.slice(0, 1);
  const grid = COURSES.slice(1);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        ...sectionBg,
        padding: 'clamp(60px,8vh,100px) 0 clamp(70px,9vh,110px)',
      }}
    >
      {/* Top golden glow */}
      <div className="absolute inset-x-0 top-0 pointer-events-none" style={{
        height: 1,
        boxShadow: '0 0 80px 40px rgba(255,193,7,0.08)',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.12) 0%, transparent 70%)',
      }} />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>

        {/* ── Section header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(28px,3.5vh,44px)', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              marginBottom: 12,
              padding: '4px 14px', borderRadius: 99,
              background: 'rgba(255,193,7,0.09)',
              border: '1px solid rgba(255,193,7,0.25)',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 12.5,
              color: '#FFC107',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.7)', flexShrink: 0 }} />
              البرامج الأكاديمية
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(26px,4vw,46px)',
              color: 'rgba(252,251,251,0.96)',
              lineHeight: 1.2, margin: 0,
            }}>
              كل صوت يستحق{' '}
              <span style={{ color: '#FFC107' }}>مساراً احترافياً</span>
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(13px,1.4vw,16px)',
              color: '#E2E8F0',
              lineHeight: 1.8, margin: '10px 0 0',
              maxWidth: 560,
            }}>
              اختر من بين برامجنا الأكثر طلباً — كل مسار صُمِّم ليأخذك خطوة أبعد في عالم الإعلام والصوت والخطابة.
            </p>
          </div>

          {/* See all link */}
          <button style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
            color: 'rgba(252,251,251,0.55)',
            background: 'none', border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 99, padding: '8px 20px', cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.4)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.55)', borderColor: 'rgba(255,255,255,0.14)' })}
          >
            استعرض كل الدورات ←
          </button>
        </div>

        {/* ── Featured card ── */}
        <FeaturedCard course={featured} />

        {/* ── 4-card grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'clamp(12px,2vw,20px)',
        }}>
          {grid.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
