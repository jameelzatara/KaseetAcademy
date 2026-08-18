// ── Academic Tracks Section — Masterclass terminology ────────
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import SectionHeader, { Gold } from './SectionHeader';

import mediaTrackImg     from '@assets/media-track_1785431174381.jpeg';
import voiceoverTrackImg from '@assets/voiceover-track_1785431174382.jpeg';
import publicSpeakingImg from '@assets/engage-your-audience-2_1787084523466.jpg';

interface Track {
  id:              number;
  title:           string;
  desc:            string;
  hours:           string;
  image:           string;
  imgPos:          string;
  route?:          string;
  inPersonOld:     string;   // مشطوب
  inPersonNew:     string;   // بارز ذهبي
  inPersonSessions:string;   // ساعات / لقاءات
  onlineOld:       string;
  onlineNew:       string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title:            'ماستركلاس التعليق والأداء الصوتي',
    desc:             'رحلة متكاملة لتطوير نبرات الصوت، التنفس الصحيح، وتدريب الأداء الصوتي لمختلف الإعلانات، الوثائقيات والبودكاست.',
    hours:            '44 ساعة · 12 محطة · 13 مخرجاً',
    image:            voiceoverTrackImg,
    imgPos:           'center 30%',
    route:            '/masterclass-voice',
    inPersonOld:      '260 د.أ',
    inPersonNew:      '218 د.أ',
    inPersonSessions: '16 ساعة · 8 لقاءات',
    onlineOld:        '200 $',
    onlineNew:        '150 $',
  },
  {
    id: 2,
    title:            'ماستركلاس الإعلام',
    desc:             'برنامج شامل للتدريب على التقديم التلفزيوني والإذاعي، إعداد البرامج، وإتقان الحضور أمام الكاميرا بثقة واحتراف.',
    hours:            '40 ساعة · 10 محطات · 8 مشاريع',
    image:            mediaTrackImg,
    imgPos:           'center 45%',
    route:            '/masterclass-elam',
    inPersonOld:      '260 د.أ',
    inPersonNew:      '218 د.أ',
    inPersonSessions: '16 ساعة · 8 لقاءات',
    onlineOld:        '200 $',
    onlineNew:        '150 $',
  },
  {
    id: 3,
    title:            'ماستركلاس فن الخطابة والتواصل القيادي',
    desc:             'برنامج تطبيقي لبناء الكاريزما والقيادة الصوتية، إتقان لغة الجسد والتأثير في الجمهور والتخلص من رهبة المسرح.',
    hours:            '42 ساعة · 12 محطة · 13 مخرجاً',
    image:            publicSpeakingImg,
    imgPos:           'center center',
    route:            '/masterclass-khataba',
    inPersonOld:      '260 د.أ',
    inPersonNew:      '218 د.أ',
    inPersonSessions: '16 ساعة · 8 لقاءات',
    onlineOld:        '200 $',
    onlineNew:        '150 $',
  },
];

function TrackCard({ track }: { track: Track }) {
  const [hov, setHov] = useState(false);

  const cardStyle: React.CSSProperties = {
    borderRadius:         22,
    overflow:             'hidden',
    background:           hov ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.035)',
    backdropFilter:       'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border:     hov ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.06)',
    boxShadow:  hov ? '0 20px 45px rgba(0,0,0,0.40)' : '0 10px 30px rgba(0,0,0,0.25)',
    transform:  hov ? 'translateY(-6px)' : 'translateY(0)',
    transition: 'all 0.28s ease',
    display:    'flex',
    flexDirection: 'column',
    direction:  'rtl',
    height:     '100%',
    textDecoration: 'none',
    color: 'inherit',
    cursor: track.route ? 'pointer' : 'default',
  };

  const inner = (
    <>
      {/* Cover image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={track.image}
          alt={track.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: track.imgPos,
            display: 'block',
            transform: hov ? 'scale(1.05)' : 'scale(1.0)',
            transition: 'transform 0.55s ease',
          }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(18,28,46,0.88))',
          pointerEvents: 'none',
        }} />
        {hov && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,193,7,0.06) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Card body */}
      <div style={{
        padding: 'clamp(18px,2.2vw,26px)',
        display: 'flex', flexDirection: 'column', gap: 12,
        textAlign: 'right', flex: 1,
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
          fontSize: 20,
          color: hov ? '#FFFFFF' : 'rgba(252,251,251,0.96)',
          lineHeight: 1.3, margin: 0,
          letterSpacing: '0.01em',
          transition: 'color 0.25s',
        }}>
          {track.title}
        </h3>

        {/* Hours strip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(255,193,7,0.08)',
          border: '1px solid rgba(255,193,7,0.20)',
          alignSelf: 'flex-start',
        }}>
          <span style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 600,
            color: 'rgba(255,193,7,0.85)', letterSpacing: '0.02em',
            direction: 'rtl',
          }}>
            {track.hours}
          </span>
        </div>

        {/* Gold accent */}
        <div style={{
          height: 2, borderRadius: 2,
          background: hov ? '#FFC107' : 'rgba(255,193,7,0.35)',
          width: hov ? 56 : 36,
          transition: 'background 0.3s, width 0.3s',
          alignSelf: 'flex-start',
        }} />

        {/* Description */}
        <p style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
          fontSize: 15,
          color: 'rgba(252,251,251,0.58)',
          lineHeight: 1.9, margin: 0,
          flexGrow: 1, textAlign: 'right',
          display: '-webkit-box' as const,
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {track.desc}
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          gap: 6, paddingTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto',
        }}>
          <span style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
            color: hov ? '#FFC107' : 'rgba(252,251,251,0.42)',
            transition: 'color 0.25s', cursor: 'pointer',
          }}>
            اكتشف الماستركلاس
          </span>
          <ArrowLeft
            size={14}
            color={hov ? '#FFC107' : 'rgba(252,251,251,0.30)'}
            style={{ transition: 'color 0.25s, transform 0.25s', transform: hov ? 'translateX(-3px)' : 'translateX(0)' }}
          />
        </div>
      </div>
    </>
  );

  if (track.route) {
    return (
      <Link
        href={track.route}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={cardStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={cardStyle}
    >
      {inner}
    </div>
  );
}

export default function TracksSection() {
  return (
    <section id="masterclasses" className="sec sec--tracks section-block relative overflow-hidden">
      {/* ── Windscreen foam geometry (left) ── */}
      <div className="geo" aria-hidden="true">
        <svg viewBox="0 0 260 280" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:'13%',minWidth:70,height:'auto'}}>
          {[0,1,2,3,4,5].flatMap(row =>
            [0,1,2,3,4].map(col => (
              <circle key={`${row}-${col}`}
                cx={col * 48 + (row % 2) * 24 + 10}
                cy={row * 44 + 10}
                r={6}
                fill={`rgba(30,122,133,${0.12 + ((row + col) % 3) * 0.05})`}
              />
            ))
          )}
          <circle cx="220" cy="40"  r="5" fill="rgba(255,193,7,.09)"/>
          <circle cx="240" cy="80"  r="4" fill="rgba(255,193,7,.07)"/>
          <circle cx="215" cy="120" r="5" fill="rgba(255,193,7,.09)"/>
          <circle cx="238" cy="160" r="4" fill="rgba(255,193,7,.07)"/>
        </svg>
      </div>

      <div className="absolute pointer-events-none" style={{
        top: -80, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>

        {/* Section header */}
        <SectionHeader
          badge="دوراتنا المتميّزة"
          heading={<>كل موهبة تستحق <Gold>ماستركلاساً احترافياً</Gold></>}
          description="اختر من بين ماستركلاساتنا الأكثر طلباً — كل برنامج صُمِّم ليأخذك خطوة أبعد في عالم الإعلام والصوت والخطابة."
          style={{ marginBottom: 48 }}
        />

        {/* 3-column grid */}
        <div className="tracks-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '1fr',
          gap: 24,
        }}>
          {TRACKS.map(track => <TrackCard key={track.id} track={track} />)}
        </div>

        {/* Browse all button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <button style={{
            height: 50, padding: '0 32px', borderRadius: 14,
            fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 16,
            color: 'rgba(252,251,251,0.60)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.16)',
            cursor: 'pointer',
            transition: 'color 250ms, border-color 250ms, background 250ms',
          }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.40)', background: 'rgba(255,255,255,0.04)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.60)', borderColor: 'rgba(255,255,255,0.16)', background: 'transparent' })}
          >
            استعراض كل الماستركلاسات <ArrowLeft size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .tracks-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .tracks-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
