import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@assets/logo_1785422080938.png';
import { useCurrency } from '../context/CurrencyContext';
import { CURRENCY_LIST, CURRENCY_SYMBOLS, CURRENCY_NAMES } from '../data/currency';
import AuthModal from './AuthModal';
import QuickMenu from './QuickMenu';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [solid,        setSolid]        = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [showMenu,     setShowMenu]     = useState(false);
  const [showAuth,     setShowAuth]     = useState(false);
  const [authMode,     setAuthMode]     = useState<'login' | 'register'>('login');
  const { currency, setCurrency } = useCurrency();
  const { user } = useAuth();
  const dropRef  = useRef<HTMLDivElement>(null);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowMenu(false);
    setShowAuth(true);
  };

  // ── Solid nav: always solid on non-hero pages; follows scroll on hero page ──
  useEffect(() => {
    const hero = document.querySelector('.sec--hero');
    if (!hero) {
      setSolid(true);   // sub-pages have no hero — always solid
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // ── Close currency dropdown on outside click ───────────────
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (showCurrency && dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowCurrency(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showCurrency]);

  return (
    <>
      {/* Skip-to-content link */}
      <a
        href="#main"
        style={{
          position: 'absolute', top: -60, left: 8, zIndex: 9999,
          background: '#FFC107', color: '#121927',
          padding: '8px 16px', borderRadius: 8,
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
          textDecoration: 'none', transition: 'top .2s',
        }}
        onFocus={e => (e.currentTarget.style.top = '8px')}
        onBlur={e  => (e.currentTarget.style.top = '-60px')}
      >
        تجاوز إلى المحتوى
      </a>

      <header
        className={`nav${solid ? ' is-solid' : ''}`}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 9999, height: solid ? 62 : 72,
          background: solid ? 'rgba(26,37,51,.92)' : 'transparent',
          backdropFilter: solid ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(10px)' : 'none',
          borderBottom: `1px solid ${solid ? 'rgba(255,193,7,0.18)' : 'transparent'}`,
          boxShadow: solid ? '0 8px 30px rgba(0,0,0,.32)' : 'none',
          transition: 'background .28s ease, border-color .28s ease, height .28s ease, box-shadow .28s ease',
          padding: '0 clamp(16px,3vw,40px)',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo — right (RTL start) */}
          <div style={{ flexShrink: 0 }}>
            <img src={logo} alt="كاسيت أكاديمي" style={{ height: 46, width: 'auto', objectFit: 'contain' }} />
          </div>

          {/* Actions — left (RTL end) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,1.5vw,20px)' }}>

            {/* CTA */}
            <motion.a
              href={`${import.meta.env.BASE_URL}voice-test.html`}
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(255,193,7,0.40)' }}
              whileTap={{ y: 0 }}
              style={{
                background: '#FFC107', color: '#121927',
                fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
                padding: '10px clamp(16px,2vw,28px)', borderRadius: 999,
                fontSize: 'clamp(13px,1.2vw,15px)',
                textDecoration: 'none', display: 'inline-block',
              }}
            >
              سمّعنا صوتك
            </motion.a>

            {/* Currency pill */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCurrency(v => !v)}
                style={{
                  display: 'none',
                  alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 999, padding: '7px 14px',
                  color: 'rgba(252,251,251,0.86)',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', transition: 'background .2s',
                }}
                className="currency-pill-btn"
              >
                {CURRENCY_SYMBOLS[currency]} {currency}
                <span style={{ fontSize: 9, opacity: 0.6, marginInlineStart: 2 }}>▾</span>
              </button>

              <AnimatePresence>
                {showCurrency && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                      background: '#1e2d42', border: '1px solid rgba(255,193,7,0.18)',
                      borderRadius: 14, overflow: 'hidden',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
                      minWidth: 210, zIndex: 9999,
                      direction: 'rtl',
                    }}
                  >
                    {CURRENCY_LIST.map(c => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setShowCurrency(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '10px 16px',
                          background: c === currency ? 'rgba(255,193,7,0.10)' : 'transparent',
                          border: 'none', cursor: 'pointer',
                          color: c === currency ? '#FFC107' : 'rgba(252,251,251,0.78)',
                          fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: c === currency ? 700 : 500,
                          transition: 'background .15s',
                          textAlign: 'right',
                        }}
                        onMouseEnter={e => { if (c !== currency) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { if (c !== currency) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, opacity: 0.7 }}>
                          {CURRENCY_SYMBOLS[c]} {c}
                        </span>
                        <span>{CURRENCY_NAMES[c]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger — opens QuickMenu overlay */}
            <button
              aria-label="القائمة"
              aria-expanded={showMenu}
              onClick={() => setShowMenu(v => !v)}
              className="glass-panel"
              style={{
                width: 48, height: 48, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 5,
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.10)',
                cursor: 'pointer', background: 'rgba(255,255,255,0.04)',
                transition: 'background .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(44,55,75,.95)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              {/* Show initials when logged in, bars when not */}
              {user ? (
                <span style={{
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15,
                  color: '#FFC107', lineHeight: 1,
                }}>
                  {user.firstName.charAt(0)}
                </span>
              ) : (
                <>
                  <span style={{ width: 20, height: 2, background: '#FFC107', borderRadius: 2, display: 'block' }} />
                  <span style={{ width: 20, height: 2, background: '#FFC107', borderRadius: 2, display: 'block' }} />
                  <span style={{ width: 20, height: 2, background: '#FFC107', borderRadius: 2, display: 'block' }} />
                </>
              )}
            </button>

          </div>
        </div>
      </header>

      <style>{`
        @media (min-width: 768px) {
          .currency-pill-btn { display: inline-flex !important; }
        }
      `}</style>

      {/* Quick Menu — centered overlay panel */}
      <QuickMenu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        onOpenAuth={openAuth}
      />

      {/* Auth Modal */}
      <AuthModal
        open={showAuth}
        defaultMode={authMode}
        onClose={() => setShowAuth(false)}
      />
    </>
  );
}
