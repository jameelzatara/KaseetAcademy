import { Link } from 'wouter';

/** Fixed floating "← الرئيسية" button shown on all sub-pages */
export default function BackButton() {
  return (
    <Link href="/">
      <a
        onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        style={{
          position: 'fixed', bottom: 28, left: 22, zIndex: 200,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 999,
          background: 'rgba(18,26,46,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,193,7,0.30)',
          color: '#FFC107',
          textDecoration: 'none',
          fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 14,
          boxShadow: '0 4px 20px rgba(0,0,0,0.40)',
          transition: 'transform .15s, box-shadow .15s',
          direction: 'rtl', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
          transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(0,0,0,0.50)',
        })}
        onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, {
          transform: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.40)',
        })}
      >
        {/* Home icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        الرئيسية
      </a>
    </Link>
  );
}
