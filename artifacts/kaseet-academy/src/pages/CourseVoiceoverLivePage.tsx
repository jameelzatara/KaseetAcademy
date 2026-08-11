/**
 * دورة التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE)
 * نفس ستايل CourseBasicsPage حرفياً · نمط واحد: أونلاين فقط
 */
import { useState, useEffect } from 'react';
import {
  Wifi, Clock, Users, Award, CalendarDays, Globe,
  CreditCard, Video, Lock, PlayCircle, AudioLines, Volume2,
  SlidersHorizontal, Mic, Sparkles, Briefcase, AudioWaveform,
  GraduationCap, Printer, ChevronDown, MessageCircle, ArrowLeft,
  Share2, ShieldCheck,
} from 'lucide-react';
import ShareModal from '../components/ShareModal';
import { usePageMeta } from '../hooks/usePageMeta';

import heroCover from '@assets/course-omar-bg_1785692015818.png';
import omarImg   from '@assets/trainer-omar_1785428945248.jpg';
import ranaImg   from '@assets/trainer-rana-azzam_1785428982698.JPG';
import ayaImg    from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg from '@assets/ياقوت__1785619557679.jpeg';

/* ── Design tokens ── */
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
const WRAP: React.CSSProperties = { maxWidth: 1180, margin: '0 auto', paddingInline: 'clamp(16px,4vw,48px)' };

function waLink(phone: string, msg: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Cohort data (online only) ── */
type Cohort = {
  id: number; mode: 'online'; status: 'open' | 'running';
  trainer: string; start: string; end: string;
  start_ar: string; end_ar: string; days: string;
  time_24: string; time_ar: string; platform: string;
  enrolled: number; capacity: number; remaining: number; fill: number;
};
const COHORTS: Cohort[] = [
  { id: 1, mode: 'online', status: 'open', trainer: 'عمر درابكة + رنا العزام',
    start: '2026-09-12', end: '2026-10-17', start_ar: '12 سبتمبر', end_ar: '17 أكتوبر',
    days: 'السبت', time_24: '19:00', time_ar: '7:00م – 9:00م',
    platform: 'Google Meet', enrolled: 4, capacity: 10, remaining: 6, fill: 40 },
  { id: 2, mode: 'online', status: 'open', trainer: 'عمر درابكة + رنا العزام',
    start: '2026-10-03', end: '2026-11-07', start_ar: '3 أكتوبر', end_ar: '7 نوفمبر',
    days: 'الثلاثاء / الخميس', time_24: '19:00', time_ar: '7:00م – 9:00م',
    platform: 'Google Meet', enrolled: 2, capacity: 10, remaining: 8, fill: 20 },
];
const openCohorts  = COHORTS.filter(c => c.status === 'open');
const runCohorts   = COHORTS.filter(c => c.status === 'running');

/* ── FillBar ── */
function FillBar({ fill, remaining }: { fill: number; remaining: number }) {
  const hot  = remaining <= 3 && remaining > 0;
  const full = remaining === 0;
  return (
    <div style={{ width: 120, height: 6, borderRadius: 999, background: 'rgba(255,255,255,.10)', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ height: '100%', width: `${fill}%`, borderRadius: 999, transition: 'width .5s',
        background: full ? 'rgba(255,255,255,.22)' : hot ? 'linear-gradient(90deg,#FFC107,#E8836F)' : GOLD }} />
    </div>
  );
}

/* ── CohortRow ── */
function CohortRow({ c, onRegister }: { c: Cohort; onRegister: (id: number) => void }) {
  const isOpen = c.status === 'open'; const isRunning = c.status === 'running';
  const hot = c.remaining <= 3 && c.remaining > 0; const full = c.remaining === 0;
  const dayNum = new Date(c.start).getDate().toString();
  const monthMap: Record<string,string> = {
    '01':'يناير','02':'فبراير','03':'مارس','04':'أبريل','05':'مايو','06':'يونيو',
    '07':'يوليو','08':'أغسطس','09':'سبتمبر','10':'أكتوبر','11':'نوفمبر','12':'ديسمبر',
  };
  const monthAr = monthMap[c.start.split('-')[1]] ?? '';
  return (
    <div style={{ background: CARD_HI, borderRadius: 16, border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.07)'}`, padding: 'clamp(14px,2vw,20px)', opacity: isRunning ? 0.72 : 1, direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0, background: isOpen ? 'rgba(255,193,7,.12)' : 'rgba(255,255,255,.06)', border: `1px solid ${isOpen ? GOLD_LINE : 'rgba(255,255,255,.10)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 20, color: isOpen ? GOLD : 'rgba(252,251,251,.55)', lineHeight: 1 }}>{dayNum}</span>
          <span style={{ fontFamily: F, fontSize: 11, color: isOpen ? 'rgba(255,193,7,.70)' : 'rgba(252,251,251,.40)', lineHeight: 1, marginTop: 2 }}>{monthAr}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: OFF }}>الدفعة #{c.id}</span>
            {isOpen && <span style={{ background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.35)', color: GOLD, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px' }}>تبدأ قريباً</span>}
            {isRunning && <span style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', color: 'rgba(252,251,251,.55)', borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}><PlayCircle size={11} strokeWidth={1.8} /> جارية الآن</span>}
            {isOpen && !full && <span style={{ background: 'rgba(255,193,7,.10)', color: GOLD, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px', border: '1px solid rgba(255,193,7,.22)' }}>متاح التسجيل</span>}
            {full && <span style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(252,251,251,.45)', borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 11, padding: '2px 10px', border: '1px solid rgba(255,255,255,.10)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Lock size={11} strokeWidth={1.8} /> نفدت المقاعد</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,.58)' }}><Video size={12} strokeWidth={1.8} />{c.platform}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FillBar fill={c.fill} remaining={c.remaining} />
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: hot ? 700 : 500, color: hot ? '#E8836F' : full ? 'rgba(252,251,251,.42)' : 'rgba(252,251,251,.62)' }}>
              {full ? 'نفدت المقاعد' : hot ? `${c.remaining} مقاعد متبقية فقط` : `${c.remaining} مقاعد متبقية`}
            </span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12.5, color: 'rgba(252,251,251,.52)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <span>من {c.start_ar} إلى {c.end_ar}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span>{c.days}</span>
            <span style={{ color: 'rgba(252,251,251,.25)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Clock size={11} strokeWidth={1.8} />{c.time_ar}</span>
          </div>
        </div>
      </div>
      {isOpen && !full && (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={() => onRegister(c.id)} style={{ background: GOLD, color: INK, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(255,193,7,.35)', transition: 'transform .15s, box-shadow .15s' }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { transform:'translateY(-1px)', boxShadow:'0 6px 20px rgba(255,193,7,.45)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { transform:'none', boxShadow:'0 4px 16px rgba(255,193,7,.35)' })}>
            سجّل الآن <ArrowLeft size={14} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── CohortsSection (online only — no tab) ── */
function CohortsSection() {
  const [showRunning, setShowRunning] = useState(false);
  const waMsg = `السلام عليكم، أرغب في التسجيل في دورة التعليق والأداء الصوتي (مباشر تفاعلي Online LIVE).`;
  const handleRegister = (id: number) => {
    const c = COHORTS.find(x => x.id === id);
    if (!c) return;
    const msg = `${waMsg} — الدفعة #${id}`;
    window.open(waLink('962771052222', msg), '_blank');
  };
  return (
    <section id="cohorts" style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: CANVAS, padding: '80px 0', borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}` }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none" viewBox="0 0 800 600">
          <defs><pattern id="cal-vl" width="56" height="56" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.055)" /><line x1="0" y1="0" x2="56" y2="0" stroke="rgba(255,255,255,.020)" strokeWidth="1" /><line x1="0" y1="0" x2="0" y2="56" stroke="rgba(255,255,255,.020)" strokeWidth="1" /></pattern></defs>
          <rect width="800" height="600" fill="url(#cal-vl)" />
        </svg>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 62% 48% at 78% 6%, rgba(255,193,7,.14), transparent 68%), radial-gradient(ellipse 54% 46% at 16% 94%, rgba(30,122,133,.13), transparent 70%)' }} />
      <div style={{ ...WRAP, position: 'relative', zIndex: 3 }}>
        <div style={{ textAlign: 'center', marginBottom: 40, direction: 'rtl' }}>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(24px,3vw,34px)', color: OFF, margin: '0 0 8px' }}>المواعيد المتاحة للتسجيل</h2>
          <p style={{ fontFamily: F, fontSize: 14, color: MUTED, margin: 0 }}>جميع المواعيد بتوقيت عمّان (GMT+3) · Google Meet</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {openCohorts.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
        </div>
        {runCohorts.length > 0 && (
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowRunning(v => !v)} style={{ width: '100%', background: CARD, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', direction: 'rtl', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlayCircle size={16} color='rgba(252,251,251,.55)' strokeWidth={1.8} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,.75)' }}>{runCohorts.length} دفعة جارية حالياً</span>
                <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(252,251,251,.42)', fontWeight: 400 }}>— اكتملت مقاعدها</span>
              </div>
              <ChevronDown size={16} color={MUTED} strokeWidth={2} style={{ transform: showRunning ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
            </button>
            {showRunning && (
              <div style={{ background: 'rgba(0,0,0,.18)', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {runCohorts.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: 28, padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', flexWrap: 'wrap' }}>
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

/* ── SecTitle ── */
function SecTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, direction: 'rtl' }}>
      <div style={{ width: 4, height: 30, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,2.6vw,30px)', color: INK, margin: 0 }}>{children}</h2>
    </div>
  );
}

/* ── AboutSection ── */
const GOALS = [
  { icon: <AudioLines size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'الاستوديو المنزلي', text: 'تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة: اختيار الميكروفون، العزل الصوتي، وبرامج التسجيل.' },
  { icon: <Volume2 size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'أساسيات الصوت والتنفس', text: 'تأسيس مهاري شامل: مناطق الرنين، التنفس الحجابي وإدارة النَفَس أثناء التسجيل.' },
  { icon: <SlidersHorizontal size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'النطق ومخارج الحروف', text: 'تشريح عملي على النطق السليم لكل حرف عربي — مخارج الحروف الـ28 والتخلص من النطق الرخو.' },
  { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,        title: 'اللغة العربية للمعلّق', text: 'قواعد تطبيقية: الهمزات والمدود، فن الوقف والابتداء، ومنهجية التحرير اللغوي قبل التسجيل.' },
  { icon: <Sparkles size={22} strokeWidth={1.8} color={GOLD_INK} />,   title: 'التلوين الانفعالي', text: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع: شجرة المشاعر وترميز النص عاطفياً.' },
  { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />,  title: 'التطبيق والانطلاق في السوق', text: 'إنتاج Voice Demo CV وبناء الهوية الصوتية الشخصية وخطة الـ100 يوم الأولى.' },
];
function AboutSection() {
  const waYaqt = waLink('962771052222', 'السلام عليكم، أرغب في الاستفسار عن دورة التعليق والأداء الصوتي (مباشر تفاعلي Online LIVE)');
  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16, marginBottom: 56 }}>
          {[{ name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي (Online LIVE)', img: yaqoutImg, href: waYaqt, phone: '+962 77 105 2222' }].map(({ name, role, img, href, phone }) => (
            <div key={name} style={{ background: CANVAS, borderRadius: 18, padding: '20px', boxShadow: '0 12px 36px rgba(24,32,47,.16)', direction: 'rtl', maxWidth: 360 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={img} alt={name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `2px solid ${GOLD_LINE}` }} />
                  <span style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid #1A2533' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: OFF }}>{name}</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 2 }}>{role}</div>
                  <div style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,.70)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} strokeWidth={1.8} />يومياً 10:00 صباحاً – 7:00 مساءً</div>
                </div>
              </div>
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: GOLD, color: INK, fontFamily: F, fontWeight: 800, fontSize: 13.5, padding: '10px 0', borderRadius: 10, textDecoration: 'none', marginBottom: 8 }}>
                <MessageCircle size={15} strokeWidth={1.8} /> تواصل الآن
              </a>
              <div style={{ textAlign: 'center', fontFamily: F, fontSize: 12, color: MUTED }}>{phone}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {GOALS.map(({ icon, title, text }) => (
            <div key={title} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 18, padding: '26px 24px', boxShadow: '0 12px 34px rgba(24,32,47,.07)', transition: 'transform .25s, box-shadow .25s, border-color .25s' }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 18px 44px rgba(24,32,47,.12)', borderColor:'rgba(138,98,0,.30)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 12px 34px rgba(24,32,47,.07)', borderColor:CREAM_LINE })}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── OutcomesSection ── */
const OUTCOMES = [
  { icon: <AudioWaveform size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'ملف صوتي احترافي (Voice Demo CV)', text: 'ملف صوتي متكامل مُهندَس بأحدث المؤثّرات، يستعرض خامات صوتك في مختلف ألوان التعليق.' },
  { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,           title: 'هوية صوتية متميزة', text: 'تحديد بصمتك الصوتية الشخصية وأسلوبك في الأداء الاحترافي وبناء ثقتك أمام الميكروفون.' },
  { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,         title: 'شهادة معتمدة رسمياً', text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
];
function OutcomesSection() {
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>المخرجات التدريبية المتوقّعة</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 40 }}>
          {OUTCOMES.map(({ icon, title, text }) => (
            <div key={title} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 18, padding: '26px 24px', boxShadow: '0 12px 34px rgba(24,32,47,.07)', transition: 'transform .25s, box-shadow .25s, border-color .25s' }}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'translateY(-3px)', boxShadow:'0 18px 44px rgba(24,32,47,.12)', borderColor:'rgba(138,98,0,.30)' })}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform:'none', boxShadow:'0 12px 34px rgba(24,32,47,.07)', borderColor:CREAM_LINE })}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK, margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
        {/* Graduation project block */}
        <div style={{ background: CREAM_CARD, border: `2px solid ${GOLD}`, borderRadius: 22, padding: 'clamp(24px,3vw,36px)', boxShadow: '0 0 0 6px rgba(255,193,7,.10), 0 22px 60px rgba(24,32,47,.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, direction: 'rtl' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', flexShrink: 0 }}><GraduationCap size={22} strokeWidth={1.8} color={GOLD_INK} /></div>
            <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,21px)', color: INK, margin: 0 }}>مشروع التخرّج · الإنتاج الفعلي في الاستوديو</h3>
          </div>
          <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8, margin: '0 0 24px', direction: 'rtl' }}>
            بعد إتمام المحاضرات، تبدأ مرحلة الإنتاج: <strong style={{ color: INK }}>تحجز ثلاث جلسات في الاستوديو، كلّ جلسة ساعة، بإشراف مهندس الصوت — تماماً كما في النسخة الحضورية.</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 20, direction: 'rtl' }}>
            {[
              { num: '1+2', title: 'الجلستان الأولى والثانية — التمرين على نصوصك', body: 'تتمرّن على الميكروفون في بيئة تسجيل حقيقية داخل الاستوديو، ويُصحَّح أداؤك جملةً بجملة.' },
              { num: '3',   title: 'الجلسة الثالثة — تسجيل مشروعك النهائي', body: 'جلسة تسجيل احترافية تنتج فيها Voice Demo CV شاملاً جميع ألوان التعليق التي تدرّبت عليها.' },
            ].map(({ num, title, body }) => (
              <div key={num} style={{ background: CREAM, borderRadius: 14, padding: '18px', border: `1px solid ${CREAM_LINE}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', marginBottom: 10, fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD_INK }}>{num}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: INK, margin: '0 0 6px' }}>{title}</h4>
                <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,193,7,.10)', borderRadius: 12, padding: '14px 18px', direction: 'rtl', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <GraduationCap size={18} strokeWidth={1.8} color={GOLD_INK} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: GOLD_INK, marginBottom: 3 }}>المخرج النهائي</div>
              <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>ديمو صوتي احترافي (Voice Demo CV) منتَج بيد مهندس صوت متخصّص بعد الهندسة والمكساج والماسترنج — جاهز للإرسال لشركات الإنتاج.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CurriculumSection (online only) ── */
const LECTURES = [
  { title: 'الاستوديو المنزلي والمعدات',    desc: 'تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة، واختيار الميكروفون المناسب وبرامج التسجيل.' },
  { title: 'أساسيات الصوت والتنفس',         desc: 'تأسيس مهاري شامل: مناطق الرنين الصوتي ومعادن الصوت، التنفس الحجابي وإدارة النَفَس، وتطوير الحضور الصوتي.' },
  { title: 'النطق ومخارج الحروف',           desc: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي، والتخلص من "الفم الكسول" والنطق الرخو.' },
  { title: 'اللغة العربية والتحرير اللغوي', desc: 'قواعد لغوية تطبيقية: الهمزات والتنوين والمدود، فن الوقف والابتداء، ومنهجية التحرير اللغوي قبل التسجيل.' },
  { title: 'التلوين الانفعالي والمشاعر',    desc: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع: شجرة المشاعر، ترميز المشاعر داخل النص، والتحكم بكثافة العاطفة.' },
  { title: 'تطبيقات التعليق الصوتي',        desc: 'ورشة تطبيقية: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات والأخبار.' },
];
function CurriculumSection() {
  const [openLec, setOpenLec] = useState<number | null>(null);
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}` }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <SecTitle>الخطة الدراسية</SecTitle>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${CREAM_LINE}`, borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 13, color: INK2, transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <Printer size={15} strokeWidth={1.8} color={INK2} /> طباعة المنهج
          </button>
        </div>
        {/* Single mode badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, background: `rgba(30,122,133,.10)`, border: `1px solid rgba(30,122,133,.22)`, borderRadius: 10, padding: '8px 16px' }}>
          <Wifi size={14} strokeWidth={1.8} color={TEAL} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: TEAL }}>مباشر تفاعلي (Online LIVE) — 6 محاضرات · 12 ساعة</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }} className="curriculum">
          {LECTURES.map((lec, i) => {
            const open = openLec === i;
            return (
              <div key={i} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 14, overflow: 'hidden', boxShadow: open ? '0 8px 24px rgba(24,32,47,.09)' : '0 2px 8px rgba(24,32,47,.05)' }}>
                <button onClick={() => setOpenLec(open ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', direction: 'rtl', textAlign: 'right' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: 'rgba(30,122,133,.12)', color: TEAL, display: 'grid', placeContent: 'center', fontFamily: FP, fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: INK }}>{lec.title}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(30,122,133,.10)', color: TEAL, fontFamily: F, fontWeight: 700, fontSize: 11, borderRadius: 999, padding: '2px 9px' }}><Wifi size={12} strokeWidth={1.8} />لقاء تفاعلي مباشر</span>
                  </div>
                  <ChevronDown size={16} color={INK2} strokeWidth={2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
                </button>
                {open && <div style={{ padding: '4px 18px 16px 18px', paddingInlineStart: 66, direction: 'rtl' }}><p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.8, margin: 0 }}>{lec.desc}</p></div>}
              </div>
            );
          })}
        </div>
        <div style={{ background: `rgba(30,122,133,.08)`, border: `1px solid rgba(30,122,133,.22)`, borderRadius: 12, padding: '14px 18px', direction: 'rtl' }}>
          <p style={{ fontFamily: F, fontSize: 13.5, color: TEAL, margin: 0, fontWeight: 700 }}>
            + مشروع التخرّج: ثلاث جلسات إنتاج مباشرة مع مهندس الصوت — داخل الاستوديو كما في النسخة الحضورية.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── TrainersSection ── */
type TrainerBadge = { label: string; type: 'achieve' | 'cert' | 'qual' };
const TRAINERS = [
  { img: omarImg, name: 'عمر الدرابكة', title: 'معلّق صوتي محترف ومدرب أداء وإلقاء',
    bio: 'معلّق صوتي محترف سجّل بصوته مئات الأفلام الوثائقية والإعلانات لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا.',
    badges: [{ label: 'خبرة +12 سنة', type: 'achieve' }, { label: 'مئات التسجيلات الاحترافية', type: 'achieve' }, { label: 'دبلوم إعلام — فلوريدا', type: 'cert' }] as TrainerBadge[] },
  { img: ranaImg, name: 'رنا العزام', title: 'مدرّبة التعليق الصوتي واللغة العربية',
    bio: 'معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت محررةً ومدققةً لغوية في مجمع اللغة العربية الأردني. خبرة تمتد لأكثر من 10 سنوات في تمكين المتدربين من الأداء الصوتي الاحترافي.',
    badges: [{ label: '+3,000 طالب مدرَّب', type: 'achieve' }, { label: 'مجمع اللغة العربية', type: 'qual' }, { label: 'مدرّبة معتمدة', type: 'cert' }] as TrainerBadge[] },
];
function TrainerBadgeChip({ badge }: { badge: TrainerBadge }) {
  const styles: Record<TrainerBadge['type'], React.CSSProperties> = {
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
function TrainersSection() {
  return (
    <section style={{ background: CREAM, padding: '80px 0', borderTop: `1px solid ${CREAM_LINE}`, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(to right, rgba(24,32,47,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,32,47,.045) 1px, transparent 1px)', backgroundSize: '56px 56px', WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 62%)', maskImage: 'linear-gradient(to bottom, #000, transparent 62%)' }} />
      <div style={{ ...WRAP, direction: 'rtl', position: 'relative', zIndex: 1 }}>
        <SecTitle>خبراؤنا في التدريس</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TRAINERS.map(({ img, name, title, bio, badges }) => (
            <div key={name} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 20, padding: '26px 22px', boxShadow: '0 12px 34px rgba(24,32,47,.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <img src={img} alt={name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `2px solid rgba(255,193,7,.35)`, flexShrink: 0 }} />
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

/* ── HeroSection ── */
function HeroSection({ onShare }: { onShare: () => void }) {
  const scrollToCohorts = () => {
    setTimeout(() => { const el = document.getElementById('cohorts'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
  };
  const BADGES = [
    { icon: <Users size={16} strokeWidth={1.8} />,        label: '10 مقاعد محدودة' },
    { icon: <CalendarDays size={16} strokeWidth={1.8} />, label: '6 محاضرات' },
    { icon: <Clock size={16} strokeWidth={1.8} />,        label: '12 ساعة تدريبية' },
    { icon: <Globe size={16} strokeWidth={1.8} />,        label: 'عربي' },
  ];
  return (
    <section className="sec--hero" data-nav-theme="light" style={{ background: CREAM, paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 60 }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr min(400px,38vw)', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GOLD_INK, background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)', borderRadius: 999, padding: '3px 12px' }}>التعليق الصوتي — أونلاين</span>
            </div>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)', color: INK, margin: '0 0 16px', lineHeight: 1.2 }}>دورة التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE)</h1>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,17px)', color: INK2, lineHeight: 1.85, margin: '0 0 28px', maxWidth: 560 }}>
              البرنامج التطبيقي لتعليق الصوت عبر بث مباشر تفاعلي: من تجهيز الاستوديو المنزلي إلى إنتاج ديمو صوتي احترافي جاهز لسوق العمل.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {BADGES.map(({ icon, label }) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(24,32,47,.07)', border: `1px solid ${CREAM_LINE}`, borderRadius: 999, padding: '6px 13px', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: INK2 }}>
                  <span style={{ color: GOLD_INK }}>{icon}</span>{label}
                </span>
              ))}
              <a href="https://wajeez.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)', borderRadius: 999, padding: '6px 13px', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: GOLD_INK, textDecoration: 'none' }}>
                <Award size={16} strokeWidth={1.8} />شهادة معتمدة من وجيز
              </a>
            </div>
            {/* Single mode display (online only) */}
            <div style={{ maxWidth: 520, background: 'rgba(255,193,7,.10)', border: `1.5px solid ${GOLD}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeContent: 'center', background: GOLD, color: INK, flexShrink: 0 }}><Wifi size={18} strokeWidth={1.8} /></div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK }}>مباشر تفاعلي (Online LIVE)</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .65 }}>Google Meet</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, direction: 'ltr' }}>
                  <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD_INK }}>$150</span>
                  <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .45, textDecoration: 'line-through' }}>$200</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F, fontSize: 13, color: GOLD_INK, display: 'flex', alignItems: 'center', gap: 5 }}><CreditCard size={15} strokeWidth={1.8} /> بإمكانية التقسيط</span>
              <button onClick={scrollToCohorts} style={{ background: GOLD, color: INK, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(255,193,7,.35)', transition: 'transform .15s, box-shadow .15s' }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { transform:'translateY(-1px)', boxShadow:'0 6px 20px rgba(255,193,7,.45)' })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { transform:'none', boxShadow:'0 4px 16px rgba(255,193,7,.35)' })}>
                سجّل الآن <ArrowLeft size={14} strokeWidth={2} />
              </button>
              <button onClick={onShare} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${CREAM_LINE}`, borderRadius: 9, padding: '7px 14px', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: INK2, transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Share2 size={14} strokeWidth={1.8} /> مشاركة الدورة
              </button>
            </div>
          </div>
          {/* Cover image + trainers mini */}
          <div className="hero-sticky" style={{ position: 'sticky', top: 84 }}>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: 18, boxShadow: '0 24px 64px rgba(24,32,47,.18)', border: `1px solid ${CREAM_LINE}` }}>
              <img src={heroCover} alt="دورة التعليق والأداء الصوتي" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
            <div style={{ marginTop: 14, background: CREAM_CARD, borderRadius: 14, padding: '12px 16px', border: `1px solid ${CREAM_LINE}`, direction: 'rtl', boxShadow: '0 4px 16px rgba(24,32,47,.07)' }}>
              <div style={{ fontFamily: F, fontSize: 12, color: INK2, marginBottom: 10 }}>المدرّبون</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[{ img: omarImg, name: 'عمر الدرابكة' }, { img: ranaImg, name: 'رنا العزام' }].map(({ img, name }) => (
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

/* ── Page ── */
export default function CourseVoiceoverLivePage() {
  const [shareOpen, setShareOpen] = useState(false);
  usePageMeta({
    title: 'دورة التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE)',
    description: 'البرنامج التطبيقي لتعليق الصوت عبر بث مباشر تفاعلي مع عمر درابكة ورنا العزام. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);
  return (
    <div dir="rtl" style={{ background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @media print { .nav, .site-footer, button { display: none !important; } body { background: #fff; color: #000; } .curriculum { break-inside: avoid; } }
        @media (max-width: 700px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-sticky { position: static !important; } }
      `}</style>
      <HeroSection onShare={() => setShareOpen(true)} />
      <CohortsSection />
      <AboutSection />
      <OutcomesSection />
      <CurriculumSection />
      <TrainersSection />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="دورة التعليق والأداء الصوتي (Online LIVE) — كاسيت أكاديمي" description="البرنامج التطبيقي لتعليق الصوت عبر بث مباشر تفاعلي مع عمر درابكة ورنا العزام" />
    </div>
  );
}
