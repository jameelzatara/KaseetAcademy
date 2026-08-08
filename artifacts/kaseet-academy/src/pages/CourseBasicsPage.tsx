/**
 * CourseBasicsPage — أساسيات التعليق والأداء الصوتي
 * مبنيّة بالكامل حسب brief-course-page.md + cohorts.json
 *
 * المبدأ: الفاتح للقراءة · الغامق للفعل
 */

import { useState, useRef, useEffect } from 'react';
import {
  MapPin, Wifi, Clock, Users, Award, CalendarDays, Globe, Download,
  CreditCard, Video, User, Lock, PlayCircle, AudioLines, Volume2,
  SlidersHorizontal, Mic, Sparkles, Briefcase, AudioWaveform,
  GraduationCap, Printer, ChevronDown, MessageCircle, ArrowLeft,
  TrendingUp, Info, FileText, Receipt, ShieldCheck,
} from 'lucide-react';

/* ── Asset imports ──────────────────────────────────────────── */
import ayaImg    from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg from '@assets/ياقوت__1785619557679.jpeg';
import yasar     from '@assets/course_01_instructor_1785428932171.jpeg';
import rana      from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar      from '@assets/trainer-omar_1785428945248.jpg';
import heroCover from '@assets/course_02_cover_1785675184235.jpg';

/* ── Cohorts data ──────────────────────────────────────────── */
import cohortsRaw from '../data/cohorts-basics.json';

type Cohort = {
  id: number; mode: 'onsite' | 'online'; status: 'open' | 'running';
  trainer: string; start: string; end: string;
  start_ar: string; end_ar: string; days: string;
  time_24: string; time_ar: string; platform: string;
  enrolled: number; capacity: number; remaining: number; fill: number;
};
const COHORTS = cohortsRaw.cohorts as Cohort[];
const openOnsite  = COHORTS.filter(c => c.status === 'open'    && c.mode === 'onsite');
const openOnline  = COHORTS.filter(c => c.status === 'open'    && c.mode === 'online');
const runOnsite   = COHORTS.filter(c => c.status === 'running' && c.mode === 'onsite');
const runOnline   = COHORTS.filter(c => c.status === 'running' && c.mode === 'online');

/* ── Design tokens (from brief §1) ──────────────────────────── */
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

/* ── Cohort fill bar ───────────────────────────────────────── */
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

/* ── Cohort row (§4.1 layout) ──────────────────────────────── */
function CohortRow({ c, onRegister }: { c: Cohort; onRegister: (id: number) => void }) {
  const isOpen    = c.status === 'open';
  const isRunning = c.status === 'running';
  const hot       = c.remaining <= 3 && c.remaining > 0;
  const full      = c.remaining === 0;
  const dayNum    = new Date(c.start).getDate().toString();
  const monthMap: Record<string,string> = {
    '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو',
    '07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر',
  };
  const monthNum = c.start.split('-')[1];
  const monthAr  = monthMap[monthNum] ?? '';

  return (
    <div style={{
      background: CARD_HI, borderRadius: 16,
      border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.07)'}`,
      padding: 'clamp(14px,2vw,20px)',
      opacity: isRunning ? 0.72 : 1,
      direction: 'rtl',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        {/* Date box */}
        <div style={{
          width: 56, height: 56, borderRadius: 12, flexShrink: 0,
          background: isOpen ? 'rgba(255,193,7,.12)' : 'rgba(255,255,255,.06)',
          border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.10)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 20, color: isOpen ? GOLD : 'rgba(252,251,251,.55)', lineHeight: 1 }}>{dayNum}</span>
          <span style={{ fontFamily: F, fontSize: 11, color: isOpen ? 'rgba(255,193,7,.70)' : 'rgba(252,251,251,.40)', lineHeight: 1, marginTop: 2 }}>{monthAr}</span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {/* Cohort # */}
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: OFF }}>
              الدفعة #{c.id}
            </span>
            {/* Status badge */}
            {isOpen && (
              <span style={{
                background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.35)',
                color: GOLD, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11,
                padding: '2px 10px',
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
            {/* Availability badge */}
            {isOpen && !full && (
              <span style={{
                background: 'rgba(255,193,7,.10)', color: GOLD,
                borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11,
                padding: '2px 10px', border: '1px solid rgba(255,193,7,.22)',
              }}>متاح التسجيل</span>
            )}
            {full && (
              <span style={{
                background: 'rgba(255,255,255,.06)', color: 'rgba(252,251,251,.45)',
                borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11,
                padding: '2px 10px', border: '1px solid rgba(255,255,255,.10)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Lock size={11} strokeWidth={1.8} /> نفدت المقاعد
              </span>
            )}
            {/* Platform */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,.58)',
            }}>
              {c.mode === 'online'
                ? <Video size={12} strokeWidth={1.8} />
                : <MapPin size={12} strokeWidth={1.8} />}
              {c.platform}
            </span>
          </div>

          {/* Fill bar + seats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FillBar fill={c.fill} remaining={c.remaining} />
            <span style={{
              fontFamily: F, fontSize: 12, fontWeight: hot ? 700 : 500,
              color: hot ? '#E8836F' : full ? 'rgba(252,251,251,.42)' : 'rgba(252,251,251,.62)',
            }}>
              {full ? 'نفدت المقاعد' : hot ? `${c.remaining} مقاعد متبقية فقط` : `${c.remaining} مقاعد متبقية`}
            </span>
          </div>

          {/* Lower detail line */}
          <div style={{
            fontFamily: F, fontSize: 12.5, color: 'rgba(252,251,251,.52)',
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6,
          }}>
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
      </div>

      {/* Register button — only for open */}
      {isOpen && !full && (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={() => onRegister(c.id)}
            style={{
              background: GOLD, color: INK,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontFamily: F, fontWeight: 800, fontSize: 14,
              padding: '10px 22px',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 16px rgba(255,193,7,.35)',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { transform:'translateY(-1px)', boxShadow:'0 6px 20px rgba(255,193,7,.45)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { transform:'none', boxShadow:'0 4px 16px rgba(255,193,7,.35)' })}
          >
            سجّل الآن <ArrowLeft size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Cohorts section (dark §4) ─────────────────────────────── */
function CohortsSection({ defaultMode }: { defaultMode: 'onsite' | 'online' }) {
  const [tab, setTab] = useState<'onsite' | 'online'>(defaultMode);
  const [showRunning, setShowRunning] = useState(false);
  const open    = tab === 'onsite' ? openOnsite   : openOnline;
  const running = tab === 'onsite' ? runOnsite    : runOnline;
  const runCount = running.length;

  const handleRegister = (cohortId: number) => {
    const c = COHORTS.find(x => x.id === cohortId);
    if (!c) return;
    const msg = `السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي — الدفعة #${cohortId} — ${c.mode === 'onsite' ? 'حضوري' : 'عن بُعد'}`;
    window.open(waLink('962771052222', msg), '_blank');
  };

  return (
    <section id="cohorts" style={{
      position: 'relative', overflow: 'hidden', isolation: 'isolate',
      background: CANVAS, padding: '80px 0',
      borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}`,
    }}>
      {/* Dot-grid geometric background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none" viewBox="0 0 800 600">
          <defs>
            <pattern id="cal" width="56" height="56" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.055)" />
              <line x1="0" y1="0" x2="56" y2="0" stroke="rgba(255,255,255,.020)" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="56" stroke="rgba(255,255,255,.020)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#cal)" />
        </svg>
      </div>
      {/* Gradient orbs */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
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

        {/* Mode tabs — كرتا اختيار النمط */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, direction: 'rtl', flexWrap: 'wrap' }}>
          {([
            { key: 'onsite', label: 'حضوري', count: openOnsite.length, icon: <MapPin size={16} strokeWidth={1.8} /> },
            { key: 'online', label: 'عن بُعد', count: openOnline.length, icon: <Wifi size={16} strokeWidth={1.8} /> },
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
                    color: active ? INK : 'rgba(252,251,251,.55)',
                    flexShrink: 0,
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

        {/* Open cohorts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {open.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
        </div>

        {/* Running cohorts — collapsible */}
        {runCount > 0 && (
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
            <button
              onClick={() => setShowRunning(v => !v)}
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
                style={{ transform: showRunning ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
            </button>
            {showRunning && (
              <div style={{ background: 'rgba(0,0,0,.18)', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {running.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Partner */}
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

/* ── Light-section title ───────────────────────────────────── */
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

/* ── About / Overview section ──────────────────────────────── */
function AboutSection() {
  const GOALS = [
    { icon: <AudioLines size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'ألوان التعليق الصوتي', text: 'إتقان جميع ألوان التعليق الصوتي: الإعلانات، الرد الآلي، الكتب الصوتية، الوثائقيات، الأخبار والدوبلاج.' },
    { icon: <Volume2 size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'مخارج الحروف والنطق', text: 'تحسين مخارج الحروف وضبط الأداء اللغوي والتخلص من عيوب النطق.' },
    { icon: <SlidersHorizontal size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'الطبقات الصوتية والإيقاع', text: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس واكتساب مرونة صوتية كاملة.' },
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,        title: 'كسر رهبة الميكروفون', text: 'التأقلم الكامل مع البيئة الصوتية الاحترافية والعمل بثقة تامة.' },
    { icon: <Sparkles size={22} strokeWidth={1.8} color={GOLD_INK} />,   title: 'الثقة والحضور الصوتي', text: 'بناء شخصية صوتية قوية تعكس الاحترافية أمام العملاء وشركات الإنتاج.' },
    { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />,  title: 'التواصل المهني', text: 'فهم سوق العمل الصوتي والتفاعل مع التوجيهات الإخراجية بكفاءة.' },
  ];
  const waAya   = waLink('962790234483', 'السلام عليكم، أرغب في الاستفسار عن التسجيل في دورة أساسيات التعليق والأداء الصوتي (حضوري)');
  const waYaqt  = waLink('962771052222', 'السلام عليكم، أرغب في الاستفسار عن التسجيل في دورة أساسيات التعليق والأداء الصوتي (عن بُعد)');

  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>

        {/* Consultant cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16, marginBottom: 56 }}>
          {[
            { name: 'آية القماز', role: 'مستشارة التسجيل · وجاهي', img: ayaImg, href: waAya, phone: '+962 79 023 4483' },
            { name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · عن بُعد', img: yaqoutImg, href: waYaqt, phone: '+962 77 105 2222' },
          ].map(({ name, role, img, href, phone }) => (
            <div key={name} style={{
              background: CANVAS, borderRadius: 18, padding: '20px',
              boxShadow: '0 12px 36px rgba(24,32,47,.16)',
              direction: 'rtl',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={img} alt={name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `2px solid ${GOLD_LINE}` }} />
                  <span style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid #1A2533' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: OFF }}>{name}</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 2 }}>{role}</div>
                  <div style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,.70)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} strokeWidth={1.8} />يومياً 10:00 صباحاً – 7:00 مساءً
                  </div>
                </div>
              </div>
              <a href={href} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: GOLD, color: INK,
                fontFamily: F, fontWeight: 800, fontSize: 13.5,
                padding: '10px 0', borderRadius: 10,
                textDecoration: 'none', marginBottom: 8,
              }}>
                <MessageCircle size={15} strokeWidth={1.8} /> تواصل الآن
              </a>
              <div style={{ textAlign: 'center', fontFamily: F, fontSize: 12, color: MUTED }}>{phone}</div>
            </div>
          ))}
        </div>

        {/* Goal cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {GOALS.map(({ icon, title, text }) => (
            <div key={title} style={{
              background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`,
              borderRadius: 18, padding: '26px 24px',
              boxShadow: '0 12px 34px rgba(24,32,47,.07)',
              transition: 'transform .25s, box-shadow .25s, border-color .25s',
            }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 18px 44px rgba(24,32,47,.12)', borderColor:'rgba(138,98,0,.30)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 12px 34px rgba(24,32,47,.07)', borderColor:`${CREAM_LINE}` })}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: 'rgba(255,193,7,.16)', color: GOLD_INK,
                display: 'grid', placeContent: 'center', marginBottom: 16,
              }}>{icon}</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Outcomes section ──────────────────────────────────────── */
function OutcomesSection() {
  const CARDS = [
    {
      icon: <AudioWaveform size={22} strokeWidth={1.8} color={GOLD_INK} />,
      title: 'تسجيلات استوديو عالية الجودة',
      text: 'عيّنات صوتية احترافية مسجّلة بأحدث اللاقطات داخل استوديوهات كاسيت الفعلية.',
    },
    {
      icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,
      title: 'ديمو صوتي احترافي (Voice Demo CV)',
      text: 'ملفّ صوتي متكامل مُهندَس بأحدث المؤثّرات، يستعرض خامات صوتك في مختلف ألوان التعليق.',
    },
    {
      icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,
      title: 'شهادة معتمدة رسمياً',
      text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.',
    },
  ];

  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>المخرجات التدريبية المتوقّعة</SecTitle>

        {/* 3 outcome cards */}
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

        {/* Graduation project block (§6.1) */}
        <div style={{
          background: CREAM_CARD,
          border: `2px solid ${GOLD}`,
          borderRadius: 22, padding: 'clamp(24px,3vw,36px)',
          boxShadow: '0 0 0 6px rgba(255,193,7,.10), 0 22px 60px rgba(24,32,47,.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, direction: 'rtl' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={22} strokeWidth={1.8} color={GOLD_INK} />
            </div>
            <div>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,21px)', color: INK, margin: 0 }}>مشروع التخرّج · الإنتاج الفعلي في الاستوديو</h3>
            </div>
          </div>

          <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8, margin: '0 0 24px', direction: 'rtl' }}>
            بعد إتمام محاضرات الدورة، تبدأ مرحلة الإنتاج الفعلي: <strong style={{ color: INK }}>تحجز الاستوديو ثلاث جلسات، كلّ جلسة ساعة واحدة، بإشراف مهندس الصوت.</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 20, direction: 'rtl' }}>
            {[
              { num: '1+2', title: 'الجلسة الأولى والثانية — التمرين على نصوصك', body: 'تتمرّن على المايك في بيئة تسجيل حقيقية، ويُصحَّح أداؤك جملةً بجملة، عبر ألوان التعليق التي درستها.' },
              { num: '3', title: 'الجلسة الثالثة — تسجيل مشروعك', body: 'جلسة تسجيل احترافية تُنتج فيها عملك النهائي، شاملاً كلّ الألوان الصوتية التي تدرّبت عليها.' },
            ].map(({ num, title, body }) => (
              <div key={num} style={{ background: CREAM, borderRadius: 14, padding: '18px', border: `1px solid ${CREAM_LINE}` }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, background: 'rgba(255,193,7,.16)',
                  display: 'grid', placeContent: 'center', marginBottom: 10,
                  fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD_INK,
                }}>{num}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: INK, margin: '0 0 6px' }}>{title}</h4>
                <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(255,193,7,.10)', borderRadius: 12, padding: '14px 18px',
            direction: 'rtl', display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
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

/* ── Curriculum section ────────────────────────────────────── */
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

const LECTURES_ONLINE = [
  { title: 'الاستوديو المنزلي والمعدات',    desc: 'كيفية تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة، واختيار الميكروفون المناسب وبرامج التسجيل.' },
  { title: 'أساسيات الصوت والتنفس',         desc: 'تأسيس مهاري شامل: مناطق الرنين الصوتي ومعادن الصوت، التنفس الحجابي وإدارة النَفَس، وتطوير الحضور الصوتي.' },
  { title: 'النطق ومخارج الحروف',           desc: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي، والتخلص من "الفم الكسول" والنطق الرخو.' },
  { title: 'اللغة العربية والتحرير اللغوي', desc: 'قواعد لغوية تطبيقية: الهمزات والتنوين والمدود، فن الوقف والابتداء، ومنهجية التحرير اللغوي قبل التسجيل.' },
  { title: 'التلوين الانفعالي والمشاعر',    desc: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع: شجرة المشاعر، ترميز المشاعر داخل النص، والتحكم بكثافة العاطفة.' },
  { title: 'تطبيقات التعليق الصوتي',        desc: 'ورشة تطبيقية: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات والأخبار.' },
];

function CurriculumSection() {
  const [tab,          setTab]          = useState<'onsite' | 'online'>('onsite');
  const [openLec,      setOpenLec]      = useState<number | null>(null);
  const [showProdPhase, setShowProdPhase] = useState(false);
  const isOnsite = tab === 'onsite';
  const lecs = isOnsite ? LECTURES_ONSITE : LECTURES_ONLINE;
  const numColor = isOnsite ? GOLD_INK : TEAL;
  const numBg    = isOnsite ? 'rgba(255,193,7,.16)' : 'rgba(30,122,133,.12)';
  const badgeBg  = isOnsite ? 'rgba(255,193,7,.12)' : 'rgba(30,122,133,.10)';
  const badgeCol = isOnsite ? GOLD_INK : TEAL;
  const badgeLabel = isOnsite ? 'داخل الاستوديو' : 'لقاء تفاعلي مباشر';
  const badgeIcon  = isOnsite ? <MapPin size={12} strokeWidth={1.8} /> : <Wifi size={12} strokeWidth={1.8} />;

  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <SecTitle>الخطة الدراسية</SecTitle>
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: `1px solid ${CREAM_LINE}`,
              borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
              fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2,
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Printer size={15} strokeWidth={1.8} color={INK2} /> طباعة المنهج
          </button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(24,32,47,.07)', borderRadius: 14, padding: 4 }}>
          {([
            { key: 'onsite', label: 'حضوري — 8 لقاءات · 16 ساعة', icon: <MapPin size={14} strokeWidth={1.8} /> },
            { key: 'online', label: 'عن بُعد — 6 محاضرات · 12 ساعة', icon: <Wifi size={14} strokeWidth={1.8} /> },
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

        {/* Lecture list */}
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
                  {/* Lecture number */}
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

        {/* Online note about production phase */}
        {!isOnsite && (
          <div style={{
            background: `rgba(30,122,133,.08)`, border: `1px solid rgba(30,122,133,.22)`,
            borderRadius: 12, padding: '14px 18px', marginBottom: 20, direction: 'rtl',
          }}>
            <p style={{ fontFamily: F, fontSize: 13.5, color: TEAL, margin: 0, fontWeight: 700 }}>
              + مشروع التخرّج: ثلاث جلسات إنتاج مباشرة مع مهندس الصوت — تماماً كما في الحضوري، لكن عن بُعد.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Trainers section ──────────────────────────────────────── */
type TrainerBadge = { label: string; type: 'achieve' | 'cert' | 'qual' };
const TRAINERS = [
  {
    img: rana, name: 'رنا العزام', title: 'مدرّبة التعليق الصوتي',
    bio: 'مدرّبة معتمدة ورائدة في التعليق الصوتي العربي، تجمع بين الأكاديمية والتطبيق الميداني في سوق الإنتاج الإذاعي والمرئي.',
    badges: [
      { label: '+3,000 طالب مدرَّب', type: 'achieve' },
      { label: 'خبرة +10 سنوات',     type: 'achieve' },
      { label: 'مدرّبة معتمدة',       type: 'cert' },
    ] as TrainerBadge[],
  },
  {
    img: yasar, name: 'يسار عبده', title: 'مدرّب التعليق والأداء الصوتي',
    bio: 'صوت إذاعي ومسرحي متمرّس، يتخصص في تقنيات الأداء الاحترافي وتطوير الأصوات الناشئة في سوق المحتوى الصوتي.',
    badges: [
      { label: 'خبرة +15 سنة',         type: 'achieve' },
      { label: 'مدرّب معتمد دولياً',   type: 'cert' },
      { label: 'إذاعة ومسرح',          type: 'qual' },
    ] as TrainerBadge[],
  },
  {
    img: omar, name: 'عمر الدرابكة', title: 'مدرّب الأداء والإنتاج الصوتي',
    bio: 'منتج صوتي ومهندس بث محترف، يربط بين التقنية والأداء الصوتي ليمنح المتدرّب إمكانات استوديو حقيقية من يومه الأول.',
    badges: [
      { label: 'هندسة الصوت والبث',   type: 'qual' },
      { label: 'إنتاج صوتي محترف',    type: 'achieve' },
      { label: 'مدرّب ومهندس معتمد',  type: 'cert' },
    ] as TrainerBadge[],
  },
];

function TrainerBadgeChip({ badge }: { badge: TrainerBadge }) {
  const styles: Record<TrainerBadge['type'], React.CSSProperties> = {
    achieve: { background: 'rgba(255,193,7,.14)', color: GOLD_INK, border: '1px solid rgba(255,193,7,.28)' },
    cert:    { background: 'rgba(30,122,133,.10)', color: TEAL,     border: '1px solid rgba(30,122,133,.22)' },
    qual:    { background: 'rgba(24,32,47,.07)',   color: INK2,     border: `1px solid ${CREAM_LINE}` },
  };
  const Icon = badge.type === 'achieve' ? Award : badge.type === 'cert' ? ShieldCheck : GraduationCap;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      borderRadius: 999, padding: '3px 10px',
      fontFamily: F, fontWeight: 700, fontSize: 11.5,
      ...styles[badge.type],
    }}>
      <Icon size={12} strokeWidth={1.8} />{badge.label}
    </span>
  );
}

function TrainersSection() {
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}`, position: 'relative', overflow: 'hidden' }}>
      {/* Grid pattern (§8 geo--grid) */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 220, zIndex: 0, pointerEvents: 'none',
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
                  width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top',
                  border: `2px solid rgba(255,193,7,.35)`, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: INK }}>{name}</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: INK2, marginTop: 3 }}>{title}</div>
                </div>
              </div>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.8, margin: '0 0 16px' }}>{bio}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {badges.map(b => <TrainerBadgeChip key={b.label} badge={b} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Hero section ──────────────────────────────────────────── */
function HeroSection({ mode, onModeChange }: { mode: 'onsite' | 'online'; onModeChange: (m: 'onsite' | 'online') => void }) {
  const cohortsRef = useRef<HTMLElement | null>(null);

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

  return (
    <section style={{ background: CREAM, paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 60 }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(400px,38vw)', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
          {/* Left: Text content */}
          <div>
            {/* Breadcrumb badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{
                fontFamily: F, fontSize: 12, fontWeight: 700, color: GOLD_INK,
                background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)',
                borderRadius: 999, padding: '3px 12px',
              }}>أساسيات التعليق</span>
            </div>

            <h1 style={{
              fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)',
              color: INK, margin: '0 0 16px', lineHeight: 1.2,
            }}>
              أساسيات التعليق والأداء الصوتي
            </h1>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,17px)', color: INK2, lineHeight: 1.85, margin: '0 0 28px', maxWidth: 560 }}>
              البرنامج التأسيسي الشامل لتعليق الصوت: من بناء الصوت وتطوير النطق إلى إنتاج ديمو صوتي احترافي في استوديوهات كاسيت.
            </p>

            {/* Dynamic badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
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
                background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)',
                borderRadius: 999, padding: '6px 13px',
                fontFamily: F, fontWeight: 700, fontSize: 12.5, color: GOLD_INK, textDecoration: 'none',
              }}>
                <Award size={16} strokeWidth={1.8} />شهادة معتمدة من وجيز
              </a>
            </div>

            {/* Mode picker (§2.3) */}
            <div role="radiogroup" aria-label="اختر طريقة الدراسة" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
              {([
                { m: 'onsite', label: 'حضوري', icon: <MapPin size={18} strokeWidth={1.8} />, price: '218', unit: 'JOD', strike: '260', note: 'استوديو كاسيت' },
                { m: 'online', label: 'عن بُعد', icon: <Wifi size={18} strokeWidth={1.8} />,    price: '$150', unit: '', strike: '$200', note: 'Google Meet' },
              ] as const).map(({ m, label, icon, price, unit, strike, note }) => {
                const active = mode === m;
                return (
                  <button key={m}
                    role="radio" aria-checked={active}
                    onClick={() => scrollToCohorts(m)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                      background: active ? 'rgba(255,193,7,.10)' : 'rgba(24,32,47,.04)',
                      border: `1.5px solid ${active ? GOLD : CREAM_LINE}`,
                      borderRadius: 14, padding: '14px 18px', cursor: 'pointer',
                      transition: '.2s', direction: 'rtl', textAlign: 'right',
                      boxShadow: active ? `0 0 0 1px ${GOLD_LINE}` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, display: 'grid', placeContent: 'center',
                        background: active ? GOLD : 'rgba(24,32,47,.08)',
                        color: active ? INK : INK2, flexShrink: 0,
                      }}>{icon}</div>
                      <div>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: active ? INK : INK2 }}>{label}</div>
                        <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .65 }}>{note}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, direction: 'ltr' }}>
                      <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: active ? GOLD_INK : INK2 }}>{price}</span>
                      {unit && <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: INK2, opacity: .7 }}>{unit}</span>}
                      <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .45, textDecoration: 'line-through' }}>{strike}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Installment + download */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F, fontSize: 13, color: GOLD_INK, display: 'flex', alignItems: 'center', gap: 5 }}>
                <CreditCard size={15} strokeWidth={1.8} /> بإمكانية التقسيط
              </span>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: `1px solid ${CREAM_LINE}`,
                borderRadius: 9, padding: '7px 14px', cursor: 'pointer',
                fontFamily: F, fontWeight: 700, fontSize: 12.5, color: INK2, transition: 'background .15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Download size={14} strokeWidth={1.8} /> تحميل الكتيّب
              </button>
            </div>
          </div>

          {/* Right: Cover image card */}
          <div style={{ position: 'sticky', top: 84 }}>
            <div style={{
              aspectRatio: '4/3', overflow: 'hidden', borderRadius: 18,
              boxShadow: '0 24px 64px rgba(24,32,47,.18)',
              border: `1px solid ${CREAM_LINE}`,
            }}>
              <img src={heroCover} alt="أساسيات التعليق والأداء الصوتي" style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: '50% 78%',
              }} />
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
                    <img src={img} alt={name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(255,193,7,.35)', flexShrink: 0 }} />
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

/* ── Main page ─────────────────────────────────────────────── */
export default function CourseBasicsPage() {
  const [heroMode, setHeroMode] = useState<'onsite' | 'online'>('onsite');

  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);

  return (
    <div dir="rtl" style={{ background: CREAM, minHeight: '100vh' }}>
      {/* Print styles */}
      <style>{`
        @media print {
          .nav, .site-footer, button { display: none !important; }
          body { background: #fff; color: #000; }
          .curriculum { break-inside: avoid; }
        }
        @media (max-width: 700px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-sticky { position: static !important; }
        }
      `}</style>

      <HeroSection mode={heroMode} onModeChange={setHeroMode} />
      <CohortsSection defaultMode={heroMode} />
      <AboutSection />
      <OutcomesSection />
      <CurriculumSection />
      <TrainersSection />
    </div>
  );
}
