import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@assets/logo_1785422080938.png';

interface Props {
  open: boolean;
  defaultMode?: 'login' | 'register';
  onClose: () => void;
}

export default function AuthModal({ open, defaultMode = 'login', onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPass, setShowPass] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(8,13,22,0.78)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            style={{
              position: 'fixed', zIndex: 1001,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(460px, calc(100vw - 32px))',
              background: 'rgba(20,28,44,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 24,
              boxShadow: '0 24px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,193,7,0.08)',
              padding: '32px 28px 28px',
              direction: 'rtl',
              overflowY: 'auto',
              maxHeight: 'calc(100dvh - 40px)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                position: 'absolute', top: 16, left: 16,
                width: 32, height: 32, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(252,251,251,0.60)',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 16, lineHeight: 1, transition: 'background .15s, color .15s',
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.12)', color: '#fff' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.06)', color: 'rgba(252,251,251,0.60)' })}
            >
              ✕
            </button>

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <img src={logo} alt="كاسيت أكاديمي" style={{ height: 48, objectFit: 'contain' }} />
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 4, marginBottom: 22,
              background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4,
            }}>
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '10px 0',
                    borderRadius: 9, border: 'none', cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
                    transition: 'background .2s, color .2s, box-shadow .2s',
                    background: mode === m ? '#FFC107' : 'transparent',
                    color: mode === m ? '#121927' : 'rgba(252,251,251,0.55)',
                    boxShadow: mode === m ? '0 2px 12px rgba(255,193,7,0.30)' : 'none',
                  }}
                >
                  {m === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </button>
              ))}
            </div>

            {/* Google button */}
            <button
              style={{
                width: '100%', padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, cursor: 'pointer',
                fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14,
                color: 'rgba(252,251,251,0.88)',
                transition: 'background .15s',
                marginBottom: 18,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
            >
              {/* Google SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              المتابعة باستخدام Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: 'rgba(252,251,251,0.38)' }}>
                أو عبر الإيميل
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
            </div>

            {/* Name fields (register only) */}
            {mode === 'register' && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {['الاسم الأول', 'الاسم الأخير'].map(ph => (
                  <input
                    key={ph}
                    type="text"
                    placeholder={ph}
                    style={{
                      flex: 1, padding: '12px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 10, outline: 'none',
                      fontFamily: 'Tajawal, sans-serif', fontSize: 13,
                      color: 'rgba(252,251,251,0.88)',
                      transition: 'border-color .15s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,0.50)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
                  />
                ))}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block', marginBottom: 6,
                fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 600,
                color: 'rgba(252,251,251,0.60)',
              }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 10, outline: 'none',
                  fontFamily: 'Tajawal, sans-serif', fontSize: 13,
                  color: 'rgba(252,251,251,0.88)',
                  transition: 'border-color .15s',
                  direction: 'ltr', textAlign: 'right',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,0.50)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: mode === 'login' ? 8 : 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{
                  fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 600,
                  color: 'rgba(252,251,251,0.60)',
                }}>
                  كلمة المرور
                </label>
                {mode === 'login' && (
                  <a href="#" style={{
                    fontFamily: 'Tajawal, sans-serif', fontSize: 12,
                    color: '#FFC107', textDecoration: 'none',
                  }}>
                    نسيت كلمة المرور؟
                  </a>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 14px', paddingLeft: 40,
                    boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 10, outline: 'none',
                    fontFamily: 'monospace', fontSize: 15, letterSpacing: '0.1em',
                    color: 'rgba(252,251,251,0.88)',
                    transition: 'border-color .15s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,0.50)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: 'rgba(252,251,251,0.40)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Phone (register only) */}
            {mode === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', marginBottom: 6,
                  fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 600,
                  color: 'rgba(252,251,251,0.60)',
                }}>
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  placeholder="+962 7X XXX XXXX"
                  style={{
                    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 10, outline: 'none',
                    fontFamily: 'Tajawal, sans-serif', fontSize: 13,
                    color: 'rgba(252,251,251,0.88)',
                    transition: 'border-color .15s',
                    direction: 'ltr', textAlign: 'right',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,0.50)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
                />
              </div>
            )}

            {/* Submit */}
            <button
              style={{
                width: '100%', padding: '14px',
                background: '#FFC107', color: '#121927',
                border: 'none', borderRadius: 12,
                fontFamily: 'Tajawal, sans-serif', fontWeight: 800, fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255,193,7,0.35)',
                transition: 'transform .15s, box-shadow .15s',
                marginBottom: 16,
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-1px)', boxShadow: '0 8px 28px rgba(255,193,7,0.45)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 4px 20px rgba(255,193,7,0.35)' })}
            >
              {mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
            </button>

            {/* Footer link */}
            <p style={{
              textAlign: 'center', margin: 0,
              fontFamily: 'Tajawal, sans-serif', fontSize: 13,
              color: 'rgba(252,251,251,0.42)',
            }}>
              {mode === 'login' ? (
                <>
                  ليس لديك حساب؟{' '}
                  <button
                    onClick={() => setMode('register')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFC107', fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 700, padding: 0 }}
                  >
                    إنشاء حساب
                  </button>
                </>
              ) : (
                <>
                  لديك حساب بالفعل؟{' '}
                  <button
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFC107', fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 700, padding: 0 }}
                  >
                    تسجيل الدخول
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
