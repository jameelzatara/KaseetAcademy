import { useState } from 'react';
import { Search, Clock, CheckCircle2, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'wouter';

import coverYasar       from '@assets/voiceover-group-photo_1785690181212.jpg';
import instructorYasar  from '@assets/course_01_instructor_1785428932171.jpeg';
import coverOmar        from '@assets/course-omar-bg_1785692015818.png';
import instructorOmar   from '@assets/trainer-omar_1785692015818.jpg';
import coverSohaib      from '@assets/cover-public-speaking-tedx_1785692401460.jpeg';
import instructorSohaib from '@assets/instructor-sohaib_1785692401461.jpeg';
import coverRana        from '@assets/دورة_اللغة_العربية_1785758462657.png';
import instructorRana   from '@assets/trainer-rana-azzam_1785692178863.JPG';
import coverPresenter   from '@assets/دورة_الاعلام_1785758462657.png';

/* ── Tokens ─────────────────────────────────────────────── */
const NAVY    = '#2C374B';
const GOLD    = '#FFC107';
const CARD_BG = '#313d54';
const OFF     = 'rgba(252,251,251,0.96)';
const F       = "'Tajawal', sans-serif";
const FP      = "'Poppins', sans-serif";
const WA_NUM  = '962771052222';

function waLink(title: string) {
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(`السلام عليكم، أرغب في التسجيل في دورة: ${title}`)}`;
}


/* ── Featured card data ─────────────────────────────────── */
const FEATURED = {
  searchData:  'أساسيات التعليق والأداء الصوتي يسار عبده حضوري عمان المرحلة التأسيسية voice over',
  type:        'حضوري في عمّان (استوديو كاسيت) · ومباشر تفاعلي (Online LIVE)',
  level:       'المرحلة التأسيسية',
  title:       'أساسيات التعليق والأداء الصوتي',
  desc:        'منهج متكامل لبناء أداء صوتي احترافي من الصفر — من ضبط مخارج الحروف والتحكم بالتنفس والطبقات الصوتية، إلى بناء ملفك الصوتي الجاهز لسوق العمل. متوفّرة حضورياً في عمّان ومباشر تفاعلي (Online LIVE).',
  trainers: [
    { photo: instructorYasar, name: 'يسار عبده' },
    { photo: instructorRana,  name: 'رنا العزام' },
    { photo: instructorOmar,  name: 'عمر درابكة' },
  ],
  trainerLine: 'يسار عبده · رنا العزام · عمر درابكة',
  priceA: 'JD 218', labelA: 'حضوري',
  priceB: '$150',   labelB: 'مباشر تفاعلي',
  duration: '16 ساعة (8 لقاءات)',
  cover:   coverYasar,
  imgPos:  'center 25%',
};

/* ── Grid card type ─────────────────────────────────────── */
interface GCard {
  title:      string;
  badge:      string;
  cover:      string;
  imgPos:     string;
  instructor: { name: string; role: string; photo: string };
  price:      string;
  duration:   string;
  searchData: string;
  outcomes:   string[];
  route?:     string;     // when set, CTA links to the detail page
}

const GRID: GCard[] = [
  {
    title:    'التعليق والأداء الصوتي',
    badge:    'عن بُعد — تفاعلية مباشرة',
    cover:    coverOmar,
    imgPos:   'center',
    instructor: { name: 'أ. عمر درابكة', role: 'معلّق صوتي ومدرب أداء', photo: instructorOmar },
    price:    '$150',
    duration: '12 ساعة / 7 وحدات',
    searchData: 'التعليق الصوتي اونلاين عمر درابكة voice over online',
    outcomes: [
      'شهادة معتمدة من تطبيق وجيز وأكاديمية كاسيت.',
      'ملف صوتي احترافي (Voice Demo) جاهز لسوق العمل.',
      'فرصة الانضمام لقاعدة بيانات كاسيت للمواهب الصوتية.',
    ],
    route: '/courses/voiceover-live',
  },
  {
    title:    'الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي',
    badge:    'حضوري في عمّان',
    cover:    coverPresenter,
    imgPos:   'center 42%',
    instructor: { name: 'أ. رنا محمد العزام', role: 'إعلامية ومدربة أداء ومختصة تحرير لغوي', photo: instructorRana },
    price:    '250 د.أ',
    duration: '16 ساعة / 8 جلسات',
    searchData: 'المذيع المحترف الاعلامي رنا العزام تحرير صحفي اعلام رقمي',
    outcomes: [
      'إنتاج تقرير صحفي متكامل بمعايير غرف الأخبار العالمية.',
      'تقديم احترافي أمام الكاميرا مقيّم من المدربة.',
      'شهادة رسمية معتمدة من كاسيت ميديا وتطبيق وجيز.',
    ],
    route: '/courses/presenter',
  },
  {
    title:    'تمكين اللغة العربية وفنون التحرير اللغوي',
    badge:    'عن بُعد — تفاعلية مباشرة',
    cover:    coverRana,
    imgPos:   'center 42%',
    instructor: { name: 'أ. رنا محمد العزام', role: 'إعلامية ومختصة تحرير لغوي', photo: instructorRana },
    price:    '$150',
    duration: '16 ساعة / 8 جلسات',
    searchData: 'تمكين اللغة العربية التحرير اللغوي نحو صرف تدقيق رنا العزام',
    outcomes: [
      'كتابة عربية سليمة خالية من أخطاء النحو والإملاء.',
      'حقيبة مرجعية رقمية للقواعد النحوية والإملائية.',
      'شهادة رسمية معتمدة من تطبيق وجيز وأكاديمية كاسيت.',
    ],
    route: '/courses/arabic-language',
  },
  {
    title:    'فن الخطابة والإلقاء الجماهيري المؤثر',
    badge:    'حضوري وعن بُعد',
    cover:    coverSohaib,
    imgPos:   'center',
    instructor: { name: 'د. صهيب الخوالدة', role: 'خبير خطابة وتواصل قيادي', photo: instructorSohaib },
    price:    'من 180 د.أ',
    duration: '16 ساعة / 8 جلسات',
    searchData: 'فن الخطابة الالقاء الجماهيري صهيب الخوالدة public speaking قيادة',
    outcomes: [
      'خطاب TED x كامل تُقدّمه أمام لجنة التقييم.',
      'تقرير فردي لهويتك الخطابية وخريطة تطوير.',
      'شهادة رسمية معتمدة من تطبيق وجيز وأكاديمية كاسيت.',
    ],
    route: '/courses/public-speaking',
  },
];

/* ── Grid card sub-component ────────────────────────────── */
function GridCard({ card, hidden }: { card: GCard; hidden: boolean }) {
  const [hov, setHov] = useState(false);

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       hidden ? 'none' : 'flex',
        flexDirection: 'column',
        position:      'relative',
        background:    CARD_BG,
        border:        `1px solid ${hov ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
        borderRadius:  18,
        overflow:      'hidden',
        boxShadow:     hov
          ? '0 24px 54px rgba(255,193,7,0.16), 0 0 0 1px rgba(255,193,7,0.45)'
          : '0 12px 30px rgba(0,0,0,0.35)',
        transform:  hov ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'transform 0.35s, box-shadow 0.35s, border 0.35s',
      }}
    >
      {/* ── Image area ── */}
      <div style={{
        position: 'relative', aspectRatio: '4/3',
        overflow: 'hidden', background: '#26303f', flexShrink: 0,
      }}>
        <img
          src={card.cover}
          alt={card.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: card.imgPos, display: 'block',
          }}
        />
        {/* bottom fade */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 40%, rgba(30,38,54,0.55) 100%)',
        }} />
        {/* badge */}
        <span style={{
          position: 'absolute', top: 11, right: 11,
          fontFamily: F, fontWeight: 700, fontSize: 10.5,
          color: '#fff', background: 'rgba(20,26,38,0.70)',
          border: '1px solid rgba(255,193,7,0.40)',
          padding: '5px 11px', borderRadius: 999,
          backdropFilter: 'blur(4px)',
        }}>
          {card.badge}
        </span>
      </div>

      {/* ── Card body ── */}
      <div style={{
        padding: '14px 15px 15px', display: 'flex', flexDirection: 'column',
        gap: 11, flex: 1, textAlign: 'right', direction: 'rtl',
      }}>
        <h4 style={{
          fontFamily: F, fontWeight: 800, fontSize: 15,
          color: OFF, lineHeight: 1.45, margin: 0, minHeight: 44,
        }}>
          {card.title}
        </h4>

        {/* instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src={card.instructor.photo}
            alt={card.instructor.name}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '1.5px solid rgba(255,193,7,0.45)', flexShrink: 0,
            }}
          />
          <div>
            <b style={{ display: 'block', fontFamily: F, fontWeight: 700, fontSize: 12, color: OFF }}>
              {card.instructor.name}
            </b>
            <span style={{ fontFamily: F, fontSize: 10, color: 'rgba(252,251,251,0.55)' }}>
              {card.instructor.role}
            </span>
          </div>
        </div>

        {/* price + duration */}
        <div style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 11,
        }}>
          <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 15, color: GOLD }}>
            {card.price}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: F, fontSize: 12, color: 'rgba(252,251,251,0.60)',
          }}>
            {card.duration}
            <Clock size={14} style={{ flexShrink: 0 }} />
          </span>
        </div>
      </div>

      {/* ── Hover overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(180deg, rgba(30,38,54,0.94), rgba(18,24,36,0.98))',
        backdropFilter: 'blur(3px)',
        opacity:    hov ? 1 : 0,
        visibility: hov ? 'visible' : 'hidden',
        transition: 'opacity 0.35s',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: 15, padding: 20, textAlign: 'right', direction: 'rtl',
      }}>
        <ul style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: 13,
        }}>
          {card.outcomes.map((o, i) => (
            <li key={i} style={{
              display: 'flex', gap: 9,
              fontFamily: F, fontWeight: 500, fontSize: 12.5,
              color: 'rgba(252,251,251,0.92)', lineHeight: 1.6,
            }}>
              <CheckCircle2 size={14} color={GOLD} style={{ flexShrink: 0 }} />
              {o}
            </li>
          ))}
        </ul>
        {card.route ? (
          <Link
            href={card.route}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: GOLD, color: NAVY,
              borderRadius: 10, padding: '12px 0',
              fontFamily: F, fontWeight: 800, fontSize: 13.5,
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(255,193,7,0.30)',
            }}
          >
            عرض التفاصيل والتسجيل <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
          </Link>
        ) : (
          <a
            href={waLink(card.title)}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              background: GOLD, color: NAVY,
              border: 'none', borderRadius: 10, padding: '12px 0',
              fontFamily: F, fontWeight: 800, fontSize: 13.5,
              cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(255,193,7,0.30)',
            }}
          >
            سجل الآن في الدورة <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
          </a>
        )}
      </div>
    </article>
  );
}

/* ── Main section export ─────────────────────────────────── */
export default function CoursesSection() {
  const [query, setQuery] = useState('');
  const [featHov, setFeatHov] = useState(false);
  const q = query.trim().toLowerCase();

  const featHidden  = q !== '' && !FEATURED.searchData.toLowerCase().includes(q);
  const visibleGrid = GRID.filter(c => q === '' || c.searchData.toLowerCase().includes(q));
  const noResults   = featHidden && visibleGrid.length === 0;

  return (
    <section id="courses" className="section-block relative overflow-hidden">
      {/* subtle top glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.08) 0%, transparent 70%)',
      }} />

      {/* ── inner container ── */}
      <div className="relative z-10 mx-auto" style={{
        maxWidth: 1120,
        padding: '0 clamp(16px,4vw,40px)',
      }}>

        {/* ── Header ── */}
        <header style={{ textAlign: 'right', marginBottom: 30, direction: 'rtl' }}>
          <h2 style={{
            fontFamily: F, fontWeight: 900,
            fontSize: 'clamp(28px,4.6vw,50px)',
            color: OFF, lineHeight: 1.25, margin: 0,
          }}>
            دوراتنا <span style={{ color: GOLD }}>المتميّزة</span>
          </h2>
          <p style={{
            fontFamily: F, fontWeight: 500,
            fontSize: 'clamp(14px,1.8vw,18px)',
            color: 'rgba(252,251,251,0.72)',
            marginTop: 14, maxWidth: 660, marginInlineStart: 0, lineHeight: 1.8,
          }}>
            اختر من بين برامجنا الأكثر طلباً — حضوري أو مباشر تفاعلي (Online LIVE)، ومقاعد محدودة.
          </p>

          {/* search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 11, marginTop: 22,
            background: CARD_BG,
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 14, padding: '14px 18px',
            color: 'rgba(255,255,255,0.50)',
          }}>
            <Search size={18} style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="اكتب اسم الدورة أو المدرب أو التخصص..."
              style={{
                flex: 1, background: 'transparent', border: 0, outline: 'none',
                color: OFF, fontFamily: F, fontSize: 15, direction: 'rtl',
              }}
            />
          </div>
        </header>

        {/* ── Featured (hero) card ── */}
        <article
          onMouseEnter={() => setFeatHov(true)}
          onMouseLeave={() => setFeatHov(false)}
          style={{
            display:  featHidden ? 'none' : 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            direction: 'rtl',
            background: CARD_BG,
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 22, overflow: 'hidden',
            boxShadow: featHov
              ? '0 28px 66px rgba(0,0,0,0.50)'
              : '0 20px 50px rgba(0,0,0,0.40)',
            transform: featHov ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 0.35s, box-shadow 0.35s',
            marginBottom: 24,
          }}
          className="course-hero-card"
        >
          {/* ── text column (right in RTL) ── */}
          <div style={{
            padding: 'clamp(22px,3vw,38px)',
            display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'right',
          }}>
            {/* type pill */}
            <span style={{
              alignSelf: 'flex-start',
              fontFamily: F, fontWeight: 700, fontSize: 12.5, color: GOLD,
              background: 'rgba(255,193,7,0.10)',
              border: '1px solid rgba(255,193,7,0.35)',
              borderRadius: 999, padding: '7px 15px',
            }}>
              {FEATURED.type}
            </span>

            {/* level */}
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(252,251,251,0.60)' }}>
              {FEATURED.level}
            </span>

            {/* title */}
            <h3 style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(22px,3vw,34px)',
              color: OFF, lineHeight: 1.3, margin: 0,
            }}>
              {FEATURED.title}
            </h3>

            {/* description */}
            <p style={{
              fontFamily: F, fontWeight: 500,
              fontSize: 'clamp(13.5px,1.5vw,16px)',
              color: 'rgba(252,251,251,0.74)', lineHeight: 1.9, margin: 0,
            }}>
              {FEATURED.desc}
            </p>

            {/* trainer row — overlapping avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                {FEATURED.trainers.map((t, i) => (
                  <img
                    key={i}
                    src={t.photo}
                    alt={t.name}
                    style={{
                      width: 46, height: 46, borderRadius: '50%',
                      objectFit: 'cover', objectPosition: 'center top',
                      border: '2px solid #313d54',
                      boxShadow: '0 3px 10px rgba(0,0,0,0.45)',
                      marginInlineStart: i > 0 ? -14 : 0,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              <div>
                <b style={{ display: 'block', fontFamily: F, fontWeight: 700, fontSize: 15, color: OFF }}>
                  بإشراف نخبة من أفضل المدربين
                </b>
                <span style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(252,251,251,0.60)' }}>
                  {FEATURED.trainerLine}
                </span>
              </div>
            </div>

            {/* footer: meta + CTA */}
            <div style={{
              marginTop: 'auto', paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 14, flexWrap: 'wrap',
            }}>
              {/* meta */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                fontFamily: F, fontSize: 13.5, color: 'rgba(252,251,251,0.80)',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <em style={{ fontStyle: 'normal', fontWeight: 500, fontSize: 12, color: 'rgba(252,251,251,0.55)' }}>
                    {FEATURED.labelA}
                  </em>
                  <b style={{ fontFamily: FP, fontWeight: 800, fontSize: 16, color: GOLD }}>
                    {FEATURED.priceA}
                  </b>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <em style={{ fontStyle: 'normal', fontWeight: 500, fontSize: 12, color: 'rgba(252,251,251,0.55)' }}>
                    {FEATURED.labelB}
                  </em>
                  <b style={{ fontFamily: FP, fontWeight: 800, fontSize: 16, color: GOLD }}>
                    {FEATURED.priceB}
                  </b>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {FEATURED.duration}
                  <Clock size={16} style={{ flexShrink: 0 }} />
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/courses/voiceover"
                style={{
                  background: GOLD, color: NAVY,
                  borderRadius: 11, padding: '12px 30px',
                  fontFamily: F, fontWeight: 800, fontSize: 15,
                  cursor: 'pointer', textDecoration: 'none',
                  boxShadow: '0 8px 22px rgba(255,193,7,0.32)',
                  transition: 'transform 0.2s',
                  display: 'inline-block', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.transform = 'none')}
              >
                سجل الآن <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
              </Link>
            </div>
          </div>

          {/* ── image column (left in RTL) ── */}
          <div style={{ position: 'relative', minHeight: 330 }} className="ch-media-col">
            <img
              src={FEATURED.cover}
              alt={FEATURED.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: FEATURED.imgPos ?? 'center top',
                display: 'block',
              }}
            />
            {/* gradient fade toward text (rightward in RTL) */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to right, rgba(49,61,84,0.05) 0%, rgba(49,61,84,0.88) 94%)',
            }} />
            {/* "الأكثر طلباً" badge */}
            <span style={{
              position: 'absolute', top: 16, left: 16, zIndex: 1,
              fontFamily: F, fontWeight: 800, fontSize: 12,
              color: NAVY, background: GOLD,
              padding: '7px 14px', borderRadius: 999,
              boxShadow: '0 6px 16px rgba(255,193,7,0.40)',
            }}>
              <Star size={11} fill={NAVY} color={NAVY} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: 4 }} /> الأكثر طلباً
            </span>
          </div>
        </article>

        {/* ── 4-column grid ── */}
        <div
          className="courses-grid-4"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}
        >
          {GRID.map((card, i) => (
            <GridCard
              key={i}
              card={card}
              hidden={q !== '' && !card.searchData.toLowerCase().includes(q)}
            />
          ))}

          {/* empty state */}
          {noResults && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center',
              fontFamily: F, fontSize: 16,
              color: 'rgba(252,251,251,0.60)', padding: 30,
            }}>
              لا توجد دورة مطابقة لبحثك.
            </div>
          )}
        </div>
      </div>

      {/* scoped responsive + placeholder colour */}
      <style>{`
        .course-hero-card:hover { cursor: default; }
        @media (max-width: 900px) {
          .course-hero-card { grid-template-columns: 1fr !important; }
          .ch-media-col    { min-height: 220px !important; order: -1; }
          .courses-grid-4  { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          .courses-grid-4 { grid-template-columns: 1fr !important; }
        }
        input[placeholder]::placeholder { color: rgba(255,255,255,0.45); }
      `}</style>
    </section>
  );
}
