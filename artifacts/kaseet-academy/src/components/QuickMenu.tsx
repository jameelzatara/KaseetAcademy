import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import logo from '@assets/logo_1785422080938.png';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const ACCENT  = '#7B2D60';
const YELLOW  = '#FFC107';

// ── Row ─────────────────────────────────────────────────
function Row({
  icon, label, sub, onClick, accent,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
  accent?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', padding: '14px 16px',
        background: hov ? 'rgba(0,0,0,0.04)' : 'transparent',
        border: 'none', cursor: 'pointer',
        borderRadius: 12, transition: 'background .15s',
        direction: 'rtl', textAlign: 'right',
      }}
    >
      {/* Icon badge */}
      <span style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: accent ? `${ACCENT}18` : 'rgba(0,0,0,0.07)',
      }}>
        {icon}
      </span>
      {/* Label */}
      <span style={{ flex: 1 }}>
        <span style={{
          display: 'block',
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15,
          color: accent ? ACCENT : '#1f2937',
        }}>
          {label}
        </span>
        {sub && (
          <span style={{ display: 'block', fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: '#9ca3af', marginTop: 1 }}>
            {sub}
          </span>
        )}
      </span>
      {/* Chevron */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={accent ? ACCENT : '#9ca3af'} strokeWidth="2.5" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

// ── SearchBar ───────────────────────────────────────────
function SearchBar({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [,go] = useLocation();
  const submit = () => {
    if (q.trim()) { go(`/courses?q=${encodeURIComponent(q.trim())}`); onClose(); }
  };
  return (
    <div style={{ position: 'relative', marginBottom: 18 }}>
      <input
        type="text"
        placeholder="ابحث عن دورة، مسار، أو مدرّب..."
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '13px 48px 13px 44px',
          background: '#fff',
          border: '1.5px solid #e5e7eb',
          borderRadius: 14, outline: 'none',
          fontFamily: 'Tajawal, sans-serif', fontSize: 14, color: '#374151',
          direction: 'rtl',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        onFocus={e  => (e.currentTarget.style.borderColor = ACCENT)}
        onBlur={e   => (e.currentTarget.style.borderColor = '#e5e7eb')}
      />
      {/* Search icon */}
      <span style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      {/* Clear / submit */}
      {q && (
        <button onClick={submit}
          style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            background: ACCENT, border: 'none', borderRadius: 8, cursor: 'pointer',
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────
export default function QuickMenu({ open, onClose, onOpenAuth }: Props) {
  const { user, logout } = useAuth();
  const [,go] = useLocation();

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
              background: 'rgba(8,13,22,0.68)',
              backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="qm-panel"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{ opacity: 0, scale: 0.93,   y: 24 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', zIndex: 901,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(440px, calc(100vw - 28px))',
              background: '#fdf8f5',
              borderRadius: 28,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 28px 80px rgba(0,0,0,0.26)',
              padding: '22px 20px 20px',
              direction: 'rtl',
              overflowY: 'auto',
              maxHeight: 'calc(100dvh - 40px)',
            }}
          >
            {/* Close X */}
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
            >
              ✕
            </button>

            {/* Header: logo + subtitle + heading */}
            <div style={{ textAlign: 'center', marginBottom: 22, paddingTop: 4 }}>
              <img src={logo} alt="كاسيت أكاديمي" style={{ height: 48, objectFit: 'contain', marginBottom: 10 }} />
              <p style={{ margin: '0 0 6px', fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                الأكاديمية الصوتية الأولى في المنطقة
              </p>
              <h2 style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 22, fontWeight: 900, color: '#111827', lineHeight: 1.3 }}>
                مسارك الصوتي يبدأ هنا
              </h2>
              {/* Dot indicator */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                <span style={{ width: 22, height: 5, borderRadius: 3, background: ACCENT }} />
                <span style={{ width: 7,  height: 5, borderRadius: 3, background: '#e5e7eb' }} />
              </div>
            </div>

            {/* Search */}
            <SearchBar onClose={onClose} />

            {/* Menu rows */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid #f3f4f6',
              overflow: 'hidden', marginBottom: 12,
            }}>
              {user ? (
                <>
                  {/* Logged in: user profile row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    borderBottom: '1px solid #f3f4f6',
                  }}>
                    {/* Avatar */}
                    <span style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: ACCENT, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 16,
                    }}>
                      {user.firstName.charAt(0)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14, color: '#111827' }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: '#9ca3af', direction: 'ltr', textAlign: 'right' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Row
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
                    label="تسجيل الخروج"
                    onClick={handleLogout}
                  />
                </>
              ) : (
                <Row
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}
                  label="دخول | تسجيل"
                  sub="سجّل الدخول لمتابعة دوراتك"
                  onClick={() => { onClose(); setTimeout(() => onOpenAuth('login'), 60); }}
                  accent
                />
              )}

              {/* Divider */}
              <div style={{ height: 1, background: '#f3f4f6', margin: '0 16px' }} />

              <Row
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="التقويم التدريبي"
                sub="جدول الدورات والمواعيد"
                onClick={() => { go('/courses'); onClose(); }}
              />
            </div>

            {/* Footer preferences */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid #f3f4f6',
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Settings gear */}
                <button style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.11)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </button>
                {/* Gold shield */}
                <button style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${YELLOW}20`, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${YELLOW}38`)}
                  onMouseLeave={e => (e.currentTarget.style.background = `${YELLOW}20`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={YELLOW} stroke={YELLOW} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </button>
              </div>
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 14, fontWeight: 600, color: '#6b7280' }}>
                التفضيلات
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
