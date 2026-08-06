import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@assets/logo_1785422080938.png';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  defaultMode?: 'login' | 'register';
  onClose: () => void;
}

const ACCENT = '#7B2D60';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
  background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 10,
  outline: 'none', fontFamily: 'Tajawal, sans-serif', fontSize: 14, color: '#1f2937',
  transition: 'border-color .15s', direction: 'rtl',
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{ ...inputStyle, ...style }}
      onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
      onBlur={e  => (e.currentTarget.style.borderColor  = '#e5e7eb')}
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

  const reset = () => { setError(''); setLoading(false); };

  const switchMode = (m: 'login' | 'register') => { setMode(m); reset(); };

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
          <motion.div
            key="am-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(8,13,22,0.72)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          <motion.div
            key="am-modal"
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{ opacity: 0, scale: 0.93,   y: 28 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', zIndex: 1001,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(480px, calc(100vw - 32px))',
              background: '#fdf8f5',
              borderRadius: 28,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 24px 80px rgba(0,0,0,0.22)',
              padding: '32px 28px 28px',
              direction: 'rtl',
              overflowY: 'auto',
              maxHeight: 'calc(100dvh - 40px)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="إغلاق"
              style={{
                position: 'absolute', top: 16, left: 16,
                width: 30, height: 30, borderRadius: '50%',
                border: '1.5px solid #e5e7eb', background: '#fff',
                color: '#6b7280', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, lineHeight: 1, transition: 'background .15s',
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { background: '#f3f4f6' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { background: '#fff' })}
            >✕</button>

            {/* Logo + subtitle */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <img src={logo} alt="كاسيت أكاديمي" style={{ height: 52, objectFit: 'contain', marginBottom: 8 }} />
              <p style={{ margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 500, color: '#6b7280' }}>
                أكاديمية التدريب الصوتي والإعلامي الأولى في المنطقة
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                <span style={{ width: 20, height: 5, borderRadius: 3, background: ACCENT }} />
                <span style={{ width: 7,  height: 5, borderRadius: 3, background: '#e5e7eb' }} />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: '#f3f4f6', borderRadius: 14, padding: 4 }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => switchMode(m)} style={{
                  flex: 1, padding: '11px 0',
                  borderRadius: 11, border: 'none', cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
                  transition: 'background .18s, color .18s',
                  background: mode === m ? ACCENT : 'transparent',
                  color:      mode === m ? '#fff'  : '#9ca3af',
                  boxShadow:  mode === m ? `0 2px 10px ${ACCENT}44` : 'none',
                }}>
                  {m === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </button>
              ))}
            </div>

            {/* Google */}
            <button style={{
              width: '100%', padding: '12px 16px', marginBottom: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12, cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 600, fontSize: 14, color: '#1f2937',
              transition: 'background .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
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
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: '#9ca3af' }}>أو عبر الإيميل</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {/* Register name fields */}
            {mode === 'register' && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <Input type="text" placeholder="الاسم الأول *" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ flex: 1 } as React.CSSProperties} />
                <Input type="text" placeholder="الاسم الأخير"  value={lastName}  onChange={e => setLastName(e.target.value)}  style={{ flex: 1 } as React.CSSProperties} />
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 5, fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 600, color: '#374151' }}>
                البريد الإلكتروني
              </label>
              <Input type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ direction: 'ltr', textAlign: 'right' } as React.CSSProperties} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 600, color: '#374151' }}>كلمة المرور</label>
                {mode === 'login' && (
                  <a href="#" style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 12, color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>
                    نسيت كلمة المرور؟
                  </a>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ paddingLeft: 42 } as React.CSSProperties} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: '#9ca3af', display: 'flex', alignItems: 'center',
                }} aria-label={showPass ? 'إخفاء' : 'إظهار'}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Phone (register) */}
            {mode === 'register' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 5, fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 600, color: '#374151' }}>رقم الجوال</label>
                <Input type="tel" placeholder="+962 7X XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)}
                  style={{ direction: 'ltr', textAlign: 'right' } as React.CSSProperties} />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{
                marginBottom: 14, padding: '10px 14px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
                fontFamily: 'Tajawal, sans-serif', fontSize: 13, color: '#dc2626',
                textAlign: 'right',
              }}>
                {error}
              </div>
            )}

            {/* Submit — Maroon accent */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#e5e7eb' : ACCENT,
                color: loading ? '#9ca3af' : '#fff',
                border: 'none', borderRadius: 12,
                fontFamily: 'Tajawal, sans-serif', fontWeight: 900, fontSize: 17,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 4px 18px ${ACCENT}55`,
                transition: 'transform .15s, box-shadow .15s, background .15s',
                marginBottom: 16,
              }}
              onMouseEnter={e => { if (!loading) Object.assign(e.currentTarget.style, { background: '#6a2553', transform: 'translateY(-1px)' }); }}
              onMouseLeave={e => { if (!loading) Object.assign(e.currentTarget.style, { background: ACCENT, transform: 'none' }); }}
            >
              {loading ? '...' : mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
            </button>

            {/* Footer */}
            <p style={{ textAlign: 'center', margin: 0, fontFamily: 'Tajawal, sans-serif', fontSize: 13, color: '#6b7280' }}>
              {mode === 'login' ? (
                <>ليس لديك حساب؟{' '}<button onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ACCENT, fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 700, padding: 0 }}>إنشاء حساب</button></>
              ) : (
                <>لديك حساب؟{' '}<button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ACCENT, fontFamily: 'Tajawal, sans-serif', fontSize: 13, fontWeight: 700, padding: 0 }}>تسجيل الدخول</button></>
              )}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
