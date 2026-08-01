import HeroSection from '@/components/HeroSection';
import ReelsSection from '@/components/ReelsSection';
import CoursesSection from '@/components/CoursesSection';
import TracksSection from '@/components/TracksSection';
import ConsultationSection from '@/components/ConsultationSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import SiteFooter from '@/components/SiteFooter';

export default function Home() {
  return (
    <main className="w-full" dir="rtl">
      {/* Hero — HTML root dir="rtl" already applies */}
      <HeroSection />
      <div id="reels"><ReelsSection /></div>
      <div id="courses"><CoursesSection /></div>
      <div id="tracks"><TracksSection /></div>
      <ConsultationSection />
      <div id="testimonials"><TestimonialsSection /></div>
      <FAQSection />
      <SiteFooter />
    </main>
  );
}
