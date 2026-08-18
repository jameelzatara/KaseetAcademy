/**
 * CoursePageLayout — القالب المشترك لصفحات دورات كاسيت أكاديمي
 *
 * مبدأ التصميم: الفاتح للقراءة · الغامق للفعل
 * غيّر هنا مرة واحدة ← يتغير في كل الصفحات
 */

import { useState, useEffect, useMemo } from 'react';
import {
  MapPin, Wifi, Video, Clock, Users, Award, CalendarDays, Globe, Download,
  CreditCard, Lock, PlayCircle, Mic, GraduationCap, Printer, ChevronDown,
  MessageCircle, ArrowLeft, Share2, ShieldCheck, User,
} from 'lucide-react';
import ShareModal from './ShareModal';
import SiteFooter from './SiteFooter';
import cohortsAll from '../data/cohorts.json';

/* ── Design tokens ──────────────────────────────────────────── */
const CREAM      = '#F4EFE4';
const CREAM_CARD = '#FFFFFF';
const INK        = '#18202F';
const INK2       = '#56617A';
const GOLD_INK   = '#8A6200';
const CANVAS     = '#1A2533';
const CARD       = '#22303F';
const CARD_HI    = '#2B3B4E';
const GOLD       = '#FFC107';
const GOLD_LINE  = 'rgba(255,193,7,.28)';
const TEAL       = '#1E7A85';
const F          = "'Tajawal', sans-serif";
const FP         = "'Poppins', sans-serif";
const OFF        = 'rgba(252,251,251,0.92)';
const MUTED      = 'rgba(252,251,251,0.58)';
const CREAM_LINE = 'rgba(24,32,47,.10)';
const WAJIZ_GREEN = '#009688';
const ONSITE_BG  = 'linear-gradient(135deg,rgba(255,193,7,.13) 0%,rgba(255,168,0,.07) 100%)';
const ONLINE_BG  = 'linear-gradient(135deg,rgba(30,122,133,.13) 0%,rgba(0,150,136,.07) 100%)';

const WRAP: React.CSSProperties = {
  maxWidth: 1180, margin: '0 auto',
  paddingInline: 'clamp(16px,4vw,48px)',
};

function waLink(phone: string, msg: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Cohort type ────────────────────────────────────────────── */
type Cohort = {
  id: number; course: string; mode: string; status: 'open' | 'running';
  trainer: string; start: string; end: string;
  start_ar: string; end_ar: string; days: string;
  time_24: string | null; time_ar: string | null; platform: string;
  enrolled: number | null; capacity: number; remaining: number | null; fill: number | null;
};

/* ── Public types ───────────────────────────────────────────── */
export type BadgeType = 'achieve' | 'cert' | 'qual';

export interface ModeConfig {
  key: string;
  label: string;
  icon: 'map-pin' | 'wifi' | 'video';
  platform: string;
  price: string;
  currency?: string;
  strikePrice?: string;
  cohortFilter: string;   // mode value in cohorts.json: 'onsite' | 'live'
  badgeSeats?: string;
  badgeMeetings?: string;
  badgeHours?: string;
  brochure?: { href: string; label: string; style?: 'gold' | 'teal' };
  waPhone: string;
  waMessage: string;
  accentStyle: 'gold' | 'teal';
}

export interface AdvisorConfig  { name: string; role: string; img: string; href: string; }
export interface GoalConfig     { icon: React.ReactNode; title: string; text: string; }
export interface OutcomeConfig  { icon: React.ReactNode; title: string; text: string; }
export interface LectureConfig  { title: string; desc: string; }

export interface CurriculumModeConfig {
  key: string; label: string; icon: 'map-pin' | 'wifi';
  lectures: LectureConfig[];
  note: string; gradNote?: string;
  accentStyle: 'gold' | 'teal';
}

export interface TrainerConfig {
  img: string; name: string; title: string; bio: string;
  badges: { label: string; type: BadgeType }[];
}

export interface CoursePageLayoutProps {
  courseSlug: string;
  title: string;
  categoryBadge: string;
  levelBadge?: string;
  description: string;
  heroImage: string;
  heroImagePosition?: string;
  showBackLink?: boolean;
  modes: ModeConfig[];
  defaultModeKey?: string;
  heroTrainers: { img: string; name: string }[];
  installmentStyle?: 'green' | 'muted';
  shareTitle: string;
  shareDescription: string;
  programDescription: string;
  advisors: AdvisorConfig[];
  goals: GoalConfig[];
  outcomes: OutcomeConfig[];
  graduationProject?: {
    intro?: string;
    sessions?: { num: string; title: string; body: string }[];
    finalOutput?: string;
  };
  curriculumModes: CurriculumModeConfig[];
  trainers: TrainerConfig[];
}

/* ══════════════════════════════════════════════════════════════
   § FillBar
   ══════════════════════════════════════════════════════════════ */
function FillBar({ fill, remaining }: { fill: number | null; remaining: number | null }) {
  const f = fill ?? 0; const r = remaining ?? 0;
  const hot = r <= 3 && r > 0; const full = r === 0;
  return (
    <div className="ka-fill-bar" style={{ width: 120, height: 6, borderRadius: 999, background: 'rgba(255,255,255,.10)', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{
        height: '100%', width: `${f}%`, borderRadius: 999, transition: 'width .5s',
        background: full ? 'rgba(255,255,255,.22)' : hot ? 'linear-gradient(90deg,#FFC107,#E8836F)' : GOLD,
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   § CohortRow
   ══════════════════════════════════════════════════════════════ */
function CohortRow({ c, onRegister, accentStyle, price, strikePrice, currency }: {
  c: Cohort; onRegister: (id: number) => void; accentStyle: 'gold' | 'teal';
  price?: string; strikePrice?: string; currency?: string;
}) {
  const isOpen = c.status === 'open'; const isRunning = c.status === 'running';
  const r = c.remaining ?? 0;
  const hot = r <= 3 && r > 0; const full = r === 0;
  const isOnline = c.mode !== 'onsite';
  const btnBg    = accentStyle === 'teal' ? TEAL : GOLD;
  const btnColor = accentStyle === 'teal' ? '#fff' : INK;
  const btnShadow = accentStyle === 'teal' ? '0 4px 16px rgba(30,122,133,.35)' : '0 4px 16px rgba(255,193,7,.35)';

  const dayNum = new Date(c.start).getDate().toString();
  const monthMap: Record<string, string> = {
    '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو',
    '07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر',
  };
  const monthAr = monthMap[c.start.split('-')[1]] ?? '';

  return (
    <div style={{ background: CARD_HI, borderRadius: 16, border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.07)'}`, padding: 'clamp(14px,2vw,20px)', opacity: isRunning ? 0.72 : 1, direction: 'rtl' }}>
      <div className="ka-cohort-inner" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Date box */}
        <div style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0, background: isOpen ? 'rgba(255,193,7,.12)' : 'rgba(255,255,255,.06)', border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.10)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 20, color: isOpen ? GOLD : 'rgba(252,251,251,.55)', lineHeight: 1 }}>{dayNum}</span>
          <span style={{ fontFamily: F, fontSize: 11, color: isOpen ? 'rgba(255,193,7,.70)' : 'rgba(252,251,251,.40)', lineHeight: 1, marginTop: 2 }}>{monthAr}</span>
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: OFF }}>الدفعة #{c.id}</span>
            {isOpen && <span style={{ background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.35)', color: GOLD, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px' }}>تبدأ قريباً</span>}
            {isRunning && <span style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: 'rgba(252,251,251,.55)', borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}><PlayCircle size={11} strokeWidth={1.8} /> جارية الآن</span>}
            {isOpen && !full && <span style={{ background: 'rgba(255,193,7,.10)', color: GOLD, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px', border: '1px solid rgba(255,193,7,.22)' }}>متاح التسجيل</span>}
            {full && <span style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(252,251,251,.45)', borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px', border: '1px solid rgba(255,255,255,.10)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Lock size={11} strokeWidth={1.8} /> نفدت المقاعد</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,.58)' }}>
              {isOnline ? <Video size={12} strokeWidth={1.8} /> : <MapPin size={12} strokeWidth={1.8} />}{c.platform}
            </span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(252,251,251,.52)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <span>من {c.start_ar} إلى {c.end_ar}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span>{c.days}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Clock size={11} strokeWidth={1.8} />{c.time_ar}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><User size={11} strokeWidth={1.8} />{c.trainer}</span>
          </div>
        </div>
        {/* Register */}
        {isOpen && !full && (
          <div className="ka-cohort-register" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {/* Price with strikethrough */}
            {price && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, direction: 'rtl' }}>
                {strikePrice && (
                  <span style={{ fontFamily: FP, fontSize: 12, color: 'rgba(252,251,251,.35)', textDecoration: 'line-through' }}>
                    {strikePrice} {currency}
                  </span>
                )}
                <span style={{ fontFamily: FP, fontSize: 17, fontWeight: 800, color: accentStyle === 'gold' ? GOLD : TEAL }}>
                  {price} {currency}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FillBar fill={c.fill} remaining={c.remaining} />
              <button onClick={() => onRegister(c.id)} style={{ background: btnBg, color: btnColor, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: F, fontWeight: 800, fontSize: 13.5, padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: btnShadow, transition: 'transform .15s, box-shadow .15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-1px)', boxShadow: btnShadow.replace('.35', '.45') })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: btnShadow })}
              >
                سجّل الآن <ArrowLeft size={13} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   § CohortsSection
   ══════════════════════════════════════════════════════════════ */
/** نوع استجابة /api/cohorts/seats */
type LiveSeat = { cohortId: number; capacity: number; enrolled: number; remaining: number; fill: number; isOpen: boolean };

function CohortsSection({ courseSlug, modes, defaultModeKey, onModeChange }: {
  courseSlug: string; modes: ModeConfig[]; defaultModeKey: string;
  onModeChange?: (key: string) => void;
}) {
  const [tab, setTab]         = useState(defaultModeKey);
  const [showRun, setShowRun] = useState(false);
  const [liveSeats, setLiveSeats] = useState<LiveSeat[]>([]);
  useEffect(() => { setTab(defaultModeKey); }, [defaultModeKey]);

  // جلب السعات الحقيقية من قاعدة البيانات
  useEffect(() => {
    fetch('/api/cohorts/seats')
      .then(r => r.ok ? r.json() : { seats: [] })
      .then((d: { seats: LiveSeat[] }) => setLiveSeats(d.seats ?? []))
      .catch(() => { /* fallback to static */ });
  }, []);

  const activeMode = modes.find(m => m.key === tab) ?? modes[0];

  // دمج البيانات الحية فوق cohorts.json
  const allCohorts = useMemo<Cohort[]>(() => {
    const base = cohortsAll.cohorts as Cohort[];
    if (!liveSeats.length) return base;
    const map = new Map(liveSeats.map(s => [s.cohortId, s]));
    return base.map(c => {
      const live = map.get(c.id);
      if (!live) return c;
      return { ...c, enrolled: live.enrolled, capacity: live.capacity, remaining: live.remaining, fill: live.fill };
    });
  }, [liveSeats]);

  const openCohorts = useMemo(() =>
    allCohorts.filter(c => c.course === courseSlug && c.mode === activeMode.cohortFilter && c.time_ar && c.status === 'open'),
  [tab]);
  const runCohorts = useMemo(() =>
    allCohorts.filter(c => c.course === courseSlug && c.mode === activeMode.cohortFilter && c.time_ar && c.status === 'running'),
  [tab]);

  const openCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of modes) {
      counts[m.key] = allCohorts.filter(c =>
        c.course === courseSlug && c.mode === m.cohortFilter && c.time_ar && c.status === 'open'
      ).length;
    }
    return counts;
  }, [courseSlug]);

  const handleTab = (key: string) => { setTab(key); onModeChange?.(key); };

  const handleRegister = (cohortId: number) => {
    // Navigate to the checkout page with course, cohort, and mode pre-selected
    const params = new URLSearchParams({
      course: courseSlug,
      cohort: String(cohortId),
      mode: activeMode.cohortFilter, // 'onsite' | 'live'
    });
    window.location.href = `/checkout?${params.toString()}`;
  };

  const handleInterest = () => {
    window.open(waLink(activeMode.waPhone, activeMode.waMessage), '_blank');
  };

  return (
    <section id="cohorts" style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: CANVAS, padding: '80px 0', borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}` }}>
      {/* Dot grid */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none" viewBox="0 0 800 600">
          <defs>
            <pattern id="ka-cal" width="56" height="56" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.055)" />
              <line x1="0" y1="0" x2="56" y2="0" stroke="rgba(255,255,255,.020)" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="56" stroke="rgba(255,255,255,.020)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#ka-cal)" />
        </svg>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 62% 48% at 78% 6%, rgba(255,193,7,.14), transparent 68%), radial-gradient(ellipse 54% 46% at 16% 94%, rgba(30,122,133,.13), transparent 70%)' }} />

      <div style={{ ...WRAP, position: 'relative', zIndex: 3 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, direction: 'rtl' }}>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(24px,3vw,34px)', color: OFF, margin: '0 0 8px' }}>المواعيد المتاحة للتسجيل</h2>
          <p style={{ fontFamily: F, fontSize: 14, color: MUTED, margin: 0 }}>جميع المواعيد بتوقيت عمّان (GMT+3)</p>
        </div>

        {/* Mode tabs — only if > 1 mode */}
        {modes.length > 1 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, direction: 'rtl', flexWrap: 'wrap' }}>
            {modes.map(m => {
              const active = tab === m.key;
              const ModeIcon = m.icon === 'map-pin' ? MapPin : m.icon === 'wifi' ? Wifi : Video;
              return (
                <button key={m.key} onClick={() => handleTab(m.key)} style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 16, cursor: 'pointer', background: active ? 'rgba(255,193,7,.10)' : 'rgba(255,255,255,.04)', border: `1.5px solid ${active ? GOLD : 'rgba(255,255,255,.10)'}`, boxShadow: active ? '0 0 0 1px rgba(255,193,7,.22)' : 'none', transition: '.2s', fontFamily: F, direction: 'rtl' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? GOLD : 'rgba(255,255,255,.08)', color: active ? INK : 'rgba(252,251,251,.55)', flexShrink: 0 }}><ModeIcon size={16} strokeWidth={1.8} /></span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: active ? GOLD : OFF }}>{m.label}</div>
                      <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 1 }}>{openCounts[m.key] ?? 0} دفعات متاحة</div>
                    </div>
                  </div>
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Open cohorts or empty state */}
        {openCohorts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,.08)', direction: 'rtl', marginBottom: 28 }}>
            <CalendarDays size={32} color={MUTED} strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: OFF, margin: '0 0 6px' }}>الدفعات القادمة ستُعلَن قريباً</p>
            <p style={{ fontFamily: F, fontSize: 13, color: MUTED, margin: '0 0 20px' }}>سجّل اهتمامك الآن وسيتواصل معك الفريق فور فتح التسجيلات</p>
            <a href={waLink(activeMode.waPhone, activeMode.waMessage)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: GOLD, color: INK, fontFamily: F, fontWeight: 800, fontSize: 14, padding: '10px 24px', borderRadius: 10, textDecoration: 'none' }}>
              <MessageCircle size={15} strokeWidth={1.8} /> أبلغني فور الإطلاق
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {openCohorts.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} accentStyle={activeMode.accentStyle} price={activeMode.price} strikePrice={activeMode.strikePrice} currency={activeMode.currency} />)}
          </div>
        )}

        {/* Running cohorts — collapsible */}
        {runCohorts.length > 0 && (
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', marginBottom: 28 }}>
            <button onClick={() => setShowRun(v => !v)} style={{ width: '100%', background: CARD, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', direction: 'rtl', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlayCircle size={16} color='rgba(252,251,251,.55)' strokeWidth={1.8} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,.75)' }}>{runCohorts.length} دفعة جارية حالياً</span>
                <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(252,251,251,.42)', fontWeight: 400 }}>— اكتملت مقاعدها</span>
              </div>
              <ChevronDown size={16} color={MUTED} strokeWidth={2} style={{ transform: showRun ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
            </button>
            {showRun && (
              <div style={{ background: 'rgba(0,0,0,.18)', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {runCohorts.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} accentStyle={activeMode.accentStyle} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wajeez partner chip */}
        <div style={{ marginTop: 0, padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', flexWrap: 'wrap' }}>
          <GraduationCap size={20} color={GOLD} strokeWidth={1.8} />
          <div>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: OFF }}>شهادة معتمدة من تطبيق </span>
            <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: GOLD, textDecoration: 'none' }}>وجيز</a>
            <span style={{ fontFamily: F, fontSize: 12, color: MUTED, marginRight: 8 }}>— أكبر منصة صوتية في الشرق الأوسط</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Shared section title
   ══════════════════════════════════════════════════════════════ */
function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, direction: 'rtl' }}>
      <div style={{ width: 4, height: 30, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,2.6vw,30px)', color: INK, margin: 0 }}>{children}</h2>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   § About — description + advisors + goals
   ══════════════════════════════════════════════════════════════ */
function AboutSection({ programDescription, advisors, goals }: {
  programDescription: string; advisors: AdvisorConfig[]; goals: GoalConfig[];
}) {
  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>
        <div className="ka-about-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24, marginBottom: 48, alignItems: 'stretch' }}>
          {/* Description */}
          <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '28px 32px', boxShadow: '0 4px 16px rgba(24,32,47,.05)', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontFamily: F, fontSize: 16, color: INK2, lineHeight: 2.1, margin: 0 }}>{programDescription}</p>
          </div>
          {/* Advisors */}
          <div style={{ background: CANVAS, borderRadius: 20, padding: '24px 22px', boxShadow: '0 16px 48px rgba(24,32,47,.22)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16, direction: 'rtl' }}>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(15px,1.6vw,19px)', color: OFF, margin: '0 0 5px' }}>هل تحتاج مساعدة في التسجيل؟</h3>
              <p style={{ fontFamily: F, fontSize: 12.5, color: MUTED, margin: 0 }}>تواصل مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {advisors.map(({ name, role, img, href }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 14, padding: '12px 16px', textDecoration: 'none', transition: 'background .18s, border-color .18s, transform .18s', direction: 'rtl', flex: 1 }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { background:'rgba(255,193,7,.10)', borderColor:'rgba(255,193,7,.30)', transform:'translateY(-2px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,.05)', borderColor:'rgba(255,255,255,.10)', transform:'none' })}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={img} alt={name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `2px solid ${GOLD_LINE}` }} />
                    <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #1A2533' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF }}>{name}</div>
                    <div style={{ fontFamily: F, fontSize: 11.5, color: MUTED, marginTop: 2 }}>{role}</div>
                    <div style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,.70)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MessageCircle size={11} strokeWidth={1.8} /> تواصل عبر واتساب
                    </div>
                  </div>
                  <ArrowLeft size={15} strokeWidth={2} color={MUTED} style={{ flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Goals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, direction: 'rtl' }}>
          <div style={{ width: 4, height: 26, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
          <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(18px,2.2vw,24px)', color: INK, margin: 0 }}>الأهداف المتحققة</h3>
        </div>
        <div className="ka-goals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {goals.map(({ icon, title, text }) => (
            <div key={title} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 14, padding: '18px 16px', boxShadow: '0 4px 14px rgba(24,32,47,.05)', transition: 'transform .22s, box-shadow .22s, border-color .22s' }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 12px 28px rgba(24,32,47,.10)', borderColor:'rgba(138,98,0,.28)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 4px 14px rgba(24,32,47,.05)', borderColor:CREAM_LINE })}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 12 }}>{icon}</div>
              <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: INK, margin: '0 0 6px' }}>{title}</h4>
              <p style={{ fontFamily: F, fontSize: 12.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Outcomes
   ══════════════════════════════════════════════════════════════ */
function OutcomesSection({ outcomes, graduationProject }: {
  outcomes: OutcomeConfig[];
  graduationProject?: CoursePageLayoutProps['graduationProject'];
}) {
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>المخرجات التدريبية المتوقّعة</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: graduationProject ? 40 : 0 }}>
          {outcomes.map(({ icon, title, text }) => (
            <div key={title} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 18, padding: '26px 24px', boxShadow: '0 12px 34px rgba(24,32,47,.07)', transition: 'transform .25s, box-shadow .25s, border-color .25s' }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 18px 44px rgba(24,32,47,.12)', borderColor:'rgba(138,98,0,.30)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 12px 34px rgba(24,32,47,.07)', borderColor:CREAM_LINE })}
            >
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {graduationProject && (
          <div style={{ background: CREAM_CARD, border: `2px solid ${GOLD}`, borderRadius: 22, padding: 'clamp(24px,3vw,36px)', boxShadow: '0 0 0 6px rgba(255,193,7,.10), 0 22px 60px rgba(24,32,47,.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, direction: 'rtl' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={22} strokeWidth={1.8} color={GOLD_INK} />
              </div>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,21px)', color: INK, margin: 0 }}>مشروع التخرّج · الإنتاج الفعلي في الاستوديو</h3>
            </div>
            {graduationProject.intro && (
              <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8, margin: '0 0 24px', direction: 'rtl' }}
                dangerouslySetInnerHTML={{ __html: graduationProject.intro }} />
            )}
            {graduationProject.sessions && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 20, direction: 'rtl' }}>
                {graduationProject.sessions.map(({ num, title, body }) => (
                  <div key={num} style={{ background: CREAM, borderRadius: 14, padding: 18, border: `1px solid ${CREAM_LINE}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 10, fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD_INK }}>{num}</div>
                    <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: INK, margin: '0 0 6px' }}>{title}</h4>
                    <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>{body}</p>
                  </div>
                ))}
              </div>
            )}
            {graduationProject.finalOutput && (
              <div style={{ background: 'rgba(255,193,7,.10)', borderRadius: 12, padding: '14px 18px', direction: 'rtl', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <GraduationCap size={18} strokeWidth={1.8} color={GOLD_INK} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: GOLD_INK, marginBottom: 3 }}>المخرج النهائي</div>
                  <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>{graduationProject.finalOutput}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Curriculum
   ══════════════════════════════════════════════════════════════ */
function CurriculumSection({ curriculumModes, brochureHref, brochureLabel }: {
  curriculumModes: CurriculumModeConfig[];
  brochureHref?: string; brochureLabel?: string;
}) {
  const [tab, setTab] = useState(curriculumModes[0].key);
  const current = curriculumModes.find(m => m.key === tab) ?? curriculumModes[0];
  const accentCol  = current.accentStyle === 'teal' ? TEAL : GOLD_INK;
  const accentBg   = current.accentStyle === 'teal' ? 'rgba(30,122,133,.11)' : 'rgba(255,193,7,.13)';
  const accentBord = current.accentStyle === 'teal' ? 'rgba(30,122,133,.28)' : 'rgba(255,193,7,.30)';

  return (
    <section className="ka-curriculum" style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <SecTitle>الخطة الدراسية</SecTitle>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {brochureHref && (
              <a href={brochureHref} download style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${CREAM_LINE}`, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, textDecoration: 'none', transition: 'background .15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(24,32,47,.05)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <Download size={15} strokeWidth={1.8} color={INK2} /> تحميل الكتيّب
              </a>
            )}
            <button
              onClick={() => {
                document.body.classList.add('ka-print-curriculum-only');
                window.print();
                window.addEventListener('afterprint', () => document.body.classList.remove('ka-print-curriculum-only'), { once: true });
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${CREAM_LINE}`, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Printer size={15} strokeWidth={1.8} color={INK2} /> طباعة المنهج
            </button>
          </div>
        </div>

        {/* Mode tabs — only if > 1 */}
        {curriculumModes.length > 1 && (
          <div className="ka-curriculum-tabs" style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(24,32,47,.07)', borderRadius: 14, padding: 4 }}>
            {curriculumModes.map(m => {
              const TabIcon = m.icon === 'map-pin' ? MapPin : Wifi;
              const active = tab === m.key;
              const activeBg = m.accentStyle === 'teal' ? TEAL : GOLD_INK;
              return (
                <button key={m.key} onClick={() => setTab(m.key)} style={{ flex: 1, padding: '11px 0', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 13.5, transition: '.18s', background: active ? activeBg : 'transparent', color: active ? '#fff' : INK2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <TabIcon size={14} strokeWidth={1.8} />{m.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Lecture cards */}
        <div className="ka-curriculum-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
          {current.lectures.map((lec, i) => (
            <div key={`${tab}-${i}`} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 14, padding: '16px 18px', boxShadow: '0 3px 10px rgba(24,32,47,.05)', display: 'flex', gap: 14, alignItems: 'flex-start', direction: 'rtl' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: accentBg, border: `1px solid ${accentBord}`, display: 'grid', placeContent: 'center', fontFamily: FP, fontWeight: 800, fontSize: 13, color: accentCol }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: INK, marginBottom: 5 }}>{lec.title}</div>
                <p style={{ fontFamily: F, fontSize: 12.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{lec.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note strip */}
        <div style={{ background: accentBg, border: `1px solid ${accentBord}`, borderRadius: 12, padding: '12px 16px', direction: 'rtl', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: current.gradNote ? 10 : 0 }}>
          <Mic size={15} strokeWidth={1.8} color={accentCol} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontFamily: F, fontSize: 13, color: accentCol, fontWeight: 600, margin: 0, lineHeight: 1.7 }}>{current.note}</p>
        </div>

        {/* Grad note */}
        {current.gradNote && (
          <div style={{ background: 'rgba(30,122,133,.08)', border: '1px solid rgba(30,122,133,.28)', borderRadius: 12, padding: '12px 16px', direction: 'rtl', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <GraduationCap size={15} strokeWidth={1.8} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: F, fontSize: 13, color: TEAL, fontWeight: 700, margin: 0, lineHeight: 1.7 }}>{current.gradNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Trainers
   ══════════════════════════════════════════════════════════════ */
function BadgeChip({ badge }: { badge: { label: string; type: BadgeType } }) {
  const styles: Record<BadgeType, React.CSSProperties> = {
    achieve: { background: 'rgba(255,193,7,.14)', color: GOLD_INK, border: '1px solid rgba(255,193,7,.28)' },
    cert:    { background: 'rgba(30,122,133,.10)', color: TEAL,    border: '1px solid rgba(30,122,133,.22)' },
    qual:    { background: 'rgba(24,32,47,.07)',   color: INK2,    border: `1px solid ${CREAM_LINE}` },
  };
  const Icon = badge.type === 'achieve' ? Award : badge.type === 'cert' ? ShieldCheck : GraduationCap;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 999, padding: '3px 10px', fontFamily: F, fontWeight: 700, fontSize: 11.5, ...styles[badge.type] }}>
      <Icon size={12} strokeWidth={1.8} />{badge.label}
    </span>
  );
}

function TrainersSection({ trainers }: { trainers: TrainerConfig[] }) {
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}`, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(to right, rgba(24,32,47,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,32,47,.045) 1px, transparent 1px)', backgroundSize: '56px 56px', WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 62%)', maskImage: 'linear-gradient(to bottom, #000, transparent 62%)' }} />
      <div style={{ ...WRAP, direction: 'rtl', position: 'relative', zIndex: 1 }}>
        <SecTitle>خبراؤنا في التدريس</SecTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {trainers.map(({ img, name, title, bio, badges }) => (
            <div key={name} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 28px rgba(24,32,47,.07)', direction: 'rtl' }}>
              <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 22 }}>
                <img src={img} alt={name} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '3px solid rgba(255,193,7,.38)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 20, color: INK, marginBottom: 5 }}>{name}</div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13.5, color: GOLD_INK, marginBottom: 14 }}>{title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {badges.map(b => <BadgeChip key={b.label} badge={b} />)}
                  </div>
                </div>
              </div>
              <div style={{ background: CREAM, borderTop: `1px solid ${CREAM_LINE}`, padding: '16px 28px' }}>
                <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.95, margin: 0 }}>{bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Hero
   ══════════════════════════════════════════════════════════════ */
function HeroSection({ props, activeMode, openCounts, onModeChange, onShare }: {
  props: CoursePageLayoutProps;
  activeMode: string;
  openCounts: Record<string, number>;
  onModeChange: (key: string) => void;
  onShare: () => void;
}) {
  const { modes, title, categoryBadge, levelBadge, description, heroImage, heroImagePosition, showBackLink, heroTrainers, installmentStyle } = props;
  const isSingle = modes.length === 1;

  const scrollToCohorts = (key: string) => {
    onModeChange(key);
    setTimeout(() => {
      const el = document.getElementById('cohorts');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const activeModeConfig = modes.find(m => m.key === activeMode) ?? modes[0];

  // Fact badges for active mode
  const badges = [
    activeModeConfig.badgeSeats    && { icon: <Users size={16} strokeWidth={1.8} />,        label: activeModeConfig.badgeSeats },
    activeModeConfig.badgeMeetings && { icon: <CalendarDays size={16} strokeWidth={1.8} />, label: activeModeConfig.badgeMeetings },
    activeModeConfig.badgeHours    && { icon: <Clock size={16} strokeWidth={1.8} />,        label: activeModeConfig.badgeHours },
    { icon: <Globe size={16} strokeWidth={1.8} />, label: 'عربي' },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  // Brochures: collect per mode
  const brochures = modes.flatMap(m => m.brochure ? [{ ...m.brochure, modeKey: m.key }] : []);

  // Installment chip — always green for all courses
  const installChip: React.CSSProperties = { background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.32)', color: '#16a34a' };

  return (
    <section className="sec--hero" data-nav-theme="light" style={{ background: CREAM, paddingTop: 'clamp(72px,9vw,110px)', paddingBottom: 60 }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>

        {/* Back link — always visible */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => window.history.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK2, transition: 'color .15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = INK)}
            onMouseLeave={e => (e.currentTarget.style.color = INK2)}
          >
            <ArrowLeft size={15} strokeWidth={2} /> العودة إلى الدورات
          </button>
        </div>

        <div className="ka-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr min(400px,38vw)', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>

          {/* ─── Right: text ─── */}
          <div>
            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GOLD_INK, background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)', borderRadius: 999, padding: '3px 12px' }}>
                {categoryBadge}
              </span>
              {levelBadge && (
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: INK2, background: 'rgba(24,32,47,.07)', border: `1px solid ${CREAM_LINE}`, borderRadius: 999, padding: '3px 12px' }}>
                  {levelBadge}
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)', color: INK, margin: '0 0 16px', lineHeight: 1.2 }}>{title}</h1>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,17px)', color: INK2, lineHeight: 1.85, margin: '0 0 28px', maxWidth: 560 }}>{description}</p>

            {/* Fact badges + وجيز */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {badges.map(({ icon, label }) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(24,32,47,.07)', border: `1px solid ${CREAM_LINE}`, borderRadius: 999, padding: '6px 13px', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: INK2 }}>
                  <span style={{ color: GOLD_INK }}>{icon}</span>{label}
                </span>
              ))}
              <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,150,136,.10)', border: '1px solid rgba(0,150,136,.32)', borderRadius: 999, padding: '6px 13px', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: WAJIZ_GREEN, textDecoration: 'none' }}>
                <Award size={16} strokeWidth={1.8} />شهادة معتمدة من وجيز
              </a>
            </div>

            {/* Mode picker — single: one card · dual: two radio cards */}
            <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
              {modes.map(m => {
                const active = m.key === activeMode;
                const isGold = m.accentStyle === 'gold';
                const ModeIcon = m.icon === 'map-pin' ? MapPin : m.icon === 'wifi' ? Wifi : Video;
                const cardBg = active ? (isGold ? ONSITE_BG : ONLINE_BG) : 'rgba(24,32,47,.03)';
                const cardBorder = active
                  ? (isGold ? GOLD : 'rgba(30,122,133,.60)')
                  : (isGold ? 'rgba(255,193,7,.24)' : 'rgba(30,122,133,.24)');
                const priceColor = active ? (isGold ? GOLD : TEAL) : INK2;
                const iconBg = active ? (isGold ? GOLD : TEAL) : (isGold ? 'rgba(255,193,7,.16)' : 'rgba(30,122,133,.14)');
                const iconColor = active ? (isGold ? INK : '#fff') : (isGold ? GOLD_INK : TEAL);
                const labelColor = active ? (isGold ? GOLD : TEAL) : INK;
                const shadow = active ? (isGold ? '0 4px 18px rgba(255,193,7,.26)' : '0 4px 18px rgba(30,122,133,.16)') : 'none';
                const subtitle = isSingle ? m.platform : (openCounts[m.key] !== undefined ? `${openCounts[m.key]} دفعات متاحة` : m.platform);

                return (
                  <button key={m.key} role="radio" aria-checked={active}
                    onClick={() => scrollToCohorts(m.key)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: cardBg, border: `2px solid ${cardBorder}`, borderRadius: 14, padding: '14px 18px', cursor: 'pointer', transition: '.22s', direction: 'rtl', boxShadow: shadow }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, display: 'grid', placeContent: 'center', flexShrink: 0, background: iconBg, color: iconColor }}>
                        <ModeIcon size={18} strokeWidth={1.8} />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: labelColor }}>{m.label}</div>
                        <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .7 }}>{subtitle}</div>
                      </div>
                    </div>
                    <div style={{ direction: 'ltr', textAlign: 'left', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: priceColor }}>{m.price}</span>
                        {m.currency && <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: INK2 }}>{m.currency}</span>}
                        {m.strikePrice && <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .42, textDecoration: 'line-through' }}>{m.strikePrice}</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Brochure downloads */}
            {brochures.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 10, direction: 'rtl', flexWrap: 'wrap' }}>
                {brochures.map(({ href, style: s }, idx) => {
                  const isGold = (s ?? 'gold') === 'gold';
                  const accent = isGold ? GOLD_INK : TEAL;
                  const bg     = isGold ? 'rgba(255,193,7,.10)' : 'rgba(30,122,133,.10)';
                  const border = isGold ? 'rgba(255,193,7,.35)' : 'rgba(30,122,133,.35)';
                  // Always label as "كتيّب"; if dual-brochure page distinguish by style
                  const displayLabel = brochures.length === 1
                    ? 'تحميل الكتيّب'
                    : isGold ? 'كتيّب الحضوري' : 'كتيّب الأونلاين';
                  return (
                    <a key={idx} href={href} download style={{ flex: 1, minWidth: 140, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: '10px 16px', fontFamily: F, fontWeight: 700, fontSize: 13, color: accent, textDecoration: 'none', transition: 'filter .18s, transform .18s' }}
                      onMouseEnter={e => Object.assign(e.currentTarget.style, { filter:'brightness(1.08)', transform:'translateY(-1px)' })}
                      onMouseLeave={e => Object.assign(e.currentTarget.style, { filter:'none', transform:'none' })}
                    >
                      <Download size={14} strokeWidth={2} /> {displayLabel}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── Left: sticky card ─── */}
          <div className="ka-hero-sticky" style={{ position: 'sticky', top: 84 }}>
            <div style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 56px rgba(24,32,47,.14)', direction: 'rtl' }}>
              {/* Cover */}
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={heroImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: heroImagePosition ?? 'center' }} />
              </div>
              {/* Trainers strip */}
              {heroTrainers.length > 0 && (
                <div style={{ borderBottom: `1px solid ${CREAM_LINE}` }}>
                  <div style={{ padding: '10px 18px 4px', fontFamily: F, fontSize: 11, fontWeight: 700, color: INK2, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                    {heroTrainers.length === 1 ? 'المدرّب' : 'المدرّبون'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 18px 14px' }}>
                    {heroTrainers.map(({ img, name }) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={img} alt={name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(255,193,7,.40)', flexShrink: 0 }} />
                        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK }}>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Installment + Share */}
              <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '8px 12px', fontFamily: F, fontWeight: 700, fontSize: 12.5, flex: 1, justifyContent: 'center', whiteSpace: 'nowrap', ...installChip }}>
                  <CreditCard size={14} strokeWidth={1.8} /> بإمكانية التقسيط
                </span>
                <button onClick={onShare} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: GOLD, border: 'none', borderRadius: 999, padding: '8px 12px', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: GOLD_INK, transition: 'filter .15s', flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                >
                  <Share2 size={13} strokeWidth={1.8} /> مشاركة الدورة
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Main layout
   ══════════════════════════════════════════════════════════════ */
export default function CoursePageLayout(props: CoursePageLayoutProps) {
  const { modes, defaultModeKey, curriculumModes, courseSlug } = props;
  const [heroMode,  setHeroMode]  = useState(defaultModeKey ?? modes[0].key);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  // ⑬ Course JSON-LD schema — بلا aggregateRating
  useEffect(() => {
    const existing = document.getElementById('course-jsonld');
    if (existing) existing.remove();

    const allCohorts = (cohortsAll.cohorts as Cohort[]).filter(
      (c) => c.course === courseSlug && c.status === 'open',
    );

    const instances = allCohorts.map((c) => ({
      '@type': 'CourseInstance',
      courseMode:    c.mode === 'onsite' ? 'Blended' : 'Online',
      startDate:     c.start,
      endDate:       c.end,
      instructor: [{
        '@type': 'Person',
        name:    c.trainer,
      }],
      ...(c.mode === 'onsite'
        ? { location: { '@type': 'Place', name: 'استوديو كاسيت', address: { '@type': 'PostalAddress', addressLocality: 'عمّان', addressCountry: 'JO' } } }
        : { courseWorkload: 'PT2H/week' }),
    }));

    const schema: any = {
      '@context':   'https://schema.org',
      '@type':      'Course',
      name:         props.title,
      description:  props.description,
      url:          `https://kaseet.com/courses/${courseSlug}`,
      provider: {
        '@type': 'EducationalOrganization',
        name:    'كاسيت أكاديمي',
        url:     'https://kaseet.com',
      },
      inLanguage:   'ar',
      isAccessibleForFree: false,
      ...(instances.length > 0 ? { hasCourseInstance: instances } : {}),
    };

    const script  = document.createElement('script');
    script.id     = 'course-jsonld';
    script.type   = 'application/ld+json';
    script.text   = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => { document.getElementById('course-jsonld')?.remove(); };
  }, [courseSlug, props.title, props.description]);

  const allCohorts = cohortsAll.cohorts as Cohort[];
  const openCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of modes) {
      counts[m.key] = allCohorts.filter(c =>
        c.course === courseSlug && c.mode === m.cohortFilter && c.time_ar && c.status === 'open'
      ).length;
    }
    return counts;
  }, [courseSlug, modes]);

  // Brochure for curriculum section: first mode's brochure (if single mode)
  const singleBrochure = modes.length === 1 ? modes[0].brochure : undefined;

  return (
    <div dir="rtl" className="ka-course-page" style={{ background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @media print {
          .nav, .site-footer { display: none !important; }
          body { background: #fff; color: #000; }
          .ka-curriculum { break-inside: avoid; }
        }
        body.ka-print-curriculum-only .ka-course-page > *:not(.ka-curriculum) { display: none !important; }
        body.ka-print-curriculum-only .ka-curriculum button { display: none !important; }
        @media (max-width: 700px) {
          .ka-hero-grid   { grid-template-columns: 1fr !important; }
          .ka-hero-sticky { position: static !important; }
          .ka-cohort-inner { flex-wrap: wrap !important; }
          .ka-cohort-register {
            flex-shrink: 0 !important; width: 100% !important;
            flex-direction: row !important; justify-content: space-between !important;
            align-items: center !important; padding-top: 10px !important;
            border-top: 1px solid rgba(255,255,255,.08) !important;
          }
          .ka-fill-bar { flex: 1 !important; width: auto !important; }
          .ka-about-grid  { grid-template-columns: 1fr !important; }
          .ka-goals-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .ka-curriculum-tabs { flex-direction: column !important; }
          .ka-curriculum-tabs button { border-radius: 10px !important; padding: 10px 14px !important; justify-content: flex-start !important; }
          .ka-curriculum-cards { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 420px) {
          .ka-goals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HeroSection
        props={props}
        activeMode={heroMode}
        openCounts={openCounts}
        onModeChange={setHeroMode}
        onShare={() => setShareOpen(true)}
      />
      <CohortsSection
        courseSlug={courseSlug}
        modes={modes}
        defaultModeKey={heroMode}
        onModeChange={setHeroMode}
      />
      <AboutSection
        programDescription={props.programDescription}
        advisors={props.advisors}
        goals={props.goals}
      />
      <OutcomesSection outcomes={props.outcomes} graduationProject={props.graduationProject} />
      <CurriculumSection
        curriculumModes={curriculumModes}
        brochureHref={singleBrochure?.href}
        brochureLabel={singleBrochure?.label}
      />
      <TrainersSection trainers={props.trainers} />
      <SiteFooter />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={props.shareTitle}
        description={props.shareDescription}
      />
    </div>
  );
}
