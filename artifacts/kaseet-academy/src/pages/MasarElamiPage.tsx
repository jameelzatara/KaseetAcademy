/**
 * صفحة المسار الإعلامي — كاسيت أكاديمي
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Layers, Clock, FolderCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { NAVY, GOLD, OFF, MUTED, F, FP, INNER, LBG, DH, DM, waLink } from './shared/coursePageHelpers';
import wajeezLogo     from '@assets/wajeez-logo_1785688262989.png';
import coverMasar     from '@assets/cover_المسار_الاعلامي_1785777356196.png';
import instructorRana from '@assets/trainer-rana-azzam_1785692178863.JPG';
import instructorRami from '@assets/رامي_ابو_جبارة_1785777158127.png';

/* ── design tokens ─────────────────────────────────────── */
const GLD  = GOLD;                           // #FFC107
const GS   = 'rgba(255,193,7,0.09)';
const GL   = 'rgba(255,193,7,0.26)';
const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const HAIR = 'rgba(255,255,255,0.07)';

// Section backgrounds — deliberate rhythm, never repeating adjacently
const S1 = '#0B1120';   // deep navy — Tree
const S2 = '#111827';   // slate — Study / FAQ
const S3 = '#080D17';   // near-black — Trainers
const S4 = '#060A14';   // darkest — Enroll spotlight
const S5 = '#0D1627';   // mid-navy — Advisor

const CARD = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const WA_PHONE  = '962700000000';
const WA_TRACK  = waLink(WA_PHONE, 'مرحباً، أودّ الاستفسار عن المسار الإعلامي');
const WA_CONSULT = waLink(WA_PHONE, 'مرحباً، أودّ حجز استشارة تعليمية مجانية');

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
  1: { label: 'مرحلة التأسيس', color: GLD },
  2: { label: 'مرحلة التخصص', color: '#67e8f9' },
  3: { label: 'مرحلة القيادة', color: '#a78bfa' },
};

/* ── Station accordion ───────────────────────────────── */
function Station({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const phase = PHASE_LABELS[s.phase];
  return (
    <div
      role="button" tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: open ? `linear-gradient(160deg, ${GS}, rgba(255,255,255,0.025) 60%)` : CARD,
        border: `1px solid ${open ? GL : ('optional' in s && s.optional ? 'rgba(167,139,250,0.22)' : CARD_BORDER)}`,
        borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${open ? GL : CARD_BORDER}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 15, fontWeight: 700,
          color: 'optional' in s && s.optional ? '#a78bfa' : GLD,
        }}>{s.n}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {'standalone' in s && s.standalone && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                متاحة منفردةً
              </span>
            )}
            {'optional' in s && s.optional && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.35)', color: '#c4b5fd', padding: '2px 9px', borderRadius: 999 }}>
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
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${CARD_BORDER}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {(s.chips as readonly string[]).map(chip => (
              <span key={chip} style={{
                fontFamily: F, fontSize: 12.5, color: LT,
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${CARD_BORDER}`,
                padding: '5px 12px', borderRadius: 999,
              }}>{chip}</span>
            ))}
          </div>
          <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.75 }}>
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
      background: CARD, border: `1px solid ${open ? GL : CARD_BORDER}`,
      borderRadius: 14, overflow: 'hidden', marginBottom: 10, transition: 'border-color .2s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: F, fontSize: 15.5, fontWeight: 700, color: OFF, textAlign: 'right' }}>{q}</span>
        <span style={{ color: GLD, fontSize: 22, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 22px 20px', fontFamily: F, fontSize: 14.5, color: MUT, lineHeight: 1.85 }}>{a}</div>
      )}
    </div>
  );
}

/* ── Study accordion ─────────────────────────────────── */
function StudyAccordion({
  variant, label, sub, badges, items,
}: {
  variant: 'inperson' | 'online';
  label: string; sub: string;
  badges: string[];
  items: { title: string; desc: string }[];
}) {
  const [open, setOpen] = useState(false);
  const isIP   = variant === 'inperson';
  const accent = isIP ? GLD : '#67e8f9';
  const bgOpen = isIP ? 'rgba(255,193,7,0.05)' : 'rgba(103,232,249,0.04)';
  const bdOpen = isIP ? 'rgba(255,193,7,0.40)'  : 'rgba(103,232,249,0.35)';
  const iconBg = isIP ? 'rgba(255,193,7,0.12)'  : 'rgba(103,232,249,0.12)';

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden', marginBottom: 10,
      border: `1px solid ${open ? bdOpen : CARD_BORDER}`,
      transition: 'border-color 0.2s',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', background: open ? bgOpen : CARD, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '17px 20px', cursor: 'pointer', textAlign: 'right', gap: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: open ? accent : iconBg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            {isIP
              ? <MapPin size={16} color={open ? '#060A14' : accent} strokeWidth={2.2} />
              : <Wifi   size={16} color={open ? '#060A14' : accent} strokeWidth={2.2} />}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>{label}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>{sub}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {badges.map(b => (
            <span key={b} style={{ fontFamily: F, fontSize: 11, color: MUT, background: 'rgba(255,255,255,0.04)', border: `1px solid ${CARD_BORDER}`, borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>{b}</span>
          ))}
          <ChevronDown size={15} color={open ? accent : MUT} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }} />
        </div>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${open ? bdOpen : CARD_BORDER}` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 20px', borderBottom: i < items.length - 1 ? `1px solid ${CARD_BORDER}` : 'none' }}>
              <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 11, color: '#060A14', background: accent, borderRadius: '50%', flexShrink: 0, width: 26, height: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.75 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Section label pill ──────────────────────────────── */
function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      fontFamily: F, fontSize: 12.5, fontWeight: 700,
      color: light ? '#92600a' : GLD,
      background: light ? 'rgba(255,193,7,0.12)' : GS,
      border: `1px solid ${light ? 'rgba(255,193,7,0.30)' : GL}`,
      padding: '5px 14px', borderRadius: 999,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: light ? '#92600a' : GLD, display: 'block' }} />
      {text}
    </span>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default function MasarElamiPage() {
  const [, navigate]          = useLocation();
  const [openIdx, setOpenIdx]   = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function handleExpandAll()  { setExpandAll(v => !v); setOpenIdx(null); }
  function isOpen(i: number)  { return expandAll || openIdx === i; }

  return (
    <div dir="rtl" style={{ fontFamily: F, background: '#0B1120', color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        @keyframes kaseetSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes kaPulse    { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.8); } }
        .ka-spin-ring { animation: kaseetSpin 18s linear infinite; transform-origin: 200px 200px; }
        .ka-spin-slow { animation: kaseetSpin 32s linear infinite reverse; transform-origin: 200px 200px; }
        .ka-pulse-dot { animation: kaPulse 2s ease-in-out infinite; }
        @media (max-width: 768px) {
          .masar-hero-grid    { grid-template-columns: 1fr !important; }
          .masar-hero-visual  { max-width: 260px !important; order: -1; margin: 0 auto 28px; }
          .masar-study-grid   { grid-template-columns: 1fr !important; }
          .masar-trainer-card { grid-template-columns: 1fr !important; }
          .masar-trainer-photo{ min-height: 220px !important; }
          .masar-advisor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── back nav ─────────────────────────────────── */}
      <div style={{ ...INNER, paddingTop: 20, paddingBottom: 0 }}>
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 13.5, color: MUT, padding: 0 }}>
          <ArrowLeft size={13} /> الرئيسية
        </button>
      </div>

      {/* ════════════════ 1. HERO ════════════════════════ */}
      <section style={{ position: 'relative', padding: '52px 0 88px', overflow: 'hidden' }}>
        <img src={coverMasar} alt="" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.52) 40%, rgba(2,6,23,0.92) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, ...INNER }}>
          <div className="masar-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,0.85fr)', gap: 56, alignItems: 'center' }}>

            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,193,7,0.10)', border: '1px solid rgba(255,193,7,0.28)',
                color: GLD, fontFamily: F, fontSize: 13, fontWeight: 700,
                padding: '7px 16px', borderRadius: 999,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD }} />
                مسار متكامل · 10 محطات
              </span>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(36px,5.5vw,64px)', lineHeight: 1.2, letterSpacing: -1.2, margin: '18px 0 0', color: OFF }}>
                المسار <span style={{ color: GLD }}>الإعلامي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 'clamp(14px,1.2vw,16.5px)', color: MUT, maxWidth: 540, marginTop: 16, lineHeight: 1.85 }}>
                منهج واحد متكامل من 10 محطات: يبدأ بالتقديم والحضور أمام الكاميرا، ويمرّ بكل تخصص إعلامي —
                صحافة، ميدان، محتوى، بودكاست، متحدث رسمي، وإنتاج — وكل محطة تُسلَّم فيها مشروع تطبيقي.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginTop: 24, maxWidth: 500 }}>
                {([
                  { Icon: Layers,      num: '10', label: 'محطات تدريبية متسلسلة' },
                  { Icon: Clock,       num: '40', label: 'ساعة تدريبية موزَّعة'  },
                  { Icon: FolderCheck, num: '8',  label: 'مشاريع تطبيقية تُسلَّم' },
                  { Icon: MapPin,      num: null, label: 'حضوري في عمّان أو Online LIVE' },
                ] as const).map(({ Icon, num, label }, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    background: 'rgba(2,6,23,0.60)', border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT,
                  }}>
                    <Icon size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                    {num && <b style={{ fontFamily: FP, color: OFF, fontWeight: 700 }}>{num}</b>}
                    {label}
                  </span>
                ))}
              </div>

              {/* Wajeez badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, marginTop: 18,
                background: 'rgba(2,6,23,0.75)', border: '1px solid rgba(255,193,7,0.18)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 14, padding: '12px 16px', maxWidth: 500,
              }}>
                <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 8, background: '#fff', display: 'grid', placeContent: 'center', padding: 4 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: OFF }}>الشهادة معتمدة من تطبيق وجيز</div>
                  <div style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 22 }}>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 14.5, padding: '13px 26px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 6px 20px rgba(255,193,7,0.22)' }}>
                  تواصل مع المستشارة — مجاناً <ArrowLeft size={14} />
                </a>
                <a href="#tree"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: OFF, fontFamily: F, fontWeight: 700, fontSize: 14.5, padding: '13px 26px', borderRadius: 12, textDecoration: 'none' }}>
                  استكشف شجرة المسار <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* SVG spinning circle */}
            <div className="masar-hero-visual" style={{ position: 'relative', aspectRatio: '1', maxWidth: 400, width: '100%', marginInline: 'auto' }}>
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
                <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,255,255,0.05)" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.04)" />
                <g className="ka-spin-ring">
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="300 1056" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,0.40)" strokeWidth="3" strokeLinecap="round" strokeDasharray="380 1056" strokeDashoffset="-330" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" strokeDasharray="150 1056" strokeDashoffset="-740" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(30,122,133,0.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="120 1056" strokeDashoffset="-910" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="32"  r="6" fill={GLD} />
                  <circle cx="352" cy="268" r="6" fill={GLD} />
                  <circle cx="66"  cy="286" r="6" fill="#1E7A85" />
                </g>
                <g className="ka-spin-slow">
                  <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,193,7,0.06)" strokeWidth="1" strokeDasharray="12 20" />
                </g>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: FP, fontSize: 68, fontWeight: 700, color: OFF, lineHeight: 1 }}>10</div>
                <div style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 4 }}>محطات</div>
                <div style={{ width: 36, height: 1, background: 'rgba(255,193,7,0.35)', margin: '10px auto' }} />
                <div style={{ fontFamily: F, fontSize: 11.5, color: 'rgba(255,193,7,0.65)' }}>تأسيس ← تخصصات ← قيادة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 2. TREE ════════════════════════ */}
      <section id="tree" style={{ background: S1, borderTop: `1px solid ${CARD_BORDER}`, padding: '80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="شجرة المسار" />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', marginTop: 16, lineHeight: 1.35, color: OFF }}>
              10 محطات من أول يوم <span style={{ color: GLD }}>حتى الشهادة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, maxWidth: 580, marginInline: 'auto', marginTop: 12, lineHeight: 1.8 }}>
              كل محطة إلزامية ومرتَّبة بتسلسل مدروس. اضغط على أي محطة لاستعراض محاورها ومشروعها.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 860, marginInline: 'auto', marginBottom: 16 }}>
            <button onClick={handleExpandAll} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${CARD_BORDER}`,
              color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700,
              padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
            }}>
              {expandAll ? 'طيّ جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          <div style={{ maxWidth: 860, marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STATIONS.map((s, i) => {
              const prevPhase = i > 0 ? STATIONS[i-1].phase : null;
              const showBand  = s.phase !== prevPhase;
              return (
                <div key={s.n}>
                  {showBand && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: i === 0 ? '0 0 10px' : '18px 0 10px' }}>
                      <div style={{ flex: 1, height: 1, background: CARD_BORDER }} />
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: PHASE_LABELS[s.phase].color, padding: '3px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: `1px solid ${CARD_BORDER}` }}>
                        {PHASE_LABELS[s.phase].label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: CARD_BORDER }} />
                    </div>
                  )}
                  {!showBand && i > 0 && (
                    <div style={{ width: 2, height: 12, background: `linear-gradient(180deg, ${GL}, rgba(255,193,7,0.4))`, margin: '3px auto', borderRadius: 2 }} />
                  )}
                  <Station s={s} open={isOpen(i)} onToggle={() => toggle(i)} />
                </div>
              );
            })}

            <div style={{ width: 2, height: 20, background: `linear-gradient(180deg, ${GL}, rgba(30,122,133,0.5))`, margin: '6px auto', borderRadius: 2 }} />

            <div style={{ border: '1px solid rgba(30,122,133,0.40)', borderRadius: 16, background: 'linear-gradient(160deg,rgba(30,122,133,0.14), rgba(11,17,32,0.8) 60%)', padding: '26px 24px', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 54, height: 54, borderRadius: 12, background: '#fff', display: 'grid', placeContent: 'center', padding: 7, flexShrink: 0 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF }}>شهادة كاسيت أكاديمي · معتمدة من تطبيق وجيز</h4>
                  <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 3 }}>شهادة المسار الكاملة + محفظة أعمال + توصية مهنية</p>
                </div>
              </div>
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 700, fontSize: 13.5, padding: '11px 22px', borderRadius: 12, textDecoration: 'none' }}>
                التسجيل في المسار <ArrowLeft size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 3. STUDY MODES ═════════════════ */}
      <section style={{ background: S2, borderTop: `1px solid ${CARD_BORDER}`, padding: '80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <SectionLabel text="أسلوب الدراسة" />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', marginTop: 16, lineHeight: 1.35, color: OFF }}>
              اختر <span style={{ color: GLD }}>أسلوب تعلّمك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, marginTop: 12, maxWidth: 520, marginInline: 'auto', lineHeight: 1.8 }}>
              نفس المنهج ونفس المدربين والشهادة المعتمدة — فقط اختر ما يناسب جدولك وحياتك
            </p>
          </div>

          {/* comparison grid */}
          <div className="masar-study-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 14, marginBottom: 14, maxWidth: 820, marginInline: 'auto' }}>

            <div style={{ background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.22)', borderRadius: 16, padding: '22px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,193,7,0.14)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={17} color={GLD} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: GLD }}>حضوري — استوديو كاسيت</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>حضور فعلي في عمّان</div>
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['تفاعل مباشر مع المدرب والزملاء','تطبيق عملي داخل الاستوديوهات المجهَّزة','بيئة تعلم منظَّمة بلا إلهاء','تشبيك مع المتدربين وفرص العمل'].map(pt => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: LT }}>
                    <CheckCircle2 size={13} color={GLD} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} /> {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'rgba(103,232,249,0.04)', border: '1px solid rgba(103,232,249,0.20)', borderRadius: 16, padding: '22px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(103,232,249,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Wifi size={17} color="#67e8f9" strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14.5, color: '#67e8f9' }}>كاسيت لايف — Online LIVE</div>
                  <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>من أي مكان في العالم العربي</div>
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['جلسات مباشرة مع المدرب في الوقت الفعلي','تسجيلات الجلسات متاحة للمراجعة','تسليم واجبات وتقييم فردي','متاح من أي مكان في العالم العربي'].map(pt => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: F, fontSize: 13, color: LT }}>
                    <CheckCircle2 size={13} color="#67e8f9" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ maxWidth: 820, marginInline: 'auto' }}>
            <StudyAccordion variant="inperson" label="حضوري — داخل استوديو كاسيت" sub="تدريب ميداني مع معدات احترافية وتصحيح فوري" badges={['10 محطات','40 ساعة']}
              items={[
                { title:'تطبيق عملي أمام الكاميرا',   desc:'كل محطة تنتهي بمشروع مصوَّر أو مسجَّل يُسلَّم ويُقيَّم من لجنة المدربين.' },
                { title:'استوديو مجهَّز احترافياً',     desc:'كاميرات، إضاءة، وأجهزة تسجيل صوتي متاحة طوال فترة التدريب.' },
                { title:'مجموعات صغيرة — تصحيح فردي',  desc:'لا يتجاوز عدد المجموعة 12 متدرباً لضمان اهتمام المدرب بكل متدرب.' },
                { title:'تشبيك مهني مع الزملاء',        desc:'بيئة تعلم جماعية تفتح أبواب الفرص المهنية والتعاون بين المتدربين.' },
              ]}
            />
            <StudyAccordion variant="online" label="Online LIVE — بث مباشر تفاعلي" sub="من أي مكان في العالم العربي — بث حي لا تسجيلات مسبقة" badges={['10 محطات','40 ساعة','بث مباشر']}
              items={[
                { title:'جلسات حية مع المدرب',         desc:'كل محطة تُقدَّم مباشرةً في الوقت الفعلي — لا محاضرات مسجَّلة مسبقاً.' },
                { title:'تسجيلات للمراجعة',             desc:'تسجيلات الجلسات محفوظة ومتاحة للمشتركين لمراجعتها في أي وقت.' },
                { title:'تسليم مشاريع وتقييم فردي',     desc:'نفس آلية التسليم والتقييم المطبَّقة في الحضوري — لا تنازل عن المعايير.' },
                { title:'متاح من أي مكان',              desc:'الأردن، السعودية، الإمارات، مصر، أو أي مكان آخر — بشرط اتصال جيد.' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ════════════════ 4. OUTCOMES (cream) ═══════════ */}
      <section style={{ background: LBG, borderTop: '1px solid rgba(0,0,0,0.06)', padding: '80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="مخرجات المسار" light />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', marginTop: 16, lineHeight: 1.35, color: DH }}>
              ما الذي ستُحقّقه <span style={{ color: '#92600a' }}>بعد المسار؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: DM, maxWidth: 580, marginInline: 'auto', marginTop: 12 }}>
              مخرجات ملموسة تُقدّمها لأصحاب العمل والعملاء — لا مجرد شعور عام بالتحسّن.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
            {OUTCOMES.map(o => (
              <div key={o.n} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16, padding: '26px 22px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily: FP, fontSize: 12, fontWeight: 700, color: '#B8860B', letterSpacing: 1, marginBottom: 10 }}>{o.n}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: DH, marginBottom: 10, lineHeight: 1.5 }}>{o.title}</h4>
                <p style={{ fontFamily: F, fontSize: 14, color: DM, lineHeight: 1.8 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ 5. TRAINERS ════════════════════ */}
      <section style={{ background: S3, borderTop: `1px solid ${CARD_BORDER}`, padding: '80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <SectionLabel text="خبراء المسار الإعلامي" />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', marginTop: 16, lineHeight: 1.35, color: OFF }}>
              مَن <span style={{ color: GLD }}>يُرشدك</span> في هذا المسار
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, maxWidth: 540, marginInline: 'auto', marginTop: 12 }}>
              خبراء إعلاميون بمسيرات مهنية حقيقية — يُرشدونك ويُقيّمونك على مدار المسار.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900, marginInline: 'auto' }}>

            {/* Rami */}
            <div className="masar-trainer-card" style={{
              background: `linear-gradient(135deg, rgba(255,193,7,0.04), rgba(255,255,255,0.025) 60%)`,
              border: `1px solid ${GL}`, borderRadius: 22, overflow: 'hidden',
              display: 'grid', gridTemplateColumns: 'minmax(0,290px) 1fr',
            }}>
              <div className="masar-trainer-photo" style={{ position: 'relative', minHeight: 340, background: '#050810', overflow: 'hidden' }}>
                <img src={instructorRami} alt="رامي أبو جبارة"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(8,13,23,0.85) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: 10, padding: '7px 13px' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#fff', display: 'grid', placeContent: 'center', flexShrink: 0, padding: 3 }}>
                    <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: GLD, lineHeight: 1.35 }}>الشريك المؤسس<br/>لتطبيق وجيز</span>
                </div>
              </div>
              <div style={{ padding: '32px 32px 28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '4px 13px', marginBottom: 12, alignSelf: 'flex-start' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: GLD }} />
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GLD }}>مدرّب برنامج الإعلامي الشامل</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,28px)', color: OFF, margin: '0 0 8px' }}>رامي أبو جبارة</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85, marginBottom: 20 }}>
                  خبرة تمتد لـ <b style={{ color: LT, fontFamily: FP }}>17</b> عاماً في الصحافة التلفزيونية والقيادة التحريرية؛ تنقّل خلالها بين كبرى المؤسسات الإعلامية مثل <b style={{ color: LT }}>Sky News عربية</b>، وصولاً إلى رئاسة تحرير <b style={{ color: LT }}>«الشرق مع Bloomberg»</b>.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
                  {['الصحافة التلفزيونية','القيادة التحريرية','Sky News عربية','الشرق مع Bloomberg'].map(t => (
                    <span key={t} style={{ fontFamily: F, fontSize: 12, color: GLD, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '4px 12px' }}>{t}</span>
                  ))}
                </div>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', background: GLD, color: NAVY, fontFamily: F, fontWeight: 800, fontSize: 13.5, padding: '11px 22px', borderRadius: 11, textDecoration: 'none' }}>
                  تواصل للاستفسار <ArrowLeft size={13} />
                </a>
              </div>
            </div>

            {/* Rana */}
            <div className="masar-trainer-card" style={{
              background: `linear-gradient(135deg, rgba(103,232,249,0.04), rgba(255,255,255,0.020) 60%)`,
              border: '1px solid rgba(103,232,249,0.20)', borderRadius: 22, overflow: 'hidden',
              display: 'grid', gridTemplateColumns: 'minmax(0,290px) 1fr',
            }}>
              <div className="masar-trainer-photo" style={{ position: 'relative', minHeight: 300, background: '#050810', overflow: 'hidden' }}>
                <img src={instructorRana} alt="أ. رنا محمد العزام"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(8,13,23,0.85) 0%, transparent 55%)' }} />
              </div>
              <div style={{ padding: '32px 32px 28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(103,232,249,0.07)', border: '1px solid rgba(103,232,249,0.22)', borderRadius: 999, padding: '4px 13px', marginBottom: 12, alignSelf: 'flex-start' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#67e8f9' }} />
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: '#67e8f9' }}>مدرّبة الأداء والتحرير اللغوي</span>
                </div>
                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 'clamp(20px,2.2vw,28px)', color: OFF, margin: '0 0 8px' }}>أ. رنا محمد العزام</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85, marginBottom: 20 }}>
                  إعلامية ومدربة أداء متخصصة في <b style={{ color: LT }}>التقديم التلفزيوني</b> والتحرير اللغوي وتأهيل المتحدث الرسمي — تُدرّس محطتَي التأسيس في المسار.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
                  {['الإعلام التلفزيوني','التحرير اللغوي','المتحدث الرسمي','الحضور الإعلامي'].map(t => (
                    <span key={t} style={{ fontFamily: F, fontSize: 12, color: '#67e8f9', background: 'rgba(103,232,249,0.07)', border: '1px solid rgba(103,232,249,0.20)', borderRadius: 999, padding: '4px 12px' }}>{t}</span>
                  ))}
                </div>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', background: 'rgba(103,232,249,0.10)', border: '1px solid rgba(103,232,249,0.30)', color: '#67e8f9', fontFamily: F, fontWeight: 800, fontSize: 13.5, padding: '11px 22px', borderRadius: 11, textDecoration: 'none' }}>
                  تواصل للاستفسار <ArrowLeft size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════ 6. ENROLL ══════════════════════ */}
      <section id="enroll" style={{ position: 'relative', background: S4, borderTop: `1px solid ${CARD_BORDER}`, padding: '80px 0', overflow: 'hidden' }}>
        {/* glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 560, height: 360, background: 'rgba(255,193,7,0.07)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, ...INNER }}>
          <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 44px' }}>
            <SectionLabel text="الالتحاق بالمسار" />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', color: OFF, marginTop: 16, lineHeight: 1.3 }}>
              اختر <span style={{ color: GLD }}>خيار الالتحاق</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 10, lineHeight: 1.8 }}>
              التحق بالمسار الكامل وتحوّل إلى إعلامي محترف — أو ابدأ بدورة منفردة واكتشف الأسلوب المناسب لك.
            </p>
          </div>

          {/* centered card */}
          <div style={{ maxWidth: 620, margin: '0 auto', position: 'relative' }}>
            {/* subtle ring glow */}
            <div style={{ position: 'absolute', inset: -2, background: `linear-gradient(135deg, rgba(255,193,7,0.18), rgba(103,232,249,0.08))`, borderRadius: 28, filter: 'blur(18px)', opacity: 0.6, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', background: 'rgba(11,17,32,0.92)', border: `1px solid ${GL}`, borderRadius: 24, padding: 'clamp(26px,4vw,40px)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>

              {/* floating badge */}
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 12, padding: '5px 18px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(255,193,7,0.28)' }}>
                الأشمل والأوفر
              </div>

              {/* price block */}
              <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: `1px solid ${CARD_BORDER}` }}>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF }}>المسار الإعلامي الكامل</h3>
                <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6, lineHeight: 1.65 }}>
                  10 محطات · التأسيس + التخصصات + القيادة الإعلامية
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, margin: '20px 0 0' }}>
                  <span style={{ fontFamily: FP, fontSize: 54, fontWeight: 900, color: GLD, lineHeight: 1 }}>$1,000</span>
                  <span style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 7 }}>للمسار الكامل</span>
                </div>

                {/* installment chip */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '9px 15px' }}>
                  <span className="ka-pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontSize: 13, color: LT }}>
                    التقسيط متاح · الدفعة الأولى <b style={{ color: GLD, fontFamily: FP }}>$250</b> لتثبيت مقعدك
                  </span>
                </div>

                <p style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 10 }}>40 ساعة موزَّعة · حضوري أو Online LIVE</p>
              </div>

              {/* features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13, padding: '24px 0', margin: 0 }}>
                {[
                  '10 محطات متسلسلة — 3 مراحل كاملة',
                  'تغطية جميع التخصصات الإعلامية',
                  '8 محطات حصريّة داخل المسار',
                  '8 مشاريع تطبيقية مصوَّرة بإشراف مباشر',
                  'محطة القيادة الإعلامية وتأهيل البروفايل',
                  'شهادة معتمدة من تطبيق وجيز',
                  'إمكانية خصم قيمة أي دورة درستها سابقاً',
                ].map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.65 }}>
                    <span style={{ color: GLD, fontWeight: 800, flexShrink: 0 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 6px 22px rgba(255,193,7,0.20)' }}>
                التسجيل في المسار <ArrowLeft size={15} />
              </a>
            </div>
          </div>

          {/* down-sell */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ fontFamily: F, fontSize: 13.5, color: MUT }}>
              تريد البدء بدورة واحدة قبل الالتزام بالمسار الكامل؟{' '}
              <a href="/" style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 700 }}>
                استعرض الدورات المنفردة ←
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════ 7. ADVISOR CARD ════════════════ */}
      <section style={{ background: S5, borderTop: `1px solid ${CARD_BORDER}`, padding: '80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <SectionLabel text="الاستشارة التعليمية" />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,40px)', marginTop: 16, lineHeight: 1.35, color: OFF }}>
              غير متأكد؟ <span style={{ color: GLD }}>تحدّث مع مستشارتنا</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 10, maxWidth: 520, marginInline: 'auto', lineHeight: 1.8 }}>
              جلسة استشارية مجانية على واتساب — تساعدك تحدد إذا المسار هو الخيار الصح لك، وكيف تبدأ.
            </p>
          </div>

          {/* advisor card */}
          <div style={{ maxWidth: 720, marginInline: 'auto' }}>
            <div className="masar-advisor-grid" style={{
              display: 'grid', gridTemplateColumns: 'minmax(0,220px) 1fr',
              background: `linear-gradient(135deg, rgba(255,193,7,0.05), rgba(255,255,255,0.02) 60%)`,
              border: `1px solid ${GL}`, borderRadius: 22, overflow: 'hidden',
            }}>
              {/* photo */}
              <div style={{ position: 'relative', minHeight: 280, background: '#050810', overflow: 'hidden' }}>
                <img src={instructorRana} alt="أ. رنا محمد العزام"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(8,13,23,0.70) 0%, transparent 50%)' }} />
                {/* online badge */}
                <div style={{ position: 'absolute', top: 14, right: 14, display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,197,94,0.35)',
                  borderRadius: 999, padding: '5px 12px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
                  <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: '#86efac' }}>متاحة الآن</span>
                </div>
              </div>

              {/* content */}
              <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '4px 13px', marginBottom: 12, alignSelf: 'flex-start' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: GLD }} />
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: GLD }}>مستشارة تعليمية</span>
                </div>

                <h3 style={{ fontFamily: F, fontWeight: 900, fontSize: 22, color: OFF, margin: '0 0 6px' }}>أ. رنا محمد العزام</h3>
                <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.8, marginBottom: 20 }}>
                  ستساعدك في تقييم مستواك الحالي، ومعرفة ما إذا كان المسار الكامل هو الخيار الأنسب لك — أو إذا كانت دورة منفردة هي نقطة البداية الأفضل.
                </p>

                {/* what you get */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                  {[
                    'تقييم مستواك ومناسبة المسار لك',
                    'إجابات على كل أسئلتك قبل التسجيل',
                    'خيارات الدفع والتقسيط المتاحة',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: F, fontSize: 13.5, color: LT }}>
                      <span style={{ color: GLD, fontWeight: 800, flexShrink: 0 }}>✓</span> {item}
                    </div>
                  ))}
                </div>

                <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 6px 20px rgba(255,193,7,0.20)' }}>
                  <MessageCircle size={16} />
                  احجز استشارة مجانية — واتساب
                </a>

                <p style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 10 }}>مجانية تماماً · على واتساب · بدون أي التزام</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ 8. FAQ ═════════════════════════ */}
      <section style={{ background: S2, borderTop: `1px solid ${CARD_BORDER}`, padding: '80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <SectionLabel text="أسئلة شائعة" />
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,4vw,42px)', marginTop: 16, lineHeight: 1.35, color: OFF }}>
              قبل أن <span style={{ color: GLD }}>تسأل</span>
            </h2>
          </div>
          <div style={{ maxWidth: 820, marginInline: 'auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ════════════════ 9. FINAL CTA ═══════════════════ */}
      <section style={{ background: S3, borderTop: `1px solid ${CARD_BORDER}`, padding: '24px 0 80px' }}>
        <div style={{ ...INNER }}>
          <div style={{ background: `linear-gradient(135deg, rgba(255,193,7,0.07), rgba(255,255,255,0.025) 60%)`, border: `1px solid ${GL}`, borderRadius: 24, padding: 'clamp(40px,5vw,64px) clamp(24px,4vw,48px)', textAlign: 'center' }}>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(24px,3.8vw,40px)', lineHeight: 1.4, color: OFF }}>
              الإعلامي لا يُبنى بدورة واحدة — <span style={{ color: GLD }}>يُبنى بمسار متكامل</span>
            </h2>
            <p style={{ fontFamily: F, color: MUT, fontSize: 15.5, margin: '14px auto 30px', maxWidth: 520, lineHeight: 1.8 }}>
              مقاعد كل مجموعة محدودة للحفاظ على جودة التصحيح الفردي. ابدأ بالاستشارة المجانية وقرّر بعدها.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 26px rgba(255,193,7,0.22)' }}>
                <MessageCircle size={15} /> تواصل مع المستشارة — مجاناً
              </a>
              <a href="#tree"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${CARD_BORDER}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none' }}>
                استكشف شجرة المسار <ArrowLeft size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
