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
import ShareModal from '../components/ShareModal';

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
    <div style={{
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
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

          {/* Fill bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FillBar fill={c.fill} remaining={c.remaining} />
            <span style={{
              fontFamily: F, fontSize: 12, fontWeight: hot ? 700 : 500,
              color: hot ? '#E8836F' : full ? 'rgba(252,251,251,.42)' : 'rgba(252,251,251,.62)',
            }}>
              {full ? 'نفدت المقاعد' : hot ? `${c.remaining} مقاعد متبقية فقط` : `${c.remaining} مقاعد متبقية`}
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

        {/* Register column — other side (flex-end in RTL = left visually) */}
        {isOpen && !full && (
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => onRegister(c.id)}
              style={{
                background: GOLD, color: INK, border: 'none', borderRadius: 10, cursor: 'pointer',
                fontFamily: F, fontWeight: 800, fontSize: 13.5, padding: '10px 18px',
                display: 'inline-flex', alignItems: 'center', gap: 5,
                boxShadow: '0 4px 16px rgba(255,193,7,.35)', transition: 'transform .15s, box-shadow .15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => Object.assign(e.currentTarget.style, { transform:'translateY(-1px)', boxShadow:'0 6px 20px rgba(255,193,7,.45)' })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { transform:'none', boxShadow:'0 4px 16px rgba(255,193,7,.35)' })}
            >
              سجّل الآن <ArrowLeft size={13} strokeWidth={2} />
            </button>
            {/* Seat counter */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: F, fontSize: 12, fontWeight: 700,
              color: hot ? '#E8836F' : 'rgba(252,251,251,.55)',
              background: hot ? 'rgba(232,131,111,.12)' : 'rgba(255,255,255,.07)',
              border: `1px solid ${hot ? 'rgba(232,131,111,.30)' : 'rgba(255,255,255,.12)'}`,
              borderRadius: 999, padding: '3px 10px',
            }}>
              <Users size={11} strokeWidth={1.8} />
              {hot ? `${c.remaining} فقط` : `${c.remaining} مقعد`}
            </span>
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
   § About — §5 · program overview + advisors side-by-side + 6 goals
   ══════════════════════════════════════════════════════════════ */
function AboutSection() {
  const GOALS = [
    { icon: <AudioLines size={22} strokeWidth={1.8} color={GOLD_INK} />,        title: 'ألوان التعليق الصوتي',     text: 'إتقان جميع ألوان التعليق الصوتي: الإعلانات، الرد الآلي، الكتب الصوتية، الوثائقيات، الأخبار والدوبلاج.' },
    { icon: <Volume2 size={22} strokeWidth={1.8} color={GOLD_INK} />,           title: 'مخارج الحروف والنطق',     text: 'تحسين مخارج الحروف وضبط الأداء اللغوي والتخلص من عيوب النطق.' },
    { icon: <SlidersHorizontal size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'الطبقات الصوتية والإيقاع', text: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس واكتساب مرونة صوتية كاملة.' },
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,               title: 'كسر رهبة الميكروفون',     text: 'التأقلم الكامل مع البيئة الصوتية الاحترافية والعمل بثقة تامة.' },
    { icon: <Sparkles size={22} strokeWidth={1.8} color={GOLD_INK} />,          title: 'الثقة والحضور الصوتي',    text: 'بناء شخصية صوتية قوية تعكس الاحترافية أمام العملاء وشركات الإنتاج.' },
    { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />,         title: 'التواصل المهني',           text: 'فهم سوق العمل الصوتي والتفاعل مع التوجيهات الإخراجية بكفاءة.' },
  ];

  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>

        {/* 2-col: program description | advisor cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(330px,42%)', gap: 20, marginBottom: 52, alignItems: 'start' }}>

          {/* Program description */}
          <div style={{
            background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
            borderRadius: 18, padding: '28px 28px',
            boxShadow: '0 6px 20px rgba(24,32,47,.06)',
          }}>
            <p style={{ fontFamily: F, fontSize: 15.5, color: INK2, lineHeight: 2.05, margin: 0 }}>
              يسعى هذا البرنامج إلى إعداد وتأهيل المتدربين لاحتراف مجال التعليق الصوتي وتجهيزهم بالمهارات اللازمة للاندماج في سوق العمل. ترتكز أهدافنا على تطوير مخارج الحروف والنطق السليم، والتمكن من التحكم في الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون تماماً لتعزيز الثقة بالنفس وتنمية مهارات الإلقاء والتواصل المهني.
            </p>
          </div>

          {/* Advisor cards stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'آية القماز',      role: 'مستشارة التسجيل · حضوري',           img: ayaImg,    href: 'https://wa.me/962790234483', phone: '+962 79 023 4483' },
              { name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي',    img: yaqoutImg, href: 'https://wa.me/962771052222',  phone: '+962 77 105 2222' },
            ].map(({ name, role, img, href, phone }) => (
              <div key={name} style={{
                background: CANVAS, borderRadius: 16, padding: '16px 18px',
                boxShadow: '0 8px 24px rgba(24,32,47,.14)', direction: 'rtl',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={img} alt={name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `2px solid ${GOLD_LINE}` }} />
                    <span style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#22c55e', border: '2px solid #1A2533' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF }}>{name}</div>
                    <div style={{ fontFamily: F, fontSize: 11.5, color: MUTED, marginTop: 2 }}>{role}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: 'rgba(255,193,7,.65)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} strokeWidth={1.8} />يومياً 10:00 صباحاً – 7:00 مساءً
                    </div>
                  </div>
                </div>
                <a href={href} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: GOLD, color: INK, fontFamily: F, fontWeight: 800, fontSize: 13,
                  padding: '9px 0', borderRadius: 9, textDecoration: 'none', marginBottom: 6,
                }}>
                  <MessageCircle size={14} strokeWidth={1.8} /> تواصل الآن
                </a>
                <div style={{ textAlign: 'center', fontFamily: F, fontSize: 11.5, color: MUTED }}>{phone}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals sub-title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, direction: 'rtl' }}>
          <div style={{ width: 4, height: 26, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
          <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(18px,2.2vw,24px)', color: INK, margin: 0 }}>الأهداف المتحققة</h3>
        </div>

        {/* Goal cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          {GOALS.map(({ icon, title, text }) => (
            <div key={title} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 16, padding: '22px 20px',
              boxShadow: '0 6px 20px rgba(24,32,47,.06)',
              transition: 'transform .25s, box-shadow .25s, border-color .25s',
            }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 14px 36px rgba(24,32,47,.11)', borderColor:'rgba(138,98,0,.30)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 6px 20px rgba(24,32,47,.06)', borderColor:CREAM_LINE })}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: INK, margin: '0 0 7px' }}>{title}</h3>
              <p style={{ fontFamily: F, fontSize: 13, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
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
  { title: 'الصوت',                        desc: 'رحلة لاكتشاف مفهوم الصوت ومناطق خروجه ومعادنه، وصولاً إلى تحديد البصمة الصوتية الخاصة بك وإتقان فن تنويع الصوت.' },
  { title: 'التنفس',                        desc: 'مفتاح الصوت القوي؛ تتعلم فيه تشريح الجهاز التنفسي، تقنيات التنفس الحجابي والتحكم المركزي، وكيفية قراءة النَفَس داخل النص.' },
  { title: 'جهاز النطق',                    desc: 'تتبع رحلة الهواء من الرئة إلى نطق الحرف، مع التعرف على مخارج الحروف العربية الـ 28، وطرق التخلص من "الفم الكسول".' },
  { title: 'مهارة الاستماع والنقد السمعيّ', desc: 'تدريب أذنك لتصبح ناقدك الأول. يشمل حلقة التغذية الصوتية، منهجية نقد التسجيلات، والاستفادة من تجارب المحترفين.' },
  { title: 'اللغة العربيّة للمعلّق',        desc: 'قواعد مصممة خصيصاً لاحتياجات المعلق؛ تغطي الهمزات، اللام الشمسية والقمرية، فن الوقف والابتداء، ومنهجية التحرير اللغوي.' },
  { title: 'المشاعر',                       desc: 'اكتشف شجرة المشاعر وكيفية استحضار العاطفة بصدق دون تمثيل، مع تعلم ترميز المشاعر داخل النص والتحكم بكثافتها.' },
  { title: 'ألوان التعليق الصوتي',          desc: 'التدريب العملي والتطبيقي على الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.' },
  { title: 'التطبيق المهنيّ والانطلاق',     desc: 'بناء هويتك الصوتية وتسعير صوتك، فهم التعامل مع العملاء والمنصات، ومعرفة خطة الـ 100 يوم الأولى في السوق.' },
];

/* §7.1: online = 6 lectures, 7th moved to production phase block */
const LECTURES_ONLINE = [
  { title: 'الاستوديو المنزلي والمعدات',    desc: 'كيفية تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة، واختيار الميكروفون المناسب وبرامج التسجيل.' },
  { title: 'أساسيات الصوت والتنفس',         desc: 'تأسيس مهاري شامل: مناطق الرنين الصوتي ومعادن الصوت، التنفس الحجابي وإدارة النَفَس، وتطوير الحضور الصوتي.' },
  { title: 'النطق ومخارج الحروف',           desc: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي، والتخلص من "الفم الكسول" والنطق الرخو.' },
  { title: 'اللغة العربية والتحرير اللغوي', desc: 'قواعد لغوية تطبيقية: الهمزات والتنوين والمدود، فن الوقف والابتداء، ومنهجية التحرير اللغوي قبل التسجيل.' },
  { title: 'التلوين الانفعالي والمشاعر',    desc: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع: شجرة المشاعر، ترميز المشاعر داخل النص، والتحكم بكثافة العاطفة.' },
  { title: 'تطبيقات التعليق الصوتي',        desc: 'ورشة تطبيقية: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات والأخبار.' },
];

function CurriculumSection() {
  const [tab,     setTab]     = useState<'onsite' | 'online'>('onsite');
  const [openLec, setOpenLec] = useState<number | null>(null);

  const isOnsite    = tab === 'onsite';
  const lecs        = isOnsite ? LECTURES_ONSITE : LECTURES_ONLINE;
  const numColor    = isOnsite ? GOLD_INK : TEAL;
  const numBg       = isOnsite ? 'rgba(255,193,7,.16)' : 'rgba(30,122,133,.12)';
  const badgeBg     = isOnsite ? 'rgba(255,193,7,.12)' : 'rgba(30,122,133,.10)';
  const badgeCol    = isOnsite ? GOLD_INK : TEAL;
  const badgeLabel  = isOnsite ? 'داخل الاستوديو' : 'لقاء تفاعلي مباشر';
  const badgeIcon   = isOnsite ? <MapPin size={12} strokeWidth={1.8} /> : <Wifi size={12} strokeWidth={1.8} />;

  return (
    <section className="vo-curriculum" style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <SecTitle>الخطة الدراسية</SecTitle>
          {/* Print button — curriculum only */}
          <button
            onClick={() => {
              document.body.classList.add('print-curriculum-only');
              window.print();
              window.addEventListener('afterprint', () => {
                document.body.classList.remove('print-curriculum-only');
              }, { once: true });
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

        {/* Mode tabs — §7.2 colour distinguishes onsite/online */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(24,32,47,.07)', borderRadius: 14, padding: 4 }}>
          {([
            { key: 'onsite', label: 'حضوري — 8 لقاءات · 16 ساعة',     icon: <MapPin size={14} strokeWidth={1.8} /> },
            { key: 'online', label: 'مباشر تفاعلي (Online LIVE) — 6 محاضرات · 12 ساعة',  icon: <Wifi   size={14} strokeWidth={1.8} /> },
          ] as const).map(({ key, label, icon }) => (
            <button key={key} onClick={() => { setTab(key); setOpenLec(null); }} style={{
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

        {/* Accordion lecture list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }} className="curriculum">
          {lecs.map((lec, i) => {
            const open = openLec === i;
            return (
              <div key={i} style={{
                background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
                borderRadius: 14, overflow: 'hidden',
                boxShadow: open ? '0 8px 24px rgba(24,32,47,.09)' : '0 2px 8px rgba(24,32,47,.05)',
              }}>
                <button
                  onClick={() => setOpenLec(open ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    direction: 'rtl', textAlign: 'right',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: numBg, color: numColor,
                    display: 'grid', placeContent: 'center',
                    fontFamily: FP, fontWeight: 700, fontSize: 13,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: INK }}>{lec.title}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: badgeBg, color: badgeCol,
                      fontFamily: F, fontWeight: 700, fontSize: 11,
                      borderRadius: 999, padding: '2px 9px',
                    }}>
                      {badgeIcon}{badgeLabel}
                    </span>
                  </div>
                  <ChevronDown size={16} color={INK2} strokeWidth={2}
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
                </button>
                {open && (
                  <div style={{ padding: '4px 18px 16px 18px', paddingInlineStart: 66, direction: 'rtl' }}>
                    <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.8, margin: 0 }}>{lec.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Online: explicit note about production phase — §7.1 */}
        {!isOnsite && (
          <div style={{
            background: 'rgba(30,122,133,.08)', border: '1px solid rgba(30,122,133,.22)',
            borderRadius: 12, padding: '14px 18px', direction: 'rtl',
          }}>
            <p style={{ fontFamily: F, fontSize: 13.5, color: TEAL, margin: 0, fontWeight: 700 }}>
              + مشروع التخرّج: ثلاث جلسات إنتاج مباشرة مع مهندس الصوت — تماماً كما في الحضوري، مباشر تفاعلي (Online LIVE).
            </p>
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
    img: rana, name: 'رنا العزام', title: 'مدرّبة التعليق الصوتي',
    bio: 'مدرّبة معتمدة ورائدة في التعليق الصوتي العربي، تجمع بين الأكاديمية والتطبيق الميداني في سوق الإنتاج الإذاعي والمرئي.',
    badges: [
      { label: '+3,000 طالب مدرَّب', type: 'achieve' },
      { label: 'خبرة +10 سنوات',     type: 'achieve' },
      { label: 'مدرّبة معتمدة',       type: 'cert'    },
    ] as TrainerBadge[],
  },
  {
    img: yasar, name: 'يسار عبده', title: 'مدرّب التعليق والأداء الصوتي',
    bio: 'صوت إذاعي ومسرحي متمرّس، يتخصص في تقنيات الأداء الاحترافي وتطوير الأصوات الناشئة في سوق المحتوى الصوتي.',
    badges: [
      { label: 'خبرة +15 سنة',       type: 'achieve' },
      { label: 'مدرّب معتمد دولياً', type: 'cert'    },
      { label: 'إذاعة ومسرح',        type: 'qual'    },
    ] as TrainerBadge[],
  },
  {
    img: omar, name: 'عمر الدرابكة', title: 'مدرّب الأداء والإنتاج الصوتي',
    bio: 'منتج صوتي ومهندس بث محترف، يربط بين التقنية والأداء الصوتي ليمنح المتدرّب إمكانات استوديو حقيقية من يومه الأول.',
    badges: [
      { label: 'هندسة الصوت والبث',  type: 'qual'    },
      { label: 'إنتاج صوتي محترف',  type: 'achieve' },
      { label: 'مدرّب ومهندس معتمد', type: 'cert'    },
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
      {/* Grid pattern §8.1 */}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TRAINERS.map(({ img, name, title, bio, badges }) => (
            <div key={name} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 20, padding: '26px 22px',
              boxShadow: '0 12px 34px rgba(24,32,47,.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <img src={img} alt={name} style={{
                  width: 64, height: 64, borderRadius: '50%',
                  objectFit: 'cover', objectPosition: 'center top',
                  border: '2px solid rgba(255,193,7,.35)', flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: INK }}>{name}</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: INK2, marginTop: 3 }}>{title}</div>
                </div>
              </div>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.8, margin: '0 0 16px' }}>{bio}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {badges.map(b => <BadgeChip key={b.label} badge={b} />)}
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
    <section className="sec--hero" style={{ background: CREAM, paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 60 }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
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
                      border: `2px solid ${active ? 'rgba(255,193,7,.68)' : 'rgba(255,193,7,.24)'}`,
                      borderRadius: 14, padding: '14px 18px', cursor: 'pointer', transition: '.22s',
                      direction: 'rtl', boxShadow: active ? '0 4px 18px rgba(255,193,7,.18)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, display: 'grid', placeContent: 'center', flexShrink: 0,
                        background: active ? GOLD : 'rgba(255,193,7,.16)', color: active ? INK : GOLD_INK,
                      }}><MapPin size={18} strokeWidth={1.8} /></div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: active ? GOLD_INK : INK }}>حضوري</div>
                        <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .7 }}>استوديو كاسيت</div>
                      </div>
                    </div>
                    <div style={{ direction: 'ltr', textAlign: 'left', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: active ? GOLD_INK : INK2 }}>218</span>
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
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button role="radio" aria-checked={active} onClick={() => scrollToCohorts('online')}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                        background: active ? ONLINE_BG : 'rgba(24,32,47,.03)',
                        border: `2px solid ${active ? 'rgba(30,122,133,.60)' : 'rgba(30,122,133,.24)'}`,
                        borderRadius: '14px 14px 0 0', borderBottom: 'none',
                        padding: '14px 18px', cursor: 'pointer', transition: '.22s',
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
                          <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .7 }}>Google Meet</div>
                        </div>
                      </div>
                      <div style={{ direction: 'ltr', textAlign: 'left', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: active ? TEAL : INK2 }}>$150</span>
                          <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .42, textDecoration: 'line-through' }}>$200</span>
                        </div>
                      </div>
                    </button>
                    {/* Trainer mini cover — always visible below online card */}
                    <div style={{
                      background: 'rgba(30,122,133,.06)',
                      border: `2px solid ${active ? 'rgba(30,122,133,.60)' : 'rgba(30,122,133,.24)'}`,
                      borderTop: '1px solid rgba(30,122,133,.14)',
                      borderRadius: '0 0 14px 14px',
                      padding: '10px 18px',
                      display: 'flex', alignItems: 'center', gap: 12, direction: 'rtl',
                      transition: '.22s',
                    }}>
                      <div style={{ display: 'flex' }}>
                        {[rana, yasar, omar].map((img, i) => (
                          <img key={i} src={img} alt="" style={{
                            width: 28, height: 28, borderRadius: '50%',
                            objectFit: 'cover', objectPosition: 'center top',
                            border: '2px solid rgba(255,255,255,.9)',
                            marginInlineStart: i > 0 ? -9 : 0, flexShrink: 0,
                          }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: F, fontSize: 12.5, color: TEAL, fontWeight: 700 }}>
                        رنا العزام · يسار عبده · عمر الدرابكة
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── Action box: installment (green) + share + 2 downloads ── */}
            <div style={{
              marginTop: 14, background: 'rgba(24,32,47,.04)',
              border: `1px solid ${CREAM_LINE}`, borderRadius: 14, padding: '14px 18px',
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, direction: 'rtl',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.32)',
                borderRadius: 999, padding: '7px 13px',
                fontFamily: F, fontWeight: 700, fontSize: 13, color: '#16a34a',
              }}>
                <CreditCard size={15} strokeWidth={1.8} /> بإمكانية التقسيط
              </span>
              <button onClick={onShare} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: `1px solid ${CREAM_LINE}`,
                borderRadius: 999, padding: '7px 13px', cursor: 'pointer',
                fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, transition: 'background .15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Share2 size={14} strokeWidth={1.8} /> مشاركة الدورة
              </button>
              <a href={`${import.meta.env.BASE_URL}voiceover-inperson.pdf`} download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: `1px solid ${CREAM_LINE}`,
                  borderRadius: 999, padding: '7px 13px',
                  fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, textDecoration: 'none', transition: 'background .15s',
                }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >
                <Download size={14} strokeWidth={1.8} /> كتيّب حضوري
              </a>
              <a href={`${import.meta.env.BASE_URL}voiceover-online.pdf`} download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: `1px solid ${CREAM_LINE}`,
                  borderRadius: 999, padding: '7px 13px',
                  fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, textDecoration: 'none', transition: 'background .15s',
                }}
                onMouseEnter={hoverIn} onMouseLeave={hoverOut}
              >
                <Download size={14} strokeWidth={1.8} /> كتيّب مباشر تفاعلي
              </a>
            </div>
          </div>

          {/* ─── Left side: sticky cover + trainers strip ─── */}
          <div className="vo-hero-sticky" style={{ position: 'sticky', top: 84 }}>
            <div style={{
              aspectRatio: '4/3', overflow: 'hidden', borderRadius: 18,
              boxShadow: '0 24px 64px rgba(24,32,47,.18)', border: `1px solid ${CREAM_LINE}`,
            }}>
              <img src={heroCover} alt="أساسيات التعليق والأداء الصوتي"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 78%' }} />
            </div>
            {/* Trainers mini strip */}
            <div style={{
              marginTop: 14, background: CREAM_CARD, borderRadius: 14, padding: '12px 16px',
              border: `1px solid ${CREAM_LINE}`, direction: 'rtl',
              boxShadow: '0 4px 16px rgba(24,32,47,.07)',
            }}>
              <div style={{ fontFamily: F, fontSize: 12, color: INK2, marginBottom: 10 }}>المدرّبون</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { img: rana,  name: 'رنا العزام' },
                  { img: yasar, name: 'يسار عبده' },
                  { img: omar,  name: 'عمر الدرابكة' },
                ].map(({ img, name }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={img} alt={name} style={{
                      width: 34, height: 34, borderRadius: '50%',
                      objectFit: 'cover', objectPosition: 'center top',
                      border: '2px solid rgba(255,193,7,.35)', flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK }}>{name}</span>
                  </div>
                ))}
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
          .vo-hero-grid  { grid-template-columns: 1fr !important; }
          .vo-hero-sticky { position: static !important; }
        }
      `}</style>

      <HeroSection mode={heroMode} onModeChange={setHeroMode} onShare={() => setShareOpen(true)} />
      <CohortsSection defaultMode={heroMode} />
      <AboutSection />
      <OutcomesSection />
      <CurriculumSection />
      <TrainersSection />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="أساسيات التعليق والأداء الصوتي — كاسيت أكاديمي"
        description="البرنامج التأسيسي الشامل لتعليق الصوت وإنتاج ديمو صوتي احترافي"
      />
    </div>
  );
}
