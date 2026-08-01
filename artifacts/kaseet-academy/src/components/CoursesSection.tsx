import { useState } from 'react';

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
}

const COURSES: Course[] = [
  {
    id: 1,
    badge:         'الاكثر طلباً',
    title:         'أساسيات التعليق والأداء الصوتي',
    subtitle:      'المرحلة التأسيسية',
    types:         ['وجاهي', 'مباشر تفاعلي'],
    price:         'JD 218',
    priceLabel:    'التسجيل للدورة',
    duration:      '16 ساعة (8 لقاءات)',
    durationLabel: 'المدة الزمنية',
    schedule:      'الشعبة المسائية | تبدأ أغسطس 2026 — الاثنين والأربعاء | 6:00 - 8:00 مساءً | 12 مقعداً فقط',
    shortDesc:     'منهج متكامل لبناء أداء صوتي احترافي من الصفر – من ضبط مخارج الحروف والتحكم بالتنفس والطبقات الصوتية، إلى بناء ملفك الصوتي الجاهز لسوق العمل، بإشراف مباشر من المدربة يسار عبده.',
    outcomes:      ['إتقان النطق والنبرات الاحترافية', 'تقنيات التنفس والتحكم بالإيقاع', 'التسجيل والإنتاج الصوتي', 'بناء ملف صوتي احترافي'],
    instructor:    { name: 'يسار عبده', title: 'مدربة الأداء الصوتي', photo: instructorYasar },
    cover:         coverYasar,
  },
  {
    id: 2,
    badge:         'تعليق صوتي',
    title:         'التعليق الصوتي أونلاين — بث مباشر تفاعلي',
    subtitle:      'تعليق صوتي',
    types:         ['مباشر تفاعلي'],
    price:         '$ 150',
    priceLabel:    'التسجيل للدورة',
    duration:      '12 ساعة (8 لقاءات)',
    durationLabel: 'المدة الزمنية',
    schedule:      'تبدأ أغسطس 2026 | عبر الإنترنت',
    shortDesc:     'معلّق صوتي محترف، سجّل مئات الأفلام الوثائقية والإعلانات لكبرى المؤسسات الإعلامية بالخليج والشرق الأوسط. خبرة +12 سنة.',
    outcomes:      ['تعليق الأفلام الوثائقية', 'أداء الإعلانات التجارية', 'دبلجة المحتوى الدرامي', 'بناء الهوية الصوتية الخاصة'],
    instructor:    { name: 'عمر الدرابكة', title: 'معلّق صوتي محترف ومدرب أداء', photo: instructorOmar },
    cover:         coverOmar,
  },
  {
    id: 3,
    badge:         'خطابة وإلقاء',
    title:         'فن الخطابة والإلقاء الجماهيري المؤثر',
    subtitle:      'خطابة وإلقاء',
    types:         ['مباشر تفاعلي'],
    price:         '$ 150',
    priceLabel:    'التسجيل للدورة',
    duration:      '12 ساعة (8 لقاءات)',
    durationLabel: 'المدة الزمنية',
    schedule:      'تبدأ أغسطس 2026 | عبر الإنترنت',
    shortDesc:     'دكتوراه في إدارة الأعمال، خبير تواصل قيادي بخبرة +16 عاماً. اكسر الرهبة وابنِ كاريزما الحضور أمام الجمهور.',
    outcomes:      ['التغلب على رهبة المسرح', 'لغة الجسد والكاريزما', 'هيكلة الخطاب المؤثر', 'إدارة التفاعل مع الجمهور'],
    instructor:    { name: 'د. صهيب الخوالدة', title: 'خبير تخطيط استراتيجي وتواصل قيادي', photo: instructorSohaib },
    cover:         coverSohaib,
  },
  {
    id: 4,
    badge:         'لغة عربية',
    title:         'تمكين اللغة العربية وفنون التحرير اللغوي',
    subtitle:      'لغة عربية',
    types:         ['مباشر تفاعلي'],
    price:         '$ 150',
    priceLabel:    'التسجيل للدورة',
    duration:      '16 ساعة (8 لقاءات)',
    durationLabel: 'المدة الزمنية',
    schedule:      'تبدأ سبتمبر 2026 | عبر الإنترنت',
    shortDesc:     'إعلامية ومحررة لغوية سابقة لمجمع اللغة العربية. أتقن النحو والتحرير والتدقيق اللغوي للمهنيين والإعلاميين.',
    outcomes:      ['قواعد النحو التطبيقي', 'التحرير الصحفي الاحترافي', 'التدقيق اللغوي المتقدم', 'الأسلوب الإعلامي الرصين'],
    instructor:    { name: 'رنا محمد العزام', title: 'إعلامية ومختصة في التحرير اللغوي', photo: instructorRana },
    cover:         coverRana,
  },
  {
    id: 5,
    badge:         'إعلام متقدم',
    title:         'المذيع المحترف والإعلامي الشامل',
    subtitle:      'إعلام متقدم',
    types:         ['مباشر تفاعلي'],
    price:         '$ 200',
    priceLabel:    'التسجيل للدورة',
    duration:      '24 ساعة (8 أيام)',
    durationLabel: 'المدة الزمنية',
    schedule:      'تبدأ أغسطس 2026 | وجاهي',
    shortDesc:     'دورة مكثفة تجمع التحرير الصحفي، الإلقاء الاحترافي، إدارة الحوار، والتغطية الميدانية — كل ما يصنع إعلامياً شاملاً.',
    outcomes:      ['التحرير والإعداد الإخباري', 'الإلقاء وإدارة الحوار', 'التغطية الميدانية المباشرة', 'الحضور التلفزيوني الاحترافي'],
    instructor:    { name: 'رنا محمد العزام', title: 'معدة ومقدمة برامج فضائية وبودكاست', photo: instructorRana },
    cover:         coverPresenter,
  },
];

// ── Shared glass card style ────────────────────────────────
const glassCard = {
  background:           'rgba(255,255,255,0.04)',
  backdropFilter:       'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border:               '1px solid rgba(255,255,255,0.09)',
} as const;

// ── Type badge ─────────────────────────────────────────────
function TypeBadge({ label }: { label: string }) {
  const live = label.includes('مباشر');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 11px', borderRadius: 99,
      fontSize: 11.5, fontWeight: 700,
      fontFamily: 'Tajawal, sans-serif',
      background: live ? 'rgba(255,193,7,0.12)' : 'rgba(99,179,237,0.14)',
      border: `1px solid ${live ? 'rgba(255,193,7,0.32)' : 'rgba(99,179,237,0.32)'}`,
      color: live ? '#FFC107' : '#90cdf4',
    }}>
      {live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 5px rgba(255,193,7,0.7)', flexShrink: 0 }} />}
      {label}
    </span>
  );
}

// ── Featured Card (Course 1) ───────────────────────────────
// RTL flex: first child → RIGHT, second child → LEFT
// Info text on RIGHT, cover image on LEFT
function FeaturedCard({ course }: { course: Course }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'row',
      borderRadius:   22,
      overflow:       'hidden',
      ...glassCard,
      boxShadow:      '0 4px 40px rgba(0,0,0,0.45)',
      marginBottom:   'clamp(24px,3vh,36px)',
      direction:      'rtl',
    }}>

      {/* ── 1st child → RIGHT (info/text) ── */}
      <div style={{
        flex:           1,
        padding:        'clamp(24px,3vw,40px)',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        gap:            16,
        textAlign:      'right',
      }}>

        {/* Row 1: category badge (start/right) + type badges (end/left) */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 13px', borderRadius: 99,
            background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.40)',
            fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 12, color: '#FFC107',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.8)', flexShrink: 0 }} />
            {course.badge}
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {course.types.map(t => <TypeBadge key={t} label={t} />)}
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: 'Tajawal, sans-serif', fontSize: 13,
          color: 'rgba(252,251,251,0.50)', fontWeight: 500,
          textAlign: 'right',
        }}>
          {course.subtitle}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
          fontSize: 'clamp(20px,2.4vw,30px)',
          color: 'rgba(252,251,251,0.97)', lineHeight: 1.3, margin: 0,
          textAlign: 'right',
        }}>
          {course.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
          fontSize: 'clamp(13px,1.3vw,15px)',
          color: 'rgba(252,251,251,0.65)', lineHeight: 1.8, margin: 0,
          textAlign: 'right',
        }}>
          {course.shortDesc}
        </p>

        {/* Price + Duration — justify-content:flex-end aligns right in RTL context */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{
            background: 'rgba(255,193,7,0.08)',
            border: '1px solid rgba(255,193,7,0.22)',
            borderRadius: 12, padding: '10px 16px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 900,
              color: '#FFC107', fontSize: 'clamp(20px,2.2vw,26px)',
              lineHeight: 1, direction: 'ltr',
            }}>
              {course.price}
            </div>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11, color: 'rgba(252,251,251,0.48)', marginTop: 4, textAlign: 'right' }}>
              {course.priceLabel}
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12, padding: '10px 16px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
              color: 'rgba(252,251,251,0.90)', fontSize: 'clamp(13px,1.3vw,15px)',
              lineHeight: 1, textAlign: 'right',
            }}>
              {course.duration}
            </div>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11, color: 'rgba(252,251,251,0.48)', marginTop: 4, textAlign: 'right' }}>
              {course.durationLabel}
            </div>
          </div>
        </div>

        {/* Schedule strip — Arabic text first (RIGHT), emoji icon after (LEFT) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Text first in DOM → RIGHT in RTL */}
          <span style={{
            fontFamily: 'Tajawal, sans-serif', fontSize: 12.5,
            color: 'rgba(226,232,240,0.72)', lineHeight: 1.5,
            flex: 1, textAlign: 'right',
          }}>
            {course.schedule}
          </span>
          {/* Icon after text → LEFT in RTL */}
          <span style={{ fontSize: 14, flexShrink: 0 }}>📅</span>
        </div>

        {/* Instructor — text first (RIGHT), avatar after (LEFT) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: 'flex-start',   /* RTL flex-start = RIGHT edge */
        }}>
          {/* Name+title first → RIGHT in RTL */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5, color: 'rgba(252,251,251,0.92)' }}>
              {course.instructor.name}
            </div>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11.5, color: 'rgba(252,251,251,0.48)' }}>
              {course.instructor.title}
            </div>
          </div>
          {/* Photo after text → LEFT in RTL (icon after Arabic text) */}
          <img src={course.instructor.photo} alt={course.instructor.name}
            style={{
              width: 44, height: 44, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid #FFC107',
              boxShadow: '0 0 10px rgba(255,193,7,0.30)',
              flexShrink: 0,
            }} />
        </div>

        {/* CTA button — label first (RIGHT), arrow after (LEFT) */}
        <button style={{
          alignSelf:  'flex-start',   /* RTL flex-start = RIGHT edge */
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15,
          padding:    '13px 32px', borderRadius: 99,
          background: '#FFC107', color: '#111827',
          border:     'none', cursor: 'pointer',
          boxShadow:  '0 4px 18px rgba(255,193,7,0.40)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          display:    'flex', alignItems: 'center', gap: 8,
          direction:  'rtl',
        }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(255,193,7,0.55)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 4px 18px rgba(255,193,7,0.40)' })}
        >
          سجّل الآن
          <span style={{ direction: 'ltr' }}>←</span>
        </button>
      </div>

      {/* ── 2nd child → LEFT (cover image) ── */}
      <div style={{ flex: '0 0 42%', position: 'relative', minHeight: 360 }}>
        <img src={course.cover} alt={course.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
          }} />
        {/* Gradient blends from image edge into text panel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(14,22,40,0.80) 0%, transparent 55%)',
        }} />
      </div>
    </div>
  );
}

// ── Small course card ──────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(v => !v)}
      style={{
        position:      'relative',
        borderRadius:  20,
        overflow:      'hidden',
        cursor:        'pointer',
        display:       'flex',
        flexDirection: 'column',
        direction:     'rtl',
        ...glassCard,
        border: hovered ? '1px solid rgba(255,193,7,0.38)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: hovered ? '0 0 28px rgba(255,193,7,0.14), 0 14px 44px rgba(0,0,0,0.55)' : '0 6px 24px rgba(0,0,0,0.35)',
        transition: 'border 0.3s, box-shadow 0.3s',
        minHeight: 340,
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', flexShrink: 0 }}>
        <img src={course.cover} alt={course.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            background: '#0d1624', display: 'block',
            transition: 'transform 0.5s ease, filter 0.4s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1.0)',
            filter: hovered ? 'brightness(0.18) blur(2px)' : 'brightness(0.88)',
          }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
          background: 'linear-gradient(to bottom, transparent, rgba(14,22,38,0.88))',
          pointerEvents: 'none',
        }} />
        {/* Type badges — top-right in RTL */}
        <div style={{ position: 'absolute', top: 10, insetInlineStart: 10, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {course.types.map(t => <TypeBadge key={t} label={t} />)}
        </div>
      </div>

      {/* Default bottom strip */}
      <div style={{
        padding: '14px 16px 16px',
        display: 'flex', flexDirection: 'column', gap: 8,
        textAlign: 'right', flex: 1,
        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.22s',
        pointerEvents: hovered ? 'none' : 'auto',
      }}>
        <div style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
          fontSize: 'clamp(13px,1.3vw,15px)',
          color: 'rgba(252,251,251,0.96)', lineHeight: 1.4,
          textAlign: 'right',
        }}>
          {course.title}
        </div>

        {/* Instructor row — name first (RIGHT in RTL), photo after (LEFT) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start' }}>
          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: 'rgba(252,251,251,0.55)', textAlign: 'right' }}>
            {course.instructor.name}
          </span>
          <img src={course.instructor.photo} alt={course.instructor.name}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #FFC107', flexShrink: 0 }} />
        </div>

        {/* Price row — price first (RIGHT), schedule text after (LEFT) */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 2,
        }}>
          {/* Price — first child → RIGHT in RTL */}
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14,
            color: '#FFC107', direction: 'ltr',
          }}>
            {course.price}
          </span>
          {/* Schedule info — second → LEFT */}
          <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11.5, color: 'rgba(252,251,251,0.42)', textAlign: 'right' }}>
            {course.schedule.split('|')[0]?.trim()}
          </span>
        </div>
      </div>

      {/* Hover overlay — learning outcomes */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '20px 18px 18px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 10,
        textAlign: 'right', direction: 'rtl',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.28s 0.06s, transform 0.28s 0.06s',
        pointerEvents: hovered ? 'auto' : 'none',
        background: 'linear-gradient(to top, rgba(10,16,30,0.97) 0%, rgba(10,16,30,0.80) 100%)',
      }}>
        <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11.5, color: 'rgba(255,193,7,0.75)', fontWeight: 600, textAlign: 'right' }}>
          {course.subtitle}
        </div>
        <div style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
          fontSize: 'clamp(14px,1.4vw,16px)', color: 'rgba(252,251,251,0.97)', lineHeight: 1.35,
          textAlign: 'right',
        }}>
          {course.title}
        </div>

        {/* Outcomes — icon (✓) first (RIGHT in RTL), text second (LEFT) */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 11, color: '#FFC107', fontWeight: 700, marginBottom: 2, textAlign: 'right' }}>
            ماذا ستتعلم:
          </div>
          {course.outcomes.map((o, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              justifyContent: 'flex-start',  /* flex-start = RIGHT in RTL */
            }}>
              {/* ✓ icon first → RIGHT */}
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFC107', fontSize: 9, flexShrink: 0,
              }}>✓</span>
              {/* Text after → LEFT */}
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12.5, color: 'rgba(226,232,240,0.82)', textAlign: 'right' }}>{o}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA — price first (RIGHT in RTL), button after (LEFT) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          {/* Price first → RIGHT in RTL */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 15, color: '#FFC107', direction: 'ltr' }}>{course.price}</div>
            <div style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 10.5, color: 'rgba(252,251,251,0.40)', textAlign: 'right' }}>{course.priceLabel}</div>
          </div>
          {/* CTA button after → LEFT; label first in button, arrow after */}
          <button
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13,
              padding: '9px 18px', borderRadius: 99,
              background: '#FFC107', color: '#111827',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255,193,7,0.35)',
              transition: 'transform 0.15s', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-1px)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none' })}
          >
            اكتشف الدورة
            <span style={{ direction: 'ltr' }}>←</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────
export default function CoursesSection() {
  const [featured] = COURSES.slice(0, 1);
  const grid = COURSES.slice(1);

  return (
    <section className="section-block relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.11) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'clamp(28px,3.5vh,44px)',
          flexWrap: 'wrap', gap: 12,
          direction: 'rtl',
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 12,
              padding: '4px 14px', borderRadius: 99,
              background: 'rgba(255,193,7,0.09)', border: '1px solid rgba(255,193,7,0.25)',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#FFC107',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.7)', flexShrink: 0 }} />
              البرامج الأكاديمية
            </div>

            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(26px,4vw,46px)',
              color: 'rgba(252,251,251,0.96)', lineHeight: 1.2, margin: 0,
              textAlign: 'right',
            }}>
              دوراتنا <span style={{ color: '#FFC107' }}>المتميزة</span>
            </h2>

            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(13px,1.4vw,16px)',
              color: '#E2E8F0', lineHeight: 1.8, margin: '10px 0 0', maxWidth: 600,
              textAlign: 'right',
            }}>
              اختر من بين برامجنا الأكثر طلباً — وجاهي أو أونلاين تفاعلي، ومقاعد محدودة.
            </p>
          </div>

          <button style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
            color: 'rgba(252,251,251,0.55)',
            background: 'none', border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 99, padding: '8px 20px', cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.4)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.55)', borderColor: 'rgba(255,255,255,0.14)' })}
          >
            استعرض كل الدورات ←
          </button>
        </div>

        {/* Featured card */}
        <FeaturedCard course={featured} />

        {/* 4-card grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 'clamp(14px,2vw,22px)',
          alignItems: 'stretch',
        }}>
          {grid.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>
    </section>
  );
}
