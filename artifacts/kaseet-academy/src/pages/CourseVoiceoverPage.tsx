import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, Calendar, Clock, MapPin, Wifi, Users, GraduationCap, Award, Mic, Volume2, Star, Printer, BookOpen, Zap, Briefcase, Sliders } from 'lucide-react';

/* ── Asset imports ─────────────────────────────────────────── */
import ayaImg      from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';
import yasar       from '@assets/course_01_instructor_1785428932171.jpeg';
import rana        from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar        from '@assets/trainer-omar_1785428945248.jpg';
import heroCover   from '@assets/course_01_cover_1785428932170.png';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const inPersonPdf = `${BASE}/voiceover-inperson.pdf`;
const onlinePdf   = `${BASE}/voiceover-online.pdf`;

/* ── Design tokens ─────────────────────────────────────────── */
const NAVY    = '#1D2738';
const DARK    = '#161f2e';
const CARD    = '#2a3549';
const CARD2   = '#313d54';
const GOLD    = '#FFC107';
const OFF     = 'rgba(252,251,251,0.96)';
const MUTED   = 'rgba(252,251,251,0.62)';
const F       = "'Tajawal', sans-serif";
const FP      = "'Poppins', sans-serif";
const WA_BASE = 'https://wa.me/';

/* ── Light section tokens ──────────────────────────────────── */
const LBG  = '#F5F4F0';
const DH   = '#1e293b';
const DM   = '#475569';
const DF   = '#64748b';
const RASB = '#e01e8c';

function waLink(phone: string, msg: string) {
  return `${WA_BASE}${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Reusable tiny components ──────────────────────────────── */
function GoldDot() {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: GOLD,
      boxShadow: '0 0 6px rgba(255,193,7,0.60)',
      flexShrink: 0, marginTop: 4,
    }} />
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(255,193,7,0.10)',
      border: '1px solid rgba(255,193,7,0.30)',
      color: GOLD, borderRadius: 999,
      fontFamily: F, fontWeight: 700, fontSize: 12,
      padding: '5px 13px', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, direction: 'rtl' }}>
      <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: OFF, margin: 0, lineHeight: 1.2 }}>
        {children}
      </h2>
    </div>
  );
}

function LightSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, direction: 'rtl' }}>
      <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: DH, margin: 0, lineHeight: 1.2 }}>
        {children}
      </h2>
    </div>
  );
}

function AdvisorMini({ name, role, photo, href }: { name: string; role: string; photo: string; href: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={photo} alt={name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(255,193,7,0.35)' }} />
        <span style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #181325' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, marginBottom: 2 }}>{name}</div>
        <div style={{ fontFamily: F, fontSize: 11.5, color: MUTED, marginBottom: 8 }}>{role}</div>
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: GOLD, color: NAVY, fontFamily: F, fontWeight: 800, fontSize: 12, padding: '6px 14px', borderRadius: 8, textDecoration: 'none' }}>
          تواصل الآن 💬
        </a>
      </div>
    </div>
  );
}

/* ── Schedule data ─────────────────────────────────────────── */
const scheduleData = {
  inPerson: [
    { id: 'g34',   group: 'مجموعة 34 - صباحي - وجاهي',         course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'رنا عزام',   days: 'أحد / ثلاثاء / خميس',  time: '',              month: 'يوليو',   day: '21', status: 'active'   },
    { id: 'g28',   group: 'مجموعة 28 - مسائي - وجاهي',          course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'يسار عبده',  days: 'أحد / ثلاثاء / خميس',  time: '',              month: 'يوليو',   day: '12', status: 'active'   },
    { id: 'g36',   group: 'مجموعة 36 متقدمة - وجاهي',           course: 'الأداء الصوتي المتقدم (الرد الآلي والإعلانات)',    instructor: 'يسار عبده',  days: 'الأحد',                 time: '',              month: 'يوليو',   day: '12', status: 'active'   },
    { id: 'g31',   group: 'مجموعة 31 - صباحي - وجاهي',          course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'رنا عزام',   days: 'أحد / ثلاثاء / خميس',  time: '',              month: 'فبراير',  day: '07', status: 'active'   },
    { id: 'g26',   group: 'مجموعة 26 - صباحي - وجاهي',          course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'رنا عزام',   days: 'الإثنين / الأربعاء',    time: '',              month: 'يناير',   day: '07', status: 'active'   },
    { id: 'g17',   group: 'مجموعة 17 - مسائي - وجاهي',          course: 'الأداء الصوتي المتقدم (كتب صوتية)',                instructor: 'يسار عبده',  days: 'الإثنين',               time: '',              month: 'مايو',    day: '18', status: 'active'   },
    { id: 'g18',   group: 'مجموعة 18 - مسائي - وجاهي',          course: 'الأداء الصوتي المتقدم (الرد الآلي والإعلانات)',    instructor: 'يسار عبده',  days: 'الأربعاء',              time: '',              month: 'مايو',    day: '20', status: 'active'   },
    { id: 'gAdv',  group: 'مجموعة متقدمة - مسائي - وجاهي',      course: 'الأداء الصوتي المتقدم (الرد الآلي والإعلانات)',    instructor: 'يسار عبده',  days: 'السبت',                 time: '',              month: 'يونيو',   day: '27', status: 'active'   },
    // ── أغسطس 2026 ──
    { id: 'g37m',  group: 'مجموعة مسائية - أغسطس 2026',         course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'يسار عبده',  days: 'الإثنين والأربعاء',     time: '6:00-8:00 م',   month: 'أغسطس',   day: '12', status: 'upcoming' },
    { id: 'g37s',  group: 'مجموعة صباحية - أغسطس 2026',         course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'رنا عزام',   days: 'الأربعاء',              time: '12:00-2:00 ظ',  month: 'أغسطس',   day: '12', status: 'upcoming' },
    { id: 'g40ip', group: 'مجموعة وجاهية - قريباً',              course: 'التعليق والأداء الصوتي (الأساسيات)',               instructor: 'يسار عبده',  days: '-',                     time: '',              month: 'قريباً',  day: '--', status: 'upcoming' },
  ],
  online: [
    { id: 'g25',   group: 'مجموعة 25 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'يسار عبده',  days: 'السبت',    time: '', month: 'يونيو',  day: '20', status: 'active'   },
    { id: 'g27',   group: 'مجموعة 27 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'رنا عزام',   days: 'السبت',    time: '', month: 'يونيو',  day: '--', status: 'active'   },
    { id: 'g29',   group: 'مجموعة 29 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'رنا عزام',   days: 'السبت',    time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g32',   group: 'مجموعة 32 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'رنا عزام',   days: 'الثلاثاء', time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g33',   group: 'مجموعة 33 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'عمر درابكة', days: 'السبت',    time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g35',   group: 'مجموعة 35 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'عمر درابكة', days: 'الأحد',    time: '', month: 'يوليو',  day: '--', status: 'active'   },
    // ── قريباً ──
    { id: 'g38',   group: 'مجموعة 38 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'عمر درابكة', days: '-',        time: '', month: 'قريباً', day: '--', status: 'upcoming' },
    { id: 'g39',   group: 'مجموعة 39 - أونلاين',    course: 'التعليق الصوتي أونلاين (الأساسيات)', instructor: 'رنا عزام',   days: '-',        time: '', month: 'قريباً', day: '--', status: 'upcoming' },
  ],
};

/* ── Online curriculum modules (for الأونلاين tab) ────────── */
const ONLINE_MODULES_V = [
  { title: 'الاستوديو المنزلي والمعدات',      intro: 'كيفية تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة.',                                 points: ['اختيار الميكروفون المناسب لصوتك', 'المعالجة الصوتية بالفوم والمواد المتاحة', 'برامج التسجيل والمونتاج للمبتدئين'] },
  { title: 'أساسيات الصوت والتنفس',           intro: 'تأسيس مهاري شامل يبني جسراً بين الصوت الطبيعي والصوت الاحترافي.',                              points: ['مناطق الرنين الصوتي ومعادن الصوت', 'التنفس الحجابي وإدارة النَفَس', 'تمارين تطوير الحضور الصوتي'] },
  { title: 'النطق ومخارج الحروف',             intro: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي.',                                       points: ['مخارج الحروف العربية الـ 28 بالتطبيق', 'التخلص من "الفم الكسول" والنطق الرخو', 'تمارين اللسان والشفتين والحلق'] },
  { title: 'اللغة العربية والتحرير اللغوي',   intro: 'قواعد لغوية تطبيقية مصممة خصيصاً لاحتياجات المعلق الصوتي.',                                    points: ['الهمزات والتنوين والمدود', 'فن الوقف والابتداء في النص', 'منهجية التحرير اللغوي قبل التسجيل'] },
  { title: 'التلوين الانفعالي والمشاعر',      intro: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع.',                                                   points: ['شجرة المشاعر وتصنيفاتها الصوتية', 'ترميز المشاعر داخل النص', 'التحكم بكثافة العاطفة في مختلف الأنواع'] },
  { title: 'تطبيقات التعليق الصوتي',         intro: 'ورشة تطبيقية على مختلف أنواع التعليق الصوتي المطلوبة في السوق.',                                points: ['الإعلانات التجارية والرد الآلي (IVR)', 'الكتب الصوتية والوثائقيات والأخبار', 'الدوبلاج وبرامج الأطفال'] },
  { title: 'مشروع التخرج والانطلاق في السوق', intro: 'خطوتك الفعلية نحو سوق العمل الصوتي.',                                                          points: ['بناء الهوية الصوتية الشخصية', 'إنتاج Voice Demo CV احترافي', 'خطة الـ 100 يوم الأولى في السوق'] },
];

/* ── Curriculum data ───────────────────────────────────────── */
const LECTURES_INPERSON = [
  {
    title: 'الصوت',
    desc:  'رحلة لاكتشاف مفهوم الصوت ومناطق خروجه ومعادنه، وصولاً إلى تحديد البصمة الصوتية الخاصة بك وإتقان فن تنويع الصوت.',
  },
  {
    title: 'التنفس',
    desc:  'مفتاح الصوت القوي؛ تتعلم فيه تشريح الجهاز التنفسي، تقنيات التنفس الحجابي والتحكم المركزي، وكيفية قراءة النَفَس داخل النص.',
  },
  {
    title: 'جهاز النطق',
    desc:  'تتبع رحلة الهواء من الرئة إلى نطق الحرف، مع التعرف على مخارج الحروف العربية الـ 28، وطرق التخلص من "الفم الكسول".',
  },
  {
    title: 'مهارة الاستماع والنقد السمعيّ',
    desc:  'تدريب أذنك لتصبح ناقدك الأول. يشمل حلقة التغذية الصوتية، منهجية نقد التسجيلات، والاستفادة من تجارب المحترفين.',
  },
  {
    title: 'اللغة العربيّة للمعلّق',
    desc:  'قواعد مصممة خصيصاً لاحتياجات المعلق؛ تغطي الهمزات، اللام الشمسية والقمرية، فن الوقف والابتداء، ومنهجية التحرير اللغوي.',
  },
  {
    title: 'المشاعر',
    desc:  'اكتشف شجرة المشاعر وكيفية استحضار العاطفة بصدق دون تمثيل، مع تعلم ترميز المشاعر داخل النص والتحكم بكثافتها.',
  },
  {
    title: 'التطبيق المهنيّ ومشروع التخرّج',
    desc:  'خطوتك نحو السوق؛ بناء هويتك وتسعير صوتك، التعامل مع العملاء والمنصات، وإنجاز مشروع التخرج.',
  },
  {
    title: 'ألوان التعليق الصوتي',
    desc:  'التدريب العملي والتطبيقي على الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.',
  },
];

/* ════════════════════════════════════════════════════════════
   COURSE PRICING CARD  (floating dark-navy card in hero)
════════════════════════════════════════════════════════════ */
function CoursePricingCard() {
  const waHref = waLink(
    '962771052222',
    'السلام عليكم، أرغب في التسجيل في البرنامج الشامل للتعليق والأداء الصوتي',
  );
  return (
    <div style={{
      width: '100%',
      background: NAVY,
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: '0 28px 64px rgba(29,39,56,0.22), 0 8px 20px rgba(0,0,0,0.12)',
    }}>
      {/* Cover image */}
      <div style={{ position: 'relative', height: 176, overflow: 'hidden' }}>
        <img
          src={heroCover}
          alt="دورة التعليق والأداء الصوتي"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(29,39,56,0.05) 30%, rgba(29,39,56,0.82) 100%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 12, right: 14, left: 14,
          fontFamily: F, fontWeight: 800, fontSize: 13,
          color: '#fff', lineHeight: 1.4,
        }}>
          البرنامج الشامل للتعليق والأداء الصوتي
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: '18px 16px 20px' }}>

        {/* Price rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>

          {/* حضوري */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,193,7,0.10)',
            border: '1px solid rgba(255,193,7,0.28)',
            borderRadius: 10, padding: '9px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(252,251,251,0.85)' }}>
                حضوري
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, direction: 'ltr' }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 18, color: GOLD }}>218</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: 12, color: 'rgba(252,251,251,0.65)' }}>JOD</span>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>260</span>
            </div>
          </div>

          {/* أونلاين */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 10, padding: '9px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wifi size={13} color='rgba(252,251,251,0.55)' strokeWidth={2.5} />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(252,251,251,0.72)' }}>
                عن بُعد
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, direction: 'ltr' }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 18, color: GOLD }}>$150</span>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>$200</span>
            </div>
          </div>
        </div>

        {/* Installment */}
        <p style={{
          fontFamily: F, fontSize: 11.5,
          color: 'rgba(255,193,7,0.72)',
          textAlign: 'center', margin: '0 0 14px',
        }}>
          ✦ بإمكانية التقسيط
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 14px' }} />

        {/* Stacked instructors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
          {[
            { img: yasar, name: 'يسار عبده'  },
            { img: rana,  name: 'رنا عزام'   },
            { img: omar,  name: 'عمر درابكة' },
          ].map(({ img, name }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={img} alt={name}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  objectFit: 'cover', objectPosition: 'center top',
                  border: '2px solid rgba(255,193,7,0.42)', flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'rgba(252,251,251,0.88)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center',
            background: GOLD, color: NAVY,
            fontFamily: F, fontWeight: 800, fontSize: 14,
            padding: '11px 0', borderRadius: 10,
            textDecoration: 'none',
            boxShadow: '0 6px 18px rgba(255,193,7,0.28)',
          }}
        >
          سجل الآن ←
        </a>
      </div>
    </div>
  );
}

/* ── Main page component ───────────────────────────────────── */
export default function CourseVoiceoverPage() {
  const [, navigate]   = useLocation();
  const [track, setTrack] = useState<'inperson' | 'online'>('inperson');
  const [currTab, setCurrTab] = useState<'inperson' | 'online'>('inperson');
  const [openLec, setOpenLec] = useState<number | null>(null);
  const [openAccordion, setOpenAccordion] = useState<'inperson' | 'online' | null>(null);
  const [partnerBarOpen, setPartnerBarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const INNER: React.CSSProperties = {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '0 clamp(16px,4vw,40px)',
  };

  return (
    <div dir="rtl" style={{
      position: 'relative', zIndex: 1,
      minHeight: '100vh', color: OFF,
    }}>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION — light off-white, two-column
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingTop: 'clamp(24px,4vw,56px)',
        paddingBottom: 'clamp(36px,4vw,64px)',
        background: '#F5F3EF',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{ ...INNER, display: 'flex', gap: 'clamp(24px,3vw,48px)', alignItems: 'flex-start' }}>

          {/* ── Right column — main content ── */}
          <div style={{ flex: 1, minWidth: 0, direction: 'rtl' }}>

            {/* breadcrumb */}
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#64748b', fontFamily: F, fontSize: 14, padding: 0,
                marginBottom: 22,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>←</span>
              الرجوع إلى قائمة الدورات
            </button>

            {/* tags row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {['صنّاع المحتوى', 'المذيعون والمقدّمون', 'المعلّقون الصّوتيون', 'المستوى المبتدئ'].map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'rgba(255,193,7,0.12)',
                  border: '1px solid rgba(255,193,7,0.35)',
                  color: '#92670a', borderRadius: 999,
                  fontFamily: F, fontWeight: 700, fontSize: 12,
                  padding: '5px 13px', whiteSpace: 'nowrap',
                }}>
                  {t}
                </span>
              ))}
            </div>

            {/* title */}
            <h1 style={{
              fontFamily: F, fontWeight: 900,
              fontSize: 'clamp(26px,3.8vw,46px)',
              color: '#1e293b', lineHeight: 1.2, margin: '0 0 16px',
            }}>
              البرنامج الشامل للتعليق والأداء الصوتي
            </h1>

            {/* quote */}
            <p style={{
              fontFamily: F, fontWeight: 500,
              fontSize: 'clamp(14px,1.6vw,17px)',
              color: GOLD, lineHeight: 1.8,
              margin: '0 0 24px',
              borderRight: `3px solid ${GOLD}`,
              paddingRight: 14,
            }}>
              "رؤيتنا تنبع من أن لكل نبرة قصة فريدة تستحق سردها"
            </p>

            {/* stats row */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px,1.5vw,18px)',
              marginBottom: 28, fontFamily: F, fontSize: 13.5, color: '#475569',
            }}>
              {[
                ['🪑', '10 مقاعد محدودة'],
                ['📜', 'شهادة معتمدة'],
                ['🗓️', '8 لقاءات'],
                ['⏳', '16 ساعة تدريبية'],
                ['🌍', 'عربي'],
              ].map(([icon, label]) => (
                <span key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.10)',
                  borderRadius: 999, padding: '6px 14px',
                  fontWeight: 500,
                }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* instructors row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
            }}>
              <div style={{ display: 'inline-flex' }}>
                {[yasar, rana, omar].map((img, i) => (
                  <img key={i} src={img} alt="" style={{
                    width: 44, height: 44, borderRadius: '50%',
                    objectFit: 'cover', objectPosition: 'center top',
                    border: '2px solid rgba(255,193,7,0.60)',
                    marginInlineStart: i > 0 ? -14 : 0,
                    boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                  }} />
                ))}
              </div>
              <div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#1e293b', display: 'block' }}>
                  بإشراف نخبة من أفضل المدربين
                </span>
                <span style={{ fontFamily: F, fontSize: 12.5, color: '#64748b' }}>
                  يسار عبده · رنا عزام · عمر درابكة
                </span>
              </div>
            </div>

            {/* trust badges */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30,
              fontFamily: F, fontSize: 13, color: '#64748b',
            }}>
              {[
                '🎓 شهادة معتمدة دولياً',
                '👨‍🏫 خبراء معتمدون',
                '🔄 إعادة التدريب مدى الحياة',
              ].map(b => (
                <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {b}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={waLink('962771052222', 'السلام عليكم، أرغب في التسجيل في البرنامج الشامل للتعليق والأداء الصوتي')}
                target="_blank" rel="noopener noreferrer"
                style={{
                  background: GOLD, color: NAVY,
                  fontFamily: F, fontWeight: 800, fontSize: 15,
                  padding: '13px 30px', borderRadius: 12,
                  textDecoration: 'none', display: 'inline-block',
                  boxShadow: '0 8px 22px rgba(255,193,7,0.32)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
              >
                سجل الآن ←
              </a>

              <a
                href={inPersonPdf} download
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.14)',
                  color: '#1e293b',
                  fontFamily: F, fontWeight: 700, fontSize: 14,
                  padding: '13px 22px', borderRadius: 12,
                  textDecoration: 'none', display: 'inline-flex',
                  alignItems: 'center', gap: 7,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.09)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
              >
                ⬇ تحميل الكتيب الوجاهي
              </a>

              <a
                href={onlinePdf} download
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.14)',
                  color: '#1e293b',
                  fontFamily: F, fontWeight: 700, fontSize: 14,
                  padding: '13px 22px', borderRadius: 12,
                  textDecoration: 'none', display: 'inline-flex',
                  alignItems: 'center', gap: 7,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.09)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
              >
                ⬇ تحميل كتيب الأونلاين
              </a>
            </div>
          </div>

          {/* ── Left column — floating pricing card ── */}
          <div ref={sidebarRef} style={{
            width: 'clamp(280px,28vw,310px)',
            flexShrink: 0,
            position: 'sticky', top: 20,
          }}>
            <CoursePricingCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          REGISTRATION OPTIONS — dark #0D0B14 + neon blobs
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: '#0D0B14', paddingBlock: 'clamp(48px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
        {/* Neon blobs */}
        <div aria-hidden className="ka-blob-1" style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,193,7,0.13) 0%, transparent 70%)', top: '-120px', right: '-80px', pointerEvents: 'none' }} />
        <div aria-hidden className="ka-blob-2" style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,30,140,0.10) 0%, transparent 70%)', bottom: '-60px', left: '10%', pointerEvents: 'none' }} />
        <div aria-hidden className="ka-blob-3" style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.09) 0%, transparent 70%)', top: '30%', left: '-60px', pointerEvents: 'none' }} />

        <div style={{ ...INNER, position: 'relative', zIndex: 1 }}>
          <SectionTitle>المواعيد المتاحة للتسجيل</SectionTitle>
          <p style={{ fontFamily: F, fontSize: 15, color: MUTED, lineHeight: 1.8, margin: '0 0 32px' }}>
            اختر طريقة التعلّم التي تناسب أسلوبك — كل مسار صُمِّم ليمنحك تجربة تدريبية استثنائية
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <TrackCard2
              variant="inperson"
              activeBatches={scheduleData.inPerson.filter(b => b.status === 'active')}
              upcomingBatches={scheduleData.inPerson.filter(b => b.status === 'upcoming')}
              expanded={openAccordion === 'inperson'}
              onToggle={() => { setOpenAccordion(openAccordion === 'inperson' ? null : 'inperson'); setTrack('inperson'); setCurrTab('inperson'); }}
            />
            <TrackCard2
              variant="online"
              activeBatches={scheduleData.online.filter(b => b.status === 'active')}
              upcomingBatches={scheduleData.online.filter(b => b.status === 'upcoming')}
              expanded={openAccordion === 'online'}
              onToggle={() => { setOpenAccordion(openAccordion === 'online' ? null : 'online'); setTrack('online'); setCurrTab('online'); }}
            />
          </div>

          <PartnerBar open={partnerBarOpen} onToggle={() => setPartnerBarOpen(p => !p)} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT + GOALS — light bg, 2-col + sticky advisor
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ ...INNER, display: 'flex', gap: 'clamp(24px,3vw,40px)', alignItems: 'flex-start' }}>

          {/* ── Main content ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <LightSectionTitle>نبذة عن البرنامج وأهدافه</LightSectionTitle>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,16.5px)', color: DM, lineHeight: 2, marginBottom: 40, maxWidth: 720 }}>
              يسعى هذا البرنامج إلى إعداد وتأهيل المتدربين لاحتراف مجال التعليق الصوتي وتجهيزهم بالمهارات اللازمة
              للاندماج في سوق العمل. ترتكز أهدافنا على تطوير مخارج الحروف والنطق السليم، والتمكن من التحكم في
              الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون تماماً لتعزيز الثقة بالنفس وتنمية
              مهارات الإلقاء والتواصل المهني.
            </p>

            <LightSectionTitle>الأهداف المتحققة</LightSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {([
                { Icon: Star,     text: 'إتقان كافة ألوان التعليق الصوتي: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.' },
                { Icon: Volume2,  text: 'تحسين مخارج الحروف والنطق السليم: التخلص من عيوب النطق وإتقان مخارج الحروف بشكل محترف.' },
                { Icon: Sliders,  text: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس: اكتساب مرونة صوتية كاملة للتحول بين النبرات أثناء التسجيل.' },
                { Icon: Mic,      text: 'كسر رهبة الميكروفون والاستوديو نهائياً: التأقلم التام مع البيئة الصوتية الاحترافية والعمل بثقة.' },
                { Icon: Zap,      text: 'تعزيز الثقة بالنفس والحضور الصوتي: بناء شخصية صوتية قوية وجذابة تعكس الاحترافية.' },
                { Icon: Briefcase,text: 'تنمية مهارات التواصل والأداء المهني: فهم متطلبات سوق العمل والتفاعل مع التوجيهات الإخراجية.' },
              ] as { Icon: React.ElementType; text: string }[]).map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 9, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <Icon size={17} color={GOLD} strokeWidth={2.2} />
                  </div>
                  <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.8, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Sticky advisor sidebar ── */}
          <div style={{ width: 'clamp(260px,26vw,310px)', flexShrink: 0, position: 'sticky', top: 24 }}>
            <div style={{ background: '#181325', borderRadius: 20, padding: '24px 20px', boxShadow: '0 20px 50px rgba(0,0,0,0.20)' }}>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 18, color: OFF, margin: '0 0 8px' }}>
                هل تحتاج مساعدة في التسجيل؟
              </h3>
              <p style={{ fontFamily: F, fontSize: 12.5, color: MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
                تواصل مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة
              </p>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <AdvisorMini
                  name="آية القماز"
                  role="مستشارة التسجيل — وجاهي"
                  photo={ayaImg}
                  href={waLink('962790234483', 'السلام عليكم، أرغب في الاستفسار عن المسار الوجاهي للبرنامج الشامل للتعليق الصوتي')}
                />
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <AdvisorMini
                  name="ياقوت الخشاشنة"
                  role="مستشارة التسجيل — أونلاين"
                  photo={yaqoutImg}
                  href={waLink('962771052222', 'السلام عليكم، أرغب في الاستفسار عن المسار الأونلاين للبرنامج الشامل للتعليق الصوتي')}
                />
              </div>
              <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.22)', borderRadius: 10 }}>
                <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,193,7,0.80)', lineHeight: 1.65, margin: 0 }}>
                  ⏱ أوقات التواصل: يومياً من 9 صباحاً حتى 10 مساءً
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPECTED OUTCOMES — light bg, lucide icons
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={INNER}>
          <LightSectionTitle>المخرجات التدريبية المتوقعة</LightSectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {([
              { Icon: Award,    title: 'شهادة معتمدة رسمياً',                   desc: 'شهادة إتمام البرنامج معتمدة رسمياً من منصة "وجيز" وأكاديمية "كاسيت ميديا".' },
              { Icon: Mic,      title: 'ديمو صوتي احترافي (Voice Demo CV)',      desc: 'ملف صوتي متكامل مُهندَس بأحدث المؤثرات، يستعرض خامات صوتك في مختلف ألوان التعليق.' },
              { Icon: Volume2,  title: 'تسجيلات استوديو عالية الجودة',           desc: 'عينات صوتية احترافية مسجلة بأحدث اللاقطات داخل استوديوهات كاسيت الفعلية.' },
              { Icon: Star,     title: 'عضوية قاعدة بيانات كاسيت + مشروع التخرج', desc: 'إدراج اسمك وصوتك في بنك الأصوات المعتمد للحصول على فرص ترشيح لمشاريع إنتاجية حقيقية.' },
            ] as { Icon: React.ElementType; title: string; desc: string }[]).map(({ Icon, title, desc }, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.08)', padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 3px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(224,30,140,0.08)', border: '1px solid rgba(224,30,140,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={RASB} strokeWidth={2} />
                </div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: DH, margin: 0, lineHeight: 1.3 }}>{title}</h4>
                <p style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.8, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CURRICULUM — light bg, print button, 2hr badges
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={INNER}>
          {/* Header row: title + print button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
              <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: DH, margin: 0, lineHeight: 1.2 }}>الخطة الدراسية</h2>
            </div>
            <button
              onClick={() => window.print()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid rgba(0,0,0,0.12)', color: DM, fontFamily: F, fontWeight: 700, fontSize: 13.5, padding: '9px 18px', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}
            >
              <Printer size={15} color={DM} strokeWidth={2} />
              طباعة المنهج
            </button>
          </div>

          {/* Track toggle */}
          <div style={{ display: 'inline-flex', gap: 0, background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 4, marginBottom: 28, border: '1px solid rgba(0,0,0,0.10)' }}>
            {(['inperson', 'online'] as const).map(t => (
              <button key={t} onClick={() => setCurrTab(t)} style={{
                background: currTab === t ? GOLD : 'transparent',
                color: currTab === t ? NAVY : DM,
                border: 'none', borderRadius: 9,
                fontFamily: F, fontWeight: 700, fontSize: 14,
                padding: '9px 22px', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {t === 'inperson' ? '🏢 حضوري (16 ساعة)' : '🌐 عن بُعد (أونلاين)'}
              </button>
            ))}
          </div>

          {currTab === 'inperson' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LECTURES_INPERSON.map((lec, i) => (
                <div key={i} style={{ background: '#fff', border: `1px solid ${openLec === i ? 'rgba(255,193,7,0.45)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <button onClick={() => setOpenLec(openLec === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', textAlign: 'right', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                      <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 13, color: GOLD, flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i + 1}
                      </span>
                      <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: DH, textAlign: 'right' }}>{lec.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontFamily: FP, fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 6, padding: '3px 8px' }}>ساعتان</span>
                      <span style={{ fontSize: 18, color: openLec === i ? GOLD : DF, transform: openLec === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s, color 0.2s', display: 'inline-block' }}>+</span>
                    </div>
                  </button>
                  {openLec === i && (
                    <div style={{ padding: '0 20px 18px', fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.85, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }}>
                      {lec.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ONLINE_MODULES_V.map((mod, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '22px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={15} color={GOLD} strokeWidth={2.2} />
                    </div>
                    <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: DH, margin: 0 }}>{mod.title}</h4>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75, margin: '0 0 12px' }}>{mod.intro}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {mod.points.map((pt, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: DF }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0, marginTop: 6 }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INSTRUCTORS — light bg, full-width stacked cards
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)' }}>
        <div style={INNER}>
          <LightSectionTitle>خبراؤنا في التدريس</LightSectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                photo: yasar, name: 'يسار عبده',
                role: 'مدرب إعلامي وخبير تعليق صوتي',
                bio: 'يتمتع بخبرة تزيد عن 20 عاماً، ومدرب معتمد لدى الأمم المتحدة. يحمل البكالوريوس في اللغة الإنجليزية وعلم الأصوات والماجستير في حقوق الإنسان. خبرته تغطي الدوبلاج، الأخبار، الأفلام الوثائقية والإعلانات.',
              },
              {
                photo: rana, name: 'رنا عزام',
                role: 'إعلامية مختصة بالتحرير والتدقيق اللغوي',
                bio: 'معدة ومقدمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت لسنوات كمحررة ومدققة ومذيعة في مجمع اللغة العربية. حاصلة على بكالوريوس اللغة العربية وآدابها من جامعة اليرموك.',
              },
              {
                photo: omar, name: 'عمر درابكة',
                role: 'معلّق صوتي محترف ومدرب أداء وإلقاء خطابي',
                bio: 'يمتلك خبرة تتجاوز 12 عاماً، سجّل خلالها مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون.',
              },
            ].map((ins, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)', padding: 'clamp(22px,3vw,32px)', display: 'flex', gap: 'clamp(20px,2.5vw,32px)', alignItems: 'flex-start', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', direction: 'rtl' }}>
                <img src={ins.photo} alt={ins.name} style={{ width: 'clamp(80px,10vw,110px)', height: 'clamp(80px,10vw,110px)', borderRadius: 16, objectFit: 'cover', objectPosition: 'center top', border: '3px solid rgba(255,193,7,0.45)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(17px,2vw,20px)', color: DH, marginBottom: 4 }}>{ins.name}</div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: GOLD, marginBottom: 14 }}>{ins.role}</div>
                  <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.85, margin: 0 }}>{ins.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   REGISTRATION CARD (sticky sidebar)
════════════════════════════════════════════════════════════ */
function RegistrationCard({ track, onRegister }: {
  track: 'inperson' | 'online';
  onRegister: () => void;
}) {
  return (
    <div style={{
      background: CARD2,
      border: '1px solid rgba(255,193,7,0.20)',
      borderRadius: 20,
      padding: 'clamp(20px,2.5vw,28px)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.40)',
      direction: 'rtl',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20,
      }}>
        {/* In-person price */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px',
          background: track === 'inperson' ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${track === 'inperson' ? 'rgba(255,193,7,0.35)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, transition: 'all 0.3s',
        }}>
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: MUTED }}>حضوري</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD }}>
                218
              </span>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: MUTED }}>
                دينار
              </span>
              <span style={{
                fontFamily: FP, fontSize: 12, color: 'rgba(252,251,251,0.35)',
                textDecoration: 'line-through',
              }}>
                260
              </span>
            </div>
          </div>
          {track === 'inperson' && (
            <span style={{
              fontFamily: F, fontWeight: 700, fontSize: 11,
              background: GOLD, color: NAVY, borderRadius: 6, padding: '4px 9px',
            }}>
              مختار
            </span>
          )}
        </div>

        {/* Online price */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px',
          background: track === 'online' ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${track === 'online' ? 'rgba(255,193,7,0.35)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, transition: 'all 0.3s',
        }}>
          <div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: MUTED }}>أونلاين</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD }}>
                $150
              </span>
            </div>
          </div>
          {track === 'online' && (
            <span style={{
              fontFamily: F, fontWeight: 700, fontSize: 11,
              background: GOLD, color: NAVY, borderRadius: 6, padding: '4px 9px',
            }}>
              مختار
            </span>
          )}
        </div>
      </div>

      {/* installment note */}
      <p style={{
        fontFamily: F, fontSize: 12.5, color: 'rgba(255,193,7,0.75)',
        textAlign: 'center', margin: '0 0 18px',
      }}>
        ✦ بإمكانية التقسيط
      </p>

      {/* instructor avatars */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
        paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'inline-flex' }}>
          {[yasar, rana, omar].map((img, i) => (
            <img key={i} src={img} alt="" style={{
              width: 36, height: 36, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: '2px solid rgba(255,193,7,0.45)',
              marginInlineStart: i > 0 ? -10 : 0,
            }} />
          ))}
        </div>
        <span style={{ fontFamily: F, fontSize: 12.5, color: MUTED }}>
          3 مدربين متخصصين
        </span>
      </div>

      {/* Register CTA */}
      <button
        onClick={onRegister}
        style={{
          width: '100%', background: GOLD, color: NAVY,
          border: 'none', borderRadius: 12,
          fontFamily: F, fontWeight: 800, fontSize: 15,
          padding: '14px 0', cursor: 'pointer',
          boxShadow: '0 8px 22px rgba(255,193,7,0.30)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
      >
        عرض المواعيد والتسجيل ←
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   COMPACT BATCH ROW  (used inside TrackCard2 expanded panel)
════════════════════════════════════════════════════════════ */
type ScheduleEntry = {
  id: string; group: string; course: string; instructor: string;
  days: string; time: string; month: string; day: string; status: string;
};

function CompactBatchRow({ batch, accent }: { batch: ScheduleEntry; accent: string }) {
  const hasDay = batch.day && batch.day !== '--';
  const isComingSoon = batch.status === 'upcoming';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', direction: 'rtl',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Date box */}
      <div style={{
        width: 46, height: 46, borderRadius: 10, flexShrink: 0,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 1,
      }}>
        {hasDay ? (
          <>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.45)', lineHeight: 1 }}>{batch.month}</span>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 20, color: '#fff', lineHeight: 1 }}>{batch.day}</span>
          </>
        ) : (
          <span style={{ fontFamily: F, fontSize: 9.5, fontWeight: 700, color: 'rgba(252,251,251,0.45)', textAlign: 'center', lineHeight: 1.4 }}>
            {batch.month === 'قريباً' ? 'قريباً' : batch.month}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: OFF, marginBottom: 3 }}>
          {batch.group}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
          fontFamily: F, fontSize: 11.5, color: MUTED,
        }}>
          {batch.days && batch.days !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={10} color={MUTED} strokeWidth={2} />
              {batch.days}
            </span>
          )}
          {batch.time && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} color={MUTED} strokeWidth={2} />
              {batch.time}
            </span>
          )}
          <span style={{ color: 'rgba(252,251,251,0.50)', fontSize: 11 }}>· {batch.instructor}</span>
        </div>
      </div>

      {/* Status pill */}
      {isComingSoon ? (
        <span style={{
          flexShrink: 0, fontFamily: F, fontWeight: 700, fontSize: 10.5,
          background: `rgba(${accent === '#FFC107' ? '255,193,7' : '103,232,249'},0.12)`,
          border: `1px solid rgba(${accent === '#FFC107' ? '255,193,7' : '103,232,249'},0.25)`,
          color: accent, borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          قريباً
        </span>
      ) : (
        <span style={{
          flexShrink: 0, fontFamily: F, fontWeight: 700, fontSize: 10.5,
          background: 'rgba(34,197,94,0.12)',
          border: '1px solid rgba(34,197,94,0.25)',
          color: '#4ade80', borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          جارية
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TRACK CARD 2  (new reference-style card)
════════════════════════════════════════════════════════════ */
function TrackCard2({
  variant, activeBatches, upcomingBatches, expanded, onToggle,
}: {
  variant: 'inperson' | 'online';
  activeBatches: ScheduleEntry[];
  upcomingBatches: ScheduleEntry[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const isInperson = variant === 'inperson';

  /* Kaseet-palette gradients */
  const bg = isInperson
    ? 'linear-gradient(150deg, #1e1506 0%, #19110a 55%, #141010 100%)'
    : 'linear-gradient(150deg, #0b1220 0%, #101827 55%, #161f2e 100%)';

  const accent       = isInperson ? '#FFC107' : '#67e8f9';
  const accentRgb    = isInperson ? '255,193,7' : '103,232,249';
  const badgeBg      = `rgba(${accentRgb},0.13)`;
  const badgeBorder  = `rgba(${accentRgb},0.28)`;
  const borderColor  = expanded ? `rgba(${accentRgb},0.55)` : 'rgba(255,255,255,0.08)';

  const price        = isInperson ? '218 دينار' : '$150';
  const priceStrike  = isInperson ? '260 دينار' : '$200';
  const waPhone      = isInperson ? '962790234483' : '962771052222';
  const waMsg        = isInperson
    ? 'السلام عليكم، أرغب في حجز مقعد في المسار الوجاهي — دورة التعليق والأداء الصوتي'
    : 'السلام عليكم، أرغب في حجز مقعد في المسار الأونلاين — دورة التعليق الصوتي';

  const totalCount = activeBatches.length + upcomingBatches.length;

  return (
    <div
      onClick={onToggle}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 20, cursor: 'pointer',
        transition: 'border-color 0.25s',
        direction: 'rtl', overflow: 'hidden',
      }}
    >
      {/* ── Card body (always visible) ── */}
      <div style={{ padding: 'clamp(20px,2.5vw,28px)' }}>

        {/* Badge */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: badgeBg, border: `1px solid ${badgeBorder}`,
            color: accent, borderRadius: 999,
            fontFamily: F, fontWeight: 700, fontSize: 12,
            padding: '5px 14px',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: accent, display: 'inline-block',
            }} />
            {isInperson ? 'الأعمق تأثيراً' : 'الأكثر مرونة'}
          </span>
        </div>

        {/* Title + icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: F, fontWeight: 900,
            fontSize: 'clamp(28px,3.5vw,36px)',
            color: '#fff', margin: 0, lineHeight: 1.1,
          }}>
            {isInperson ? 'حضوري' : 'عن بُعد'}
          </h3>
          <div style={{
            background: 'rgba(0,0,0,0.28)',
            borderRadius: 10, padding: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isInperson
              ? <MapPin size={18} color={accent} strokeWidth={2.2} />
              : <Wifi    size={18} color={accent} strokeWidth={2.2} />}
          </div>
        </div>

        {/* Coloured subtitle */}
        <div style={{
          fontFamily: F, fontWeight: 700, fontSize: 14.5,
          color: accent, marginBottom: 8,
        }}>
          {isInperson ? 'تعلّم وجهاً لوجه' : 'تعلّم من أي مكان'}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: F, fontSize: 13.5, color: MUTED,
          lineHeight: 1.75, margin: '0 0 24px',
        }}>
          {isInperson
            ? 'تفاعل مباشر مع المدربين المعتمدين في بيئة تدريبية احترافية تُشعل الدافعية وتُسرّع النمو'
            : 'مرونة كاملة في الوقت والمكان دون التنازل عن جودة التدريب أو عمق التفاعل'}
        </p>

        {/* Bottom row: batch count + chevron toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Calendar size={14} color={MUTED} strokeWidth={2} />
            <span style={{ fontFamily: F, fontSize: 13, color: MUTED }}>
              {totalCount} شعب متاحة
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onToggle(); }}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: expanded ? `rgba(${accentRgb},0.15)` : 'rgba(255,255,255,0.08)',
              border: `1px solid ${expanded ? `rgba(${accentRgb},0.35)` : 'rgba(255,255,255,0.14)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <ChevronDown
              size={16}
              color={expanded ? accent : 'rgba(252,251,251,0.65)'}
              strokeWidth={2.5}
              style={{
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div style={{
          borderTop: `1px solid rgba(${accentRgb},0.18)`,
          background: 'rgba(0,0,0,0.22)',
          padding: 'clamp(16px,2.5vw,24px)',
        }}>

          {/* Active batches */}
          {activeBatches.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
              }}>
                <div style={{ width: 3, height: 16, background: '#4ade80', borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: '#4ade80' }}>
                  الدورات الفعالة حالياً
                </span>
                <span style={{
                  fontFamily: F, fontSize: 11, fontWeight: 700,
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  color: '#4ade80', borderRadius: 999, padding: '2px 9px',
                }}>
                  {activeBatches.length}
                </span>
              </div>
              {activeBatches.map(b => (
                <CompactBatchRow key={b.id} batch={b} accent={accent} />
              ))}
            </div>
          )}

          {/* Upcoming August batches */}
          {upcomingBatches.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                marginTop: activeBatches.length > 0 ? 20 : 0,
              }}>
                <div style={{ width: 3, height: 16, background: accent, borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: accent }}>
                  الدورات القادمة
                </span>
                <span style={{
                  fontFamily: F, fontSize: 11, fontWeight: 700,
                  background: badgeBg, border: `1px solid ${badgeBorder}`,
                  color: accent, borderRadius: 999, padding: '2px 9px',
                }}>
                  {upcomingBatches.length}
                </span>
              </div>
              {upcomingBatches.map(b => (
                <CompactBatchRow key={b.id} batch={b} accent={accent} />
              ))}
            </div>
          )}

          {/* Price badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '20px 0 16px',
            padding: '14px 18px',
            background: 'rgba(0,0,0,0.20)',
            borderRadius: 12,
            border: `1px solid rgba(${accentRgb},0.18)`,
          }}>
            <div>
              <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 2 }}>
                السعر بعد الخصم
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 22, color: GOLD }}>
                  {price}
                </span>
                <span style={{
                  fontFamily: "'Poppins',sans-serif", fontSize: 13,
                  color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through',
                }}>
                  {priceStrike}
                </span>
              </div>
            </div>
            <div style={{ marginRight: 'auto' }}>
              <span style={{
                fontFamily: F, fontSize: 11.5, fontWeight: 700,
                color: 'rgba(255,193,7,0.70)',
              }}>
                بإمكانية التقسيط
              </span>
            </div>
          </div>

          {/* CTA */}
          <a
            href={waLink(waPhone, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', boxSizing: 'border-box',
              background: accent, color: isInperson ? NAVY : '#0a1020',
              border: 'none', borderRadius: 12,
              fontFamily: F, fontWeight: 800, fontSize: 14.5,
              padding: '13px 20px', cursor: 'pointer',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            احجز مقعدك في هذا المسار ←
          </a>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PARTNER BAR
════════════════════════════════════════════════════════════ */
function PartnerBar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div style={{
      marginTop: 20, borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      direction: 'rtl',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: CARD, border: 'none',
          display: 'flex', alignItems: 'center',
          padding: '14px 20px', cursor: 'pointer', gap: 10,
          justifyContent: 'space-between',
        }}
      >
        {/* Right side: icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <GraduationCap size={17} color={GOLD} strokeWidth={2} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>
            المؤسسات التعليمية الشريكة
          </span>
        </div>

        {/* Left side: badge + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <span style={{
            fontFamily: F, fontWeight: 700, fontSize: 12,
            background: 'rgba(255,193,7,0.15)',
            border: '1px solid rgba(255,193,7,0.30)',
            color: GOLD, borderRadius: 999, padding: '3px 11px',
          }}>
            1
          </span>
          <ChevronDown
            size={15}
            color={MUTED}
            strokeWidth={2.5}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
          />
        </div>
      </button>

      {/* Expanded partners list */}
      {open && (
        <div style={{
          background: DARK, padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: 'rgba(255,193,7,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <GraduationCap size={18} color={GOLD} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>
                تطبيق وجيز
              </div>
              <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 2 }}>
                أكبر منصة صوتية بالشرق الأوسط — شريك اعتماد رسمي لشهادات البرنامج
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TRACK CARD
════════════════════════════════════════════════════════════ */
function TrackCard({
  selected, onClick, icon, badge, title, subtitle, details,
  price, priceStrike, priceLabel, cta, installment,
  batchCount, expanded, onExpand,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  badge: string;
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  price: string;
  priceStrike?: string;
  priceLabel: string;
  cta: string;
  installment?: boolean;
  batchCount?: number;
  expanded?: boolean;
  onExpand?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(255,193,7,0.07)' : CARD,
        border: `2px solid ${selected ? GOLD : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)',
        cursor: 'pointer', transition: 'all 0.25s',
        direction: 'rtl',
      }}
    >
      {/* header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 16, gap: 10,
      }}>
        <div>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <h3 style={{
            fontFamily: F, fontWeight: 900, fontSize: 20,
            color: selected ? GOLD : OFF, margin: '8px 0 6px',
          }}>
            {title}
          </h3>
          <p style={{ fontFamily: F, fontSize: 13.5, color: MUTED, margin: 0, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        </div>
        <span style={{
          fontFamily: F, fontWeight: 700, fontSize: 11,
          background: selected ? GOLD : 'rgba(255,255,255,0.08)',
          color: selected ? NAVY : MUTED,
          borderRadius: 6, padding: '5px 10px', flexShrink: 0, whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}>
          {badge}
        </span>
      </div>

      {/* details list */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: 20, paddingBottom: 20,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        {details.map(d => (
          <div key={d.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <GoldDot />
            <span style={{ fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.7 }}>
              <strong style={{ color: 'rgba(252,251,251,0.85)', fontWeight: 700 }}>{d.label}:</strong>
              {' '}{d.value}
            </span>
          </div>
        ))}
      </div>

      {/* price + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginBottom: 2 }}>{priceLabel}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: GOLD }}>
              {price}
            </span>
            {priceStrike && (
              <span style={{
                fontFamily: FP, fontSize: 13, color: 'rgba(252,251,251,0.30)',
                textDecoration: 'line-through',
              }}>
                {priceStrike}
              </span>
            )}
          </div>
          {installment && (
            <div style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,0.65)', marginTop: 3 }}>
              بإمكانية التقسيط
            </div>
          )}
        </div>

        <div style={{
          background: selected ? GOLD : 'rgba(255,255,255,0.08)',
          color: selected ? NAVY : OFF,
          border: selected ? 'none' : '1px solid rgba(255,255,255,0.15)',
          borderRadius: 10, padding: '10px 20px',
          fontFamily: F, fontWeight: 700, fontSize: 13.5,
          transition: 'all 0.2s', whiteSpace: 'nowrap',
        }}>
          {selected ? '✓ تم الاختيار' : cta}
        </div>
      </div>

      {/* Expand batches toggle */}
      {onExpand && batchCount !== undefined && (
        <button
          onClick={e => { e.stopPropagation(); onExpand(); }}
          style={{
            marginTop: 16, width: '100%',
            background: expanded ? 'rgba(255,193,7,0.10)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${expanded ? 'rgba(255,193,7,0.30)' : 'rgba(255,255,255,0.10)'}`,
            borderRadius: 10, padding: '9px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: expanded ? GOLD : MUTED }}>
            {expanded ? 'إخفاء المواعيد' : `عرض ${batchCount} شعبة متاحة`}
          </span>
          <ChevronDown
            size={16}
            color={expanded ? GOLD : MUTED}
            strokeWidth={2.5}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s',
            }}
          />
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   BATCH CARD
════════════════════════════════════════════════════════════ */
type BatchEntry = {
  id: string;
  group: string;
  course: string;
  instructor: string;
  days: string;
  month: string;
  day: string;
  startDate: string;
  endDate: string;
  status: string;
};

function BatchCard({ batch, isLast }: { batch: BatchEntry; isLast: boolean }) {
  const hasDay = batch.day && batch.day !== '--';
  const isOnline = batch.course.includes('أونلاين');

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 'clamp(10px,2vw,18px)',
      padding: 'clamp(14px,2vw,18px) clamp(14px,2.5vw,22px)',
      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
      direction: 'rtl', flexWrap: 'wrap',
    }}>

      {/* ── Date box ── */}
      <div style={{
        width: 64, height: 64, borderRadius: 14, flexShrink: 0,
        background: '#1D1A27',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        {hasDay ? (
          <>
            <span style={{
              fontFamily: F, fontSize: 10, color: 'rgba(252,251,251,0.50)',
              fontWeight: 600, lineHeight: 1,
            }}>
              {batch.month}
            </span>
            <span style={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 900,
              fontSize: 24, color: '#fff', lineHeight: 1,
            }}>
              {batch.day}
            </span>
          </>
        ) : (
          <span style={{
            fontFamily: F, fontSize: 11, fontWeight: 700,
            color: 'rgba(252,251,251,0.55)', textAlign: 'center', lineHeight: 1.3,
          }}>
            {batch.month}<br />قريباً
          </span>
        )}
      </div>

      {/* ── Centre info ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Line 1: group name + status badge */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 5 }}>
          <span style={{
            fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF,
          }}>
            {batch.group}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.28)',
            color: '#4ade80', borderRadius: 999,
            fontFamily: F, fontWeight: 700, fontSize: 11,
            padding: '2px 10px', whiteSpace: 'nowrap',
          }}>
            • {batch.status}
          </span>
        </div>

        {/* Line 2: course + instructor + days + dates */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6,
          fontFamily: F, fontSize: 12.5, color: MUTED, marginBottom: 5,
        }}>
          <span>{batch.course}</span>
          <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
          <span style={{ color: 'rgba(252,251,251,0.75)', fontWeight: 600 }}>{batch.instructor}</span>
          <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={11} color={MUTED} strokeWidth={2} />
            {batch.days}
          </span>
          {batch.startDate !== 'قريباً' && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Clock size={11} color={MUTED} strokeWidth={2} />
                {batch.startDate}
                {batch.endDate && batch.endDate !== '-' && ` — ${batch.endDate}`}
              </span>
            </>
          )}
        </div>

        {/* Line 3: lecture count link */}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: F, fontSize: 12, fontWeight: 700,
            color: GOLD,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}
        >
          {isOnline ? '22' : '23'} محاضرة — اضغط لعرض الجدول الزمني
          <ChevronDown size={12} color={GOLD} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Seat progress ── */}
      <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 60 }}>
        <div style={{ fontFamily: F, fontSize: 10, color: MUTED, marginBottom: 4 }}>المقاعد</div>
        <div style={{
          width: 56, height: 6, borderRadius: 99,
          background: 'rgba(255,255,255,0.10)', overflow: 'hidden',
        }}>
          <div style={{
            width: hasDay ? '70%' : '25%',
            height: '100%',
            background: hasDay ? '#f97316' : '#22c55e',
            borderRadius: 99,
          }} />
        </div>
        <div style={{
          fontFamily: F, fontSize: 10, fontWeight: 700,
          color: hasDay ? '#fb923c' : '#4ade80', marginTop: 3,
        }}>
          {hasDay ? 'جارية' : 'متاحة'}
        </div>
      </div>

      {/* ── CTA button ── */}
      <a
        href={`https://wa.me/${isOnline ? '962771052222' : '962790234483'}?text=${encodeURIComponent(`السلام عليكم، أرغب في حجز مقعد في ${batch.group} — ${batch.course}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{
          flexShrink: 0,
          background: '#0F2A28',
          color: '#34d399',
          border: '1px solid rgba(52,211,153,0.30)',
          borderRadius: 10, padding: '9px 16px',
          fontFamily: F, fontWeight: 700, fontSize: 13,
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'background 0.2s, color 0.2s',
          textDecoration: 'none', display: 'inline-block',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#10b981';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#0F2A28';
          e.currentTarget.style.color = '#34d399';
        }}
      >
        احجز مقعدك
      </a>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ADVISOR CARD
════════════════════════════════════════════════════════════ */
function AdvisorCard({ name, role, badge, photo, waLink: link, ctaLabel, highlighted }: {
  name: string;
  role: string;
  badge: string;
  photo: string;
  waLink: string;
  ctaLabel: string;
  highlighted: boolean;
}) {
  return (
    <div style={{
      background: highlighted ? 'rgba(255,193,7,0.07)' : CARD,
      border: `2px solid ${highlighted ? GOLD : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)',
      display: 'flex', flexDirection: 'column', gap: 16,
      direction: 'rtl', transition: 'all 0.3s',
      boxShadow: highlighted ? '0 8px 30px rgba(255,193,7,0.15)' : 'none',
    }}>
      {/* badge */}
      <span style={{
        alignSelf: 'flex-start',
        fontFamily: F, fontWeight: 700, fontSize: 12,
        background: highlighted ? GOLD : 'rgba(255,255,255,0.08)',
        color: highlighted ? NAVY : MUTED,
        borderRadius: 6, padding: '5px 12px',
        transition: 'all 0.3s',
      }}>
        {badge}
      </span>

      {/* photo + info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src={photo} alt={name} style={{
            width: 72, height: 72, borderRadius: '50%',
            objectFit: 'cover', objectPosition: 'center top',
            border: `2px solid ${highlighted ? GOLD : 'rgba(255,255,255,0.20)'}`,
            transition: 'border 0.3s',
          }} />
          <span style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 12, height: 12, borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #1D2738',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: F, fontWeight: 800, fontSize: 17,
            color: highlighted ? GOLD : OFF, marginBottom: 4,
            transition: 'color 0.3s',
          }}>
            {name}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUTED }}>
            {role}
          </div>
        </div>
      </div>

      {/* availability */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: F, fontSize: 13, color: '#86efac',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#22c55e', display: 'inline-block',
        }} />
        متواجدة للرد الآن
      </div>

      {/* CTA */}
      <a
        href={link}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'block', textAlign: 'center',
          background: highlighted ? GOLD : 'rgba(255,255,255,0.08)',
          color: highlighted ? NAVY : OFF,
          border: highlighted ? 'none' : '1px solid rgba(255,255,255,0.15)',
          borderRadius: 10, padding: '12px 0',
          fontFamily: F, fontWeight: 800, fontSize: 14,
          textDecoration: 'none', transition: 'all 0.3s',
        }}
        onMouseEnter={e => {
          if (!highlighted) e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
        }}
        onMouseLeave={e => {
          if (!highlighted) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
