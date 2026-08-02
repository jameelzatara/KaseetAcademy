import { useState, useEffect, useRef } from 'react';
import InstructorsSection from '@/components/InstructorsSection';
import { useLocation } from 'wouter';
import { ChevronDown, Calendar, Clock, MapPin, Wifi, Users, GraduationCap, Award, Mic, Volume2, Star, Printer, BookOpen, Zap, Briefcase, Sliders, CheckCircle2, ArrowLeft, MessageCircle, Download, Globe, RefreshCw, Circle, Sparkles, Video } from 'lucide-react';

/* ── Asset imports ─────────────────────────────────────────── */
import ayaImg      from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';
import yasar       from '@assets/course_01_instructor_1785428932171.jpeg';
import rana        from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar        from '@assets/trainer-omar_1785428945248.jpg';
import heroCover   from '@assets/course_01_cover_new_1785679077227.jpg';
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
          تواصل الآن <MessageCircle size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 3 }} />
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
  { title: 'الاستوديو المنزلي والمعدات',      intro: 'كيفية تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة.',                                 points: ['اختيار الميكروفون المناسب لصوتك وميزانيتك', 'المعالجة الصوتية بالفوم والمواد المتاحة محلياً', 'برامج التسجيل والمونتاج للمبتدئين'] },
  { title: 'أساسيات الصوت والتنفس',           intro: 'تأسيس مهاري شامل يبني جسراً بين الصوت الطبيعي والصوت الاحترافي.',                              points: ['مناطق الرنين الصوتي ومعادن الصوت المختلفة', 'التنفس الحجابي وإدارة النَفَس أثناء التسجيل', 'تمارين تطوير الحضور الصوتي والثقة'] },
  { title: 'النطق ومخارج الحروف',             intro: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي.',                                       points: ['مخارج الحروف العربية الـ 28 بالتطبيق المباشر', 'التخلص من "الفم الكسول" والنطق الرخو', 'تمارين اللسان والشفتين والحلق يومياً'] },
  { title: 'اللغة العربية والتحرير اللغوي',   intro: 'قواعد لغوية تطبيقية مصممة خصيصاً لاحتياجات المعلق الصوتي.',                                    points: ['الهمزات والتنوين والمدود في نصوص التعليق', 'فن الوقف والابتداء وأثره على المعنى الصوتي', 'منهجية التحرير اللغوي الاحترافي قبل التسجيل'] },
  { title: 'التلوين الانفعالي والمشاعر',      intro: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع.',                                                   points: ['شجرة المشاعر وتصنيفاتها الصوتية التطبيقية', 'ترميز المشاعر داخل النص وقراءتها صوتياً', 'التحكم بكثافة العاطفة في مختلف أنواع التعليق'] },
  { title: 'تطبيقات التعليق الصوتي',         intro: 'ورشة تطبيقية على مختلف أنواع التعليق الصوتي المطلوبة في السوق.',                                points: ['الإعلانات التجارية وأسلوب الإقناع الصوتي', 'الرد الآلي (IVR) والكتب الصوتية والوثائقيات', 'الأخبار والدوبلاج وبرامج الأطفال'] },
  { title: 'مشروع التخرج والانطلاق في السوق', intro: 'خطوتك الفعلية نحو سوق العمل الصوتي.',                                                          points: ['بناء الهوية الصوتية الشخصية وتسعير الخدمات', 'إنتاج Voice Demo CV احترافي متكامل', 'خطة الـ 100 يوم الأولى في سوق التعليق'] },
];

/* ── Curriculum data ───────────────────────────────────────── */
const LECTURES_INPERSON = [
  {
    title: 'الصوت',
    desc:   'رحلة لاكتشاف مفهوم الصوت ومناطق خروجه ومعادنه، وصولاً إلى تحديد البصمة الصوتية الخاصة بك وإتقان فن تنويع الصوت.',
    points: ['مفهوم الصوت ومناطق الرنين الصوتي', 'تحديد معدن الصوت والبصمة الصوتية الشخصية', 'فن تنويع الصوت والتلوين الأدائي'],
  },
  {
    title: 'التنفس',
    desc:   'مفتاح الصوت القوي؛ تتعلم تشريح الجهاز التنفسي، تقنيات التنفس الحجابي والتحكم المركزي، وكيفية قراءة النَفَس داخل النص.',
    points: ['تشريح الجهاز التنفسي وآلية عمله الصوتي', 'التنفس الحجابي والتحكم المركزي بالنَفَس', 'قراءة علامات النَفَس داخل النص الصوتي'],
  },
  {
    title: 'جهاز النطق',
    desc:   'تتبع رحلة الهواء من الرئة إلى نطق الحرف، مع التعرف على مخارج الحروف العربية الـ 28، وطرق التخلص من "الفم الكسول".',
    points: ['رحلة الهواء من الرئة إلى نطق الحرف', 'مخارج الحروف العربية الـ 28 بالتطبيق العملي', 'التخلص من الفم الكسول وتمارين عضلات النطق'],
  },
  {
    title: 'ألوان التعليق الصوتي',
    desc:   'التدريب العملي والتطبيقي على الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.',
    points: ['الإعلانات التجارية وأسلوب الإقناع الصوتي', 'الرد الآلي (IVR) والكتب الصوتية والوثائقيات', 'الأخبار والدوبلاج وبرامج الأطفال'],
  },
  {
    title: 'مهارة الاستماع والنقد السمعيّ',
    desc:   'تدريب أذنك لتصبح ناقدك الأول. يشمل حلقة التغذية الصوتية، منهجية نقد التسجيلات، والاستفادة من تجارب المحترفين.',
    points: ['حلقة التغذية الراجعة الصوتية الاحترافية', 'منهجية نقد التسجيلات بمعايير السوق', 'التعلم من نماذج المحترفين وتحليل أعمالهم'],
  },
  {
    title: 'اللغة العربيّة للمعلّق',
    desc:   'قواعد مصممة خصيصاً لاحتياجات المعلق؛ تغطي الهمزات، اللام الشمسية والقمرية، فن الوقف والابتداء، ومنهجية التحرير اللغوي.',
    points: ['الهمزات والتنوين والمدود في النص الصوتي', 'اللام الشمسية والقمرية وفن الوقف والابتداء', 'منهجية التحرير اللغوي قبل الدخول للاستوديو'],
  },
  {
    title: 'المشاعر',
    desc:   'اكتشف شجرة المشاعر وكيفية استحضار العاطفة بصدق دون تمثيل، مع تعلم ترميز المشاعر داخل النص والتحكم بكثافتها.',
    points: ['شجرة المشاعر وتصنيفاتها الصوتية', 'ترميز العاطفة داخل النص والأداء بصدق', 'التحكم بكثافة المشاعر في مختلف أنواع التعليق'],
  },
  {
    title: 'التطبيق المهنيّ ومشروع التخرّج',
    desc:   'خطوتك نحو السوق؛ بناء هويتك وتسعير صوتك، التعامل مع العملاء والمنصات، وإنجاز مشروع التخرج.',
    points: ['بناء الهوية الصوتية الشخصية وتسعير الخدمات', 'التعامل مع العملاء والتوجيهات الإخراجية', 'إنتاج Voice Demo CV احترافي كمشروع التخرج'],
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
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img
          src={heroCover}
          alt="دورة التعليق والأداء الصوتي"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
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
          <Sparkles size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: 4 }} /> بإمكانية التقسيط
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
          سجل الآن <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
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
  const [openMod, setOpenMod] = useState<number | null>(null);
  const [openAccordion, setOpenAccordion] = useState<'inperson' | 'online' | null>(null);
  const [openCurrInperson, setOpenCurrInperson] = useState(false);
  const [openCurrOnline, setOpenCurrOnline] = useState(false);
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
              <ArrowLeft size={16} />
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
                { icon: <Users size={13} />,        label: '10 مقاعد محدودة' },
                { icon: <Award size={13} />,        label: 'شهادة معتمدة' },
                { icon: <Calendar size={13} />,     label: '8 لقاءات' },
                { icon: <Clock size={13} />,        label: '16 ساعة تدريبية' },
                { icon: <Globe size={13} />,        label: 'عربي' },
              ].map(({ icon, label }) => (
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
                { icon: <GraduationCap size={13} />, text: 'شهادة معتمدة دولياً' },
                { icon: <Users size={13} />,         text: 'خبراء معتمدون' },
                { icon: <RefreshCw size={13} />,     text: 'إعادة التدريب مدى الحياة' },
              ].map(({ icon, text }) => (
                <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {icon} {text}
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
                سجل الآن <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
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
                <Download size={14} style={{ flexShrink: 0 }} /> تحميل الكتيب الوجاهي
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
                <Download size={14} style={{ flexShrink: 0 }} /> تحميل كتيب الأونلاين
              </a>
            </div>
          </div>

          {/* ── Left column — floating pricing card ── */}
          <div ref={sidebarRef} style={{
            width: 'clamp(340px,30vw,420px)',
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

          {/* ── "اختر أسلوب تعلّمك" comparison card ── */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid rgba(0,0,0,0.08)',
            padding: 'clamp(20px,3vw,32px)',
            marginBottom: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(16px,2vw,19px)', color: DH, margin: '0 0 5px' }}>اختر أسلوب تعلّمك</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: DF, margin: 0, lineHeight: 1.6 }}>
                نفس المحتوى والشهادات المُعترَفة محلياً وعالمياً — فقط اختر ما يناسب جدولك وحياتك
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
              {/* حضوري option tile */}
              <div style={{ background: 'rgba(255,193,7,0.06)', border: '1.5px solid rgba(255,193,7,0.28)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,193,7,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color={GOLD} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 15, color: '#92670a' }}>حضوري</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: '#a07620', lineHeight: 1.4 }}>حضور فعلي في استوديو كاسيت وقاعتنا</div>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['تفاعل مباشر مع المدرب والزملاء', 'تطبيق عملي داخل الاستوديوهات', 'بيئة تعلم منظَّمة بلا إلهاء'].map(pt => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: DM }}>
                      <CheckCircle2 size={14} color={GOLD} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              {/* عن بُعد option tile */}
              <div style={{ background: 'rgba(103,232,249,0.05)', border: '1.5px solid rgba(103,232,249,0.26)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(103,232,249,0.13)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Wifi size={18} color="#67e8f9" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 900, fontSize: 15, color: '#0e7490' }}>عن بُعد</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: '#0e7490', lineHeight: 1.4 }}>من أي مكان في العالم</div>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['مرونة كاملة في الوقت والمكان', 'تسجيلات المحاضرات متاحة دائماً', 'وفّر وقت التنقل واستثمره في التعلم'].map(pt => (
                    <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: DM }}>
                      <CheckCircle2 size={14} color="#67e8f9" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(103,232,249,0.13)', border: '1px solid rgba(103,232,249,0.32)', borderRadius: 999, padding: '5px 12px', marginTop: 14, fontFamily: F, fontWeight: 700, fontSize: 12, color: '#0e7490' }}>
                  <Wifi size={13} color="#67e8f9" strokeWidth={2} />
                  6 محاضرات تفاعلية مباشرة
                </div>
              </div>
            </div>
          </div>

          {/* ── حضوري accordion ── */}
          <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 12, border: `1px solid ${openCurrInperson ? 'rgba(255,193,7,0.45)' : 'rgba(0,0,0,0.09)'}`, boxShadow: openCurrInperson ? '0 6px 24px rgba(255,193,7,0.10)' : '0 2px 8px rgba(0,0,0,0.05)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
            <button
              onClick={() => setOpenCurrInperson(!openCurrInperson)}
              style={{ width: '100%', background: openCurrInperson ? 'rgba(255,193,7,0.05)' : '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', textAlign: 'right', gap: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: openCurrInperson ? GOLD : 'rgba(255,193,7,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  <MapPin size={17} color={openCurrInperson ? NAVY : GOLD} strokeWidth={2.2} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 16, color: DH }}>حضوري</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: DF, marginTop: 2 }}>داخل استوديو كاسيت وقاعتنا</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>8 محاضرات</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>16 ساعة</span>
                <ChevronDown size={16} color={openCurrInperson ? GOLD : DF} strokeWidth={2.5} style={{ transform: openCurrInperson ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s, color 0.2s', flexShrink: 0 }} />
              </div>
            </button>
            {openCurrInperson && (
              <div style={{ background: 'rgba(255,193,7,0.03)', borderTop: '1px solid rgba(255,193,7,0.16)' }}>
                {LECTURES_INPERSON.map((lec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px', borderBottom: i < LECTURES_INPERSON.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 12, color: NAVY, background: GOLD, borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{lec.title}</div>
                      <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{lec.desc}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)', borderRadius: 8, padding: '4px 10px', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, color: '#92670a', whiteSpace: 'nowrap' }}>
                      <MapPin size={11} strokeWidth={2} color={GOLD} />
                      داخل الاستوديو
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── عن بُعد accordion ── */}
          <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${openCurrOnline ? 'rgba(103,232,249,0.40)' : 'rgba(0,0,0,0.09)'}`, boxShadow: openCurrOnline ? '0 6px 24px rgba(103,232,249,0.08)' : '0 2px 8px rgba(0,0,0,0.05)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
            <button
              onClick={() => setOpenCurrOnline(!openCurrOnline)}
              style={{ width: '100%', background: openCurrOnline ? 'rgba(103,232,249,0.04)' : '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', cursor: 'pointer', textAlign: 'right', gap: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: openCurrOnline ? '#67e8f9' : 'rgba(103,232,249,0.10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  <Wifi size={17} color={openCurrOnline ? '#0a1020' : '#67e8f9'} strokeWidth={2.2} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: F, fontWeight: 900, fontSize: 16, color: DH }}>عن بُعد</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: DF, marginTop: 2 }}>أونلاين · من أي مكان في العالم</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>6 محاضرات</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>12 ساعة</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: "'Poppins',sans-serif", fontSize: 11, color: '#0e7490', background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                  <Wifi size={11} strokeWidth={2} color="#67e8f9" /> بث مباشر
                </span>
                <ChevronDown size={16} color={openCurrOnline ? '#67e8f9' : DF} strokeWidth={2.5} style={{ transform: openCurrOnline ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s, color 0.2s', flexShrink: 0 }} />
              </div>
            </button>
            {openCurrOnline && (
              <div style={{ background: 'rgba(103,232,249,0.03)', borderTop: '1px solid rgba(103,232,249,0.16)' }}>
                {ONLINE_MODULES_V.map((mod, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px', borderBottom: i < ONLINE_MODULES_V.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 12, color: '#0a1020', background: '#67e8f9', borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{mod.title}</div>
                      <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{mod.intro}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 8, padding: '4px 10px', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11, color: '#0e7490', whiteSpace: 'nowrap' }}>
                      <Wifi size={11} strokeWidth={2} color="#67e8f9" />
                      لقاء تفاعلي مباشر
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <InstructorsSection />

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
        <Sparkles size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: 4 }} /> بإمكانية التقسيط
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
        عرض المواعيد والتسجيل <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
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
  const accentRgb  = accent === '#FFC107' ? '255,193,7' : '103,232,249';
  const hasDay     = batch.day && batch.day !== '--';
  const isActive   = batch.status === 'active';

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 12,
      border: `1px solid ${isActive ? 'rgba(34,197,94,0.18)' : `rgba(${accentRgb},0.14)`}`,
      overflow: 'hidden', direction: 'rtl',
    }}>
      {/* Status strip */}
      <div style={{ width: 3, flexShrink: 0, background: isActive ? '#4ade80' : accent }} />

      {/* Date block */}
      <div style={{
        width: 54, flexShrink: 0,
        background: 'rgba(0,0,0,0.22)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '10px 4px', gap: 1,
      }}>
        {hasDay ? (
          <>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.45)', lineHeight: 1 }}>{batch.month}</span>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1 }}>{batch.day}</span>
          </>
        ) : (
          <span style={{ fontFamily: F, fontSize: 9.5, fontWeight: 700, color: 'rgba(252,251,251,0.45)', textAlign: 'center', lineHeight: 1.4 }}>
            {batch.month || 'قريباً'}
          </span>
        )}
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0, padding: '10px 12px' }}>
        {/* Row 1: batch name + status pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
          <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: OFF }}>{batch.group}</span>
          <span style={{
            flexShrink: 0, fontFamily: F, fontWeight: 700, fontSize: 10,
            background: isActive ? 'rgba(34,197,94,0.14)' : `rgba(${accentRgb},0.12)`,
            border: `1px solid ${isActive ? 'rgba(34,197,94,0.28)' : `rgba(${accentRgb},0.25)`}`,
            color: isActive ? '#4ade80' : accent,
            borderRadius: 999, padding: '2px 9px', whiteSpace: 'nowrap',
          }}>
            <Circle size={7} fill={isActive ? '#4ade80' : accent} color={isActive ? '#4ade80' : accent} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: 4 }} />{isActive ? 'جارية' : 'قريباً'}
          </span>
        </div>
        {/* Row 2: days + time */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '3px 10px', fontFamily: F, fontSize: 11.5, color: MUTED }}>
          {batch.days && batch.days !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={10} color={MUTED} strokeWidth={2} /> {batch.days}
            </span>
          )}
          {batch.time && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} color={MUTED} strokeWidth={2} /> {batch.time}
            </span>
          )}
          {batch.instructor && (
            <span style={{ color: 'rgba(252,251,251,0.38)', fontSize: 11 }}>· {batch.instructor}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TRACK CARD 2  (accordion registration card)
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
  const accent     = isInperson ? '#FFC107' : '#67e8f9';
  const accentRgb  = isInperson ? '255,193,7' : '103,232,249';
  const totalCount = activeBatches.length + upcomingBatches.length;
  const price       = isInperson ? '218 د.أ' : '$150';
  const priceStrike = isInperson ? '260 د.أ' : '$200';
  const waPhone     = isInperson ? '962790234483' : '962771052222';
  const waMsg       = isInperson
    ? 'السلام عليكم، أرغب في حجز مقعد في المسار الوجاهي — دورة التعليق والأداء الصوتي'
    : 'السلام عليكم، أرغب في حجز مقعد في المسار الأونلاين — دورة التعليق الصوتي';

  const cardBg = isInperson
    ? 'linear-gradient(160deg, #1A1205 0%, #141008 55%, #100E0E 100%)'
    : 'linear-gradient(160deg, #060C1A 0%, #08101E 55%, #0E1626 100%)';

  return (
    <div style={{
      borderRadius: 22, overflow: 'hidden', direction: 'rtl',
      border: `1px solid ${expanded ? `rgba(${accentRgb},0.52)` : 'rgba(255,255,255,0.09)'}`,
      boxShadow: expanded
        ? `0 0 0 1px rgba(${accentRgb},0.10), 0 24px 56px rgba(0,0,0,0.40)`
        : '0 8px 28px rgba(0,0,0,0.28)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    }}>

      {/* ── Accent top stripe ── */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, transparent 0%, rgba(${accentRgb},0.85) 50%, transparent 100%)`,
      }} />

      {/* ── Header button ── */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', border: 'none', cursor: 'pointer',
          padding: 'clamp(20px,2.5vw,28px)',
          display: 'flex', flexDirection: 'column', gap: 0,
          textAlign: 'right', direction: 'rtl', background: cardBg,
        }}
      >
        {/* Top row: badge + icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: `rgba(${accentRgb},0.12)`, border: `1px solid rgba(${accentRgb},0.28)`,
            color: accent, borderRadius: 999,
            fontFamily: F, fontWeight: 700, fontSize: 12, padding: '5px 14px',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
            {isInperson ? 'الأعمق تأثيراً' : 'الأكثر مرونة'}
          </span>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},0.20)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {isInperson
              ? <MapPin size={21} color={accent} strokeWidth={2.2} />
              : <Wifi   size={21} color={accent} strokeWidth={2.2} />}
          </div>
        </div>

        {/* Title + subtitle */}
        <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(30px,3.8vw,40px)', color: '#fff', margin: '0 0 6px', lineHeight: 1.1 }}>
          {isInperson ? 'حضوري' : 'عن بُعد'}
        </h3>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: accent, marginBottom: 14 }}>
          {isInperson ? 'تعلّم وجهاً لوجه' : 'تعلّم من أي مكان'}
        </div>

        {/* Description */}
        <p style={{ fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.75, margin: '0 0 22px', textAlign: 'right' }}>
          {isInperson
            ? 'تفاعل مباشر مع المدربين المعتمدين في بيئة تدريبية احترافية تُشعل الدافعية وتُسرّع النمو'
            : 'مرونة كاملة في الوقت والمكان دون التنازل عن جودة التدريب أو عمق التفاعل'}
        </p>

        {/* Footer: count + expand pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} color={MUTED} strokeWidth={2} />
            <span style={{ fontFamily: F, fontSize: 12.5, color: MUTED }}>{totalCount} شعبة متاحة</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: expanded ? `rgba(${accentRgb},0.15)` : 'rgba(255,255,255,0.07)',
            border: `1px solid ${expanded ? `rgba(${accentRgb},0.35)` : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 99, padding: '6px 12px',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: expanded ? accent : MUTED }}>
              {expanded ? 'إخفاء المواعيد' : 'عرض المواعيد'}
            </span>
            <ChevronDown
              size={14} color={expanded ? accent : MUTED} strokeWidth={2.5}
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}
            />
          </div>
        </div>
      </button>

      {/* ── Expanded batch list ── */}
      {expanded && (
        <div style={{
          background: isInperson
            ? 'linear-gradient(180deg, #0E0A04 0%, #0a0804 100%)'
            : 'linear-gradient(180deg, #050A14 0%, #060a12 100%)',
          borderTop: `1px solid rgba(${accentRgb},0.15)`,
          padding: 'clamp(16px,2.5vw,24px)',
        }}>

          {activeBatches.length > 0 && (
            <div style={{ marginBottom: upcomingBatches.length > 0 ? 22 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 14, background: '#4ade80', borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: '#4ade80' }}>الدورات الفعالة حالياً</span>
                <span style={{ fontFamily: FP, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', borderRadius: 999, padding: '2px 8px' }}>
                  {activeBatches.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeBatches.map(b => <CompactBatchRow key={b.id} batch={b} accent={accent} />)}
              </div>
            </div>
          )}

          {upcomingBatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 14, background: accent, borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: accent }}>الدورات القادمة</span>
                <span style={{ fontFamily: FP, fontSize: 11, fontWeight: 700, background: `rgba(${accentRgb},0.12)`, border: `1px solid rgba(${accentRgb},0.25)`, color: accent, borderRadius: 999, padding: '2px 8px' }}>
                  {upcomingBatches.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcomingBatches.map(b => <CompactBatchRow key={b.id} batch={b} accent={accent} />)}
              </div>
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ marginTop: 22, padding: '16px 18px', background: 'rgba(0,0,0,0.32)', borderRadius: 14, border: `1px solid rgba(${accentRgb},0.15)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 3 }}>السعر بعد الخصم</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 24, color: GOLD }}>{price}</span>
                  <span style={{ fontFamily: FP, fontSize: 13, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>{priceStrike}</span>
                </div>
              </div>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: 'rgba(255,193,7,0.65)', background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.15)', borderRadius: 8, padding: '5px 11px' }}>
                بإمكانية التقسيط
              </span>
            </div>
            <a
              href={waLink(waPhone, waMsg)}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', boxSizing: 'border-box',
                background: accent, color: isInperson ? NAVY : '#0a1020',
                border: 'none', borderRadius: 12,
                fontFamily: F, fontWeight: 800, fontSize: 14.5,
                padding: '13px 20px', cursor: 'pointer',
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              احجز مقعدك في هذا المسار <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
            </a>
          </div>
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
          {selected ? <><CheckCircle2 size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: 4 }} /> تم الاختيار</> : cta}
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
