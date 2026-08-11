/**
 * فن الخطابة والإلقاء الجماهيري المؤثر
 * نفس ستايل CourseBasicsPage حرفياً · كلا النمطين: حضوري + مباشر تفاعلي
 */
import { useState, useEffect } from 'react';
import {
  MapPin, Wifi, Clock, Users, Award, CalendarDays, Globe,
  CreditCard, Video, Lock, PlayCircle, Mic, Zap,
  Sliders, Briefcase, Star,
  GraduationCap, Printer, ChevronDown, MessageCircle, ArrowLeft,
  Share2, ShieldCheck,
} from 'lucide-react';
import ShareModal from '../components/ShareModal';
import { usePageMeta } from '../hooks/usePageMeta';

import heroCover  from '@assets/cover-public-speaking-tedx_1785865159100.jpeg';
import sohaibImg  from '@assets/instructor-sohaib_1785692401461.jpeg';
import ayaImg     from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg  from '@assets/ياقوت__1785619557679.jpeg';

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

/* ── Cohort data (both modes) ── */
type Cohort = {
  id: number; mode: 'onsite' | 'online'; status: 'open' | 'running';
  trainer: string; start: string; end: string;
  start_ar: string; end_ar: string; days: string;
  time_24: string; time_ar: string; platform: string;
  enrolled: number; capacity: number; remaining: number; fill: number;
};
const COHORTS: Cohort[] = [
  { id: 1, mode: 'onsite', status: 'open', trainer: 'د. صهيب الخوالدة',
    start: '2026-09-06', end: '2026-10-25', start_ar: '6 سبتمبر', end_ar: '25 أكتوبر',
    days: 'الأحد', time_24: '10:00', time_ar: '10:00ص – 12:00م',
    platform: 'استوديو كاسيت — عمّان', enrolled: 3, capacity: 12, remaining: 9, fill: 25 },
  { id: 2, mode: 'online', status: 'open', trainer: 'د. صهيب الخوالدة',
    start: '2026-09-08', end: '2026-10-27', start_ar: '8 سبتمبر', end_ar: '27 أكتوبر',
    days: 'الثلاثاء', time_24: '19:00', time_ar: '7:00م – 9:00م',
    platform: 'Google Meet', enrolled: 5, capacity: 15, remaining: 10, fill: 33 },
];
const openOnsite  = COHORTS.filter(c => c.status === 'open'    && c.mode === 'onsite');
const openOnline  = COHORTS.filter(c => c.status === 'open'    && c.mode === 'online');
const runOnsite   = COHORTS.filter(c => c.status === 'running' && c.mode === 'onsite');
const runOnline   = COHORTS.filter(c => c.status === 'running' && c.mode === 'online');

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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 11.5, color: 'rgba(252,251,251,.58)' }}>
              {c.mode === 'online' ? <Video size={12} strokeWidth={1.8} /> : <MapPin size={12} strokeWidth={1.8} />}{c.platform}
            </span>
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

/* ── CohortsSection (both modes — with tab) ── */
function CohortsSection({ defaultMode }: { defaultMode: 'onsite' | 'online' }) {
  const [tab, setTab] = useState<'onsite' | 'online'>(defaultMode);
  const [showRunning, setShowRunning] = useState(false);
  const open    = tab === 'onsite' ? openOnsite  : openOnline;
  const running = tab === 'onsite' ? runOnsite   : runOnline;
  const waMsg   = `السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري المؤثر (${tab === 'onsite' ? 'حضوري' : 'مباشر تفاعلي Online LIVE'}).`;
  const phone   = tab === 'onsite' ? '962790234483' : '962771052222';
  const handleRegister = (id: number) => {
    const c = COHORTS.find(x => x.id === id);
    if (!c) return;
    window.open(waLink(phone, `${waMsg} — الدفعة #${id}`), '_blank');
  };
  return (
    <section id="cohorts" style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: CANVAS, padding: '80px 0', borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}` }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="none" viewBox="0 0 800 600">
          <defs><pattern id="cal-ps" width="56" height="56" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.055)" /><line x1="0" y1="0" x2="56" y2="0" stroke="rgba(255,255,255,.020)" strokeWidth="1" /><line x1="0" y1="0" x2="0" y2="56" stroke="rgba(255,255,255,.020)" strokeWidth="1" /></pattern></defs>
          <rect width="800" height="600" fill="url(#cal-ps)" />
        </svg>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 62% 48% at 78% 6%, rgba(255,193,7,.14), transparent 68%), radial-gradient(ellipse 54% 46% at 16% 94%, rgba(30,122,133,.13), transparent 70%)' }} />
      <div style={{ ...WRAP, position: 'relative', zIndex: 3 }}>
        <div style={{ textAlign: 'center', marginBottom: 40, direction: 'rtl' }}>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(24px,3vw,34px)', color: OFF, margin: '0 0 8px' }}>المواعيد المتاحة للتسجيل</h2>
          <p style={{ fontFamily: F, fontSize: 14, color: MUTED, margin: 0 }}>جميع المواعيد بتوقيت عمّان (GMT+3)</p>
        </div>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, direction: 'rtl', flexWrap: 'wrap' }}>
          {([
            { key: 'onsite', label: 'حضوري', count: openOnsite.length, icon: <MapPin size={16} strokeWidth={1.8} /> },
            { key: 'online', label: 'مباشر تفاعلي (Online LIVE)', count: openOnline.length, icon: <Wifi size={16} strokeWidth={1.8} /> },
          ] as const).map(({ key, label, count, icon }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)} style={{ flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 16, cursor: 'pointer', background: active ? 'rgba(255,193,7,.10)' : 'rgba(255,255,255,.04)', border: `1.5px solid ${active ? GOLD : 'rgba(255,255,255,.10)'}`, boxShadow: active ? '0 0 0 1px rgba(255,193,7,.22)' : 'none', transition: '.2s', fontFamily: F, direction: 'rtl' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? GOLD : 'rgba(255,255,255,.08)', color: active ? INK : 'rgba(252,251,251,.55)', flexShrink: 0 }}>{icon}</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {open.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}
        </div>
        {running.length > 0 && (
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
            <button onClick={() => setShowRunning(v => !v)} style={{ width: '100%', background: CARD, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', direction: 'rtl', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlayCircle size={16} color='rgba(252,251,251,.55)' strokeWidth={1.8} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: 'rgba(252,251,251,.75)' }}>{running.length} دفعة جارية</span>
              </div>
              <ChevronDown size={16} color={MUTED} strokeWidth={2} style={{ transform: showRunning ? 'rotate(180deg)' : 'none', transition: 'transform .3s', flexShrink: 0 }} />
            </button>
            {showRunning && <div style={{ background: 'rgba(0,0,0,.18)', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.05)' }}><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{running.map(c => <CohortRow key={c.id} c={c} onRegister={handleRegister} />)}</div></div>}
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
  { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,      title: 'كسر رهبة المنصة',         text: 'استراتيجيات عملية للتغلب على الخوف الجماهيري وبناء الثقة الداخلية — تمارين التعرّض التدريجي والسيطرة على التوتر.' },
  { icon: <Sliders size={22} strokeWidth={1.8} color={GOLD_INK} />,  title: 'إيقاع الخطاب والوقفات',   text: 'فن توظيف الصمت الاستراتيجي والوقفة المؤثرة — متى ترفع نبرتك وتشعل الحماس، ومتى تخفضها وتستمل القلوب.' },
  { icon: <Zap size={22} strokeWidth={1.8} color={GOLD_INK} />,      title: 'الارتجال والمواقف المفاجئة', text: 'تقنيات الحديث دون استعداد مسبق — مهارة قيّمة في المقابلات وجلسات النقاش وإدارة المواقف غير المتوقعة.' },
  { icon: <Star size={22} strokeWidth={1.8} color={GOLD_INK} />,     title: 'هيكل الخطاب المؤثر',       text: 'منهجية بناء الخطاب من المقدمة الخاطفة إلى الخاتمة الماكثة في الذاكرة — نماذج TED وخطابات الإقناع العالمية.' },
  { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'خطابة الإقناع القيادي',   text: 'مهارات إلقاء مخصصة لبيئات العمل: بناء نبرة قيادية وإقناع الإدارات والمستثمرين بأفكارك بثقة وحضور.' },
  { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'إدارة الأزمات والأسئلة',   text: 'الثبات الانفعالي فوق المنصة، والرد بذكاء ودبلوماسية على الأسئلة الصعبة أو المحرجة أثناء الإلقاء.' },
];
function AboutSection({ mode }: { mode: 'onsite' | 'online' }) {
  const waAya  = waLink('962790234483', 'السلام عليكم، أرغب في الاستفسار عن دورة فن الخطابة والإلقاء الجماهيري المؤثر (حضوري)');
  const waYaqt = waLink('962771052222', 'السلام عليكم، أرغب في الاستفسار عن دورة فن الخطابة والإلقاء الجماهيري المؤثر (مباشر تفاعلي Online LIVE)');
  const advisors = mode === 'onsite'
    ? [{ name: 'آية القماز', role: 'مستشارة التسجيل · حضوري', img: ayaImg, href: waAya, phone: '+962 79 023 4483' }]
    : [{ name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي (Online LIVE)', img: yaqoutImg, href: waYaqt, phone: '+962 77 105 2222' }];
  return (
    <section style={{ background: CREAM, padding: '80px 0' }}>
      <div style={{ ...WRAP, direction: 'rtl' }}>
        <SecTitle>نبذة عن البرنامج وأهدافه</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16, marginBottom: 56 }}>
          {advisors.map(({ name, role, img, href, phone }) => (
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
  { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,      title: 'خطاب TEDx متكامل',               text: 'تصميم وتقديم خطاب TEDx أمام لجنة تقييم متخصصة وتسجيل رسمي يُضاف للمحفظة الشخصية.' },
  { icon: <Star size={22} strokeWidth={1.8} color={GOLD_INK} />,     title: 'تقرير هوية خطابية فردي',          text: 'تقرير تفصيلي يحدد هويتك الخطابية الشخصية ونقاط القوة والتطوير مع خريطة طريق للاستمرار.' },
  { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'شهادة معتمدة رسمياً',             text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
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
            <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,21px)', color: INK, margin: 0 }}>مشروع التخرّج · خطاب TEDx أمام اللجنة</h3>
          </div>
          <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8, margin: '0 0 24px', direction: 'rtl' }}>
            في الجلسة الثامنة يُلقي كل متدرّب خطابه المتكامل أمام المدرب مستخدماً <strong style={{ color: INK }}>الصوت ولغة الجسد والهيكل الذي تعلّمه</strong>، ليحصل على تقييم تفصيلي مباشر وتقرير تحسين مهني فردي.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 20, direction: 'rtl' }}>
            {[
              { num: '1', title: 'مرحلة التحضير والتدريب', body: 'تصميم الخطاب من الافتتاحية الخاطفة إلى الخاتمة المؤثرة — تطبيق كل ما تعلّمته من إيقاع ووقفات وإقناع.' },
              { num: '2', title: 'مرحلة الإلقاء والتقييم', body: 'إلقاء الخطاب أمام المدرب مع تقرير تقييم فردي يُحدد هويتك الخطابية وخريطة طريق التطوير المستمر.' },
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
              <p style={{ fontFamily: F, fontSize: 13, color: INK2, margin: 0, lineHeight: 1.7 }}>خطاب TEDx مسجَّل + تقرير هوية خطابية فردي + شهادة معتمدة من وجيز وكاسيت.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CurriculumSection (both modes — same sessions, different badge) ── */
const SESSIONS = [
  { title: 'كسر الرهبة وبناء الثقة الجماهيرية',           desc: 'نفكّك سيكولوجية الخوف من التحدث أمام الجمهور ونتدرّب على السيطرة الكاملة على التوتر في الثواني الأولى من صعود المنصة.' },
  { title: 'مخارج الحروف والبيان العربي',                   desc: 'روتين مكثّف على إلقاء روائع الشعر والنثر لتفكيك عقد اللسان وضبط مخارج الحروف ونطق الكلمات بدقة خطابية.' },
  { title: 'هندسة الوقفات والتلحين الخطابي',               desc: 'أسرار الوقف البليغ — الصمت المؤثر الذي يشوّق المستمع — وفهم إيقاع الخطابة ومتى ترفع نبرتك ومتى تخفضها.' },
  { title: 'ورشة الارتجال السريع المفاجئ',                  desc: 'تطبيقات حية مباشرة: يطرح المدرب موضوعاً عشوائياً ويتحدث المتدرب فيه فوراً محافظاً على ترابط الأفكار وثبات النبرة.' },
  { title: 'بناء هيكل الخطاب الذكي والافتتاحيات الخاطفة',  desc: 'نصيغ الخطاب المؤثر خطوة بخطوة: مقدمة تخطف الانتباه في سبع ثوانٍ، متن واضح، وخاتمة قوية تترك أثراً ممتداً.' },
  { title: 'خطابة الإقناع والتأثير القيادي المهني',          desc: 'مهارات إلقاء لبيئات العمل: بناء نبرة قيادية واستراتيجيات العروض التقديمية التي تُقنع الإدارات والمستثمرين.' },
  { title: 'إدارة الأزمات والردود الذكية',                   desc: 'توجيه أدائي للثبات الانفعالي فوق المنصة، وتدريب على الإجابة بذكاء ودبلوماسية على الأسئلة الصعبة والمفاجئة.' },
  { title: 'مشروع التخرّج والتقييم الخطابي الشامل',          desc: 'يلقي كل متدرب خطابه المتكامل أمام المدرب ليحصل على تقييم تفصيلي مباشر وتقرير تحسين مهني فردي يُوثّق تطوره.' },
];
function CurriculumSection({ mode }: { mode: 'onsite' | 'online' }) {
  const [tab, setTab]       = useState<'onsite' | 'online'>(mode);
  const [openLec, setOpenLec] = useState<number | null>(null);
  const isOnsite  = tab === 'onsite';
  const numColor  = isOnsite ? GOLD_INK : TEAL;
  const numBg     = isOnsite ? 'rgba(255,193,7,.16)' : 'rgba(30,122,133,.12)';
  const badgeBg   = isOnsite ? 'rgba(255,193,7,.12)' : 'rgba(30,122,133,.10)';
  const badgeCol  = isOnsite ? GOLD_INK : TEAL;
  const badgeIcon = isOnsite ? <MapPin size={12} strokeWidth={1.8} /> : <Wifi size={12} strokeWidth={1.8} />;
  const badgeLabel = isOnsite ? 'داخل القاعة' : 'لقاء تفاعلي مباشر';
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
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(24,32,47,.07)', borderRadius: 14, padding: 4 }}>
          {([
            { key: 'onsite', label: 'حضوري — 8 جلسات · 16 ساعة', icon: <MapPin size={14} strokeWidth={1.8} /> },
            { key: 'online', label: 'مباشر تفاعلي (Online LIVE) — 8 جلسات · 16 ساعة', icon: <Wifi size={14} strokeWidth={1.8} /> },
          ] as const).map(({ key, label, icon }) => (
            <button key={key} onClick={() => { setTab(key); setOpenLec(null); }} style={{ flex: 1, padding: '11px 0', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 13.5, transition: '.18s', background: tab === key ? (key === 'onsite' ? GOLD_INK : TEAL) : 'transparent', color: tab === key ? '#fff' : INK2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {icon}{label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="curriculum">
          {SESSIONS.map((lec, i) => {
            const open = openLec === i;
            return (
              <div key={i} style={{ background: CREAM_CARD, border: `1px solid ${CREAM_LINE}`, borderRadius: 14, overflow: 'hidden', boxShadow: open ? '0 8px 24px rgba(24,32,47,.09)' : '0 2px 8px rgba(24,32,47,.05)' }}>
                <button onClick={() => setOpenLec(open ? null : i)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', direction: 'rtl', textAlign: 'right' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: numBg, color: numColor, display: 'grid', placeContent: 'center', fontFamily: FP, fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: INK }}>{lec.title}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: badgeBg, color: badgeCol, fontFamily: F, fontWeight: 700, fontSize: 11, borderRadius: 999, padding: '2px 9px' }}>{badgeIcon}{badgeLabel}</span>
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
  { img: sohaibImg, name: 'د. صهيب الخوالدة', title: 'خبير تخطيط استراتيجي وتواصل قيادي',
    bio: 'مدير الأبحاث والسياسات في مؤسسة قطر بخبرة تتجاوز 16 عاماً في تطوير الأعمال والقيادة الاستراتيجية. حاصل على الدكتوراه في إدارة الأعمال من جامعة أستون (المملكة المتحدة) وعمل مستشاراً لجهات حكومية وخاصة في المنطقة العربية والخليج.',
    badges: [{ label: 'دكتوراه — جامعة أستون', type: 'cert' }, { label: 'خبرة +16 سنة', type: 'achieve' }, { label: 'مؤسسة قطر', type: 'qual' }] as TrainerBadge[] },
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
function HeroSection({ mode, onModeChange, onShare }: { mode: 'onsite' | 'online'; onModeChange: (m: 'onsite' | 'online') => void; onShare: () => void }) {
  const scrollToCohorts = (m: 'onsite' | 'online') => {
    onModeChange(m);
    setTimeout(() => { const el = document.getElementById('cohorts'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
  };
  const BADGES = [
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
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GOLD_INK, background: 'rgba(255,193,7,.14)', border: '1px solid rgba(255,193,7,.28)', borderRadius: 999, padding: '3px 12px' }}>الخطابة والإلقاء</span>
            </div>
            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)', color: INK, margin: '0 0 16px', lineHeight: 1.2 }}>فن الخطابة والإلقاء الجماهيري المؤثر</h1>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,17px)', color: INK2, lineHeight: 1.85, margin: '0 0 28px', maxWidth: 560 }}>
              ثماني جلسات تكسر رهبة المنصة والكاميرا وتبني حضوراً وكاريزما خطابية حقيقية — بإشراف د. صهيب الخوالدة.
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
            {/* Mode picker (both modes) */}
            <div role="radiogroup" aria-label="اختر طريقة الدراسة" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
              {([
                { m: 'onsite', label: 'حضوري', icon: <MapPin size={18} strokeWidth={1.8} />, price: '180', unit: 'JOD', strike: '', note: 'استوديو كاسيت — عمّان' },
                { m: 'online', label: 'مباشر تفاعلي (Online LIVE)', icon: <Wifi size={18} strokeWidth={1.8} />, price: '$150', unit: '', strike: '', note: 'Google Meet' },
              ] as const).map(({ m, label, icon, price, unit, strike, note }) => {
                const active = mode === m;
                return (
                  <button key={m} role="radio" aria-checked={active} onClick={() => scrollToCohorts(m)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: active ? 'rgba(255,193,7,.10)' : 'rgba(24,32,47,.04)', border: `1.5px solid ${active ? GOLD : CREAM_LINE}`, borderRadius: 14, padding: '14px 18px', cursor: 'pointer', transition: '.2s', direction: 'rtl', textAlign: 'right', boxShadow: active ? `0 0 0 1px ${GOLD_LINE}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'grid', placeContent: 'center', background: active ? GOLD : 'rgba(24,32,47,.08)', color: active ? INK : INK2, flexShrink: 0 }}>{icon}</div>
                      <div>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: active ? INK : INK2 }}>{label}</div>
                        <div style={{ fontFamily: F, fontSize: 12, color: INK2, opacity: .65 }}>{note}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, direction: 'ltr' }}>
                      <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: active ? GOLD_INK : INK2 }}>{price}</span>
                      {unit && <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: INK2, opacity: .7 }}>{unit}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F, fontSize: 13, color: GOLD_INK, display: 'flex', alignItems: 'center', gap: 5 }}><CreditCard size={15} strokeWidth={1.8} /> بإمكانية التقسيط</span>
              <button onClick={onShare} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${CREAM_LINE}`, borderRadius: 9, padding: '7px 14px', cursor: 'pointer', fontFamily: F, fontWeight: 700, fontSize: 12.5, color: INK2, transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(24,32,47,.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Share2 size={14} strokeWidth={1.8} /> مشاركة الدورة
              </button>
            </div>
          </div>
          <div className="hero-sticky" style={{ position: 'sticky', top: 84 }}>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', borderRadius: 18, boxShadow: '0 24px 64px rgba(24,32,47,.18)', border: `1px solid ${CREAM_LINE}` }}>
              <img src={heroCover} alt="فن الخطابة والإلقاء" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            </div>
            <div style={{ marginTop: 14, background: CREAM_CARD, borderRadius: 14, padding: '12px 16px', border: `1px solid ${CREAM_LINE}`, direction: 'rtl', boxShadow: '0 4px 16px rgba(24,32,47,.07)' }}>
              <div style={{ fontFamily: F, fontSize: 12, color: INK2, marginBottom: 10 }}>المدرّب</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={sohaibImg} alt="د. صهيب الخوالدة" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(255,193,7,.35)', flexShrink: 0 }} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: INK }}>د. صهيب الخوالدة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Page ── */
export default function CoursePublicSpeakingPage() {
  const [heroMode,  setHeroMode]  = useState<'onsite' | 'online'>('onsite');
  const [shareOpen, setShareOpen] = useState(false);
  usePageMeta({
    title: 'فن الخطابة والإلقاء الجماهيري المؤثر',
    description: 'ثماني جلسات مع د. صهيب الخوالدة لكسر رهبة المنصة وبناء حضور خطابي احترافي. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []);
  return (
    <div dir="rtl" style={{ background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @media print { .nav, .site-footer, button { display: none !important; } body { background: #fff; color: #000; } .curriculum { break-inside: avoid; } }
        @media (max-width: 700px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-sticky { position: static !important; } }
      `}</style>
      <HeroSection mode={heroMode} onModeChange={setHeroMode} onShare={() => setShareOpen(true)} />
      <CohortsSection defaultMode={heroMode} />
      <AboutSection mode={heroMode} />
      <OutcomesSection />
      <CurriculumSection mode={heroMode} />
      <TrainersSection />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title="فن الخطابة والإلقاء الجماهيري المؤثر — كاسيت أكاديمي" description="ثماني جلسات مع د. صهيب الخوالدة لكسر رهبة المنصة وبناء كاريزما خطابية حقيقية" />
    </div>
  );
}
