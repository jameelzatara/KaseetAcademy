// ── Kaseet Academy Site Footer ─────────────────────────────
import { useState, useEffect } from 'react';
import {
  Instagram, Facebook, Linkedin, Youtube, Music2,
  MessageCircle, MapPin, Phone, Mail,
  Clock, ChevronUp,
} from 'lucide-react';
import { Link } from 'wouter';
import logoImg    from '@assets/logo_1785422080938.png';
import wajeezLogo from '@assets/wajeez-logo_1785422080937.png';

/* ── JSON-LD — EducationalOrganization (no aggregateRating) ── */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'كاسيت أكاديمي',
  alternateName: 'Kaseet Academy',
  url: 'https://kaseet.com',
  description: 'الأكاديمية الأولى في الشرق الأوسط لتدريب الأداء الصوتي والتعليق والبودكاست والإعلام المرئي',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'عمّان',
    addressCountry: 'JO',
    streetAddress: 'شارع باريس، مجمع حجازي البيّر، شارع عبد الرحيم الحاج محمد 67',
  },
  telephone: '+962790234483',
  email: 'info@kaseet.com',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'],
      opens: '10:00',
      closes: '20:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/kaseetmedia/',
    'https://www.facebook.com/kaseetmedia',
    'https://jo.linkedin.com/company/kaseetmedia',
    'https://www.youtube.com/@Kaseetmedia',
  ],
};

/* ── Constants ── */
const F    = 'Tajawal, sans-serif';
const GOLD = '#FFC107';
const T2   = 'rgba(203,213,225,0.60)';
const T3   = 'rgba(203,213,225,0.36)';

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/kaseetmedia/',     icon: <Instagram size={17}/> },
  { label: 'Facebook',  href: 'https://www.facebook.com/kaseetmedia',        icon: <Facebook  size={17}/> },
  { label: 'LinkedIn',  href: 'https://jo.linkedin.com/company/kaseetmedia', icon: <Linkedin  size={17}/> },
  { label: 'YouTube',   href: 'https://www.youtube.com/@Kaseetmedia',        icon: <Youtube   size={17}/> },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@.kaseet',             icon: <Music2    size={17}/> },
];

interface NavLink { label: string; href: string; internal: boolean; gold?: boolean; }

const NAV_LINKS: NavLink[] = [
  { label: 'الرئيسية',                              href: '/',                  internal: true },
  { label: 'الدورات',                               href: '/#courses',          internal: false },
  { label: 'ماستركلاس الإعلام',                     href: '/masterclass-elam',  internal: true },
  { label: 'ماستركلاس التعليق والأداء الصوتي',      href: '/masterclass-voice', internal: true },
  { label: 'ماستركلاس الخطابة والتواصل القيادي',    href: '/masterclass-khataba', internal: true },
  { label: 'المدرّبون',                              href: '/trainers',          internal: true },
  { label: 'الأحداث',                               href: '/events',            internal: true },
  { label: 'المدوّنة والأدلة',                      href: '/blog',              internal: true },
  { label: 'الاستشارة المجانية',                    href: '/#consultant',       internal: false },
  { label: 'سمّعنا صوتك',  href: `${import.meta.env.BASE_URL ?? '/'}voice-test.html`, internal: false, gold: true },
];

const LEGAL_LINKS = [
  { label: 'سياسة الخصوصية',  href: '/privacy-policy' },
  { label: 'الشروط والأحكام', href: '/terms' },
  { label: 'سياسة الاسترداد', href: '/refund-policy' },
];

const MAPS_URL = 'https://maps.app.goo.gl/WmBQBMA6f3nbb6gn7';

export default function SiteFooter() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const baseLinkStyle: React.CSSProperties = {
    fontFamily: F, fontSize: 13.5, color: T2,
    textDecoration: 'none', display: 'block',
    transition: 'color 0.2s',
  };
  const goldLinkStyle: React.CSSProperties = {
    ...baseLinkStyle,
    color: GOLD, fontWeight: 700,
  };
  const lEnter = (e: React.MouseEvent<HTMLAnchorElement>) =>
    Object.assign(e.currentTarget.style, { color: GOLD });
  const lLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
    Object.assign(e.currentTarget.style, { color: T2 });
  const goldLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
    Object.assign(e.currentTarget.style, { color: GOLD });

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <footer id="footer" dir="rtl" style={{ background: '#111925', borderTop: '1px solid rgba(255,193,7,0.14)' }}>

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
              <img src={logoImg} alt="كاسيت أكاديمي" width={58} style={{ width: 58, height: 'auto', objectFit: 'contain' }}/>
              <p style={{ fontFamily: F, fontSize: 13.5, color: T2, lineHeight: 1.85, margin: 0, maxWidth: 260 }}>
                الأكاديمية الأولى في الشرق الأوسط لتدريب الأداء الصوتي، التعليق، البودكاست، والإعلام المرئي.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {SOCIAL.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label={s.label}
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
                      <Link
                        href={l.href}
                        style={l.gold ? goldLinkStyle : baseLinkStyle}
                        onMouseEnter={l.gold ? undefined : lEnter}
                        onMouseLeave={l.gold ? goldLeave : lLeave}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        style={l.gold ? goldLinkStyle : baseLinkStyle}
                        onMouseEnter={l.gold ? undefined : lEnter}
                        onMouseLeave={l.gold ? goldLeave : lLeave}
                      >
                        {l.label}
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

                {/* Address — clickable, full address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <MapPin size={14} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }}/>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: F, fontSize: 13, color: T2, lineHeight: 1.65, textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { color: GOLD })}
                    onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { color: T2 })}
                  >
                    استوديو كاسيت<br/>
                    شارع باريس، مجمع حجازي البيّر<br/>
                    عمّان، الأردن
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Phone size={13} color={GOLD} style={{ flexShrink: 0 }}/>
                  <a href="tel:+96279023483"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12.5, color: T2, textDecoration: 'none', direction: 'ltr' }}>
                    +962 79 023 4483
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Mail size={13} color={GOLD} style={{ flexShrink: 0 }}/>
                  <a href="mailto:info@kaseet.com"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: T2, textDecoration: 'none' }}>
                    info@kaseet.com
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <Clock size={13} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }}/>
                  <p style={{ fontFamily: F, fontSize: 12, color: T3, margin: 0, lineHeight: 1.75 }}>
                    السبت – الخميس<br/>
                    10:00 صباحاً – 8:00 مساءً<br/>
                    <span style={{ color: 'rgba(203,213,225,0.28)' }}>الجمعة مغلق</span><br/>
                    <span style={{ fontSize: 10.5, color: 'rgba(203,213,225,0.22)', display: 'block', marginTop: 3 }}>
                      جلسات الدورات تُعقد وفق جدول كلّ دفعة، وقد تشمل الجمعة.
                    </span>
                  </p>
                </div>

                <a
                  href="https://wa.me/962771052222?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D9%83%D8%A7%D8%B3%D9%8A%D8%AA%20%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A"
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

              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,193,7,0.15)',
                borderRadius: 14, padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: 11,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: 'block' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <img src={wajeezLogo} alt="وجيز" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    </div>
                  </a>
                  <div>
                    <p style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.90)', margin: 0 }}>
                      <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        شهادة معتمدة من تطبيق وجيز
                      </a>
                    </p>
                    <p style={{ fontFamily: F, fontSize: 11, color: T3, margin: '2px 0 0' }}>
                      أكبر منصّة صوتية في الشرق الأوسط
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
              © 2026 بيركلي للصوتيات المسموعة — جميع الحقوق محفوظة
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
                kaseet.com
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Back-to-top button ── */}
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
            transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(255,193,7,0.55)',
          })}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {
            transform: 'translateY(0)', boxShadow: '0 4px 20px rgba(255,193,7,0.45)',
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
