/**
 * MasterclassPricingCard — shared gold-bordered pricing card wrapper for masterclass pages.
 * Renders the card shell: gold glow, dark background, heading/sub, features list, and children
 * (which should contain the price display + CTA buttons).
 */
import React from 'react';
import { OFF, F, FP } from '../../pages/shared/coursePageHelpers';

const GLD  = '#FFC107';
const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const CBR  = 'rgba(255,255,255,0.08)';

export interface MasterclassPricingCardProps {
  heading: string;
  sub?: string;
  features: string[];
  children: React.ReactNode; // price display area + CTA buttons
}

export default function MasterclassPricingCard({
  heading,
  sub,
  features,
  children,
}: MasterclassPricingCardProps) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Gold glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          background: 'linear-gradient(135deg, rgba(255,193,7,0.18), rgba(103,232,249,0.08))',
          borderRadius: 28,
          filter: 'blur(18px)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Card body */}
      <div
        style={{
          position: 'relative',
          background: '#131B27',
          border: '1px solid rgba(255,193,7,.55)',
          borderRadius: 24,
          padding: 'clamp(26px,4vw,40px)',
          boxShadow:
            '0 0 0 1px rgba(255,193,7,.20), inset 0 1px 0 rgba(255,193,7,.10), 0 34px 70px rgba(24,32,47,.28)',
        }}
      >
        {/* Heading / sub */}
        <div
          style={{
            textAlign: 'center',
            paddingBottom: 24,
            borderBottom: `1px solid ${CBR}`,
          }}
        >
          <h3
            style={{
              fontFamily: F,
              fontWeight: 800,
              fontSize: 21,
              color: OFF,
              margin: 0,
            }}
          >
            {heading}
          </h3>
          {sub && (
            <p
              style={{
                fontFamily: F,
                fontSize: 13,
                color: MUT,
                marginTop: 6,
                lineHeight: 1.65,
              }}
            >
              {sub}
            </p>
          )}
        </div>

        {/* Features list */}
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 13,
            padding: '24px 0',
            margin: 0,
          }}
        >
          {features.map(feat => (
            <li
              key={feat}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 11,
                fontFamily: F,
                fontSize: 14,
                color: LT,
                lineHeight: 1.65,
              }}
            >
              <span style={{ color: GLD, fontWeight: 800, flexShrink: 0 }}>✓</span> {feat}
            </li>
          ))}
        </ul>

        {/* Price display + CTA buttons (caller-provided) */}
        {children}
      </div>
    </div>
  );
}

/* ── Shared price display sub-component ─────────────────── */
export interface PriceRowProps {
  jodPrice: string | number;
  usdPrice: string | number;
  jodLabel?: string;
  usdLabel?: string;
  installmentNote?: string;
}

export function MasterclassPriceRow({
  jodPrice,
  usdPrice,
  jodLabel = 'JOD · حضوري عمّان',
  usdLabel = 'USD · مباشر تفاعلي (Online LIVE)',
  installmentNote = 'التقسيط متاح · تُثبَّت مقعدك بالدفعة الأولى',
}: PriceRowProps) {
  const GS = 'rgba(255,193,7,0.09)';
  const GL = 'rgba(255,193,7,0.26)';
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 28,
          margin: '20px 0 0',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontFamily: FP,
              fontSize: 48,
              fontWeight: 700,
              color: GLD,
              lineHeight: 1,
              display: 'block',
            }}
          >
            {jodPrice}
          </span>
          <span
            style={{
              fontFamily: F,
              fontSize: 13,
              color: MUT,
              display: 'block',
              marginTop: 4,
            }}
          >
            {jodLabel}
          </span>
        </div>
        <div style={{ width: 1, height: 52, background: CBR, flexShrink: 0 }} />
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontFamily: FP,
              fontSize: 48,
              fontWeight: 700,
              color: GLD,
              lineHeight: 1,
              display: 'block',
            }}
          >
            {usdPrice}
          </span>
          <span
            style={{
              fontFamily: F,
              fontSize: 13,
              color: MUT,
              display: 'block',
              marginTop: 4,
            }}
          >
            {usdLabel}
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 16,
          background: GS,
          border: `1px solid ${GL}`,
          borderRadius: 12,
          padding: '9px 15px',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: GLD,
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: F, fontSize: 13, color: LT }}>{installmentNote}</span>
      </div>
    </>
  );
}
