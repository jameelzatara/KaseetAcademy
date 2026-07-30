import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      
      {/* Section 2 Placeholder */}
      <section 
        id="section-2" 
        className="w-full min-h-[50vh] flex items-center justify-center bg-[#212a3d] px-6 py-[120px]"
      >
        <h2 className="text-white text-3xl md:text-4xl font-bold opacity-50">
          المزيد قريباً...
        </h2>
      </section>
      
      {/* Cassette Ribbon Border at the very bottom */}
      <div className="w-full h-2 cassette-ribbon" />
    </main>
  );
}
