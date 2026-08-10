/**
 * CoursePageLayout — القالب الموحَّد لجميع صفحات الدورات
 *
 * اختبار القبول:
 *   غيّر لون شارة التقسيط (INSTALLMENT_STYLE) مرة واحدة ←
 *   يتغير في كل صفحات الدورات الستة بلا استثناء.
 */
import { useState } from 'react';
import {
  ArrowRight, MapPin, Wifi, CreditCard, Download, Share2,
  GraduationCap, AudioLines, Volume2, SlidersHorizontal,
  Mic, Sparkles, Briefcase, Tv, BookOpen, Globe, Zap, Award,
  Star, Video, MessageCircle, ChevronDown, Clock, Calendar,
} from 'lucide-react';
import InstructorsSection from './InstructorsSection';
import FAQSection         from './FAQSection';
import ShareModal         from './ShareModal';
import { usePageMeta }    from '../hooks/usePageMeta';
import type { CourseData, CohortBatch, GoalItem, OutcomeItem, SyllabusSession } from '../types/courseTypes';
import { ayaImg, yaqoutImg } from '../data/instructors';
import { waLink } from '../pages/shared/coursePageHelpers';

/* ─── design tokens ────────────────────────────────────────────── */
const F   = "'Tajawal', sans-serif";
const FP  = "'Poppins', sans-serif";
const G   = '#FFC107';
const OFF = 'rgba(252,251,251,0.96)';
const MUT = 'rgba(252,251,251,0.62)';
const DH  = '#1e293b';
const DM  = '#475569';
const CANVAS = '#1A2533';
const LBG    = '#F5F4F0';
const INNER: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px)' };

/* ─── INSTALLMENT BADGE STYLE ──────────────────────────────────────────────────
   اختبار القبول: عدّل هنا فقط — يتغيّر في كل الصفحات
   ─────────────────────────────────────────────────────────────────────────── */
const INSTALLMENT_STYLE: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'rgba(31,157,87,.12)', border: '1px solid rgba(31,157,87,.42)',
  color: '#4FBF83', fontSize: 13.5, fontWeight: 700,
  padding: '9px 15px', borderRadius: 999, marginTop: 12,
  fontFamily: F,
};
/* ──────────────────────────────────────────────────────────────────────────── */

/* ─── lucide icon lookup ─────────────────────────────────────────────── */
const ICONS: Record<string, React.ElementType> = {
  AudioLines, Volume2, SlidersHorizontal, Mic, Sparkles, Briefcase,
  Tv, BookOpen, Globe, Zap, Award, Star, Video, GraduationCap, Clock,
};
function DynIcon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} color={color ?? G} strokeWidth={2} />;
}

/* ─── CohortBatchRow ─────────────────────────────────────────────────────── */
function CohortBatchRow({ c, waHref, mode }: { c: CohortBatch; waHref: string; mode: 'onsite' | 'online' }) {
  const isOpen    = c.status === 'open';
  const isRunning = c.status === 'running';
  const remaining = c.remaining ?? 10;
  const fill      = c.fill ?? 0;
  const isHot     = isOpen && remaining <= 3;
  const accent    = mode === 'onsite' ? G : '#67e8f9';
  const accentRgb = mode === 'onsite' ? '255,193,7' : '103,232,249';
  const dimColor  = isRunning ? 'rgba(252,251,251,0.35)' : OFF;

  /* date badge content */
  const badgeTop = c.start_ar ? c.start_ar.split(' ')[1] ?? c.badgeDate ?? '' : c.badgeDate ?? '';
  const badgeNum = c.start_ar ? c.start_ar.split(' ')[0] ?? '' : '';

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden', direction: 'rtl',
      border: `1px solid ${isOpen ? `rgba(${accentRgb},0.32)` : 'rgba(255,255,255,0.07)'}`,
      background: isOpen ? `rgba(${accentRgb},0.04)` : 'rgba(255,255,255,0.02)',
      opacity: isRunning ? 0.6 : 1,
      display: 'flex', alignItems: 'stretch',
    }}>
      {/* date badge */}
      <div style={{
        width: 60, flexShrink: 0, background: 'rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '10px 4px', gap: 1,
      }}>
        {c.batchLabel ? (
          <>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 13, color: '#fff', lineHeight: 1 }}>{c.batchLabel}</span>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.45)', lineHeight: 1.3, textAlign: 'center' }}>{badgeTop}</span>
          </>
        ) : (
          <>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.45)' }}>{badgeTop}</span>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 18, color: '#fff', lineHeight: 1 }}>{badgeNum}</span>
          </>
        )}
      </div>

      {/* main info */}
      <div style={{ flex: 1, minWidth: 0, padding: '10px 14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 5, alignItems: 'center' }}>
          {isOpen && (
            <span style={{
              fontFamily: F, fontSize: 11, fontWeight: 700,
              background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.30)`,
              color: accent, borderRadius: 999, padding: '2px 9px',
            }}>متاح التسجيل</span>
          )}
          {isRunning && (
            <span style={{
              fontFamily: F, fontSize: 11, fontWeight: 700,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(252,251,251,0.55)', borderRadius: 999, padding: '2px 9px',
            }}>جارية الآن</span>
          )}
          {c.platform && (
            <span style={{ fontFamily: F, fontSize: 11, color: MUT }}>
              {c.platform === 'استوديو كاسيت' ? '🏢' : '📹'} {c.platform}
            </span>
          )}
        </div>

        <div style={{ fontFamily: F, fontSize: 12.5, color: dimColor, marginBottom: 3 }}>
          {c.trainer && <span>{c.trainer}</span>}
          {c.start_ar && c.end_ar && (
            <span style={{ color: MUT }}> · من {c.start_ar} إلى {c.end_ar}</span>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, alignItems: 'center' }}>
          {c.days && c.days !== 'سيتم التحديد' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: F, fontSize: 11.5, color: MUT }}>
              <Calendar size={10} color={MUT} strokeWidth={2} />
              {c.days}
            </span>
          )}
          {c.time_ar && c.time_ar !== 'تُحدَّد المواعيد قريباً' && (
            <span style={{ fontFamily: F, fontSize: 11, color: 'rgba(252,251,251,0.45)' }}>{c.time_ar}</span>
          )}
          {c.days === 'سيتم التحديد' && (
            <span style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,0.40)' }}>المواعيد تُحدَّد قريباً</span>
          )}
        </div>
      </div>

      {/* seats + CTA */}
      <div style={{
        width: 140, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 12px', background: 'rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8,
      }}>
        {isOpen ? (
          <>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontFamily: F, fontSize: 9.5, color: 'rgba(252,251,251,0.40)' }}>متبقية</span>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 9.5, color: isHot ? '#F97316' : accent }}>
                  {remaining} مقعد
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99, width: `${fill}%`,
                  background: isHot
                    ? 'linear-gradient(90deg,#FFC107,#F97316)'
                    : mode === 'onsite' ? G : '#67e8f9',
                  transition: 'width .4s',
                }} />
              </div>
            </div>
            <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', textAlign: 'center', fontFamily: F, fontWeight: 700,
              fontSize: 11, color: mode === 'onsite' ? '#0d1125' : '#051520',
              background: accent, borderRadius: 8, padding: '6px 8px', textDecoration: 'none',
            }}>
              سجّل الآن ←
            </a>
          </>
        ) : (
          <span style={{
            display: 'block', textAlign: 'center', fontFamily: F, fontWeight: 700,
            fontSize: 10.5, color: 'rgba(252,251,251,0.40)', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '5px 8px',
          }}>
            جارية الآن
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── GoalCard ──────────────────────────────────────────────────────────── */
function GoalCard({ g }: { g: GoalItem }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 18, padding: '22px 22px',
      boxShadow: '0 8px 24px rgba(24,32,47,0.06)',
      transition: 'transform .2s, box-shadow .2s, border-color .2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(24,32,47,0.11)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(138,98,0,0.25)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(24,32,47,0.06)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.08)';
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(255,193,7,0.14)', display: 'grid',
        placeContent: 'center', marginBottom: 14,
      }}>
        <DynIcon name={g.icon} size={20} color="#92670a" />
      </div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: DH, marginBottom: 7 }}>{g.title}</div>
      <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{g.desc}</div>
    </div>
  );
}

/* ─── OutcomeCard ─────────────────────────────────────────────────────── */
function OutcomeCard({ o }: { o: OutcomeItem }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,193,7,0.18)',
      borderRadius: 18, padding: '24px 22px',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'rgba(255,193,7,0.12)', display: 'grid',
        placeContent: 'center', marginBottom: 16,
      }}>
        <DynIcon name={o.icon} size={22} color={G} />
      </div>
      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF, marginBottom: 8 }}>{o.title}</div>
      <div style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.75 }}>{o.desc}</div>
    </div>
  );
}

/* ─── SyllabusItem ──────────────────────────────────────────────────── */
function SyllabusItem({ s, index, total }: { s: SyllabusSession; index: number; total: number }) {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, '0');
  return (
    <div style={{ borderBottom: index < total - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: '100%', textAlign: 'right', direction: 'rtl', background: 'none', border: 'none',
        padding: '15px 20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: FP, fontWeight: 700, fontSize: 11, color: G,
          background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.25)',
          borderRadius: 7, padding: '3px 9px', flexShrink: 0,
        }}>{num}</span>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14.5, color: DH, flex: 1 }}>{s.title}</span>
        <ChevronDown size={15} color={DM} strokeWidth={2.5}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: '0 20px 15px 20px', paddingRight: '54px' }}>
          <p style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.8, margin: 0 }}>{s.content}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function CoursePageLayout({ course }: { course: CourseData }) {
  const hasBoth   = !!(course.modes.onsite && course.modes.live);
  const defaultM  = course.modes.onsite ? 'onsite' : 'live';
  const [mode, setMode]           = useState<'onsite' | 'live'>(defaultM);
  const [shareOpen, setShareOpen] = useState(false);
  const [sylTab, setSylTab]       = useState<'onsite' | 'live'>(defaultM);
  const [runExpand, setRunExpand] = useState(false);

  const activeMode  = course.modes[mode]!;
  const cohortMode  = mode === 'onsite' ? 'onsite' : 'online';
  const allCohorts  = course.cohorts.filter(c => c.mode === cohortMode);
  const openCohorts = allCohorts.filter(c => c.status === 'open');
  const runCohorts  = allCohorts.filter(c => c.status === 'running');

  const waHref  = waLink(activeMode.waPhone, activeMode.waMsg);
  const ayaHref = '#'; // task #54 — awaiting آية القماز number
  const yaqHref = waLink('962771052222', `السلام عليكم، أرغب في الاستفسار عن دورة ${course.title}.`);

  const curSyllabus = sylTab === 'onsite'
    ? course.syllabus.onsite ?? []
    : course.syllabus.live ?? [];

  // OG meta
  usePageMeta(
    (course.og.title ?? course.title) + ' — كاسيت أكاديمي',
    course.og.description,
    course.og.image,
  );

  const handleModeChange = (m: 'onsite' | 'live') => {
    setMode(m);
    setSylTab(m);
  };

  /* ── render ── */
  return (
    <div dir="rtl" style={{ background: LBG, minHeight: '100vh', fontFamily: F }}>

      {/* ①  HERO ──────────────────────────────────────────────────── */}
      <section style={{ background: LBG, paddingTop: 'clamp(88px,10vw,108px)', paddingBottom: 0 }}>
        <div style={{ ...INNER }}>

          {/* back link */}
          <a href="/kaseet-academy/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontFamily: F, fontSize: 14.5, fontWeight: 700,
            color: '#92670a', textDecoration: 'none', marginBottom: 20,
            transition: 'gap .2s',
          }}>
            <ArrowRight size={17} /> العودة إلى الدورات
          </a>

          <div style={{
            display: 'flex', gap: 'clamp(20px,3vw,40px)', alignItems: 'flex-start',
            flexWrap: 'wrap' as const,
          }}>

            {/* LEFT col: pricing card ─────────────────────────────── */}
            <div style={{
              width: 'clamp(260px,30%,320px)', flexShrink: 0,
              background: '#181325', borderRadius: 22,
              border: '1px solid rgba(255,193,7,0.22)',
              padding: 'clamp(18px,2.5vw,24px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
              order: 2,
            }}>

              {/* mode picker */}
              {hasBoth ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {(['onsite', 'live'] as const).map(m => {
                    const md = course.modes[m]!;
                    const on = mode === m;
                    return (
                      <button key={m} onClick={() => handleModeChange(m)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        background: on ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.04)',
                        border: on ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.10)',
                        borderRadius: 12, padding: '13px 15px', cursor: 'pointer',
                        boxShadow: on ? `0 0 0 1px ${G}` : 'none',
                        fontFamily: F, color: on ? '#fff' : MUT,
                        transition: 'all .2s',
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: on ? G : 'rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {m === 'onsite'
                              ? <MapPin size={15} color={on ? '#0d1125' : MUT} strokeWidth={2.2} />
                              : <Wifi size={15} color={on ? '#0d1125' : MUT} strokeWidth={2.2} />
                            }
                          </span>
                          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{md.label}</span>
                        </span>
                        <span style={{ textAlign: 'left', flexShrink: 0 }}>
                          <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 20, color: on ? G : MUT }}>
                            {md.price}
                          </span>
                          {' '}
                          <span style={{ fontFamily: F, fontSize: 12, color: on ? 'rgba(255,193,7,0.7)' : MUT }}>
                            {md.currency === 'JOD' ? 'د.أ' : '$'}
                          </span>
                          {md.old && <s style={{ display: 'block', fontSize: 11, color: 'rgba(252,251,251,0.28)' }}>{md.old}</s>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* single-mode price display */
                <div style={{ marginBottom: 16, padding: '14px 16px', background: 'rgba(255,193,7,0.08)', borderRadius: 12, border: `1px solid rgba(255,193,7,0.22)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {activeMode.label.includes('مباشر')
                      ? <Wifi size={17} color={G} strokeWidth={2} />
                      : <MapPin size={17} color={G} strokeWidth={2} />
                    }
                    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>{activeMode.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 28, color: G }}>{activeMode.price}</span>
                    <span style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,193,7,0.7)' }}>
                      {activeMode.currency === 'JOD' ? 'د.أ' : '$'}
                    </span>
                    {activeMode.old && (
                      <s style={{ fontFamily: FP, fontSize: 14, color: 'rgba(252,251,251,0.28)' }}>{activeMode.old}</s>
                    )}
                  </div>
                </div>
              )}

              {/* ── INSTALLMENT BADGE ── اختبار القبول: عدّل هنا فقط */}
              <div style={INSTALLMENT_STYLE}>
                <CreditCard size={17} />
                <span>بإمكانية التقسيط</span>
              </div>
              {/* ─────────────────────────────────────────────────────── */}

              {/* register CTA */}
              <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: G, color: '#0d1125', fontFamily: F, fontWeight: 800, fontSize: 15,
                borderRadius: 12, padding: '13px 20px', textDecoration: 'none',
                marginTop: 14, width: '100%', boxSizing: 'border-box' as const,
              }}>
                احجز مقعدك الآن ←
              </a>

              {/* brochure buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {course.modes.onsite?.brochure && (
                  <a href={course.modes.onsite.brochure} download style={ghostBtn}>
                    <Download size={14} /> تحميل الكتيّب الوجاهي
                  </a>
                )}
                {course.modes.live?.brochure && (
                  <a href={course.modes.live.brochure} download style={ghostBtn}>
                    <Download size={14} /> تحميل كتيّب مباشر تفاعلي
                  </a>
                )}
              </div>
            </div>

            {/* RIGHT col: title + tags + facts + share ────────────── */}
            <div style={{ flex: 1, minWidth: 260, order: 1 }}>

              {/* stage + tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 14 }}>
                {course.stage && (
                  <span style={{
                    fontFamily: F, fontWeight: 700, fontSize: 12,
                    background: 'rgba(255,193,7,0.14)', border: '1px solid rgba(255,193,7,0.35)',
                    color: '#92670a', borderRadius: 999, padding: '4px 12px',
                  }}>{course.stage}</span>
                )}
                {course.tags.map(t => (
                  <span key={t} style={{
                    fontFamily: F, fontSize: 12, fontWeight: 600,
                    background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)',
                    color: DM, borderRadius: 999, padding: '4px 12px',
                  }}>{t}</span>
                ))}
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(24px,3.5vw,40px)', color: DH, margin: '0 0 10px', lineHeight: 1.2 }}>
                {course.title}
              </h1>

              {course.tagline && (
                <p style={{ fontFamily: F, fontSize: 15.5, color: DM, lineHeight: 1.75, margin: '0 0 20px' }}>
                  {course.tagline}
                </p>
              )}

              {/* fact badges — dynamic */}
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 6 }}>
                {[
                  `${course.seats} مقاعد محدودة`,
                  'شهادة معتمدة',
                  `${activeMode.sessions} لقاءات`,
                  `${activeMode.hours} ساعة تدريبية`,
                  course.language,
                ].map(label => (
                  <span key={label} style={{
                    fontFamily: F, fontSize: 13, fontWeight: 700,
                    background: '#fff', border: '1px solid rgba(0,0,0,0.10)',
                    color: DH, borderRadius: 999, padding: '6px 14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }}>{label}</span>
                ))}
              </div>

              {/* features bar */}
              <div style={{
                display: 'flex', flexWrap: 'wrap' as const, gap: 16, marginTop: 22,
                padding: '14px 18px', background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14,
              }}>
                {[
                  { icon: <GraduationCap size={16} color={G} />, text: 'شهادة معتمدة من تطبيق وجيز' },
                  { icon: <Sparkles size={16} color={G} />,      text: 'خبراء معتمدون' },
                  { icon: <Clock size={16} color={G} />,         text: 'وصول دائم إلى التسجيلات والتحديثات' },
                ].map(f => (
                  <span key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 12.5, fontWeight: 600, color: DM }}>
                    {f.icon} {f.text}
                  </span>
                ))}
              </div>

              {/* share button */}
              <button onClick={() => setShareOpen(true)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 16, background: 'none', border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
                fontFamily: F, fontWeight: 700, fontSize: 13, color: DM,
              }}>
                <Share2 size={15} color={DM} /> مشاركة الدورة
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ② COHORTS — dark section ───────────────────────────────── */}
      <section style={{
        background: CANVAS, borderTop: `2px solid ${G}`, borderBottom: `2px solid ${G}`,
        paddingBlock: 'clamp(40px,4.5vw,64px)', marginTop: 40,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* blobs */}
        <div className="ka-blob-1" />
        <div className="ka-blob-2" />

        <div style={{ ...INNER, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' as const }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 28, background: G, borderRadius: 4 }} />
              <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: OFF, margin: 0 }}>
                المواعيد المتاحة للتسجيل
              </h2>
            </div>
          </div>
          <p style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 24 }}>
            🕒 جميع المواعيد بتوقيت عمّان (GMT+3)
          </p>

          {/* mode tabs — only if both modes */}
          {hasBoth && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {(['onsite', 'live'] as const).map(m => {
                const cnt = course.cohorts.filter(c => c.mode === (m === 'onsite' ? 'onsite' : 'online') && c.status === 'open').length;
                const on  = mode === m;
                return (
                  <button key={m} onClick={() => handleModeChange(m)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: on ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${on ? G : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
                    fontFamily: F, fontWeight: 700, fontSize: 13,
                    color: on ? G : MUT,
                  }}>
                    {m === 'onsite' ? <MapPin size={14} color={on ? G : MUT} /> : <Wifi size={14} color={on ? G : MUT} />}
                    {m === 'onsite' ? 'حضوري' : 'مباشر تفاعلي'}
                    <span style={{
                      background: on ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.08)',
                      borderRadius: 999, padding: '2px 8px', fontSize: 11,
                    }}>{cnt} دفعات متاحة</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* open cohorts */}
          {openCohorts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {openCohorts.map(c => (
                <CohortBatchRow key={c.id} c={c} waHref={waHref} mode={cohortMode} />
              ))}
            </div>
          ) : (
            <div style={{
              padding: '20px 24px', borderRadius: 14,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: F, fontSize: 14, color: MUT, textAlign: 'center',
            }}>
              لا توجد دفعات متاحة حالياً — سيُعلَن عنها قريباً
            </div>
          )}

          {/* running cohorts — collapsed social proof */}
          {runCohorts.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setRunExpand(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
                fontFamily: F, fontWeight: 700, fontSize: 12.5, color: MUT,
              }}>
                <ChevronDown size={14} color={MUT} strokeWidth={2.5}
                  style={{ transform: runExpand ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
                {runCohorts.length} دفعة جارية حالياً — دليل اجتماعي
              </button>
              {runExpand && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                  {runCohorts.map(c => (
                    <CohortBatchRow key={c.id} c={c} waHref={waHref} mode={cohortMode} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ③ ABOUT + GOALS + ADVISOR CARD ───────────────────────── */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,72px)' }}>
        <div style={{ ...INNER }}>
          <div style={{ display: 'flex', gap: 'clamp(24px,3vw,48px)', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>

            {/* main: about + goals */}
            <div style={{ flex: 1, minWidth: 260 }}>

              {/* about */}
              {course.about && (
                <div style={{ marginBottom: 36 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 4, height: 28, background: G, borderRadius: 4 }} />
                    <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,24px)', color: DH, margin: 0 }}>
                      نبذة البرنامج
                    </h2>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 15, color: DM, lineHeight: 1.9, margin: 0 }}>{course.about}</p>
                </div>
              )}

              {/* 6 goals */}
              {course.goals && course.goals.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 28, background: G, borderRadius: 4 }} />
                    <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,24px)', color: DH, margin: 0 }}>
                      الأهداف التدريبية
                    </h2>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 16,
                  }}>
                    {course.goals.map(g => <GoalCard key={g.title} g={g} />)}
                  </div>
                </>
              )}
            </div>

            {/* aside: advisor help card */}
            <div style={{ width: 'clamp(240px,28%,300px)', flexShrink: 0 }}>
              <div style={{
                background: '#181325', borderRadius: 20,
                border: '1px solid rgba(255,193,7,0.22)',
                padding: 'clamp(18px,2.5vw,24px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
              }}>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 16, color: OFF, margin: '0 0 6px' }}>
                  هل تحتاج مساعدة في التسجيل؟
                </h3>
                <p style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.75, margin: '0 0 20px' }}>
                  تحدّث مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <AdvisorRow
                    name="آية القماز"
                    role="مستشارة التسجيل · وجاهي"
                    photo={ayaImg}
                    href={ayaHref}
                    disabled
                  />
                  <AdvisorRow
                    name="ياقوت الخشاشنة"
                    role="مستشارة التسجيل · مباشر تفاعلي"
                    photo={yaqoutImg}
                    href={yaqHref}
                  />
                </div>
                <div style={{
                  marginTop: 18, padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontFamily: F, fontSize: 12, color: MUT,
                }}>
                  🕒 <strong style={{ color: OFF }}>أوقات التواصل:</strong> السبت – الخميس · 10 صباحاً – 8 مساءً
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ④ SYLLABUS ────────────────────────────────────────────── */}
      <section style={{ background: LBG, paddingBottom: 'clamp(48px,5vw,72px)' }}>
        <div style={{ ...INNER }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 4, height: 28, background: G, borderRadius: 4 }} />
            <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,26px)', color: DH, margin: 0 }}>
              الخطة الدراسية
            </h2>
          </div>

          {/* comparison cards — only if both modes */}
          {hasBoth && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              {[
                {
                  label: 'حضوري — استوديو كاسيت',
                  points: ['تفاعل مباشر مع المدرّب والزملاء', 'تطبيق عملي داخل الاستوديوهات', 'بيئة تعلّم منظَّمة بلا إلهاء'],
                },
                {
                  label: 'مباشر تفاعلي (Online LIVE)',
                  points: ['مرونة كاملة في الوقت والمكان', 'تسجيلات المحاضرات متاحة دائماً', 'وفّر وقت التنقّل واستثمره في التعلّم'],
                },
              ].map(card => (
                <div key={card.label} style={{
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '16px 18px',
                }}>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: DH, marginBottom: 10 }}>{card.label}</div>
                  {card.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ color: G, fontSize: 14, flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: F, fontSize: 13, color: DM }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* syllabus tabs — only if both have content */}
          {hasBoth && course.syllabus.onsite && course.syllabus.live && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['onsite', 'live'] as const).map(m => {
                const label = m === 'onsite'
                  ? `حضوري — ${course.modes.onsite?.sessions} لقاءات · ${course.modes.onsite?.hours} ساعة`
                  : `مباشر تفاعلي — ${course.modes.live?.sessions} لقاءات · ${course.modes.live?.hours} ساعة`;
                const on = sylTab === m;
                return (
                  <button key={m} onClick={() => setSylTab(m)} style={{
                    fontFamily: F, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    background: on ? '#181325' : '#fff',
                    border: `1px solid ${on ? G : 'rgba(0,0,0,0.10)'}`,
                    color: on ? G : DM, borderRadius: 10, padding: '8px 16px',
                  }}>{label}</button>
                );
              })}
            </div>
          )}

          {/* unit header (for grouped sessions) */}
          {(() => {
            let lastUnit = '';
            return (
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                {curSyllabus.map((s, i) => {
                  const showUnit = s.unit && s.unit !== lastUnit;
                  if (s.unit) lastUnit = s.unit;
                  return (
                    <div key={i}>
                      {showUnit && (
                        <div style={{
                          background: 'rgba(255,193,7,0.07)', borderBottom: '1px solid rgba(255,193,7,0.15)',
                          padding: '10px 20px',
                          fontFamily: F, fontWeight: 800, fontSize: 13, color: '#92670a',
                        }}>{s.unit}</div>
                      )}
                      <SyllabusItem s={s} index={i} total={curSyllabus.length} />
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* graduation project bar */}
          {course.hasGradProject && (
            <div style={{
              marginTop: 16, border: `1.5px solid ${G}`, borderRadius: 16,
              background: 'rgba(255,193,7,0.06)', padding: '18px 22px',
            }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: DH, marginBottom: 6 }}>
                🎓 + مشروع التخرّج
              </div>
              <p style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.8, margin: 0 }}>
                {course.gradProjectNote ?? '3 جلسات إنتاج مباشرة مع مهندس الصوت، لتنفيذ تطبيقات صوتية حقيقية وإخراج ملفات جاهزة للاستخدام المهني — تماماً كما في التدريب الحضوري، ولكن عبر اللقاءات المباشرة.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ⑤ OUTCOMES — dark section ─────────────────────────────── */}
      {course.outcomes && course.outcomes.length > 0 && (
        <section style={{ background: CANVAS, paddingBlock: 'clamp(48px,5vw,72px)' }}>
          <div style={{ ...INNER }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 4, height: 28, background: G, borderRadius: 4 }} />
              <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: OFF, margin: 0 }}>
                المخرجات التدريبية
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {course.outcomes.map(o => <OutcomeCard key={o.title} o={o} />)}
            </div>

            {/* voiceover-specific graduation project block */}
            {course.hasGradProject && !course.gradProjectNote && (
              <div style={{
                marginTop: 24, background: 'rgba(255,193,7,0.06)',
                border: `1.5px solid rgba(255,193,7,0.25)`, borderRadius: 18,
                padding: '24px 26px',
              }}>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 16, color: G, margin: '0 0 12px' }}>
                  🎓 مشروع التخرّج · الإنتاج الفعلي في الاستوديو
                </h3>
                <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85, margin: 0 }}>
                  بعد إتمام لقاءات الدورة، تبدأ مرحلة الإنتاج الفعلي: <strong style={{ color: OFF }}>تحجز الاستوديو ثلاث جلسات، كلّ جلسة ساعة واحدة، بإشراف مهندس الصوت.</strong>
                  {' '}الجلستان الأولى والثانية للتمرين على نصوصك، والجلسة الثالثة لتسجيل مشروعك النهائي. المخرج: ديمو صوتي احترافي (Voice Demo CV) جاهز لإرساله إلى العملاء وشركات الإنتاج.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ⑥ INSTRUCTORS ──────────────────────────────────────────── */}
      <InstructorsSection instructors={course.instructors} />

      {/* ⑦ FAQ ──────────────────────────────────────────────────── */}
      <FAQSection />

      {/* share modal */}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} url={typeof window !== 'undefined' ? window.location.href : ''} />
    </div>
  );
}

/* ─── AdvisorRow ──────────────────────────────────────────────────── */
function AdvisorRow({ name, role, photo, href, disabled }: {
  name: string; role: string; photo: string; href: string; disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={photo} alt={name} style={{
          width: 46, height: 46, borderRadius: '50%', objectFit: 'cover',
          objectPosition: 'center top', border: '2px solid rgba(255,193,7,0.35)',
        }} />
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 9, height: 9, borderRadius: '50%',
          background: disabled ? '#94a3b8' : '#22c55e',
          border: '2px solid #181325',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 800, fontSize: 13.5, color: OFF, marginBottom: 1 }}>{name}</div>
        <div style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 11.5, color: MUT, marginBottom: 7 }}>{role}</div>
        <a
          href={disabled ? undefined : href}
          target={disabled ? undefined : '_blank'}
          rel="noopener noreferrer"
          aria-disabled={disabled}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: disabled ? 'rgba(255,255,255,0.08)' : G,
            color: disabled ? 'rgba(252,251,251,0.45)' : '#0d1125',
            fontFamily: "'Tajawal', sans-serif", fontWeight: 800,
            fontSize: 12, padding: '5px 12px', borderRadius: 8, textDecoration: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            border: disabled ? '1px solid rgba(255,255,255,0.10)' : 'none',
          }}
          onClick={disabled ? e => e.preventDefault() : undefined}
        >
          تواصل عبر واتساب <MessageCircle size={12} />
        </a>
      </div>
    </div>
  );
}

/* ─── ghost button style ─────────────────────────────────────────── */
const ghostBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
  fontFamily: F, fontWeight: 700, fontSize: 12.5, color: MUT,
  textDecoration: 'none', transition: 'border-color .2s, color .2s',
};
