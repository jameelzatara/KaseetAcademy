/**
 * دورة التعليق والأداء الصوتي — عن بُعد (تفاعلية مباشرة)
 * المدرب: عمر درابكة | السعر: $150 | 7 وحدات / 12 ساعة
 */
import { useState } from 'react';
import { Clock, Users, Mic, GraduationCap, CheckCircle2, ArrowLeft, BookOpen, Award } from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, CARD2, GOLD, OFF, MUTED, F, FP, LBG, DH, DM, INNER,
  waLink, GoldDot, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverOmar    from '@assets/course-omar-bg_1785692015818.png';
import photoOmar    from '@assets/trainer-omar_1785692015818.jpg';
import ayaImg       from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg    from '@assets/ياقوت__1785619557679.jpeg';

/* ── Schedule ─────────────────────────────────────────────── */
const ACTIVE_ONLINE: ScheduleEntry[] = [];

const UPCOMING_ONLINE: ScheduleEntry[] = [
  {
    id: 'rm-vl201', group: 'دفعة #201 — عن بُعد', course: 'التعليق والأداء الصوتي (عن بُعد)',
    instructor: 'عمر درابكة', days: 'الجمعة',
    time: '7:00م – 9:00م', month: 'أغسطس', day: '01', status: 'upcoming',
    batchNumber: '#201', availableSeats: 8, registeredCount: 4,
    badgeDate: 'أغسطس 2026',
  },
  {
    id: 'rm-vl202', group: 'دفعة #202 — عن بُعد', course: 'التعليق والأداء الصوتي (عن بُعد)',
    instructor: 'عمر درابكة', days: 'ثلاثاء / خميس',
    time: '7:00م – 9:00م', month: 'أغسطس', day: '01', status: 'upcoming',
    batchNumber: '#202', availableSeats: 12, registeredCount: 3,
    badgeDate: 'أغسطس 2026',
  },
];

/* ── Curriculum ───────────────────────────────────────────── */
const MODULES: SessionItem[] = [
  { title: 'المفاهيم الأساسية للتعليق الصوتي', desc: 'نبذة عن التعليق الصوتي وأنواعه وتطبيقاته في عالم الإعلام والإنتاج الرقمي — وثائقي، إعلاني، وترفيهي.' },
  { title: 'آليات الصوت والنطق السليم', desc: 'تشريح الجهاز الصوتي وفهم آليات النطق والإخراج الصوتي، وأساسيات ضبط مخارج الحروف والتمييز الصوتي.' },
  { title: 'تمارين الإحماء والتنفس الداعم', desc: 'أساسيات التنفس الداعم للصوت وتمارين الإحماء الصوتي يومياً لبناء عادة صوتية احترافية.' },
  { title: 'الأداء التعبيري والضبط الإيقاعي', desc: 'تقنيات الوقف والابتداء والإيقاع والانفعال الصوتي — كيف تعيش النص لا تقرأه.' },
  { title: 'قراءة أنواع النصوص والتكيّف معها', desc: 'قراءة عملية لنصوص وثائقية وإعلانية وتعليمية مع التحوّل بين الأنماط بسلاسة.' },
  { title: 'أساسيات التسجيل والإنتاج الصوتي', desc: 'معرفة عملية بأدوات التسجيل المنزلي والاحترافي، وإعداد الصوت لاستوديو الإنتاج.' },
  { title: 'مشروع التخرج وتقييم الأداء', desc: 'تسجيل مشروع ختامي كامل (Voice Demo رسمي) مع تقييم تفصيلي مباشر من المدرب وخطة تطوير فردية.' },
];

/* ── Instructor ───────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  {
    initials: 'ع.د', photo: photoOmar,
    name: 'عمر درابكة',
    role: 'معلّق صوتي محترف ومدرب أداء وإلقاء',
    badges: [
      { icon: Users,        label: '2,000+ طالب مدرّب' },
      { icon: Clock,        label: 'خبرة 12+ سنة' },
      { icon: Mic,          label: 'مئات التسجيلات الاحترافية' },
      { icon: GraduationCap, label: 'دبلوم إعلام — أكاديمية فلوريدا' },
    ],
    bio: 'معلّق صوتي محترف ومدرب أداء وإلقاء. سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا، ويمتلك خبرة واسعة في التدريب الصوتي والتمكين اللغوي تتجاوز 12 عامًا.',
  },
];

/* ── Goals ────────────────────────────────────────────────── */
const GOALS = [
  'نطق عربي سليم وصوت واثق محكوم بالتنفس',
  'أداء مرن يتكيّف مع كل نوع من أنواع النصوص',
  'ملف صوتي احترافي (Voice Demo) جاهز لسوق العمل',
  'مهارات تقنية أساسية في التسجيل الاحترافي',
  'شهادة معتمدة من تطبيق وجيز وأكاديمية كاسيت',
  'فرصة الانضمام لقاعدة بيانات كاسيت للمواهب الصوتية',
];

/* ── Pricing card ─────────────────────────────────────────── */
function PricingCard() {
  const waMsgOnline = 'السلام عليكم، أرغب في التسجيل في دورة التعليق والأداء الصوتي (عن بُعد — تفاعلية مباشرة).';
  return (
    <div style={{
      position: 'sticky', top: 24,
      background: 'linear-gradient(160deg,#0B1118 0%,#0F1822 100%)',
      borderRadius: 24, overflow: 'hidden',
      border: '1px solid rgba(103,232,249,0.25)',
      boxShadow: '0 28px 56px rgba(0,0,0,0.45), 0 0 0 1px rgba(103,232,249,0.08)',
      direction: 'rtl',
    }}>
      {/* Cover */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={coverOmar} alt="دورة التعليق الصوتي" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(11,17,24,0.92) 100%)' }} />
        <span style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: F, fontWeight: 700, fontSize: 12, color: '#0a1020',
          background: '#67e8f9', borderRadius: 999, padding: '5px 13px',
        }}>
          عن بُعد — تفاعلية مباشرة
        </span>
      </div>

      <div style={{ padding: '22px 22px 20px' }}>
        {/* Price */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 4 }}>سعر الدورة</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 36, color: GOLD }}>$150</span>
            <span style={{ fontFamily: FP, fontSize: 16, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>$200</span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(103,232,249,0.75)', marginTop: 4 }}>خصم 25% لفترة محدودة</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {[
            { icon: <Clock size={14} color='#67e8f9' />, label: 'المدة', val: '12 ساعة' },
            { icon: <BookOpen size={14} color='#67e8f9' />, label: 'الوحدات', val: '7 وحدات' },
            { icon: <Users size={14} color='#67e8f9' />, label: 'الحد الأقصى', val: '15 مقعداً' },
            { icon: <Award size={14} color='#67e8f9' />, label: 'الشهادة', val: 'وجيز + كاسيت' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(103,232,249,0.06)', border: '1px solid rgba(103,232,249,0.12)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>{s.icon}<span style={{ fontFamily: F, fontSize: 10.5, color: MUTED }}>{s.label}</span></div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: OFF }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href={waLink('962771052222', waMsgOnline)} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', boxSizing: 'border-box',
          background: 'linear-gradient(135deg,#67e8f9 0%,#22d3ee 100%)',
          color: '#051520', borderRadius: 13, padding: '14px 20px',
          fontFamily: F, fontWeight: 800, fontSize: 15,
          textDecoration: 'none', boxShadow: '0 8px 24px rgba(103,232,249,0.25)',
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
export default function CourseVoiceoverLivePage() {
  const [expanded, setExpanded]   = useState(false);
  const [partnerOpen, setPartner] = useState(false);

  const waMsgOnline = 'السلام عليكم، أرغب في التسجيل في دورة التعليق والأداء الصوتي (عن بُعد — تفاعلية مباشرة).';

  return (
    <main style={{ background: '#fff', direction: 'rtl' }}>

      {/* ════ HERO — light bg ════ */}
      <section style={{ background: LBG, paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
        <div style={{ ...INNER, display: 'grid', gridTemplateColumns: '1fr minmax(0,420px)', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }} className="course-hero-grid">
          {/* Left — text */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {[
                { label: 'الرئيسية', href: '/' },
                { label: 'الدورات', href: '/#courses' },
                { label: 'التعليق الصوتي (عن بُعد)', href: null },
              ].map((b, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ fontFamily: FP, fontSize: 11, color: 'rgba(0,0,0,0.25)' }}>/</span>}
                  {b.href
                    ? <a href={b.href} style={{ fontFamily: F, fontSize: 12, color: 'rgba(100,116,139,0.80)', textDecoration: 'none' }}>{b.label}</a>
                    : <span style={{ fontFamily: F, fontSize: 12, color: DH, fontWeight: 700 }}>{b.label}</span>
                  }
                </span>
              ))}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {[
                { text: 'عن بُعد — تفاعلية مباشرة', bg: 'rgba(103,232,249,0.12)', border: 'rgba(103,232,249,0.30)', color: '#0e7490' },
                { text: 'مستوى متوسط', bg: 'rgba(255,193,7,0.10)', border: 'rgba(255,193,7,0.28)', color: '#92670a' },
              ].map(b => (
                <span key={b.text} style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: b.color, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 999, padding: '5px 14px' }}>
                  {b.text}
                </span>
              ))}
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: DH, lineHeight: 1.2, margin: '0 0 16px' }}>
              دورة التعليق والأداء الصوتي<br />
              <span style={{ color: '#0e7490' }}>عن بُعد — تفاعلية مباشرة</span>
            </h1>

            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.6vw,16.5px)', color: DM, lineHeight: 1.85, margin: '0 0 26px', maxWidth: 560 }}>
              دورة تفاعلية مباشرة عبر زوم لتأسيس وتطوير مهارات التعليق الصوتي والأداء الإعلامي — من ضبط مخارج الحروف والتحكم بالنفس والطبقات الصوتية، إلى بناء Voice Demo احترافي جاهز لسوق العمل.
            </p>

            {/* Goals */}
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

            {/* Quick stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[
                { label: 'مدة الدورة',   val: '12 ساعة تدريبية' },
                { label: 'عدد الوحدات', val: '7 وحدات' },
                { label: 'أقصى عدد',    val: '15 متدرباً' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontFamily: F, fontSize: 11, color: 'rgba(100,116,139,0.70)' }}>{s.label}</span>
                  <span style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: DH }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — sticky pricing card */}
          <PricingCard />
        </div>
      </section>

      {/* ════ REGISTRATION — dark bg ════ */}
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
            waMsg={waMsgOnline}
          />
          <PartnerBar open={partnerOpen} onToggle={() => setPartner(v => !v)} />

          {/* Advisor */}
          <div style={{ marginTop: 28, padding: '20px 22px', background: CARD2, borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: MUTED, marginBottom: 14 }}>مستشارة التسجيل — عن بُعد</div>
            <AdvisorMini
              name="ياقوت الخشاشنة"
              role="مستشارة تسجيل دورات عن بُعد"
              photo={yaqoutImg}
              href={waLink('962771052222', waMsgOnline)}
            />
          </div>
        </div>
      </section>

      {/* ════ CURRICULUM — light bg ════ */}
      <section style={{ background: LBG, padding: 'clamp(44px,6vw,80px) 0' }}>
        <div style={INNER}>
          <LightSectionTitle>المنهج الدراسي</LightSectionTitle>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { val: '7', lbl: 'وحدات' },
                { val: '12', lbl: 'ساعة تدريبية' },
                { val: 'زوم', lbl: 'تفاعلي مباشر' },
              ].map(s => (
                <div key={s.lbl} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: DH, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: 'rgba(100,116,139,0.70)', marginTop: 2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: DH, color: '#fff', fontFamily: F, fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer' }}
            >
              طباعة المنهج
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {MODULES.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 22px',
                borderBottom: i < MODULES.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}>
                <span style={{
                  fontFamily: FP, fontWeight: 800, fontSize: 12,
                  color: '#051520', background: '#67e8f9',
                  borderRadius: '50%', flexShrink: 0,
                  width: 28, height: 28,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{m.title}</div>
                  <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{m.desc}</div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                  background: 'rgba(103,232,249,0.12)', border: '1px solid rgba(103,232,249,0.28)',
                  borderRadius: 8, padding: '4px 10px',
                  fontFamily: FP, fontWeight: 700, fontSize: 11, color: '#0e7490', whiteSpace: 'nowrap',
                }}>
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
