import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@assets/logo_1785422080938.png';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  defaultMode?: 'login' | 'register';
  onClose: () => void;
}

const GOLD    = '#FFC107';
const GOLD_DK = '#8A6200'; // gold text on light — not used here (dark bg)
const F       = 'Tajawal, sans-serif';

// Input styled for dark card background
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        width: '100%', padding: '11px 14px', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.07)',
        border: '1.5px solid rgba(255,255,255,0.14)',
        borderRadius: 10,
        outline: 'none',
        fontFamily: F, fontSize: 14,
        color: '#E8EEF5',
        transition: 'border-color .15s',
        direction: 'rtl',
        ...style,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,0.55)')}
      onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
    />
  );
}

export default function AuthModal({ open, defaultMode = 'login', onClose }: Props) {
  const { login, register } = useAuth();
  const [mode,     setMode]     = useState<'login' | 'register'>(defaultMode);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Form state
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);

  const reset = () => { setError(''); setLoading(false); };
  const switchMode = (m: 'login' | 'register') => { setMode(m); reset(); };

  // Lock body scroll + Escape key close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // Auto-focus first input
    setTimeout(() => firstInputRef.current?.focus(), 80);

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Sync mode when prop changes
  useEffect(() => { setMode(defaultMode); reset(); }, [defaultMode]);

  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        if (!firstName.trim()) { setError('الاسم الأول مطلوب'); setLoading(false); return; }
        await register({ email: email.trim(), password, firstName: firstName.trim(), lastName, phone });
      }
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="am-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 99990,
              background: 'rgba(0,0,0,0.70)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}
          />

          {/* Centering wrapper */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99991,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 16px',
            pointerEvents: 'none',
          }}>
            <motion.div
              key="am-modal"
              role="dialog"
              aria-modal="true"
              aria-label={mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1,   y: 0 }}
              exit={{ opacity: 0, scale: 0.93,   y: 24 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                width: 'min(440px, 100%)',
                background: '#22303F',
                border: '1px solid rgba(255,193,7,0.28)',
                borderRadius: 22,
                boxShadow: '0 30px 80px rgba(0,0,0,.55)',
                padding: '36px 32px',
                textAlign: 'center',
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
                  position: 'absolute', top: 14, left: 14,
                  width: 32, height: 32, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer', fontSize: 16, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s, color .15s',
                }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,193,7,0.14)', color: GOLD })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' })}
              >✕</button>

              {/* Logo */}
              <img
                src={logo}
                alt="كاسيت أكاديمي"
                style={{ width: 96, objectFit: 'contain', margin: '0 auto 22px', display: 'block' }}
              />

              {/* Heading */}
              <h2 style={{
                fontFamily: F, fontWeight: 800, fontSize: 22,
                color: '#E8EEF5', margin: '0 0 8px',
              }}>
                {mode === 'login' ? 'أهلاً بعودتك' : 'أنشئ حسابك'}
              </h2>
              <p style={{
                fontFamily: F, fontSize: 14.5,
                color: '#9DA9BB', margin: '0 0 26px',
              }}>
                {mode === 'login'
                  ? 'سجّل دخولك لمتابعة برامجك وطلباتك'
                  : 'حساب واحد لكلّ برامجك وطلباتك ونتائج تقييمك الصوتي'}
              </p>

              {/* Tabs */}
              <div style={{
                display: 'flex', gap: 4, marginBottom: 24,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 14, padding: 4,
              }}>
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => switchMode(m)} style={{
                    flex: 1, padding: '11px 0',
                    borderRadius: 11, border: 'none', cursor: 'pointer',
                    fontFamily: F, fontWeight: 700, fontSize: 14,
                    transition: 'background .18s, color .18s, box-shadow .18s',
                    background: mode === m ? GOLD : 'transparent',
                    color:      mode === m ? '#121927' : '#9DA9BB',
                    boxShadow:  mode === m ? '0 2px 10px rgba(255,193,7,0.35)' : 'none',
                  }}>
                    {m === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                  </button>
                ))}
              </div>

              {/* Register name fields */}
              {mode === 'register' && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 14, textAlign: 'right' }}>
                  <Input
                    ref={firstInputRef as React.RefObject<HTMLInputElement>}
                    type="text" placeholder="الاسم الأول *"
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    style={{ flex: 1 } as React.CSSProperties}
                  />
                  <Input
                    type="text" placeholder="الاسم الأخير"
                    value={lastName}  onChange={e => setLastName(e.target.value)}
                    style={{ flex: 1 } as React.CSSProperties}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 12, textAlign: 'right' }}>
                <label style={{
                  display: 'block', marginBottom: 5,
                  fontFamily: F, fontSize: 13, fontWeight: 600, color: '#C7D1DF',
                }}>
                  البريد الإلكتروني
                </label>
                <Input
                  ref={mode === 'login' ? firstInputRef as React.RefObject<HTMLInputElement> : undefined}
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ direction: 'ltr', textAlign: 'right' } as React.CSSProperties}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 22, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#C7D1DF' }}>
                    كلمة المرور
                  </label>
                  {mode === 'login' && (
                    <a href="#" style={{
                      fontFamily: F, fontSize: 12, color: GOLD,
                      textDecoration: 'none', fontWeight: 600,
                    }}>
                      نسيت كلمة المرور؟
                    </a>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Input
                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    style={{ paddingLeft: 42 } as React.CSSProperties}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: '#7B879B', display: 'flex', alignItems: 'center',
                  }} aria-label={showPass ? 'إخفاء' : 'إظهار'}>
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Phone (register only) */}
              {mode === 'register' && (
                <div style={{ marginBottom: 22, textAlign: 'right' }}>
                  <label style={{
                    display: 'block', marginBottom: 5,
                    fontFamily: F, fontSize: 13, fontWeight: 600, color: '#C7D1DF',
                  }}>رقم الجوال</label>
                  <Input
                    type="tel" placeholder="+962 7X XXX XXXX"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    style={{ direction: 'ltr', textAlign: 'right' } as React.CSSProperties}
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  marginBottom: 16, padding: '10px 14px',
                  background: 'rgba(194,69,60,0.12)',
                  border: '1px solid rgba(194,69,60,0.35)',
                  borderRadius: 10,
                  fontFamily: F, fontSize: 13, color: '#f87171',
                  textAlign: 'right',
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? 'rgba(255,193,7,0.35)' : GOLD,
                  color: '#121927',
                  border: 'none', borderRadius: 12,
                  fontFamily: F, fontWeight: 900, fontSize: 17,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 18px rgba(255,193,7,0.35)',
                  transition: 'transform .15s, box-shadow .15s, background .15s',
                  marginBottom: 16,
                }}
                onMouseEnter={e => { if (!loading) Object.assign(e.currentTarget.style, { transform: 'translateY(-1px)', boxShadow: '0 8px 25px rgba(255,193,7,0.45)' }); }}
                onMouseLeave={e => { if (!loading) Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 4px 18px rgba(255,193,7,0.35)' }); }}
              >
                {loading ? '...' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
              </button>

              {/* Footer toggle */}
              <p style={{ textAlign: 'center', margin: 0, fontFamily: F, fontSize: 13, color: '#7B879B' }}>
                {mode === 'login' ? (
                  <>ليس لديك حساب؟{' '}
                    <button onClick={() => switchMode('register')} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: GOLD, fontFamily: F, fontSize: 13, fontWeight: 700, padding: 0,
                    }}>إنشاء حساب</button>
                  </>
                ) : (
                  <>لديك حساب؟{' '}
                    <button onClick={() => switchMode('login')} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: GOLD, fontFamily: F, fontSize: 13, fontWeight: 700, padding: 0,
                    }}>تسجيل الدخول</button>
                  </>
                )}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
