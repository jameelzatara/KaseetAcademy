/**
 * MasterclassFaqAccordion — shared FAQ accordion for masterclass pages.
 * The FaqItem toggle style matches what all three pages use (+ / rotate on open).
 */
import { useState } from 'react';
import { OFF, F } from '../../pages/shared/coursePageHelpers';

const GLD  = '#FFC107';
const MUT  = '#8A97AE';
const CARD = 'rgba(255,255,255,0.04)';
const GL   = 'rgba(255,193,7,0.26)';
const CBR  = 'rgba(255,255,255,0.08)';

export interface FaqItem {
  q: string;
  a: string;
}

interface MasterclassFaqAccordionProps {
  faqs: FaqItem[];
  heading?: string;
  sub?: string;
}

function FaqItemRow({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${open ? GL : CBR}`,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 10,
        transition: 'border-color .2s',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: F,
            fontSize: 15,
            fontWeight: 700,
            color: OFF,
            textAlign: 'right',
          }}
        >
          {q}
        </span>
        <span
          aria-hidden="true"
          style={{
            color: GLD,
            fontSize: 22,
            lineHeight: 1,
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform .25s',
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: '0 22px 18px',
            fontFamily: F,
            fontSize: 14,
            color: MUT,
            lineHeight: 1.85,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function MasterclassFaqAccordion({
  faqs,
  heading,
  sub,
}: MasterclassFaqAccordionProps) {
  return (
    <>
      {(heading || sub) && (
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {heading && (
            <h2
              style={{
                fontFamily: F,
                fontWeight: 800,
                fontSize: 'clamp(28px,4.4vw,44px)',
                lineHeight: 1.35,
                margin: 0,
                color: OFF,
              }}
            >
              {heading}
            </h2>
          )}
          {sub && (
            <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 12 }}>{sub}</p>
          )}
        </div>
      )}
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        {faqs.map((faq, i) => (
          <FaqItemRow key={i} q={faq.q} a={faq.a} />
        ))}
      </div>
    </>
  );
}
