import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  ChevronDown, Calendar, Clock, MapPin, Wifi,
  Users, GraduationCap, Zap, BookOpen, Printer,
  CheckCircle2, Mic, Wind, MessageSquare, Volume2, Award, Briefcase,
  ArrowLeft, MessageCircle, Download, Globe, RefreshCw, Sparkles,
  Star, Sliders, Video,
} from 'lucide-react';

/* ── Asset imports ─────────────────────────────────────────── */
import ayaImg    from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg from '@assets/ياقوت__1785619557679.jpeg';
import yasar     from '@assets/course_01_instructor_1785428932171.jpeg';
import rana      from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omar      from '@assets/trainer-omar_1785428945248.jpg';
import heroCover from '@assets/course_02_cover_1785675184235.jpg';

/* ── Design tokens ─────────────────────────────────────────── */
const LBG   = '#F5F4F0';        // light section background
const DBG   = '#0D0B14';        // dark registration section
const NAVY  = '#1D2738';
const CARD  = '#2a3549';
const CARD2 = '#313d54';
const GOLD  = '#FFC107';
const RASB  = '#e01e8c';        // raspberry — outcomes icons
const DH    = '#1e293b';        // dark headings (on light bg)
const DM    = '#475569';        // dark medium text
const DF    = '#64748b';        // dark faint text
const OFF   = 'rgba(252,251,251,0.96)';
const MUTED = 'rgba(252,251,251,0.62)';
const F     = "'Tajawal', sans-serif";
const FP    = "'Poppins', sans-serif";

function waLink(phone: string, msg: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

/* ── Schedule data (basics track) ──────────────────────────── */
const scheduleData = {
  inPerson: [
    { id: 'g34',  group: 'مجموعة 34 - صباحي - وجاهي',  course: 'أساسيات التعليق والأداء الصوتي', instructor: 'رنا عزام',  days: 'أحد / ثلاثاء / خميس', time: '',             month: 'يوليو',  day: '21', status: 'active'   },
    { id: 'g28',  group: 'مجموعة 28 - مسائي - وجاهي',   course: 'أساسيات التعليق والأداء الصوتي', instructor: 'يسار عبده', days: 'أحد / ثلاثاء / خميس', time: '',             month: 'يوليو',  day: '12', status: 'active'   },
    { id: 'g31',  group: 'مجموعة 31 - صباحي - وجاهي',   course: 'أساسيات التعليق والأداء الصوتي', instructor: 'رنا عزام',  days: 'أحد / ثلاثاء / خميس', time: '',             month: 'فبراير', day: '07', status: 'active'   },
    { id: 'g26',  group: 'مجموعة 26 - صباحي - وجاهي',   course: 'أساسيات التعليق والأداء الصوتي', instructor: 'رنا عزام',  days: 'الإثنين / الأربعاء',  time: '',             month: 'يناير',  day: '07', status: 'active'   },
    { id: 'g37m', group: 'مجموعة مسائية - أغسطس 2026',  course: 'أساسيات التعليق والأداء الصوتي', instructor: 'يسار عبده', days: 'الإثنين والأربعاء',   time: '6:00-8:00 م',  month: 'أغسطس',  day: '12', status: 'upcoming' },
    { id: 'g37s', group: 'مجموعة صباحية - أغسطس 2026',  course: 'أساسيات التعليق والأداء الصوتي', instructor: 'رنا عزام',  days: 'الأربعاء',             time: '12:00-2:00 ظ', month: 'أغسطس',  day: '12', status: 'upcoming' },
    { id: 'g40',  group: 'مجموعة 40 - وجاهي - قريباً',  course: 'أساسيات التعليق والأداء الصوتي', instructor: 'يسار عبده', days: '-',                    time: '',             month: 'قريباً', day: '--', status: 'upcoming' },
    { id: 'g41',  group: 'مجموعة 41 - وجاهي - قريباً',  course: 'أساسيات التعليق والأداء الصوتي', instructor: 'رنا عزام',  days: '-',                    time: '',             month: 'قريباً', day: '--', status: 'upcoming' },
  ],
  online: [
    { id: 'g25', group: 'مجموعة 25 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'يسار عبده',  days: 'السبت',    time: '', month: 'يونيو',  day: '20', status: 'active'   },
    { id: 'g27', group: 'مجموعة 27 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'رنا عزام',   days: 'السبت',    time: '', month: 'يونيو',  day: '--', status: 'active'   },
    { id: 'g29', group: 'مجموعة 29 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'رنا عزام',   days: 'السبت',    time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g32', group: 'مجموعة 32 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'رنا عزام',   days: 'الثلاثاء', time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g33', group: 'مجموعة 33 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'عمر درابكة', days: 'السبت',    time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g35', group: 'مجموعة 35 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'عمر درابكة', days: 'الأحد',    time: '', month: 'يوليو',  day: '--', status: 'active'   },
    { id: 'g38', group: 'مجموعة 38 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'عمر درابكة', days: '-',        time: '', month: 'قريباً', day: '--', status: 'upcoming' },
    { id: 'g39', group: 'مجموعة 39 - أونلاين', course: 'أساسيات التعليق الصوتي أونلاين', instructor: 'رنا عزام',   days: '-',        time: '', month: 'قريباً', day: '--', status: 'upcoming' },
  ],
};

/* ── Curriculum data ───────────────────────────────────────── */
const LECTURES = [
  { title: 'الصوت',               duration: 'ساعتان', desc: 'رحلة لاكتشاف مفهوم الصوت ومناطق خروجه ومعادنه، وصولاً إلى تحديد البصمة الصوتية الخاصة بك وإتقان فن تنويع الصوت.' },
  { title: 'التنفس',               duration: 'ساعتان', desc: 'مفتاح الصوت القوي؛ تتعلم فيه تشريح الجهاز التنفسي، تقنيات التنفس الحجابي والتحكم المركزي، وكيفية قراءة النَفَس داخل النص.' },
  { title: 'جهاز النطق',            duration: 'ساعتان', desc: 'تتبع رحلة الهواء من الرئة إلى نطق الحرف، مع التعرف على مخارج الحروف العربية الـ 28، وطرق التخلص من "الفم الكسول".' },
  { title: 'مهارة الاستماع والنقد السمعيّ', duration: 'ساعتان', desc: 'تدريب أذنك لتصبح ناقدك الأول. يشمل حلقة التغذية الصوتية، منهجية نقد التسجيلات، والاستفادة من تجارب المحترفين.' },
  { title: 'اللغة العربيّة للمعلّق', duration: 'ساعتان', desc: 'قواعد مصممة خصيصاً لاحتياجات المعلق؛ تغطي الهمزات، اللام الشمسية والقمرية، فن الوقف والابتداء، ومنهجية التحرير اللغوي.' },
  { title: 'المشاعر',               duration: 'ساعتان', desc: 'اكتشف شجرة المشاعر وكيفية استحضار العاطفة بصدق دون تمثيل، مع تعلم ترميز المشاعر داخل النص والتحكم بكثافتها.' },
  { title: 'التطبيق المهنيّ ومشروع التخرّج', duration: 'ساعتان', desc: 'خطوتك نحو السوق؛ بناء هويتك وتسعير صوتك، التعامل مع العملاء والمنصات، وإنجاز مشروع التخرج.' },
  { title: 'ألوان التعليق الصوتي',   duration: 'ساعتان', desc: 'التدريب العملي والتطبيقي على الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.' },
];

const ONLINE_MODULES = [
  {
    title: 'الاستوديو المنزلي والمعدات',
    intro: 'كيفية تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة.',
    points: ['اختيار الميكروفون المناسب لصوتك', 'المعالجة الصوتية بالفوم والمواد المتاحة', 'برامج التسجيل والمونتاج للمبتدئين'],
  },
  {
    title: 'أساسيات الصوت والتنفس',
    intro: 'تأسيس مهاري شامل يبني جسراً بين الصوت الطبيعي والصوت الاحترافي.',
    points: ['مناطق الرنين الصوتي ومعادن الصوت', 'التنفس الحجابي وإدارة النَفَس', 'تمارين تطوير الحضور الصوتي'],
  },
  {
    title: 'النطق ومخارج الحروف',
    intro: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي.',
    points: ['مخارج الحروف العربية الـ 28 بالتطبيق', 'التخلص من "الفم الكسول" والنطق الرخو', 'تمارين اللسان والشفتين والحلق'],
  },
  {
    title: 'اللغة العربية والتحرير اللغوي',
    intro: 'قواعد لغوية تطبيقية مصممة خصيصاً لاحتياجات المعلق الصوتي.',
    points: ['الهمزات والتنوين والمدود', 'فن الوقف والابتداء في النص', 'منهجية التحرير اللغوي قبل التسجيل'],
  },
  {
    title: 'التلوين الانفعالي والمشاعر',
    intro: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع.',
    points: ['شجرة المشاعر وتصنيفاتها الصوتية', 'ترميز المشاعر داخل النص', 'التحكم بكثافة العاطفة في مختلف الأنواع'],
  },
  {
    title: 'تطبيقات التعليق الصوتي',
    intro: 'ورشة تطبيقية على مختلف أنواع التعليق الصوتي المطلوبة في السوق.',
    points: ['الإعلانات التجارية وبرامج الأطفال', 'الرد الآلي (IVR) والتطبيقات الرقمية', 'الكتب الصوتية والوثائقيات والأخبار'],
  },
  {
    title: 'مشروع التخرج والانطلاق في السوق',
    intro: 'خطوتك الفعلية نحو سوق العمل الصوتي.',
    points: ['بناء الهوية الصوتية الشخصية', 'إنتاج Voice Demo CV احترافي', 'خطة الـ 100 يوم الأولى في السوق'],
  },
];

const OUTCOMES = [
  { icon: <Mic size={20} color={RASB} strokeWidth={2.2} />,       text: 'إتقان كافة ألوان التعليق الصوتي: الإعلانات، الرد الآلي، الكتب الصوتية، الوثائقيات، الأخبار والدوبلاج.' },
  { icon: <Volume2 size={20} color={RASB} strokeWidth={2.2} />,   text: 'تحسين مخارج الحروف والنطق السليم: التخلص من عيوب النطق وضبط الأداء اللغوي بشكل احترافي.' },
  { icon: <Wind size={20} color={RASB} strokeWidth={2.2} />,       text: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس: اكتساب مرونة صوتية كاملة للتنقل بين النبرات.' },
  { icon: <Zap size={20} color={RASB} strokeWidth={2.2} />,        text: 'كسر رهبة الميكروفون نهائياً: التأقلم الكامل مع البيئة الصوتية الاحترافية والعمل بثقة تامة.' },
  { icon: <CheckCircle2 size={20} color={RASB} strokeWidth={2.2} />, text: 'تعزيز الثقة بالنفس والحضور الصوتي: بناء شخصية صوتية قوية تعكس الاحترافية أمام العملاء.' },
  { icon: <MessageSquare size={20} color={RASB} strokeWidth={2.2} />, text: 'تنمية مهارات التواصل والأداء المهني: فهم سوق العمل والتفاعل مع التوجيهات الإخراجية.' },
  { icon: <Award size={20} color={RASB} strokeWidth={2.2} />,      text: 'الحصول على شهادة معتمدة رسمياً من "كاسيت أكاديمي" وتطبيق "وجيز".' },
  { icon: <Briefcase size={20} color={RASB} strokeWidth={2.2} />,  text: 'إنتاج ديمو صوتي احترافي (Voice Demo CV) وإدراجك في قاعدة بيانات كاسيت للأصوات.' },
];

/* ════════════════════════════════════════════════════════════
   SHARED TINY COMPONENTS
════════════════════════════════════════════════════════════ */

/* Section title for LIGHT backgrounds */
function LightTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, direction: 'rtl' }}>
      <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: DH, margin: 0, lineHeight: 1.2 }}>
        {children}
      </h2>
    </div>
  );
}

/* Section title for DARK backgrounds */
function DarkTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, direction: 'rtl' }}>
      <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
      <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: OFF, margin: 0, lineHeight: 1.2 }}>
        {children}
      </h2>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO PRICING CARD
════════════════════════════════════════════════════════════ */
function CoursePricingCard() {
  const waHref = waLink('962771052222', 'السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي');
  return (
    <div style={{
      width: '100%', minWidth: 360,
      background: NAVY, borderRadius: 22, overflow: 'hidden',
      boxShadow: '0 32px 72px rgba(29,39,56,0.24), 0 8px 20px rgba(0,0,0,0.12)',
    }}>
      {/* Cover */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={heroCover} alt="أساسيات التعليق والأداء الصوتي"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(29,39,56,0.05) 30%, rgba(29,39,56,0.82) 100%)',
        }} />
        <span style={{
          position: 'absolute', bottom: 12, right: 14, left: 14,
          fontFamily: F, fontWeight: 800, fontSize: 13, color: '#fff', lineHeight: 1.4,
        }}>
          أساسيات التعليق والأداء الصوتي
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 16px 22px' }}>

        {/* Price rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {/* حضوري */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
            borderRadius: 10, padding: '10px 13px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(252,251,251,0.85)' }}>حضوري</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, direction: 'ltr' }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 20, color: GOLD }}>218</span>
              <span style={{ fontFamily: F, fontWeight: 600, fontSize: 11, color: 'rgba(252,251,251,0.55)' }}>JOD</span>
              <span style={{ fontFamily: FP, fontSize: 11, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>260</span>
            </div>
          </div>
          {/* أونلاين */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 10, padding: '10px 13px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wifi size={13} color='rgba(252,251,251,0.50)' strokeWidth={2.5} />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: 'rgba(252,251,251,0.72)' }}>عن بُعد</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, direction: 'ltr' }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 20, color: GOLD }}>$150</span>
              <span style={{ fontFamily: FP, fontSize: 11, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>$200</span>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,0.72)', textAlign: 'center', margin: '0 0 14px' }}>
          <Sparkles size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: 4 }} /> بإمكانية التقسيط
        </p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 14px' }} />

        {/* Stacked instructors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {[
            { img: yasar, name: 'يسار عبده' },
            { img: rana,  name: 'رنا عزام' },
            { img: omar,  name: 'عمر درابكة' },
          ].map(({ img, name }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={img} alt={name} style={{
                width: 34, height: 34, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'center top',
                border: '2px solid rgba(255,193,7,0.42)', flexShrink: 0,
              }} />
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: 'rgba(252,251,251,0.88)' }}>{name}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center',
          background: GOLD, color: NAVY,
          fontFamily: F, fontWeight: 800, fontSize: 14.5,
          padding: '12px 0', borderRadius: 10,
          textDecoration: 'none',
          boxShadow: '0 6px 18px rgba(255,193,7,0.28)',
        }}>
          سجل الآن <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   COMPACT BATCH ROW
════════════════════════════════════════════════════════════ */
type ScheduleEntry = {
  id: string; group: string; course: string; instructor: string;
  days: string; time: string; month: string; day: string; status: string;
};

function CompactBatchRow({ batch, accent }: { batch: ScheduleEntry; accent: string }) {
  const hasDay = batch.day && batch.day !== '--';
  const isUpcoming = batch.status === 'upcoming';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', direction: 'rtl',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 10, flexShrink: 0,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
      }}>
        {hasDay ? (
          <>
            <span style={{ fontFamily: F, fontSize: 9, color: 'rgba(252,251,251,0.45)', lineHeight: 1 }}>{batch.month}</span>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 20, color: '#fff', lineHeight: 1 }}>{batch.day}</span>
          </>
        ) : (
          <span style={{ fontFamily: F, fontSize: 9.5, fontWeight: 700, color: 'rgba(252,251,251,0.45)', textAlign: 'center', lineHeight: 1.4 }}>
            {batch.month === 'قريباً' ? 'قريباً' : batch.month}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: OFF, marginBottom: 3 }}>{batch.group}</div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontFamily: F, fontSize: 11.5, color: MUTED }}>
          {batch.days && batch.days !== '-' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={10} color={MUTED} strokeWidth={2} />{batch.days}
            </span>
          )}
          {batch.time && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} color={MUTED} strokeWidth={2} />{batch.time}
            </span>
          )}
          <span style={{ color: 'rgba(252,251,251,0.50)', fontSize: 11 }}>· {batch.instructor}</span>
        </div>
      </div>
      {isUpcoming ? (
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
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
          color: '#4ade80', borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap',
        }}>
          جارية
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TRACK CARD 2  (for dark registration section)
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
  const bg = isInperson
    ? 'linear-gradient(150deg, #1e1506 0%, #19110a 55%, #141010 100%)'
    : 'linear-gradient(150deg, #0b1220 0%, #101827 55%, #161f2e 100%)';
  const accent      = isInperson ? '#FFC107' : '#67e8f9';
  const accentRgb   = isInperson ? '255,193,7' : '103,232,249';
  const badgeBg     = `rgba(${accentRgb},0.13)`;
  const badgeBorder = `rgba(${accentRgb},0.28)`;
  const borderColor = expanded ? `rgba(${accentRgb},0.55)` : 'rgba(255,255,255,0.08)';
  const price       = isInperson ? '218 دينار' : '$150';
  const priceStrike = isInperson ? '260 دينار' : '$200';
  const waPhone     = isInperson ? '962790234483' : '962771052222';
  const waMsg       = isInperson
    ? 'السلام عليكم، أرغب في حجز مقعد في المسار الوجاهي — أساسيات التعليق والأداء الصوتي'
    : 'السلام عليكم، أرغب في حجز مقعد في المسار الأونلاين — أساسيات التعليق الصوتي';
  const totalCount  = activeBatches.length + upcomingBatches.length;

  return (
    <div onClick={onToggle} style={{
      background: bg, border: `1px solid ${borderColor}`,
      borderRadius: 20, cursor: 'pointer', transition: 'border-color 0.25s',
      direction: 'rtl', overflow: 'hidden',
    }}>
      <div style={{ padding: 'clamp(20px,2.5vw,28px)' }}>
        {/* Badge */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: badgeBg, border: `1px solid ${badgeBorder}`,
            color: accent, borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 12,
            padding: '5px 14px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, display: 'inline-block' }} />
            {isInperson ? 'الأعمق تأثيراً' : 'الأكثر مرونة'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(28px,3.5vw,36px)', color: '#fff', margin: 0, lineHeight: 1.1 }}>
            {isInperson ? 'حضوري' : 'عن بُعد'}
          </h3>
          <div style={{
            background: 'rgba(0,0,0,0.28)', borderRadius: 10, padding: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isInperson ? <MapPin size={18} color={accent} strokeWidth={2.2} /> : <Wifi size={18} color={accent} strokeWidth={2.2} />}
          </div>
        </div>
        <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14.5, color: accent, marginBottom: 8 }}>
          {isInperson ? 'تعلّم وجهاً لوجه' : 'تعلّم من أي مكان'}
        </div>
        <p style={{ fontFamily: F, fontSize: 13.5, color: MUTED, lineHeight: 1.75, margin: '0 0 24px' }}>
          {isInperson
            ? 'تفاعل مباشر مع المدربين المعتمدين في بيئة تدريبية احترافية تُشعل الدافعية وتُسرّع النمو'
            : 'مرونة كاملة في الوقت والمكان دون التنازل عن جودة التدريب أو عمق التفاعل'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Calendar size={14} color={MUTED} strokeWidth={2} />
            <span style={{ fontFamily: F, fontSize: 13, color: MUTED }}>{totalCount} شعب متاحة</span>
          </div>
          <button onClick={e => { e.stopPropagation(); onToggle(); }} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: expanded ? `rgba(${accentRgb},0.15)` : 'rgba(255,255,255,0.08)',
            border: `1px solid ${expanded ? `rgba(${accentRgb},0.35)` : 'rgba(255,255,255,0.14)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
          }}>
            <ChevronDown size={16} color={expanded ? accent : 'rgba(252,251,251,0.65)'} strokeWidth={2.5}
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid rgba(${accentRgb},0.18)`, background: 'rgba(0,0,0,0.22)', padding: 'clamp(16px,2.5vw,24px)' }}>
          {activeBatches.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: '#4ade80', borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: '#4ade80' }}>الدورات الفعالة حالياً</span>
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', borderRadius: 999, padding: '2px 9px' }}>
                  {activeBatches.length}
                </span>
              </div>
              {activeBatches.map(b => <CompactBatchRow key={b.id} batch={b} accent={accent} />)}
            </div>
          )}
          {upcomingBatches.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: activeBatches.length > 0 ? 20 : 0 }}>
                <div style={{ width: 3, height: 16, background: accent, borderRadius: 4 }} />
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 13, color: accent }}>الدورات القادمة</span>
                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: badgeBg, border: `1px solid ${badgeBorder}`, color: accent, borderRadius: 999, padding: '2px 9px' }}>
                  {upcomingBatches.length}
                </span>
              </div>
              {upcomingBatches.map(b => <CompactBatchRow key={b.id} batch={b} accent={accent} />)}
            </div>
          )}

          {/* Price badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px', padding: '14px 18px', background: 'rgba(0,0,0,0.20)', borderRadius: 12, border: `1px solid rgba(${accentRgb},0.18)` }}>
            <div>
              <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 2 }}>السعر بعد الخصم</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD }}>{price}</span>
                <span style={{ fontFamily: FP, fontSize: 13, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>{priceStrike}</span>
              </div>
            </div>
            <div style={{ marginRight: 'auto' }}>
              <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: 'rgba(255,193,7,0.70)' }}>بإمكانية التقسيط</span>
            </div>
          </div>

          <a href={waLink(waPhone, waMsg)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', boxSizing: 'border-box',
              background: accent, color: isInperson ? NAVY : '#0a1020',
              border: 'none', borderRadius: 12, fontFamily: F, fontWeight: 800, fontSize: 14.5,
              padding: '13px 20px', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            احجز مقعدك في هذا المسار <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
          </a>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PARTNER BAR  (inside dark registration section)
════════════════════════════════════════════════════════════ */
function PartnerBar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div style={{ marginTop: 20, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', direction: 'rtl' }}>
      <button onClick={onToggle} style={{
        width: '100%', background: CARD2, border: 'none',
        display: 'flex', alignItems: 'center', padding: '14px 20px', cursor: 'pointer', gap: 10, justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <GraduationCap size={17} color={GOLD} strokeWidth={2} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>المؤسسات التعليمية الشريكة</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.30)', color: GOLD, borderRadius: 999, padding: '3px 11px' }}>1</span>
          <ChevronDown size={15} color={MUTED} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </div>
      </button>
      {open && (
        <div style={{ background: CARD, padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(255,193,7,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={18} color={GOLD} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>تطبيق وجيز</div>
              <div style={{ fontFamily: F, fontSize: 12, color: MUTED, marginTop: 2 }}>أكبر منصة صوتية بالشرق الأوسط — شريك اعتماد رسمي لشهادات البرنامج</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ADVISOR MINI CARD  (inside the sticky sidebar)
════════════════════════════════════════════════════════════ */
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
        <a href={href} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: GOLD, color: NAVY,
          fontFamily: F, fontWeight: 800, fontSize: 12,
          padding: '6px 14px', borderRadius: 8,
          textDecoration: 'none',
        }}>
          تواصل الآن <MessageCircle size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 3 }} />
        </a>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export default function CourseBasicsPage() {
  const [, navigate] = useLocation();
  const [openAccordion, setOpenAccordion] = useState<'inperson' | 'online' | null>(null);
  const [openCurrInperson, setOpenCurrInperson] = useState(false);
  const [openCurrOnline, setOpenCurrOnline] = useState(false);
  const [partnerBarOpen, setPartnerBarOpen] = useState(false);
  const [currTab, setCurrTab] = useState<'inperson' | 'online'>('inperson');
  const [openLec, setOpenLec] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const INNER: React.CSSProperties = {
    maxWidth: 1120, margin: '0 auto',
    paddingInline: 'clamp(16px,4vw,48px)',
    direction: 'rtl',
  };

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
  const inPersonPdf = `${BASE}/voiceover-inperson.pdf`;
  const onlinePdf   = `${BASE}/voiceover-online.pdf`;

  return (
    <div style={{ minHeight: '100dvh', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          HERO — off-white light bg
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingTop: 'clamp(24px,4vw,56px)', paddingBottom: 'clamp(36px,4vw,64px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ ...INNER, display: 'flex', gap: 'clamp(24px,3vw,48px)', alignItems: 'flex-start' }}>

          {/* Right column */}
          <div style={{ flex: 1, minWidth: 0, direction: 'rtl' }}>
            <button onClick={() => navigate('/')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: DF, fontFamily: F, fontSize: 14, padding: 0, marginBottom: 22,
            }}>
              <ArrowLeft size={16} />
              الرجوع إلى قائمة الدورات
            </button>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {['المبتدئون في التعليق الصوتي', 'صنّاع المحتوى', 'المذيعون والمقدّمون', 'المستوى المبتدئ'].map(t => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.35)',
                  color: '#92670a', borderRadius: 999, fontFamily: F, fontWeight: 700, fontSize: 12,
                  padding: '5px 13px', whiteSpace: 'nowrap',
                }}>
                  {t}
                </span>
              ))}
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,3.8vw,46px)', color: DH, lineHeight: 1.2, margin: '0 0 16px' }}>
              أساسيات التعليق والأداء الصوتي
            </h1>

            <p style={{ fontFamily: F, fontWeight: 500, fontSize: 'clamp(14px,1.6vw,17px)', color: GOLD, lineHeight: 1.8, margin: '0 0 24px', borderRight: `3px solid ${GOLD}`, paddingRight: 14 }}>
              "نبدأ من الصفر — ونبني صوتاً يُسمع ويُحترف"
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px,1.5vw,18px)', marginBottom: 28, fontFamily: F, fontSize: 13.5, color: DM }}>
              {[
                { icon: <Users size={13} />,        label: '10 مقاعد محدودة' },
                { icon: <Award size={13} />,        label: 'شهادة معتمدة' },
                { icon: <Calendar size={13} />,     label: '8 محاضرات' },
                { icon: <Clock size={13} />,        label: '16 ساعة تدريبية' },
                { icon: <Globe size={13} />,        label: 'عربي' },
              ].map(({ icon, label }) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.10)', borderRadius: 999, padding: '6px 14px', fontWeight: 500 }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* Instructors row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ display: 'inline-flex' }}>
                {[yasar, rana, omar].map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: '2px solid rgba(255,193,7,0.60)', marginInlineStart: i > 0 ? -14 : 0, boxShadow: '0 3px 8px rgba(0,0,0,0.18)' }} />
                ))}
              </div>
              <div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: DH, display: 'block' }}>بإشراف نخبة من أفضل المدربين</span>
                <span style={{ fontFamily: F, fontSize: 12.5, color: DF }}>يسار عبده · رنا عزام · عمر درابكة</span>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30, fontFamily: F, fontSize: 13, color: DF }}>
              {[
                { icon: <GraduationCap size={13} />, text: 'شهادة معتمدة دولياً' },
                { icon: <Users size={13} />,         text: 'خبراء معتمدون' },
                { icon: <RefreshCw size={13} />,     text: 'إعادة التدريب مدى الحياة' },
              ].map(({ icon, text }) => (
                <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{icon} {text}</span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a href={waLink('962771052222', 'السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي')} target="_blank" rel="noopener noreferrer"
                style={{ background: GOLD, color: NAVY, fontFamily: F, fontWeight: 800, fontSize: 15, padding: '13px 30px', borderRadius: 12, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 22px rgba(255,193,7,0.32)' }}>
                سجل الآن <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
              </a>
              <a href={inPersonPdf} download style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.14)', color: DH, fontFamily: F, fontWeight: 700, fontSize: 14, padding: '13px 22px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Download size={14} style={{ flexShrink: 0 }} /> تحميل الكتيب الوجاهي
              </a>
              <a href={onlinePdf} download style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.14)', color: DH, fontFamily: F, fontWeight: 700, fontSize: 14, padding: '13px 22px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Download size={14} style={{ flexShrink: 0 }} /> تحميل كتيب الأونلاين
              </a>
            </div>
          </div>

          {/* Left column — floating pricing card */}
          <div ref={sidebarRef} style={{ width: 'clamp(300px,30vw,390px)', flexShrink: 0, position: 'sticky', top: 20 }}>
            <CoursePricingCard />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          REGISTRATION — dark #0D0B14 + animated neon blobs
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: DBG, paddingBlock: 'clamp(48px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
        {/* Neon blobs */}
        <div aria-hidden className="ka-blob-1" style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,193,7,0.18) 0%, transparent 70%)', top: '-80px', right: '10%', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div aria-hidden className="ka-blob-2" style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,30,140,0.12) 0%, transparent 70%)', bottom: '-60px', left: '15%', pointerEvents: 'none', filter: 'blur(50px)' }} />
        <div aria-hidden className="ka-blob-3" style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,232,249,0.10) 0%, transparent 70%)', top: '30%', left: '5%', pointerEvents: 'none', filter: 'blur(45px)' }} />

        <div style={{ ...INNER, position: 'relative', zIndex: 1 }}>
          <DarkTitle>المواعيد المتاحة للتسجيل</DarkTitle>
          <p style={{ fontFamily: F, fontSize: 15, color: MUTED, lineHeight: 1.8, margin: '0 0 32px' }}>
            اختر طريقة التعلّم التي تناسب أسلوبك — كل مسار صُمِّم ليمنحك تجربة تدريبية استثنائية
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <TrackCard2
              variant="inperson"
              activeBatches={scheduleData.inPerson.filter(b => b.status === 'active')}
              upcomingBatches={scheduleData.inPerson.filter(b => b.status === 'upcoming')}
              expanded={openAccordion === 'inperson'}
              onToggle={() => {
                setOpenAccordion(openAccordion === 'inperson' ? null : 'inperson');
                setCurrTab('inperson');
              }}
            />
            <TrackCard2
              variant="online"
              activeBatches={scheduleData.online.filter(b => b.status === 'active')}
              upcomingBatches={scheduleData.online.filter(b => b.status === 'upcoming')}
              expanded={openAccordion === 'online'}
              onToggle={() => {
                setOpenAccordion(openAccordion === 'online' ? null : 'online');
                setCurrTab('online');
              }}
            />
          </div>

          <PartnerBar open={partnerBarOpen} onToggle={() => setPartnerBarOpen(p => !p)} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT + GOALS — light bg, 2-col with sticky advisor sidebar
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
        <div style={{ ...INNER, display: 'flex', gap: 'clamp(24px,3vw,40px)', alignItems: 'flex-start' }}>

          {/* Main content — ~65% */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <LightTitle>نبذة عن البرنامج وأهدافه</LightTitle>
            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.5vw,16.5px)', color: DM, lineHeight: 2, marginBottom: 40, maxWidth: 720 }}>
              يسعى هذا البرنامج إلى إعداد وتأهيل المتدربين لاحتراف مجال التعليق الصوتي وتجهيزهم بالمهارات اللازمة للاندماج في سوق العمل. ترتكز أهدافنا على تطوير مخارج الحروف والنطق السليم، والتمكن من التحكم في الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون تماماً لتعزيز الثقة بالنفس وتنمية مهارات الإلقاء والتواصل المهني.
            </p>

            <LightTitle>الأهداف المتحققة</LightTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {[
                { icon: <Star     size={22} color={GOLD} />, text: 'إتقان كافة ألوان التعليق الصوتي: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات، الأخبار، والدوبلاج.' },
                { icon: <Volume2  size={22} color={GOLD} />, text: 'تحسين مخارج الحروف والنطق السليم: التخلص من عيوب النطق وإتقان مخارج الحروف بشكل محترف.' },
                { icon: <Sliders  size={22} color={GOLD} />, text: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس: اكتساب مرونة صوتية كاملة للتحول بين النبرات أثناء التسجيل.' },
                { icon: <Mic      size={22} color={GOLD} />, text: 'كسر رهبة الميكروفون نهائياً: التأقلم الكامل مع البيئة الصوتية الاحترافية والعمل بثقة.' },
                { icon: <Zap      size={22} color={GOLD} />, text: 'تعزيز الثقة بالنفس والحضور الصوتي: بناء شخصية صوتية قوية وجذابة تعكس الاحترافية.' },
                { icon: <Briefcase size={22} color={GOLD} />, text: 'تنمية مهارات التواصل والأداء المهني: فهم متطلبات سوق العمل والتفاعل مع التوجيهات الإخراجية.' },
              ].map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>{g.icon}</span>
                  <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.8, margin: 0 }}>{g.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky advisor sidebar — ~32% */}
          <div style={{ width: 'clamp(260px,28vw,320px)', flexShrink: 0, position: 'sticky', top: 24 }}>
            <div style={{ background: '#181325', borderRadius: 20, padding: '24px 20px', boxShadow: '0 20px 50px rgba(0,0,0,0.20)' }}>
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 18, color: OFF, margin: '0 0 8px' }}>
                  هل تحتاج مساعدة في التسجيل؟
                </h3>
                <p style={{ fontFamily: F, fontSize: 12.5, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  تواصل مع مستشاراتنا الأكاديميات مباشرة — نحن هنا للمساعدة
                </p>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 20px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <AdvisorMini
                  name="آية القماز"
                  role="مستشارة التسجيل — وجاهي"
                  photo={ayaImg}
                  href={waLink('962790234483', 'السلام عليكم، أرغب في الاستفسار عن المسار الوجاهي لأساسيات التعليق الصوتي')}
                />
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <AdvisorMini
                  name="ياقوت الخشاشنة"
                  role="مستشارة التسجيل — أونلاين"
                  photo={yaqoutImg}
                  href={waLink('962771052222', 'السلام عليكم، أرغب في الاستفسار عن المسار الأونلاين لأساسيات التعليق الصوتي')}
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
          EXPECTED OUTCOMES — light bg, card grid with icons
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
        <div style={INNER}>
          <LightTitle>المخرجات التدريبية المتوقعة</LightTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: '#fff', borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '18px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                {/* Icon badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(224,30,140,0.10)',
                  border: '1px solid rgba(224,30,140,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {o.icon}
                </div>
                <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.8, margin: 0 }}>
                  {o.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CURRICULUM — light bg, accordion + print button
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
        <div style={INNER}>
          {/* Header row with print button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 28, background: GOLD, borderRadius: 4, flexShrink: 0 }} />
              <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.4vw,26px)', color: DH, margin: 0, lineHeight: 1.2 }}>الخطة الدراسية</h2>
            </div>
            <button onClick={() => window.print()} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.12)',
              color: DM, fontFamily: F, fontWeight: 700, fontSize: 13,
              padding: '8px 16px', borderRadius: 9, cursor: 'pointer',
            }}>
              <Printer size={15} strokeWidth={2} />
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
                  {['تفاعل مباشر مع المدرب والزملاء', 'تطبيق عملي فوري داخل الصف', 'بيئة تعلم منظَّمة بلا إلهاء'].map(pt => (
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
                  <Video size={13} color="#67e8f9" strokeWidth={2} />
                  8 محاضرة تفاعلية عبر Zoom
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
                <span style={{ fontFamily: FP, fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>8 محاضرة</span>
                <span style={{ fontFamily: FP, fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>16 ساعة</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: FP, fontSize: 11, color: '#0e7490', background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                  <Video size={11} strokeWidth={2} /> Zoom 8
                </span>
                <ChevronDown size={16} color={openCurrInperson ? GOLD : DF} strokeWidth={2.5} style={{ transform: openCurrInperson ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s, color 0.2s', flexShrink: 0 }} />
              </div>
            </button>
            {openCurrInperson && (
              <div style={{ background: 'rgba(255,193,7,0.03)', borderTop: '1px solid rgba(255,193,7,0.16)' }}>
                {LECTURES.map((lec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px', borderBottom: i < LECTURES.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 12, color: NAVY, background: GOLD, borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{lec.title}</div>
                      <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{lec.desc}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 8, padding: '4px 10px', fontFamily: FP, fontWeight: 700, fontSize: 11, color: '#0e7490', whiteSpace: 'nowrap' }}>
                      <Video size={11} strokeWidth={2} color="#67e8f9" />
                      تفاعلية Zoom
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
                <span style={{ fontFamily: FP, fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>7 وحدات</span>
                <span style={{ fontFamily: FP, fontSize: 11, color: DF, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>16 ساعة</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: FP, fontSize: 11, color: '#0e7490', background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                  <Video size={11} strokeWidth={2} /> Zoom 7
                </span>
                <ChevronDown size={16} color={openCurrOnline ? '#67e8f9' : DF} strokeWidth={2.5} style={{ transform: openCurrOnline ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s, color 0.2s', flexShrink: 0 }} />
              </div>
            </button>
            {openCurrOnline && (
              <div style={{ background: 'rgba(103,232,249,0.03)', borderTop: '1px solid rgba(103,232,249,0.16)' }}>
                {ONLINE_MODULES.map((mod, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px', borderBottom: i < ONLINE_MODULES.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 12, color: '#0a1020', background: '#67e8f9', borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{mod.title}</div>
                      <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{mod.intro}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 8, padding: '4px 10px', fontFamily: FP, fontWeight: 700, fontSize: 11, color: '#0e7490', whiteSpace: 'nowrap' }}>
                      <Video size={11} strokeWidth={2} color="#67e8f9" />
                      تفاعلية Zoom
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INSTRUCTORS — light bg, full-width stacked cards
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: LBG, paddingBlock: 'clamp(48px,5vw,80px)', borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
        <div style={INNER}>
          <LightTitle>خبراؤنا في التدريس</LightTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                photo: yasar, name: 'يسار عبده',
                role: 'مدرب إعلامي وخبير تعليق صوتي',
                bio: 'يتمتع بخبرة تزيد عن 20 عاماً في الإعلام وتدريب الصوت، وهو مدرب معتمد لدى الأمم المتحدة. يحمل البكالوريوس في اللغة الإنجليزية وعلم الأصوات والماجستير في حقوق الإنسان. خبرته تغطي الدبلجة، الأخبار، الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات في الخليج والشرق الأوسط.',
                tags: ['تعليق صوتي', 'إعلام', 'مدرب أممي'],
              },
              {
                photo: rana, name: 'رنا عزام',
                role: 'إعلامية مختصة بالتحرير والتدقيق اللغوي',
                bio: 'معدة ومقدمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت لسنوات محررة ومدققة ومذيعة في مجمع اللغة العربية. حاصلة على بكالوريوس اللغة العربية وآدابها من جامعة اليرموك، وتتميز بأسلوبها الحيوي في تدريب الأصوات وتطوير اللغة.',
                tags: ['تحرير لغوي', 'إذاعة', 'بودكاست'],
              },
              {
                photo: omar, name: 'عمر درابكة',
                role: 'معلّق صوتي محترف ومدرب أداء وإلقاء خطابي',
                bio: 'يمتلك خبرة تتجاوز 12 عاماً في التعليق الصوتي، سجّل خلالها مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون، ويتميز بأسلوبه الاحترافي في تدريب الأداء الصوتي.',
                tags: ['وثائقيات', 'إعلانات', 'دوبلاج'],
              },
            ].map((ins, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.09)',
                padding: 'clamp(20px,2.5vw,32px)',
                display: 'flex', gap: 'clamp(20px,3vw,36px)', alignItems: 'flex-start',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                {/* Photo */}
                <div style={{ flexShrink: 0 }}>
                  <img src={ins.photo} alt={ins.name} style={{
                    width: 'clamp(88px,10vw,120px)', height: 'clamp(88px,10vw,120px)',
                    borderRadius: 16, objectFit: 'cover', objectPosition: 'center top',
                    border: '3px solid rgba(255,193,7,0.45)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                  }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(18px,2.2vw,22px)', color: DH, margin: '0 0 4px' }}>{ins.name}</h3>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: GOLD, fontWeight: 700, margin: '0 0 12px' }}>{ins.role}</p>
                  <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.85, margin: '0 0 16px' }}>{ins.bio}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {ins.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: F, fontWeight: 700, fontSize: 12,
                        background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)',
                        color: '#92670a', borderRadius: 999, padding: '4px 12px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER CTA — dark band
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: NAVY, paddingBlock: 'clamp(48px,5vw,72px)' }}>
        <div style={{ ...INNER, textAlign: 'center' }}>
          <h2 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', color: OFF, margin: '0 0 12px' }}>
            ابدأ رحلتك الصوتية اليوم
          </h2>
          <p style={{ fontFamily: F, fontSize: 16, color: MUTED, lineHeight: 1.8, margin: '0 0 32px' }}>
            انضم إلى أكثر من 5,000 طالب تخرجوا من كاسيت أكاديمي — وحققوا أحلامهم الصوتية
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
            <a href={waLink('962771052222', 'السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي')} target="_blank" rel="noopener noreferrer"
              style={{ background: GOLD, color: NAVY, fontFamily: F, fontWeight: 800, fontSize: 16, padding: '14px 36px', borderRadius: 14, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(255,193,7,0.30)' }}>
              سجل الآن <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineStart: 4 }} />
            </a>
            <button onClick={() => navigate('/')} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.20)',
              color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15,
              padding: '14px 28px', borderRadius: 14, cursor: 'pointer',
            }}>
              استعرض دوراتنا
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
