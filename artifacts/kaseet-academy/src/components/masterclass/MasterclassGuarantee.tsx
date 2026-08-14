/**
 * MasterclassGuarantee — identical guarantee section used by all three masterclass pages.
 * Shows a ShieldCheck icon, Arabic guarantee text, and a gold-border card.
 */
import { ShieldCheck } from 'lucide-react';
import { OFF, F } from '../../pages/shared/coursePageHelpers';

const GLD = '#FFC107';
const MUT = '#8A97AE';

export default function MasterclassGuarantee() {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        background: 'rgba(255,193,7,.06)',
        border: '1px solid rgba(255,193,7,.32)',
        borderRadius: 22,
        padding: 'clamp(28px,3.5vw,44px)',
        textAlign: 'center',
      }}
    >
      <ShieldCheck size={44} strokeWidth={1.5} color={GLD} aria-hidden="true" />
      <h2
        style={{
          fontFamily: F,
          fontWeight: 800,
          fontSize: 'clamp(22px,3vw,30px)',
          color: OFF,
          margin: '18px 0 14px',
          lineHeight: 1.4,
        }}
      >
        ضمان الجلسة الأولى
      </h2>
      <p
        style={{
          fontFamily: F,
          fontSize: 15.5,
          color: MUT,
          lineHeight: 1.9,
          maxWidth: 520,
          marginInline: 'auto',
        }}
      >
        جرّب الجلسة الأولى كاملة. وإن شعرت أنّ الماستركلاس لا يلبّي توقّعاتك، اطلب استرداداً كاملاً خلال 24 ساعة من انتهائها — دون أسئلة.
      </p>
      <p
        style={{
          fontFamily: F,
          fontSize: 13.5,
          color: GLD,
          fontStyle: 'italic',
          margin: '16px 0 0',
        }}
      >
        نحن نعرف ما نقدّمه. والجلسة الأولى تكفي لتعرفه أنت.
      </p>
    </div>
  );
}
