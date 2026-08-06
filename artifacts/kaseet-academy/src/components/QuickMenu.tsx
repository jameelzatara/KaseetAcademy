import { motion, AnimatePresence } from 'framer-motion';
import logo from '@assets/logo_1785422080938.png';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const ACCENT = '#7B2D60';

// ── Main ────────────────────────────────────────────────
export default function QuickMenu({ open, onClose, onOpenAuth }: Props) {
  const { user, logout } = useAuth();

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
              background: 'rgba(8,13,22,0.70)',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Panel — centered */}
          <motion.div
            key="qm-panel"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.94,    y: 20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', zIndex: 901,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(400px, calc(100vw - 28px))',
              background: '#fdf8f5',
              borderRadius: 28,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 24px 70px rgba(0,0,0,0.28)',
              padding: '28px 22px 24px',
              direction: 'rtl',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                position: 'absolute', top: 16, left: 16,
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(0,0,0,0.08)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6b7280', fontSize: 13, transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            >✕</button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 4 }}>
              <img src={logo} alt="كاسيت أكاديمي" style={{ height: 50, objectFit: 'contain', marginBottom: 12 }} />
              <p style={{ margin: '0 0 4px', fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                الأكاديمية الصوتية الأولى في المنطقة
              </p>
              <h2 style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 21, fontWeight: 900, color: '#111827' }}>
                مسارك الصوتي يبدأ هنا
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                <span style={{ width: 22, height: 5, borderRadius: 3, background: ACCENT }} />
                <span style={{ width: 7,  height: 5, borderRadius: 3, background: '#e5e7eb' }} />
              </div>
            </div>

            {user ? (
              /* ── Logged in ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* User info card */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: '#fff', borderRadius: 16,
                  border: '1px solid #f3f4f6',
                  padding: '16px',
                }}>
                  <span style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: ACCENT, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 18,
                  }}>
                    {user.firstName.charAt(0)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15, color: '#111827' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: '#9ca3af', direction: 'ltr', textAlign: 'right' }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 14, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15, color: '#374151',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.09)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              /* ── Guest: Login + Register buttons ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => { onClose(); setTimeout(() => onOpenAuth('login'), 60); }}
                  style={{
                    width: '100%', padding: '15px',
                    background: ACCENT, border: 'none',
                    borderRadius: 14, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff',
                    boxShadow: `0 4px 18px ${ACCENT}44`,
                    transition: 'background .15s, transform .15s',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#6a2553', transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: ACCENT, transform: 'none' })}
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => { onClose(); setTimeout(() => onOpenAuth('register'), 60); }}
                  style={{
                    width: '100%', padding: '15px',
                    background: 'transparent',
                    border: `2px solid ${ACCENT}`,
                    borderRadius: 14, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 16, color: ACCENT,
                    transition: 'background .15s, transform .15s',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background: `${ACCENT}0e`, transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'transparent', transform: 'none' })}
                >
                  إنشاء حساب
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
