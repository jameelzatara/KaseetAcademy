import { useState } from 'react';
import SectionHeader, { Gold } from './SectionHeader';

import coverYasar       from '@assets/course_01_cover_1785428932170.png';
import instructorYasar  from '@assets/course_01_instructor_1785428932171.jpeg';
import coverOmar        from '@assets/course-omar-bg_1785428945248.png';
import instructorOmar   from '@assets/trainer-omar_1785428945248.jpg';
import coverSohaib      from '@assets/cover-public-speaking-tedx_1785428970689.jpeg';
import instructorSohaib from '@assets/instructor-sohaib_1785428970689.jpeg';
import coverRana        from '@assets/cover-arabic-course_1785428982698.png';
import instructorRana   from '@assets/trainer-rana-azzam_1785428982698.JPG';
import coverPresenter   from '@assets/presenter-bg.png';

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
  shortDesc: string;
  outcomes: string[];
  instructor: { name: string; title: string; photo: string };
  cover: string;
  imgPos: string;
}

const COURSES: Course[] = [
  {
    id: 1, badge: 'الاكثر طلباً',
    title: 'أساسيات التعليق والأداء الصوتي', subtitle: 'المرحلة التأسيسية',
    types: ['وجاهي', 'مباشر تفاعلي'],
    price: 'JD 218', priceLabel: 'التسجيل للدورة',
    duration: '16 ساعة (8 لقاءات)', durationLabel: 'المدة الزمنية',
    schedule: 'الشعبة المسائية | تبدأ أغسطس 2026 — الاثنين والأربعاء | 6:00 - 8:00 مساءً | 12 مقعداً فقط',
    shortDesc: 'منهج متكامل لبناء أداء صوتي احترافي من الصفر – من ضبط مخارج الحروف والتحكم بالتنفس والطبقات الصوتية، إلى بناء ملفك الصوتي الجاهز لسوق العمل، بإشراف مباشر من المدربة يسار عبده.',
    outcomes: ['إتقان النطق والنبرات الاحترافية', 'تقنيات التنفس والتحكم بالإيقاع', 'التسجيل والإنتاج الصوتي', 'بناء ملف صوتي احترافي'],
    instructor: { name: 'يسار عبده', title: 'مدربة الأداء الصوتي', photo: instructorYasar },
    cover: coverYasar, imgPos: 'center top',
  },
  {
    id: 2, badge: 'تعليق صوتي',
    title: 'التعليق الصوتي أونلاين — بث مباشر تفاعلي', subtitle: 'تعليق صوتي',
    types: ['مباشر تفاعلي'],
    price: '$ 150', priceLabel: 'التسجيل للدورة',
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
    price: '$ 150', priceLabel: 'التسجيل للدورة',
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
    price: '$ 150', priceLabel: 'التسجيل للدورة',
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
    price: '$ 200', priceLabel: 'التسجيل للدورة',
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

// ── Type badge ─────────────────────────────────────────────
function TypeBadge({ label }: { label: string }) {
  const live = label.includes('مباشر');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 12px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 700,
      fontFamily: 'Cairo, sans-serif',
      background: live ? 'rgba(255,193,7,0.12)' : 'rgba(99,179,237,0.14)',
      border: `1px solid ${live ? 'rgba(255,193,7,0.32)' : 'rgba(99,179,237,0.32)'}`,
      color: live ? '#FFC107' : '#90cdf4',
    }}>
      {live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 5px rgba(255,193,7,0.7)', flexShrink: 0 }} />}
      {label}
    </span>
  );
}

// ── Featured Card (2fr column) ─────────────────────────────
function FeaturedCard({ course }: { course: Course }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass,
        borderRadius:  22,
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        direction:     'rtl',
        height:        '100%',
        boxShadow:     hov ? '0 20px 45px rgba(0,0,0,0.40)' : '0 10px 30px rgba(0,0,0,0.25)',
        border:        hov ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
        transition:    'border 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Cover image — top, 16/9 */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
        <img src={course.cover} alt={course.title} style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: course.imgPos,
          display: 'block',
          transform: hov ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.55s ease',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(10,16,30,0.92) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Badge + types floating over image */}
        <div style={{
          position: 'absolute', inset: '14px 14px auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {course.types.map(t => <TypeBadge key={t} label={t} />)}
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(255,193,7,0.18)', border: '1px solid rgba(255,193,7,0.45)',
            fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 12, color: '#FFC107',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 5px rgba(255,193,7,0.8)', flexShrink: 0 }} />
            {course.badge}
          </span>
        </div>
        {/* Title over gradient */}
        <div style={{ position: 'absolute', bottom: 18, right: 20, left: 20 }}>
          <h3 style={{
            fontFamily: 'Cairo, sans-serif', fontWeight: 700,
            fontSize: 'clamp(18px, 2vw, 26px)',
            color: 'rgba(252,251,251,0.98)', lineHeight: 1.25,
            margin: 0, letterSpacing: '0.01em',
          }}>
            {course.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '22px 24px 24px', gap: 14, textAlign: 'right',
      }}>
        {/* Description — 16px / 1.9lh / max 3 lines */}
        <p style={{
          fontFamily: 'Cairo, sans-serif', fontWeight: 400,
          fontSize: 16, color: 'rgba(252,251,251,0.65)',
          lineHeight: 1.9, margin: 0,
          display: '-webkit-box' as const,
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          flexGrow: 1,
        }}>
          {course.shortDesc}
        </p>

        {/* Meta strip */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}>
          <div style={{
            background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.20)',
            borderRadius: 12, padding: '8px 14px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: '#FFC107', fontSize: 22, lineHeight: 1, direction: 'ltr' }}>
              {course.price}
            </div>
            <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11, color: 'rgba(252,251,251,0.42)', marginTop: 3, textAlign: 'right' }}>
              {course.priceLabel}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 12, padding: '8px 14px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: 'rgba(252,251,251,0.88)', fontSize: 14, lineHeight: 1, textAlign: 'right' }}>
              {course.duration}
            </div>
            <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11, color: 'rgba(252,251,251,0.42)', marginTop: 3, textAlign: 'right' }}>
              {course.durationLabel}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12.5, color: 'rgba(226,232,240,0.65)', lineHeight: 1.5, flex: 1, textAlign: 'right' }}>
            {course.schedule}
          </span>
          <span style={{ fontSize: 14, flexShrink: 0 }}>📅</span>
        </div>

        {/* Instructor + CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,0.90)' }}>
                {course.instructor.name}
              </div>
              <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12, color: 'rgba(252,251,251,0.45)' }}>
                {course.instructor.title}
              </div>
            </div>
            <img src={course.instructor.photo} alt={course.instructor.name} style={{
              width: 42, height: 42, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '2px solid #FFC107', boxShadow: '0 0 10px rgba(255,193,7,0.28)',
              flexShrink: 0,
            }} />
          </div>

          {/* Primary CTA */}
          <button style={{
            height: 50, padding: '0 28px', borderRadius: 14,
            fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 16,
            background: '#FFC107', color: '#111827',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(255,193,7,0.35)',
            transition: 'transform 250ms, box-shadow 250ms',
            display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(255,193,7,0.50), 0 0 24px rgba(255,193,7,0.25)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 4px 18px rgba(255,193,7,0.35)' })}
          >
            سجّل الآن
            <span style={{ direction: 'ltr' }}>←</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Side / Bottom Card (1fr columns) ───────────────────────
function CourseCard({ course }: { course: Course }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...glass,
        background:    hov ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.035)',
        border:        hov ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius:  22,
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        direction:     'rtl',
        cursor:        'pointer',
        height:        '100%',
        boxShadow:     hov ? '0 20px 45px rgba(0,0,0,0.40)' : '0 10px 30px rgba(0,0,0,0.25)',
        transform:     hov ? 'translateY(-4px)' : 'translateY(0)',
        transition:    'all 0.25s ease',
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
        <img src={course.cover} alt={course.title} style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: course.imgPos,
          display: 'block',
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          background: 'linear-gradient(to bottom, transparent, rgba(14,22,38,0.90))',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: 10, insetInlineStart: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {course.types.map(t => <TypeBadge key={t} label={t} />)}
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '18px 20px 20px', gap: 10, textAlign: 'right',
      }}>
        {/* Card title — 22px / 600 / max 2 lines */}
        <h3 style={{
          fontFamily: 'Cairo, sans-serif', fontWeight: 600,
          fontSize: 22,
          color: 'rgba(252,251,251,0.96)', lineHeight: 1.3,
          margin: 0, letterSpacing: '0.01em',
          display: '-webkit-box' as const,
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {course.title}
        </h3>

        {/* Description — 16px / 1.9lh / max 3 lines */}
        <p style={{
          fontFamily: 'Cairo, sans-serif', fontWeight: 400,
          fontSize: 16, color: 'rgba(252,251,251,0.55)',
          lineHeight: 1.9, margin: 0,
          display: '-webkit-box' as const,
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          flexGrow: 1,
        }}>
          {course.shortDesc}
        </p>

        {/* Bottom strip — instructor + price, pinned to bottom */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)',
          gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: 13, color: 'rgba(252,251,251,0.50)' }}>
              {course.instructor.name}
            </span>
            <img src={course.instructor.photo} alt={course.instructor.name} style={{
              width: 30, height: 30, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '1.5px solid #FFC107', flexShrink: 0,
            }} />
          </div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: '#FFC107', direction: 'ltr' }}>
            {course.price}
          </span>
        </div>

        {/* CTA — appears on hover, always allocated (opacity 0 → 1) */}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', height: 50, borderRadius: 14,
            fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 16,
            background: '#FFC107', color: '#111827',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,193,7,0.30)',
            opacity: hov ? 1 : 0,
            transform: hov ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 250ms, transform 250ms, box-shadow 250ms',
            pointerEvents: hov ? 'auto' : 'none',
          }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { boxShadow: '0 8px 24px rgba(255,193,7,0.45), 0 0 24px rgba(255,193,7,0.25)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: '0 4px 16px rgba(255,193,7,0.30)' })}
        >
          اكتشف الدورة ←
        </button>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────
export default function CoursesSection() {
  const featured  = COURSES[0];
  const sideCards = COURSES.slice(1, 3);    // 2 stacked in 1fr column
  const botCards  = COURSES.slice(3);       // 2 equal-width in bottom row

  return (
    <section className="section-block relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.10) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1200 }}>

        {/* Centered section header */}
        <SectionHeader
          badge="البرامج الأكاديمية"
          heading={<>دوراتنا <Gold>المتميزة</Gold></>}
          description="اختر من بين برامجنا الأكثر طلباً — وجاهي أو أونلاين تفاعلي، ومقاعد محدودة."
          style={{ marginBottom: 48 }}
        />

        {/* ── Top row: 2fr featured | 1fr side column ── */}
        <div className="courses-top-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 24,
          marginBottom: 24,
        }}>
          {/* Featured — 2fr */}
          <FeaturedCard course={featured} />

          {/* Side column — 1fr, 2 stacked cards */}
          <div style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gap: 24,
          }}>
            {sideCards.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>

        {/* ── Bottom row: equal-width, equal-height cards ── */}
        <div className="courses-bot-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: '1fr',
          gap: 24,
        }}>
          {botCards.map(c => <CourseCard key={c.id} course={c} />)}
        </div>

        {/* View all — secondary button, centered below */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <button style={{
            height: 50, padding: '0 32px', borderRadius: 14,
            fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 16,
            color: 'rgba(252,251,251,0.60)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.16)',
            cursor: 'pointer',
            transition: 'color 250ms, border-color 250ms, background 250ms',
          }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.40)', background: 'rgba(255,255,255,0.04)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.60)', borderColor: 'rgba(255,255,255,0.16)', background: 'transparent' })}
          >
            استعرض كل الدورات ←
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .courses-top-grid { grid-template-columns: 1fr !important; }
          .courses-bot-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
