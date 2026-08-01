import { useState, useEffect, CSSProperties } from 'react';

const REEL_URLS = [
  "https://www.instagram.com/p/DYcvgQesju9/",
  "https://www.instagram.com/p/DbGBYbhsHNp/",
  "https://www.instagram.com/p/DW6yTEvDMgv/",
  "https://www.instagram.com/p/DWCVkWoDPLS/",
  "https://www.instagram.com/p/DbYqCDzMLPJ/",
];

const CARD_W = 300;
const GAP    = 40;
const CARD_H = 580;
const N      = REEL_URLS.length;

declare global {
  interface Window { instgrm?: { Embeds: { process: () => void } }; }
}

function ChevronL() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronR() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function getOffset(i: number, current: number): number {
  let off = (i - current + N) % N;
  if (off >= Math.ceil(N / 2)) off -= N;
  return off;
}

function cardStyle(offset: number): CSSProperties {
  const tx  = offset * (CARD_W + GAP);
  const abs = Math.abs(offset);

  if (abs === 0) return {
    transform:     `translateX(${tx}px) scale(1.0)`,
    opacity:       1,
    zIndex:        5,
    border:        '2px solid rgba(255,193,7,0.88)',
    boxShadow:     [
      '0 0 0 1px rgba(255,193,7,0.22)',
      '0 0 32px 4px rgba(255,193,7,0.28)',
      '0 0 72px 8px rgba(255,193,7,0.12)',
      '0 28px 64px rgba(0,0,0,0.70)',
    ].join(', '),
    filter:        'none',
    pointerEvents: 'auto',
    cursor:        'default',
    borderRadius:  24,
  };

  if (abs === 1) return {
    transform:     `translateX(${tx}px) scale(0.90)`,
    opacity:       0.45,
    zIndex:        2,
    border:        '1px solid rgba(255,255,255,0.07)',
    boxShadow:     '0 8px 28px rgba(0,0,0,0.45)',
    filter:        'blur(0.4px)',
    pointerEvents: 'none',
    cursor:        'default',
    borderRadius:  24,
  };

  return {
    transform:     `translateX(${tx}px) scale(0.72)`,
    opacity:       0,
    zIndex:        0,
    border:        '1px solid transparent',
    boxShadow:     'none',
    filter:        'none',
    pointerEvents: 'none',
    cursor:        'default',
    borderRadius:  24,
  };
}

const arrowBase: CSSProperties = {
  position:             'absolute',
  top:                  '50%',
  transform:            'translateY(-50%)',
  zIndex:               20,
  width:                50,
  height:               50,
  borderRadius:         '50%',
  display:              'grid',
  placeItems:           'center',
  background:           'rgba(255,255,255,0.07)',
  border:               '1px solid rgba(255,255,255,0.16)',
  backdropFilter:       'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow:            '0 6px 24px rgba(0,0,0,0.35)',
  color:                '#FFC107',
  cursor:               'pointer',
  transition:           'background 0.18s, color 0.18s, box-shadow 0.18s',
  flexShrink:           0,
};

export default function ReelsSection() {
  const [cur, setCur] = useState(0);

  const go = (dir: 1 | -1) => setCur(prev => (prev + dir + N) % N);

  useEffect(() => {
    if (document.getElementById('ig-embed-script')) return;
    const s = document.createElement('script');
    s.id  = 'ig-embed-script';
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => window.instgrm?.Embeds.process(), 120);
    return () => clearTimeout(t);
  }, [cur]);

  return (
    <section className="section-block relative overflow-hidden text-center">
      {/* Subtle warm glow at top of section */}
      <div className="absolute inset-x-0 top-0 pointer-events-none" style={{
        height: 160,
        background: 'linear-gradient(to bottom, rgba(255,193,7,0.08) 0%, transparent 100%)',
      }} />

      {/* Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 mb-5 px-5 py-2 rounded-full text-[#FFC107] text-sm font-bold"
        style={{
          background: 'rgba(255,193,7,0.08)',
          border: '1px solid rgba(255,193,7,0.25)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        <span className="w-[7px] h-[7px] rounded-full flex-none" style={{
          background: '#FFC107',
          boxShadow: '0 0 6px 2px rgba(255,193,7,0.75), 0 0 14px rgba(255,193,7,0.45)',
        }} />
        من الاستوديو مباشرةً
      </div>

      {/* Heading */}
      <h2 className="relative z-10 font-black text-[rgba(252,251,251,0.96)] mx-4 mb-3"
        style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 'clamp(28px,4.8vw,54px)', lineHeight: 1.25 }}
      >
        أصوات <span className="text-[#FFC107]">صنعناها معاً</span>
      </h2>

      {/* Subtitle */}
      <p className="relative z-10 mx-auto px-5 font-normal"
        style={{
          fontFamily: 'Tajawal, sans-serif',
          fontSize: 'clamp(14px,1.55vw,17px)',
          lineHeight: 1.85,
          color: 'rgba(252,251,251,0.62)',
          maxWidth: 640,
          marginBottom: 'clamp(36px,5vh,56px)',
          textAlign: 'center',
        }}
      >
        مقاطع حيّة من ورشنا وأعمال متدربينا ومدربينا على إنستغرام — اسمع الفرق قبل أن تسجّل.
      </p>

      {/* ── Carousel — arrows outside stage via padding ── */}
      <div className="relative mx-auto" style={{ maxWidth: 1100, padding: '0 72px' }}>

        <button
          onClick={() => go(-1)}
          aria-label="السابق"
          style={{ ...arrowBase, right: 8 }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#FFC107', color: '#18202c', boxShadow: '0 0 24px rgba(255,193,7,0.50)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.07)', color: '#FFC107', boxShadow: '0 6px 24px rgba(0,0,0,0.35)' })}
        >
          <ChevronL />
        </button>

        <button
          onClick={() => go(1)}
          aria-label="التالي"
          style={{ ...arrowBase, left: 8 }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#FFC107', color: '#18202c', boxShadow: '0 0 24px rgba(255,193,7,0.50)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.07)', color: '#FFC107', boxShadow: '0 6px 24px rgba(0,0,0,0.35)' })}
        >
          <ChevronR />
        </button>

        {/* Stage */}
        <div style={{ position: 'relative', overflow: 'hidden', height: CARD_H + 20 }}>
          {REEL_URLS.map((url, i) => {
            const off     = getOffset(i, cur);
            const cstyle  = cardStyle(off);
            const isCenter = off === 0;

            return (
              <div
                key={i}
                onClick={() => { if (off !== 0) go(off > 0 ? 1 : -1); }}
                style={{
                  position:   'absolute',
                  top:        0,
                  left:       '50%',
                  marginLeft: -(CARD_W / 2),
                  width:      CARD_W,
                  overflow:   'hidden',
                  background: '#141e30',
                  display:    'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.52s cubic-bezier(0.25,0.8,0.25,1), opacity 0.52s ease, box-shadow 0.52s ease, border 0.30s ease',
                  ...cstyle,
                }}
              >
                {/* Top breathing gap */}
                <div style={{ height: 10, flexShrink: 0, background: '#141e30' }} />

                {/* Instagram embed */}
                <div className="reel-embed-wrap" style={{
                  flex: 1, minHeight: 490, background: '#000', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style={{ margin: 0, width: '100%', minWidth: '100%', border: 'none' } as CSSProperties}
                  />
                </div>

                {isCenter && (
                  <div style={{
                    position: 'absolute', bottom: 46, left: 0, right: 0, height: 60,
                    background: 'linear-gradient(to top, rgba(8,12,24,0.85) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Footer strip */}
                <div style={{
                  padding: '14px 16px 16px',
                  background: 'rgba(14,20,34,0.98)',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexShrink: 0,
                  direction: 'rtl',
                }}>
                  {/* Label first (RIGHT in RTL) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: '#FFC107', color: '#18202c',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 12,
                      flexShrink: 0,
                    }}>ك</div>
                    <span style={{
                      fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
                      fontSize: 12.5, color: 'rgba(255,255,255,0.88)',
                    }}>
                      من متدرّبي كاسيت
                    </span>
                  </div>
                  {/* Stars after text (LEFT) */}
                  <span style={{ color: '#FFC107', fontSize: 12, letterSpacing: 2 }}>★★★★★</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginTop: 28,
        }}>
          {REEL_URLS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              aria-label={`الرييل ${i + 1}`}
              style={{
                width:  i === cur ? 22 : 7,
                height: 7,
                borderRadius: 99,
                background: i === cur ? '#FFC107' : 'rgba(255,255,255,0.22)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.35s ease',
                boxShadow: i === cur ? '0 0 10px rgba(255,193,7,0.55)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
