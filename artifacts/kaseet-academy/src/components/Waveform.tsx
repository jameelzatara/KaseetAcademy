import { useMemo } from 'react';

// Seeded random number generator to avoid layout shifts on re-renders
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export default function Waveform() {
  const barsCount = 50;

  const { backLayer, frontLayer } = useMemo(() => {
    const rng = mulberry32(1337);
    const back = Array.from({ length: barsCount }).map(() => ({
      height: 30 + rng() * 140, // 30px to 170px
    }));
    const front = Array.from({ length: barsCount }).map((_, i) => ({
      // create some correlation but variation
      height: 20 + rng() * 130, // 20px to 150px
    }));
    return { backLayer: back, frontLayer: front };
  }, [barsCount]);

  return (
    <div className="relative w-full h-[170px] flex justify-between items-end overflow-hidden px-4 md:px-10">
      
      {/* Back Layer (Taller, more transparent) */}
      <div className="absolute bottom-0 left-0 right-0 w-full flex justify-between items-end gap-[4px] md:gap-[7px] px-4 md:px-10">
        {backLayer.map((bar, i) => (
          <div
            key={`back-${i}`}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${bar.height}px`,
              background: 'linear-gradient(to top, rgba(255,193,7,0.18) 0%, rgba(44,55,75,0) 90%)'
            }}
          />
        ))}
      </div>

      {/* Front Layer (Shorter, more visible) */}
      <div className="absolute bottom-0 left-0 right-0 w-full flex justify-between items-end gap-[4px] md:gap-[7px] px-4 md:px-10">
        {frontLayer.map((bar, i) => (
          <div
            key={`front-${i}`}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${bar.height}px`,
              background: 'linear-gradient(to top, rgba(255,193,7,0.85) 0%, rgba(255,193,7,0.32) 45%, rgba(44,55,75,0) 100%)'
            }}
          />
        ))}
      </div>
      
    </div>
  );
}
