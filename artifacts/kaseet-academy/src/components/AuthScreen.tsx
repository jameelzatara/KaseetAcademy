import {
  AuthenticateWithRedirectCallback,
  useSignIn,
  useSignUp,
} from '@clerk/react';
import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import logo from '@assets/logo_1785422080938.png';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthScreenProps {
  mode: AuthMode;
  basePath: string;
}

function fullPath(basePath: string, path: string) {
  return `${basePath}${path}` || path;
}

function getErrorMessage(error: { message: string; longMessage?: string } | null) {
  return error?.longMessage || error?.message || 'تعذر إتمام العملية الآن. يرجى المحاولة مرة أخرى.';
}

function GoogleMark() {
  return (
    <svg className="ka-auth-google-mark" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#EA4335" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.61Z" />
      <path fill="#4285F4" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.7H.95v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.16.28-1.71V4.95H.95A9 9 0 0 0 0 9c0 1.45.35 2.82.95 4.05l3.01-2.34Z" />
      <path fill="#34A853" d="M9 3.58c1.32 0 2.5.45 3.43 1.33l2.57-2.57C13.47.91 11.43 0 9 0A9 9 0 0 0 .95 4.95l3.01 2.34C4.67 5.17 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export default function AuthScreen({ mode, basePath }: AuthScreenProps) {
  const [location, setLocation] = useLocation();
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const signInPath = fullPath(basePath, '/sign-in');
  const isSubmitting =
    signInFetchStatus === 'fetching' || signUpFetchStatus === 'fetching';
  const isOAuthCallback = location.includes('/sso-callback');

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

  useEffect(() => {
    setFeedback(null);
    setIsVerifyingEmail(false);
    setVerificationCode('');
  }, [mode]);

  const close = () => setLocation('/');
  const switchMode = (nextMode: AuthMode) =>
    setLocation(nextMode === 'sign-in' ? '/sign-in' : '/sign-up');

  const finishAuthentication = async (
    finalize: (params: {
      navigate: (options: { decorateUrl: (url: string) => string }) => void;
    }) => Promise<{ error: { message: string; longMessage?: string } | null }>,
  ) => {
    const result = await finalize({
      navigate: ({ decorateUrl }) => {
        const destination = decorateUrl(basePath || '/');
        if (destination.startsWith('http')) {
          window.location.assign(destination);
          return;
        }
        const relativeDestination =
          basePath && destination.startsWith(basePath)
            ? destination.slice(basePath.length) || '/'
            : destination;
        setLocation(relativeDestination);
      },
    });
    if (result.error) setFeedback(getErrorMessage(result.error));
  };

  const handleCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!emailAddress.trim() || !password) {
      setFeedback('أدخل البريد الإلكتروني وكلمة السر للمتابعة.');
      return;
    }

    if (mode === 'sign-in') {
      const result = await signIn.password({ emailAddress: emailAddress.trim(), password });
      if (result.error) {
        setFeedback(getErrorMessage(result.error));
        return;
      }
      if (signIn.status === 'complete') {
        await finishAuthentication(signIn.finalize);
        return;
      }
      setFeedback('تحتاج هذه المحاولة إلى خطوة أمان إضافية. جرّب تسجيل الدخول عبر Google أو أعد المحاولة.');
      return;
    }

    const result = await signUp.password({ emailAddress: emailAddress.trim(), password });
    if (result.error) {
      setFeedback(getErrorMessage(result.error));
      return;
    }
    if (signUp.status === 'complete') {
      await finishAuthentication(signUp.finalize);
      return;
    }

    const verificationResult = await signUp.verifications.sendEmailCode();
    if (verificationResult.error) {
      setFeedback(getErrorMessage(verificationResult.error));
      return;
    }
    setIsVerifyingEmail(true);
  };

  const handleEmailVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!verificationCode.trim()) {
      setFeedback('أدخل رمز التحقق المرسل إلى بريدك.');
      return;
    }

    const result = await signUp.verifications.verifyEmailCode({ code: verificationCode.trim() });
    if (result.error) {
      setFeedback(getErrorMessage(result.error));
      return;
    }
    if (signUp.status === 'complete') {
      await finishAuthentication(signUp.finalize);
      return;
    }
    setFeedback('لم يكتمل التحقق بعد. تأكد من الرمز وحاول مرة أخرى.');
  };

  const handleGoogle = async () => {
    setFeedback(null);
    const callbackUrl = `${window.location.origin}${signInPath}/sso-callback`;
    const completeUrl = `${window.location.origin}${basePath || '/'}`;
    const result = await signIn.sso({
      strategy: 'oauth_google',
      redirectUrl: callbackUrl,
      redirectCallbackUrl: completeUrl,
    });
    if (result.error) setFeedback(getErrorMessage(result.error));
  };

  if (isOAuthCallback) {
    return (
      <div className="ka-auth-overlay" dir="rtl">
        <section className="ka-auth-modal ka-auth-callback" aria-label="إتمام تسجيل الدخول">
          <AuthenticateWithRedirectCallback
            signInFallbackRedirectUrl={basePath || '/'}
            signUpFallbackRedirectUrl={basePath || '/'}
          />
          <p>جارٍ إتمام تسجيل الدخول…</p>
        </section>
      </div>
    );
  }

  const heading = isVerifyingEmail ? 'تحقق من بريدك الإلكتروني' : mode === 'sign-in' ? 'أهلاً بعودتك' : 'أنشئ حسابك';
  const submitLabel = isVerifyingEmail ? 'تأكيد الرمز' : mode === 'sign-in' ? 'تسجيل الدخول' : 'إنشاء الحساب';

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
          <h1>{heading}</h1>
          {!isVerifyingEmail && <p>سجّل دخولك أو أنشئ حساباً في أقل من دقيقة.</p>}
        </header>

        {!isVerifyingEmail && (
          <div className="ka-auth-tabs" role="tablist" aria-label="اختيار طريقة الدخول">
            <button type="button" role="tab" aria-selected={mode === 'sign-in'} className={mode === 'sign-in' ? 'is-active' : ''} onClick={() => switchMode('sign-in')}>
              تسجيل الدخول
            </button>
            <button type="button" role="tab" aria-selected={mode === 'sign-up'} className={mode === 'sign-up' ? 'is-active' : ''} onClick={() => switchMode('sign-up')}>
              إنشاء حساب
            </button>
          </div>
        )}

        {!isVerifyingEmail && (
          <>
            <button type="button" className="ka-auth-google" onClick={handleGoogle} disabled={isSubmitting}>
              <GoogleMark />
              <span>المتابعة مع Google</span>
            </button>
            <div className="ka-auth-divider"><span>أو بالبريد الإلكتروني</span></div>
          </>
        )}

        <form className="ka-auth-form" onSubmit={isVerifyingEmail ? handleEmailVerification : handleCredentials}>
          {isVerifyingEmail ? (
            <>
              <p className="ka-auth-verification-copy">أرسلنا رمزاً من ستة أرقام إلى <b>{emailAddress}</b>.</p>
              <label htmlFor="auth-verification-code">رمز التحقق</label>
              <input
                id="auth-verification-code"
                autoComplete="one-time-code"
                inputMode="numeric"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="000000"
                className="ka-auth-code-input"
              />
            </>
          ) : (
            <>
              <label htmlFor="auth-email">البريد الإلكتروني</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="name@example.com"
              />

              <label htmlFor="auth-password">كلمة السر</label>
              <div className="ka-auth-password-field">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                  dir="ltr"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="ثمانية أحرف على الأقل"
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </>
          )}

          {feedback && <p className="ka-auth-feedback" role="alert">{feedback}</p>}
          <button className="ka-auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle size={19} className="ka-auth-spinner" /> : submitLabel}
          </button>
        </form>

        {!isVerifyingEmail && (
          <p className="ka-auth-footer">
            {mode === 'sign-in' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button type="button" onClick={() => switchMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
              {mode === 'sign-in' ? 'أنشئ حساباً' : 'سجّل الدخول'}
            </button>
          </p>
        )}

        {mode === 'sign-up' && <div id="clerk-captcha" className="ka-auth-captcha" />}
      </section>
    </div>
  );
}