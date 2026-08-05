import { useEffect } from 'react';

/**
 * سمّعنا صوتك — صفحة التقييم الصوتي المجاني
 * تُعيد التوجيه إلى الصفحة المستقلّة المبنيّة بـ HTML+CSS+JS خالص.
 */
export default function VoiceTestPage() {
  useEffect(() => {
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    window.location.replace(base + '/voice-test.html');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#1A2533',
        color: '#C7D1DF',
        fontFamily: "'Tajawal', system-ui, sans-serif",
        fontSize: 18,
        gap: 14,
        direction: 'rtl',
      }}
    >
      {/* مؤشّر تحميل بسيط */}
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '3px solid rgba(255,193,7,.25)',
          borderTopColor: '#FFC107',
          display: 'inline-block',
          animation: 'spin .8s linear infinite',
        }}
      />
      جارٍ فتح الاستوديو التفاعلي…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
