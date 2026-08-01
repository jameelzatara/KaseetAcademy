// ── Free Consultation Section ──────────────────────────────
import consultantImg from '@assets/consultant_1785431795181.jpeg';

const BENEFITS = [
  'تقييم شامل لمستواك الصوتي والإعلامي',
  'ترشيح المسار والأستاذ الأنسب لأهدافك',
  'خطة عمل واضحة بدون أي التزام مالي',
];

const MICRO_STATS = [
  { value: '+600', label: 'متدرب' },
  { value: '100%', label: 'رضا المتدربين' },
  { value: '+40', label: 'دفعة' },
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
    <section
      id="consultant"
      className="relative overflow-hidden"
      style={{
        background: 'transparent',
        padding: 'clamp(70px,9vh,110px) 0',
      }}
    >
      {/* Gold radial glow */}
      <div className="absolute pointer-events-none" style={{
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: 220,
        background: 'radial-gradient(ellipse at top, rgba(255,193,7,0.09) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 mx-auto px-4" style={{ maxWidth: 1160 }}>
        <div
          className="consultation-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: 'clamp(32px,5vw,72px)',
            alignItems: 'center',
            direction: 'rtl',
          }}
        >

          {/* ── RIGHT: Text column ── */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Badge */}
            <div style={{ alignSelf: 'flex-end' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '5px 16px', borderRadius: 99,
                background: 'rgba(74,222,128,0.10)',
                border: '1px solid rgba(74,222,128,0.28)',
                fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 13,
                color: '#4ade80',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
                  boxShadow: '0 0 8px rgba(74,222,128,0.8)', flexShrink: 0,
                  animation: 'consultPulse 2s infinite',
                }} />
                استشارة مجانية 100%
              </span>
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
              fontSize: 'clamp(22px,3.2vw,40px)',
              color: 'rgba(252,251,251,0.96)', lineHeight: 1.35, margin: 0,
            }}>
              محتار في اختيار المسار الأنسب{' '}
              <span style={{ color: '#FFC107' }}>لصوتك أو حضورك الإعلامي؟</span>
            </h2>

            {/* Description */}
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 'clamp(14px,1.4vw,16.5px)',
              color: 'rgba(226,232,240,0.75)', lineHeight: 1.85, margin: 0,
            }}>
              تواصل مع المستشارة التعليمية لتحديد مستواك الحالي وبناء خطتك التدريبية المخصصة — بدون أي التزام.
            </p>

            {/* Benefits */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BENEFITS.map((b, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                  <span style={{
                    fontFamily: 'Tajawal, sans-serif', fontSize: 'clamp(13.5px,1.3vw,15.5px)',
                    color: 'rgba(252,251,251,0.82)', fontWeight: 500,
                  }}>{b}</span>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFC107', fontSize: 12, fontWeight: 900,
                  }}>✓</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: 6 }}>
              <a
                href="https://wa.me/962771052222"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15,
                  padding: '14px 30px', borderRadius: 99,
                  background: '#065f46', color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(6,95,70,0.40)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s',
                }}
                onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                  transform: 'translateY(-2px)',
                  background: '#047857',
                  boxShadow: '0 8px 28px rgba(6,95,70,0.55)',
                })}
                onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                  transform: 'none',
                  background: '#065f46',
                  boxShadow: '0 4px 20px rgba(6,95,70,0.40)',
                })}
              >
                <WhatsAppIcon />
                تواصل مع المستشارة عبر واتساب
              </a>

              <button
                style={{
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
                  color: 'rgba(252,251,251,0.55)',
                  background: 'none', border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 99, padding: '14px 24px', cursor: 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { color: '#FFC107', borderColor: 'rgba(255,193,7,0.4)' })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { color: 'rgba(252,251,251,0.55)', borderColor: 'rgba(255,255,255,0.14)' })}
              >
                استكشف كل البرامج
              </button>
            </div>
          </div>

          {/* ── LEFT: Glass Counter-Box card ── */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.10)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            boxShadow: '0 8px 40px rgba(0,0,0,0.30)',
          }}>

            {/* Circular avatar with glow ring */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                background: 'transparent',
                boxShadow: '0 0 36px 8px rgba(255,193,7,0.20)',
                pointerEvents: 'none',
              }} />
              <img
                src={consultantImg}
                alt="المستشارة التعليمية"
                style={{
                  width: 180, height: 180,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  border: '3px solid rgba(255,193,7,0.50)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.30)',
                  display: 'block',
                }}
              />
            </div>

            {/* Name + title */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
                fontSize: 18, color: 'rgba(252,251,251,0.95)',
              }}>
                المستشارة التعليمية
              </div>
              <div style={{
                fontFamily: 'Tajawal, sans-serif', fontSize: 13,
                color: 'rgba(252,251,251,0.48)', marginTop: 4,
              }}>
                أكاديمية كاسيت ميديا
              </div>
            </div>

            {/* Online status */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 99,
              background: 'rgba(15,23,42,0.55)',
              border: '1px solid rgba(74,222,128,0.35)',
              backdropFilter: 'blur(6px)',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.9)',
              }} />
              <span style={{
                fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 12.5,
                color: 'rgba(252,251,251,0.90)',
              }}>
                متواجدة الآن للرد على استفساراتك
              </span>
            </div>

            {/* Micro stats */}
            <div style={{
              display: 'flex', gap: 0, width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              {MICRO_STATS.map((s, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '12px 6px',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                    fontSize: 17, color: '#FFC107', direction: 'ltr',
                  }}>{s.value}</div>
                  <div style={{
                    fontFamily: 'Tajawal, sans-serif', fontSize: 11,
                    color: 'rgba(252,251,251,0.45)', marginTop: 3,
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes consultPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.80); }
        }
        @media (max-width: 767px) {
          .consultation-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
