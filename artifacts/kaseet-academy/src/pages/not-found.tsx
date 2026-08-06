// ── 404 Not Found — Branded ─────────────────────────────────
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100dvh', background: '#0D0B14', direction: 'rtl', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main id="main" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 60px', textAlign: 'center',
      }}>
        {/* Gold 404 */}
        <div style={{
          fontFamily: 'Poppins, sans-serif', fontWeight: 900,
          fontSize: 'clamp(80px,14vw,140px)',
          color: '#FFC107', lineHeight: 1,
          opacity: 0.22, userSelect: 'none',
          letterSpacing: '-4px',
        }} aria-hidden="true">
          404
        </div>

        {/* Icon */}
        <div style={{ fontSize: 52, marginTop: -20 }}>🎙️</div>

        {/* Message */}
        <h1 style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 900,
          fontSize: 'clamp(22px,3.5vw,36px)',
          color: 'rgba(252,251,251,0.95)', margin: '20px 0 12px',
        }}>
          الصفحة التي تبحث عنها لم تُسجَّل!
        </h1>
        <p style={{
          fontFamily: 'Tajawal, sans-serif', fontWeight: 400,
          fontSize: 'clamp(14px,1.6vw,17px)',
          color: 'rgba(252,251,251,0.50)', maxWidth: 480,
          lineHeight: 1.8, margin: '0 0 40px',
        }}>
          يبدو أن هذه الصفحة غير موجودة أو تم نقلها. استعرض ماستركلاساتنا أدناه أو تواصل معنا.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700,
              fontSize: 15, padding: '12px 28px', borderRadius: 12,
              background: '#FFC107', color: '#121927',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(255,193,7,0.35)',
            }}
          >
            العودة إلى الرئيسية
          </Link>
          <Link
            href="/masterclass-voice"
            style={{
              display: 'inline-flex', alignItems: 'center',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
              fontSize: 15, padding: '12px 28px', borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(252,251,251,0.80)',
              textDecoration: 'none',
            }}
          >
            ماستركلاس الأداء الصوتي
          </Link>
          <Link
            href="/masterclass-elam"
            style={{
              display: 'inline-flex', alignItems: 'center',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 600,
              fontSize: 15, padding: '12px 28px', borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(252,251,251,0.80)',
              textDecoration: 'none',
            }}
          >
            ماستركلاس الإعلام
          </Link>
        </div>
      </main>
    </div>
  );
}
