import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Wifi } from 'lucide-react';
import Navbar from './Navbar';
import StatsBar from './StatsBar';
import courseCover from '@assets/course_01_cover_1785428932170.png';
import yasar      from '@assets/course_01_instructor_1785428932171.jpeg';
import rana       from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar       from '@assets/trainer-omar_1785428945248.jpg';

/* ── Tokens ─────────────────────────────────────────────────── */
const NAVY      = '#1D2738';
const GOLD      = '#FFC107';
const OFF_WHITE = '#F5F3EF';
const DARK_TEXT = '#1e293b';
const MID_TEXT  = '#475569';
const FAINT     = '#94a3b8';

const WA_LINK = `https://wa.me/962771052222?text=${encodeURIComponent('السلام عليكم، أرغب في التسجيل في البرنامج الشامل للتعليق والأداء الصوتي')}`;

const rotatingWords = [
  'صوتٍ حكاية',
  'نبرةٍ أثر',
  'حرفٍ رسالة',
  'موهبةٍ فرصة',
  'حلمٍ بداية',
];

const INSTRUCTORS = [
  { img: yasar, name: 'يسار عبده'  },
  { img: rana,  name: 'رنا عزام'   },
  { img: omar,  name: 'عمر درابكة' },
];

/* ── Pricing card ────────────────────────────────────────────── */
function HeroPricingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.45, ease: 'easeOut' }}
      style={{
        width: '100%',
        maxWidth: 310,
        background: NAVY,
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow:
          '0 28px 64px rgba(29,39,56,0.20), 0 8px 20px rgba(0,0,0,0.10)',
        flexShrink: 0,
      }}
    >
      {/* ── Cover image ── */}
      <div style={{ position: 'relative', height: 176, overflow: 'hidden' }}>
        <img
          src={courseCover}
          alt="دورة التعليق والأداء الصوتي"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 20%',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'linear-gradient(to bottom, rgba(29,39,56,0.05) 30%, rgba(29,39,56,0.82) 100%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 12, right: 14, left: 14,
          fontFamily: "'Tajawal', sans-serif",
          fontWeight: 800, fontSize: 13,
          color: '#fff', lineHeight: 1.4,
        }}>
          البرنامج الشامل للتعليق والأداء الصوتي
        </span>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '18px 16px 20px' }}>

        {/* Price rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>

          {/* حضوري */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,193,7,0.10)',
            border: '1px solid rgba(255,193,7,0.28)',
            borderRadius: 10, padding: '9px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} color={GOLD} strokeWidth={2.5} />
              <span style={{
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 700, fontSize: 13,
                color: 'rgba(252,251,251,0.85)',
              }}>
                حضوري
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, direction: 'ltr' }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900, fontSize: 18, color: GOLD,
              }}>
                218
              </span>
              <span style={{
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 600, fontSize: 12,
                color: 'rgba(252,251,251,0.65)',
              }}>
                JOD
              </span>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11.5,
                color: 'rgba(252,251,251,0.28)',
                textDecoration: 'line-through',
              }}>
                260
              </span>
            </div>
          </div>

          {/* أونلاين */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 10, padding: '9px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wifi size={13} color='rgba(252,251,251,0.55)' strokeWidth={2.5} />
              <span style={{
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 700, fontSize: 13,
                color: 'rgba(252,251,251,0.72)',
              }}>
                عن بُعد
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, direction: 'ltr' }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900, fontSize: 18, color: GOLD,
              }}>
                $150
              </span>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11.5,
                color: 'rgba(252,251,251,0.28)',
                textDecoration: 'line-through',
              }}>
                $200
              </span>
            </div>
          </div>
        </div>

        {/* Installment note */}
        <p style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 11.5,
          color: 'rgba(255,193,7,0.72)',
          textAlign: 'center', margin: '0 0 14px',
        }}>
          ✦ بإمكانية التقسيط
        </p>

        {/* Divider */}
        <div style={{
          height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 14px',
        }} />

        {/* Stacked instructors */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16,
        }}>
          {INSTRUCTORS.map(({ img, name }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={img}
                alt={name}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  objectFit: 'cover', objectPosition: 'center top',
                  border: '2px solid rgba(255,193,7,0.42)',
                  flexShrink: 0,
                }}
              />
              <span style={{
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 700, fontSize: 13.5,
                color: 'rgba(252,251,251,0.88)',
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center',
            background: GOLD, color: NAVY,
            fontFamily: "'Tajawal', sans-serif",
            fontWeight: 800, fontSize: 14,
            padding: '11px 0', borderRadius: 10,
            textDecoration: 'none',
            boxShadow: '0 6px 18px rgba(255,193,7,0.28)',
          }}
        >
          سجل الآن ←
        </a>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function HeroSection() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToNextSection = () => {
    const section = document.getElementById('section-2');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: OFF_WHITE }}
    >
      <Navbar />

      {/* ── Main content — two-column ── */}
      <div
        className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 px-5 md:px-10 pt-24 pb-4 lg:pt-20"
        style={{
          maxWidth: 1180,
          width: '100%',
          margin: '0 auto',
          direction: 'rtl',
        }}
      >
        {/* Right / first — headline block */}
        <div className="flex-1 min-w-0 flex flex-col items-start text-start">

          {/* Static headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="text-[clamp(30px,5.5vw,60px)] font-black leading-[1.2]"
          >
            <span style={{ color: DARK_TEXT }} className="block">
              اخفض صوت العالم
              <span style={{ color: GOLD }}>...</span>
            </span>
            <span style={{ color: GOLD }} className="block mt-1">
              وارفع صوت الكاسيت
            </span>
          </motion.h1>

          {/* Rotating word row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="mt-5 md:mt-7 flex items-center gap-3"
          >
            <span
              style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 'clamp(16px,1.6vw,20px)',
                color: MID_TEXT,
                fontWeight: 500,
              }}
            >
              لكل
            </span>
            <div
              className="relative overflow-hidden"
              style={{
                height: 'clamp(40px,5.5vw,62px)',
                width: 'clamp(180px,26vw,320px)',
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeWordIndex}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-110%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center font-black"
                  style={{
                    fontFamily: "'Tajawal', sans-serif",
                    fontSize: 'clamp(26px,4vw,50px)',
                    color: GOLD,
                    textShadow: '0 4px 24px rgba(255,193,7,0.22)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {rotatingWords[activeWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              marginTop: 'clamp(14px,2vw,22px)',
              color: MID_TEXT,
              fontFamily: "'Tajawal', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(15px,1.4vw,18px)',
              maxWidth: 520,
              lineHeight: 1.85,
            }}
          >
            الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.
          </motion.p>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToNextSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex flex-col items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <ChevronDown
              size={26}
              color={GOLD}
              strokeWidth={2.5}
              className="animate-bounce"
            />
            <span style={{
              fontSize: 9,
              letterSpacing: '3px',
              color: FAINT,
              textTransform: 'uppercase',
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
            }}>
              استكشف
            </span>
          </motion.button>
        </div>

        {/* Left / second — floating pricing card */}
        <div className="w-full flex justify-center lg:justify-start lg:w-auto">
          <HeroPricingCard />
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="relative z-20 w-full px-4 md:px-6 pb-6 mt-auto flex justify-center">
        <StatsBar />
      </div>
    </section>
  );
}
