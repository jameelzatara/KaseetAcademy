// ── ShareModal — مشاركة الدورة أو الماستركلاس ───────────────
import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

const GOLD = '#FFC107';
const F = 'Tajawal, sans-serif';

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#ig-grad)">
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function ShareModal({ open, onClose, title, description }: Props) {
  const [copied, setCopied] = useState(false);
  const [toast,  setToast]  = useState('');

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const url   = window.location.href;
  const text  = `${title}${description ? ' — ' + description : ''}\n${url}`;

  const handleCopy = async (showLabel?: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setToast(showLabel ?? 'تم نسخ الرابط ✓');
      setTimeout(() => { setCopied(false); setToast(''); }, 2500);
    } catch {}
  };

  const waUrl  = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const fbUrl  = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const liUrl  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const OPTIONS = [
    {
      label: 'واتساب',
      icon: <WhatsAppIcon />,
      bg: 'rgba(37,211,102,0.12)',
      border: 'rgba(37,211,102,0.30)',
      onClick: () => window.open(waUrl, '_blank'),
    },
    {
      label: 'فيسبوك',
      icon: <FacebookIcon />,
      bg: 'rgba(24,119,242,0.12)',
      border: 'rgba(24,119,242,0.30)',
      onClick: () => window.open(fbUrl, '_blank'),
    },
    {
      label: 'لينكد إن',
      icon: <LinkedInIcon />,
      bg: 'rgba(10,102,194,0.12)',
      border: 'rgba(10,102,194,0.30)',
      onClick: () => window.open(liUrl, '_blank'),
    },
    {
      label: 'انستغرام',
      icon: <InstagramIcon />,
      bg: 'rgba(220,39,67,0.10)',
      border: 'rgba(220,39,67,0.28)',
      onClick: () => handleCopy('تم نسخ الرابط لمشاركته عبر انستغرام 📋'),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99990,
          background: 'rgba(0,0,0,0.70)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99991,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          width: 'min(440px, 92vw)',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: '#1A2533',
          border: '1px solid rgba(255,193,7,0.22)',
          borderRadius: 24,
          padding: '28px 24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.60)',
          direction: 'rtl',
          position: 'relative',
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, left: 16,
              width: 32, height: 32, borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.60)',
            }}
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: 22 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,193,7,0.10)',
              border: '1px solid rgba(255,193,7,0.25)',
              borderRadius: 999, padding: '4px 12px',
              color: GOLD, fontSize: 12.5, fontWeight: 700, marginBottom: 10,
            }}>
              🔗 مشاركة البرنامج
            </div>
            <h3 style={{
              margin: 0, fontFamily: F, fontWeight: 800,
              fontSize: 18, color: 'rgba(252,251,251,0.95)',
              lineHeight: 1.4,
            }}>
              {title}
            </h3>
            {description && (
              <p style={{
                margin: '6px 0 0', fontFamily: F, fontSize: 13.5,
                color: 'rgba(252,251,251,0.52)', lineHeight: 1.7,
              }}>
                {description}
              </p>
            )}
          </div>

          {/* Share options grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10, marginBottom: 16,
          }}>
            {OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={opt.onClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '13px 16px',
                  background: opt.bg,
                  border: `1px solid ${opt.border}`,
                  borderRadius: 14, cursor: 'pointer',
                  fontFamily: F, fontWeight: 700, fontSize: 14,
                  color: 'rgba(252,251,251,0.90)',
                  transition: 'transform .15s, opacity .15s',
                  textAlign: 'right',
                }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', opacity: '0.88' })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', opacity: '1' })}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {/* Copy link row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12, padding: '10px 14px',
          }}>
            <span style={{
              flex: 1, fontFamily: 'Poppins, sans-serif', fontSize: 12,
              color: 'rgba(252,251,251,0.45)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              direction: 'ltr', textAlign: 'left',
            }}>
              {url}
            </span>
            <button
              onClick={() => handleCopy()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                flexShrink: 0, padding: '8px 14px', borderRadius: 9,
                background: copied ? 'rgba(74,222,128,0.18)' : 'rgba(255,193,7,0.14)',
                border: `1px solid ${copied ? 'rgba(74,222,128,0.40)' : 'rgba(255,193,7,0.35)'}`,
                color: copied ? '#4ade80' : GOLD,
                fontFamily: F, fontWeight: 700, fontSize: 13.5,
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'تم النسخ' : 'نسخ الرابط'}
            </button>
          </div>

          {/* Toast */}
          {toast && (
            <div style={{
              marginTop: 12, padding: '10px 16px',
              background: 'rgba(74,222,128,0.12)',
              border: '1px solid rgba(74,222,128,0.30)',
              borderRadius: 10,
              fontFamily: F, fontSize: 13.5, color: '#4ade80',
              textAlign: 'center',
            }}>
              {toast}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
