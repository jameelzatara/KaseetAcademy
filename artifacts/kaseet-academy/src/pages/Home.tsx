import HeroSection from '@/components/HeroSection';
import ReelsSection from '@/components/ReelsSection';
import ConsultationSection from '@/components/ConsultationSection';

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />

      {/* Reels Showcase */}
      <div id="section-2">
        <ReelsSection />
      </div>

      {/* Free Consultation CTA */}
      <ConsultationSection />

      {/* Cassette Ribbon Border at the very bottom */}
      <div className="w-full h-2 cassette-ribbon" />
    </main>
  );
}
