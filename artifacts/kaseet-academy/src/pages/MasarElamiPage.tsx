/**
 * صفحة المسار الإعلامي — كاسيت أكاديمي
 */
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Award } from 'lucide-react';
import { NAVY, GOLD, OFF, MUTED, F, FP, INNER, LBG, DH, DM, waLink } from './shared/coursePageHelpers';
import wajeezLogo     from '@assets/wajeez-logo_1785688262989.png';
import coverElami     from '@assets/cover_لصفحة_الاعلام_1785772052880.jpeg';
import m1             from '@assets/M1_1785772181185.png';
import m2             from '@assets/M2_1785772181186.png';
import m3             from '@assets/M3_1785772176798.png';
import m4             from '@assets/M4_1785772176799.png';
import m5             from '@assets/M5_1785772176798.png';
import instructorYasar from '@assets/course_01_instructor_1785428932171.jpeg';
import instructorRana  from '@assets/trainer-rana-azzam_1785692178863.JPG';
import instructorOmar  from '@assets/trainer-omar_1785692015818.jpg';

/* ── tokens ───────────────────────────────────────────── */
const BG   = '#161E2B';
const BG2  = '#1A2332';
const BG3  = '#1D2738';
const CARD = '#242F40';
const HAIR = 'rgba(255,255,255,0.08)';
const GLD  = GOLD;
const GS   = 'rgba(255,193,7,0.10)';
const GL   = 'rgba(255,193,7,0.28)';
const MUT  = '#9AA6B8';
const LT   = '#CBD4E1';

const WA_PHONE = '962700000000';
const WA_TRACK       = waLink(WA_PHONE, 'مرحباً، أودّ الاستفسار عن المسار الإعلامي');
const WA_CONSULT     = (name: string) => waLink(WA_PHONE, `مرحباً، أودّ حجز جلسة استشارية مع ${name}`);

/* ── station data ─────────────────────────────────────── */
const STATIONS = [
  {
    n:'01', phase:1, standalone:true,
    title:'التقديم التلفزيوني والإذاعي',
    sub:'المرحلة التأسيسية — الحضور والإلقاء والتقديم',
    chips:['الإلقاء الاحترافي','لغة الجسد','الحضور أمام الكاميرا','قراءة النشرة','تقديم البرامج','إدارة الحوارات','المقابلات','البث المباشر'],
    project:'تقرير مرئي كامل يُقدَّم أمام الكاميرا ويُقيَّم من لجنة مدربين.',
    hours:'16 ساعة', note:'متاحة كدورة مستقلة: الدورة المكثفة — المذيع المحترف',
  },
  {
    n:'02', phase:1, standalone:false,
    title:'التعليق الصوتي (Voice Over)',
    sub:'المرحلة التأسيسية — ضبط الصوت والنبرة',
    chips:['أساسيات الأداء الصوتي','التنفس الصحيح','مخارج الحروف','ضبط النبرات'],
    project:'تسجيل صوتي مقيَّم: إعلان، تمهيد برنامج، أو خبر.',
    hours:'6 ساعات', note:null,
  },
  {
    n:'03', phase:2, standalone:false,
    title:'الصحافة والتحرير الإعلامي',
    sub:'مرحلة التخصص — الكتابة والتحرير',
    chips:['الخبر','التقرير','التحقيق','المقال','التحرير الرقمي','العناوين','التحقق من الأخبار'],
    project:'تقرير صحفي مكتوب مع تحقيق من مصادر متعددة.',
    hours:'12 ساعة', note:null,
  },
  {
    n:'04', phase:2, standalone:false,
    title:'المراسل الميداني',
    sub:'مرحلة التخصص — التغطية والميدان',
    chips:['الوقفة الميدانية','التقارير','التغطيات','البث المباشر','صناعة القصة','السلامة المهنية'],
    project:'تقرير ميداني مصوَّر يُجهَّز كاملاً: تصوير وتعليق وإخراج.',
    hours:'12 ساعة', note:null,
  },
  {
    n:'05', phase:2, standalone:false,
    title:'صناعة المحتوى الإعلامي',
    sub:'مرحلة التخصص — المحتوى الرقمي',
    chips:['كتابة السكريبت','الريلز','صناعة الهوية','تصوير المحتوى','السرد القصصي','استراتيجيات النشر'],
    project:'سلسلة محتوى من ثلاث قطع لعلامة تجارية أو موضوع إعلامي.',
    hours:'10 ساعات', note:null,
  },
  {
    n:'06', phase:2, standalone:false,
    title:'البودكاست',
    sub:'مرحلة التخصص — الصوت والمحادثة',
    chips:['إعداد الحلقة','كتابة الأسئلة','إدارة الحوار','التسجيل','المونتاج الأساسي','نشر البودكاست'],
    project:'حلقة بودكاست منتَجة ومنشورة على إحدى المنصات.',
    hours:'10 ساعات', note:null,
  },
  {
    n:'07', phase:2, standalone:false,
    title:'الإعلام الرقمي والمتحدث الرسمي',
    sub:'مرحلة التخصص — التصريحات وإدارة الأزمات',
    chips:['التعامل مع الإعلام','المؤتمرات الصحفية','التصريحات','إدارة الأزمات الإعلامية','بناء الرسائل'],
    project:'محاكاة مؤتمر صحفي مع إدارة موقف أزمة.',
    hours:'10 ساعات', note:null,
  },
  {
    n:'08', phase:2, standalone:false,
    title:'الإنتاج الإعلامي',
    sub:'مرحلة التخصص — الإخراج والإنتاج',
    chips:['التخطيط للإنتاج','كتابة السيناريو','التصوير','الإخراج','أساسيات المونتاج','إدارة فريق الإنتاج'],
    project:'فيلم قصير أو مقطع إعلامي منتَج بالكامل.',
    hours:'12 ساعة', note:null,
  },
  {
    n:'09', phase:2, standalone:false,
    title:'الذكاء الاصطناعي للإعلاميين',
    sub:'مرحلة التخصص — أدوات المستقبل',
    chips:['كتابة الأخبار بالذكاء الاصطناعي','صناعة السكريبت','تحويل النص إلى صوت','توليد الصور','أدوات المونتاج','الترجمة والدبلجة','التحقق من المعلومات'],
    project:'مشروع إعلامي كامل منتَج بأدوات الذكاء الاصطناعي.',
    hours:'8 ساعات', note:null,
  },
  {
    n:'10', phase:3, standalone:false, optional:true,
    title:'القيادة الإعلامية',
    sub:'مرحلة القيادة — الإدارة والاستراتيجية',
    chips:['إدارة المؤسسات الإعلامية','التخطيط الإعلامي','إدارة فرق العمل','بناء الهوية الإعلامية','إدارة المشاريع الإعلامية'],
    project:'خطة إعلامية متكاملة لمؤسسة أو مشروع.',
    hours:'10 ساعات', note:null,
  },
] as const;

type StationType = typeof STATIONS[number];

const OUTCOMES = [
  { n:'01', title:'صوت ولغة وحضور مضبوطان', desc:'إلقاء نظيف، مخارج حروف صحيحة، لغة عربية سليمة، وثقة حقيقية أمام الكاميرا.' },
  { n:'02', title:'تخصص مهني محدد', desc:'تتخرّج بعنوان واضح: مراسل، معدّ، صانع محتوى، أو متحدث رسمي — لا مجرد "مهتم بالإعلام".' },
  { n:'03', title:'محفظة أعمال احترافية', desc:'مشروع تخرّج بجودة العرض، ومخرجات تطبيقية موثَّقة من كل محطة على مدار المسار.' },
  { n:'04', title:'شهادة معتمدة من وجيز', desc:'شهادة المسار من كاسيت أكاديمي، معتمدة من تطبيق وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط.' },
];

const FAQS = [
  { q:'هل يمكن اختيار بعض المحطات فقط؟', a:'لا، ولذلك مقصود. المسار مصمَّم ليخرّج إعلامياً متكاملاً قادراً على الكتابة والتقديم والتغطية والإنتاج، لأن سوق الإعلام اليوم لا يطلب مهارة واحدة بمعزل عن سواها. إن كنتَ تبحث عن مهارة محددة، فالدورة المنفردة هي الخيار الأنسب.' },
  { q:'التعليق الصوتي ثلاث جلسات فقط — لماذا؟', a:'لأن هدفه هنا محدود: ضبط تنفّسك ومخارج حروفك ونبرتك تمهيداً للكاميرا والمايكروفون في بقية المحطات. أما إن كان هدفك أن تصبح معلّقاً صوتياً محترفاً، فذلك تخصص مستقل يستلزم دورة أعمق.' },
  { q:'أنا مبتدئ تماماً — هل المسار مناسب لي؟', a:'نعم، وهذا بالضبط ما بُني عليه المسار. المرحلة التأسيسية لا تفترض أي خبرة سابقة، وتبني معك الإلقاء والحضور والصوت من البداية قبل الدخول إلى التخصصات.' },
  { q:'ما الفرق بين محطة القيادة وباقي المحطات؟', a:'المحطات 01–09 تُعلّمك التنفيذ: التقديم، الكتابة، التغطية، والإنتاج. أما المحطة 10 فهي مستوى مختلف تُعلّمك الإدارة: مؤسسة، فريق، خطة، وهوية إعلامية.' },
  { q:'درستُ إحدى الدورات الثلاث سابقاً — هل تُحتسب لي؟', a:'نعم. إن أكملتَ دورة المذيع المحترف معنا، تُخصم قيمتها من سعر المسار ولن تُعيد دراستها، إذ هي نفسها المحطة 01. تواصل مع المستشارة التعليمية لمراجعة سجلك.' },
  { q:'من أيّ جهة معتمدة الشهادة؟', a:'الشهادة صادرة عن كاسيت أكاديمي ومعتمدة من تطبيق وجيز، أكبر مكتبة صوتية وبودكاست في الشرق الأوسط. وترافقها محفظة أعمال ومشروع تخرّج — وهما اللذان يُحدثان الفرق الفعلي مع أصحاب العمل.' },
  { q:'هل أستطيع الدراسة عبر الإنترنت من خارج الأردن؟', a:'نعم، عبر كاسيت لايف — جلسات مباشرة تفاعلية بنفس المنهج ونفس المدربين، مع تسجيلات للمراجعة. الفرق الوحيد أن التسجيل العملي يجري بمعداتك عوضاً عن استوديو كاسيت.' },
  { q:'هل الدفع آمن؟ وهل التقسيط متاح؟', a:'الدفع كله إلكتروني عبر بوابة دفع آمنة. والتقسيط متاح للمسار الكامل: تُسدَّد الدفعة الأولى لتثبيت المقعد، وتتوزّع الدفعات المتبقية على مراحل المسار.' },
];

const PHASE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'مرحلة التأسيس',   color: GLD },
  2: { label: 'مرحلة التخصص',   color: '#67e8f9' },
  3: { label: 'مرحلة القيادة',  color: '#a78bfa' },
};

const STUDENT_IMGS = [m1, m2, m3, m4, m5];

const STANDALONE_COURSES = [
  {
    n: '01',
    title: 'الدورة المكثفة: المذيع المحترف ومهارات الإعلام الرقمي',
    note: 'محطة 01 بالمسار',
    desc: 'تدريب متكامل على التقديم التلفزيوني والإذاعي، الحضور أمام الكاميرا، وأساسيات الإعلام الرقمي.',
    instructor: 'أ. رنا محمد العزام',
    duration: '16 ساعة · 8 جلسات',
    route: '/courses/presenter',
  },
  {
    n: '02',
    title: 'أساسيات التعليق والأداء الصوتي',
    note: 'نسخة موسَّعة من محطة 02',
    desc: 'منهج متكامل لبناء أداء صوتي احترافي من الصفر: مخارج الحروف، التنفس، ضبط النبرات، وبناء الملف الصوتي.',
    instructor: 'أ. يسار عبده · أ. عمر درابكة',
    duration: '16 ساعة · 8 جلسات',
    route: '/courses/voiceover',
  },
  {
    n: '03',
    title: 'تمكين اللغة العربية وفنون التحرير اللغوي',
    note: 'دورة مستقلة',
    desc: 'إتقان النحو والإملاء وأساليب التحرير الرقمي بأسلوب تطبيقي، مع حقيبة مرجعية رقمية شاملة.',
    instructor: 'أ. رنا محمد العزام',
    duration: '16 ساعة · 8 جلسات',
    route: '/courses/arabic-language',
  },
];

const CONSULTANTS = [
  {
    name: 'أ. يسار عبده',
    role: 'خبير الأداء الصوتي والتعليق',
    specialty: 'التعليق الصوتي · الأداء الصوتي · بناء الملف الصوتي',
    photo: instructorYasar,
  },
  {
    name: 'أ. رنا محمد العزام',
    role: 'إعلامية ومدربة أداء ومختصة تحرير لغوي',
    specialty: 'الإعلام التلفزيوني · التحرير اللغوي · المتحدث الرسمي',
    photo: instructorRana,
  },
  {
    name: 'أ. عمر درابكة',
    role: 'معلّق صوتي ومدرب أداء رقمي',
    specialty: 'التعليق الصوتي الرقمي · الإعلام التفاعلي · المحتوى الصوتي',
    photo: instructorOmar,
  },
];

/* ── Station card ────────────────────────────────────── */
function Station({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const phase = PHASE_LABELS[s.phase];
  return (
    <div
      role="button" tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: open ? `linear-gradient(180deg, ${GS}, ${CARD} 55%)` : CARD,
        border: `1px solid ${open ? GL : ('optional' in s && s.optional ? 'rgba(167,139,250,0.28)' : HAIR)}`,
        borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
        transition: 'border-color .25s, background .25s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 12,
          background: BG3, border: `1px solid ${open ? GL : HAIR}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 16, fontWeight: 700,
          color: 'optional' in s && s.optional ? '#a78bfa' : GLD,
        }}>{s.n}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {'standalone' in s && s.standalone && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                متاحة منفردةً
              </span>
            )}
            {'optional' in s && s.optional && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.4)', color: '#c4b5fd', padding: '2px 9px', borderRadius: 999 }}>
                القيادة
              </span>
            )}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUT }}>{s.sub}</div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: F, fontSize: 12, color: phase.color, fontWeight: 700 }}>{phase.label}</span>
          <ChevronDown size={16} color={GLD} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${HAIR}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {(s.chips as readonly string[]).map(chip => (
              <span key={chip} style={{
                fontFamily: F, fontSize: 12.5, color: LT,
                background: 'rgba(255,255,255,0.045)', border: `1px solid ${HAIR}`,
                padding: '5px 12px', borderRadius: 999,
              }}>{chip}</span>
            ))}
          </div>
          <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
            <span style={{ color: GLD, fontWeight: 700 }}>المشروع التطبيقي: </span>{s.project}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F, fontSize: 12, color: MUT }}>⏱ {s.hours}</span>
            {s.note && <span style={{ fontFamily: F, fontSize: 12, color: GLD }}>← {s.note}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── FAQ item ─────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: CARD, border: `1px solid ${open ? GL : HAIR}`,
      borderRadius: 14, overflow: 'hidden', marginBottom: 12, transition: 'border-color .25s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: OFF, textAlign: 'right' }}>{q}</span>
        <span style={{ color: GLD, fontSize: 22, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 22px', fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.85 }}>{a}</div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default function MasarElamiPage() {
  const [, navigate]         = useLocation();
  const [openIdx, setOpenIdx]   = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function handleExpandAll() { setExpandAll(v => !v); setOpenIdx(null); }
  function isOpen(i: number) { return expandAll || openIdx === i; }

  return (
    <div dir="rtl" style={{ fontFamily: F, background: BG, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* spinning circle animation */}
      <style>{`
        @keyframes kaseetSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ka-spin-ring { animation: kaseetSpin 18s linear infinite; transform-origin: 200px 200px; }
        .ka-spin-slow { animation: kaseetSpin 32s linear infinite reverse; transform-origin: 200px 200px; }
        @media (max-width: 768px) {
          .masar-hero-grid { grid-template-columns: 1fr !important; }
          .masar-hero-visual { max-width: 280px !important; order: -1; margin: 0 auto 32px; }
          .masar-standalone-grid { grid-template-columns: 1fr !important; }
          .masar-study-grid { grid-template-columns: 1fr !important; }
          .masar-consult-grid { grid-template-columns: 1fr !important; }
          .masar-enroll-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── back nav ─────────────────────────────────── */}
      <div style={{ ...INNER, paddingTop: 24, paddingBottom: 0 }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 14, color: MUT, padding: 0 }}>
          <ArrowLeft size={14} /> الرئيسية
        </button>
      </div>

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ padding: '52px 0 88px' }}>
        <div style={{ ...INNER }}>
          <div className="masar-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,0.85fr)', gap: 56, alignItems: 'center' }}>

            {/* text column */}
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,0.2)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206', display: 'block' }} />
                مسار متكامل · 10 محطات
              </span>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(40px,6vw,68px)', lineHeight: 1.2, letterSpacing: -1.4, margin: '22px 0 0', color: OFF }}>
                المسار <span style={{ color: GLD }}>الإعلامي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 18, color: MUT, maxWidth: 580, marginTop: 18, lineHeight: 1.75 }}>
                منهج واحد متكامل من 10 محطات: يبدأ بالتقديم والحضور أمام الكاميرا، ويمرّ بكل تخصص إعلامي —
                صحافة، ميدان، محتوى، بودكاست، متحدث رسمي، وإنتاج — وكل محطة تُسلَّم فيها مشروع تطبيقي.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
                {[
                  ['10',   'محطات تدريبية متسلسلة'],
                  ['40',   'ساعة تدريبية موزَّعة'],
                  ['8',    'مشاريع تطبيقية تُسلَّم'],
                  [null,   'حضوري في عمّان أو Online LIVE'],
                ].map(([b, txt], i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    background: 'rgba(255,255,255,0.035)', border: `1px solid ${HAIR}`,
                    padding: '9px 15px', borderRadius: 10, fontFamily: F, fontSize: 13.5, color: LT,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                    {b && <b style={{ color: OFF, fontWeight: 700 }}>{b}</b>} {txt}
                  </span>
                ))}
              </div>

              {/* Wajeez chip */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 13, marginTop: 26,
                background: 'rgba(30,122,133,0.14)', border: '1px solid rgba(30,122,133,0.45)',
                borderRadius: 14, padding: '11px 16px',
              }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: OFF }}>الشهادة معتمدة من تطبيق وجيز</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                  تواصل مع المستشارة — مجاناً <ArrowLeft size={15} />
                </a>
                <a href="#tree"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none' }}>
                  استكشف شجرة المسار <ArrowLeft size={15} />
                </a>
              </div>
            </div>

            {/* SVG spinning circle */}
            <div className="masar-hero-visual" style={{ position: 'relative', aspectRatio: '1', maxWidth: 400, width: '100%', marginInline: 'auto' }}>
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
                {/* static outer rings */}
                <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,255,255,0.06)" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.05)" />
                {/* spinning arc group */}
                <g className="ka-spin-ring">
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="300 1056" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.42)" strokeWidth="3" strokeLinecap="round" strokeDasharray="380 1056" strokeDashoffset="-330" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="3" strokeLinecap="round" strokeDasharray="150 1056" strokeDashoffset="-740" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(30,122,133,0.95)" strokeWidth="3" strokeLinecap="round" strokeDasharray="120 1056" strokeDashoffset="-910" transform="rotate(-90 200 200)" />
                  {/* dots */}
                  <circle cx="200" cy="32"  r="6" fill="#FFC107" />
                  <circle cx="352" cy="268" r="6" fill="#FFC107" />
                  <circle cx="66"  cy="286" r="6" fill="#1E7A85" />
                </g>
                {/* slow counter-spin outer ring */}
                <g className="ka-spin-slow">
                  <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,193,7,0.08)" strokeWidth="1" strokeDasharray="12 20" />
                </g>
              </svg>
              {/* center content */}
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: FP, fontSize: 68, fontWeight: 700, color: OFF, lineHeight: 1 }}>10</div>
                <div style={{ fontFamily: F, fontSize: 16, color: MUT, marginTop: 4 }}>محطات</div>
                <div style={{ width: 40, height: 1, background: 'rgba(255,193,7,0.40)', margin: '10px auto' }} />
                <div style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,193,7,0.70)', letterSpacing: 0.5 }}>تأسيس ← تخصصات ← قيادة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ COVER IMAGE ════════════════ */}
      <div style={{ position: 'relative', height: 'clamp(260px,36vw,480px)', overflow: 'hidden' }}>
        <img src={coverElami} alt="المسار الإعلامي" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(22,30,43,0.55) 0%, rgba(22,30,43,0.20) 40%, rgba(22,30,43,0.55) 100%)' }} />
        {/* student avatars */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, justifyContent: 'center' }}>
          {STUDENT_IMGS.map((img, i) => (
            <div key={i} style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: `2.5px solid ${GLD}`, flexShrink: 0, boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <img src={img} alt={`متدرب ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════ TREE ════════════════ */}
      <section id="tree" style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>شجرة المسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              10 محطات من أول يوم <span style={{ color: GLD }}>حتى الشهادة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 640, marginInline: 'auto', marginTop: 14, lineHeight: 1.75 }}>
              كل محطة إلزامية ومرتَّبة بتسلسل مدروس — كل واحدة تُبنى على التي قبلها. اضغط على أي محطة لاستعراض محاورها ومشروعها.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 880, marginInline: 'auto', marginBottom: 18 }}>
            <button onClick={handleExpandAll} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIR}`,
              color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700,
              padding: '9px 18px', borderRadius: 999, cursor: 'pointer',
            }}>
              {expandAll ? 'طيّ جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          <div style={{ maxWidth: 880, marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATIONS.map((s, i) => {
              const prevPhase = i > 0 ? STATIONS[i-1].phase : null;
              const showBand  = s.phase !== prevPhase;
              return (
                <div key={s.n}>
                  {showBand && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: i === 0 ? '0 0 12px' : '20px 0 12px' }}>
                      <div style={{ flex: 1, height: 1, background: HAIR }} />
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: PHASE_LABELS[s.phase].color, letterSpacing: '.4px', whiteSpace: 'nowrap', padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}` }}>
                        {PHASE_LABELS[s.phase].label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: HAIR }} />
                    </div>
                  )}
                  {!showBand && i > 0 && (
                    <div style={{ width: 2, height: 14, background: `linear-gradient(180deg, ${GL}, rgba(255,193,7,0.5))`, margin: '4px auto', borderRadius: 2 }} />
                  )}
                  <Station s={s} open={isOpen(i)} onToggle={() => toggle(i)} />
                </div>
              );
            })}

            <div style={{ width: 2, height: 24, background: `linear-gradient(180deg, ${GL}, rgba(30,122,133,0.6))`, margin: '8px auto', borderRadius: 2 }} />

            <div style={{ border: '1px solid rgba(30,122,133,0.45)', borderRadius: 18, background: 'linear-gradient(180deg,rgba(30,122,133,0.16), rgba(29,39,56,0.8) 60%)', padding: '28px 26px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 60, height: 60, borderRadius: 13, background: '#fff', display: 'grid', placeContent: 'center', padding: 8, flexShrink: 0 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: OFF }}>شهادة كاسيت أكاديمي · معتمدة من تطبيق وجيز</h4>
                  <p style={{ fontFamily: F, fontSize: 14, color: MUT, marginTop: 4 }}>شهادة المسار الكاملة + محفظة أعمال + توصية مهنية</p>
                </div>
              </div>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 999, textDecoration: 'none' }}>
                التسجيل في المسار <ArrowLeft size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ OUTCOMES (cream) ════════════════ */}
      <section style={{ background: LBG, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid rgba(255,193,7,0.35)`, color: '#92600a', background: 'rgba(255,193,7,0.12)', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>مخرجات المسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: DH }}>
              ما الذي ستُحقّقه <span style={{ color: '#92600a' }}>بعد المسار؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: DM, maxWidth: 640, marginInline: 'auto', marginTop: 14 }}>
              مخرجات ملموسة تُقدّمها لأصحاب العمل والعملاء — لا مجرد شعور عام بالتحسّن.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 18 }}>
            {OUTCOMES.map(o => (
              <div key={o.n} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '28px 24px', boxShadow: '0 4px 18px rgba(0,0,0,0.06)' }}>
                <div style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: '#B8860B', letterSpacing: 1, marginBottom: 10 }}>{o.n}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: DH, marginBottom: 10, lineHeight: 1.55 }}>{o.title}</h4>
                <p style={{ fontFamily: F, fontSize: 14.5, color: DM, lineHeight: 1.75 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CONSULTANTS (cream) ════════════════ */}
      <section style={{ background: '#EEECEA', borderBlock: '1px solid rgba(0,0,0,0.08)', padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,193,7,0.35)', color: '#92600a', background: 'rgba(255,193,7,0.12)', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>الاستشارة الفردية</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: DH }}>
              جلسة استشارية <span style={{ color: '#92600a' }}>مع أحد مدربينا</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: DM, maxWidth: 620, marginInline: 'auto', marginTop: 14 }}>
              جلسة مخصَّصة لتقييم مستواك الحالي، تحديد مسارك الأنسب، ومراجعة ملفك الصوتي أو الإعلامي.
            </p>
          </div>

          <div className="masar-consult-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {CONSULTANTS.map(c => (
              <div key={c.name} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 18, padding: '32px 26px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,193,7,0.40)', margin: '0 auto 16px', flexShrink: 0 }}>
                  <img src={c.photo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: DH, marginBottom: 4 }}>{c.name}</div>
                <div style={{ fontFamily: F, fontSize: 13, color: DM, marginBottom: 12, lineHeight: 1.55 }}>{c.role}</div>
                <div style={{ fontFamily: F, fontSize: 12.5, color: '#92600a', background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: 8, padding: '6px 12px', marginBottom: 20, lineHeight: 1.6 }}>{c.specialty}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 32, color: DH, lineHeight: 1 }}>$70</span>
                  <span style={{ fontFamily: F, fontSize: 13, color: DM }}>/ جلسة</span>
                </div>
                <a href={WA_CONSULT(c.name)} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: NAVY, color: '#fff', fontFamily: F, fontWeight: 700, fontSize: 14, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', marginTop: 'auto' }}>
                  احجز جلستك <ArrowLeft size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ STUDY MODES (dark) ════════════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>أسلوب الدراسة</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              اختر <span style={{ color: GLD }}>أسلوبك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, marginTop: 14 }}>نفس المنهج ونفس المدربين — الاختلاف الوحيد هو مكان الدراسة.</p>
          </div>
          <div className="masar-study-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[
              {
                tag:'حضوري في عمّان', Icon:MapPin, title:'استوديو كاسيت',
                desc:'تدريب داخل استوديو مجهَّز صوتياً، مع كاميرا ومايكروفونات احترافية.',
                items:['تسجيل عملي بمعدات احترافية','مقاعد محدودة لكل مجموعة','تصحيح فوري ومباشر من المدرب','تشبيك مع المتدربين وفرص العمل'],
              },
              {
                tag:'مباشر تفاعلي (Online LIVE)', Icon:Wifi, title:'كاسيت لايف',
                desc:'جلسات مباشرة بالكامل — لا تسجيلات مسبقة ولا دراسة منفردة.',
                items:['جلسات مباشرة مع المدرب في الوقت الفعلي','تسجيلات الجلسات متاحة للمراجعة','تسليم واجبات وتقييم فردي','متاح من أي مكان في العالم العربي'],
              },
            ].map(({ tag, Icon, title, desc, items }) => (
              <div key={tag} style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 18, padding: '32px 30px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999, marginBottom: 18 }}>
                  <Icon size={14} /> {tag}
                </div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF, marginBottom: 10 }}>{title}</h4>
                <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginBottom: 18, lineHeight: 1.7 }}>{desc}</p>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                  {items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD, marginTop: 10, flexShrink: 0 }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ STANDALONE COURSES (cream) ════════════════ */}
      <section style={{ background: LBG, borderBlock: '1px solid rgba(0,0,0,0.08)', padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,193,7,0.35)', color: '#92600a', background: 'rgba(255,193,7,0.12)', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>الدورات المستقلة</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: DH }}>
              3 دورات <span style={{ color: '#92600a' }}>تشتريها منفردةً</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: DM, maxWidth: 640, marginInline: 'auto', marginTop: 14 }}>
              ابدأ بدورة واحدة، وقرّر لاحقاً ما إذا كنت تودّ الالتحاق بالمسار الكامل. قيمة أي دورة تُستقطع من سعر المسار.
            </p>
          </div>

          <div className="masar-standalone-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {STANDALONE_COURSES.map(c => (
              <div key={c.n} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 13, color: '#92600a', background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)', borderRadius: 999, padding: '4px 12px' }}>{c.n}</span>
                  <span style={{ fontFamily: F, fontSize: 12, color: DM, background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 999, padding: '4px 11px' }}>{c.note}</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: DH, lineHeight: 1.5, marginBottom: 10, flex: 0 }}>{c.title}</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.75, marginBottom: 16, flex: 1 }}>{c.desc}</p>
                <div style={{ fontFamily: F, fontSize: 13, color: '#92600a', marginBottom: 6 }}>
                  <b>المدرب:</b> {c.instructor}
                </div>
                <div style={{ fontFamily: F, fontSize: 13, color: DM, marginBottom: 20 }}>
                  <b>المدة:</b> {c.duration}
                </div>
                <Link href={c.route}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: NAVY, color: '#fff', fontFamily: F, fontWeight: 700, fontSize: 14, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', marginTop: 'auto' }}>
                  عرض التفاصيل والتسجيل <ArrowLeft size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, background: '#fff', border: '1px dashed rgba(255,193,7,0.50)', borderRadius: 14, padding: '20px 26px', display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.30)', display: 'grid', placeContent: 'center', color: '#92600a', fontWeight: 800, fontSize: 17 }}>؟</div>
            <p style={{ fontFamily: F, fontSize: 15.5, color: DM, lineHeight: 1.7 }}>
              <b style={{ color: DH }}>الفرق باختصار:</b> الدورة تمنحك مهارة، والمسار يمنحك مهنة.
              ابدأ بدورة إن أردت التجربة، والتحق بالمسار حين تقرّر أن الإعلام هو مستقبلك — عندها ستمرّ بجميع التخصصات دون استثناء.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ ENROLL (dark) ════════════════ */}
      <section id="enroll" style={{ padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${GL}`, color: GLD, background: GS, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>الالتحاق بالمسار</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              اختر <span style={{ color: GLD }}>خيار الالتحاق</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, marginTop: 14 }}>سر المسار الكامل، أو ابدأ بدورة تأسيسية وحدِّد مسارك لاحقاً.</p>
          </div>

          <div className="masar-enroll-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
            {/* track plan */}
            <div style={{ background: `linear-gradient(180deg, rgba(255,193,7,0.07), ${CARD} 40%)`, border: `1px solid ${GL}`, borderRadius: 18, padding: '36px 32px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <span style={{ position: 'absolute', top: 22, left: 26, fontFamily: F, fontSize: 11.5, fontWeight: 700, background: GLD, color: '#1A1206', padding: '5px 12px', borderRadius: 999 }}>الأشمل والأوفر</span>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: OFF, marginBottom: 10 }}>المسار الإعلامي الكامل</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.7 }}>10 محطات كاملة: التأسيس + كل التخصصات الإعلامية + القيادة الإعلامية.</p>

              {/* price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FP, fontSize: 44, fontWeight: 700, color: GLD, lineHeight: 1 }}>$1,000</span>
                <span style={{ fontFamily: F, fontSize: 15, color: MUT }}>للمسار الكامل</span>
              </div>

              {/* installment banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
                <Award size={16} color={GLD} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: OFF }}>التقسيط متاح</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>ادفع الدفعة الأولى لتثبيت مقعدك وقسِّط الباقي على مراحل المسار</div>
                </div>
              </div>

              <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 24 }}>40 ساعة موزَّعة · حضوري أو Online LIVE</p>

              <ul style={{ listStyle: 'none', display: 'grid', gap: 11, marginBottom: 28, flex: 1 }}>
                {['10 محطات متسلسلة · 3 مراحل','جميع التخصصات الإعلامية','8 محطات حصرية داخل المسار','8 مشاريع تطبيقية بإشراف مباشر','محطة القيادة الإعلامية','شهادة معتمدة من تطبيق وجيز','إمكانية خصم دورة درستها مسبقاً'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                    <span style={{ color: GLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '15px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                التسجيل في المسار <ArrowLeft size={15} />
              </a>
            </div>

            {/* single course plan */}
            <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 18, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: OFF, marginBottom: 10 }}>دورة منفردة</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.7 }}>ابدأ بدورة واحدة قبل الالتزام بالمسار الكامل.</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '26px 0 6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FP, fontSize: 40, fontWeight: 700, color: GLD, lineHeight: 1 }}>$150 – $250</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 24 }}>للدورة الواحدة · القيمة تُستقطع عند الالتحاق بالمسار</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 11, marginBottom: 28, flex: 1 }}>
                {['16 ساعة · 8 جلسات','مشروع تطبيقي واحد','شهادة إتمام الدورة','قيمتها تُستقطع عند الالتحاق بالمسار'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 14.5, color: LT, lineHeight: 1.7 }}>
                    <span style={{ color: GLD, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 999, cursor: 'pointer' }}>
                استعراض الدورات <ArrowLeft size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ (dark alt) ════════════════ */}
      <section style={{ background: BG2, borderBlock: `1px solid ${HAIR}`, padding: '88px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 13, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,0.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206', display: 'block' }} />
              أسئلة شائعة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', marginTop: 18, lineHeight: 1.35, color: OFF }}>
              قبل أن <span style={{ color: GLD }}>تسأل</span>
            </h2>
          </div>
          <div style={{ maxWidth: 840, marginInline: 'auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section style={{ padding: '20px 0 88px' }}>
        <div style={{ ...INNER }}>
          <div style={{ background: `linear-gradient(135deg, ${CARD}, ${BG3})`, border: `1px solid ${GL}`, borderRadius: 26, padding: '64px 48px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4vw,42px)', lineHeight: 1.4, letterSpacing: -.6, color: OFF }}>
              الإعلامي لا يُبنى بدورة واحدة — <span style={{ color: GLD }}>يُبنى بمسار متكامل</span>
            </h2>
            <p style={{ fontFamily: F, color: MUT, fontSize: 16.5, margin: '16px auto 32px', maxWidth: 560, lineHeight: 1.75 }}>
              مقاعد كل مجموعة محدودة للحفاظ على جودة التصحيح الفردي. ابدأ بالاستشارة المجانية وقرّر بعدها.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,0.22)' }}>
                تواصل مع المستشارة — مجاناً <ArrowLeft size={15} />
              </a>
              <a href="#tree"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15.5, padding: '15px 30px', borderRadius: 999, textDecoration: 'none' }}>
                استكشف شجرة المسار <ArrowLeft size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
