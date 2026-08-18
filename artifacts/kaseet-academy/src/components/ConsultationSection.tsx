// ── Free Consultation Section — ياقوت الخشاشنة المستشارة التعليمية ───
import consultantImg from '@assets/consultant_1785431795181.jpeg';
import { MessageCircle } from 'lucide-react';

const GOLD = '#FFC107';

const BENEFITS = [
  'تقييم شامل لمستواك الصوتي والإعلامي',
  'ترشيح البرنامج والأستاذ الأنسب لأهدافك',
  'خطة عمل واضحة بدون أي التزام مالي',
];

export default function ConsultationSection() {
  return (
    <section id="consultant" className="sec sec--advisor section-block relative overflow-hidden">
      {/* ── Scan lines geometry (right edge) ── */}
      <div className="geo" aria-hidden="true">
        <svg viewBox="0 0 280 400" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',width:'16%',minWidth:80,height:'auto',opacity:0.55}}>
          {Array.from({length:22}).map((_, i) => (
            <line key={i}
              x1={0} y1={i * 18} x2={280} y2={i * 18}
              stroke={i % 4 === 0 ? 'rgba(74,130,196,.22)' : 'rgba(74,130,196,.09)'}
              strokeWidth={i % 4 === 0 ? 1.2 : 0.7}/>
          ))}
        </svg>
      </div>

      {/* Gold radial glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 220,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.09) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>

        {/* ── Compact unified card ── */}
        <div className="advisor-card" style={{
          background:          'rgba(49,61,84,0.55)',
          border:              '1px solid rgba(255,255,255,0.10)',
          borderRadius:        24,
          padding:             'clamp(24px,3vw,40px) clamp(24px,4vw,48px)',
          boxShadow:           '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter:      'blur(8px)',
          WebkitBackdropFilter:'blur(8px)',
        }}>

          {/* ── 2-column RTL grid ── */}
          <div className="consult-banner-grid" style={{
            display:             'grid',
            gridTemplateColumns: '1fr 320px',
            gap:                 'clamp(28px,4vw,60px)',
            alignItems:          'center',
            direction:           'rtl',
          }}>

            {/* ── RIGHT COLUMN: all text content ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'right' }}>

              {/* Badge */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 999,
                  background: 'rgba(255,193,7,0.12)',
                  border: '1px solid rgba(255,193,7,0.30)',
                  color: GOLD, fontSize: 13, fontWeight: 700,
                }}>
                  ✦ استشارة مجانية 100%
                </span>
              </div>

              {/* Heading */}
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(22px,3.2vw,36px)',
                fontWeight: 900,
                lineHeight: 1.3,
                color: 'rgba(252,251,251,0.97)',
              }}>
                محتار في اختيار البرنامج الأنسب{' '}
                <span style={{ color: GOLD }}>لأهدافك؟</span>
              </h2>

              {/* Subtitle */}
              <p style={{
                margin: 0,
                fontSize: 'clamp(14px,1.6vw,17px)',
                fontWeight: 400,
                color: 'rgba(252,251,251,0.62)',
                lineHeight: 1.75,
              }}>
                متاحة للإجابة عن استفساراتك
              </p>

              {/* Benefits */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BENEFITS.map((b, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    direction: 'rtl',
                  }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: GOLD, fontSize: 12, fontWeight: 900,
                    }}>✓</span>
                    <span style={{
                      fontSize: 15, fontWeight: 500,
                      color: 'rgba(252,251,251,0.80)', lineHeight: 1.6,
                    }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href="https://wa.me/962771052222?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%AA%D8%B9%D9%84%D9%8A%D9%85%D9%8A%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    fontWeight: 600, fontSize: 15,
                    height: 46, padding: '0 24px', borderRadius: 12,
                    background: '#065f46', color: '#fff',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(6,95,70,0.40)',
                    border: '1px solid rgba(74,222,128,0.25)',
                    transition: 'transform 250ms, box-shadow 250ms, background 250ms',
                    direction: 'rtl',
                  }}
                  onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                    transform: 'translateY(-2px)', background: '#047857',
                    boxShadow: '0 8px 28px rgba(6,95,70,0.55), 0 0 24px rgba(74,222,128,0.18)',
                  })}
                  onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                    transform: 'none', background: '#065f46',
                    boxShadow: '0 4px 20px rgba(6,95,70,0.40)',
                  })}
                >
                  تحدّث مع ياقوت عبر واتساب
                  <MessageCircle size={18} style={{ flexShrink: 0 }} />
                </a>

                <button style={{
                  fontWeight: 600, fontSize: 15,
                  color: 'rgba(252,251,251,0.55)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 12, height: 46, padding: '0 20px',
                  cursor: 'pointer',
                  transition: 'color 250ms, border-color 250ms, background 250ms',
                }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { color: GOLD, borderColor: 'rgba(255,193,7,0.4)', background: 'rgba(255,255,255,0.04)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.55)', borderColor: 'rgba(255,255,255,0.18)', background: 'transparent' })}
                >
                  استكشف كل البرامج
                </button>
              </div>
            </div>

            {/* ── LEFT COLUMN: ياقوت card ── */}
            <div style={{
              background: 'rgba(255,255,255,0.035)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '2rem',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            }}>

              {/* Avatar with glow ring */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -6, borderRadius: '50%',
                  boxShadow: '0 0 36px 8px rgba(255,193,7,0.18)',
                  pointerEvents: 'none',
                }} />
                <img
                  src={consultantImg}
                  alt="ياقوت الخشاشنة — المستشارة التعليمية"
                  width={140}
                  height={140}
                  style={{
                    width: 140, height: 140, borderRadius: '50%',
                    objectFit: 'cover', objectPosition: 'center top',
                    border: '3px solid rgba(255,193,7,0.50)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.30)',
                    display: 'block',
                  }}
                />
              </div>

              {/* Name + title */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 19, color: 'rgba(252,251,251,0.95)' }}>
                  ياقوت الخشاشنة
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(252,251,251,0.52)', marginTop: 4 }}>
                  المستشارة التعليمية — كاسيت أكاديمي
                </div>
              </div>

              {/* Online status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 16px', borderRadius: 999,
                  background: 'rgba(15,23,42,0.55)',
                  border: '1px solid rgba(74,222,128,0.35)',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.9)',
                  }} />
                  <span style={{ fontWeight: 600, fontSize: 12, color: 'rgba(252,251,251,0.90)' }}>
                    متاحة للإجابة عن استفساراتك
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(252,251,251,0.38)', textAlign: 'center', lineHeight: 1.6 }}>
                  السبت – الخميس · 10:00 صباحاً – 8:00 مساءً
                </div>
              </div>
            </div>
          </div>

        </div>{/* end unified card */}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .consult-banner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
