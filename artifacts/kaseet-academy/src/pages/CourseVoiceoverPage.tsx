/**
 * CourseVoiceoverPage — أساسيات التعليق والأداء الصوتي
 * مبنيّة بالكامل حسب brief-course-page.md + addendum-cohorts.md + cohorts.json
 *
 * المبدأ: الفاتح للقراءة · الغامق للفعل
 * §1 — cream for reading, dark for action
 */

import { useState, useRef, useEffect } from 'react';
import {
  MapPin, Wifi, Clock, Users, Award, CalendarDays, Globe, Download,
  CreditCard, Video, User, Lock, PlayCircle, AudioLines, Volume2,
  SlidersHorizontal, Mic, Sparkles, Briefcase, AudioWaveform,
  GraduationCap, Printer, ChevronDown, MessageCircle, ArrowLeft,
  ShieldCheck, Share2,
} from 'lucide-react';
import ShareModal  from '../components/ShareModal';
import SiteFooter  from '../components/SiteFooter';

/* ── Asset imports ──────────────────────────────────────────── */
import ayaImg    from '@assets/اية_القماز_1786367975413.jpeg';
import yaqoutImg from '@assets/ياقوت_الخشاشنة_المستشارة_1786367971950.jpeg';
import yasar     from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import rana      from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar      from '@assets/trainer-omar_1785428945248.jpg';
import heroCover from '@assets/voiceover-group-photo_1785690181212.jpg';

/* ── Cohorts data ──────────────────────────────────────────── */
import cohortsRaw from '../data/cohorts-voiceover.json';

type Cohort = {
  id: number; mode: 'onsite' | 'online'; status: 'open' | 'running';
  trainer: string; start: string; end: string;
  start_ar: string; end_ar: string; days: string;
  time_24: string; time_ar: string; platform: string;
  enrolled: number; capacity: number; remaining: number; fill: number;
};
const COHORTS    = cohortsRaw.cohorts as Cohort[];
const openOnsite = COHORTS.filter(c => c.status === 'open'    && c.mode === 'onsite');
const openOnline = COHORTS.filter(c => c.status === 'open'    && c.mode === 'online');
const runOnsite  = COHORTS.filter(c => c.status === 'running' && c.mode === 'onsite');
const runOnline  = COHORTS.filter(c => c.status === 'running' && c.mode === 'online');

/* ── Design tokens — brief §1 ────────────────────────────────── */
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

const WRAP: React.CSSProperties = {
  maxWidth: 1180, margin: '0 auto',
  paddingInline: 'clamp(16px,4vw,48px)',
};

function waLink(phone: string, msg: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ══════════════════════════════════════════════════════════════
   § Fill bar — brief §4.2
   ══════════════════════════════════════════════════════════════ */
function FillBar({ fill, remaining }: { fill: number; remaining: number }) {
  const hot  = remaining <= 3 && remaining > 0;
  const full = remaining === 0;
  const barColor = full
    ? 'rgba(255,255,255,.22)'
    : hot
    ? 'linear-gradient(90deg,#FFC107,#E8836F)'
    : '#FFC107';
  return (
    <div className="vo-fill-bar" style={{
      width: 120, height: 6, borderRadius: 999,
      background: 'rgba(255,255,255,.10)', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{
        height: '100%', width: `${fill}%`, borderRadius: 999,
        background: barColor, transition: 'width .5s',
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Cohort row — brief §4.1
   ══════════════════════════════════════════════════════════════ */
function CohortRow({ c, onRegister }: { c: Cohort; onRegister: (id: number) => void }) {
  const isOpen    = c.status === 'open';
  const isRunning = c.status === 'running';
  const isOnline  = c.mode === 'online';
  const hot       = c.remaining <= 3 && c.remaining > 0;
  const full      = c.remaining === 0;

  const dayNum   = new Date(c.start).getDate().toString();
  const monthMap: Record<string, string> = {
    '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو',
    '07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر',
  };
  const monthAr = monthMap[c.start.split('-')[1]] ?? '';

  return (
    <div style={{
      background: CARD_HI, borderRadius: 16,
      border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.07)'}`,
      padding: 'clamp(14px,2vw,20px)',
      opacity: isRunning ? 0.72 : 1,
      direction: 'rtl',
    }}>
      <div className="vo-cohort-row-inner" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Date box */}
        <div style={{
          width: 56, height: 56, borderRadius: 12, flexShrink: 0,
          background: isOpen ? 'rgba(255,193,7,.12)' : 'rgba(255,255,255,.06)',
          border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.10)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 20, color: isOpen ? GOLD : 'rgba(252,251,251,.55)', lineHeight: 1 }}>{dayNum}</span>
          <span style={{ fontFamily: F,  fontSize: 11, color: isOpen ? 'rgba(255,193,7,.70)' : 'rgba(252,251,251,.40)', lineHeight: 1, marginTop: 2 }}>{monthAr}</span>
        </div>

        {/* Info — fills available space */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: OFF }}>الدفعة #{c.id}</span>
            {isOpen && (
              <span style={{
                background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.35)',
                color: GOLD, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px',
              }}>تبدأ قريباً</span>
            )}
            {isRunning && (
              <span style={{
                background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)',
                color: 'rgba(252,251,251,.55)', borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11,
                padding: '2px 10px', display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <PlayCircle size={11} strokeWidth={1.8} /> جارية الآن
              </span>
            )}
            {isOpen && !full && (
              <span style={{
                background: 'rgba(255,193,7,.10)', color: GOLD, borderRadius: 999,
                fontFamily: F, fontWeight: 700, fontSize: 11,
                padding: '2px 10px', border: '1px solid rgba(255,193,7,.22)',
              }}>متاح التسجيل</span>
            )}
            {full && (
              <span style={{
                background: 'rgba(255,255,255,.06)', color: 'rgba(252,251,251,.45)', borderRadius: 999,
                fontFamily: F, fontWeight: 700, fontSize: 11,
                padding: '2px 10px', border: '1px solid rgba(255,255,255,.10)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Lock size={11} strokeWidth={1.8} /> نفدت المقاعد
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,.58)' }}>
              {c.mode === 'online' ? <Video size={12} strokeWidth={1.8} /> : <MapPin size={12} strokeWidth={1.8} />}
              {c.platform}
            </span>
          </div>

          {/* Detail line */}
          <div style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(252,251,251,.52)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <span>من {c.start_ar} إلى {c.end_ar}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span>{c.days}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Clock size={11} strokeWidth={1.8} />{c.time_ar}
            </span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <User size={11} strokeWidth={1.8} />{c.trainer}
            </span>
          </div>
        </div>

        {/* Register column — button + fill bar in one row */}
        {isOpen && !full && (
          <div className="vo-cohort-register" style={{ flexShrink: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FillBar fill={c.fill} remaining={c.remaining} />
            <button
              onClick={() => onRegister(c.id)}
              style={{
                background: isOnline ? TEAL : GOLD,
                color: isOnline ? '#fff' : INK,
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontFamily: F, fontWeight: 800, fontSize: 13.5, padding: '10px 18px',
                display: 'inline-flex', alignItems: 'center', gap: 5,
                boxShadow: isOnline ? '0 4px 16px rgba(30,122,133,.35)' : '0 4px 16px rgba(255,193,7,.35)',
                transition: 'transform .15s, box-shadow .15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, {
                transform: 'translateY(-1px)',
                boxShadow: isOnline ? '0 6px 20px rgba(30,122,133,.45)' : '0 6px 20px rgba(255,193,7,.45)',
              })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, {
                transform: 'none',
                boxShadow: isOnline ? '0 4px 16px rgba(30,122,133,.35)' : '0 4px 16px rgba(255,193,7,.35)',
              })}
            >
              سجّل الآن <ArrowLeft size={13} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Cohorts section — dark §4 · #1A2533 · gold borders 2px
   ══════════════════════════════════════════════════════════════ */
function CohortsSection({ defaultMode }: { defaultMode: 'onsite' | 'online' }) {
  const [tab,        setTab]        = useState<'onsite' | 'online'>(defaultMode);
  const [showRun,    setShowRun]    = useState(false);

  useEffect(() => { setTab(defaultMode); }, [defaultMode]);

  const open     = tab === 'onsite' ? openOnsite : openOnline;
  const running  = tab === 'onsite' ? runOnsite  : runOnline;
  const runCount = running.length;

  const handleRegister = (cohortId: number) => {
    const c = COHORTS.find(x => x.id === cohortId);
    if (!c) return;
    const msg = `السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي — الدفعة #${cohortId} — ${c.mode === 'onsite' ? 'حضوري' : 'مباشر تفاعلي (Online LIVE)'}`;
    window.open(waLink('962771052222', msg), '_blank');
  };

  return (
    <section id="cohorts" style={{
      position: 'relative', overflow: 'hidden', isolation: 'isolate',
      background: CANVAS, padding: '80px 0',
      borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}`,
    }}>
      {/* Dot-grid calendar pattern — §4.7 */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none" viewBox="0 0 800 600">
          <defs>
            <pattern id="cal-vo" width="56" height="56" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.055)" />
              <line x1="0" y1="0" x2="56" y2="0" stroke="rgba(255,255,255,.020)" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="56" stroke="rgba(255,255,255,.020)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#cal-vo)" />
        </svg>
      </div>
      {/* Gradient orbs — §4.7 */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 62% 48% at 78% 6%, rgba(255,193,7,.14), transparent 68%), radial-gradient(ellipse 54% 46% at 16% 94%, rgba(30,122,133,.13), transparent 70%)',
      }} />

      <div style={{ ...WRAP, position: 'relative', zIndex: 3 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, direction: 'rtl' }}>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(24px,3vw,34px)', color: OFF, margin: '0 0 8px' }}>
            المواعيد المتاحة للتسجيل
          </h2>
          <p style={{ fontFamily: F, fontSize: 14, color: MUTED, margin: 0 }}>
            جميع المواعيد بتوقيت عمّان (GMT+3)
          </p>
        </div>

        {/* Mode tabs — §4.8 one open at a time, correct counts */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, direction: 'rtl', flexWrap: 'wrap' }}>
          {([
            { key: 'onsite', label: 'حضوري',  count: openOnsite.length, icon: <MapPin size={16} strokeWidth={1.8} /> },
            { key: 'online', label: 'مباشر تفاعلي (Online LIVE)', count: openOnline.length, icon: <Wifi   size={16} strokeWidth={1.8} /> },
          ] as const).map(({ key, label, count, icon }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)} style={{
                flex: 1, minWidth: 160,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: 16, cursor: 'pointer',
                background: active ? 'rgba(255,193,7,.10)' : 'rgba(255,255,255,.04)',
                border: `1.5px solid ${active ? GOLD : 'rgba(255,255,255,.10)'}`,
                boxShadow: active ? '0 0 0 1px rgba(255,193,7,.22)' : 'none',
                transition: '.2s', fontFamily: F, direction: 'rtl',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? GOLD : 'rgba(255,255,255,.08)',
                    color: active ? INK : 'rgba(252,251,251,.55)', flexShrink: 0,
                  }}>{icon}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: active ? GOLD : OFF }}>{label}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 1 }}>{count} دفعات متاحة</div>
                  </div>
                </div>
                {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {/* Open cohorts — §4.5 open first */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {open.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
        </div>

        {/* Running cohorts — collapsible, §4.5 social proof */}
        {runCount > 0 && (
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
            <button
              onClick={() => setShowRun(v => !v)}
              style={{
                width: '100%', background: CARD, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', direction: 'rtl', gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlayCircle size={16} color='rgba(252,251,251,.55)' strokeWidth={1.8} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,.75)' }}>
                  {runCount} دفعة جارية حالياً
                </span>
                <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(252,251,251,.42)', fontWeight: 400 }}>
                  — اكتملت مقاعدها
                </span>
              </div>
              <ChevronDown size={16} color={MUTED} strokeWidth={2}
                style={{ transform: showRun ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
            </button>
            {showRun && (
              <div style={{ background: 'rgba(0,0,0,.18)', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {running.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wajeez partner chip */}
        <div style={{
          marginTop: 28, padding: '14px 20px', borderRadius: 12,
          background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', flexWrap: 'wrap',
        }}>
          <GraduationCap size={20} color={GOLD} strokeWidth={1.8} />
          <div>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: OFF }}>شهادة معتمدة من تطبيق </span>
            <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: GOLD, textDecoration: 'none' }}>وجيز</a>
            <span style={{ fontFamily: F, fontSize: 12, color: MUTED, marginRight: 8 }}>— أكبر منصة صوتية في الشرق الأوسط</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Shared: section title for light sections
   ══════════════════════════════════════════════════════════════ */
function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, direction: 'rtl' }}>
      <div style={{ width: 4, height: 30, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,2.6vw,30px)', color: INK, margin: 0 }}>
        {children}
      </h2>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   § About — §5 · description + unified advisors box + 6 goals
   ══════════════════════════════════════════════════════════════ */
function AboutSection() {
  const GOALS = [
    { icon: <AudioLines size={20} strokeWidth={1.8} color={GOLD_INK} />,        title: 'ألوان التعليق الصوتي',     text: 'إتقان جميع ألوان التعليق الصوتي: الإعلانات، الرد الآلي، الكتب الصوتية، الوثائقيات، الأخبار والدوبلاج.' },
    { icon: <Volume2 size={20} strokeWidth={1.8} color={GOLD_INK} />,           title: 'مخارج الحروف والنطق',     text: 'تحسين مخارج الحروف وضبط الأداء اللغوي والتخلص من عيوب النطق.' },
    { icon: <SlidersHorizontal size={20} strokeWidth={1.8} color={GOLD_INK} />, title: 'الطبقات الصوتية والإيقاع', text: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس واكتساب مرونة صوتية كاملة.' },
    { icon: <Mic size={20} strokeWidth={1.8} color={GOLD_INK} />,               title: 'كسر رهبة الميكروفون',     text: 'التأقلم الكامل مع البيئة الصوتية الاحترافية والعمل بثقة تامة.' },
    { icon: <Sparkles size={20} strokeWidth={1.8} color={GOLD_INK} />,          title: 'الثقة والحضور الصوتي',    text: 'بناء شخصية صوتية قوية تعكس الاحترافية أمام العملاء وشركات الإنتاج.' },
    { icon: <Briefcase size={20} strokeWidth={1.8} color={GOLD_INK} />,         title: 'التواصل المهني',           text: 'فهم سوق العمل الصوتي والتفاعل مع التوجيهات الإخراجية بكفاءة.' },
  ];

  const ADVISORS = [
    { name: 'آية القماز',      role: 'مستشارة التسجيل · حضوري',         img: ayaImg,    href: 'https://wa.me/962790234483' },
    { name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي',  img: yaqoutImg, href: 'https://wa.me/962771052222'  },
  ];

  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>

        {/* ── Top row: description (right) + advisors (left) — RTL: first = right ── */}
        <div className="vo-about-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24, marginBottom: 48, alignItems: 'stretch' }}>

          {/* Description — RIGHT column in RTL (first child) */}
          <div style={{
            background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
            borderRadius: 20, padding: '28px 32px',
            boxShadow: '0 4px 16px rgba(24,32,47,.05)',
            display: 'flex', alignItems: 'center',
          }}>
            <p style={{ fontFamily: F, fontSize: 16, color: INK2, lineHeight: 2.1, margin: 0 }}>
              يسعى هذا البرنامج إلى إعداد وتأهيل المتدربين لاحتراف مجال التعليق الصوتي وتجهيزهم بالمهارات اللازمة للاندماج في سوق العمل. ترتكز أهدافنا على تطوير مخارج الحروف والنطق السليم، والتمكن من التحكم في الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون تماماً لتعزيز الثقة بالنفس وتنمية مهارات الإلقاء والتواصل المهني.
            </p>
          </div>

          {/* Advisors box — LEFT column in RTL (second child) */}
          <div style={{
            background: CANVAS, borderRadius: 20,
            padding: '24px 22px',
            boxShadow: '0 16px 48px rgba(24,32,47,.22)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ marginBottom: 16, direction: 'rtl' }}>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(15px,1.6vw,19px)', color: OFF, margin: '0 0 5px' }}>
                هل تحتاج مساعدة في التسجيل؟
              </h3>
              <p style={{ fontFamily: F, fontSize: 12.5, color: MUTED, margin: 0 }}>
                تواصل مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة
              </p>
            </div>

            {/* Advisor cards — stacked, stretch to fill */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {ADVISORS.map(({ name, role, img, href }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.10)',
                    borderRadius: 14, padding: '12px 16px', textDecoration: 'none',
                    transition: 'background .18s, border-color .18s, transform .18s',
                    direction: 'rtl', flex: 1,
                  }}
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
        </div>{/* end top row */}

        {/* Goals title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, direction: 'rtl' }}>
          <div style={{ width: 4, height: 26, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
          <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(18px,2.2vw,24px)', color: INK, margin: 0 }}>الأهداف المتحققة</h3>
        </div>

        {/* Goal cards — fixed 3-col */}
        <div className="vo-goals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {GOALS.map(({ icon, title, text }) => (
            <div key={title} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 14, padding: '18px 16px',
              boxShadow: '0 4px 14px rgba(24,32,47,.05)',
              transition: 'transform .22s, box-shadow .22s, border-color .22s',
            }}
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
   § Outcomes — §6 · 3 cards + graduation project block
   ══════════════════════════════════════════════════════════════ */
function OutcomesSection() {
  const CARDS = [
    { icon: <AudioWaveform size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'تسجيلات استوديو عالية الجودة',       text: 'عيّنات صوتية احترافية مسجّلة بأحدث اللاقطات داخل استوديوهات كاسيت الفعلية.' },
    { icon: <Mic  size={22} strokeWidth={1.8} color={GOLD_INK} />,          title: 'ديمو صوتي احترافي (Voice Demo CV)', text: 'ملفّ صوتي متكامل مُهندَس بأحدث المؤثّرات، يستعرض خامات صوتك في مختلف ألوان التعليق.' },
    { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,         title: 'شهادة معتمدة رسمياً',               text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
  ];

  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>المخرجات التدريبية المتوقّعة</SecTitle>

        {/* 3 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 40 }}>
          {CARDS.map(({ icon, title, text }) => (
            <div key={title} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 18, padding: '26px 24px',
              boxShadow: '0 12px 34px rgba(24,32,47,.07)',
              transition: 'transform .25s, box-shadow .25s, border-color .25s',
            }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 18px 44px rgba(24,32,47,.12)', borderColor:'rgba(138,98,0,.30)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 12px 34px rgba(24,32,47,.07)', borderColor:CREAM_LINE })}
            >
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Graduation project block — §6.1 full text */}
        <div style={{
          background: CREAM_CARD, border: `2px solid ${GOLD}`, borderRadius: 22,
          padding: 'clamp(24px,3vw,36px)',
          boxShadow: '0 0 0 6px rgba(255,193,7,.10), 0 22px 60px rgba(24,32,47,.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, direction: 'rtl' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={22} strokeWidth={1.8} color={GOLD_INK} />
            </div>
            <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,21px)', color: INK, margin: 0 }}>
              مشروع التخرّج · الإنتاج الفعلي في الاستوديو
            </h3>
          </div>

          <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8, margin: '0 0 24px', direction: 'rtl' }}>
            بعد إتمام محاضرات الدورة، تبدأ مرحلة الإنتاج الفعلي:{' '}
            <strong style={{ color: INK }}>تحجز الاستوديو ثلاث جلسات، كلّ جلسة ساعة واحدة، بإشراف مهندس الصوت.</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 20, direction: 'rtl' }}>
            {[
              { num: '1+2', title: 'الجلسة الأولى والثانية — التمرين على نصوصك', body: 'تتمرّن على المايك في بيئة تسجيل حقيقية، ويُصحَّح أداؤك جملةً بجملة، عبر ألوان التعليق التي درستها: الإعلان، والوثائقي، والسرد، والرد الآلي.' },
              { num: '3',   title: 'الجلسة الثالثة — تسجيل مشروعك',              body: 'جلسة تسجيل احترافية تُنتج فيها عملك النهائي، شاملاً كلّ الألوان الصوتية التي تدرّبت عليها.' },
            ].map(({ num, title, body }) => (
              <div key={num} style={{ background: CREAM, borderRadius: 14, padding: 18, border: `1px solid ${CREAM_LINE}` }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center',
                  marginBottom: 10, fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD_INK,
                }}>{num}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: INK, margin: '0 0 6px' }}>{title}</h4>
                <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,193,7,.10)', borderRadius: 12, padding: '14px 18px', direction: 'rtl', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <GraduationCap size={18} strokeWidth={1.8} color={GOLD_INK} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: GOLD_INK, marginBottom: 3 }}>المخرج النهائي</div>
              <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>
                ديمو صوتي احترافي (Voice Demo CV) منتَج بيد مهندس صوت متخصّص، بعد الهندسة والمكساج والماسترنج — جاهز لإرساله إلى العملاء وشركات الإنتاج.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Curriculum — §7 · 8 onsite / 6 online + production phase
   ══════════════════════════════════════════════════════════════ */
const LECTURES_ONSITE = [
  { title: 'الصوت وأساسيات الأداء',         desc: 'فهم الصوت، خصائصه، وكيفية استخدامه في الأداء الصوتي.' },
  { title: 'التنفّس والتحكم بالصوت',        desc: 'تدريب عملي على التنفّس، دعم الصوت، والتحكم في النبرة والإيقاع.' },
  { title: 'أعضاء النطق ومخارج الحروف',     desc: 'التعرّف إلى أعضاء النطق، وضبط المخارج والوضوح أثناء الأداء.' },
  { title: 'الاستماع والنقد السمعي',        desc: 'تطوير القدرة على الاستماع، تحليل الأداء، واكتشاف نقاط القوة ومجالات التطوير.' },
  { title: 'اللغة العربية للمعلّق الصوتي',  desc: 'النطق السليم، التشكيل، سلامة القراءة، والتعامل مع النصوص الصوتية.' },
  { title: 'التعبير والأداء الصوتي',        desc: 'التحكم في المشاعر، النبرة، الإيقاع، والوقفات بما يخدم المعنى.' },
  { title: 'ألوان التعليق الصوتي',          desc: 'التدريب العملي على الإعلان، والوثائقي، والسرد، والأنماط المختلفة للأداء الصوتي.' },
  { title: 'التطبيق المهني والانطلاق',      desc: 'تطبيق متكامل على نصوص حقيقية، وتوجيهات عملية للاستعداد لسوق العمل وبناء الملف الصوتي.' },
];
const ONSITE_NOTE = 'التطبيق العملي في الاستوديو يبدأ مبكرًا ويستمر طوال البرنامج، مع الانتقال التدريجي بين مهارات الأداء وألوان التعليق الصوتي.';

const LECTURES_ONLINE = [
  { title: 'الاستوديو المنزلي والمعدات',     desc: 'التعرّف إلى بيئة التسجيل المنزلية، اختيار المعدات المناسبة، وضبط إعدادات التسجيل.' },
  { title: 'أساسيات الصوت والتنفس',          desc: 'فهم الصوت، التحكم في التنفّس، ودعم الأداء الصوتي.' },
  { title: 'النطق ومخارج الحروف',            desc: 'تطوير وضوح النطق، ضبط المخارج، وتحسين سلامة الأداء.' },
  { title: 'اللغة العربية للمعلّق الصوتي',   desc: 'سلامة القراءة، التشكيل، التعامل مع النص، ومهارات الأداء اللغوي.' },
  { title: 'التعبير والأداء الصوتي',         desc: 'التحكم في النبرة، الإيقاع، الوقفات، والانفعالات بما يخدم المعنى.' },
  { title: 'التطبيق الصوتي والاستعداد المهني', desc: 'تطوير الأداء من خلال نصوص متنوعة، والتطبيق على ألوان التعليق الصوتي المختلفة، مع توجيه عملي للاستعداد لسوق العمل.' },
];
const ONLINE_NOTE  = 'التطبيق العملي يبدأ مبكرًا ويستمر طوال البرنامج — بعد تأسيس مهارات الصوت والاستوديو، يبدأ التدريب العملي على نصوص وألوان مختلفة من التعليق الصوتي، ويتطور الأداء تدريجيًا مع كل لقاء.';
const ONLINE_GRAD  = 'مشروع التخرّج: 3 جلسات إنتاج مباشرة مع مهندس الصوت، لتنفيذ تطبيقات صوتية حقيقية وإخراج ملفات جاهزة للاستخدام المهني — تمامًا كما في التدريب الحضوري، ولكن عن بُعد.';

function CurriculumSection() {
  const [tab, setTab] = useState<'onsite' | 'online'>('onsite');

  const isOnsite   = tab === 'onsite';
  const lecs       = isOnsite ? LECTURES_ONSITE : LECTURES_ONLINE;
  const accentCol  = isOnsite ? GOLD_INK : TEAL;
  const accentBg   = isOnsite ? 'rgba(255,193,7,.13)' : 'rgba(30,122,133,.11)';
  const accentBord = isOnsite ? 'rgba(255,193,7,.30)' : 'rgba(30,122,133,.28)';
  const note       = isOnsite ? ONSITE_NOTE : ONLINE_NOTE;

  return (
    <section className="vo-curriculum" style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <SecTitle>الخطة الدراسية</SecTitle>
          <button
            onClick={() => {
              document.body.classList.add('print-curriculum-only');
              window.print();
              window.addEventListener('afterprint', () => document.body.classList.remove('print-curriculum-only'), { once: true });
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: `1px solid ${CREAM_LINE}`,
              borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
              fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Printer size={15} strokeWidth={1.8} color={INK2} /> طباعة المنهج
          </button>
        </div>

        {/* Mode tabs */}
        <div className="vo-curriculum-tabs-wrap" style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(24,32,47,.07)', borderRadius: 14, padding: 4 }}>
          {([
            { key: 'onsite', label: 'حضوري — 8 لقاءات · 16 ساعة',                    icon: <MapPin size={14} strokeWidth={1.8} /> },
            { key: 'online', label: 'مباشر تفاعلي (Online LIVE) — 6 لقاءات · 12 ساعة', icon: <Wifi   size={14} strokeWidth={1.8} /> },
          ] as const).map(({ key, label, icon }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '11px 0', borderRadius: 11, border: 'none', cursor: 'pointer',
              fontFamily: F, fontWeight: 700, fontSize: 13.5, transition: '.18s',
              background: tab === key ? (key === 'onsite' ? GOLD_INK : TEAL) : 'transparent',
              color: tab === key ? '#fff' : INK2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Always-expanded 2-col grid cards */}
        <div className="curriculum vo-curriculum-cards" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16,
        }}>
          {lecs.map((lec, i) => (
            <div key={`${tab}-${i}`} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 14, padding: '16px 18px',
              boxShadow: '0 3px 10px rgba(24,32,47,.05)',
              display: 'flex', gap: 14, alignItems: 'flex-start', direction: 'rtl',
            }}>
              {/* Number badge */}
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: accentBg, border: `1px solid ${accentBord}`,
                display: 'grid', placeContent: 'center',
                fontFamily: FP, fontWeight: 800, fontSize: 13, color: accentCol,
              }}>
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
        <div style={{
          background: accentBg, border: `1px solid ${accentBord}`,
          borderRadius: 12, padding: '12px 16px', direction: 'rtl',
          display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: isOnsite ? 0 : 10,
        }}>
          <Mic size={15} strokeWidth={1.8} color={accentCol} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontFamily: F, fontSize: 13, color: accentCol, fontWeight: 600, margin: 0, lineHeight: 1.7 }}>{note}</p>
        </div>

        {/* Online graduation project */}
        {!isOnsite && (
          <div style={{
            background: 'rgba(30,122,133,.08)', border: '1px solid rgba(30,122,133,.28)',
            borderRadius: 12, padding: '12px 16px', direction: 'rtl',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <GraduationCap size={15} strokeWidth={1.8} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: F, fontSize: 13, color: TEAL, fontWeight: 700, margin: 0, lineHeight: 1.7 }}>{ONLINE_GRAD}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   § Trainers — §8 · grid pattern top · coloured badge chips
   ══════════════════════════════════════════════════════════════ */
type BadgeType = 'achieve' | 'cert' | 'qual';
type TrainerBadge = { label: string; type: BadgeType };

const TRAINERS = [
  {
    img: yasar, name: 'يسار عبده', title: 'مدربة إعلامية وخبيرة تعليق صوتي',
    bio: 'مدربة معتمدة لدى الأمم المتحدة والمؤسسات الوطنية، بخبرة تزيد على عشرين عاماً في الإعلام والتعليق الصوتي والتدريب المهني. تحمل درجة البكالوريوس في اللغة الإنجليزية وعلم الأصوات (Phonetics)، ودرجة الماجستير في حقوق الإنسان والتنمية البشرية. خبرتها تشمل الدبلجة، الأخبار، الأفلام الوثائقية، الكتب الصوتية، والتعليق الصوتي الإعلاني.',
    badges: [
      { label: '+3,000 طالب مدرَّب',      type: 'achieve' },
      { label: 'خبرة +20 سنة',             type: 'achieve' },
      { label: 'معتمدة لدى الأمم المتحدة', type: 'cert'    },
    ] as TrainerBadge[],
  },
  {
    img: rana, name: 'رنا العزام', title: 'إعلامية ومدربة أداء ومختصة بالتحرير اللغوي',
    bio: 'الإعلامية رنا محمد العزام معدة ومقدمة برامج فضائية وإذاعية وبودكاست معتمدة. تنقلت بين كبرى المؤسسات الإعلامية مثل: قناة رؤيا الفضائية وقناة صاد وإذاعة حياة FM. عملت لسنوات محررة ومدققة لغوية في مجمع اللغة العربية ومذيعة في إذاعة المجمع. قدمت برامج تدريبية متخصصة لطلبة الإعلام في جامعة البترا ولمؤسسات حكومية كبرى، وحازت لأفضل إنتاج إعلاني حول المرأة العربية.',
    badges: [
      { label: 'قنوات فضائية وإذاعات',        type: 'qual'    },
      { label: 'جوائز إعلامية',               type: 'achieve' },
      { label: 'بكالوريوس لغة عربية — اليرموك', type: 'qual'    },
    ] as TrainerBadge[],
  },
  {
    img: omar, name: 'عمر الدرابكة', title: 'معلق صوتي محترف ومدرب أداء وإلقاء',
    bio: 'معلق صوتي محترف ومدرب أداء وإلقاء. سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا، ويمتلك خبرة واسعة في التدريب الصوتي والتمكين اللغوي تتجاوز 12 عاماً.',
    badges: [
      { label: 'مئات الأعمال المسجلة', type: 'achieve' },
      { label: 'خبرة +12 سنة',         type: 'achieve' },
      { label: 'دبلوم إعلام — فلوريدا', type: 'qual'    },
    ] as TrainerBadge[],
  },
];

function BadgeChip({ badge }: { badge: TrainerBadge }) {
  const styles: Record<BadgeType, React.CSSProperties> = {
    achieve: { background: 'rgba(255,193,7,.14)', color: GOLD_INK, border: '1px solid rgba(255,193,7,.28)' },
    cert:    { background: 'rgba(30,122,133,.10)', color: TEAL,    border: '1px solid rgba(30,122,133,.22)' },
    qual:    { background: 'rgba(24,32,47,.07)',   color: INK2,    border: `1px solid ${CREAM_LINE}` },
  };
  const Icon = badge.type === 'achieve' ? Award : badge.type === 'cert' ? ShieldCheck : GraduationCap;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 999, padding: '3px 10px',
      fontFamily: F, fontWeight: 700, fontSize: 11.5, ...styles[badge.type],
    }}>
      <Icon size={12} strokeWidth={1.8} />{badge.label}
    </span>
  );
}

function TrainersSection() {
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}`, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 220,
        zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right, rgba(24,32,47,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,32,47,.045) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 62%)',
        maskImage: 'linear-gradient(to bottom, #000, transparent 62%)',
      }} />
      <div style={{ ...WRAP, direction: 'rtl', position: 'relative', zIndex: 1 }}>
        <SecTitle>خبراؤنا في التدريس</SecTitle>

        {/* Stacked full-width cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {TRAINERS.map(({ img, name, title, bio, badges }) => (
            <div key={name} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 8px 28px rgba(24,32,47,.07)',
              direction: 'rtl',
            }}>
              {/* ── Card header: photo (visual right in RTL) + text ── */}
              <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 22 }}>
                {/* Photo — first child in RTL = visual right */}
                <img src={img} alt={name} style={{
                  width: 88, height: 88, borderRadius: '50%',
                  objectFit: 'cover', objectPosition: 'center top',
                  border: '3px solid rgba(255,193,7,.38)', flexShrink: 0,
                }} />
                {/* Name / subtitle / badges */}
                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 20, color: INK, marginBottom: 5 }}>{name}</div>
                  <div style={{ fontFamily: F, fontWeight: 600, fontSize: 13.5, color: GOLD_INK, marginBottom: 14 }}>{title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {badges.map(b => <BadgeChip key={b.label} badge={b} />)}
                  </div>
                </div>
              </div>

              {/* ── Bio — separate cream strip at the bottom ── */}
              <div style={{
                background: CREAM, borderTop: `1px solid ${CREAM_LINE}`,
                padding: '16px 28px',
              }}>
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
   § Hero — §2 · cream bg · frosted navbar · colored mode cards
   ══════════════════════════════════════════════════════════════ */
const WAJIZ_GREEN = '#009688';
const ONSITE_BG   = 'linear-gradient(135deg,rgba(255,193,7,.13) 0%,rgba(255,168,0,.07) 100%)';
const ONLINE_BG   = 'linear-gradient(135deg,rgba(30,122,133,.13) 0%,rgba(0,150,136,.07) 100%)';

function HeroSection({ mode, onModeChange, onShare }: { mode: 'onsite' | 'online'; onModeChange: (m: 'onsite' | 'online') => void; onShare: () => void }) {
  const scrollToCohorts = (m: 'onsite' | 'online') => {
    onModeChange(m);
    setTimeout(() => {
      const el = document.getElementById('cohorts');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const BADGES_ONSITE = [
    { icon: <Users size={16} strokeWidth={1.8} />,        label: '10 مقاعد محدودة' },
    { icon: <CalendarDays size={16} strokeWidth={1.8} />, label: '8 لقاءات' },
    { icon: <Clock size={16} strokeWidth={1.8} />,        label: '16 ساعة تدريبية' },
    { icon: <Globe size={16} strokeWidth={1.8} />,        label: 'عربي' },
  ];
  const BADGES_ONLINE = [
    { icon: <Users size={16} strokeWidth={1.8} />,        label: '10 مقاعد محدودة' },
    { icon: <CalendarDays size={16} strokeWidth={1.8} />, label: '6 محاضرات' },
    { icon: <Clock size={16} strokeWidth={1.8} />,        label: '12 ساعة تدريبية' },
    { icon: <Globe size={16} strokeWidth={1.8} />,        label: 'عربي' },
  ];
  const badges = mode === 'onsite' ? BADGES_ONSITE : BADGES_ONLINE;

  /* inline hover helpers for <a> tags */
  const hoverIn  = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.background = 'rgba(24,32,47,.07)');
  const hoverOut = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.background = 'transparent');

  return (
    <section className="sec--hero" data-nav-theme="light" style={{ background: CREAM, paddingTop: 'clamp(72px,9vw,110px)', paddingBottom: 60 }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>

        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
              fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK2,
              transition: 'color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = INK)}
            onMouseLeave={e => (e.currentTarget.style.color = INK2)}
          >
            <ArrowLeft size={15} strokeWidth={2} /> العودة إلى الدورات
          </button>
        </div>

        <div className="vo-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr min(400px,38vw)', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>

          {/* ─── Right side: text ─── */}
          <div>
            {/* Tag row: أساسيات التعليق + مبتدئ لمتوسط */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: F, fontSize: 12, fontWeight: 700, color: GOLD_INK,
                background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)',
                borderRadius: 999, padding: '3px 12px',
              }}>أساسيات التعليق</span>
              <span style={{
                fontFamily: F, fontSize: 12, fontWeight: 700, color: INK2,
                background: 'rgba(24,32,47,.07)', border: `1px solid ${CREAM_LINE}`,
                borderRadius: 999, padding: '3px 12px',
              }}>مبتدئ لمتوسط</span>
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)', color: INK, margin: '0 0 16px', lineHeight: 1.2 }}>
              أساسيات التعليق والأداء الصوتي
            </h1>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,17px)', color: INK2, lineHeight: 1.85, margin: '0 0 28px', maxWidth: 560 }}>
              البرنامج التأسيسي الشامل لتعليق الصوت: من بناء الصوت وتطوير النطق إلى إنتاج ديمو صوتي احترافي في استوديوهات كاسيت.
            </p>

            {/* Fact badges + وجيز (brand green) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {badges.map(({ icon, label }) => (
                <span key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(24,32,47,.07)', border: `1px solid ${CREAM_LINE}`,
                  borderRadius: 999, padding: '6px 13px',
                  fontFamily: F, fontWeight: 700, fontSize: 12.5, color: INK2,
                }}>
                  <span style={{ color: GOLD_INK }}>{icon}</span>{label}
                </span>
              ))}
              <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(0,150,136,.10)', border: '1px solid rgba(0,150,136,.32)',
                borderRadius: 999, padding: '6px 13px',
                fontFamily: F, fontWeight: 700, fontSize: 12.5, color: WAJIZ_GREEN, textDecoration: 'none',
              }}>
                <Award size={16} strokeWidth={1.8} />شهادة معتمدة من وجيز
              </a>
            </div>

            {/* ── Mode picker: colored cards ── */}
            <div role="radiogroup" aria-label="اختر طريقة الدراسة" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>

              {/* Onsite — warm amber */}
              {(() => {
                const active = mode === 'onsite';
                return (
                  <button role="radio" aria-checked={active} onClick={() => scrollToCohorts('onsite')}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                      background: active ? ONSITE_BG : 'rgba(24,32,47,.03)',
                      border: `2px solid ${active ? GOLD : 'rgba(255,193,7,.24)'}`,
                      borderRadius: 14, padding: '14px 18px', cursor: 'pointer', transition: '.22s',
                      direction: 'rtl', boxShadow: active ? '0 4px 18px rgba(255,193,7,.26)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, display: 'grid', placeContent: 'center', flexShrink: 0,
                        background: active ? GOLD : 'rgba(255,193,7,.16)', color: active ? INK : GOLD_INK,
                      }}><MapPin size={18} strokeWidth={1.8} /></div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: active ? GOLD : INK }}>حضوري</div>
                        <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .7 }}>استوديو كاسيت</div>
                      </div>
                    </div>
                    <div style={{ direction: 'ltr', textAlign: 'left', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: active ? GOLD : INK2 }}>218</span>
                        <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: INK2 }}>JOD</span>
                        <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .42, textDecoration: 'line-through' }}>260</span>
                      </div>
                    </div>
                  </button>
                );
              })()}

              {/* Online — cool teal */}
              {(() => {
                const active = mode === 'online';
                return (
                  <button role="radio" aria-checked={active} onClick={() => scrollToCohorts('online')}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                      background: active ? ONLINE_BG : 'rgba(24,32,47,.03)',
                      border: `2px solid ${active ? 'rgba(30,122,133,.60)' : 'rgba(30,122,133,.24)'}`,
                      borderRadius: 14, padding: '14px 18px', cursor: 'pointer', transition: '.22s',
                      direction: 'rtl', boxShadow: active ? '0 4px 18px rgba(30,122,133,.16)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, display: 'grid', placeContent: 'center', flexShrink: 0,
                        background: active ? TEAL : 'rgba(30,122,133,.14)', color: active ? '#fff' : TEAL,
                      }}><Wifi size={18} strokeWidth={1.8} /></div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: active ? TEAL : INK }}>مباشر تفاعلي (Online LIVE)</div>
                        <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .7 }}>{openOnline.length} دفعات متاحة</div>
                      </div>
                    </div>
                    <div style={{ direction: 'ltr', textAlign: 'left', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: active ? TEAL : INK2 }}>$150</span>
                        <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .42, textDecoration: 'line-through' }}>$200</span>
                      </div>
                    </div>
                  </button>
                );
              })()}
            </div>

            {/* ── Downloads ── */}
            <div style={{ marginTop: 12, display: 'flex', gap: 10, direction: 'rtl', flexWrap: 'wrap' }}>
              {[
                { href: `${import.meta.env.BASE_URL}voiceover-inperson.pdf`, label: 'كتيّب حضوري',           accent: GOLD_INK,  bg: 'rgba(255,193,7,.10)',  border: 'rgba(255,193,7,.35)' },
                { href: `${import.meta.env.BASE_URL}voiceover-online.pdf`,   label: 'كتيّب مباشر تفاعلي',  accent: TEAL,      bg: 'rgba(30,122,133,.10)', border: 'rgba(30,122,133,.35)' },
              ].map(({ href, label, accent, bg, border }) => (
                <a key={label} href={href} download
                  style={{
                    flex: 1, minWidth: 140,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    background: bg, border: `1.5px solid ${border}`,
                    borderRadius: 12, padding: '10px 16px',
                    fontFamily: F, fontWeight: 700, fontSize: 13, color: accent,
                    textDecoration: 'none', transition: 'filter .18s, transform .18s',
                  }}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { filter: 'brightness(1.08)', transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { filter: 'none', transform: 'none' })}
                >
                  <Download size={14} strokeWidth={2} /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* ─── Left side: unified card (cover + trainers + installment + share) ─── */}
          <div className="vo-hero-sticky" style={{ position: 'sticky', top: 84 }}>
            <div style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 20px 56px rgba(24,32,47,.14)',
              direction: 'rtl',
            }}>
              {/* Cover image */}
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={heroCover} alt="أساسيات التعليق والأداء الصوتي"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 78%' }} />
              </div>

              {/* Trainers strip — label directly under image */}
              <div style={{ borderBottom: `1px solid ${CREAM_LINE}` }}>
                <div style={{ padding: '10px 18px 4px', fontFamily: F, fontSize: 11, fontWeight: 700, color: INK2, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                  المدرّبون
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 18px 14px' }}>
                  {[
                    { img: rana,  name: 'رنا العزام' },
                    { img: yasar, name: 'يسار عبده' },
                    { img: omar,  name: 'عمر الدرابكة' },
                  ].map(({ img, name }) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={img} alt={name} style={{
                        width: 34, height: 34, borderRadius: '50%',
                        objectFit: 'cover', objectPosition: 'center top',
                        border: '2px solid rgba(255,193,7,.40)', flexShrink: 0,
                      }} />
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK }}>{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installment + Share — one row, no wrap */}
              <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.32)',
                  borderRadius: 999, padding: '8px 12px',
                  fontFamily: F, fontWeight: 700, fontSize: 12.5, color: '#16a34a',
                  flex: 1, justifyContent: 'center', whiteSpace: 'nowrap',
                }}>
                  <CreditCard size={14} strokeWidth={1.8} /> بإمكانية التقسيط
                </span>
                <button onClick={onShare} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: GOLD, border: 'none',
                  borderRadius: 999, padding: '8px 12px', cursor: 'pointer',
                  fontFamily: F, fontWeight: 700, fontSize: 12.5, color: GOLD_INK,
                  transition: 'filter .15s', flex: 1, justifyContent: 'center', whiteSpace: 'nowrap',
                }}
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
   § Page root
   ══════════════════════════════════════════════════════════════ */
export default function CourseVoiceoverPage() {
  const [heroMode,   setHeroMode]   = useState<'onsite' | 'online'>('onsite');
  const [shareOpen,  setShareOpen]  = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  return (
    <div dir="rtl" className="vo-page" style={{ background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @media print {
          .nav, .site-footer { display: none !important; }
          body { background: #fff; color: #000; }
          .curriculum { break-inside: avoid; }
        }
        /* Print curriculum only */
        body.print-curriculum-only .vo-page > *:not(.vo-curriculum) { display: none !important; }
        body.print-curriculum-only .vo-curriculum button { display: none !important; }
        @media (max-width: 700px) {
          /* Hero */
          .vo-hero-grid   { grid-template-columns: 1fr !important; }
          .vo-hero-sticky { position: static !important; }

          /* Cohort row — wrap so register column drops below on narrow screens */
          .vo-cohort-row-inner { flex-wrap: wrap !important; }
          .vo-cohort-register  {
            flex-shrink: 0 !important;
            width: 100% !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding-top: 10px !important;
            border-top: 1px solid rgba(255,255,255,.08) !important;
          }
          .vo-fill-bar { flex: 1 !important; width: auto !important; }

          /* About section — stack columns */
          .vo-about-grid  { grid-template-columns: 1fr !important; }

          /* Goals — 2 cols instead of 3 on small phones, 1 col on very small */
          .vo-goals-grid  { grid-template-columns: repeat(2,1fr) !important; }

          /* Curriculum tabs — stack vertically */
          .vo-curriculum-tabs-wrap { flex-direction: column !important; }
          .vo-curriculum-tabs-wrap button { border-radius: 10px !important; padding: 10px 14px !important; justify-content: flex-start !important; }

          /* Curriculum cards — single column */
          .vo-curriculum-cards { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 420px) {
          /* Very small phones: goals also single column */
          .vo-goals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HeroSection mode={heroMode} onModeChange={setHeroMode} onShare={() => setShareOpen(true)} />
      <CohortsSection defaultMode={heroMode} />
      <AboutSection />
      <OutcomesSection />
      <CurriculumSection />
      <TrainersSection />
      <SiteFooter />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="أساسيات التعليق والأداء الصوتي — كاسيت أكاديمي"
        description="البرنامج التأسيسي الشامل لتعليق الصوت وإنتاج ديمو صوتي احترافي"
      />
    </div>
  );
}
