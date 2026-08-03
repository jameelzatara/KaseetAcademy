// ── Official Kaseet Media Footer ──────────────────────────
import { Instagram, Facebook, Linkedin, Youtube, Music2, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import logoImg from '@assets/logo_1785422080938.png';

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/kaseetmedia/?hl=ar',                     icon: <Instagram size={19} /> },
  { label: 'Facebook',  href: 'https://www.facebook.com/kaseetmedia?locale=ar_AR',                 icon: <Facebook  size={19} /> },
  { label: 'LinkedIn',  href: 'https://jo.linkedin.com/company/kaseetmedia',                        icon: <Linkedin  size={19} /> },
  { label: 'YouTube',   href: 'https://www.youtube.com/@Kaseetmedia',                               icon: <Youtube   size={19} /> },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@.kaseet?_r=1&_t=ZN-98TGBraBWEg',            icon: <Music2    size={19} /> },
];

const NAV_LINKS = [
  { label: 'الرئيسية',            href: '#' },
  { label: 'الدورات',             href: '#courses' },
  { label: 'المسارات الأكاديمية', href: '#tracks' },
  { label: 'المسار الإعلامي',     href: '/masar-elami' },
  { label: 'الاستشارة المجانية', href: '#consultant' },
  { label: 'آراء الطلاب',         href: '#testimonials' },
  { label: 'الأسئلة الشائعة',     href: '#faq' },
];


export default function SiteFooter() {
  return (
    <footer id="footer" style={{
      /* Semi-transparent so the global gradient shows through, but still distinguishes footer */
      background: 'rgba(10, 15, 28, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,193,7,0.14)',
      padding: '4rem 1.5rem 2rem',
      direction: 'rtl',
      textAlign: 'right',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'clamp(32px,5vw,64px)',
          marginBottom: 48,
        }} className="footer-grid">

          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <img src={logoImg} alt="كاسيت أكاديمي"
              style={{ width: 64, height: 'auto', objectFit: 'contain', display: 'block' }} />
            <p style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
              fontSize: 14, color: 'rgba(203,213,225,0.60)',
              lineHeight: 1.85, margin: 0, maxWidth: 280,
              textAlign: 'right',
            }}>
              كاسيت أكاديمي — الأكاديمية الأولى في الشرق الأوسط لتدريب الأداء الصوتي، التعليق، البودكاست، والإعلام المرئي.
            </p>

            {/* Social icons — RTL row flows right→left */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(203,213,225,0.55)',
                    textDecoration: 'none',
                    transition: 'background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                    background: 'rgba(255,193,7,0.12)',
                    borderColor: 'rgba(255,193,7,0.40)',
                    color: '#FFC107',
                    boxShadow: '0 0 12px rgba(255,193,7,0.22)',
                  })}
                  onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.09)',
                    color: 'rgba(203,213,225,0.55)',
                    boxShadow: 'none',
                  })}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
              fontSize: 15, color: '#FFC107', margin: '0 0 18px',
              textAlign: 'right',
            }}>
              روابط سريعة
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV_LINKS.map(l => {
                const linkStyle: React.CSSProperties = {
                  fontFamily: 'Tajawal, sans-serif', fontSize: 14,
                  color: 'rgba(203,213,225,0.55)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  display: 'flex', alignItems: 'center', gap: 6,
                };
                const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) =>
                  Object.assign(e.currentTarget.style, { color: '#FFC107' });
                const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
                  Object.assign(e.currentTarget.style, { color: 'rgba(203,213,225,0.55)' });
                const content = (
                  <>
                    {l.label}
                    <ArrowLeft size={10} color="rgba(255,193,7,0.50)" style={{ marginInlineStart: 'auto', flexShrink: 0 }} />
                  </>
                );
                return (
                  <li key={l.label}>
                    {l.href.startsWith('/') ? (
                      <Link href={l.href} style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                        {content}
                      </Link>
                    ) : (
                      <a href={l.href} style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                        {content}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 style={{
              fontFamily: 'Tajawal, sans-serif', fontWeight: 800,
              fontSize: 15, color: '#FFC107', margin: '0 0 18px',
              textAlign: 'right',
            }}>
              تواصل معنا
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>

              {/* WhatsApp CTA — label first (RIGHT in RTL), icon after (LEFT) */}
              <a
                href="https://wa.me/962771052222"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
                  padding: '12px 22px', borderRadius: 14,
                  background: 'rgba(37,211,102,0.13)',
                  border: '1px solid rgba(37,211,102,0.32)',
                  color: '#4ade80',
                  textDecoration: 'none',
                  transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                  width: 'fit-content',
                  boxShadow: '0 2px 12px rgba(37,211,102,0.10)',
                  direction: 'rtl',
                }}
                onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                  background: 'rgba(37,211,102,0.22)',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.28)',
                  transform: 'translateY(-1px)',
                })}
                onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                  background: 'rgba(37,211,102,0.13)',
                  boxShadow: '0 2px 12px rgba(37,211,102,0.10)',
                  transform: 'none',
                })}
              >
                <span>واتساب — تواصل معنا</span>
                <MessageCircle size={18} style={{ flexShrink: 0 }} />
              </a>

              <p style={{
                fontFamily: 'Tajawal, sans-serif', fontSize: 13,
                color: 'rgba(203,213,225,0.45)', margin: 0, lineHeight: 1.7,
                textAlign: 'right',
              }}>
                عمّان، الأردن<br />
                استوديوهات كاسيت ميديا
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,193,7,0.18) 50%, transparent 100%)',
          marginBottom: 24,
        }} />

        {/* Copyright bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{
            fontFamily: 'Tajawal, sans-serif', fontSize: 13,
            color: 'rgba(203,213,225,0.35)', margin: 0,
            textAlign: 'right',
          }}>
            جميع الحقوق محفوظة © كاسيت ميديا 2026
          </p>
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 11,
            color: 'rgba(203,213,225,0.25)', margin: 0, direction: 'ltr',
          }}>
            kaseetmedia.com
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
