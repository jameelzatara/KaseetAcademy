import { motion } from 'framer-motion';
import wajeezLogo from '@assets/wajeez-logo_1785422080937.png';
import { STATS } from '../data/stats';

const fmt = (n: number) => new Intl.NumberFormat('en').format(n);

export default function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
      className="glass-panel w-full max-w-[950px] rounded-[15px] border border-[rgba(255,193,7,0.32)] shadow-[0_8px_30px_rgba(10,14,22,0.45)] py-4 px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0"
    >
      {/* Stats */}
      <div className="flex items-center justify-center gap-[clamp(16px,2.6vw,40px)] w-full md:w-auto order-2 md:order-1">

        {/* طالب مسجل */}
        <div className="flex flex-col items-center">
          <div className="text-[#FFC107] font-bold text-[clamp(18px,2.2vw,26px)] leading-none mb-1 flex items-center font-poppins" dir="ltr">
            {fmt(STATS.students)}<span>+</span>
          </div>
          <div className="text-[rgba(252,251,251,0.72)] text-[12.5px] font-medium relative pb-1 mb-1">
            طالب مسجل
            <span className="absolute bottom-0 left-[12.5%] w-[75%] h-[2px] bg-[#FFC107] rounded-full" />
          </div>
        </div>

        <div className="w-[1px] h-10 bg-[rgba(255,255,255,0.1)]" />

        {/* دورة تدريبية */}
        <div className="flex flex-col items-center">
          <div className="text-[#FFC107] font-bold text-[clamp(18px,2.2vw,26px)] leading-none mb-1 flex items-center font-poppins" dir="ltr">
            {fmt(STATS.courses)}<span>+</span>
          </div>
          <div className="text-[rgba(252,251,251,0.72)] text-[12.5px] font-medium relative pb-1 mb-1">
            دورة تدريبية
            <span className="absolute bottom-0 left-[12.5%] w-[75%] h-[2px] bg-[#FFC107] rounded-full" />
          </div>
        </div>

        <div className="w-[1px] h-10 bg-[rgba(255,255,255,0.1)]" />

        {/* ساعة تدريب مباشر */}
        <div className="flex flex-col items-center">
          <div className="text-[#FFC107] font-bold text-[clamp(18px,2.2vw,26px)] leading-none mb-1 flex items-center font-poppins" dir="ltr">
            {fmt(STATS.trainingHours)}<span>+</span>
          </div>
          <div className="text-[rgba(252,251,251,0.72)] text-[12.5px] font-medium relative pb-1 mb-1">
            ساعة تدريب مباشر
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
        <div className="text-right">
          <div className="text-white font-bold text-[14px]">شهادة معتمدة من تطبيق وجيز</div>
          <div className="text-[rgba(252,251,251,0.62)] text-[12px]">أكبر منصّة صوتية في الشرق الأوسط</div>
        </div>
        <div className="w-11 h-11 bg-white rounded-[11px] flex items-center justify-center shadow-sm shrink-0">
          <img src={wajeezLogo} alt="وجيز" className="w-8 h-8 object-contain" />
        </div>
      </a>
    </motion.div>
  );
}
