/**
 * دورة تمكين اللغة العربية وفنون التحرير اللغوي
 * المدربة: رنا العزام | السعر: $150 | 8 جلسات / 16 ساعة | عن بُعد | ≤25 مقعداً
 */
import { useState } from 'react';
import { Clock, Users, Tv, Globe, CheckCircle2, ArrowLeft, BookOpen, Award } from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, CARD2, GOLD, OFF, MUTED, F, FP, LBG, DH, DM, INNER,
  waLink, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverArabic from '@assets/cover_دورة_ﺗﻤﻜﻴﻦ_اﻟﻠﻐﺔ_اﻟﻌﺮﺑﻴﺔ_وﻓﻨﻮن_اﻟﺘﺤﺮﻳﺮ_اﻟﻠﻐﻮي_1785692339633.png';
import photoRana   from '@assets/trainer-rana-azzam_1785692178863.JPG';
import yaqoutImg   from '@assets/ياقوت__1785619557679.jpeg';

/* ── Schedule ─────────────────────────────────────────────── */
const ACTIVE_ONLINE: ScheduleEntry[] = [];

const UPCOMING_ONLINE: ScheduleEntry[] = [
  {
    id: 'rm-al201', group: 'دفعة #201 — عن بُعد', course: 'تمكين اللغة العربية وفنون التحرير',
    instructor: 'رنا العزام', days: 'سيتم التحديد',
    time: 'بالتنسيق مع المتدربين', month: 'سبتمبر', day: '--', status: 'upcoming',
    batchNumber: '#201', availableSeats: 15, registeredCount: 5,
    badgeDate: 'سبتمبر 2026',
  },
  {
    id: 'rm-al202', group: 'دفعة #202 — عن بُعد', course: 'تمكين اللغة العربية وفنون التحرير',
    instructor: 'رنا العزام', days: 'سيتم التحديد',
    time: 'بالتنسيق مع المتدربين', month: 'سبتمبر', day: '--', status: 'upcoming',
    batchNumber: '#202', availableSeats: 25, registeredCount: 0,
    badgeDate: 'سبتمبر 2026',
  },
];

/* ── Curriculum ───────────────────────────────────────────── */
const SESSIONS: SessionItem[] = [
  { title: 'النظام اللغوي وبنية الجملة العربية', desc: 'فهم منظومة اللغة العربية وبنية الجملة الاسمية والفعلية — الأساس الذي تُبنى عليه كل المهارات اللغوية.' },
  { title: 'النحو الوظيفي والقواعد التطبيقية', desc: 'نحو عملي غير نظري — إعراب الجمل في السياق الحقيقي وتطبيق القواعد في الكتابة والتحرير اليومي.' },
  { title: 'أساليب التعبير وفنون الكتابة', desc: 'أنماط التعبير العربي المختلفة: الخبري والإنشائي، المباشر والأدبي — وكيف تختار الأسلوب المناسب لكل سياق.' },
  { title: 'الصرف العربي والاشتقاق اللغوي', desc: 'أوزان الأفعال والمصادر والمشتقات — مفتاح توسيع المعجم الذهني واستخدام الألفاظ بدقة ومرونة.' },
  { title: 'الإملاء والكتابة الصحيحة', desc: 'قواعد الإملاء الحاسمة: الهمزات، التاء المربوطة والمفتوحة، الألف اللينة — مع تدريبات تصحيح نصوص حية.' },
  { title: 'تطوير الأسلوب والأداء الكتابي', desc: 'الانتقال من الكتابة الصحيحة إلى الكتابة المؤثرة — تقنيات تحسين الأسلوب وبناء الفقرات وتدفق الأفكار.' },
  { title: 'البلاغة وأسرار البيان العربي', desc: 'مقدمة في علمَي البيان والبديع — كيف يُحيي التشبيه والاستعارة والمجاز النصوص ويرفع مستوى الكتابة.' },
  { title: 'التطبيقات العملية وورشة الكتابة', desc: 'ورشة تحرير نصوص إعلامية وأدبية وأكاديمية مع تصويب فوري — وإنتاج مشروع ختامي يُقيَّم من المدربة.' },
];

/* ── Instructor ───────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  {
    initials: 'ر.ع', photo: photoRana,
    name: 'رنا محمد العزام',
    role: 'إعلامية ومختصة تحرير لغوي ومدققة لغة',
    badges: [
      { icon: Globe, label: 'مجمع اللغة العربية — محررة ومدققة' },
      { icon: Tv,    label: 'رؤيا | صاد | حياة FM' },
      { icon: Clock, label: 'خبرة 10+ سنوات' },
      { icon: Users, label: 'مئات المتدربين' },
    ],
    bio: 'الإعلامية رنا محمد العزام معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. عملت سنواتٍ محررةً ومدققةً لغوية في مجمع اللغة العربية الأردني — المرجع اللغوي الأول في المنطقة. تمتلك خبرة عريقة في تمكين المتدربين من اللغة العربية الفصيحة للاستخدام المهني والإعلامي.',
  },
];

/* ── Goals ────────────────────────────────────────────────── */
const GOALS = [
  'كتابة سليمة خالية من أخطاء النحو والإملاء',
  'أسلوب عربي متميز ومؤثر في كل سياق مهني',
  'إتقان الصرف والاشتقاق لتوسيع الثروة اللغوية',
  'تحرير ومراجعة النصوص بمعايير المجمع اللغوي',
  'شهادة معتمدة من تطبيق وجيز وأكاديمية كاسيت',
  'حقيبة مرجعية رقمية تلخّص القواعد للتدقيق الذاتي',
];

/* ── Pricing card ─────────────────────────────────────────── */
function PricingCard() {
  const waMsg = 'السلام عليكم، أرغب في التسجيل في دورة تمكين اللغة العربية وفنون التحرير اللغوي.';
  return (
    <div style={{
      position: 'sticky', top: 24,
      background: 'linear-gradient(160deg,#0B1118 0%,#0F1822 100%)',
      borderRadius: 24, overflow: 'hidden',
      border: '1px solid rgba(103,232,249,0.25)',
      boxShadow: '0 28px 56px rgba(0,0,0,0.45),0 0 0 1px rgba(103,232,249,0.08)',
      direction: 'rtl',
    }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={coverArabic} alt="تمكين اللغة العربية" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(11,17,24,0.92) 100%)' }} />
        <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: F, fontWeight: 700, fontSize: 12, color: '#051520', background: '#67e8f9', borderRadius: 999, padding: '5px 13px' }}>
          عن بُعد — تفاعلية مباشرة
        </span>
      </div>

      <div style={{ padding: '22px 22px 20px' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 4 }}>سعر الدورة</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 36, color: GOLD }}>$150</span>
            <span style={{ fontFamily: FP, fontSize: 16, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>$200</span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(103,232,249,0.75)', marginTop: 4 }}>خصم 25% لفترة محدودة</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {[
            { icon: <Clock size={14} color='#67e8f9' />, label: 'المدة', val: '16 ساعة' },
            { icon: <BookOpen size={14} color='#67e8f9' />, label: 'الجلسات', val: '8 جلسات' },
            { icon: <Users size={14} color='#67e8f9' />, label: 'الحد الأقصى', val: '25 مقعداً' },
            { icon: <Award size={14} color='#67e8f9' />, label: 'الشهادة', val: 'وجيز + كاسيت' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(103,232,249,0.06)', border: '1px solid rgba(103,232,249,0.12)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>{s.icon}<span style={{ fontFamily: F, fontSize: 10.5, color: MUTED }}>{s.label}</span></div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: OFF }}>{s.val}</div>
            </div>
          ))}
        </div>

        <a href={waLink('962771052222', waMsg)} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', boxSizing: 'border-box',
          background: 'linear-gradient(135deg,#67e8f9 0%,#22d3ee 100%)',
          color: '#051520', borderRadius: 13, padding: '14px 20px',
          fontFamily: F, fontWeight: 800, fontSize: 15, textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(103,232,249,0.25)',
        }}>
          سجّل الآن <ArrowLeft size={15} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </a>
        <p style={{ fontFamily: F, fontSize: 11.5, color: MUTED, textAlign: 'center', margin: '10px 0 0', lineHeight: 1.6 }}>
          مقاعد محدودة — بإمكانية التقسيط
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function CourseArabicLanguagePage() {
  const [expanded, setExpanded]   = useState(false);
  const [partnerOpen, setPartner] = useState(false);

  const waMsg = 'السلام عليكم، أرغب في التسجيل في دورة تمكين اللغة العربية وفنون التحرير اللغوي.';

  return (
    <main style={{ background: '#fff', direction: 'rtl' }}>

      {/* ════ HERO ════ */}
      <section style={{ background: LBG, paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
        <div style={{ ...INNER, display: 'grid', gridTemplateColumns: '1fr minmax(0,420px)', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }} className="course-hero-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {[{ label: 'الرئيسية', href: '/' }, { label: 'الدورات', href: '/#courses' }, { label: 'تمكين اللغة العربية', href: null }].map((b, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ fontFamily: FP, fontSize: 11, color: 'rgba(0,0,0,0.25)' }}>/</span>}
                  {b.href ? <a href={b.href} style={{ fontFamily: F, fontSize: 12, color: 'rgba(100,116,139,0.80)', textDecoration: 'none' }}>{b.label}</a>
                    : <span style={{ fontFamily: F, fontSize: 12, color: DH, fontWeight: 700 }}>{b.label}</span>}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {[
                { text: 'عن بُعد — تفاعلية مباشرة', bg: 'rgba(103,232,249,0.12)', border: 'rgba(103,232,249,0.30)', color: '#0e7490' },
                { text: 'مستوى متوسط — متقدم', bg: 'rgba(255,193,7,0.10)', border: 'rgba(255,193,7,0.28)', color: '#92670a' },
              ].map(b => (
                <span key={b.text} style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: b.color, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 999, padding: '5px 14px' }}>{b.text}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: DH, lineHeight: 1.2, margin: '0 0 16px' }}>
              دورة تمكين اللغة العربية<br />
              <span style={{ color: '#0e7490' }}>وفنون التحرير اللغوي</span>
            </h1>

            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.6vw,16.5px)', color: DM, lineHeight: 1.85, margin: '0 0 26px', maxWidth: 560 }}>
              برنامج متكامل يُمكّنك من اللغة العربية الفصيحة — من النحو والصرف والإملاء، إلى الأساليب البلاغية وفنون التحرير — مُقدَّم بأسلوب تطبيقي عملي بعيداً عن الحفظ والتلقين.
            </p>

            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '20px 22px', marginBottom: 28 }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 14 }}>ماذا ستحقق بنهاية الدورة؟</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {GOALS.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={16} color='#0e7490' strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.65 }}>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[{ label: 'مدة الدورة', val: '16 ساعة تدريبية' }, { label: 'الجلسات', val: '8 جلسات مباشرة' }, { label: 'الحد الأقصى', val: '25 متدرباً' }].map(s => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontFamily: F, fontSize: 11, color: 'rgba(100,116,139,0.70)' }}>{s.label}</span>
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: DH }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <PricingCard />
        </div>
      </section>

      {/* ════ REGISTRATION ════ */}
      <section style={{ background: DARK, padding: 'clamp(44px,6vw,80px) 0' }}>
        <div style={INNER}>
          <SectionTitle>التسجيل والمواعيد</SectionTitle>
          <TrackCard2
            variant="online"
            activeBatches={ACTIVE_ONLINE}
            upcomingBatches={UPCOMING_ONLINE}
            expanded={expanded}
            onToggle={() => setExpanded(v => !v)}
            price="$150"
            priceStrike="$200"
            waPhone="962771052222"
            waMsg={waMsg}
          />
          <PartnerBar open={partnerOpen} onToggle={() => setPartner(v => !v)} />

          <div style={{ marginTop: 28, padding: '20px 22px', background: CARD2, borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: MUTED, marginBottom: 14 }}>مستشارة التسجيل — عن بُعد</div>
            <AdvisorMini name="ياقوت الخشاشنة" role="مستشارة تسجيل دورات عن بُعد" photo={yaqoutImg} href={waLink('962771052222', waMsg)} />
          </div>
        </div>
      </section>

      {/* ════ CURRICULUM ════ */}
      <section style={{ background: LBG, padding: 'clamp(44px,6vw,80px) 0' }}>
        <div style={INNER}>
          <LightSectionTitle>المنهج الدراسي</LightSectionTitle>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[{ val: '8', lbl: 'جلسات' }, { val: '16', lbl: 'ساعة تدريبية' }, { val: 'زوم', lbl: 'تفاعلي مباشر' }].map(s => (
                <div key={s.lbl} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: DH, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: 'rgba(100,116,139,0.70)', marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 7, background: DH, color: '#fff', fontFamily: F, fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer' }}>
              طباعة المنهج
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {SESSIONS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px', borderBottom: i < SESSIONS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 12, color: '#051520', background: '#67e8f9', borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{s.desc}</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)', borderRadius: 8, padding: '4px 10px', fontFamily: FP, fontWeight: 700, fontSize: 11, color: '#0e7490', whiteSpace: 'nowrap' }}>
                  لقاء تفاعلي
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ INSTRUCTORS ════ */}
      <InstructorsSection instructors={INSTRUCTORS} />
    </main>
  );
}
