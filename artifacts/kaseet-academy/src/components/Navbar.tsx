import { motion } from 'framer-motion';
import logo from '@assets/logo_1785422080938.png';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Right side (RTL start) - Logo */}
        <div className="flex-shrink-0">
          <img src={logo} alt="Kaseet Academy" className="h-[46px] w-auto object-contain" />
        </div>
        
        {/* Left side (RTL end) - Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* CTA Button */}
          <motion.button 
            whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)' }}
            whileTap={{ y: 0 }}
            className="bg-[#FFC107] text-[#121927] font-bold px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-base transition-all"
          >
            ابدأ رحلتك الصوتية
          </motion.button>

          {/* Currency Pill */}
          <div className="glass-panel hidden md:flex items-center justify-center px-4 py-2.5 rounded-full border border-[rgba(255,255,255,0.1)]">
            <span className="text-white font-medium text-sm">JOD ع.أ</span>
          </div>

          {/* Hamburger Menu */}
          <button className="glass-panel w-12 h-12 flex flex-col items-center justify-center gap-[5px] rounded-full border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(44,55,75,0.95)] transition-colors">
            <span className="w-5 h-[2px] bg-[#FFC107] rounded-full block"></span>
            <span className="w-5 h-[2px] bg-[#FFC107] rounded-full block"></span>
            <span className="w-5 h-[2px] bg-[#FFC107] rounded-full block"></span>
          </button>
          
        </div>
      </div>
    </header>
  );
}
