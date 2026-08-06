import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import logo from '@assets/logo_1785422080938.png';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const ACCENT  = '#7B2D60';          // عنابي كاسيت
const GOLD    = '#FFC107';          // ذهبي كاسيت
const NAVY    = '#1A2537';          // كحلي الفاتح — صناديق التنقل
const NAVY2   = '#243047';          // كحلي أفتح — hover
const BASE    = import.meta.env.BASE_URL ?? '/';

/* ── Navigation sections ─────────────────────────────── */
const SECTIONS = [
  { id: 'courses',      label: 'الدورات',        icon: '🎓' },
  { id: 'tracks',       label: 'المسارات',        icon: '🎙️' },
  { id: 'reels',        label: 'قصص متدرّبينا',   icon: '▶️' },
  { id: 'testimonials', label: 'آراء الطلاب',     icon: '⭐' },
] as const;

/* ── Section nav helper ──────────────────────────────── */
function useNavToSection() {
  const [location, navigate] = useLocation();
  return (id: string, onClose: () => void) => {
    onClose();
    const isHome = location === '/' || location === '';
    if (isHome) {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  };
}

// ── Main ────────────────────────────────────────────────
export default function QuickMenu({ open, onClose, onOpenAuth }: Props) {
  const { user, logout } = useAuth();
  const navTo = useNavToSection();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qm-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 900,
              background: 'rgba(8,13,22,0.75)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Panel — centered via flexbox (framer y-anim doesn't break centering) */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 901,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
            padding: '20px 14px',
          }}>
          <motion.div
            key="qm-panel"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.94,    y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              pointerEvents: 'auto',
              width: 'min(420px, 100%)',
              background: '#fdf8f5',
              borderRadius: 28,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 24px 70px rgba(0,0,0,0.30)',
              padding: '26px 20px 22px',
              direction: 'rtl',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                position: 'absolute', top: 14, left: 14,
                width: 30, height: 30, borderRadius: 9,
                background: 'rgba(0,0,0,0.07)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6b7280', fontSize: 12, transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.13)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.07)')}
            >✕</button>

            {/* ── Logo + Brand ── */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <img src={logo} alt="كاسيت أكاديمي" style={{ height: 56, objectFit: 'contain', marginBottom: 6 }} />
              <p style={{
                margin: 0,
                fontFamily: 'Tajawal, sans-serif', fontSize: 12.5, fontWeight: 600,
                color: '#9ca3af', letterSpacing: '0.01em',
              }}>
                أكاديمية التدريب الصوتي والإعلامي الأولى في المنطقة
              </p>
              {/* Gold / maroon indicator dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 9 }}>
                <span style={{ width: 22, height: 4, borderRadius: 2, background: ACCENT }} />
                <span style={{ width: 8,  height: 4, borderRadius: 2, background: GOLD }} />
                <span style={{ width: 6,  height: 4, borderRadius: 2, background: '#e5e7eb' }} />
              </div>
            </div>

            {/* ── Section nav grid ── */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10, marginBottom: 18,
            }}>
              {SECTIONS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => navTo(id, onClose)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '13px 14px',
                    background: NAVY, border: 'none', borderRadius: 14,
                    cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
                    color: 'rgba(252,251,251,0.90)',
                    transition: 'background .15s, transform .12s',
                    textAlign: 'right',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: NAVY2, transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: NAVY, transform: 'none' })}
                >
                  <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* ── Voice test link ── */}
            <a
              href={`${BASE}voice-test.html`}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '11px',
                background: `${GOLD}18`,
                border: `1.5px solid ${GOLD}55`,
                borderRadius: 14, marginBottom: 18,
                fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
                color: '#92610a', textDecoration: 'none',
                transition: 'background .15s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}28`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${GOLD}18`)}
            >
              <span style={{ fontSize: 16 }}>🎤</span>
              سمّعنا صوتك مجاناً
            </a>

            {/* ── Divider ── */}
            <div style={{ height: 1, background: '#e5e7eb', marginBottom: 16 }} />

            {user ? (
              /* ── Logged in ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* User info card */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: NAVY, borderRadius: 14, padding: '14px',
                }}>
                  <span style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: ACCENT, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 17,
                  }}>
                    {user.firstName.charAt(0)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,0.95)' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 11.5, color: 'rgba(252,251,251,0.50)', direction: 'ltr', textAlign: 'right' }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)',
                    borderRadius: 14, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14, color: '#374151',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.10)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              /* ── Guest: Login + Register ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => { onClose(); setTimeout(() => onOpenAuth('login'), 60); }}
                  style={{
                    width: '100%', padding: '14px',
                    background: ACCENT, border: 'none',
                    borderRadius: 14, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 15.5, color: '#fff',
                    boxShadow: `0 4px 18px ${ACCENT}44`,
                    transition: 'background .15s, transform .12s',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#6a2553', transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: ACCENT, transform: 'none' })}
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => { onClose(); setTimeout(() => onOpenAuth('register'), 60); }}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'transparent',
                    border: `2px solid ${ACCENT}`,
                    borderRadius: 14, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 15.5, color: ACCENT,
                    transition: 'background .15s, transform .12s',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: `${ACCENT}0e`, transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'transparent', transform: 'none' })}
                >
                  إنشاء حساب
                </button>
              </div>
            )}
          </motion.div>
          </div>{/* /centering wrapper */}
        </>
      )}
    </AnimatePresence>
  );
}
