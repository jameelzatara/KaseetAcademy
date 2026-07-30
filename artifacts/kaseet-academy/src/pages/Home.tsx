import HeroSection from '@/components/HeroSection';
import ReelsSection from '@/components/ReelsSection';
import CoursesSection from '@/components/CoursesSection';
import TracksSection from '@/components/TracksSection';
import ConsultationSection from '@/components/ConsultationSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import SiteFooter from '@/components/SiteFooter';

/** Thin gold gradient divider used between all post-hero sections */
function SectionDivider() {
  return (
    <div style={{
      height: 1,
      width: '70%',
      maxWidth: 900,
      margin: '0 auto',
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,193,7,0.25) 50%, transparent 100%)',
    }} />
  );
}

export default function Home() {
  return (
    <main className="w-full" dir="rtl">
      {/* Hero — untouched, has its own direction handling */}
      <div dir="ltr">
        <HeroSection />
      </div>

      {/* Reels Showcase */}
      <div id="reels">
        <ReelsSection />
      </div>
      <SectionDivider />

      {/* Courses Catalog */}
      <div id="courses">
        <CoursesSection />
      </div>
      <SectionDivider />

      {/* Academic Tracks */}
      <div id="tracks">
        <TracksSection />
      </div>
      <SectionDivider />

      {/* Free Consultation */}
      <ConsultationSection />
      <SectionDivider />

      {/* Student Testimonials */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <SectionDivider />

      {/* FAQ */}
      <FAQSection />
      <SectionDivider />

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
