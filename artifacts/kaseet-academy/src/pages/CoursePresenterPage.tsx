/**
 * الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي
 * نفس ستايل CourseBasicsPage حرفياً · نمط واحد: حضوري فقط
 */
import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Users, Award, CalendarDays, Globe,
  CreditCard, Lock, PlayCircle, Tv, Volume2, Video,
  Mic, Sparkles, Briefcase, BookOpen,
  GraduationCap, Printer, ChevronDown, MessageCircle, ArrowLeft,
  Share2, ShieldCheck, Zap,
} from 'lucide-react';
import ShareModal from '../components/ShareModal';
import { usePageMeta } from '../hooks/usePageMeta';

import heroCover from '@assets/دورة_الاعلام_1785758462657.png';
import ranaImg   from '@assets/trainer-rana-azzam_1785428982698.JPG';
import ayaImg    from '@assets/اية_القماز_1785619557679.jpeg';

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
const F          = "'Tajawal', sans-serif";
const FP         = "'Poppins', sans-serif";
const OFF        = 'rgba(252,251,251,0.92)';
const MUTED      = 'rgba(252,251,251,0.58)';
const CREAM_LINE = 'rgba(24,32,47,.10)';
const WRAP: React.CSSProperties = { maxWidth: 1180, margin: '0 auto', paddingInline: 'clamp(16px,4vw,48px)' };

function waLink(phone: string, msg: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Cohort data (onsite only) ── */
type Cohort = {
  id: number; mode: 'onsite'; status: 'open' | 'running';
  trainer: string; start: string; end: string;
  start_ar: string; end_ar: string; days: string;
  time_24: string; time_ar: string; platform: string;
  enrolled: number; capacity: number; remaining: number; fill: number;
};
const COHORTS: Cohort[] = [
  { id: 1, mode: 'onsite', status: 'open', trainer: 'رنا العزام',
    start: '2026-09-05', end: '2026-09-19', start_ar: '5 سبتمبر', end_ar: '19 سبتمبر',
    days: 'السبت والأحد', time_24: '10:00', time_ar: '10:00ص – 12:00م',
    platform: 'استوديو كاسيت — عمّان', enrolled: 3, capacity: 10, remaining: 7, fill: 30 },
  { id: 2, mode: 'onsite', status: 'open', trainer: 'رنا العزام',
    start: '2026-10-03', end: '2026-10-17', start_ar: '3 أكتوبر', end_ar: '17 أكتوبر',
    days: 'السبت والأحد', time_24: '18:00', time_ar: '6:00م – 8:00م',
    platform: 'استوديو كاسيت — عمّان', enrolled: 1, capacity: 10, remaining: 9, fill: 10 },
];
const openCohorts = COHORTS.filter(c => c.status === 'open');
const runCohorts  = COHORTS.filter(c => c.status === 'running');

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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,.58)' }}><MapPin size={12} strokeWidth={1.8} />{c.platform}</span>
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

/* ── CohortsSection (onsite only — no tab) ── */
function CohortsSection() {
  const [showRunning, setShowRunning] = useState(false);
  const waMsg = `السلام عليكم، أرغب في التسجيل في الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي (حضوري).`;
  const handleRegister = (id: number) => {
    const c = COHORTS.find(x => x.id === id);
    if (!c) return;
    window.open(waLink('962790234483', `${waMsg} — الدفعة #${id}`), '_blank');
  };
  return (
    <section id="cohorts" style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: CANVAS, padding: '80px 0', borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}` }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none" viewBox="0 0 800 600">
          <defs><pattern id="cal-pr" width="56" height="56" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.055)" /><line x1="0" y1="0" x2="56" y2="0" stroke="rgba(255,255,255,.020)" strokeWidth="1" /><line x1="0" y1="0" x2="0" y2="56" stroke="rgba(255,255,255,.020)" strokeWidth="1" /></pattern></defs>
          <rect width="800" height="600" fill="url(#cal-pr)" />
        </svg>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 62% 48% at 78% 6%, rgba(255,193,7,.14), transparent 68%), radial-gradient(ellipse 54% 46% at 16% 94%, rgba(30,122,133,.13), transparent 70%)' }} />
      <div style={{ ...WRAP, position: 'relative', zIndex: 3 }}>
        <div style={{ textAlign: 'center', marginBottom: 40, direction: 'rtl' }}>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(24px,3vw,34px)', color: OFF, margin: '0 0 8px' }}>المواعيد المتاحة للتسجيل</h2>
          <p style={{ fontFamily: F, fontSize: 14, color: MUTED, margin: 0 }}>جميع الجلسات حضورية · استوديو كاسيت — عمّان</p>
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
              </div>
              <ChevronDown size={16} color={MUTED} strokeWidth={2} style={{ transform: showRunning ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
            </button>
            {showRunning && <div style={{ background: 'rgba(0,0,0,.18)', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.05)' }}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{runCohorts.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}</div></div>}
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
  { icon: <Tv size={22} strokeWidth={1.8} color={GOLD_INK} />,       title: 'التحرير الصحفي الاحترافي', text: 'إتقان هرم الأخبار المقلوب، الأسئلة الخمس، وكتابة التقارير بمعايير غرف الأخبار العالمية.' },
  { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,       title: 'الإلقاء أمام الكاميرا', text: 'تقنيات الإلقاء المرئي: الصوت والنبرة والإيقاع والتعامل مع الـ teleprompter بثقة احترافية.' },
  { icon: <Volume2 size={22} strokeWidth={1.8} color={GOLD_INK} />,   title: 'لغة الجسد والحضور البصري', text: 'قراءة لغة الجسد وتوظيفها في الأداء الإعلامي — التعبير بالعيون والوجه واليدين والوضعية.' },
  { icon: <BookOpen size={22} strokeWidth={1.8} color={GOLD_INK} />,  title: 'فن إدارة الحوار', text: 'إدارة الحوار المرئي والمسموع: التحضير، طرح الأسئلة، والتعامل مع المتحدثين الصعبين.' },
  { icon: <Video size={22} strokeWidth={1.8} color={GOLD_INK} />,     title: 'التغطية الميدانية والبث', text: 'مهارات العمل في الميدان، التقرير المباشر، وإعداد التحقيقات الصحفية المرئية الاحترافية.' },
  { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'النزاهة والتحقق الإعلامي', text: 'معايير التثبّت من المعلومات وتحرّي الدقة في عصر السوشيال ميديا — أدوات ومنهجية.' },
];
function AboutSection() {
  const waAya = waLink('962790234483', 'السلام عليكم، أرغب في الاستفسار عن الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي (حضوري)');
  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16, marginBottom: 56 }}>
          {[{ name: 'آية القماز', role: 'مستشارة التسجيل · حضوري', img: ayaImg, href: waAya, phone: '+962 79 023 4483' }].map(({ name, role, img, href, phone }) => (
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
  { icon: <Tv size={22} strokeWidth={1.8} color={GOLD_INK} />,      title: 'تقرير صحفي ميداني متكامل', text: 'إنتاج تقرير صحفي احترافي بمعايير غرف الأخبار، يُستخدم في المحفظة المهنية مباشرة.' },
  { icon: <Video size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'تسجيل تقديمي أمام الكاميرا', text: 'تسجيل أداء تقديمي مُقيَّم مباشرةً من المدربة — وثيقة مهنية تُبرز قدراتك الإعلامية.' },
  { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'شهادة معتمدة رسمياً', text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
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
        {/* Graduation project */}
        <div style={{ background: CREAM_CARD, border: `2px solid ${GOLD}`, borderRadius: 22, padding: 'clamp(24px,3vw,36px)', boxShadow: '0 0 0 6px rgba(255,193,7,.10), 0 22px 60px rgba(24,32,47,.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, direction: 'rtl' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,193,7,.16)', display: 'grid', placeContent: 'center', flexShrink: 0 }}><GraduationCap size={22} strokeWidth={1.8} color={GOLD_INK} /></div>
            <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,21px)', color: INK, margin: 0 }}>مشروع التخرّج · التقرير الميداني المتكامل</h3>
          </div>
          <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8, margin: '0 0 24px', direction: 'rtl' }}>
            في الجلسة الثامنة يُنتج كل متدرّب تقريراً ميدانياً متكاملاً بإشراف مباشر من المدربة: <strong style={{ color: INK }}>من التحرير والبحث والتحقق، إلى التقديم أمام الكاميرا وتقييم اللجنة.</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 20, direction: 'rtl' }}>
            {[
              { num: '1', title: 'مرحلة التحرير والبحث', body: 'تحرير الموضوع وجمع المعلومات وتوثيقها وفق المعايير الصحفية المعتمدة في غرف الأخبار.' },
              { num: '2', title: 'مرحلة التقديم والتقييم', body: 'تقديم التقرير أمام الكاميرا وأمام لجنة التقييم مع تغذية راجعة فورية ومفصّلة.' },
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
              <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>تقرير ميداني مكتمل الأركان + تسجيل تقديمي احترافي أمام الكاميرا + شهادة إتمام معتمدة من وجيز وكاسيت.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CurriculumSection (onsite only) ── */
const SESSIONS = [
  { title: 'التحرير الصحفي الاحترافي: الأسئلة الخمس والهرم المقلوب', desc: 'أسس التحرير الصحفي وأساليب الكتابة الإخبارية — من الهرم المقلوب إلى كتابة الخبر والتقرير بمعايير غرف الأخبار.' },
  { title: 'صياغة العناوين وهندسة التأثير الرقمي',                    desc: 'صياغة عناوين جاذبة ومقدمات موجزة ومؤثرة للأخبار والبرامج — التقنيات والأخطاء الشائعة والتطبيق الفوري.' },
  { title: 'التحقق والنزاهة الإعلامية',                               desc: 'معايير التثبّت من المعلومات وتحرّي الدقة في عصر السوشيال ميديا — الأدوات والمنهجية والمسؤولية المهنية.' },
  { title: 'أساسيات الإلقاء الاحترافي والتلوين الصوتي',               desc: 'تقنيات الإلقاء أمام الكاميرا: الصوت والنبرة والإيقاع والتعامل مع الـ teleprompter وأساليب التقديم.' },
  { title: 'لغة الجسد والحضور أمام الكاميرا',                         desc: 'قراءة لغة الجسد وتوظيفها في الأداء الإعلامي — التعبير بالعيون والوجه واليدين والوضعية الجسدية الصحيحة.' },
  { title: 'فن إدارة الحوار والمقابلات الصحفية',                      desc: 'فن إدارة الحوار المرئي والمسموع: التحضير، طرح الأسئلة، التعامل مع المتحدثين الصعبين.' },
  { title: 'التغطية الميدانية ومهارات المراسل الشامل',                  desc: 'مهارات العمل في الميدان، التقرير المباشر، وإعداد التحقيقات الصحفية المرئية وفق معايير الاحترافية.' },
  { title: 'يوم عملي ومفتوح — مشروع التخرّج والأسئلة',                desc: 'تقديم التقرير الميداني المتكامل أمام لجنة التقييم مع تغذية راجعة مباشرة ومفصّلة من المدربة.' },
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, background: 'rgba(255,193,7,.12)', border: `1px solid ${GOLD_LINE}`, borderRadius: 10, padding: '8px 16px' }}>
          <MapPin size={14} strokeWidth={1.8} color={GOLD_INK} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: GOLD_INK }}>حضوري — 8 جلسات · 16 ساعة</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="curriculum">
          {SESSIONS.map((lec, i) => {
            const open = openLec === i;
            return (
              <div key={i} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 14, overflow: 'hidden', boxShadow: open ? '0 8px 24px rgba(24,32,47,.09)' : '0 2px 8px rgba(24,32,47,.05)' }}>
                <button onClick={() => setOpenLec(open ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', direction: 'rtl', textAlign: 'right' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: 'rgba(255,193,7,.16)', color: GOLD_INK, display: 'grid', placeContent: 'center', fontFamily: FP, fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: INK }}>{lec.title}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,193,7,.12)', color: GOLD_INK, fontFamily: F, fontWeight: 700, fontSize: 11, borderRadius: 999, padding: '2px 9px' }}><MapPin size={12} strokeWidth={1.8} />داخل القاعة</span>
                  </div>
                  <ChevronDown size={16} color={INK2} strokeWidth={2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
                </button>
                {open && <div style={{ padding: '4px 18px 16px 18px', paddingInlineStart: 66, direction: 'rtl' }}><p style={{ fontFamily: F, fontSize: 13.5, color: INK2, lineHeight: 1.8, margin: 0 }}>{lec.desc}</p></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── TrainersSection ── */
type TrainerBadge = { label: string; type: 'achieve' | 'cert' | 'qual' };
const TRAINERS = [
  { img: ranaImg, name: 'رنا العزام', title: 'إعالمية ومدرّبة أداء ومختصة تحرير لغوي',
    bio: 'معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت مع قناة رؤيا وقناة صاد وإذاعة حياة إف إم. محررة ومدققة في مجمع اللغة العربية الأردني. حاصلة على المركز الثاني عربياً لأفضل إنتاج إعلامي حول المرأة العربية.',
    badges: [{ label: '+10 سنوات خبرة', type: 'achieve' }, { label: 'مجمع اللغة العربية', type: 'qual' }, { label: 'مدرّبة معتمدة', type: 'cert' }] as TrainerBadge[] },
];
function TrainerBadgeChip({ badge }: { badge: TrainerBadge }) {
  const styles: Record<TrainerBadge['type'], React.CSSProperties> = {
    achieve: { background: 'rgba(255,193,7,.14)', color: GOLD_INK, border: '1px solid rgba(255,193,7,.28)' },
    cert:    { background: 'rgba(30,122,133,.10)', color: '#1E7A85', border: '1px solid rgba(30,122,133,.22)' },
    qual:    { background: 'rgba(24,32,47,.07)',   color: INK2,     border: `1px solid ${CREAM_LINE}` },
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
    { icon: <CalendarDays size={16} strokeWidth={1.8} />, label: '8 جلسات' },
    { icon: <Clock size={16} strokeWidth={1.8} />,        label: '16 ساعة تدريبية' },
    { icon: <Globe size={16} strokeWidth={1.8} />,        label: 'عربي' },
  ];
  return (
    <section className="sec--hero" data-nav-theme="light" style={{ background: CREAM, paddingTop: 'clamp(80px,10vw,120px)', paddingBottom: 60 }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr min(400px,38vw)', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GOLD_INK, background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)', borderRadius: 999, padding: '3px 12px' }}>الإعلام الرقمي</span>
            </div>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)', color: INK, margin: '0 0 16px', lineHeight: 1.2 }}>الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي</h1>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,17px)', color: INK2, lineHeight: 1.85, margin: '0 0 28px', maxWidth: 560 }}>
              من التحرير الصحفي إلى الحضور أمام الكاميرا وإدارة الحوار والتغطية الميدانية — ثماني جلسات حضورية مكثفة بإشراف الإعلامية رنا العزام.
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
            {/* Single mode display (onsite only) */}
            <div style={{ maxWidth: 520, background: 'rgba(255,193,7,.10)', border: `1.5px solid ${GOLD}`, borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeContent: 'center', background: GOLD, color: INK, flexShrink: 0 }}><MapPin size={18} strokeWidth={1.8} /></div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: INK }}>حضوري — عمّان</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .65 }}>استوديو كاسيت</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, direction: 'ltr' }}>
                  <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD_INK }}>250</span>
                  <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: INK2, opacity: .7 }}>JOD</span>
                  <span style={{ fontFamily: FP, fontSize: 12, color: INK2, opacity: .45, textDecoration: 'line-through' }}>340</span>
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
          <div className="hero-sticky" style={{ position: 'sticky', top: 84 }}>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: 18, boxShadow: '0 24px 64px rgba(24,32,47,.18)', border: `1px solid ${CREAM_LINE}` }}>
              <img src={heroCover} alt="الدورة المكثفة: المذيع المحترف" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
            </div>
            <div style={{ marginTop: 14, background: CREAM_CARD, borderRadius: 14, padding: '12px 16px', border: `1px solid ${CREAM_LINE}`, direction: 'rtl', boxShadow: '0 4px 16px rgba(24,32,47,.07)' }}>
              <div style={{ fontFamily: F, fontSize: 12, color: INK2, marginBottom: 10 }}>المدرّبة</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={ranaImg} alt="رنا العزام" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(255,193,7,.35)', flexShrink: 0 }} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK }}>رنا العزام</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page ── */
export default function CoursePresenterPage() {
  const [shareOpen, setShareOpen] = useState(false);
  usePageMeta({
    title: 'الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي',
    description: 'دورة مكثفة 16 ساعة مع المدربة رنا العزام. من التحرير الصحفي إلى الحضور أمام الكاميرا. شهادة معتمدة من وجيز — كاسيت أكاديمي بعمّان.',
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
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="الدورة المكثفة: المذيع المحترف — كاسيت أكاديمي" description="من التحرير الصحفي إلى الحضور أمام الكاميرا — 8 جلسات حضورية بإشراف رنا العزام" />
    </div>
  );
}
