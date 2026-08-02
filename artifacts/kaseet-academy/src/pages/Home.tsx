import HeroSection        from '@/components/HeroSection';
import ReelsSection       from '@/components/ReelsSection';
import CoursesSection     from '@/components/CoursesSection';
import TracksSection      from '@/components/TracksSection';
import InstructorsSection  from '@/components/InstructorsSection';
import ConsultationSection from '@/components/ConsultationSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection         from '@/components/FAQSection';
import SiteFooter         from '@/components/SiteFooter';

export default function Home() {
  return (
    <>
      {/* ── Global ambient light orbs (fixed behind all content) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {/* Gold orb — upper-right quadrant */}
        <div style={{
          position: 'absolute', top: '-8%', right: '-6%',
          width: 960, height: 960, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,193,7,0.05) 0%, transparent 68%)',
          filter: 'blur(90px)',
        }} />
        {/* Blue orb — lower-left quadrant */}
        <div style={{
          position: 'absolute', bottom: '8%', left: '-6%',
          width: 860, height: 860, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,145,255,0.05) 0%, transparent 68%)',
          filter: 'blur(90px)',
        }} />
      </div>

      {/* ── Global technical grid (fixed, 42 px, opacity 0.025) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '42px 42px',
      }} />

      {/* ── Page content — z-index above global layers ── */}
      <main className="w-full" dir="rtl" style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <div id="reels"><ReelsSection /></div>
        <div id="courses"><CoursesSection /></div>
        <div id="tracks"><TracksSection /></div>
        <InstructorsSection />
        <ConsultationSection />
        <div id="testimonials"><TestimonialsSection /></div>
        <FAQSection />
        <SiteFooter />
      </main>
    </>
  );
}
