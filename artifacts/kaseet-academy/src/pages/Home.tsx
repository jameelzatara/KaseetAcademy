import HeroSection from '@/components/HeroSection';
import ReelsSection from '@/components/ReelsSection';
import CoursesSection from '@/components/CoursesSection';

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />

      {/* Reels Showcase */}
      <div id="section-2">
        <ReelsSection />
      </div>

      {/* Courses Catalog */}
      <CoursesSection />

      {/* Cassette Ribbon Border at the very bottom */}
      <div className="w-full h-2 cassette-ribbon" />
    </main>
  );
}
