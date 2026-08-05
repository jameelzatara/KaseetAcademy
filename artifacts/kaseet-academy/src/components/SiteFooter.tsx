// ── Kaseet Academy Site Footer — Full Rebuild per Brief 2 ─────
import { useState, useEffect } from 'react';
import {
  Instagram, Facebook, Linkedin, Youtube, Music2,
  MessageCircle, ArrowLeft, MapPin, Phone, Mail,
  Clock, Star, ChevronUp,
} from 'lucide-react';
import { Link } from 'wouter';
import logoImg from '@assets/logo_1785422080938.png';

/* ── JSON-LD ────────────────────────────────── */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'كاسيت أكاديمي',
  alternateName: 'Kaseet Academy',
  url: 'https://kaseetmedia.com',
  description: 'الأكاديمية الأولى في الشرق الأوسط لتدريب الأداء الصوتي والتعليق والبودكاست والإعلام المرئي',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'عمّان',
    addressCountry: 'JO',
    streetAddress: 'استوديوهات كاسيت ميديا',
  },
  telephone: '+962771052222',
  email: 'info@kaseetmedia.com',
  sameAs: [
    'https://www.instagram.com/kaseetmedia/',
    'https://www.facebook.com/kaseetmedia',
    'https://jo.linkedin.com/company/kaseetmedia',
    'https://www.youtube.com/@Kaseetmedia',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '88',
    bestRating: '5',
  },
};

/* ── Constants ──────────────────────────────── */
const F    = 'Tajawal, sans-serif';
const GOLD = '#FFC107';
const T2   = 'rgba(203,213,225,0.60)';
const T3   = 'rgba(203,213,225,0.36)';

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/kaseetmedia/',         icon: <Instagram size={17}/> },
  { label: 'Facebook',  href: 'https://www.facebook.com/kaseetmedia',            icon: <Facebook  size={17}/> },
  { label: 'LinkedIn',  href: 'https://jo.linkedin.com/company/kaseetmedia',     icon: <Linkedin  size={17}/> },
  { label: 'YouTube',   href: 'https://www.youtube.com/@Kaseetmedia',            icon: <Youtube   size={17}/> },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@.kaseet',                 icon: <Music2    size={17}/> },
];

const NAV_LINKS = [
  { label: 'الرئيسية',            href: '/',            internal: true },
  { label: 'الدورات',             href: '/#courses',    internal: false },
  { label: 'المسارات',            href: '/#tracks',     internal: false },
  { label: 'المسار الإعلامي',     href: '/masar-elami', internal: true },
  { label: 'المسار الصوتي',       href: '/masar-soti',  internal: true },
  { label: 'ماستركلاس الخطابة',   href: '/masar-khataba', internal: true },
  { label: 'الاستشارة المجانية',  href: '/#consultant', internal: false },
  { label: 'سمّعنا صوتك',         href: `${import.meta.env.BASE_URL ?? '/'}voice-test.html`, internal: false },
];

const LEGAL_LINKS = [
  { label: 'سياسة الخصوصية',  href: '/privacy-policy' },
  { label: 'الشروط والأحكام', href: '/terms' },
  { label: 'سياسة الاسترداد', href: '/refund-policy' },
  { label: 'سياسة الكوكيز',   href: '/cookies' },
];

/* ── Component ──────────────────────────────── */
export default function SiteFooter() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const linkStyle: React.CSSProperties = {
    fontFamily: F, fontSize: 13.5, color: T2,
    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
    transition: 'color 0.2s',
  };
  const lEnter = (e: React.MouseEvent<HTMLAnchorElement>) =>
    Object.assign(e.currentTarget.style, { color: GOLD });
  const lLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
    Object.assign(e.currentTarget.style, { color: T2 });

  return (
    <>
      {/* ── JSON-LD structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <footer id="footer" dir="rtl" style={{ background: '#111925', borderTop: '1px solid rgba(255,193,7,0.14)' }}>

        {/* ── Conversion strip ── */}
        <div style={{
          background: 'rgba(0,0,0,0.38)', borderBottom: '1px solid rgba(255,193,7,0.10)',
          padding: '22px 24px',
        }}>
          <div style={{
            maxWidth: 1160, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 14,
          }}>
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: 'clamp(14px,1.6vw,17px)', color: 'rgba(255,255,255,0.88)', margin: 0 }}>
              ابدأ رحلتك الصوتية اليوم — انضم إلى أكثر من{' '}
              <span style={{ color: GOLD }}>٦٠٠ متدرب</span> احترافي
            </p>
            <a
              href="https://wa.me/962771052222"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: F, fontWeight: 700, fontSize: 13.5,
                padding: '10px 22px', borderRadius: 12,
                background: 'rgba(37,211,102,0.14)',
                border: '1px solid rgba(37,211,102,0.38)',
                color: '#4ade80', textDecoration: 'none', flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { background: 'rgba(37,211,102,0.24)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { background: 'rgba(37,211,102,0.14)' })}
            >
              <MessageCircle size={16}/>
              احجز مقعدك الآن
            </a>
          </div>
        </div>

        {/* ── Main 4-column grid ── */}
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '52px 24px 36px' }}>
          <div
            className="footer-4col"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr 1fr 1.15fr 1fr',
              gap: 'clamp(24px,4vw,52px)',
              marginBottom: 44,
            }}
          >

            {/* ── Col 1: Brand ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <img src={logoImg} alt="كاسيت أكاديمي" style={{ width: 58, height: 'auto', objectFit: 'contain' }}/>
              <p style={{ fontFamily: F, fontSize: 13.5, color: T2, lineHeight: 1.85, margin: 0, maxWidth: 260 }}>
                الأكاديمية الأولى في الشرق الأوسط لتدريب الأداء الصوتي، التعليق، البودكاست، والإعلام المرئي.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {SOCIAL.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                      color: T2, textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                      background: 'rgba(255,193,7,0.12)', borderColor: 'rgba(255,193,7,0.40)',
                      color: GOLD, boxShadow: '0 0 10px rgba(255,193,7,0.20)',
                    })}
                    onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
                      background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.09)',
                      color: T2, boxShadow: 'none',
                    })}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Google 5.0 chip */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 999, width: 'fit-content',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              }}>
                <Star size={12} fill={GOLD} color={GOLD}/>
                <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.82)', fontWeight: 700 }}>
                  Google — 5.0
                </span>
                <span style={{ fontFamily: F, fontSize: 11, color: T3 }}>· 88 تقييم</span>
              </div>
            </div>

            {/* ── Col 2: Quick links ── */}
            <div>
              <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: GOLD, margin: '0 0 18px', textAlign: 'right' }}>
                روابط سريعة
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.map(l => (
                  <li key={l.label}>
                    {l.internal ? (
                      <Link href={l.href} style={linkStyle} onMouseEnter={lEnter} onMouseLeave={lLeave}>
                        {l.label}
                        <ArrowLeft size={9} color="rgba(255,193,7,0.40)" style={{ marginInlineStart: 'auto', flexShrink: 0 }}/>
                      </Link>
                    ) : (
                      <a href={l.href} style={linkStyle} onMouseEnter={lEnter} onMouseLeave={lLeave}>
                        {l.label}
                        <ArrowLeft size={9} color="rgba(255,193,7,0.40)" style={{ marginInlineStart: 'auto', flexShrink: 0 }}/>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Contact ── */}
            <div>
              <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: GOLD, margin: '0 0 18px', textAlign: 'right' }}>
                تواصل معنا
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <MapPin size={14} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }}/>
                  <p style={{ fontFamily: F, fontSize: 13, color: T2, margin: 0, lineHeight: 1.65 }}>
                    عمّان، الأردن<br/>استوديوهات كاسيت ميديا
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Phone size={13} color={GOLD} style={{ flexShrink: 0 }}/>
                  <a href="tel:+962771052222"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12.5, color: T2, textDecoration: 'none', direction: 'ltr' }}>
                    +962 77 105 2222
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Mail size={13} color={GOLD} style={{ flexShrink: 0 }}/>
                  <a href="mailto:info@kaseetmedia.com"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: T2, textDecoration: 'none' }}>
                    info@kaseetmedia.com
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <Clock size={13} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }}/>
                  <p style={{ fontFamily: F, fontSize: 12, color: T3, margin: 0, lineHeight: 1.65 }}>
                    السبت – الخميس<br/>٩ صباحاً – ٩ مساءً
                  </p>
                </div>

                <a
                  href="https://wa.me/962771052222"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: F, fontWeight: 700, fontSize: 13,
                    padding: '9px 16px', borderRadius: 11,
                    background: 'rgba(37,211,102,0.10)',
                    border: '1px solid rgba(37,211,102,0.26)',
                    color: '#4ade80', textDecoration: 'none', width: 'fit-content',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { background: 'rgba(37,211,102,0.20)' })}
                  onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { background: 'rgba(37,211,102,0.10)' })}
                >
                  <MessageCircle size={15}/>
                  واتساب
                </a>
              </div>
            </div>

            {/* ── Col 4: Wajeez + Apply CTAs ── */}
            <div>
              <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: GOLD, margin: '0 0 18px', textAlign: 'right' }}>
                الاعتماد والتقديم
              </h4>

              {/* Wajeez badge */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,193,7,0.15)',
                borderRadius: 14, padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: 11,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'linear-gradient(135deg, #1A6B5A 0%, #25D366 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 14, color: '#fff',
                    flexShrink: 0,
                  }}>W</div>
                  <div>
                    <p style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.90)', margin: 0 }}>
                      معتمد من وجيز
                    </p>
                    <p style={{ fontFamily: F, fontSize: 11, color: T3, margin: '2px 0 0' }}>
                      أكبر منصة صوتية بالشرق الأوسط
                    </p>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }}/>

                <p style={{ fontFamily: F, fontSize: 12.5, color: T2, margin: 0, lineHeight: 1.65, textAlign: 'right' }}>
                  موهبة صوتية أو مدرب محترف؟
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <Link
                    href="/apply/voice-talent"
                    style={{
                      display: 'block', textAlign: 'center',
                      fontFamily: F, fontWeight: 700, fontSize: 12,
                      padding: '8px 12px', borderRadius: 9,
                      background: 'rgba(255,193,7,0.10)',
                      border: '1px solid rgba(255,193,7,0.28)',
                      color: GOLD, textDecoration: 'none', transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      Object.assign(e.currentTarget.style, { background: 'rgba(255,193,7,0.20)' })}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      Object.assign(e.currentTarget.style, { background: 'rgba(255,193,7,0.10)' })}
                  >
                    تقديم موهبة صوتية
                  </Link>
                  <Link
                    href="/apply/trainer"
                    style={{
                      display: 'block', textAlign: 'center',
                      fontFamily: F, fontWeight: 700, fontSize: 12,
                      padding: '8px 12px', borderRadius: 9,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'rgba(255,255,255,0.68)', textDecoration: 'none', transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.10)' })}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                      Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.05)' })}
                  >
                    تقديم مدرب
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,193,7,0.18) 50%, transparent)',
            marginBottom: 22,
          }}/>

          {/* ── Legal strip ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <p style={{ fontFamily: F, fontSize: 12, color: T3, margin: 0 }}>
              جميع الحقوق محفوظة © كاسيت ميديا {new Date().getFullYear()}
            </p>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              {LEGAL_LINKS.map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ fontFamily: F, fontSize: 11.5, color: T3, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    Object.assign(e.currentTarget.style, { color: 'rgba(255,255,255,0.62)' })}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    Object.assign(e.currentTarget.style, { color: T3 })}
                >
                  {l.label}
                </Link>
              ))}
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 10.5, color: 'rgba(255,255,255,0.18)', direction: 'ltr' }}>
                kaseetmedia.com
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Back-to-top button (46 px gold circle) ── */}
      {showTop && (
        <button
          onClick={toTop}
          aria-label="العودة إلى الأعلى"
          style={{
            position: 'fixed', bottom: 28, left: 28,
            width: 46, height: 46, borderRadius: '50%',
            background: GOLD, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 9999,
            boxShadow: '0 4px 20px rgba(255,193,7,0.45)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => Object.assign(e.currentTarget.style, {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 28px rgba(255,193,7,0.55)',
          })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {
            transform: 'translateY(0)',
            boxShadow: '0 4px 20px rgba(255,193,7,0.45)',
          })}
        >
          <ChevronUp size={22} color="#18202F" strokeWidth={2.5}/>
        </button>
      )}

      <style>{`
        @media (max-width: 767px) {
          .footer-4col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .footer-4col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
