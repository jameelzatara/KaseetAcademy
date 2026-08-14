/**
 * MasterclassAdvisorCard — shared advisor / consultant card for masterclass pages.
 * Renders a WhatsApp CTA button with the advisor's photo, name, role, and bio.
 */
import { FaWhatsapp } from 'react-icons/fa6';
import { OFF, F, waLink } from '../../pages/shared/coursePageHelpers';

const GLD  = '#FFC107';
const MUT  = '#8A97AE';

export interface AdvisorCardProps {
  name: string;
  role: string;
  bio: string;
  phone: string;
  waLabel?: string;
  imageSrc?: string;
}

export default function MasterclassAdvisorCard({
  name,
  role,
  bio,
  phone,
  waLabel,
  imageSrc,
}: AdvisorCardProps) {
  const waHref = waLink(phone, waLabel ?? `مرحباً ${name}، أودّ الاستفسار`);
  const displayLabel = waLabel ?? `تحدّث مع ${name}`;

  return (
    <div
      style={{
        background: 'rgba(42,54,72,.80)',
        border: `1px solid rgba(255,193,7,.35)`,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.40)',
      }}
    >
      <div
        style={{
          background: 'rgba(255,193,7,.08)',
          borderBottom: 'rgba(255,193,7,.18)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: GLD,
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: GLD }}>
          استشارة مجانية · دون التزام
        </span>
      </div>

      <div
        style={{
          padding: 'clamp(22px,2.8vw,32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {imageSrc ? (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${GLD}`,
                flexShrink: 0,
              }}
            >
              <img
                src={imageSrc}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                border: `2px solid rgba(255,193,7,.32)`,
                background: 'linear-gradient(135deg,#1A2E4A,#2D4A70)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F,
                fontWeight: 800,
                fontSize: 22,
                color: GLD,
                flexShrink: 0,
              }}
            >
              {name.charAt(0)}
            </div>
          )}

          <div>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF }}>{name}</div>
            <div
              style={{
                fontFamily: F,
                fontSize: 12.5,
                color: MUT,
                marginTop: 3,
                lineHeight: 1.5,
              }}
            >
              {role}
            </div>
          </div>
        </div>

        {bio && (
          <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.8, margin: 0 }}>
            {bio}
          </p>
        )}

        <div
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(14,20,31,.78)',
            border: '1px solid rgba(37,211,102,.36)',
            color: '#7FE3A6',
            fontSize: 11.5,
            fontWeight: 700,
            fontFamily: F,
            padding: '5px 11px',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#25D366',
              display: 'block',
              flexShrink: 0,
            }}
          />
          متاحة الآن
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            background: '#1F9D57',
            color: '#fff',
            fontFamily: F,
            fontWeight: 800,
            fontSize: 14,
            padding: '12px 20px',
            borderRadius: 12,
            textDecoration: 'none',
            boxShadow: '0 8px 22px rgba(31,157,87,.28)',
            marginTop: 4,
          }}
        >
          <FaWhatsapp size={16} aria-hidden="true" />
          {displayLabel}
        </a>
      </div>
    </div>
  );
}
