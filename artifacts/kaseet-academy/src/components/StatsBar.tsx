import { useEffect, useRef, useState } from 'react';
import wajeezLogo from '@assets/wajeez-logo_1785422080937.png';
import mediaLogos from '@assets/wajeez-media-logos-light.png';
import { STATS } from '../data/stats';

/* ── Smooth counter hook ── */
function useCountUp(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return active ? val : target;
}

const fmt = (n: number) => new Intl.NumberFormat('en').format(n);

export default function StatsBar() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const students = useCountUp(STATS.students, 1800, active);
  const courses  = useCountUp(STATS.courses,  1400, active);
  const hours    = useCountUp(STATS.trainingHours, 2000, active);

  return (
    <div
      id="stats"
      ref={ref}
      className="glass-panel w-full max-w-[950px] rounded-[15px] border border-[rgba(255,193,7,0.32)] shadow-[0_8px_30px_rgba(10,14,22,0.45)] py-4 px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0"
      style={{ opacity: 1, transform: 'none' }}
    >
      {/* Stats */}
      <div className="flex items-center justify-center gap-[clamp(16px,2.6vw,40px)] w-full md:w-auto order-2 md:order-1">

        {/* طالب درّبناهم */}
        <div className="flex flex-col items-center">
          <div className="text-[#FFC107] font-bold text-[clamp(18px,2.2vw,26px)] leading-none mb-1 flex items-center font-poppins" dir="ltr">
            {fmt(students)}<span>+</span>
          </div>
          <div className="text-[rgba(252,251,251,0.72)] text-[12.5px] font-medium relative pb-1 mb-1">
            طالب درّبناهم
            <span className="absolute bottom-0 left-[12.5%] w-[75%] h-[2px] bg-[#FFC107] rounded-full" />
          </div>
        </div>

        <div className="w-[1px] h-10 bg-[rgba(255,255,255,0.1)]" />

        {/* دورة تدريبية */}
        <div className="flex flex-col items-center">
          <div className="text-[#FFC107] font-bold text-[clamp(18px,2.2vw,26px)] leading-none mb-1 flex items-center font-poppins" dir="ltr">
            {fmt(courses)}<span>+</span>
          </div>
          <div className="text-[rgba(252,251,251,0.72)] text-[12.5px] font-medium relative pb-1 mb-1">
            دورة تدريبية
            <span className="absolute bottom-0 left-[12.5%] w-[75%] h-[2px] bg-[#FFC107] rounded-full" />
          </div>
        </div>

        <div className="w-[1px] h-10 bg-[rgba(255,255,255,0.1)]" />

        {/* ساعة تدريب */}
        <div className="flex flex-col items-center">
          <div className="text-[#FFC107] font-bold text-[clamp(18px,2.2vw,26px)] leading-none mb-1 flex items-center font-poppins" dir="ltr">
            {fmt(hours)}<span>+</span>
          </div>
          <div className="text-[rgba(252,251,251,0.72)] text-[12.5px] font-medium relative pb-1 mb-1">
            ساعة تدريب
            <span className="absolute bottom-0 left-[12.5%] w-[75%] h-[2px] bg-[#FFC107] rounded-full" />
          </div>
        </div>

      </div>

      {/* Separator */}
      <div className="hidden md:block w-[1px] h-12 bg-[rgba(255,255,255,0.15)] mx-4 order-2" />

      {/* Wajeez badge */}
      <a
        href="https://wajeez.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 order-1 md:order-3 no-underline"
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <div className="text-right min-w-[214px]">
          <div className="text-white font-bold text-[14px]">شهادة معتمدة من تطبيق وجيز</div>
          <div className="text-[rgba(252,251,251,0.62)] text-[12px]">أكبر منصّة صوتية في الشرق الأوسط</div>
          <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.12)]">
            <div className="text-[10px] font-semibold tracking-[0.02em] text-[#FFC107] mb-1">موثوق إعلامياً</div>
            <img
              src={mediaLogos}
              alt="BBC، الوطن، وForbes Middle East"
              className="w-[185px] max-w-full h-auto max-h-[22px] object-contain object-right"
            />
          </div>
        </div>
        <div className="w-11 h-11 bg-white rounded-[11px] flex items-center justify-center shadow-sm shrink-0">
          <img src={wajeezLogo} alt="وجيز" className="w-8 h-8 object-contain" />
        </div>
      </a>
    </div>
  );
}
