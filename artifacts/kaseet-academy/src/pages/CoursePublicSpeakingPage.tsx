/**
 * دورة فن الخطابة والإلقاء الجماهيري المؤثر
 * المدرب: د. صهيب الخوالدة | حضوري: 180 د.أ | عن بُعد: $150 | 3 وحدات / 8 جلسات / 16 ساعة
 */
import { useState } from 'react';
import { Clock, Users, GraduationCap, Globe, CheckCircle2, ArrowLeft, BookOpen, Award } from 'lucide-react';
import InstructorsSection, { type Instructor as InstructorData } from '@/components/InstructorsSection';
import {
  NAVY, DARK, CARD2, GOLD, OFF, MUTED, F, FP, LBG, DH, DM, INNER,
  waLink, SectionTitle, LightSectionTitle, AdvisorMini,
  ScheduleEntry, SessionItem, TrackCard2, PartnerBar,
} from './shared/coursePageHelpers';
import coverPS      from '@assets/cover-public-speaking-tedx_1785692401460.jpeg';
import photoSohaib  from '@assets/instructor-sohaib_1785692401461.jpeg';
import ayaImg       from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg    from '@assets/ياقوت__1785619557679.jpeg';

/* ── Schedule ─────────────────────────────────────────────── */
const ACTIVE_IP:     ScheduleEntry[] = [];
const ACTIVE_ONLINE: ScheduleEntry[] = [];

const UPCOMING_IP: ScheduleEntry[] = [
  {
    id: 'ip-ps101', group: 'دفعة #101 — حضوري', course: 'فن الخطابة والإلقاء',
    instructor: 'د. صهيب الخوالدة', days: 'الجمعة / السبت',
    time: '5:00م – 7:00م', month: 'أغسطس', day: '01', status: 'upcoming',
    batchNumber: '#101', availableSeats: 12, registeredCount: 3,
    badgeDate: 'أغسطس 2026',
  },
  {
    id: 'ip-ps102', group: 'دفعة #102 — حضوري', course: 'فن الخطابة والإلقاء',
    instructor: 'د. صهيب الخوالدة', days: 'الأحد / الثلاثاء',
    time: '7:00م – 9:00م', month: 'سبتمبر', day: '01', status: 'upcoming',
    batchNumber: '#102', availableSeats: 12, registeredCount: 0,
    badgeDate: 'سبتمبر 2026',
  },
];

const UPCOMING_ONLINE: ScheduleEntry[] = [
  {
    id: 'rm-ps201', group: 'دفعة #201 — عن بُعد', course: 'فن الخطابة والإلقاء',
    instructor: 'د. صهيب الخوالدة', days: 'الجمعة',
    time: '7:00م – 9:00م', month: 'أغسطس', day: '01', status: 'upcoming',
    batchNumber: '#201', availableSeats: 15, registeredCount: 5,
    badgeDate: 'أغسطس 2026',
  },
  {
    id: 'rm-ps202', group: 'دفعة #202 — عن بُعد', course: 'فن الخطابة والإلقاء',
    instructor: 'د. صهيب الخوالدة', days: 'الثلاثاء',
    time: '7:00م – 9:00م', month: 'سبتمبر', day: '01', status: 'upcoming',
    batchNumber: '#202', availableSeats: 20, registeredCount: 0,
    badgeDate: 'سبتمبر 2026',
  },
];

/* ── Curriculum ───────────────────────────────────────────── */
const SESSIONS: SessionItem[] = [
  { unit: 'الوحدة الأولى: الأساسيات والجمهور', title: 'كسر الرهبة وبناء الثقة', desc: 'استراتيجيات عملية للتغلب على رهبة المنصة وبناء الثقة الداخلية — من خلال تمارين التعرّض التدريجي والتدريب الذهني.' },
  { unit: 'الوحدة الأولى', title: 'مخارج الحروف والصوت الجذاب', desc: 'تمارين صوتية عملية لتحسين النطق والإلقاء — الإيقاع، الطبقات الصوتية، واستخدام الصمت الاستراتيجي كأداة خطابية.' },
  { unit: 'الوحدة الثانية: الإقناع والتأثير', title: 'الوقفات الذكية وإيقاع الخطاب', desc: 'فن توظيف الصمت والوقفة والتوقف في الخطاب — كيف يُضاعف السكوت في المكان الصحيح قوة الكلام ويُعمّق التأثير.' },
  { unit: 'الوحدة الثانية', title: 'فن الارتجال والتحدث بثقة', desc: 'تقنيات الحديث دون استعداد مسبق — مهارة قيّمة في المقابلات وجلسات النقاش وإدارة المواقف المفاجئة بكل احتراف.' },
  { unit: 'الوحدة الثانية', title: 'هيكل الخطاب المؤثر', desc: 'منهجية بناء الخطاب من المقدمة الجذابة إلى الخاتمة التي تبقى في الذاكرة — نماذج TED وخطابات الإقناع العالمية.' },
  { unit: 'الوحدة الثالثة: التطبيقات المتقدمة', title: 'خطابة الإقناع والمواقف الصعبة', desc: 'أدوات الإقناع في الظروف الضاغطة والمواقف الحرجة — التعامل مع الجمهور المعترض وقلب الرأي بالحجة والأسلوب.' },
  { unit: 'الوحدة الثالثة', title: 'إدارة الأسئلة الصعبة والأزمات', desc: 'الرد على الأسئلة الحرجة أمام الجمهور وإدارة اللحظات المفاجئة بثقة — تقنيات الانتقال السلس وإعادة توجيه الحوار.' },
  { unit: 'الوحدة الثالثة', title: 'مشروع التخرج: خطاب TED x', desc: 'تصميم وتنفيذ خطاب TED x أمام لجنة تقييم — مع تقرير فردي لهويتك الخطابية وخريطة طريق للتطوير المستمر.' },
];

/* ── Instructor ───────────────────────────────────────────── */
const INSTRUCTORS: InstructorData[] = [
  {
    initials: 'ص.خ', photo: photoSohaib,
    name: 'د. صهيب الخوالدة',
    role: 'خبير تخطيط استراتيجي وتواصل قيادي',
    badges: [
      { icon: GraduationCap, label: 'دكتوراه — جامعة أستون، المملكة المتحدة' },
      { icon: Globe,         label: 'مدير أبحاث — مؤسسة قطر' },
      { icon: Clock,         label: 'خبرة 16+ سنة' },
      { icon: Award,         label: 'MBA امتياز — الشرق الأوسط' },
    ],
    bio: 'خبير تخطيط استراتيجي وتواصل قيادي، يشغل حالياً منصب مدير الأبحاث والسياسات في مؤسسة قطر، بخبرة مهنية تتجاوز 16 عاماً في تطوير الأعمال وإدارة المشاريع والقيادة الاستراتيجية. حاصل على دكتوراه في إدارة الأعمال من جامعة أستون (المملكة المتحدة)، وماجستير إدارة أعمال بامتياز من الجامعة الأردنية، وماجستير محاسبة وتمويل من جامعة برمنغهام.',
  },
];

/* ── Goals ────────────────────────────────────────────────── */
const GOALS = [
  'خطاب TED x متكامل تُقدّمه أمام لجنة التقييم',
  'ثقة حقيقية على المنصة وأمام أي جمهور',
  'إتقان فن الارتجال والتعامل مع المواقف المفاجئة',
  'أسلوب خطابي قائم على الإقناع لا مجرد الإلقاء',
  'شهادة معتمدة من تطبيق وجيز وأكاديمية كاسيت',
  'تقرير فردي لهويتك الخطابية وخريطة طريق للتطوير',
];

/* ── Pricing card ─────────────────────────────────────────── */
function PricingCard() {
  const waMsgIP     = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (حضوري).';
  const waMsgOnline = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (عن بُعد).';
  return (
    <div style={{
      position: 'sticky', top: 24,
      background: 'linear-gradient(160deg,#0B0F1A 0%,#0E1220 100%)',
      borderRadius: 24, overflow: 'hidden',
      border: '1px solid rgba(168,85,247,0.25)',
      boxShadow: '0 28px 56px rgba(0,0,0,0.45),0 0 0 1px rgba(168,85,247,0.08)',
      direction: 'rtl',
    }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={coverPS} alt="فن الخطابة" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(11,15,26,0.92) 100%)' }} />
        <span style={{ position: 'absolute', top: 12, right: 12, fontFamily: F, fontWeight: 700, fontSize: 12, color: '#fff', background: 'rgba(168,85,247,0.75)', borderRadius: 999, padding: '5px 13px' }}>
          حضوري وعن بُعد
        </span>
      </div>

      <div style={{ padding: '22px 22px 20px' }}>
        {/* Dual price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'rgba(255,193,7,0.07)', border: '1px solid rgba(255,193,7,0.18)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontSize: 10, color: MUTED, marginBottom: 5 }}>حضوري</div>
            <div style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: GOLD, lineHeight: 1 }}>180 د.أ</div>
            <div style={{ fontFamily: FP, fontSize: 12, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through', marginTop: 2 }}>240 د.أ</div>
          </div>
          <div style={{ background: 'rgba(103,232,249,0.07)', border: '1px solid rgba(103,232,249,0.18)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontSize: 10, color: MUTED, marginBottom: 5 }}>عن بُعد</div>
            <div style={{ fontFamily: FP, fontWeight: 900, fontSize: 22, color: '#67e8f9', lineHeight: 1 }}>$150</div>
            <div style={{ fontFamily: FP, fontSize: 12, color: 'rgba(252,251,251,0.28)', textDecoration: 'line-through', marginTop: 2 }}>$200</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {[
            { icon: <Clock size={14} color='#a855f7' />, label: 'المدة', val: '16 ساعة' },
            { icon: <BookOpen size={14} color='#a855f7' />, label: 'الجلسات', val: '8 جلسات' },
            { icon: <Users size={14} color='#a855f7' />, label: '3 وحدات', val: 'متكاملة' },
            { icon: <Award size={14} color='#a855f7' />, label: 'الشهادة', val: 'وجيز + كاسيت' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.14)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>{s.icon}<span style={{ fontFamily: F, fontSize: 10.5, color: MUTED }}>{s.label}</span></div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 12.5, color: OFF }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href={waLink('962790234483', waMsgIP)} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', boxSizing: 'border-box',
            background: 'linear-gradient(135deg,#FFC107 0%,#ffb300 100%)',
            color: NAVY, borderRadius: 12, padding: '12px 20px',
            fontFamily: F, fontWeight: 800, fontSize: 14, textDecoration: 'none',
          }}>
            سجّل حضوري <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
          </a>
          <a href={waLink('962771052222', waMsgOnline)} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', boxSizing: 'border-box',
            background: 'linear-gradient(135deg,#67e8f9 0%,#22d3ee 100%)',
            color: '#051520', borderRadius: 12, padding: '12px 20px',
            fontFamily: F, fontWeight: 800, fontSize: 14, textDecoration: 'none',
          }}>
            سجّل عن بُعد <ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
          </a>
        </div>
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
export default function CoursePublicSpeakingPage() {
  const [expandIP,     setExpandIP]     = useState(false);
  const [expandOnline, setExpandOnline] = useState(false);
  const [partnerOpen,  setPartner]      = useState(false);

  const waMsgIP     = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (حضوري).';
  const waMsgOnline = 'السلام عليكم، أرغب في التسجيل في دورة فن الخطابة والإلقاء الجماهيري (عن بُعد).';

  return (
    <main style={{ background: '#fff', direction: 'rtl' }}>

      {/* ════ HERO ════ */}
      <section style={{ background: LBG, paddingTop: 'clamp(40px,6vw,80px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
        <div style={{ ...INNER, display: 'grid', gridTemplateColumns: '1fr minmax(0,420px)', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }} className="course-hero-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {[{ label: 'الرئيسية', href: '/' }, { label: 'الدورات', href: '/#courses' }, { label: 'فن الخطابة', href: null }].map((b, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ fontFamily: FP, fontSize: 11, color: 'rgba(0,0,0,0.25)' }}>/</span>}
                  {b.href ? <a href={b.href} style={{ fontFamily: F, fontSize: 12, color: 'rgba(100,116,139,0.80)', textDecoration: 'none' }}>{b.label}</a>
                    : <span style={{ fontFamily: F, fontSize: 12, color: DH, fontWeight: 700 }}>{b.label}</span>}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {[
                { text: 'حضوري وعن بُعد', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.28)', color: '#7e22ce' },
                { text: 'للمحترفين والقياديين', bg: 'rgba(255,193,7,0.10)', border: 'rgba(255,193,7,0.28)', color: '#92670a' },
              ].map(b => (
                <span key={b.text} style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: b.color, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 999, padding: '5px 14px' }}>{b.text}</span>
              ))}
            </div>

            <h1 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(26px,4vw,46px)', color: DH, lineHeight: 1.2, margin: '0 0 16px' }}>
              دورة فن الخطابة<br />
              <span style={{ color: '#7e22ce' }}>والإلقاء الجماهيري المؤثر</span>
            </h1>

            <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.6vw,16.5px)', color: DM, lineHeight: 1.85, margin: '0 0 26px', maxWidth: 560 }}>
              برنامج تحويلي يحوّل الخوف من المنصة إلى ثقة راسخة — 3 وحدات متكاملة في أساسيات الخطابة والإقناع والتطبيق المتقدم، بإشراف خبير خطابة وتواصل قيادي دولي.
            </p>

            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '20px 22px', marginBottom: 28 }}>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 14 }}>ماذا ستحقق بنهاية الدورة؟</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {GOALS.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={16} color='#7e22ce' strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.65 }}>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {[{ label: 'مدة الدورة', val: '16 ساعة تدريبية' }, { label: 'الجلسات', val: '8 جلسات' }, { label: 'الوحدات', val: '3 وحدات متكاملة' }].map(s => (
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TrackCard2
              variant="inperson"
              activeBatches={ACTIVE_IP}
              upcomingBatches={UPCOMING_IP}
              expanded={expandIP}
              onToggle={() => setExpandIP(v => !v)}
              price="180 د.أ"
              priceStrike="240 د.أ"
              waPhone="962790234483"
              waMsg={waMsgIP}
            />
            <TrackCard2
              variant="online"
              activeBatches={ACTIVE_ONLINE}
              upcomingBatches={UPCOMING_ONLINE}
              expanded={expandOnline}
              onToggle={() => setExpandOnline(v => !v)}
              price="$150"
              priceStrike="$200"
              waPhone="962771052222"
              waMsg={waMsgOnline}
            />
          </div>
          <PartnerBar open={partnerOpen} onToggle={() => setPartner(v => !v)} />

          {/* Advisors */}
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="advisor-grid">
            <div style={{ padding: '20px 22px', background: CARD2, borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: MUTED, marginBottom: 14 }}>مستشارة التسجيل — وجاهي</div>
              <AdvisorMini name="آية القماز" role="مستشارة تسجيل دورات حضورية" photo={ayaImg} href={waLink('962790234483', waMsgIP)} />
            </div>
            <div style={{ padding: '20px 22px', background: CARD2, borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: MUTED, marginBottom: 14 }}>مستشارة التسجيل — عن بُعد</div>
              <AdvisorMini name="ياقوت الخشاشنة" role="مستشارة تسجيل دورات عن بُعد" photo={yaqoutImg} href={waLink('962771052222', waMsgOnline)} />
            </div>
          </div>
        </div>
      </section>

      {/* ════ CURRICULUM ════ */}
      <section style={{ background: LBG, padding: 'clamp(44px,6vw,80px) 0' }}>
        <div style={INNER}>
          <LightSectionTitle>المنهج الدراسي</LightSectionTitle>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[{ val: '3', lbl: 'وحدات' }, { val: '8', lbl: 'جلسات' }, { val: '16', lbl: 'ساعة' }].map(s => (
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
                <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 12, color: '#fff', background: '#7e22ce', borderRadius: '50%', flexShrink: 0, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {s.unit && <div style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: '#7e22ce', marginBottom: 4 }}>{s.unit}</div>}
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: DH, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontFamily: F, fontSize: 13.5, color: DM, lineHeight: 1.75 }}>{s.desc}</div>
                </div>
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
