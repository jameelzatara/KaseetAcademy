import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsBar from './StatsBar';
import Waveform from './Waveform';
import heroBg from '@assets/hero-bg_1785422080937.jpg';

const rotatingWords = [
  'صوتٍ حكاية',
  'نبرةٍ أثر',
  'حرفٍ رسالة',
  'موهبةٍ فرصة',
  'حلمٍ بداية',
];

export default function HeroSection() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // "استكشف" → stats strip at bottom of hero
  const scrollToFirstSection = () => {
    const section = document.getElementById('stats');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // "تصفح دوراتنا" → courses section
  const scrollToCourses = () => {
    const section = document.getElementById('courses');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="sec sec--hero relative w-full min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: '62% 34%',
        }}
      />
      {/* Dark overlay — uniform slate-navy, full height, no blur */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'rgba(18,26,50,0.62)' }}
      />

      {/* ── Cassette reel geometry (top-right, decorative) ── */}
      <div className="geo" aria-hidden="true">
        <svg viewBox="0 0 560 300" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{position:'absolute',top:0,right:0,width:'46%',height:'auto',maxWidth:520}}>
          <circle cx="420" cy="90" r="180" stroke="rgba(255,193,7,.06)" strokeWidth="1"/>
          <circle cx="420" cy="90" r="116" stroke="rgba(255,193,7,.08)" strokeWidth="1"/>
          <circle cx="420" cy="90" r="40" fill="rgba(255,193,7,.03)" stroke="rgba(255,193,7,.15)" strokeWidth="1.5"/>
          <circle cx="200" cy="70" r="120" stroke="rgba(255,193,7,.05)" strokeWidth="1"/>
          <circle cx="200" cy="70" r="76" stroke="rgba(255,193,7,.07)" strokeWidth="1"/>
          <circle cx="200" cy="70" r="26" fill="rgba(255,193,7,.03)" stroke="rgba(255,193,7,.12)" strokeWidth="1.5"/>
          <path d="M226 70 Q310 80 380 90" stroke="rgba(255,193,7,.06)" strokeWidth="1" strokeDasharray="4 6" fill="none"/>
        </svg>
      </div>

      {/* Waveform at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
        <Waveform />
      </div>

      {/* Main Hero Content */}
      <div
        id="main"
        className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4"
        style={{ paddingTop: 'clamp(120px,18vh,200px)' }}
      >

        {/* Static Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-[clamp(30px,6vw,62px)] font-black leading-[1.2]"
          style={{ textShadow: '0 2px 18px rgba(0,0,0,.55)' }}
        >
          <span className="text-[rgba(252,251,251,0.92)] block">
            اخفض صوت العالم<span style={{ color: '#FFC107' }}>...</span>
          </span>
          <span
            className="block mt-1"
            style={{ color: '#FFC107', textShadow: '0 0 24px rgba(255,193,7,.28)' }}
          >
            وارفع صوت الكاسيت
          </span>
        </motion.h1>

        {/* Rotating Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-2"
          style={{ marginTop: 'clamp(20px,4vh,36px)' }}
        >
          <span
            className="font-normal"
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: 'clamp(16px,1.6vw,20px)',
              color: 'rgba(252,251,251,0.85)',
              letterSpacing: '0.01em',
            }}
          >
            لكل
          </span>
          <div
            className="relative overflow-hidden text-center"
            style={{ height: 'clamp(44px,6vw,68px)', width: 'clamp(200px,30vw,340px)' }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeWordIndex}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-110%', opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center font-black"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: 'clamp(28px,4.5vw,52px)',
                  color: '#FFC107',
                  textShadow: '0 4px 30px rgba(255,193,7,0.35)',
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
          className="text-[rgba(252,251,251,0.80)] font-medium text-lg md:text-xl max-w-[640px] leading-relaxed"
          style={{ marginTop: 'clamp(16px,3vh,28px)' }}
        >
          الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.
        </motion.p>

        {/* ── Two CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ marginTop: 'clamp(24px,4vh,40px)', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a
            href={`${import.meta.env.BASE_URL}voice-test.html`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
              fontSize: 'clamp(14px,1.4vw,16px)',
              background: '#FFC107', color: '#121927',
              padding: '14px 28px', borderRadius: 999,
              textDecoration: 'none',
              boxShadow: '0 6px 24px rgba(255,193,7,0.40)',
              transition: 'transform .2s, box-shadow .2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
              transform: 'translateY(-2px)', boxShadow: '0 10px 32px rgba(255,193,7,.55)',
            })}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
              transform: 'none', boxShadow: '0 6px 24px rgba(255,193,7,.40)',
            })}
          >
            سمّعنا صوتك مجاناً ✦
          </a>
          <button
            onClick={scrollToCourses}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
              fontSize: 'clamp(14px,1.4vw,16px)',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.24)',
              color: 'rgba(252,251,251,0.88)',
              padding: '14px 28px', borderRadius: 999, cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'background .2s, border-color .2s, transform .2s',
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, {
              background: 'rgba(255,255,255,0.13)', borderColor: 'rgba(255,193,7,0.40)',
              transform: 'translateY(-2px)',
            })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, {
              background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.24)',
              transform: 'none',
            })}
          >
            تصفح ماستركلاساتنا ↗
          </button>
        </motion.div>

        {/* Scroll Indicator — equalizer bars → first section */}
        <motion.button
          onClick={scrollToFirstSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="group flex flex-col items-center gap-3 cursor-pointer p-4 hover:opacity-80 transition-opacity"
          style={{ marginTop: 'clamp(20px,5vh,48px)' }}
        >
          <div className="flex items-end justify-center gap-1 h-[20px]">
            {[1, 2, 3, 4, 5].map((i) => {
              const speed = 1 + (i % 3) * 0.3;
              const peak = i % 2 === 0 ? '18px' : '12px';
              return (
                <div
                  key={i}
                  className="w-1 bg-[#FFC107] rounded-full animate-equalizer"
                  style={{
                    '--peak': peak,
                    '--speed': `${speed}s`,
                    animationDelay: `${i * 0.15}s`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
          <span className="text-[10px] tracking-[3px] text-[rgba(252,251,251,0.42)] uppercase font-semibold block">
            استكشف
          </span>
        </motion.button>
      </div>

      {/* Stats Bar at bottom */}
      <div className="relative z-20 w-full px-4 md:px-6 pb-6 mt-auto flex justify-center">
        <StatsBar />
      </div>
    </section>
  );
}
