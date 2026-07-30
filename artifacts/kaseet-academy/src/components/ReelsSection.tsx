import { useRef, useState, useEffect, useCallback } from 'react';

const REEL_URLS = [
  "https://www.instagram.com/p/DYcvgQesju9/",
  "https://www.instagram.com/p/DbGBYbhsHNp/",
  "https://www.instagram.com/p/DW6yTEvDMgv/",
  "https://www.instagram.com/p/DWCVkWoDPLS/",
  "https://www.instagram.com/p/DbYqCDzMLPJ/",
];

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function ReelsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [centerIdx, setCenterIdx] = useState(Math.floor(REEL_URLS.length / 2));
  const rafRef = useRef<number | null>(null);

  const computeCenter = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const cx = trackRect.left + trackRect.width / 2;
    let best = 0;
    let minDiff = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const r = card.getBoundingClientRect();
      const cardCx = r.left + r.width / 2;
      const diff = Math.abs(cardCx - cx);
      if (diff < minDiff) { minDiff = diff; best = i; }
    });
    setCenterIdx(best);
  }, []);

  const scrollToCard = useCallback((dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const newIdx = Math.max(0, Math.min(REEL_URLS.length - 1, centerIdx + dir));
    const card = cardRefs.current[newIdx];
    if (card) {
      card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [centerIdx]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(computeCenter);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', computeCenter);

    // Initial scroll to center card
    const timer = setTimeout(() => {
      const mid = cardRefs.current[Math.floor(REEL_URLS.length / 2)];
      if (mid) mid.scrollIntoView({ inline: 'center', block: 'nearest' });
      computeCenter();
    }, 400);

    // Trigger Instagram embeds
    let attempts = 0;
    const igTimer = setInterval(() => {
      attempts++;
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
        setTimeout(computeCenter, 600);
      }
      if (attempts > 12) clearInterval(igTimer);
    }, 800);

    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', computeCenter);
      clearTimeout(timer);
      clearInterval(igTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [computeCenter]);

  // Load Instagram embed script once
  useEffect(() => {
    if (document.getElementById('ig-embed-script')) return;
    const script = document.createElement('script');
    script.id = 'ig-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section
      className="relative overflow-hidden text-center"
      style={{
        backgroundColor: '#202938',
        backgroundImage: `
          repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.025) 0px,
            rgba(255,255,255,0.025) 1px,
            transparent 1px,
            transparent 9px
          )
        `,
        padding: 'clamp(60px,8vh,100px) 0 clamp(70px,9vh,110px)',
      }}
    >
      {/* Radial gold glow behind center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '38%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 520, height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,193,7,0.13), transparent 62%)',
        }}
      />

      {/* Badge — glassmorphic */}
      <div
        className="inline-flex items-center gap-2 mb-5 px-5 py-2 rounded-full text-[#FFC107] text-sm font-bold"
        style={{
          background: 'rgba(255,193,7,0.08)',
          border: '1px solid rgba(255,193,7,0.22)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 16px rgba(255,193,7,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span
          className="w-[7px] h-[7px] rounded-full bg-[#FFC107] flex-none"
          style={{
            boxShadow: '0 0 6px 2px rgba(255,193,7,0.7), 0 0 12px rgba(255,193,7,0.4)',
          }}
        />
        من الاستوديو مباشرةً
      </div>

      {/* Heading */}
      <h2
        className="font-black text-[rgba(252,251,251,0.95)] mx-4 mb-3"
        style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 'clamp(28px,4.8vw,54px)', lineHeight: 1.25 }}
      >
        أصوات <span className="text-[#FFC107]">صنعناها معاً</span>
      </h2>
      <p
        className="mx-auto px-5 text-[rgba(252,251,251,0.70)]"
        style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 'clamp(14px,1.8vw,18px)', lineHeight: 1.8, maxWidth: 640, marginBottom: 'clamp(30px,4vh,48px)' }}
      >
        مقاطع حيّة من ورشنا وأعمال متدربينا ومدربينا على إنستغرام — اسمع الفرق قبل أن تسجّل.
      </p>

      {/* Carousel */}
      <div className="relative mx-auto" style={{ maxWidth: 1150 }}>
        {/* Prev arrow (RTL: right side = previous) */}
        <button
          onClick={() => scrollToCard(-1)}
          aria-label="السابق"
          className="absolute top-1/2 -translate-y-1/2 z-10 grid place-items-center rounded-full text-[#FFC107] transition-all duration-200"
          style={{
            right: 10,
            width: 48, height: 48,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = '#FFC107';
            el.style.color = '#18202c';
            el.style.boxShadow = '0 0 20px rgba(255,193,7,0.4)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = 'rgba(255,255,255,0.08)';
            el.style.color = '#FFC107';
            el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
        >
          <ChevronRight />
        </button>

        {/* Next arrow (RTL: left side = next) */}
        <button
          onClick={() => scrollToCard(1)}
          aria-label="التالي"
          className="absolute top-1/2 -translate-y-1/2 z-10 grid place-items-center rounded-full text-[#FFC107] transition-all duration-200"
          style={{
            left: 10,
            width: 48, height: 48,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = '#FFC107';
            el.style.color = '#18202c';
            el.style.boxShadow = '0 0 20px rgba(255,193,7,0.4)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = 'rgba(255,255,255,0.08)';
            el.style.color = '#FFC107';
            el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
        >
          <ChevronLeft />
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto items-center"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            padding: '20px max(calc(50% - 160px), 16px) 30px',
          }}
        >
          {REEL_URLS.map((url, i) => {
            const isCenter = i === centerIdx;
            return (
              <div
                key={url}
                ref={el => { cardRefs.current[i] = el; }}
                style={{
                  flex: '0 0 auto',
                  width: 300,
                  scrollSnapAlign: 'center',
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: '#1e2838',
                  transform: isCenter ? 'scale(1.05)' : 'scale(0.86)',
                  opacity: isCenter ? 1 : 0.4,
                  filter: isCenter ? 'none' : 'blur(0.4px)',
                  transition: 'all 0.45s cubic-bezier(0.25,0.8,0.25,1)',
                  border: isCenter ? '2px solid #FFC107' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isCenter
                    ? '0 0 35px rgba(255,193,7,0.35), 0 20px 50px rgba(0,0,0,0.6)'
                    : '0 10px 30px rgba(0,0,0,0.5)',
                  position: 'relative',
                  zIndex: isCenter ? 5 : 1,
                }}
              >
                {/* Instagram embed */}
                <div style={{ width: '100%', minHeight: 430, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style={{ margin: '0 !important', width: '100% !important', minWidth: '100% !important', border: 'none !important' }}
                  />
                </div>

                {/* Card footer strip */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(24,32,44,0.95)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="grid place-items-center text-xs font-black"
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#FFC107', color: '#18202c',
                        fontFamily: 'Tajawal, sans-serif',
                      }}
                    >
                      ك
                    </div>
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 12.5, color: 'rgba(255,255,255,0.9)' }}>
                      من متدرّبي كاسيت
                    </span>
                  </div>
                  <span style={{ color: '#FFC107', fontSize: 12, letterSpacing: 2 }}>★★★★★</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
