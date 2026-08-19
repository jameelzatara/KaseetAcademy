import { SignIn, SignUp } from '@clerk/react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import logo from '@assets/logo_1785422080938.png';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthScreenProps {
  mode: AuthMode;
  basePath: string;
}

const GOLD = '#FFC107';
const NAVY = '#1A2533';

const clerkAppearance = {
  options: {
    logoPlacement: 'inside' as const,
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
  variables: {
    colorPrimary: GOLD,
    colorForeground: '#FFFDF7',
    colorMutedForeground: '#B8C2CF',
    colorBackground: NAVY,
    colorInput: '#111D2B',
    colorInputForeground: '#FFFDF7',
    colorNeutral: 'rgba(255, 193, 7, .45)',
    colorDanger: '#FF9B91',
    fontFamily: 'Tajawal, sans-serif',
    borderRadius: '10px',
  },
  elements: {
    rootBox: { width: '100%' },
    cardBox: { width: '100%', background: 'transparent', boxShadow: 'none' },
    card: { width: '100%', background: 'transparent', boxShadow: 'none', border: 'none' },
    header: { display: 'none' },
    logoBox: { display: 'none' },
    socialButtonsBlockButton: {
      minHeight: '48px',
      background: '#FFFFFF',
      border: '1px solid rgba(255,255,255,.28)',
      borderRadius: '10px',
      boxShadow: 'none',
    },
    socialButtonsBlockButtonText: {
      color: NAVY,
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '14px',
      fontWeight: 800,
    },
    dividerLine: { background: 'rgba(255,255,255,.16)' },
    dividerText: {
      color: '#B8C2CF',
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '13px',
      fontWeight: 600,
    },
    formFieldLabel: {
      color: GOLD,
      fontFamily: 'Tajawal, sans-serif',
      fontWeight: 800,
      textAlign: 'right',
    },
    formFieldInput: {
      color: '#FFFDF7',
      background: '#111D2B',
      borderColor: 'rgba(255,193,7,.5)',
      fontFamily: 'Tajawal, sans-serif',
      textAlign: 'right',
      direction: 'rtl',
      minHeight: '46px',
      borderRadius: '10px',
    },
    formFieldInputShowPasswordButton: { color: GOLD },
    formFieldAction: {
      color: GOLD,
      fontFamily: 'Tajawal, sans-serif',
      fontWeight: 700,
    },
    formButtonPrimary: {
      color: NAVY,
      background: GOLD,
      fontFamily: 'Tajawal, sans-serif',
      fontWeight: 900,
      minHeight: '48px',
      borderRadius: '10px',
      boxShadow: 'none',
    },
    footer: {
      background: 'transparent',
      borderTop: '1px solid rgba(255,255,255,.14)',
      marginTop: '20px',
      paddingTop: '18px',
    },
    footerActionText: {
      color: '#B8C2CF',
      fontFamily: 'Tajawal, sans-serif',
    },
    footerActionLink: {
      color: GOLD,
      fontFamily: 'Tajawal, sans-serif',
      fontWeight: 800,
    },
    identityPreview: { background: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,193,7,.35)' },
    alert: { background: 'rgba(194,69,60,.15)', borderColor: 'rgba(255,140,128,.5)' },
    alertText: { color: '#FFFDF7', fontFamily: 'Tajawal, sans-serif' },
  },
};

function fullPath(basePath: string, path: string) {
  return `${basePath}${path}` || path;
}

export default function AuthScreen({ mode, basePath }: AuthScreenProps) {
  const [, setLocation] = useLocation();
  const signInPath = fullPath(basePath, '/sign-in');
  const signUpPath = fullPath(basePath, '/sign-up');

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLocation('/');
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [setLocation]);

  const close = () => setLocation('/');
  const switchMode = (nextMode: AuthMode) => setLocation(nextMode === 'sign-in' ? '/sign-in' : '/sign-up');

  return (
    <div className="ka-auth-overlay" dir="rtl" role="presentation" onMouseDown={close}>
      <section
        aria-label={mode === 'sign-in' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        className="ka-auth-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="ka-auth-close" onClick={close} aria-label="إغلاق نافذة الحساب">
          ×
        </button>

        <header className="ka-auth-brand">
          <img src={logo} alt="كاسيت أكاديمي" />
          <h1>تسجيل الدخول / حسابي</h1>
        </header>

        <div className="ka-auth-tabs" role="tablist" aria-label="اختيار طريقة الدخول">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-in'}
            className={mode === 'sign-in' ? 'is-active' : ''}
            onClick={() => switchMode('sign-in')}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-up'}
            className={mode === 'sign-up' ? 'is-active' : ''}
            onClick={() => switchMode('sign-up')}
          >
            إنشاء حساب
          </button>
        </div>

        <div className="ka-auth-clerk">
          {mode === 'sign-in' ? (
            <SignIn
              appearance={clerkAppearance}
              routing="path"
              path={signInPath}
              signUpUrl={signUpPath}
              fallbackRedirectUrl={basePath || '/'}
            />
          ) : (
            <SignUp
              appearance={clerkAppearance}
              routing="path"
              path={signUpPath}
              signInUrl={signInPath}
              fallbackRedirectUrl={basePath || '/'}
            />
          )}
        </div>
      </section>
    </div>
  );
}