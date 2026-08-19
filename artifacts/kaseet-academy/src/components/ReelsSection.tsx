import { useState, useEffect, useRef, CSSProperties, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionHeader, { Gold } from './SectionHeader';

interface ReelsSectionProps {
  badge?: string;
  heading?: ReactNode;
  description?: string;
  urls?: string[];
  lightEmbed?: boolean;
}

const REEL_URLS = [
  "https://www.instagram.com/p/DYcvgQesju9/",
  "https://www.instagram.com/p/DbGBYbhsHNp/",
  "https://www.instagram.com/p/DW6yTEvDMgv/",
  "https://www.instagram.com/p/DWCVkWoDPLS/",
  "https://www.instagram.com/p/DbYqCDzMLPJ/",
];

const CARD_W  = 300;
const GAP     = 24;   // 24px gap per spec
const CARD_H  = 580;
const N       = REEL_URLS.length;
const AUTO_MS = 4500; // autoplay interval

declare global {
  interface Window { instgrm?: { Embeds: { process: () => void } }; }
}


function getOffset(i: number, current: number, total: number): number {
  let off = (i - current + total) % total;
  if (off >= Math.ceil(total / 2)) off -= total;
  return off;
}

function cardStyle(offset: number): CSSProperties {
  const tx  = offset * (CARD_W + GAP);
  const abs = Math.abs(offset);

  if (abs === 0) return {
    transform:     `translateX(${tx}px) scale(1.0)`,
    opacity:       1,
    zIndex:        5,
    border:        '1.5px solid rgba(255,193,7,0.85)',
    boxShadow: [
      '0 0 0 1px rgba(255,193,7,0.20)',
      '0 0 28px 4px rgba(255,193,7,0.24)',
      '0 0 64px 8px rgba(255,193,7,0.10)',
      '0 24px 56px rgba(0,0,0,0.65)',
    ].join(', '),
    filter:        'none',
    pointerEvents: 'auto',
    borderRadius:  22,
  };

  if (abs === 1) return {
    transform:     `translateX(${tx}px) scale(0.90)`,
    opacity:       0.50,
    zIndex:        2,
    border:        '1px solid rgba(255,255,255,0.07)',
    boxShadow:     '0 8px 28px rgba(0,0,0,0.40)',
    filter:        'blur(0.5px)',
    pointerEvents: 'none',
    borderRadius:  22,
  };

  return {
    transform:     `translateX(${tx}px) scale(0.72)`,
    opacity:       0,
    zIndex:        0,
    border:        '1px solid transparent',
    boxShadow:     'none',
    filter:        'none',
    pointerEvents: 'none',
    borderRadius:  22,
  };
}

// 48px glass circle arrows
const arrowBase: CSSProperties = {
  position:             'absolute',
  top:                  '50%',
  transform:            'translateY(-50%)',
  zIndex:               20,
  width:                48,
  height:               48,
  borderRadius:         '50%',
  display:              'grid',
  placeItems:           'center',
  background:           'rgba(255,255,255,0.06)',
  border:               '1px solid rgba(255,255,255,0.14)',
  backdropFilter:       'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow:            '0 6px 24px rgba(0,0,0,0.30)',
  color:                '#FFC107',
  cursor:               'pointer',
  transition:           'background 200ms, color 200ms, box-shadow 200ms',
  flexShrink:           0,
};

export default function ReelsSection({
  badge = 'من الاستوديو مباشرةً',
  heading = <><Gold>أصوات</Gold> صنعناها معاً</>,
  description = 'مقاطع حيّة من ورشنا وأعمال متدرّبينا ومدربينا على إنستغرام — اسمع الفرق قبل أن تسجّل.',
  urls,
  lightEmbed = false,
}: ReelsSectionProps = {}) {
  const activeUrls = urls && urls.length > 0 ? urls : REEL_URLS;
  const n = activeUrls.length;
  const [cur,     setCur]     = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: 1 | -1) => setCur(prev => (prev + dir + n) % n);

  // Autoplay — pauses on hover
  useEffect(() => {
    if (paused) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => go(1), AUTO_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, cur, n]);

  // Instagram embed
  useEffect(() => {
    if (document.getElementById('ig-embed-script')) return;
    const s = document.createElement('script');
    s.id = 'ig-embed-script'; s.src = 'https://www.instagram.com/embed.js'; s.async = true;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => window.instgrm?.Embeds.process(), 120);
    return () => clearTimeout(t);
  }, [cur]);

  return (
    <section
      id="voices"
      className="sec sec--reels section-block relative overflow-hidden text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Audio waveform geometry (bottom) ── */}
      <div className="geo geo--btm" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none"
          style={{width:'100%',height:'100%',display:'block'}}>
          <path d="M0 80 C200 20 400 100 600 60 S1000 20 1200 60 S1440 90 1440 80"
            stroke="rgba(74,130,196,.12)" strokeWidth="1.5" fill="none"/>
          <path d="M0 60 C200 100 400 20 600 60 S1000 100 1200 60 S1440 40 1440 60"
            stroke="rgba(74,130,196,.07)" strokeWidth="1" fill="none"/>
          <path d="M0 90 C360 50 720 90 1080 50 S1440 90 1440 90"
            stroke="rgba(255,193,7,.05)" strokeWidth="1" fill="none"/>
        </svg>
      </div>


      {/* Section header — centered */}
      <div className="relative z-10 px-4">
        <SectionHeader
          badge={badge}
          heading={heading}
          description={description}
          style={{ marginBottom: 48 }}
        />
      </div>

      {/* ── Carousel — visible overflow: 40px each side ── */}
      <div className="relative mx-auto" style={{ maxWidth: 1100, padding: '0 80px' }}>

        {/* Right arrow (RTL: previous) */}
        <button
          onClick={() => go(-1)}
          aria-label="السابق"
          style={{ ...arrowBase, right: 16 }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#FFC107', color: '#18202c', boxShadow: '0 0 20px rgba(255,193,7,0.45)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.06)', color: '#FFC107', boxShadow: '0 6px 24px rgba(0,0,0,0.30)' })}
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>

        {/* Left arrow (RTL: next) */}
        <button
          onClick={() => go(1)}
          aria-label="التالي"
          style={{ ...arrowBase, left: 16 }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#FFC107', color: '#18202c', boxShadow: '0 0 20px rgba(255,193,7,0.45)' })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.06)', color: '#FFC107', boxShadow: '0 6px 24px rgba(0,0,0,0.30)' })}
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>

        {/* Stage — overflow visible so adjacent cards peek 40px */}
        <div className="reels-stage" style={{ position: 'relative', overflow: 'visible', height: CARD_H + 20 }}>
          {activeUrls.map((url, i) => {
            const off      = getOffset(i, cur, n);
            const cstyle   = cardStyle(off);
            const isCenter = off === 0;
            // light mode: white card so Instagram embed header is fully visible
            const cardBg = lightEmbed
              ? (isCenter ? '#ffffff' : 'rgba(255,255,255,0.80)')
              : (isCenter ? 'rgba(18,26,42,0.88)' : '#0C1220');

            return (
              <div
                key={i}
                className={[isCenter ? 'reel-wrap is-active' : 'reel-wrap', lightEmbed ? 'reel-wrap--light' : ''].join(' ').trim()}
                onClick={() => { if (off !== 0) go(off > 0 ? 1 : -1); }}
                style={{
                  position:   'absolute',
                  top:        0,
                  left:       '50%',
                  marginLeft: -(CARD_W / 2),
                  width:      CARD_W,
                  overflow:   'hidden',
                  background: cardBg,
                  display:    'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.50s cubic-bezier(0.25,0.8,0.25,1), opacity 0.50s ease, box-shadow 0.50s ease, border 0.28s ease',
                  ...cstyle,
                }}
              >
                {/* Instagram embed */}
                <div className="reel-embed-wrap" style={{
                  flex: 1, minHeight: 490,
                  background: lightEmbed ? '#ffffff' : 'transparent',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style={{ margin: 0, width: '100%', minWidth: '100%', border: 'none' } as CSSProperties}
                  />
                </div>


                {/* Footer */}
                <div style={{
                  padding: '12px 16px 14px',
                  background: 'rgba(10,16,28,0.98)',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexShrink: 0, direction: 'rtl',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: '#FFC107', color: '#18202c',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 12, flexShrink: 0,
                    }}>ك</div>
                    <span style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                      من متدرّبي كاسيت
                    </span>
                  </div>
                  <span style={{ display: 'inline-flex', gap: 1 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FFC107" color="#FFC107" />)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators — 12px, animated active */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginTop: 32,
        }}>
          {activeUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              aria-label={`الرييل ${i + 1}`}
              style={{
                width:        i === cur ? 28 : 12,
                height:       12,
                borderRadius: 999,
                background:   i === cur ? '#FFC107' : 'rgba(255,255,255,0.20)',
                border:       'none', padding: 0, cursor: 'pointer',
                transition:   'all 350ms cubic-bezier(0.4,0,0.2,1)',
                boxShadow:    i === cur ? '0 0 10px rgba(255,193,7,0.55)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
