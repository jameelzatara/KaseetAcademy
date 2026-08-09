/**
 * Shared building-blocks for the four new course detail pages.
 * CourseVoiceoverPage / CourseBasicsPage keep their own inline copies;
 * the de-duplication of those is a separate tracked task.
 */
import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ChevronDown, Calendar, MapPin, Wifi,
  GraduationCap, ArrowLeft, MessageCircle,
} from 'lucide-react';
import wajeezLogo from '@assets/wajeez-logo_1785688262989.png';

/* ── Design tokens ──────────────────────────────────────── */
export const NAVY  = '#1D2738';
export const DARK  = '#161f2e';
export const CARD  = '#2a3549';
export const CARD2 = '#313d54';
export const GOLD  = '#FFC107';
export const OFF   = 'rgba(252,251,251,0.96)';
export const MUTED = 'rgba(252,251,251,0.62)';
export const F     = "'Tajawal', sans-serif";
export const FP    = "'Poppins', sans-serif";
export const LBG   = '#F5F4F0';
export const DH    = '#1e293b';
export const DM    = '#475569';

export const INNER: CSSProperties = {
  maxWidth: 1120,
  margin: '0 auto',
  padding: '0 clamp(16px,4vw,40px)',
};

/* ── WA helper ── */
export function waLink(phone: string, msg: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Types ── */
export type ScheduleEntry = {
  id: string; group: string; course: string; instructor: string;
  days: string; time: string; month: string; day: string; status: string;
  batchNumber?: string; availableSeats?: number;
  registeredCount?: number; badgeDate?: string;
};

export type SessionItem = { title: string; desc: string; unit?: string };

/* ════════════════════════════════════════════════════════
   TINY SHARED COMPONENTS
════════════════════════════════════════════════════════ */
export function GoldDot() {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: GOLD,
      boxShadow: '0 0 6px rgba(255,193,7,0.60)',
      flexShrink: 0, marginTop: 4,
    }} />
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, direction: 'rtl' }}>
      <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: OFF, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

export function LightSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, direction: 'rtl' }}>
      <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: DH, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

export function AdvisorMini({ name, role, photo, href }: {
  name: string; role: string; photo: string; href: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={photo} alt={name} style={{
          width: 52, height: 52, borderRadius: '50%', objectFit: 'cover',
          objectPosition: 'center top', border: '2px solid rgba(255,193,7,0.35)',
        }} />
        <span style={{
          position: 'absolute', bottom: 2, right: 2,
          width: 10, height: 10, borderRadius: '50%',
          background: '#22c55e', border: '2px solid #181325',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, marginBottom: 2 }}>{name}</div>
        <div style={{ fontFamily: F, fontSize: 11.5, color: MUTED, marginBottom: 8 }}>{role}</div>
        <a href={href} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: GOLD, color: NAVY, fontFamily: F, fontWeight: 800,
          fontSize: 12, padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
        }}>
          تواصل الآن <MessageCircle size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 3 }} />
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   COMPACT BATCH ROW
════════════════════════════════════════════════════════ */
export function CompactBatchRow({ batch, accent, waHref }: {
  batch: ScheduleEntry; accent: string; waHref: string;
}) {
  const accentRgb  = accent === GOLD ? '255,193,7' : '103,232,249';
  const isActive   = batch.status === 'active';
  const capacity   = (batch.registeredCount ?? 0) + (batch.availableSeats ?? 0);
  const fillPct    = capacity > 0
    ? Math.round((batch.registeredCount ?? 0) / capacity * 100)
    : (isActive ? 82 : 35);
  const seatsLabel = batch.availableSeats !== undefined
    ? `${batch.availableSeats} متاحة`
    : (isActive ? 'جارية' : '10 متاحة');
  const hasDay = batch.day && batch.day !== '--';

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', direction: 'rtl',
      background: `rgba(${accentRgb},0.04)`,
      border: `1px solid rgba(${accentRgb},0.14)`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      {/* Date badge */}
      <div style={{
        width: 60, flexShrink: 0, background: 'rgba(0,0,0,0.22)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '10px 4px', gap: 2,
      }}>
        {batch.batchNumber ? (
          <>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 13, color: '#fff', lineHeight: 1 }}>{batch.batchNumber}</span>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.50)', lineHeight: 1.3, textAlign: 'center' }}>{batch.badgeDate || batch.month || 'قريباً'}</span>
          </>
        ) : hasDay ? (
          <>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.45)' }}>{batch.month}</span>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1 }}>{batch.day}</span>
          </>
        ) : (
          <span style={{ fontFamily: F, fontSize: 9.5, fontWeight: 700, color: 'rgba(252,251,251,0.45)', textAlign: 'center', lineHeight: 1.4 }}>
            {batch.month || 'قريباً'}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: OFF, lineHeight: 1.25 }}>{batch.group}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {batch.instructor && <span style={{ fontFamily: F, fontSize: 11.5, color: MUTED }}>{batch.instructor}</span>}
          {batch.days && batch.days !== '-' && batch.days !== 'سيتم التحديد' && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: F, fontSize: 11.5, color: MUTED }}>
                <Calendar size={10} color={MUTED} strokeWidth={2} />
                {batch.days}
              </span>
            </>
          )}
          {batch.time && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
              <span style={{ fontFamily: F, fontSize: 11, color: 'rgba(252,251,251,0.45)' }}>{batch.time}</span>
            </>
          )}
        </div>
      </div>

      {/* Seats + CTA */}
      <div style={{
        width: 148, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 12px', background: 'rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8,
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 9.5, color: 'rgba(252,251,251,0.42)' }}>المقاعد</span>
            <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 9.5, color: isActive ? '#4ade80' : accent }}>
              {seatsLabel}
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${fillPct}%`, background: isActive ? '#4ade80' : accent }} />
          </div>
        </div>
        {isActive ? (
          <span style={{
            display: 'block', textAlign: 'center', fontFamily: F, fontWeight: 700,
            fontSize: 10.5, color: '#4ade80', background: 'rgba(34,197,94,0.10)',
            border: '1px solid rgba(34,197,94,0.22)', borderRadius: 7, padding: '5px 8px',
          }}>
            مقاعد ممتلئة
          </span>
        ) : (
          <a href={waHref} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'block', textAlign: 'center', fontFamily: F, fontWeight: 700,
              fontSize: 10.5, color: accent === GOLD ? '#0d1125' : '#051520',
              background: accent, borderRadius: 7, padding: '5px 8px', textDecoration: 'none',
            }}>
            سجل الآن
          </a>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   TRACK CARD 2  (accordion)
════════════════════════════════════════════════════════ */
export function TrackCard2({
  variant, activeBatches, upcomingBatches, expanded, onToggle,
  price, priceStrike, waPhone, waMsg,
}: {
  variant: 'inperson' | 'online';
  activeBatches: ScheduleEntry[];
  upcomingBatches: ScheduleEntry[];
  expanded: boolean;
  onToggle: () => void;
  price: string;
  priceStrike?: string;
  waPhone: string;
  waMsg: string;
}) {
  const isInperson = variant === 'inperson';
  const accent     = isInperson ? GOLD : '#67e8f9';
  const accentRgb  = isInperson ? '255,193,7' : '103,232,249';
  const total      = activeBatches.length + upcomingBatches.length;
  const cardBg     = isInperson
    ? 'linear-gradient(160deg,#1A1205 0%,#141008 55%,#100E0E 100%)'
    : 'linear-gradient(160deg,#060C1A 0%,#08101E 55%,#0E1626 100%)';

  const href = waLink(waPhone, waMsg);

  return (
    <div style={{
      borderRadius: 22, overflow: 'hidden', direction: 'rtl',
      border: `1px solid ${expanded ? `rgba(${accentRgb},0.52)` : 'rgba(255,255,255,0.09)'}`,
      boxShadow: expanded
        ? `0 0 0 1px rgba(${accentRgb},0.10),0 24px 56px rgba(0,0,0,0.40)`
        : '0 8px 28px rgba(0,0,0,0.28)',
      transition: 'border-color 0.3s,box-shadow 0.3s',
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,transparent 0%,rgba(${accentRgb},0.85) 50%,transparent 100%)` }} />

      <button onClick={onToggle} style={{
        width: '100%', border: 'none', cursor: 'pointer',
        padding: 'clamp(20px,2.5vw,28px)', background: cardBg,
        display: 'flex', flexDirection: 'column', gap: 0,
        textAlign: 'right', direction: 'rtl',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: `rgba(${accentRgb},0.12)`, border: `1px solid rgba(${accentRgb},0.28)`,
            color: accent, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 12, padding: '5px 14px',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
            {isInperson ? 'الأعمق تأثيراً' : 'الأكثر مرونة'}
          </span>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.20)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isInperson ? <MapPin size={21} color={accent} strokeWidth={2.2} /> : <Wifi size={21} color={accent} strokeWidth={2.2} />}
          </div>
        </div>

        <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(30px,3.8vw,40px)', color: '#fff', margin: '0 0 6px', lineHeight: 1.1 }}>
          {isInperson ? 'حضوري' : 'مباشر تفاعلي (Online LIVE)'}
        </h3>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: accent, marginBottom: 14 }}>
          {isInperson ? 'تعلّم وجهاً لوجه' : 'تعلّم من أي مكان'}
        </div>
        <p style={{ fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.75, margin: '0 0 22px', textAlign: 'right' }}>
          {isInperson
            ? 'تفاعل مباشر مع المدرب في بيئة تدريبية احترافية تُشعل الدافعية وتُسرّع النمو'
            : 'مرونة كاملة في الوقت والمكان دون التنازل عن جودة التدريب أو عمق التفاعل'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} color={MUTED} strokeWidth={2} />
            <span style={{ fontFamily: F, fontSize: 12.5, color: MUTED }}>{total} شعبة متاحة</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: expanded ? `rgba(${accentRgb},0.15)` : 'rgba(255,255,255,0.07)',
            border: `1px solid ${expanded ? `rgba(${accentRgb},0.35)` : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 99, padding: '6px 12px', transition: 'all 0.2s',
          }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: expanded ? accent : MUTED }}>
              {expanded ? 'إخفاء المواعيد' : 'عرض المواعيد'}
            </span>
            <ChevronDown size={14} color={expanded ? accent : MUTED} strokeWidth={2.5}
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }} />
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{
          background: isInperson
            ? 'linear-gradient(180deg,#0E0A04 0%,#0a0804 100%)'
            : 'linear-gradient(180deg,#050A14 0%,#060a12 100%)',
          borderTop: `1px solid rgba(${accentRgb},0.15)`,
          padding: 'clamp(16px,2.5vw,24px)',
        }}>
          {activeBatches.length > 0 && (
            <div style={{ marginBottom: upcomingBatches.length > 0 ? 22 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 14, background: '#4ade80', borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: '#4ade80' }}>الدورات الفعالة حالياً</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeBatches.map(b => <CompactBatchRow key={b.id} batch={b} accent={accent} waHref={href} />)}
              </div>
            </div>
          )}

          {upcomingBatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 14, background: accent, borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: accent }}>الدورات القادمة</span>
                <span style={{ fontFamily: FP, fontSize: 11, fontWeight: 700, background: `rgba(${accentRgb},0.12)`, border: `1px solid rgba(${accentRgb},0.25)`, color: accent, borderRadius: 999, padding: '2px 8px' }}>
                  {upcomingBatches.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcomingBatches.map(b => <CompactBatchRow key={b.id} batch={b} accent={accent} waHref={href} />)}
              </div>
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ marginTop: 22, padding: '16px 18px', background: 'rgba(0,0,0,0.32)', borderRadius: 14, border: `1px solid rgba(${accentRgb},0.15)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 3 }}>السعر بعد الخصم</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: GOLD }}>{price}</span>
                  {priceStrike && (
                    <span style={{ fontFamily: FP, fontSize: 13, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>{priceStrike}</span>
                  )}
                </div>
              </div>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: 'rgba(255,193,7,0.65)', background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.15)', borderRadius: 8, padding: '5px 11px' }}>
                بإمكانية التقسيط
              </span>
            </div>
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
              boxSizing: 'border-box', background: accent,
              color: isInperson ? NAVY : '#0a1020',
              border: 'none', borderRadius: 12, fontFamily: F, fontWeight: 800, fontSize: 14.5,
              padding: '13px 20px', cursor: 'pointer', textDecoration: 'none',
            }}>
              احجز مقعدك <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PARTNER BAR
════════════════════════════════════════════════════════ */
export function PartnerBar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', direction: 'rtl' }}>
      <button onClick={onToggle} style={{
        width: '100%', background: CARD2, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 10, justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <GraduationCap size={17} color={GOLD} strokeWidth={2} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>المؤسسات التعليمية الشريكة</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.30)', color: GOLD, borderRadius: 999, padding: '3px 11px' }}>1</span>
          <ChevronDown size={15} color={MUTED} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </div>
      </button>
      {open && (
        <div style={{ background: DARK, padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
            <img src={wajeezLogo} alt="وجيز" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, objectFit: 'cover' }} />
            <div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>تطبيق وجيز</div>
              <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 2 }}>أكبر منصة صوتية بالشرق الأوسط — شريك اعتماد رسمي لشهادات البرنامج</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
