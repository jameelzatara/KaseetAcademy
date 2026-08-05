import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
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

  const scrollToNextSection = () => {
    const section = document.getElementById('section-2');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="sec sec--hero relative w-full min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Background Image & Gradient Overlays */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(44,55,75,0.75) 0%, rgba(36,46,64,0.88) 60%, rgba(33,42,61,0.97) 100%)',
        }}
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

      <Navbar />

      {/* Ambient Waveform behind content at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-0 opacity-80 pointer-events-none">
        <Waveform />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 mt-20 md:mt-0">

        {/* Static Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-[clamp(30px,6vw,62px)] font-black leading-[1.2]"
        >
          <span className="text-[rgba(252,251,251,0.92)] block">
            اخفض صوت العالم<span className="text-[#FFC107]">...</span>
          </span>
          <span className="text-[#FFC107] block mt-1 text-glow-gold">
            وارفع صوت الكاسيت
          </span>
        </motion.h1>

        {/* Rotating Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-5 md:mt-7 flex flex-col items-center justify-center gap-2"
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
                className="absolute inset-0 flex items-center justify-center text-[#FFC107] font-black"
                style={{
                  fontFamily: 'Tajawal, sans-serif',
                  fontSize: 'clamp(28px,4.5vw,52px)',
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
          className="mt-8 text-[rgba(252,251,251,0.80)] font-medium text-lg md:text-xl max-w-[640px] leading-relaxed"
        >
          الأكاديمية الأولى في تدريب التعليق الصوتي، صناعة البودكاست، والإنتاج المرئي.
        </motion.p>

        {/* Scroll Indicator — equalizer bars */}
        <motion.button
          onClick={scrollToNextSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 group flex flex-col items-center gap-3 cursor-pointer p-4 hover:opacity-80 transition-opacity"
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
