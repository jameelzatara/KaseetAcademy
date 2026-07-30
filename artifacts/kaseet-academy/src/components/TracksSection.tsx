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
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: 'المسار الإعلامي',
    desc: 'برنامج شامل للتدريب على التقديم التلفزيوني والإخباري، إعداد البرامج، وإتقان الحضور أمام الكاميرا بثقة واحتراف.',
    image: mediaTrackImg,
  },
  {
    id: 2,
    title: 'مسار التعليق والأداء الصوتي',
    desc: 'رحلة متكاملة لتطوير نبرات الصوت، التنفس الصحيح، وتدريب الأداء الصوتي للإعلانات، الوثائقيات، والدبلجة.',
    image: voiceoverTrackImg,
  },
  {
    id: 3,
    title: 'مسار فن الخطابة',
    desc: 'برنامج تطبيقي لبناء الكاريزما والقيادة الصوتية، إتقان لغة الجسد، والتأثير في الجمهور والتغلب على رهبة المسرح.',
    image: publicSpeakingImg,
  },
];

// ── Shared background — identical to Courses & Reels ───────
const sectionBg = {
  backgroundColor: '#1e293b',
  backgroundImage: [
    'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '85px 85px',
} as const;

// ── Single track card ───────────────────────────────────────
function TrackCard({ track }: { track: Track }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: hovered
          ? '1px solid rgba(255,193,7,0.38)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: hovered
          ? '0 0 32px rgba(255,193,7,0.12), 0 16px 48px rgba(0,0,0,0.55)'
          : '0 8px 32px rgba(0,0,0,0.40)',
        transition: 'border 0.3s, box-shadow 0.3s, transform 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
      }}
    >
      {/* ── Cover image ── */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={track.image}
          alt={track.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            transition: 'transform 0.55s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1.0)',
          }}
        />
        {/* subtle bottom fade into card body */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(30,41,59,0.85))',
          pointerEvents: 'none',
        }} />
        {/* top-left gold shimmer on hover */}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,193,7,0.07) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* ── Card body ── */}
      <div style={{
        padding: 'clamp(18px,2.2vw,26px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        textAlign: 'right',
        flex: 1,
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: 'Tajawal, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(17px,1.8vw,21px)',
          color: 'rgba(252,251,251,0.96)',
          lineHeight: 1.3,
          margin: 0,
          transition: 'color 0.25s',
          ...(hovered ? { color: '#FFFFFF' } : {}),
        }}>
          {track.title}
        </h3>

        {/* Divider */}
        <div style={{
          width: 36,
          height: 2,
          borderRadius: 2,
          background: hovered ? '#FFC107' : 'rgba(255,193,7,0.35)',
          transition: 'background 0.3s, width 0.3s',
          ...(hovered ? { width: 56 } : {}),
          marginRight: 0,
          alignSelf: 'flex-end',
        }} />

        {/* Description */}
        <p style={{
          fontFamily: 'Tajawal, sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(13px,1.3vw,14.5px)',
          color: 'rgba(252,251,251,0.60)',
          lineHeight: 1.8,
          margin: 0,
          flex: 1,
        }}>
          {track.desc}
        </p>

        {/* CTA link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          paddingTop: 4,
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <span style={{
            fontFamily: 'Tajawal, sans-serif',
            fontWeight: 700,
            fontSize: 13.5,
            color: hovered ? '#FFC107' : 'rgba(252,251,251,0.42)',
            transition: 'color 0.25s',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}>
            اكتشف المسار
          </span>
          <span style={{
            fontSize: 14,
            color: hovered ? '#FFC107' : 'rgba(252,251,251,0.35)',
            transition: 'color 0.25s, transform 0.25s',
            transform: hovered ? 'translateX(-3px)' : 'translateX(0)',
            display: 'inline-block',
          }}>
            ←
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────
export default function TracksSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        ...sectionBg,
        padding: 'clamp(60px,8vh,100px) 0 clamp(70px,9vh,110px)',
      }}
    >
      {/* Seamless top blend from CoursesSection (same bg, just a soft radial) */}
      <div className="absolute pointer-events-none" style={{
        top: -80, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 200,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.07) 0%, transparent 70%)',
      }} />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>

        {/* ── Section header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'clamp(32px,4vh,52px)',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ textAlign: 'right' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              marginBottom: 12,
              padding: '4px 14px', borderRadius: 99,
              background: 'rgba(255,193,7,0.09)',
              border: '1px solid rgba(255,193,7,0.25)',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 12.5,
              color: '#FFC107',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#FFC107',
                boxShadow: '0 0 6px rgba(255,193,7,0.7)',
                flexShrink: 0,
              }} />
              البرامج الأكاديمية
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(26px,4vw,46px)',
              color: 'rgba(252,251,251,0.96)',
              lineHeight: 1.2, margin: 0,
            }}>
              كل صوت يستحق{' '}
              <span style={{ color: '#FFC107' }}>مساراً احترافياً</span>
            </h2>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(13px,1.4vw,16px)',
              color: '#E2E8F0',
              lineHeight: 1.8, margin: '10px 0 0',
              maxWidth: 580,
            }}>
              اختر من بين برامجنا الأكثر طلباً — كل مسار صُمِّم ليأخذك خطوة أبعد في عالم الإعلام والصوت والخطابة.
            </p>
          </div>

          {/* See-all button */}
          <button
            style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
              color: 'rgba(252,251,251,0.55)',
              background: 'none', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 99, padding: '8px 20px', cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.4)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.55)', borderColor: 'rgba(255,255,255,0.14)' })}
          >
            استعراض كل المسارات ←
          </button>
        </div>

        {/* ── 3-column track grid ── */}
        <div
          className="tracks-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(16px,2.5vw,28px)',
          }}
        >
          {TRACKS.map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>

      </div>

      {/* Mobile: stack to 1 col */}
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
