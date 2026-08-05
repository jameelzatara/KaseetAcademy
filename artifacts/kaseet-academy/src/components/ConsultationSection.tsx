// ── Free Consultation Section — compact 2-column banner ──────
import consultantImg from '@assets/consultant_1785431795181.jpeg';

const GOLD = '#FFC107';

const BENEFITS = [
  'تقييم شامل لمستواك الصوتي والإعلامي',
  'ترشيح المسار والأستاذ الأنسب لأهدافك',
  'خطة عمل واضحة بدون أي التزام مالي',
];

const MICRO_STATS = [
  { value: '+600', label: 'متدرب' },
  { value: '100%', label: 'رضا المتدربين' },
  { value: '+40',  label: 'دفعة' },
];

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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
                محتار في اختيار المسار الأنسب{' '}
                <span style={{ color: GOLD }}>لصوتك؟</span>
              </h2>

              {/* Subtitle */}
              <p style={{
                margin: 0,
                fontSize: 'clamp(14px,1.6vw,17px)',
                fontWeight: 400,
                color: 'rgba(252,251,251,0.62)',
                lineHeight: 1.75,
              }}>
                تواصل مع المستشارة التعليمية لتحديد مستواك الحالي وبناء خطتك التدريبية المخصصة — بدون أي التزام.
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
                  href="https://wa.me/962771052222"
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
                  تواصل مع المستشارة عبر واتساب
                  <WhatsAppIcon />
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

            {/* ── LEFT COLUMN: Consultant card ── */}
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
                  alt="المستشارة التعليمية"
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
                <div style={{ fontWeight: 800, fontSize: 17, color: 'rgba(252,251,251,0.95)' }}>
                  المستشارة التعليمية
                </div>
                <div style={{ fontSize: 12, color: 'rgba(252,251,251,0.46)', marginTop: 4 }}>
                  أكاديمية كاسيت ميديا
                </div>
              </div>

              {/* Online status */}
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
                  متواجدة الآن للرد على استفساراتك
                </span>
              </div>

              {/* Micro stats */}
              <div style={{
                display: 'flex', gap: 0, width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, overflow: 'hidden',
              }}>
                {MICRO_STATS.map((s, i) => (
                  <div key={i} style={{
                    flex: 1, textAlign: 'center', padding: '10px 4px',
                    borderInlineStart: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  }}>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 16, color: GOLD, direction: 'ltr' }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(252,251,251,0.44)', marginTop: 2 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
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
