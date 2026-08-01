import { ReactNode } from 'react';

interface SectionHeaderProps {
  badge: string;
  heading: ReactNode;
  description?: string;
  /** extra wrapper className */
  className?: string;
  /** override marginBottom on the wrapper (default: used with spacing outside) */
  style?: React.CSSProperties;
}

/**
 * Reusable centered section header.
 * Spacing: Badge→Heading 14px | Heading→Description 18px
 * Max-width: 760px, center aligned.
 * H2: 48px / 700 / 1.15lh / slight Arabic letter-spacing
 * Subtitle: 18px / opacity .72 / 1.9lh
 */
export default function SectionHeader({ badge, heading, description, className, style }: SectionHeaderProps) {
  return (
    <div
      className={className}
      style={{
        textAlign:  'center',
        maxWidth:   760,
        margin:     '0 auto',
        direction:  'rtl',
        ...style,
      }}
    >
      {/* Badge */}
      <div style={{
        display:     'inline-flex',
        alignItems:  'center',
        gap:         7,
        marginBottom: 14,
        padding:     '5px 16px',
        borderRadius: 999,
        background:  'rgba(255,193,7,0.09)',
        border:      '1px solid rgba(255,193,7,0.25)',
        fontFamily:  'Cairo, sans-serif',
        fontWeight:  700,
        fontSize:    12.5,
        color:       '#FFC107',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#FFC107',
          boxShadow: '0 0 6px rgba(255,193,7,0.70)',
          flexShrink: 0,
        }} />
        {badge}
      </div>

      {/* H2 — 48px / 700 / 1.15lh */}
      <h2 style={{
        fontFamily:    'Cairo, sans-serif',
        fontWeight:    700,
        fontSize:      'clamp(28px, 4vw, 48px)',
        color:         'rgba(252,251,251,0.96)',
        lineHeight:    1.15,
        margin:        0,
        letterSpacing: '0.012em',    /* subtle Arabic tracking */
      }}>
        {heading}
      </h2>

      {/* Description — 18px / .72 / 1.9lh */}
      {description && (
        <p style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 400,
          fontSize:   18,
          color:      'rgba(252,251,251,0.72)',
          lineHeight: 1.9,
          margin:     '18px 0 0',
          textAlign:  'center',
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Gold span: use inside SectionHeader heading for accent words */
export function Gold({ children }: { children: ReactNode }) {
  return (
    <span style={{
      color:      '#FFC107',
      textShadow: '0 0 18px rgba(255,193,7,0.18)',  /* very subtle glow */
    }}>
      {children}
    </span>
  );
}
