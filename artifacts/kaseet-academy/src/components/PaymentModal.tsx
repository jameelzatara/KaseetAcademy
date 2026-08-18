/**
 * PaymentModal — Stripe Elements checkout for Kaseet masterclass pages.
 * RTL, phone = clean dial-code select + number input, email required, back button.
 */
import { useState, useEffect, useCallback, useRef, type CSSProperties } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripePromise } from '../lib/stripeClient';
import {
  Lock, ShieldCheck, CheckCircle2, X, AlertCircle,
  MapPin, Wifi, User, Phone, Mail, CalendarDays, ChevronDown,
} from 'lucide-react';
import {
  type CurrencyCode,
  CURRENCY_LIST, CURRENCY_NAMES, CURRENCY_SYMBOLS, CURRENCY_RATES,
  convertPrice, formatPrice,
} from '../data/currency';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrency } from '../context/CurrencyContext';

/* ── design tokens ─────────────────────────────────── */
const GLD   = '#FFC107';
const BG    = '#0D1117';
const CARD  = '#131B27';
const CARD2 = '#1A2535';
const CBR   = 'rgba(255,255,255,0.08)';
const GL    = 'rgba(255,193,7,0.28)';
const GS    = 'rgba(255,193,7,0.08)';
const CYN   = '#67e8f9';
const CL    = 'rgba(103,232,249,0.22)';
const CS    = 'rgba(103,232,249,0.07)';
const F     = "'Tajawal', sans-serif";
const FP    = "'Plus Jakarta Sans', 'Tajawal', sans-serif";
const MUT   = '#8A97AE';
const OFF   = '#f8fafc';
const LT    = '#CBD5E1';
const ERR   = '#f87171';
const GRN   = '#4ade80';
const DEPOSIT_JOD = 50;
const DEPOSIT_USD = 71; // ceil(50 JOD × 1.41) — must match server pricing.ts

/* ── country/dial-code list ─────────────────────────── */
interface Country { code: string; dial: string; name: string; }
const COUNTRIES: Country[] = [
  { code:'JO', dial:'+962', name:'الأردن' },
  { code:'PS', dial:'+970', name:'فلسطين' },
  { code:'SA', dial:'+966', name:'السعودية' },
  { code:'AE', dial:'+971', name:'الإمارات' },
  { code:'KW', dial:'+965', name:'الكويت' },
  { code:'QA', dial:'+974', name:'قطر' },
  { code:'BH', dial:'+973', name:'البحرين' },
  { code:'OM', dial:'+968', name:'عُمان' },
  { code:'EG', dial:'+20',  name:'مصر' },
  { code:'SY', dial:'+963', name:'سوريا' },
  { code:'LB', dial:'+961', name:'لبنان' },
  { code:'IQ', dial:'+964', name:'العراق' },
  { code:'YE', dial:'+967', name:'اليمن' },
  { code:'LY', dial:'+218', name:'ليبيا' },
  { code:'TN', dial:'+216', name:'تونس' },
  { code:'DZ', dial:'+213', name:'الجزائر' },
  { code:'MA', dial:'+212', name:'المغرب' },
  { code:'SD', dial:'+249', name:'السودان' },
  { code:'SO', dial:'+252', name:'الصومال' },
  { code:'MR', dial:'+222', name:'موريتانيا' },
  { code:'DJ', dial:'+253', name:'جيبوتي' },
  { code:'TR', dial:'+90',  name:'تركيا' },
  { code:'DE', dial:'+49',  name:'ألمانيا' },
  { code:'GB', dial:'+44',  name:'المملكة المتحدة' },
  { code:'US', dial:'+1',   name:'الولايات المتحدة' },
  { code:'CA', dial:'+1',   name:'كندا' },
  { code:'AU', dial:'+61',  name:'أستراليا' },
  { code:'FR', dial:'+33',  name:'فرنسا' },
  { code:'SE', dial:'+46',  name:'السويد' },
  { code:'NL', dial:'+31',  name:'هولندا' },
  { code:'BE', dial:'+32',  name:'بلجيكا' },
  { code:'IT', dial:'+39',  name:'إيطاليا' },
  { code:'ES', dial:'+34',  name:'إسبانيا' },
  { code:'PT', dial:'+351', name:'البرتغال' },
  { code:'GR', dial:'+30',  name:'اليونان' },
  { code:'PL', dial:'+48',  name:'بولندا' },
  { code:'AT', dial:'+43',  name:'النمسا' },
  { code:'CH', dial:'+41',  name:'سويسرا' },
  { code:'DK', dial:'+45',  name:'الدنمارك' },
  { code:'NO', dial:'+47',  name:'النرويج' },
  { code:'FI', dial:'+358', name:'فنلندا' },
  { code:'RU', dial:'+7',   name:'روسيا' },
  { code:'UA', dial:'+380', name:'أوكرانيا' },
  { code:'PK', dial:'+92',  name:'باكستان' },
  { code:'IN', dial:'+91',  name:'الهند' },
  { code:'BD', dial:'+880', name:'بنغلاديش' },
  { code:'MY', dial:'+60',  name:'ماليزيا' },
  { code:'ID', dial:'+62',  name:'إندونيسيا' },
  { code:'PH', dial:'+63',  name:'الفلبين' },
  { code:'SG', dial:'+65',  name:'سنغافورة' },
  { code:'TH', dial:'+66',  name:'تايلاند' },
  { code:'VN', dial:'+84',  name:'فيتنام' },
  { code:'CN', dial:'+86',  name:'الصين' },
  { code:'JP', dial:'+81',  name:'اليابان' },
  { code:'KR', dial:'+82',  name:'كوريا الجنوبية' },
  { code:'NG', dial:'+234', name:'نيجيريا' },
  { code:'GH', dial:'+233', name:'غانا' },
  { code:'KE', dial:'+254', name:'كينيا' },
  { code:'ZA', dial:'+27',  name:'جنوب أفريقيا' },
  { code:'ET', dial:'+251', name:'إثيوبيا' },
  { code:'BR', dial:'+55',  name:'البرازيل' },
  { code:'MX', dial:'+52',  name:'المكسيك' },
  { code:'AR', dial:'+54',  name:'الأرجنتين' },
  { code:'CO', dial:'+57',  name:'كولومبيا' },
  { code:'NZ', dial:'+64',  name:'نيوزيلندا' },
  { code:'IR', dial:'+98',  name:'إيران' },
  { code:'AF', dial:'+93',  name:'أفغانستان' },
  { code:'NP', dial:'+977', name:'نيبال' },
  { code:'LK', dial:'+94',  name:'سريلانكا' },
];

/* ── Shared date/time parser ────────────────────────── */
interface EventDateTime { year: number; month: number; day: number; hour: number; min: number; }

function parseEventDateTime(cohortStartAr: string, cohortTimeAr: string, cohortStartISO?: string): EventDateTime | null {
  try {
    let year: number, month: number, day: number;

    if (cohortStartISO) {
      const parts = cohortStartISO.split('-').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) throw new Error('invalid ISO');
      [year, month, day] = parts;
    } else {
      const MONTHS: Record<string, number> = {
        'يناير':1,'فبراير':2,'مارس':3,'أبريل':4,'مايو':5,'يونيو':6,
        'يوليو':7,'أغسطس':8,'سبتمبر':9,'أكتوبر':10,'نوفمبر':11,'ديسمبر':12,
        'كانون الثاني':1,'شباط':2,'آذار':3,'نيسان':4,'أيار':5,'حزيران':6,
        'تموز':7,'آب':8,'أيلول':9,'تشرين الأول':10,'تشرين الثاني':11,'كانون الأول':12,
      };
      const dm = cohortStartAr.match(/(\d+)\s+([\u0600-\u06FF\s]+?)(?:\s+(\d{4}))?\s*$/);
      if (!dm) throw new Error('date parse failed');
      day   = parseInt(dm[1], 10);
      month = MONTHS[dm[2].trim()];
      if (!month) throw new Error('unknown month: ' + dm[2]);
      if (dm[3]) {
        year = parseInt(dm[3], 10);
      } else {
        const now = new Date();
        year = now.getFullYear();
        if (new Date(year, month - 1, day) < now) year++;
      }
    }

    // "6:00 مساءً" / "6:00 – 8:00 مساءً" / "07:00 م" → 24-hour start
    const tm = cohortTimeAr.match(/(\d+):(\d+)\s*(?:[–-]\s*\d+:\d+\s*)?(مساء[ًا]?|صباح[ًا]?|[مص])/);
    let hour = 18, min = 0;
    if (tm) {
      hour = parseInt(tm[1], 10);
      min  = parseInt(tm[2], 10);
      const pm = tm[3] && (tm[3].startsWith('مساء') || tm[3] === 'م');
      if (pm && hour < 12) hour += 12;
      if (!pm && hour === 12) hour = 0;
    }

    return { year, month, day, hour, min };
  } catch {
    return null;
  }
}

/* ── Google Calendar deep-link builder ─────────────── */
function buildGCalUrl({
  title, cohortStartAr, cohortTimeAr, cohortDays, details, location, cohortStartISO,
}: {
  title: string; cohortStartAr: string; cohortTimeAr: string;
  cohortDays: string; details: string; location: string;
  cohortStartISO?: string;
}): string {
  const base   = 'https://calendar.google.com/calendar/render?action=TEMPLATE&ctz=Asia%2FAmman';
  const params = new URLSearchParams({ text: title, details, location });

  const dt = parseEventDateTime(cohortStartAr, cohortTimeAr, cohortStartISO);
  if (dt) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (y: number, mo: number, d: number, h: number, m: number) =>
      `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(m)}00`;
    const { year, month, day, hour, min } = dt;
    params.set('dates', `${fmt(year, month, day, hour, min)}/${fmt(year, month, day, hour + 2, min)}`);
  }

  return `${base}&${params.toString()}`;
}

/* ── Apple Calendar .ics data-URI builder ───────────── */
function buildIcsDataUri({
  title, cohortStartAr, cohortTimeAr, details, location, cohortStartISO,
}: {
  title: string; cohortStartAr: string; cohortTimeAr: string;
  details: string; location: string; cohortStartISO?: string;
}): string {
  const dt = parseEventDateTime(cohortStartAr, cohortTimeAr, cohortStartISO);
  const pad = (n: number) => String(n).padStart(2, '0');

  let dtstart = '', dtend = '';
  if (dt) {
    const { year, month, day, hour, min } = dt;
    const fmt = (y: number, mo: number, d: number, h: number, m: number) =>
      `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(m)}00`;
    dtstart = fmt(year, month, day, hour, min);
    dtend   = fmt(year, month, day, hour + 2, min);
  } else {
    // Fallback: today + 2h
    const now = new Date();
    const fmt = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    dtstart = fmt(now);
    const end = new Date(now.getTime() + 7200000);
    dtend = fmt(end);
  }

  const uid = `kaseet-${Date.now()}@kaseet.com`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kaseet Academy//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;TZID=Asia/Amman:${dtstart}`,
    `DTEND;TZID=Asia/Amman:${dtend}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}

/* ── Outlook Web deep-link builder ──────────────────── */
function buildOutlookUrl({
  title, cohortStartAr, cohortTimeAr, details, location, cohortStartISO,
}: {
  title: string; cohortStartAr: string; cohortTimeAr: string;
  details: string; location: string; cohortStartISO?: string;
}): string {
  const base   = 'https://outlook.live.com/calendar/deeplink/compose';
  const params = new URLSearchParams({ subject: title, body: details, location });

  const dt = parseEventDateTime(cohortStartAr, cohortTimeAr, cohortStartISO);
  if (dt) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const isoLocal = (y: number, mo: number, d: number, h: number, m: number) =>
      `${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(m)}:00`;
    const { year, month, day, hour, min } = dt;
    params.set('startdt', isoLocal(year, month, day, hour, min));
    params.set('enddt',   isoLocal(year, month, day, hour + 2, min));
  }

  return `${base}?${params.toString()}`;
}

/* ── prop / state types ─────────────────────────────── */
export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug: string;
  courseTitle: string;
  cohortIdOnsite: number;
  cohortIdLive: number;
  cohortStartAr: string;
  cohortDays: string;
  cohortTimeAr: string;
  cohortTrainer: string;
  cohortStartISOOnsite?: string; // YYYY-MM-DD — onsite cohort start date (Jordan time) for Google Calendar
  cohortStartISOLive?: string;   // YYYY-MM-DD — live cohort start date (Jordan time) for Google Calendar
  priceJOD: number;
  priceUSD: number;
  initialMode?: 'onsite' | 'live';
}

type Step = 'form' | 'payment' | 'polling' | 'pending' | 'success' | 'error';

interface FormState {
  firstName: string;
  lastName: string;
  dialCode: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
  mode: 'onsite' | 'live';
  plan: 'full' | 'deposit';
}

/* ── helpers ────────────────────────────────────────── */
const selectBase: CSSProperties = {
  flex: 1, appearance: 'none' as const, background: 'transparent',
  border: 'none', outline: 'none', fontFamily: F, fontSize: 14,
  color: OFF, cursor: 'pointer',
};

/* ── Progress stepper ──────────────────────────────── */
function Stepper({ step }: { step: Step }) {
  const current = step === 'form' ? 1 : step === 'payment' ? 2 : 3;
  // RTL: render steps 1→2→3 in DOM order; with direction:rtl flex, step 1 appears on the RIGHT
  const steps = ['بياناتك', 'الدفع', 'تم الحجز'];
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', direction: 'rtl', marginBottom: 24 }}>
      {steps.map((label, i) => {
        const idx   = i + 1;
        const done  = idx < current;
        const active = idx === current;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? GRN : active ? GLD : 'rgba(255,255,255,.08)',
                border: `2px solid ${done ? GRN : active ? GLD : CBR}`,
                transition: 'all .3s',
              }}>
                {done
                  ? <CheckCircle2 size={14} color="#0F1A2E" strokeWidth={2.5} />
                  : <span style={{ fontFamily: FP, fontSize: 11, fontWeight: 800, color: active ? '#0F1A2E' : MUT }}>{idx}</span>
                }
              </div>
              <span style={{ fontFamily: F, fontSize: 11, color: active ? GLD : done ? GRN : MUT, fontWeight: active ? 700 : 400 }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 44, height: 2, background: i + 1 < current ? GRN : CBR, margin: '0 6px', marginBottom: 18, transition: 'background .3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Currency picker (inside modal) ───────────────── */
function CurrencyPicker({
  value, onChange,
}: { value: CurrencyCode; onChange: (c: CurrencyCode) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.06)', border: `1px solid ${CBR}`,
          borderRadius: 8, padding: '4px 10px 4px 6px',
          fontFamily: F, fontSize: 12, fontWeight: 700, color: LT,
          cursor: 'pointer', outline: 'none',
        }}
      >
        {CURRENCY_SYMBOLS[value]} {value}
        <ChevronDown size={11} color={MUT} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
          background: '#131B27', border: `1px solid ${CBR}`,
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          minWidth: 200, maxHeight: 320, overflowY: 'auto',
        }}>
          {CURRENCY_LIST.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => { onChange(c); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', background: c === value ? 'rgba(255,193,7,0.08)' : 'transparent',
                border: 'none', borderBottom: `1px solid rgba(255,255,255,0.05)`,
                padding: '10px 14px', cursor: 'pointer',
                fontFamily: F, fontSize: 13, color: c === value ? GLD : LT,
                fontWeight: c === value ? 700 : 400,
                textAlign: 'right',
              }}
            >
              <span style={{ color: MUT, fontWeight: 600, direction: 'ltr' }}>{c} {CURRENCY_SYMBOLS[c]}</span>
              {CURRENCY_NAMES[c]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Order summary card ────────────────────────────── */
function OrderSummary({
  courseTitle, mode, cohortStartAr, cohortDays, priceJOD, priceUSD, plan,
  displayCurrency, onCurrencyChange, liveRates,
}: {
  courseTitle: string; mode: 'onsite' | 'live';
  cohortStartAr: string; cohortDays: string;
  priceJOD: number; priceUSD: number; plan: 'full' | 'deposit';
  displayCurrency: CurrencyCode; onCurrencyChange: (c: CurrencyCode) => void;
  liveRates?: Partial<Record<CurrencyCode, number>>;
}) {
  const isOnsite = mode === 'onsite';
  const accent   = isOnsite ? GLD : CYN;

  // For LIVE, the authoritative price is priceUSD (what Stripe charges).
  // Derive a JOD base from priceUSD so all currency conversions stay consistent.
  const usdRate = liveRates?.['USD'] ?? CURRENCY_RATES['USD'];
  const baseJOD = isOnsite ? priceJOD : priceUSD / usdRate;

  // For LIVE+USD show the exact Stripe charge amount, not a rounded conversion.
  const dispFull = (!isOnsite && displayCurrency === 'USD')
    ? formatPrice(priceUSD, 'USD')
    : formatPrice(convertPrice(baseJOD, displayCurrency, liveRates), displayCurrency);

  const dispDeposit = formatPrice(convertPrice(DEPOSIT_JOD, displayCurrency, liveRates), displayCurrency);
  const dispRemain  = formatPrice(convertPrice(priceJOD - DEPOSIT_JOD, displayCurrency, liveRates), displayCurrency);

  // Is the display currency different from what Stripe will actually charge?
  const isApprox = isOnsite
    ? displayCurrency !== 'JOD'
    : displayCurrency !== 'USD';

  const charge = isOnsite
    ? (plan === 'deposit' ? dispDeposit : dispFull)
    : dispFull;

  return (
    <div style={{
      background: isOnsite ? GS : CS, border: `1px solid ${isOnsite ? GL : CL}`,
      borderRadius: 14, padding: '14px 16px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{courseTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
            {isOnsite ? <MapPin size={11} color={accent} strokeWidth={2.5} /> : <Wifi size={11} color={accent} strokeWidth={2.5} />}
            <span style={{ fontFamily: F, fontSize: 12, color: accent, fontWeight: 700 }}>
              {isOnsite ? 'حضوري · استوديو كاسيت' : 'مباشر تفاعلي · Online LIVE'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <CalendarDays size={11} color={MUT} strokeWidth={2} />
            <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>يبدأ {cohortStartAr} · {cohortDays}</span>
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'left' }}>
          {/* currency picker */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <CurrencyPicker value={displayCurrency} onChange={onCurrencyChange} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {isApprox && <span style={{ fontFamily: F, fontSize: 10, color: MUT, fontWeight: 600 }}>≈</span>}
            <div style={{ fontFamily: FP, fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1 }}>{charge}</div>
          </div>
          {isOnsite && plan === 'deposit' && (
            <div style={{ fontFamily: F, fontSize: 11, color: MUT, marginTop: 3 }}>
              + {dispRemain} لاحقاً
            </div>
          )}
          {isApprox && (
            <div style={{ fontFamily: F, fontSize: 10, color: MUT, marginTop: 2, textAlign: 'right' }}>
              الشحن الفعلي: {isOnsite ? `${priceJOD} JOD` : `$${priceUSD}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Simple text field — icon absolute on the RIGHT ── */
function Field({
  icon, placeholder, value, onChange, type = 'text', inputDir = 'rtl', required,
}: {
  icon: React.ReactNode; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string; inputDir?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: 'relative',
      background: CARD2, border: `1.5px solid ${focused ? GLD : CBR}`,
      borderRadius: 12, transition: 'border-color .2s',
    }}>
      {/* icon pinned to the right */}
      <span style={{
        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
        color: focused ? GLD : MUT, display: 'flex', pointerEvents: 'none',
        transition: 'color .2s',
      }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder + (required ? ' *' : '')}
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={inputDir}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          fontFamily: F, fontSize: 14, color: OFF,
          padding: '12px 42px 12px 14px',   /* right padding leaves room for icon */
          textAlign: 'right', boxSizing: 'border-box',
        } as CSSProperties}
      />
    </div>
  );
}

/* ── Phone field: dial-code select (left) + number input (right) ── */
function PhoneField({
  dialCode, phoneNumber, onDialChange, onNumberChange,
}: {
  dialCode: string; phoneNumber: string;
  onDialChange: (v: string) => void; onNumberChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    /* LTR container: code on LEFT, number+icon on RIGHT */
    <div style={{
      display: 'flex', alignItems: 'stretch', direction: 'ltr',
      background: CARD2, border: `1.5px solid ${focused ? GLD : CBR}`,
      borderRadius: 12, overflow: 'hidden', transition: 'border-color .2s',
    }}>
      {/* dial-code selector — LEFT */}
      <div style={{ borderRight: `1px solid ${CBR}`, flexShrink: 0 }}>
        <select
          value={dialCode}
          onChange={e => onDialChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            height: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontFamily: FP, fontSize: 13, fontWeight: 700, color: LT,
            padding: '0 10px', cursor: 'pointer', direction: 'ltr', minWidth: 80,
          } as CSSProperties}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.dial} style={{ background: '#1A2535', color: OFF, direction: 'ltr' }}>
              {c.dial}   {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* number input — icon pinned to the RIGHT of this sub-section */}
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="tel"
          placeholder="رقم الجوال *"
          value={phoneNumber}
          onChange={e => onNumberChange(e.target.value)}
          dir="ltr"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontFamily: FP, fontSize: 14, color: OFF,
            padding: '12px 40px 12px 12px',
            boxSizing: 'border-box',
          } as CSSProperties}
        />
        <Phone
          size={14}
          color={focused ? GLD : MUT}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color .2s' }}
        />
      </div>
    </div>
  );
}

/* ── Country select — icon absolute RIGHT ──────────── */
function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: 'relative',
      background: CARD2, border: `1.5px solid ${focused ? GLD : CBR}`,
      borderRadius: 12, transition: 'border-color .2s',
    }}>
      <MapPin
        size={15}
        color={focused ? GLD : MUT}
        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color .2s' }}
      />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', appearance: 'none' as const, background: 'transparent',
          border: 'none', outline: 'none', fontFamily: F, fontSize: 14,
          color: OFF, cursor: 'pointer', direction: 'rtl',
          padding: '12px 42px 12px 14px',  /* right padding for icon */
          textAlign: 'right', boxSizing: 'border-box',
        } as CSSProperties}
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.name} style={{ background: '#1A2535', color: OFF }}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Stripe payment form ────────────────────────────── */
function StripePaymentForm({
  priceJOD, priceUSD, plan, mode, onSuccess, onError, onBack,
}: {
  priceJOD: number; priceUSD: number;
  plan: 'full' | 'deposit'; mode: 'onsite' | 'live';
  onSuccess: () => void; onError: (msg: string) => void; onBack: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState<string | null>(null);
  const [ready, setReady]   = useState(false);

  const chargeLabel = mode === 'live'
    ? `$${priceUSD}`
    : plan === 'deposit' ? `${DEPOSIT_JOD} ديناراً` : `${priceJOD} ديناراً`;

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true); setPayErr(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href.split('?')[0] + '?payment_return=1' },
      redirect: 'if_required',
    });
    if (error) {
      const msg = error.message ?? 'حدث خطأ غير متوقع — حاول مجدداً.';
      setPayErr(msg); setPaying(false); onError(msg);
    } else {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* security bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '12px 14px' }}>
        <Lock size={15} color={GLD} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>دفع آمن عبر Stripe</div>
          <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>بياناتك مشفَّرة ولا تمرّ بخوادمنا إطلاقاً</div>
        </div>
      </div>

      {/* stripe element area */}
      <div style={{ minHeight: 160 }}>
        <PaymentElement onReady={() => setReady(true)} options={{ layout: 'tabs' }} />
      </div>

      {payErr && (
        <div style={{ display: 'flex', gap: 9, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 10, padding: '10px 14px' }}>
          <AlertCircle size={16} color={ERR} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: F, fontSize: 13.5, color: ERR }}>{payErr}</span>
        </div>
      )}

      {/* pay button */}
      <button
        onClick={handlePay}
        disabled={paying || !ready}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', background: (paying || !ready) ? '#5a4a10' : GLD, color: '#0F1A2E',
          fontFamily: FP, fontWeight: 800, fontSize: 16, padding: '15px 24px',
          borderRadius: 14, border: 'none', cursor: (paying || !ready) ? 'not-allowed' : 'pointer',
          boxShadow: (paying || !ready) ? 'none' : '0 8px 24px rgba(255,193,7,.28)',
          transition: 'all .2s',
        }}
      >
        <Lock size={15} />
        {paying ? 'جاري المعالجة...' : `ادفع ${chargeLabel} وثبّت مقعدك`}
      </button>

      {/* back button */}
      <button
        onClick={onBack}
        disabled={paying}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', background: 'transparent', color: MUT,
          fontFamily: F, fontWeight: 600, fontSize: 13.5, padding: '10px 16px',
          borderRadius: 10, border: `1px solid ${CBR}`, cursor: paying ? 'not-allowed' : 'pointer',
          transition: 'all .2s',
        }}
      >
        ← العودة وتعديل البيانات
      </button>

      {/* assurances */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {['ضمان الجلسة الأولى — استرداد كامل خلال 24 ساعة', 'يصلك تأكيد التسجيل فور الدفع على بريدك', 'مقعدك محجوز لك وحدك'].map(line => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 12.5, color: LT }}>
            <CheckCircle2 size={13} color={GLD} style={{ flexShrink: 0 }} /> {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── main modal ────────────────────────────────────── */
export default function PaymentModal({
  isOpen, onClose,
  courseSlug, courseTitle,
  cohortIdOnsite, cohortIdLive,
  cohortStartAr, cohortDays, cohortTimeAr, cohortTrainer,
  cohortStartISOOnsite, cohortStartISOLive,
  priceJOD, priceUSD,
  initialMode = 'onsite',
}: PaymentModalProps) {
  const [step, setStep]         = useState<Step>('form');
  const [form, setForm]         = useState<FormState>({
    firstName: '', lastName: '', dialCode: '+962', phoneNumber: '',
    email: '', country: 'الأردن', city: '', mode: initialMode, plan: 'deposit',
  });
  const [loading, setLoading]   = useState(false);
  const [formErr, setFormErr]   = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piId, setPiId]         = useState<string | null>(null);
  const [orderId, setOrderId]   = useState<string | null>(null);
  const [paidAmount, setPaidAmount]   = useState<number>(0);
  const [paidCurrency, setPaidCurrency] = useState<string>('JOD');
  const [remaining, setRemaining]     = useState<number>(0);
  // Currency is shared with the Navbar via CurrencyContext (persisted to localStorage there).
  const { currency: displayCurrency, setCurrency: setDisplayCurrency } = useCurrency();
  const { rates: liveRates } = useExchangeRates();

  /* reset on open */
  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(window.location.search);
    const retPi  = params.get('payment_intent');
    const retSt  = params.get('redirect_status');
    if (retPi && retSt === 'succeeded') {
      setPiId(retPi); setStep('polling'); pollOrder(retPi);
    } else {
      setStep('form'); setClientSecret(null); setPiId(null);
      setOrderId(null); setFormErr(null); setLoading(false);
      setForm(f => ({ ...f, mode: initialMode, plan: initialMode === 'live' ? 'full' : 'deposit' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* lock body scroll */
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const pollOrder = useCallback(async (piId: string) => {
    setStep('polling');
    try {
      for (let i = 0; i < 18; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const res  = await fetch(`/api/checkout/pi-status?pi_id=${encodeURIComponent(piId)}`);
        if (!res.ok) continue;
        const data = await res.json() as {
          status: string;
          order?: { id: string; paidJOD: number; remainingJOD: number; totalUSD: number; mode: string; plan: string };
        };
        if (data.status === 'paid_full' || data.status === 'deposit_paid') {
          if (data.order) {
            setOrderId(data.order.id);
            // Recover the exact mode from the confirmed order so the success screen
            // (including the Google Calendar link) reflects the actual enrolment.
            if (data.order.mode === 'live' || data.order.mode === 'onsite') {
              setForm(f => ({ ...f, mode: data.order!.mode as 'onsite' | 'live' }));
            }
            if (data.order.mode === 'live') { setPaidAmount(data.order.totalUSD); setPaidCurrency('USD'); setRemaining(0); }
            else { setPaidAmount(data.order.paidJOD); setPaidCurrency('JOD'); setRemaining(data.order.remainingJOD); }
          }
          setStep('success'); return;
        }
        if (data.status === 'failed' || data.status === 'refunded') { setStep('error'); return; }
      }
      setStep('pending');
    } catch { setStep('pending'); }
  }, []);

  const handleFormSubmit = async () => {
    const fullPhone = (form.dialCode + form.phoneNumber.trim()).replace(/\s+/g, '');
    if (!form.firstName.trim()) { setFormErr('الاسم الأول إلزامي'); return; }
    if (!form.phoneNumber.trim()) { setFormErr('رقم الجوال إلزامي'); return; }
    if (!form.email.trim()) { setFormErr('البريد الإلكتروني إلزامي'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setFormErr('البريد الإلكتروني غير صحيح'); return; }
    setFormErr(null); setLoading(true);
    try {
      const cohortId = form.mode === 'onsite' ? cohortIdOnsite : cohortIdLive;
      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cohortId, courseSlug, mode: form.mode,
          plan: form.mode === 'live' ? 'full' : form.plan,
          cohortStartAr, cohortDays, cohortTimeAr, cohortTrainer,
          cohortPlatform: form.mode === 'onsite' ? 'استوديو كاسيت' : 'Google Meet',
          customer: {
            firstName: form.firstName.trim(), lastName: form.lastName.trim() || undefined,
            phone: fullPhone, email: form.email.trim(), country: form.country || 'الأردن',
            city: form.city.trim() || undefined,
          },
        }),
      });
      const data = await res.json() as { clientSecret?: string; paymentIntentId?: string; orderId?: string; error?: string };
      if (!res.ok || !data.clientSecret) { setFormErr(data.error ?? 'حدث خطأ — حاول مجدداً'); setLoading(false); return; }
      setClientSecret(data.clientSecret);
      setPiId(data.paymentIntentId ?? null);
      setOrderId(data.orderId ?? null);
      if (form.mode === 'live') { setPaidAmount(priceUSD); setPaidCurrency('USD'); setRemaining(0); }
      else if (form.plan === 'deposit') { setPaidAmount(DEPOSIT_JOD); setPaidCurrency('JOD'); setRemaining(priceJOD - DEPOSIT_JOD); }
      else { setPaidAmount(priceJOD); setPaidCurrency('JOD'); setRemaining(0); }
      setStep('payment');
    } catch {
      setFormErr('تعذّر الاتصال بالخادم — تحقق من اتصالك وحاول مجدداً');
    }
    setLoading(false);
  };

  const handlePaySuccess = useCallback(() => { if (piId) pollOrder(piId); }, [piId, pollOrder]);
  const handleBack = useCallback(() => { setStep('form'); setClientSecret(null); }, []);

  const stripeAppearance = {
    theme: 'night' as const,
    variables: { colorPrimary: GLD, colorBackground: '#1A2535', colorText: '#FFFFFF', colorDanger: '#C2453C', fontFamily: 'Tajawal, sans-serif', borderRadius: '12px', spacingUnit: '4px' },
  };

  if (!isOpen) return null;

  const isOnsite = form.mode === 'onsite';

  return (
    <>
      {/* overlay: backdrop + centering container */}
      <div
        className="ka-modal-overlay"
        onClick={onClose}
        dir="rtl"
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        {/* card */}
        <div
          className="ka-modal-card"
          onClick={e => e.stopPropagation()}
          style={{
            background: BG, border: `1px solid ${CBR}`, borderRadius: 20,
            width: '100%', maxWidth: 520, maxHeight: '85vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 40px 100px rgba(0,0,0,0.75)',
            overflow: 'hidden',
          }}
        >
          {/* fixed header */}
          <div style={{
            flexShrink: 0, background: BG, borderBottom: `1px solid ${CBR}`,
            padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: GS, border: `1px solid ${GL}`, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <Lock size={15} color={GLD} />
              </div>
              <div>
                <div style={{ fontFamily: FP, fontSize: 14.5, fontWeight: 800, color: OFF }}>حجز مقعد في الماستركلاس</div>
                <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 1 }}>دفع آمن عبر Stripe</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,.06)', border: `1px solid ${CBR}`, cursor: 'pointer', color: MUT, padding: 7, borderRadius: 9, display: 'flex', flexShrink: 0, transition: 'background .2s' }} aria-label="إغلاق">
              <X size={18} />
            </button>
          </div>

          {/* scrollable body — thin scrollbar */}
          <div className="ka-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '22px 20px 28px' }}>

            {(step === 'form' || step === 'payment' || step === 'success') && <Stepper step={step} />}

            {/* ── STEP 1: FORM ── */}
            {step === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ① أسلوب التعلّم */}
                <div>
                  <SectionLabel>① أسلوب التعلّم</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* حضوري */}
                    <ModeCard
                      selected={form.mode === 'onsite'}
                      accent={GLD}
                      accentBg={GS}
                      accentBorder={GL}
                      onClick={() => setForm(f => ({ ...f, mode: 'onsite' }))}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                        <MapPin size={13} color={form.mode === 'onsite' ? GLD : MUT} strokeWidth={2.2} />
                        <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.mode === 'onsite' ? OFF : LT }}>حضوري</span>
                      </div>
                      <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 2 }}>استوديو كاسيت · عمّان · {cohortStartAr}</div>
                      <div slot="price" style={{ fontFamily: FP, fontSize: 20, fontWeight: 700, color: form.mode === 'onsite' ? GLD : LT, lineHeight: 1 }}>{priceJOD}<span style={{ fontFamily: F, fontSize: 11, color: MUT, display: 'block' }}>JOD</span></div>
                    </ModeCard>

                    {/* مباشر تفاعلي */}
                    <ModeCard
                      selected={form.mode === 'live'}
                      accent={CYN}
                      accentBg={CS}
                      accentBorder={CL}
                      onClick={() => setForm(f => ({ ...f, mode: 'live', plan: 'full' }))}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                        <Wifi size={13} color={form.mode === 'live' ? CYN : MUT} strokeWidth={2.2} />
                        <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.mode === 'live' ? OFF : LT }}>مباشر تفاعلي</span>
                        <span style={{ fontFamily: F, fontSize: 10, color: CYN, background: CS, border: `1px solid ${CL}`, padding: '1px 6px', borderRadius: 999 }}>Online LIVE</span>
                      </div>
                      <div style={{ fontFamily: F, fontSize: 11.5, color: MUT, marginTop: 2 }}>عن بُعد من أي مكان · {cohortStartAr}</div>
                      <div slot="price" style={{ fontFamily: FP, fontSize: 20, fontWeight: 700, color: form.mode === 'live' ? CYN : LT, lineHeight: 1 }}>${priceUSD}<span style={{ fontFamily: F, fontSize: 11, color: MUT, display: 'block' }}>USD</span></div>
                    </ModeCard>
                  </div>
                </div>

                {/* ② خطة الدفع (حضوري فقط) */}
                {isOnsite && (
                  <div>
                    <SectionLabel>② خطّة الدفع</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <PlanCard selected={form.plan === 'deposit'} onClick={() => setForm(f => ({ ...f, plan: 'deposit' }))}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.plan === 'deposit' ? OFF : LT }}>تقسيط مريح</span>
                          <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, background: GLD, color: '#0F1A2E', padding: '2px 8px', borderRadius: 999 }}>موصى به</span>
                        </div>
                        <div style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                          ادفع <strong style={{ color: GLD }}>{DEPOSIT_JOD} ديناراً</strong> الآن · والباقي {priceJOD - DEPOSIT_JOD} على دفعتين أثناء الدورة
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                          {['بلا فوائد', 'بلا رسوم إضافية'].map(t => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: MUT }}>
                              <CheckCircle2 size={11} color={GRN} /> {t}
                            </div>
                          ))}
                        </div>
                      </PlanCard>

                      <PlanCard selected={form.plan === 'full'} onClick={() => setForm(f => ({ ...f, plan: 'full' }))}>
                        <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: form.plan === 'full' ? OFF : LT }}>دفعة واحدة</div>
                        <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 2 }}>{priceJOD} دينار كاملة</div>
                      </PlanCard>
                    </div>
                  </div>
                )}

                {/* بياناتك */}
                <div>
                  <SectionLabel>{isOnsite ? '③' : '②'} بياناتك</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="ka-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <Field icon={<User size={15} />} placeholder="الاسم الأول" value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} required />
                      <Field icon={<User size={15} />} placeholder="اسم العائلة" value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} />
                    </div>
                    <PhoneField
                      dialCode={form.dialCode}
                      phoneNumber={form.phoneNumber}
                      onDialChange={v => {
                        const c = COUNTRIES.find(x => x.dial === v);
                        setForm(f => ({ ...f, dialCode: v, country: c?.name ?? f.country }));
                      }}
                      onNumberChange={v => setForm(f => ({ ...f, phoneNumber: v }))}
                    />
                    <Field icon={<Mail size={15} />} placeholder="البريد الإلكتروني" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" inputDir="ltr" required />
                    <div className="ka-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <CountrySelect value={form.country} onChange={v => setForm(f => ({ ...f, country: v }))} />
                      <Field icon={<MapPin size={15} />} placeholder="المدينة" value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
                    </div>
                  </div>
                </div>

                {/* ملخص + خطأ + زر */}
                <OrderSummary courseTitle={courseTitle} mode={form.mode} cohortStartAr={cohortStartAr} cohortDays={cohortDays} priceJOD={priceJOD} priceUSD={priceUSD} plan={form.plan} displayCurrency={displayCurrency} onCurrencyChange={setDisplayCurrency} liveRates={liveRates} />

                {formErr && (
                  <div style={{ display: 'flex', gap: 10, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.28)', borderRadius: 12, padding: '12px 14px' }}>
                    <AlertCircle size={18} color={ERR} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: ERR, lineHeight: 1.5 }}>{formErr}</span>
                  </div>
                )}

                <div>
                  <button
                    onClick={handleFormSubmit}
                    disabled={loading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                      width: '100%', background: loading ? '#5a4a10' : GLD, color: '#0F1A2E',
                      fontFamily: FP, fontWeight: 800, fontSize: 16, padding: '15px 24px',
                      borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: loading ? 'none' : '0 8px 26px rgba(255,193,7,.30)', transition: 'all .2s',
                    }}
                  >
                    <Lock size={15} />
                    {loading ? 'جاري التحضير...' : 'متابعة للدفع'}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F, fontSize: 11, color: MUT, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={10} color={MUT} /> مشفّر 100% عبر Stripe
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="30" height="10" viewBox="0 0 48 16"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="50%" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#fff">VISA</text></svg>
                      <svg width="20" height="13" viewBox="0 0 34 22"><circle cx="12" cy="11" r="11" fill="#EB001B"/><circle cx="22" cy="11" r="11" fill="#F79E1B"/><path d="M17 4.3a11 11 0 0 1 0 13.4A11 11 0 0 1 17 4.3z" fill="#FF5F00"/></svg>
                      <svg width="34" height="12" viewBox="0 0 50 20"><rect width="50" height="20" rx="4" fill="#000"/><text x="50%" y="14.5" textAnchor="middle" fontFamily="'-apple-system',sans-serif" fontWeight="600" fontSize="10" fill="#fff">Apple Pay</text></svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: STRIPE ── */}
            {step === 'payment' && clientSecret && (
              <Elements stripe={getStripePromise()} options={{ clientSecret, locale: 'ar', appearance: stripeAppearance }}>
                <StripePaymentForm priceJOD={priceJOD} priceUSD={priceUSD} plan={form.plan} mode={form.mode} onSuccess={handlePaySuccess} onError={() => setStep('error')} onBack={handleBack} />
              </Elements>
            )}

            {/* ── POLLING ── */}
            {(step === 'polling' || (step === 'payment' && !clientSecret)) && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', border: `3px solid ${CBR}`, borderTopColor: GLD, margin: '0 auto 18px', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: OFF }}>جاري تأكيد الدفع…</div>
                <div style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6 }}>قد يستغرق لحظة — لا تغلق هذه النافذة</div>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(74,222,128,.10)', border: `2px solid rgba(74,222,128,.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={30} color={GRN} strokeWidth={2} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 22, fontWeight: 800, color: OFF, marginBottom: 4 }}>تمّ تثبيت مقعدك! 🎉</div>
                <div style={{ fontFamily: F, fontSize: 14, color: MUT, marginBottom: 22 }}>مرحباً بك في ماستركلاس كاسيت</div>
                {orderId && <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 18 }}>رقم الطلب: <span style={{ color: GLD, fontWeight: 700 }}>{orderId}</span></div>}
                <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px 18px', textAlign: 'right', marginBottom: 18 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {[
                      { icon: <CalendarDays size={14} color={GLD} />, text: `يبدأ ${cohortStartAr} · ${cohortDays} · ${cohortTimeAr}` },
                      { icon: <User size={14} color={GLD} />, text: `المدرّب: ${cohortTrainer}` },
                      ...(paidAmount > 0 ? [{ icon: <CheckCircle2 size={14} color={GRN} />, text: `المدفوع: ${paidAmount} ${paidCurrency}${remaining > 0 ? ` · المتبقّي: ${remaining} JOD` : ''}` }] : []),
                    ].map(({ icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: F, fontSize: 13.5, color: LT }}>{icon} {text}</div>
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.8, marginBottom: 22 }}>
                  📧 أرسلنا إيصال الدفع وتفاصيل التسجيل إلى بريدك.<br />
                  لم يصلك؟ تفقّد مجلد الرسائل غير المرغوب فيها.
                </div>
                {/* Calendar buttons */}
                {(() => {
                  const calTitle    = `كاسيت أكاديمي — ${courseTitle}`;
                  const calDetails  = `دورة ${courseTitle} · ${cohortDays} · ${cohortTimeAr}\nالمدرّب: ${cohortTrainer}\nكاسيت أكاديمي — kaseet.com`;
                  const calLocation = form.mode === 'onsite' ? 'استوديو كاسيت، شارع باريس، عمّان' : 'Google Meet (الرابط يُرسَل عبر البريد)';
                  const calISO      = form.mode === 'live' ? cohortStartISOLive : cohortStartISOOnsite;
                  const calArgs     = { title: calTitle, cohortStartAr, cohortTimeAr, cohortDays, details: calDetails, location: calLocation, cohortStartISO: calISO };

                  const btnBase: CSSProperties = {
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontFamily: F, fontSize: 13, fontWeight: 700,
                    borderRadius: 10, padding: '9px 14px',
                    textDecoration: 'none', cursor: 'pointer', flex: '1 1 0', minWidth: 0,
                    border: '1px solid',
                  };

                  return (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 14 }}>
                      {/* Google Calendar */}
                      <a
                        href={buildGCalUrl(calArgs)}
                        target="_blank" rel="noopener noreferrer"
                        style={{ ...btnBase, color: '#4285F4', background: 'rgba(66,133,244,0.08)', borderColor: 'rgba(66,133,244,0.28)' }}
                      >
                        {/* Google "G" icon */}
                        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                        </svg>
                        Google
                      </a>

                      {/* Apple Calendar — .ics download */}
                      <a
                        href={buildIcsDataUri(calArgs)}
                        download="kaseet-masterclass.ics"
                        style={{ ...btnBase, color: '#f8fafc', background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)' }}
                      >
                        {/* Apple icon */}
                        <svg width="13" height="14" viewBox="0 0 814 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.9 0 663.3 0 541.8c0-207.1 134.5-316.7 267.3-316.7 100.6 0 184.7 66.8 246.3 66.8 59.2 0 152.4-70.8 269.7-70.8zm-137.8-127.4c45.4-55.1 74.8-131.4 74.8-207.7 0-10.3-.6-20.7-2.6-29.7-70.8 2.6-154.9 47.4-206.1 110.7-40.2 48.7-76 125-76 202.6 0 11.6 2 23.2 2.6 27.1 4.5.6 11.6 1.9 18.7 1.9 64.1 0 142.8-42.8 188.6-104.9z"/>
                        </svg>
                        Apple
                      </a>

                      {/* Outlook Web */}
                      <a
                        href={buildOutlookUrl(calArgs)}
                        target="_blank" rel="noopener noreferrer"
                        style={{ ...btnBase, color: '#0078D4', background: 'rgba(0,120,212,0.08)', borderColor: 'rgba(0,120,212,0.28)' }}
                      >
                        {/* Outlook icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="4" width="14" height="16" rx="2" fill="#0078D4"/>
                          <rect x="7" y="9" width="4" height="4" rx="1" fill="white"/>
                          <path d="M15 8h7v3l-3.5 2.5L15 11V8z" fill="#0078D4"/>
                          <rect x="15" y="11" width="7" height="9" rx="1" fill="#0078D4" opacity="0.7"/>
                          <path d="M15 11l3.5 2.5L22 11" stroke="white" strokeWidth="1" fill="none"/>
                        </svg>
                        Outlook
                      </a>
                    </div>
                  );
                })()}

                <button onClick={onClose} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 32px', cursor: 'pointer' }}>إغلاق</button>
              </div>
            )}

            {/* ── PENDING ── */}
            {step === 'pending' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,193,7,.10)', border: `2px solid ${GL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <ShieldCheck size={30} color={GLD} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 19, fontWeight: 800, color: OFF, marginBottom: 8 }}>الدفع قيد المعالجة</div>
                <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.85, maxWidth: 340, marginInline: 'auto', marginBottom: 20 }}>
                  تلقّينا طلبك — سنُرسل إليك إيصال التسجيل فور تأكيد الدفع. عادةً لا يتجاوز ذلك دقيقة واحدة.
                </div>
                {orderId && <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 18 }}>رقم الطلب: <span style={{ color: GLD, fontWeight: 700 }}>{orderId}</span></div>}
                <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 12, padding: '14px 18px', textAlign: 'right', marginBottom: 24 }}>
                  <div style={{ fontFamily: F, fontSize: 13, color: MUT }}>لم يصلك إيصال خلال 5 دقائق؟ تواصل معنا:</div>
                  <a href="https://wa.me/962771052222?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D9%84%D9%85%20%D9%8A%D8%B5%D9%84%D9%86%D9%8A%20%D8%A5%D9%8A%D8%B5%D8%A7%D9%84%20%D8%A8%D8%B9%D8%AF%20%D8%A7%D9%84%D8%AF%D9%81%D8%B9" target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontFamily: F, fontSize: 13.5, fontWeight: 700, color: '#25D366', textDecoration: 'none' }}>
                    واتساب كاسيت (+962 77 105 2222)
                  </a>
                </div>
                <button onClick={onClose} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '10px 32px', cursor: 'pointer' }}>إغلاق</button>
              </div>
            )}

            {/* ── ERROR ── */}
            {step === 'error' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(248,113,113,.10)', border: '2px solid rgba(248,113,113,.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <AlertCircle size={30} color={ERR} />
                </div>
                <div style={{ fontFamily: FP, fontSize: 18, fontWeight: 800, color: ERR, marginBottom: 10 }}>تعذّر إتمام الدفع</div>
                <div style={{ fontFamily: F, fontSize: 14, color: MUT, marginBottom: 24, lineHeight: 1.8 }}>يرجى المحاولة مرة أخرى أو التواصل مع المستشارة عبر واتساب.</div>
                <button onClick={() => setStep('form')} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 10, padding: '11px 32px', cursor: 'pointer' }}>حاول مجدداً</button>
              </div>
            )}

          </div>{/* end scrollable body */}
        </div>{/* end card */}
      </div>{/* end overlay */}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* placeholder colour for all inputs */
        input::placeholder { color: #8A97AE !important; }
        select option { background: #1A2535 !important; color: #f8fafc !important; }

        /* thin, styled scrollbar for the modal body */
        .ka-modal-body::-webkit-scrollbar { width: 4px; }
        .ka-modal-body::-webkit-scrollbar-track { background: transparent; }
        .ka-modal-body::-webkit-scrollbar-thumb { background: rgba(255,193,7,0.25); border-radius: 4px; }
        .ka-modal-body::-webkit-scrollbar-thumb:hover { background: rgba(255,193,7,0.45); }
        .ka-modal-body { scrollbar-width: thin; scrollbar-color: rgba(255,193,7,0.25) transparent; }

        /* mobile: keep centered, slightly taller */
        @media (max-width: 600px) {
          .ka-modal-overlay { padding: 12px !important; }
          .ka-modal-card { max-height: 92dvh !important; }
        }
      `}</style>
    </>
  );
}

/* ── Mode card (radio-style) ────────────────────────── */
function ModeCard({
  selected, accent, accentBg, accentBorder, onClick, children,
}: {
  selected: boolean; accent: string; accentBg: string; accentBorder: string;
  onClick: () => void; children: React.ReactNode;
}) {
  // Split price from content
  const kids = Array.isArray(children) ? children : [children];
  const priceEl = kids.find((k: any) => k?.props?.slot === 'price');
  const rest     = kids.filter((k: any) => k?.props?.slot !== 'price');

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        background: selected ? accentBg : CARD,
        border: `2px solid ${selected ? accent : CBR}`,
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        transition: 'all .2s', textAlign: 'right',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${selected ? accent : MUT}`,
          background: selected ? accent : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
        }}>
          {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
        </div>
        <div style={{ textAlign: 'right', minWidth: 0 }}>{rest}</div>
      </div>
      {priceEl && <div style={{ flexShrink: 0, textAlign: 'left' }}>{priceEl}</div>}
    </button>
  );
}

/* ── Plan card (radio-style) ────────────────────────── */
function PlanCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', background: selected ? GS : CARD,
        border: `2px solid ${selected ? GLD : CBR}`,
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        transition: 'all .2s', textAlign: 'right',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          border: `2px solid ${selected ? GLD : MUT}`,
          background: selected ? GLD : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
        }}>
          {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0F1A2E' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </button>
  );
}

/* ── Section label ──────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 10 }}>
      {children}
    </div>
  );
}
