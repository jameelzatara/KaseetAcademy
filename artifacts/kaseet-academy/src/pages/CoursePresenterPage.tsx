/**
 * الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي
 * المدربة: رنا العزام | السعر: 250 د.أ (من 340) | 8 جلسات / 16 ساعة | حضوري
 */
import { useState } from 'react';
import { Clock, Users, Tv, Globe, CheckCircle2, ArrowLeft, BookOpen, Award } from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, CARD2, GOLD, OFF, MUTED, F, FP, LBG, DH, DM, INNER,
  waLink, GoldDot, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverPresenter from '@assets/cover_كورس_اﻟﺪورة_اﻟﻤﻜﺜﻔﺔ_اﻟﻤﺬﻳﻊ_اﻟﻤﺤﺘﺮف_وﻣﻬﺎرات_اﻹﻋﻼم_اﻟﺮﻗﻤﻲ_1785692222453';
import photoRana     from '@assets/trainer-rana-azzam_1785692178863.JPG';
import ayaImg        from '@assets/اية_القماز_1785619557679.jpeg';

/* ── Schedule ─────────────────────────────────────────────── */
const ACTIVE_IP: ScheduleEntry[] = [];

const UPCOMING_IP: ScheduleEntry[] = [
  {
    id: 'ip-p101', group: 'دفعة #101 — أمسيات', course: 'الدورة المكثفة: المذيع المحترف',
    instructor: 'رنا العزام', days: 'أمسيات (4 أيام/أسبوع)',
    time: '6:00م – 8:00م', month: 'أغسطس', day: '01', status: 'upcoming',
    batchNumber: '#101', availableSeats: 10, registeredCount: 3,
    badgeDate: 'أغسطس 2026',
  },
  {
    id: 'ip-p102', group: 'دفعة #102 — صباحي', course: 'الدورة المكثفة: المذيع المحترف',
    instructor: 'رنا العزام', days: 'صباحي (4 أيام/أسبوع)',
    time: '10:00ص – 12:00م', month: 'أغسطس', day: '01', status: 'upcoming',
    batchNumber: '#102', availableSeats: 8, registeredCount: 5,
    badgeDate: 'أغسطس 2026',
  },
];

/* ── Curriculum ───────────────────────────────────────────── */
const SESSIONS: SessionItem[] = [
  { title: 'التحرير الصحفي الإعلامي', desc: 'أسس التحرير الصحفي وأساليب الكتابة الإخبارية — من الهرم المقلوب إلى كتابة الخبر والتقرير بمعايير غرف الأخبار العالمية.' },
  { title: 'فن العناوين والمقدمات الإذاعية', desc: 'صياغة عناوين جاذبة ومقدمات موجزة ومؤثرة للأخبار والبرامج — التقنيات والأخطاء الشائعة والتطبيق الفوري.' },
  { title: 'التحقق من المعلومات وأخلاقيات الإعلام', desc: 'معايير التثبّت من المعلومات وتحرّي الدقة في عصر السوشيال ميديا — الأدوات والمنهجية والمسؤولية المهنية.' },
  { title: 'مهارات الإلقاء والتقديم المرئي', desc: 'تقنيات الإلقاء أمام الكاميرا: الصوت والنبرة والإيقاع والتعامل مع الـ teleprompter وأساليب التقديم الاحترافي.' },
  { title: 'لغة الجسد والتعبير غير اللفظي', desc: 'قراءة لغة الجسد وتوظيفها في الأداء الإعلامي — التعبير بالعيون والوجه واليدين والوضعية الجسدية الصحيحة.' },
  { title: 'إدارة الحوار والمقابلات الصحفية', desc: 'فن إدارة الحوار المرئي والمسموع: التحضير، طرح الأسئلة، التعامل مع المتحدثين الصعبين، وإنهاء الحوار بتأثير.' },
  { title: 'التغطية الميدانية والبث المباشر', desc: 'مهارات العمل في الميدان، التقرير المباشر، وإعداد التحقيقات الصحفية المرئية وفق معايير الاحترافية الإعلامية.' },
  { title: 'مشروع التخرج: برنامج متكامل', desc: 'إنتاج برنامج إذاعي أو مرئي متكامل يشمل التحرير والتقديم والمونتاج الأساسي — مع تقييم لجنة من المدربين وتوصية توظيف.' },
];

/* ── Instructor ───────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  {
    initials: 'ر.ع', photo: photoRana,
    name: 'رنا محمد العزام',
    role: 'إعلامية ومدربة أداء ومختصة تحرير لغوي',
    badges: [
      { icon: Tv,    label: 'رؤيا | صاد | حياة FM' },
      { icon: Clock, label: 'خبرة 10+ سنوات' },
      { icon: Globe, label: 'مجمع اللغة العربية' },
      { icon: Users, label: 'مئات المتدربين' },
    ],
    bio: 'الإعلامية رنا محمد العزام معدّة ومقدّمة برامج فضائية وإذاعية وبودكاست معتمدة. تنقّلت بين كبرى المؤسسات الإعلامية كقناة رؤيا الفضائية وقناة صاد وإذاعة حياة FM. عملت محررةً ومدققةً لغوية في مجمع اللغة العربية الأردني ومذيعةً في إذاعة المجمع. قدّمت برامج تدريبية متخصصة لطلبة الإعلام في جامعة البتراء ولمؤسسات حكومية كبرى.',
  },
];

/* ── Goals ────────────────────────────────────────────────── */
const GOALS = [
  'إنتاج تقرير صحفي متكامل محرَّر بمعايير غرف الأخبار العالمية',
  'تقديم احترافي أمام الكاميرا بصوت وأداء ومظهر مثالي',
  'إتقان فن إدارة الحوار والمقابلات الصحفية الصعبة',
  'فهم أخلاقيات الإعلام والتحقق من المعلومات',
  'شهادة معتمدة من تطبيق وجيز وأكاديمية كاسيت',
  'توصية مهنية وفرصة للانضمام لشبكة خريجي كاسيت الإعلاميين',
];

/* ── Pricing card ─────────────────────────────────────────── */
function PricingCard() {
  const waMsg = 'السلام عليكم، أرغب في التسجيل في الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي.';
  return (
    <div style={{
      position: 'sticky', top: 24,
      background: 'linear-gradient(160deg,#120B00 0%,#1A1205 100%)',
      borderRadius: 24, overflow: 'hidden',
      border: '1px solid rgba(255,193,7,0.25)',
      boxShadow: '0 28px 56px rgba(0,0,0,0.45),0 0 0 1px rgba(255,193,7,0.08)',
      direction: 'rtl',
    }}>
      {/* Cover */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={coverPresenter} alt="الدورة المكثفة" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 32%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(18,11,0,0.92) 100%)' }} />
        <span style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: F, fontWeight: 700, fontSize: 12, color: NAVY,
          background: GOLD, borderRadius: 999, padding: '5px 13px',
        }}>
          حضوري في عمّان
        </span>
      </div>

      <div style={{ padding: '22px 22px 20px' }}>
        {/* Price */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: F, fontSize: 11, color: MUTED, marginBottom: 4 }}>السعر بعد الخصم</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 36, color: GOLD }}>250 د.أ</span>
            <span style={{ fontFamily: FP, fontSize: 16, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through' }}>340 د.أ</span>
          </div>
          <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,193,7,0.75)', marginTop: 4 }}>خصم 26% — عرض محدود المدة</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {[
            { icon: <Clock size={14} color={GOLD} />, label: 'المدة', val: '16 ساعة' },
            { icon: <BookOpen size={14} color={GOLD} />, label: 'الجلسات', val: '8 جلسات' },
            { icon: <Users size={14} color={GOLD} />, label: 'الحد الأقصى', val: '10 مقاعد' },
            { icon: <Award size={14} color={GOLD} />, label: 'الشهادة', val: 'وجيز + كاسيت' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.12)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>{s.icon}<span style={{ fontFamily: F, fontSize: 10.5, color: MUTED }}>{s.label}</span></div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: OFF }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href={waLink('962790234483', waMsg)} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', boxSizing: 'border-box',
          background: 'linear-gradient(135deg,#FFC107 0%,#ffb300 100%)',
          color: NAVY, borderRadius: 13, padding: '14px 20px',
          fontFamily: F, fontWeight: 800, fontSize: 15,
          textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,0.25)',
        }}>
          سجّل الآن <ArrowLeft size={15} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </a>
        <p style={{ fontFamily: F, fontSize: 11.5, color: MUTED, textAlign: 'center', margin: '10px 0 0', lineHeight: 1.6 }}>
          10 مقاعد فقط — بإمكانية التقسيط
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function CoursePresenterPage() {
  const [expanded, setExpanded]   = useState(false);
  const [partnerOpen, setPartner] = useState(false);

  const waMsg = 'السلام عليكم، أرغب في التسجيل في الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي.';

  return (
    <main style={{ background: '#fff', direction: 'rtl' }}>

      {/* ════ HERO ════ */}
      <section style={{ background: LBG, paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
        <div style={{ ...INNER, display: 'grid', gridTemplateColumns: '1fr minmax(0,420px)', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }} className="course-hero-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {[{ label: 'الرئيسية', href: '/' }, { label: 'الدورات', href: '/#courses' }, { label: 'المذيع المحترف', href: null }].map((b, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ fontFamily: FP, fontSize: 11, color: 'rgba(0,0,0,0.25)' }}>/</span>}
                  {b.href ? <a href={b.href} style={{ fontFamily: F, fontSize: 12, color: 'rgba(100,116,139,0.80)', textDecoration: 'none' }}>{b.label}</a>
                    : <span style={{ fontFamily: F, fontSize: 12, color: DH, fontWeight: 700 }}>{b.label}</span>}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {[
                { text: 'حضوري في عمّان', bg: 'rgba(255,193,7,0.10)', border: 'rgba(255,193,7,0.28)', color: '#92670a' },
                { text: 'دورة مكثفة', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.20)', color: '#991b1b' },
              ].map(b => (
                <span key={b.text} style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: b.color, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 999, padding: '5px 14px' }}>{b.text}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: DH, lineHeight: 1.2, margin: '0 0 16px' }}>
              الدورة المكثفة:<br />
              <span style={{ color: '#92670a' }}>المذيع المحترف ومهارات الإعلام الرقمي</span>
            </h1>

            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.6vw,16.5px)', color: DM, lineHeight: 1.85, margin: '0 0 26px', maxWidth: 560 }}>
              برنامج تدريبي مكثّف يصنع إعلامياً متكاملاً في 8 جلسات احترافية — من فنون التحرير والإلقاء والتقديم أمام الكاميرا، إلى إدارة الحوار والتغطية الميدانية والأخلاقيات المهنية.
            </p>

            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '20px 22px', marginBottom: 28 }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 14 }}>ماذا ستحقق بنهاية الدورة؟</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {GOALS.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={16} color='#92670a' strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.65 }}>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[{ label: 'مدة الدورة', val: '16 ساعة تدريبية' }, { label: 'الجلسات', val: '8 جلسات حضورية' }, { label: 'الحد الأقصى', val: '10 متدربين فقط' }].map(s => (
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
            variant="inperson"
            activeBatches={ACTIVE_IP}
            upcomingBatches={UPCOMING_IP}
            expanded={expanded}
            onToggle={() => setExpanded(v => !v)}
            price="250 د.أ"
            priceStrike="340 د.أ"
            waPhone="962790234483"
            waMsg={waMsg}
          />
          <PartnerBar open={partnerOpen} onToggle={() => setPartner(v => !v)} />

          <div style={{ marginTop: 28, padding: '20px 22px', background: CARD2, borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: MUTED, marginBottom: 14 }}>مستشارة التسجيل — وجاهي</div>
            <AdvisorMini
              name="آية القماز"
              role="مستشارة تسجيل دورات حضورية"
              photo={ayaImg}
              href={waLink('962790234483', waMsg)}
            />
          </div>
        </div>
      </section>

      {/* ════ CURRICULUM ════ */}
      <section style={{ background: LBG, padding: 'clamp(44px,6vw,80px) 0' }}>
        <div style={INNER}>
          <LightSectionTitle>المنهج الدراسي</LightSectionTitle>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[{ val: '8', lbl: 'جلسات' }, { val: '16', lbl: 'ساعة تدريبية' }, { val: 'حضوري', lbl: 'داخل القاعة' }].map(s => (
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
                <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 12, color: NAVY, background: GOLD, borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{s.desc}</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)', borderRadius: 8, padding: '4px 10px', fontFamily: FP, fontWeight: 700, fontSize: 11, color: '#92670a', whiteSpace: 'nowrap' }}>
                  داخل القاعة
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
