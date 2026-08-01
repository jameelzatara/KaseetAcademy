// ── Academic Tracks Section ────────────────────────────────
import mediaTrackImg     from '@assets/media-track_1785431174381.jpeg';
import voiceoverTrackImg from '@assets/voiceover-track_1785431174382.jpeg';
import publicSpeakingImg from '@assets/public-speaking-track_1785431174381.jpg';
import { useState } from 'react';

interface Track {
  id: number;
  title: string;
  desc: string;
  image: string;
  /** smart object-position based on image content */
  imgPos: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title:  'المسار الإعلامي',
    desc:   'برنامج شامل للتدريب على التقديم التلفزيوني والإذاعي، إعداد البرامج، وإتقان الحضور أمام الكاميرا بثقة واحتراف.',
    image:  mediaTrackImg,
    imgPos: 'center 30%',   // group/media photo — preserve faces without aggressive crop
  },
  {
    id: 2,
    title:  'مسار التعليق والأداء الصوتي',
    desc:   'رحلة متكاملة لتطوير نبرات الصوت، التنفس الصحيح، وتدريب الأداء الصوتي لمختلف الإعلانات، الوثائقيات والبودكاست.',
    image:  voiceoverTrackImg,
    imgPos: 'center 30%',   // studio group — show upper composition
  },
  {
    id: 3,
    title:  'مسار فن الخطابة',
    desc:   'برنامج تطبيقي لبناء الكاريزما والقيادة الصوتية، إتقان لغة الجسد والتأثير في الجمهور والتخلص من رهبة المسرح.',
    image:  publicSpeakingImg,
    imgPos: 'center 30%',   // speaker/audience — preserve speaker face
  },
];

function TrackCard({ track }: { track: Track }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius:         22,
        overflow:             'hidden',
        background:           'rgba(255,255,255,0.04)',
        backdropFilter:       'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:     hovered ? '1px solid rgba(255,193,7,0.36)' : '1px solid rgba(255,255,255,0.09)',
        boxShadow:  hovered ? '0 20px 45px rgba(0,0,0,0.40)' : '0 10px 30px rgba(0,0,0,0.25)',
        transition: 'border 0.3s, box-shadow 0.3s, transform 0.3s',
        transform:  hovered ? 'translateY(-6px)' : 'translateY(0)',
        display:    'flex',
        flexDirection: 'column',
        cursor:     'default',
        direction:  'rtl',
      }}
    >
      {/* Cover image — smart object-position; overflow:hidden + border-radius:inherit */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0, borderRadius: 'inherit' }}>
        <img
          src={track.image}
          alt={track.title}
          style={{
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: track.imgPos,
            display:        'block',
            transition:     'transform 0.55s ease',
            transform:      hovered ? 'scale(1.05)' : 'scale(1.0)',
          }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(18,28,46,0.85))',
          pointerEvents: 'none',
        }} />
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,193,7,0.07) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Card body — flex col; desc grows to pin CTA to bottom */}
      <div style={{
        padding:       'clamp(18px,2.2vw,26px)',
        display:       'flex',
        flexDirection: 'column',
        gap:           12,
        textAlign:     'right',
        flex:          1,
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
          fontSize:   'clamp(17px,1.8vw,21px)',
          color:      hovered ? '#FFFFFF' : 'rgba(252,251,251,0.96)',
          lineHeight: 1.3, margin: 0,
          transition: 'color 0.25s',
          textAlign:  'right',
        }}>
          {track.title}
        </h3>

        {/* Animated gold accent */}
        <div style={{
          height:     2,
          borderRadius: 2,
          background: hovered ? '#FFC107' : 'rgba(255,193,7,0.35)',
          width:      hovered ? 56 : 36,
          transition: 'background 0.3s, width 0.3s',
          alignSelf:  'flex-start',
        }} />

        {/* Description — grows to pin CTA to bottom */}
        <p style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
          fontSize:   'clamp(13px,1.3vw,14.5px)',
          color:      'rgba(252,251,251,0.60)',
          lineHeight: 1.8, margin: 0,
          flexGrow:   1,              // fills available vertical space
          textAlign:  'right',
        }}>
          {track.desc}
        </p>

        {/* CTA — pinned to bottom */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap:        6,
          paddingTop: 6,
          borderTop:  '1px solid rgba(255,255,255,0.07)',
          marginTop:  'auto',
        }}>
          <span style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13.5,
            color:     hovered ? '#FFC107' : 'rgba(252,251,251,0.42)',
            transition: 'color 0.25s', cursor: 'pointer',
          }}>
            اكتشف المسار
          </span>
          <span style={{
            fontSize:   14,
            color:      hovered ? '#FFC107' : 'rgba(252,251,251,0.32)',
            transition: 'color 0.25s, transform 0.25s',
            transform:  hovered ? 'translateX(-3px)' : 'translateX(0)',
            display:    'inline-block',
          }}>
            ←
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TracksSection() {
  return (
    <section className="section-block relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{
        top: -80, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>

        {/* Section header — 8pt spacing system */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 48,             /* subtitle → cards */
          flexWrap: 'wrap', gap: 12,
          direction: 'rtl',
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 12,
              padding: '4px 14px', borderRadius: 99,
              background: 'rgba(255,193,7,0.09)', border: '1px solid rgba(255,193,7,0.25)',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 12.5, color: '#FFC107',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFC107', boxShadow: '0 0 6px rgba(255,193,7,0.7)', flexShrink: 0 }} />
              المسارات الأكاديمية
            </div>

            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(26px,4vw,46px)',
              color: 'rgba(252,251,251,0.96)', lineHeight: 1.2, margin: 0,
              textAlign: 'right',
            }}>
              كل صوت يستحق{' '}
              <span style={{ color: '#FFC107' }}>مساراً احترافياً</span>
            </h2>

            {/* heading → subtitle: 20px */}
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(13px,1.4vw,16px)',
              color: '#E2E8F0', lineHeight: 1.8, margin: '20px 0 0', maxWidth: 580,
              textAlign: 'right',
            }}>
              اختر من بين برامجنا الأكثر طلباً — كل مسار صُمِّم ليأخذك خطوة أبعد في عالم الإعلام والصوت والخطابة.
            </p>
          </div>

          {/* Secondary button */}
          <button style={{
            fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
            color: 'rgba(252,251,251,0.55)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 14, padding: '0 20px', height: 50,
            cursor: 'pointer',
            transition: 'color 250ms, border-color 250ms, background 250ms',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, {
              color: '#FFC107',
              borderColor: 'rgba(255,193,7,0.4)',
              background: 'rgba(255,255,255,0.04)',
            })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, {
              color: 'rgba(252,251,251,0.55)',
              borderColor: 'rgba(255,255,255,0.18)',
              background: 'transparent',
            })}
          >
            استعراض كل المسارات ←
          </button>
        </div>

        {/* 3-column grid — grid-auto-rows:1fr equalises row heights */}
        <div className="tracks-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '1fr',
          gap: 'clamp(16px,2.5vw,28px)',
        }}>
          {TRACKS.map(track => <TrackCard key={track.id} track={track} />)}
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
