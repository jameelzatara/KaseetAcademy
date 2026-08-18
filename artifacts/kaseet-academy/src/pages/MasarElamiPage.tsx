/**
 * صفحة المسار الإعلامي — ماستركلاس كاسيت
 * Standalone — جميع الأقسام هنا مباشرةً
 *
 * ترتيب الأقسام (§):
 *  01 الهيرو
 *  02 لمن صُمّم؟  (شبكة مربعات + دوائر outline)
 *  03 ما الذي ستُحقّقه؟ (ألوان فاتحة)
 *  04 المحفظة  (8 مشاريع تطبيقية)
 *  05 المنهج · 10 محطات
 *  06 خبراء ماستركلاس الإعلام
 *  07 السعر · 700 JOD / 1000 USD
 *  08 الفوج القادم + CTA
 *  09 أسلوب الدراسة
 *  10 الاستشارة التعليمية  (آية + ياقوت — بطاقة عمودين)
 *  11 أسئلة متكرّرة
 */
import { useState, useEffect } from 'react';
import { usePageMeta }         from '../hooks/usePageMeta';
import {
  ChevronDown, ArrowLeft, MapPin, Wifi, Layers, Clock,
  FolderCheck, CheckCircle2, ShieldCheck, Home, Lock,
  Target, Radio,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import PaymentModal from '../components/PaymentModal';
import { GOLD, OFF, F, FP, INNER, DH, DM, waLink } from './shared/coursePageHelpers';

import wajeezLogo     from '@assets/wajeez-logo_1785688262989.png';
import coverMasar     from '@assets/cover_المسار_الاعلامي_1785777356196.png';
import instructorRami from '@assets/رامي_ابو_جبارة_1785777158127.png';
import instructorRana from '@assets/trainer-rana-azzam_1785692178863.JPG';
import advisorYaqout  from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAya     from '@assets/0_اية_القماز_1786476075148.jpeg';

/* ─── design tokens ──────────────────────────────────────────── */
const GLD         = GOLD;                           // #FFC107
const GS          = 'rgba(255,193,7,0.09)';
const GL          = 'rgba(255,193,7,0.26)';
const MUT         = '#8A97AE';
const LT          = '#C8D3E2';
const CARD        = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

/* WhatsApp links */
const WA_YAQOUT   = '962771052222';
const WA_AYA      = '962790234483';
const WA_TRACK    = waLink(WA_YAQOUT, 'مرحباً، أودّ الاستفسار عن المسار الإعلامي');
const WA_CONSULT  = waLink(WA_YAQOUT, 'مرحباً، أودّ حجز استشارة تعليمية مجانية مع ياقوت');
const WA_AYA_LINK = waLink(WA_AYA,   'مرحباً آية، أودّ الاستفسار عن ماستركلاس الإعلام الحضوري');

/* ─── station data ───────────────────────────────────────────── */
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

/* ─── audience items (9 — 3×3) ───────────────────────────────── */
const AUDIENCE_ITEMS = [
  'تتحدّث أمام الكاميرا بحضور كاريزمي وتفاعل طبيعي مع العدسة',
  'تبني هويتك الإعلامية الخاصة التي تميزك في سوق الإعلام',
  'تتقن قراءة وإلقاء النصوص الإخبارية والبرامجية بتمكّن',
  'تدير الحوارات التلفزيونية بذكاء وقدرة على توجيه الضيوف',
  'تتعامل باحترافية مع البث المباشر والمواقف الطارئة',
  'تتحكم في لغة الجسد ونبرات الصوت لتوصيل الرسالة بدقة',
  'تبني جسور الثقة مع جمهورك عبر الشاشة من اللحظة الأولى',
  'تستخدم أدوات التقديم لجذب انتباه المشاهد في الاستوديو والميدان',
  'توازن بين الالتزام بالسكريبت والارتجال العفوي المؤثر',
];

/* ─── wave thumbnail (same helper as Soti) ──────────────────────── */
function waveThumb(seed: number, n = 38, w = 120, h = 26): string {
  let s = ((seed * 1234567 + 89) >>> 0);
  const rand = () => { s = ((s * 1664525 + 1013904223) >>> 0); return s / 4294967296; };
  const step = w / n;
  const lines = Array.from({ length: n }, (_, i) => {
    const a = (0.28 + rand() * 0.72) * (h / 2 - 1);
    const x = (i * step + step / 2);
    return `<line x1="${x.toFixed(1)}" y1="${(h/2-a).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(h/2+a).toFixed(1)}"/>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">${lines.join('')}</g></svg>`;
}

/* ─── portfolio (8 filmed deliverables) ────────────────────────── */
const PORTFOLIO = [
  { n:'01', title:'تقرير مرئي',      kind:'تقرير',    desc:'أمام الكاميرا · لجنة تقييم',              hot:false },
  { n:'02', title:'تقرير صحفي',     kind:'صحافة',    desc:'تحقيق من مصادر متعددة',                  hot:false },
  { n:'03', title:'تقرير ميداني',   kind:'ميدان',    desc:'تصوير + تعليق + إخراج',                  hot:true  },
  { n:'04', title:'سلسلة محتوى',    kind:'محتوى',    desc:'ثلاث قطع لعلامة أو موضوع',                hot:false },
  { n:'05', title:'حلقة بودكاست',   kind:'بودكاست',  desc:'منتَجة ومنشورة على منصّة',                 hot:true  },
  { n:'06', title:'محاكاة صحفية',   kind:'محاكاة',   desc:'مؤتمر صحفي وإدارة أزمة',                  hot:false },
  { n:'07', title:'فيلم إعلامي',    kind:'إنتاج',    desc:'منتَج بالكامل: سيناريو + إخراج',           hot:true  },
  { n:'08', title:'مشروع الذكاء',   kind:'AI',       desc:'مشروع إعلامي بأدوات AI',                  hot:false },
];

/* ─── outcomes ─────────────────────────────────────────────────── */
const OUTCOMES = [
  { n:'01', title:'صوت ولغة وحضور مضبوطان',  desc:'إلقاء نظيف، مخارج حروف صحيحة، لغة عربية سليمة، وثقة حقيقية أمام الكاميرا.' },
  { n:'02', title:'تخصص مهني محدد',            desc:'تتخرّج بعنوان واضح: مراسل، معدّ، صانع محتوى، أو متحدث رسمي — لا مجرد "مهتم بالإعلام".' },
  { n:'03', title:'محفظة أعمال احترافية',       desc:'مشروع تخرّج بجودة العرض، ومخرجات تطبيقية موثَّقة من كل محطة على مدار المسار.' },
  { n:'04', title:'شهادة معتمدة من وجيز',       desc:'شهادة المسار من كاسيت أكاديمي، معتمدة من تطبيق وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط.' },
];

/* ─── faqs ──────────────────────────────────────────────────────── */
const FAQS = [
  { q:'هل يمكن اختيار بعض المحطات فقط؟', a:'لا، ولذلك مقصود. المسار مصمَّم ليخرّج إعلامياً متكاملاً قادراً على الكتابة والتقديم والتغطية والإنتاج، لأن سوق الإعلام اليوم لا يطلب مهارة واحدة بمعزل عن سواها. إن كنتَ تبحث عن مهارة محددة، فالدورة المنفردة هي الخيار الأنسب.' },
  { q:'التعليق الصوتي ثلاث جلسات فقط — لماذا؟', a:'لأن هدفه هنا محدود: ضبط تنفّسك ومخارج حروفك ونبرتك تمهيداً للكاميرا والاستوديو في بقية المحطات. أما إن كان هدفك أن تصبح معلّقاً صوتياً محترفاً، فذلك تخصص مستقل يستلزم دورة أعمق.' },
  { q:'أنا مبتدئ تماماً — هل المسار مناسب لي؟', a:'نعم، وهذا بالضبط ما بُني عليه المسار. المرحلة التأسيسية لا تفترض أي خبرة سابقة، وتبني معك الإلقاء والحضور والصوت من البداية قبل الدخول إلى التخصصات.' },
  { q:'ما الفرق بين محطة القيادة وباقي المحطات؟', a:'المحطات 01–09 تُعلّمك التنفيذ: التقديم، الكتابة، التغطية، والإنتاج. أما المحطة 10 فهي مستوى مختلف تُعلّمك الإدارة: مؤسسة، فريق، خطة، وهوية إعلامية.' },
  { q:'درستُ إحدى الدورات الثلاث سابقاً — هل تُحتسب لي؟', a:'نعم. إن أكملتَ دورة المذيع المحترف معنا، تُخصم قيمتها من سعر المسار ولن تُعيد دراستها، إذ هي نفسها المحطة 01. تحدّث مع ياقوت عبر واتساب لمراجعة سجلك.' },
  { q:'من أيّ جهة معتمدة الشهادة؟', a:'الشهادة صادرة عن كاسيت أكاديمي ومعتمدة من تطبيق وجيز، أكبر مكتبة صوتية وبودكاست في الشرق الأوسط. وترافقها محفظة أعمال ومشروع تخرّج — وهما اللذان يُحدثان الفرق الفعلي مع أصحاب العمل.' },
  { q:'هل أستطيع الدراسة عبر الإنترنت من خارج الأردن؟', a:'نعم، عبر كاسيت لايف — جلسات مباشرة تفاعلية بنفس المنهج ونفس المدربين، مع تسجيلات للمراجعة. الفرق الوحيد أن التسجيل العملي يجري بمعداتك عوضاً عن استوديو كاسيت.' },
  { q:'هل الدفع آمن؟ وهل التقسيط متاح؟', a:'الدفع كله إلكتروني عبر بوابة دفع آمنة. والتقسيط متاح للمسار الكامل: تُسدَّد الدفعة الأولى لتثبيت المقعد، وتتوزّع الدفعات المتبقية على مراحل المسار.' },
];

const PHASE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'مرحلة التأسيس', color: GLD },
  2: { label: 'مرحلة التخصص',  color: '#67e8f9' },
  3: { label: 'مرحلة القيادة', color: '#a78bfa' },
};

/* ═══════════════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════════════ */

function SectionLabel({ text, light = false, teal = false }: { text: string; light?: boolean; teal?: boolean }) {
  const color = light ? '#92600a' : teal ? '#67e8f9' : GLD;
  const bg    = light ? 'rgba(255,193,7,0.12)' : teal ? 'rgba(103,232,249,0.08)' : GS;
  const bdr   = light ? 'rgba(255,193,7,0.30)'  : teal ? 'rgba(103,232,249,0.22)' : GL;
  const dot   = light ? '#92600a' : teal ? '#67e8f9' : GLD;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontFamily:F, fontSize:12.5, fontWeight:700, color, background:bg, border:`1px solid ${bdr}`, padding:'5px 14px', borderRadius:999 }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:dot }} />
      {text}
    </span>
  );
}

function Station({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const phase = PHASE_LABELS[s.phase];
  return (
    <div
      role="button" tabIndex={0}
      aria-expanded={open}
      aria-label={`محطة ${s.n}: ${s.title}`}
      onClick={onToggle}
      onKeyDown={e => { if (e.key==='Enter'||e.key===' '){e.preventDefault();onToggle();} }}
      style={{ background:open?`linear-gradient(160deg,${GS},rgba(255,255,255,.025) 60%)`:CARD, border:`1px solid ${open?GL:('optional' in s && s.optional?'rgba(167,139,250,.22)':CARD_BORDER)}`, borderRadius:14, padding:'20px 22px', cursor:'pointer', transition:'border-color .2s,background .2s', marginBottom:0 }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
        <div style={{ flexShrink:0, width:44, height:44, borderRadius:12, background:'rgba(255,255,255,.04)', border:`1px solid ${open?GL:CARD_BORDER}`, display:'grid', placeContent:'center', fontFamily:FP, fontSize:15, fontWeight:700, color:'optional' in s && s.optional?'#a78bfa':GLD }}>
          {s.n}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:4 }}>
            <span style={{ fontFamily:F, fontSize:17, fontWeight:800, color:OFF, lineHeight:1.5 }}>{s.title}</span>
            {'standalone' in s && s.standalone && (
              <span style={{ fontFamily:F, fontSize:11, fontWeight:700, background:GLD, color:'#1A1206', padding:'2px 9px', borderRadius:999 }}>متاحة منفردةً</span>
            )}
            {'optional' in s && s.optional && (
              <span style={{ fontFamily:F, fontSize:11, fontWeight:700, background:'rgba(167,139,250,.15)', border:'1px solid rgba(167,139,250,.35)', color:'#c4b5fd', padding:'2px 9px', borderRadius:999 }}>القيادة</span>
            )}
          </div>
          <div style={{ fontFamily:F, fontSize:13, color:MUT }}>{s.sub}</div>
        </div>
        <div style={{ flexShrink:0, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:F, fontSize:12, color:phase.color, fontWeight:700 }}>{phase.label}</span>
          <ChevronDown size={16} color={GLD} style={{ transform:open?'rotate(180deg)':'none', transition:'transform .25s' }} />
        </div>
      </div>
      {open && (
        <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${CARD_BORDER}` }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
            {(s.chips as readonly string[]).map(chip => (
              <span key={chip} style={{ fontFamily:F, fontSize:12.5, color:LT, background:'rgba(255,255,255,.04)', border:`1px solid ${CARD_BORDER}`, padding:'5px 12px', borderRadius:999 }}>{chip}</span>
            ))}
          </div>
          <div style={{ fontFamily:F, fontSize:13.5, color:LT, lineHeight:1.75 }}>
            <span style={{ color:GLD, fontWeight:700 }}>المشروع التطبيقي: </span>{s.project}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:12, flexWrap:'wrap' }}>
            <span style={{ fontFamily:F, fontSize:12, color:MUT }}>⏱ {s.hours}</span>
            {s.note && <span style={{ fontFamily:F, fontSize:12, color:GLD }}>← {s.note}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:CARD, border:`1px solid ${open?GL:CARD_BORDER}`, borderRadius:14, overflow:'hidden', marginBottom:10, transition:'border-color .2s' }}>
      <button onClick={() => setOpen(o=>!o)} aria-expanded={open} style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
        <span style={{ fontFamily:F, fontSize:15.5, fontWeight:700, color:OFF, textAlign:'right' }}>{q}</span>
        <span aria-hidden="true" style={{ color:GLD, fontSize:22, lineHeight:1, transform:open?'rotate(45deg)':'none', transition:'transform .25s', flexShrink:0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding:'0 22px 20px', fontFamily:F, fontSize:14.5, color:MUT, lineHeight:1.85 }}>{a}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════════ */
export default function MasarElamiPage() {
  const [openIdx,       setOpenIdx]       = useState<number | null>(null);
  const [expandAll,     setExpandAll]     = useState(false);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [checkoutMode,  setCheckoutMode]  = useState<'onsite' | 'live'>('onsite');
  const [stickyVisible, setStickyVisible] = useState(true);

  const scrollToCheckout = () =>
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const el = document.getElementById('checkout');
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStickyVisible(false);
      } else {
        setStickyVisible(entry.boundingClientRect.top > 0);
      }
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  usePageMeta({
    title: 'ماستركلاس الإعلام — المسار الإعلامي',
    description: 'منهج إعلامي متكامل من 10 محطات: تقديم تلفزيوني، صحافة، محتوى رقمي، بودكاست، وإنتاج مرئي. 40 ساعة مع شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });

  useEffect(() => { window.scrollTo({ top:0, behavior:'instant' }); }, []);

  function toggle(i: number) { setOpenIdx(openIdx===i ? null : i); setExpandAll(false); }
  function handleExpandAll()  { setExpandAll(v=>!v); setOpenIdx(null); }
  function isOpen(i: number)  { return expandAll || openIdx===i; }

  return (
    <div dir="rtl" className="page-masar-elami" style={{ fontFamily:F, color:OFF, minHeight:'100vh', overflowX:'hidden' }}>

      <style>{`
        @keyframes elam-vu { 0%,100%{height:22%} 50%{height:100%} }
        .elam-vu-bar { width:3px; border-radius:2px; background:rgba(255,193,7,.85); animation:elam-vu 1.5s ease-in-out infinite; }
        html { scroll-behavior:smooth }
        :focus-visible { outline:2px solid #FFC107!important; outline-offset:3px!important; border-radius:4px!important; }

        /* § 01 hero */
        .elam-hero-grid { display:grid; grid-template-columns:1.12fr .88fr; gap:52px; align-items:center; }

        /* § 02 audience */
        .elam-aud-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; align-items:stretch; }
        @media (max-width:900px){ .elam-aud-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media (max-width:560px){ .elam-aud-grid{grid-template-columns:1fr!important} }

        /* § 04 portfolio */
        .elam-pf-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        @media (max-width:900px){ .elam-pf-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media (max-width:480px){ .elam-pf-grid{grid-template-columns:repeat(1,1fr)!important} }

        /* § 06 trainer cards */
        .elam-trainer-card  { display:grid; grid-template-columns:minmax(0,290px) 1fr; border-radius:22px; overflow:hidden; }
        .elam-trainer-photo { position:relative; min-height:340px; background:#050810; overflow:hidden; }
        @media (max-width:768px){
          .elam-hero-grid    { grid-template-columns:1fr!important }
          .elam-hero-shot    { max-width:300px!important; order:-1; margin:0 auto 20px; }
          .elam-trainer-card { grid-template-columns:1fr!important }
          .elam-trainer-photo{ min-height:220px!important }
        }
        @media (max-width:400px){ .elam-hero-shot{max-width:240px!important} }

        /* § 10 advisor */
        .elam-adv-card { display:grid; grid-template-columns:1fr 1fr; gap:0; max-width:720px; margin-inline:auto;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:20px;
          padding:28px 32px; }
        .elam-adv-col-a { padding-inline-end:32px; border-inline-end:1px solid rgba(255,255,255,.08); }
        .elam-adv-col-b { padding-inline-start:32px; }
        @media (max-width:640px){
          .elam-adv-card  { grid-template-columns:1fr!important; gap:32px; }
          .elam-adv-col-a { padding-inline-end:0!important; border-inline-end:none!important; padding-bottom:32px; border-bottom:1px solid rgba(255,255,255,.08); }
          .elam-adv-col-b { padding-inline-start:0!important; }
        }

        /* outcomes cream section */
        .masar-outcome-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:40px;}
        .masar-oc{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:18px;padding:28px 24px;}
        .masar-oc-n{font-family:var(--fp,sans-serif);font-size:11px;font-weight:700;color:#92600a;letter-spacing:.06em;display:block;margin-bottom:8px;}
        .masar-oc-title{font-family:var(--f,sans-serif);font-weight:800;font-size:clamp(17px,2vw,21px);color:#1a1206;margin:0 0 8px;}
        .masar-oc-desc{font-family:var(--f,sans-serif);font-size:14px;color:#4a3f1e;line-height:1.75;margin:0;}

        /* cohort facts */
        .cohort-facts{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:24px 0 32px;}
        .cohort-facts>div{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 20px;font-family:var(--f,sans-serif);font-size:14px;color:#8A97AE;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:160px;}
        .cohort-facts>div b{color:#EFF2F6;font-weight:700;}
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          §01 HERO — Soti-style dark background
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ padding: '0 0 88px' }}>
        <div style={{ ...INNER }}>

          {/* breadcrumb */}
          <nav aria-label="مسار التنقل" style={{ display:'flex', alignItems:'center', gap:6, paddingTop:96, paddingBottom:0, marginBottom:28 }}>
            <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <a href="/#masterclasses" style={{ fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>الماستركلاسات</a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <span style={{ fontFamily:F, fontSize:12.5, color:GLD }}>المسار الإعلامي</span>
          </nav>

          <div className="elam-hero-grid">

            <div>
              {/* two audience pills */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
                  <Target size={12} strokeWidth={2.2} /> للمبتدئين والصاعدين
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(103,232,249,.08)', border:'1px solid rgba(103,232,249,.22)', color:'#67e8f9', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
                  <Radio size={12} strokeWidth={2.2} /> صحافة وإعلام
                </span>
              </div>

              <h1 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(34px,5vw,58px)', lineHeight:1.22, letterSpacing:-1.2, margin:'0 0 0', color:OFF }}>
                ماستركلاس الإعلام{' '}<br />
                <span style={{ color:GLD }}>والأداء الإعلامي</span>
              </h1>

              <p style={{ fontFamily:F, fontSize:16, color:MUT, maxWidth:560, marginTop:16, lineHeight:1.85 }}>
                منهج واحد متكامل من 10 محطات: يبدأ بالتقديم والحضور أمام الكاميرا، ويمرّ بكل تخصص إعلامي — صحافة، ميدان، محتوى، بودكاست، متحدث رسمي، وإنتاج — وكل محطة تُسلَّم فيها مشروع تطبيقي.
              </p>

              {/* feature cards — 2×2 grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:24, maxWidth:500 }}>

                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CARD_BORDER}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Layers size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>10</b> محطات تدريبية متسلسلة
                </span>

                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CARD_BORDER}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>40</b> ساعة تدريبية موزَّعة
                </span>

                {/* ★ مشاريع — dominant */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,193,7,.11)', border:`1px solid ${GL}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:GLD, fontWeight:700 }}>
                  <FolderCheck size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, fontSize:19, color:GLD, fontWeight:900, lineHeight:1 }}>8</b> مشاريع تطبيقية (ألبوم التخرّج)
                </span>

                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CARD_BORDER}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <MapPin size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  حضوري في عمّان أو Online LIVE
                </span>

              </div>

              {/* wajeez badge — clickable link */}
              <a href="https://wajeez.com" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:14, marginTop:18, background:'rgba(2,6,23,.75)', border:'1px solid rgba(255,193,7,.18)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:14, padding:'12px 16px', maxWidth:500, textDecoration:'none', cursor:'pointer', transition:'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.42)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.18)')}>
                <div style={{ flexShrink:0, width:38, height:38, borderRadius:8, background:'#fff', display:'grid', placeContent:'center', padding:4 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontSize:13, fontWeight:700, color:OFF }}>شريك الاعتماد الرسمي — تطبيق وجيز</div>
                  <div style={{ fontFamily:F, fontSize:11.5, color:MUT }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </a>

              {/* CTAs */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginTop:22 }}>
                <button onClick={scrollToCheckout}
                  style={{ display:'inline-flex', alignItems:'center', gap:9, background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:15, padding:'13px 26px', borderRadius:12, border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(255,193,7,.22)' }}>
                  احجز مقعدك في الماستركلاس <ArrowLeft size={14} />
                </button>
                <a href="#tree"
                  style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.05)', border:`1px solid ${CARD_BORDER}`, color:OFF, fontFamily:F, fontWeight:700, fontSize:15, padding:'13px 26px', borderRadius:12, textDecoration:'none' }}>
                  استكشف المنهج <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* ── hero shot ── */}
            <div className="elam-hero-shot" style={{ position:'relative', maxWidth:380, marginInline:'auto', width:'100%' }}>
              <div style={{ position:'absolute', inset:'-14% -10% -8%', borderRadius:40, background:'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)', filter:'blur(8px)', zIndex:-1 }} />
              <div style={{ position:'relative', borderRadius:26, overflow:'hidden', border:`1px solid ${GL}`, aspectRatio:'3/4', boxShadow:'0 34px 90px rgba(0,0,0,.5)' }}>
                <img src={coverMasar} alt="ماستركلاس المسار الإعلامي" fetchPriority="high"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 12%', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(26,37,51,.95) 0%, rgba(26,37,51,.32) 30%, transparent 58%)' }} />
                <span style={{ position:'absolute', top:18, right:18, zIndex:3, display:'inline-flex', alignItems:'center', gap:7, background:'rgba(26,37,51,.74)', backdropFilter:'blur(6px)', border:`1px solid ${GL}`, color:GLD, fontSize:11.5, fontWeight:700, fontFamily:F, padding:'7px 13px', borderRadius:999 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:GLD }} />
                  تصوير داخل استوديو الإنتاج
                </span>
                <div style={{ position:'absolute', inset:'auto 0 0 0', zIndex:3, padding:'22px 22px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16 }}>
                  <div>
                    <span style={{ fontFamily:FP, fontSize:38, fontWeight:700, color:GLD, lineHeight:.95 }}>8</span>
                    <span style={{ fontFamily:F, fontSize:12.5, color:LT, marginTop:4, display:'block' }}>مشاريع إعلامية · ألبوم التخرّج</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:34 }}>
                    {Array.from({ length:9 }, (_, i) => (
                      <span key={i} className="elam-vu-bar" style={{ animationDelay:`${i * 0.11}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §02 FOR WHOM — لمن صُمِّم البرنامج؟
      ════════════════════════════════════════════════════════════ */}
      <section style={{ padding:'88px 0', borderTop:`1px solid ${CARD_BORDER}` }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12, fontWeight:700, padding:'5px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD, flexShrink:0 }} />
              لمن صُمِّم البرنامج؟
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,3.6vw,40px)', color:OFF, marginTop:18, marginBottom:12, lineHeight:1.35 }}>
              ما الذي ستُتقنه <span style={{ color:GLD }}>بعد الماستركلاس؟</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:MUT, maxWidth:560, marginInline:'auto', lineHeight:1.8 }}>
              ثلاثة محاور تُغطّي المهارة الكاملة — من الحضور أمام الكاميرا حتى بناء الهوية الإعلامية.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20, maxWidth:980, marginInline:'auto' }}>
            {[
              {
                focus: 'الحضور، لغة الجسد، وبناء الثقة',
                title: 'الأداء والكاريزما أمام الكاميرا',
                desc: 'تتحدث أمام العدسة بحضور كاريزمي وتفاعل طبيعي، وتتقن لغة الجسد ونبرات الصوت لتوصيل رسالتك وقراءة النصوص بتمكّن وبناء ثقة فورية مع المشاهد.',
              },
              {
                focus: 'الثبات الميداني والسيطرة على الاستوديو',
                title: 'إدارة الحوار والبث المباشر',
                desc: 'تدير الحوارات التلفزيونية بذكاء وقدرة على توجيه الضيوف، وتتعامل باحترافية مع البث المباشر والمواقف الطارئة في الاستوديو والميدان.',
              },
              {
                focus: 'البصمة الخاصة والسرعة الذكائية',
                title: 'الهوية الإعلامية والارتجال',
                desc: 'تبني هويتك الإعلامية المستقلة التي تميزك في السوق، وتوازن ببراعة بين الالتزام بالنص (السكريبت) والارتجال العفوي المؤثر.',
              },
            ].map((card, i) => (
              <div key={i} style={{ background:CARD, border:`1px solid ${CARD_BORDER}`, borderRadius:20, padding:'30px 26px', display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ width:36, height:3, background:GLD, borderRadius:2 }} />
                <span style={{ fontFamily:F, fontSize:11.5, fontWeight:700, color:MUT, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:GLD }}>التركيز:</span> {card.focus}
                </span>
                <h3 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(17px,2.2vw,21px)', color:OFF, margin:0, lineHeight:1.45 }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily:F, fontSize:14, color:MUT, lineHeight:1.85, margin:0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §03 محفظة الأعمال — CREAM · تصميم سوتي
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--cream" style={{ padding:'96px 0', position:'relative', overflow:'hidden' }}>
        <div className="geo geo--halftone" style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none' }} />
        <div style={{ ...INNER, position:'relative', zIndex:3 }}>

          {/* header */}
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(138,98,0,.09)', border:'1px solid rgba(138,98,0,.28)', color:'#8A6200', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>محفظة الأعمال</span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, letterSpacing:-.5, margin:'18px 0 0', color:DH }}>
              تتخرّج <span style={{ color:'#8A6200' }}>بمحفظة</span> لا بشهادة
            </h2>
            <p style={{ fontFamily:F, fontSize:16, color:DM, maxWidth:680, marginTop:14, marginInline:'auto', lineHeight:1.8 }}>
              ثمانية مخرجات إعلامية حقيقية — كلّ محطة تُسلّم مشروعاً موثَّقاً يُضاف إلى محفظة أعمالك.
            </p>
          </div>

          {/* project table — same structure as Soti's album table */}
          <div style={{ background:'#fff', border:'1px solid rgba(24,32,47,.10)', borderRadius:22, boxShadow:'0 22px 60px rgba(24,32,47,.12)', overflow:'hidden' }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(24,32,47,.10)', display:'flex', flexWrap:'wrap', gap:16, alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontFamily:F, fontWeight:800, fontSize:20, color:DH }}>محفظتك الإعلامية</div>
                <div style={{ fontFamily:F, fontSize:13, color:DM, marginTop:3 }}>ثمانية مشاريع تطبيقية من المحطات، ومشروع التخرّج المُنتَج بالكامل</div>
              </div>
              <span style={{ fontFamily:FP, fontSize:13, fontWeight:700, color:'#8A6200', border:'1px solid rgba(138,98,0,.32)', background:'rgba(138,98,0,.07)', padding:'7px 15px', borderRadius:999, whiteSpace:'nowrap' as const }}>8 مخرجات</span>
            </div>
            {PORTFOLIO.map((p, i) => (
              <div key={p.n} style={{
                display:'grid', gridTemplateColumns:'44px 1fr 100px 130px', gap:14, alignItems:'center',
                padding:'13px 28px', borderBottom:'1px solid rgba(24,32,47,.10)',
                background: p.hot ? 'rgba(255,193,7,.10)' : 'transparent',
                transition:'background .2s',
              }}>
                <span style={{ fontFamily:FP, fontSize:12.5, fontWeight:700, color: p.hot ? '#8A6200' : DM }}>{p.n}</span>
                <span style={{ fontFamily:F, fontSize:14.5, fontWeight:700, color: p.hot ? '#8A6200' : DH, lineHeight:1.5 }}>{p.title}</span>
                <span style={{ fontFamily:F, fontSize:11.5, color:DM, border:'1px solid rgba(24,32,47,.10)', background:'rgba(24,32,47,.035)', padding:'3px 11px', borderRadius:999, textAlign:'center' as const, whiteSpace:'nowrap' as const }}>{p.kind}</span>
                <span style={{ color: p.hot ? 'rgba(138,98,0,.78)' : 'rgba(138,98,0,.34)', height:26, display:'block' }}
                  dangerouslySetInnerHTML={{ __html: waveThumb(50 + i) }} />
              </div>
            ))}
            {/* graduation row */}
            <div style={{ display:'grid', gridTemplateColumns:'44px 1fr 100px 130px', gap:14, alignItems:'center', padding:'14px 28px', background:'linear-gradient(90deg,rgba(255,193,7,.24),rgba(255,193,7,.08))', borderTop:'1px solid rgba(138,98,0,.28)' }}>
              <span style={{ fontFamily:FP, fontSize:15, fontWeight:700, color:'#8A6200' }}>★</span>
              <span style={{ fontFamily:F, fontSize:14.5, fontWeight:800, color:'#8A6200' }}>مشروع التخرّج · فيلم إعلامي مكتمل بجودة النشر</span>
              <span style={{ fontFamily:F, fontSize:11.5, color:'#8A6200', border:'1px solid rgba(138,98,0,.32)', background:'rgba(138,98,0,.08)', padding:'3px 11px', borderRadius:999, textAlign:'center' as const }}>التخرّج</span>
              <span style={{ color:'rgba(138,98,0,.9)', height:26, display:'block' }}
                dangerouslySetInnerHTML={{ __html: waveThumb(999) }} />
            </div>
            <div style={{ padding:'20px 28px', borderTop:'1px solid rgba(24,32,47,.10)', fontFamily:F, fontSize:14, color:DM, lineHeight:1.8 }}>
              <strong style={{ color:DH }}>المخرجات المميّزة بالذهبي</strong> هي الأكثر أثراً في السوق: التقرير الميداني أكثر المهارات طلباً، وحلقة البودكاست منشورة على منصّة حقيقية، ومشروع التخرّج أثقل قطعة في محفظتك.
            </div>
          </div>

          {/* outcome cards — same style as Soti */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:18, marginTop:40 }}>
            {OUTCOMES.map(o => (
              <div key={o.n} style={{ background:'rgba(24,32,47,.06)', border:'1px solid rgba(24,32,47,.10)', borderRadius:18, padding:'30px 26px' }}>
                <span style={{ display:'block', fontFamily:FP, fontSize:44, fontWeight:700, lineHeight:1, color:'#8A6200', opacity:.28 }}>{o.n}</span>
                <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid rgba(24,32,47,.10)', position:'relative' }}>
                  <div style={{ position:'absolute', top:0, right:0, width:32, height:3, background:'#8A6200', borderRadius:2 }} />
                  <h4 style={{ fontFamily:F, fontWeight:800, fontSize:18, lineHeight:1.5, color:DH, marginBottom:10 }}>{o.title}</h4>
                  <p style={{ fontFamily:F, fontSize:14, color:DM, lineHeight:1.8 }}>{o.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* wajeez strip — same 3-step layout as Soti */}
          <div style={{ marginTop:40, border:'1px solid rgba(30,122,133,.40)', borderRadius:20, background:'linear-gradient(150deg,rgba(30,122,133,.10),rgba(24,32,47,.04) 56%)', padding:'clamp(22px,3vw,34px)' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:18, alignItems:'center', marginBottom:22 }}>
              <div style={{ flexShrink:0, width:54, height:54, borderRadius:12, background:'#fff', display:'grid', placeContent:'center', padding:7 }}>
                <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              <div>
                <h3 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(17px,2.2vw,22px)', lineHeight:1.35, margin:0, color:DH }}>
                  من متدرّب <span style={{ color:'#1e7a85' }}>إلى إعلامي معتمد من وجيز</span>
                </h3>
                <p style={{ fontFamily:F, fontSize:13.5, color:DM, marginTop:5 }}>
                  وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط — هي جهة الاعتماد الرسمي لشهادة الماستركلاس.
                </p>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:12 }}>
              {[
                { n:'STEP 01', t:'تتخرّج بمحفظة 8 مخرجات + مشروع تخرّج', d:'كلّ محطة تُسلَّم بمشروع تطبيقي موثَّق — ليست شهادة فارغة بل محفظة أعمال إعلامية حقيقية.' },
                { n:'STEP 02', t:'شهادتك معتمدة رسمياً من وجيز', d:'تصدر شهادة الماستركلاس بختم وجيز — أكبر جهة اعتماد في مجال الإعلام الرقمي في الشرق الأوسط.' },
                { n:'STEP 03', t:'توصية مهنية من مدرّبيك', d:'تتخرّج بتوصية مكتوبة من المدربين تُعزّز ملفّك أمام أصحاب العمل والعملاء في السوق الإعلامي.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background:'rgba(24,32,47,.05)', border:'1px solid rgba(24,32,47,.09)', borderRadius:12, padding:'16px 15px' }}>
                  <div style={{ fontFamily:FP, fontSize:11, fontWeight:700, color:'#1e7a85', letterSpacing:1.2, marginBottom:7 }}>{n}</div>
                  <h4 style={{ fontFamily:F, fontWeight:800, fontSize:15, marginBottom:6, color:DH, lineHeight:1.5 }}>{t}</h4>
                  <p style={{ fontFamily:F, fontSize:12.5, color:DM, lineHeight:1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:F, fontSize:12, color:DM, borderTop:'1px solid rgba(24,32,47,.08)', paddingTop:16, marginTop:18, lineHeight:1.8 }}>
              الشهادة والاعتماد مضمونان لكلّ من يُكمل الماستركلاس. المحفظة والتوصية المهنية هما اللذان يُحدثان الفرق الفعلي مع أصحاب العمل.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §05 CURRICULUM — شجرة المسار (10 محطات)
      ════════════════════════════════════════════════════════════ */}
      <section id="tree" className="sec sec--tree" style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div className="geo geo--columns" aria-hidden="true" />
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <SectionLabel text="منهج الماستركلاس" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', marginTop:16, lineHeight:1.35, color:OFF }}>
              10 محطات من أول يوم <span style={{ color:GLD }}>حتى الشهادة</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:MUT, maxWidth:580, marginInline:'auto', marginTop:12, lineHeight:1.8 }}>
              كل محطة إلزامية ومرتَّبة بتسلسل مدروس. اضغط على أي محطة لاستعراض محاورها ومشروعها.
            </p>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', maxWidth:860, marginInline:'auto', marginBottom:16 }}>
            <button onClick={handleExpandAll} style={{ background:'rgba(255,255,255,.03)', border:`1px solid ${CARD_BORDER}`, color:MUT, fontFamily:F, fontSize:13, fontWeight:700, padding:'8px 16px', borderRadius:999, cursor:'pointer' }}>
              {expandAll ? 'طيّ جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          <div style={{ maxWidth:860, marginInline:'auto', display:'flex', flexDirection:'column', gap:0 }}>
            {STATIONS.map((s, i) => {
              const prevPhase = i > 0 ? STATIONS[i-1].phase : null;
              const showBand  = s.phase !== prevPhase;
              return (
                <div key={s.n}>
                  {showBand && (
                    <div style={{ display:'flex', alignItems:'center', gap:14, margin:i===0?'0 0 10px':'18px 0 10px' }}>
                      <div style={{ flex:1, height:1, background:CARD_BORDER }} />
                      <span style={{ fontFamily:F, fontSize:12, fontWeight:700, color:PHASE_LABELS[s.phase].color, padding:'3px 12px', borderRadius:999, background:'rgba(255,255,255,.03)', border:`1px solid ${CARD_BORDER}` }}>
                        {PHASE_LABELS[s.phase].label}
                      </span>
                      <div style={{ flex:1, height:1, background:CARD_BORDER }} />
                    </div>
                  )}
                  {!showBand && i > 0 && (
                    <div style={{ width:2, height:12, background:`linear-gradient(180deg,${GL},rgba(255,193,7,.4))`, margin:'3px auto', borderRadius:2 }} />
                  )}
                  <Station s={s} open={isOpen(i)} onToggle={() => toggle(i)} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §06 STUDY MODES — أسلوب الدراسة (before trainers)
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--modes" style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <SectionLabel text="أسلوب الدراسة" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', marginTop:16, lineHeight:1.35, color:OFF }}>
              اختر <span style={{ color:GLD }}>أسلوب تعلّمك</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:MUT, marginTop:12, maxWidth:520, marginInline:'auto', lineHeight:1.8 }}>
              نفس المنهج ونفس المدربين والشهادة المعتمدة — فقط اختر ما يناسب جدولك وحياتك
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:14, marginBottom:32, maxWidth:820, marginInline:'auto' }}>
            <div style={{ background:'rgba(255,193,7,.05)', border:'1px solid rgba(255,193,7,.22)', borderRadius:16, padding:'22px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,193,7,.14)', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <MapPin size={17} color={GLD} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontWeight:800, fontSize:14.5, color:GLD }}>حضوري — استوديو كاسيت</div>
                  <div style={{ fontFamily:F, fontSize:12, color:MUT }}>حضور فعلي في عمّان</div>
                </div>
              </div>
              <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
                {['تفاعل مباشر مع المدرب والزملاء','تطبيق عملي داخل الاستوديوهات المجهَّزة','بيئة تعلم منظَّمة بلا إلهاء','تشبيك مع المتدربين وفرص العمل'].map(pt => (
                  <li key={pt} style={{ display:'flex', alignItems:'flex-start', gap:8, fontFamily:F, fontSize:13, color:LT }}>
                    <CheckCircle2 size={13} color={GLD} strokeWidth={2.2} style={{ flexShrink:0, marginTop:2 }} /> {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background:'rgba(103,232,249,.04)', border:'1px solid rgba(103,232,249,.20)', borderRadius:16, padding:'22px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(103,232,249,.12)', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Wifi size={17} color="#67e8f9" strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontWeight:800, fontSize:14.5, color:'#67e8f9' }}>كاسيت لايف — Online LIVE</div>
                  <div style={{ fontFamily:F, fontSize:12, color:MUT }}>من أي مكان في العالم العربي</div>
                </div>
              </div>
              <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
                {['جلسات مباشرة مع المدرب في الوقت الفعلي','تسجيلات الجلسات متاحة للمراجعة','تسليم واجبات وتقييم فردي','متاح من أي مكان في العالم العربي'].map(pt => (
                  <li key={pt} style={{ display:'flex', alignItems:'flex-start', gap:8, fontFamily:F, fontSize:13, color:LT }}>
                    <CheckCircle2 size={13} color="#67e8f9" strokeWidth={2.2} style={{ flexShrink:0, marginTop:2 }} /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* guarantee */}
          <div style={{ maxWidth:680, margin:'0 auto', background:'rgba(255,193,7,.06)', border:'1px solid rgba(255,193,7,.32)', borderRadius:22, padding:'clamp(28px,3.5vw,44px)', textAlign:'center' }}>
            <ShieldCheck size={40} strokeWidth={1.5} color={GLD} aria-hidden="true" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(20px,2.8vw,27px)', color:OFF, margin:'16px 0 12px', lineHeight:1.4 }}>
              ضمان الجلسة الأولى
            </h2>
            <p style={{ fontFamily:F, fontSize:15, color:MUT, lineHeight:1.9, maxWidth:500, marginInline:'auto', margin:0 }}>
              جرّب الجلسة الأولى كاملة. وإن شعرت أنّ الماستركلاس لا يلبّي توقّعاتك، اطلب استرداداً كاملاً خلال 24 ساعة من انتهائها — دون أسئلة.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §07 TRAINERS — خبراء الإعلام
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--trainers" style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div className="geo" aria-hidden="true">
          <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1.5">
              <circle cx="80" cy="80" r="190"/><circle cx="80" cy="80" r="330"/>
              <circle cx="80" cy="80" r="470"/><circle cx="80" cy="80" r="610"/>
            </g>
          </svg>
        </div>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <SectionLabel text="خبراء ماستركلاس الإعلام" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', marginTop:16, lineHeight:1.35, color:OFF }}>
              مَن <span style={{ color:GLD }}>يُرشدك</span> في هذا المسار؟
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:MUT, maxWidth:540, marginInline:'auto', marginTop:12 }}>
              إعلاميون ومدرّبون من داخل بيئة العمل الحقيقية — يمنحونك خبرة الكاميرا والاستوديو وتوجيه الأداء طوال رحلتك التدريبية.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:18, maxWidth:900, marginInline:'auto' }}>

            {/* Rami */}
            <div className="elam-trainer-card" style={{ background:`linear-gradient(135deg,rgba(255,193,7,.04),rgba(255,255,255,.025) 60%)`, border:`1px solid ${GL}` }}>
              <div className="elam-trainer-photo">
                <img src={instructorRami} alt="رامي أبو جبارة" loading="lazy" decoding="async"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block', position:'absolute', inset:0 }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left,rgba(8,13,23,.85) 0%,transparent 55%)' }} />
                <div style={{ position:'absolute', bottom:16, right:16, display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,0,0,.68)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,193,7,.25)', borderRadius:10, padding:'7px 13px' }}>
                  <div style={{ width:26, height:26, borderRadius:6, background:'#fff', display:'grid', placeContent:'center', flexShrink:0, padding:3 }}>
                    <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                  </div>
                  <span style={{ fontFamily:F, fontSize:11.5, fontWeight:700, color:GLD, lineHeight:1.35 }}>الشريك المؤسس<br/>لتطبيق وجيز</span>
                </div>
              </div>
              <div style={{ padding:'32px 32px 28px', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:GS, border:`1px solid ${GL}`, borderRadius:999, padding:'4px 13px', marginBottom:12, alignSelf:'flex-start' }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:GLD }} />
                  <span style={{ fontFamily:F, fontSize:12, fontWeight:700, color:GLD }}>مدرّب برنامج الإعلامي الشامل</span>
                </div>
                <h3 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(20px,2.2vw,28px)', color:OFF, margin:'0 0 8px' }}>رامي أبو جبارة</h3>
                <p style={{ fontFamily:F, fontSize:14, color:MUT, lineHeight:1.85, marginBottom:20 }}>
                  خبرة تمتد لـ <b style={{ color:LT, fontFamily:FP }}>17</b> عاماً في الصحافة التلفزيونية والقيادة التحريرية؛ تنقّل خلالها بين كبرى المؤسسات الإعلامية مثل <b style={{ color:LT }}>Sky News عربية</b>، وصولاً إلى رئاسة تحرير <b style={{ color:LT }}>«الشرق مع Bloomberg»</b>.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:22 }}>
                  {['الصحافة التلفزيونية','القيادة التحريرية','Sky News عربية','الشرق مع Bloomberg'].map(t => (
                    <span key={t} style={{ fontFamily:F, fontSize:12, color:GLD, background:GS, border:`1px solid ${GL}`, borderRadius:999, padding:'4px 12px' }}>{t}</span>
                  ))}
                </div>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop:'auto', display:'inline-flex', alignItems:'center', gap:8, alignSelf:'flex-start', background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:13.5, padding:'11px 22px', borderRadius:11, textDecoration:'none' }}>
                  تواصل للاستفسار <ArrowLeft size={13} />
                </a>
              </div>
            </div>

            {/* Rana */}
            <div className="elam-trainer-card" style={{ background:`linear-gradient(135deg,rgba(103,232,249,.04),rgba(255,255,255,.020) 60%)`, border:'1px solid rgba(103,232,249,.20)' }}>
              <div className="elam-trainer-photo">
                <img src={instructorRana} alt="أ. رنا محمد العزام" loading="lazy" decoding="async"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block', position:'absolute', inset:0 }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left,rgba(8,13,23,.85) 0%,transparent 55%)' }} />
              </div>
              <div style={{ padding:'32px 32px 28px', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(103,232,249,.07)', border:'1px solid rgba(103,232,249,.22)', borderRadius:999, padding:'4px 13px', marginBottom:12, alignSelf:'flex-start' }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#67e8f9' }} />
                  <span style={{ fontFamily:F, fontSize:12, fontWeight:700, color:'#67e8f9' }}>مدرّبة الأداء والتحرير اللغوي</span>
                </div>
                <h3 style={{ fontFamily:F, fontWeight:900, fontSize:'clamp(20px,2.2vw,28px)', color:OFF, margin:'0 0 8px' }}>أ. رنا محمد العزام</h3>
                <p style={{ fontFamily:F, fontSize:14, color:MUT, lineHeight:1.85, marginBottom:20 }}>
                  إعلامية ومدربة أداء متخصصة في <b style={{ color:LT }}>التقديم التلفزيوني</b> والتحرير اللغوي وتأهيل المتحدث الرسمي — تُدرّس محطتَي التأسيس في المسار.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:22 }}>
                  {['الإعلام التلفزيوني','التحرير اللغوي','المتحدث الرسمي','الحضور الإعلامي'].map(t => (
                    <span key={t} style={{ fontFamily:F, fontSize:12, color:'#67e8f9', background:'rgba(103,232,249,.07)', border:'1px solid rgba(103,232,249,.20)', borderRadius:999, padding:'4px 12px' }}>{t}</span>
                  ))}
                </div>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop:'auto', display:'inline-flex', alignItems:'center', gap:8, alignSelf:'flex-start', background:'rgba(103,232,249,.10)', border:'1px solid rgba(103,232,249,.30)', color:'#67e8f9', fontFamily:F, fontWeight:800, fontSize:13.5, padding:'11px 22px', borderRadius:11, textDecoration:'none' }}>
                  تواصل للاستفسار <ArrowLeft size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §08 CHECKOUT — interactive (Stripe)
      ════════════════════════════════════════════════════════════ */}
      <section id="checkout" className="sec sec--access" style={{ position:'relative', borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0', scrollMarginTop:80 }}>
        <div style={{ ...INNER }}>
          {/* heading */}
          <div style={{ textAlign:'center', maxWidth:580, margin:'0 auto 52px' }}>
            <SectionLabel text="خطوتك نحو السوق" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, margin:'18px 0 0', color:OFF }}>
              استثمر في <span style={{ color:GLD }}>مستقبلك المهني</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15, fontWeight:700, color:LT, marginTop:10, marginBottom:0 }}>
              10 محطات من التأسيس إلى القيادة الإعلامية
            </p>
          </div>

          <div style={{ maxWidth:600, margin:'0 auto', position:'relative' }}>
            {/* glow */}
            <div style={{ position:'absolute', inset:-3, background:'linear-gradient(135deg,rgba(255,193,7,.22),rgba(103,232,249,.10))', borderRadius:30, filter:'blur(20px)', opacity:0.7, pointerEvents:'none' }} />

            <div style={{ position:'relative', background:'#131B27', border:`1px solid ${GL}`, borderRadius:26, overflow:'hidden', boxShadow:'0 0 0 1px rgba(255,193,7,.12),0 34px 70px rgba(13,11,20,.45)' }}>

              {/* ── mode tabs ── */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${CARD_BORDER}` }}>
                {/* حضوري */}
                <button
                  onClick={() => setCheckoutMode('onsite')}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    padding:'18px 16px', border:'none', cursor:'pointer',
                    background: checkoutMode === 'onsite' ? 'rgba(255,193,7,.08)' : 'transparent',
                    borderBottom: checkoutMode === 'onsite' ? `2px solid ${GLD}` : '2px solid transparent',
                    transition:'background .2s, border-color .2s',
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <MapPin size={14} color={checkoutMode === 'onsite' ? GLD : '#8A97AE'} strokeWidth={2.2} />
                    <span style={{ fontFamily:F, fontSize:14.5, fontWeight:800, color:checkoutMode === 'onsite' ? GLD : '#8A97AE' }}>حضوري</span>
                  </div>
                  <span style={{ fontFamily:F, fontSize:11.5, color:'#8A97AE' }}>استوديو كاسيت · عمّان · 15 أيلول</span>
                  <span style={{ fontFamily:FP, fontSize:22, fontWeight:700, color:checkoutMode === 'onsite' ? GLD : LT, lineHeight:1 }}>700 <span style={{ fontSize:13 }}>JOD</span></span>
                </button>
                {/* مباشر تفاعلي */}
                <button
                  onClick={() => setCheckoutMode('live')}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    padding:'18px 16px', border:'none', cursor:'pointer',
                    background: checkoutMode === 'live' ? 'rgba(103,232,249,.07)' : 'transparent',
                    borderBottom: checkoutMode === 'live' ? '2px solid #67e8f9' : '2px solid transparent',
                    transition:'background .2s, border-color .2s',
                    borderRight:`1px solid ${CARD_BORDER}`,
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Wifi size={14} color={checkoutMode === 'live' ? '#67e8f9' : '#8A97AE'} strokeWidth={2.2} />
                    <span style={{ fontFamily:F, fontSize:14.5, fontWeight:800, color:checkoutMode === 'live' ? '#67e8f9' : '#8A97AE' }}>مباشر تفاعلي</span>
                  </div>
                  <span style={{ fontFamily:F, fontSize:11.5, color:'#8A97AE' }}>عن بُعد (Online LIVE) · 15 أيلول</span>
                  <span style={{ fontFamily:FP, fontSize:22, fontWeight:700, color:checkoutMode === 'live' ? '#67e8f9' : LT, lineHeight:1 }}>$1000</span>
                </button>
              </div>

              <div style={{ padding:'clamp(24px,3.5vw,36px)' }}>

                {/* features */}
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, padding:0, margin:'0 0 24px' }}>
                  {[
                    '10 محطات متسلسلة — 3 مراحل كاملة (تأسيس، تخصصات، قيادة)',
                    '40 ساعة تدريبية موزَّعة بإشراف مباشر',
                    '8 مشاريع تطبيقية مصوَّرة داخل المسار',
                    'محطة القيادة الإعلامية وتأهيل البروفايل',
                    'شهادة معتمدة من تطبيق وجيز',
                    'إمكانية خصم قيمة أي دورة درستها سابقاً',
                  ].map(feat => (
                    <li key={feat} style={{ display:'flex', alignItems:'flex-start', gap:10, fontFamily:F, fontSize:14, color:LT, lineHeight:1.6 }}>
                      <CheckCircle2 size={16} color={GLD} strokeWidth={2.2} style={{ flexShrink:0, marginTop:2 }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* guarantee */}
                <div style={{ display:'flex', alignItems:'flex-start', gap:13, background:'rgba(255,193,7,.07)', border:`1px solid rgba(255,193,7,.26)`, borderRadius:16, padding:'16px 18px', marginBottom:18 }}>
                  <ShieldCheck size={22} color={GLD} strokeWidth={2} style={{ flexShrink:0, marginTop:2 }} />
                  <div>
                    <div style={{ fontFamily:F, fontWeight:800, fontSize:14, color:OFF, marginBottom:5 }}>ضمان الجلسة الأولى</div>
                    <p style={{ fontFamily:F, fontSize:13, color:LT, lineHeight:1.8, margin:0 }}>
                      جرّب الجلسة الأولى كاملة. إن لم تلبِّ توقّعاتك، اطلب استرداداً كاملاً خلال 24 ساعة — <strong style={{ color:OFF }}>دون أسئلة ولا شروط</strong>.
                    </p>
                  </div>
                </div>

                {/* installment — onsite only (live is always full payment) */}
                {checkoutMode === 'onsite' && (
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:GS, border:`1px solid ${GL}`, borderRadius:12, padding:'11px 15px', marginBottom:22 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:GLD, flexShrink:0, marginTop:6 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:LT, lineHeight:1.7 }}>
                      <strong style={{ color:OFF }}>التقسيط متاح:</strong> يمكنك تثبيت مقعدك بدفع الدفعة الأولى فقط
                      {' '}<strong style={{ color:GLD }}>(50 JOD)</strong>.
                    </span>
                  </div>
                )}
                {checkoutMode === 'live' && (
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:GS, border:`1px solid rgba(103,232,249,.22)`, borderRadius:12, padding:'11px 15px', marginBottom:22 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#67e8f9', flexShrink:0, marginTop:6 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:LT, lineHeight:1.7 }}>
                      الدفع الكامل مطلوب للتسجيل في الخيار المباشر —{' '}
                      <strong style={{ color:'#67e8f9' }}>$1000</strong>.
                    </span>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                    width:'100%', boxSizing:'border-box',
                    background:GLD, color:'#0f172a',
                    fontFamily:F, fontWeight:800, fontSize:15.5,
                    padding:'16px 24px', borderRadius:16, border:'none', cursor:'pointer',
                    boxShadow:'0 8px 28px rgba(255,193,7,.30)',
                    transition:'transform .15s, box-shadow .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 38px rgba(255,193,7,.38)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(255,193,7,.30)'; }}>
                  <Lock size={15} />
                  {checkoutMode === 'onsite'
                    ? 'احجز مقعدك — ادفع 50 ديناراً الآن'
                    : 'سجّل الآن — ادفع $1000 كاملاً'}
                  <ArrowLeft size={15} />
                </button>

                {/* security footer */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:16, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:F, fontSize:12, color:'#8A97AE' }}>
                    <Lock size={12} color="#8A97AE" strokeWidth={2} />
                    معاملة آمنة ومشفّرة 100% عبر Stripe
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <svg width="32" height="11" viewBox="0 0 48 16" aria-label="Visa"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="50%" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#fff">VISA</text></svg>
                    <svg width="20" height="13" viewBox="0 0 34 22" aria-label="Mastercard"><circle cx="12" cy="11" r="11" fill="#EB001B"/><circle cx="22" cy="11" r="11" fill="#F79E1B"/><path d="M17 4.3a11 11 0 0 1 0 13.4A11 11 0 0 1 17 4.3z" fill="#FF5F00"/></svg>
                    <svg width="32" height="13" viewBox="0 0 50 20" aria-label="Apple Pay"><rect width="50" height="20" rx="4" fill="#000"/><text x="50%" y="14.5" textAnchor="middle" fontFamily="'-apple-system',sans-serif" fontWeight="600" fontSize="10" fill="#fff">Apple Pay</text></svg>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:24 }}>
            <p style={{ fontFamily:F, fontSize:13.5, color:MUT }}>
              تريد البدء بدورة واحدة قبل الالتزام بالمسار الكامل؟{' '}
              <a href="/" style={{ color:GLD, textDecoration:'underline', textUnderlineOffset:3, fontWeight:700 }}>
                استعرض الدورات المنفردة ←
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10 CONSULTATION — استشارة مجانية (after checkout)
      ════════════════════════════════════════════════════════════ */}
      <section id="consult" className="sec sec--consult" style={{ padding:'0 0 88px' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12, fontWeight:700, padding:'5px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD, flexShrink:0 }} />
              استشارة مجانية · دون التزام
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(24px,3.4vw,36px)', lineHeight:1.4, color:OFF, margin:'16px 0 10px' }}>
              قبل أن تسجّل، تحدّث مع <span style={{ color:GLD }}>مستشارتك</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:MUT, lineHeight:1.75, maxWidth:520, marginInline:'auto' }}>
              جلسة قصيرة على واتساب تُحدَّد فيها نقطة بدايتك — لكلّ مسار مستشارة مخصّصة.
            </p>
          </div>
          <div className="elam-adv-card">
            <div className="elam-adv-col-a">
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                <div style={{ width:70, height:70, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:`2px solid ${GL}` }}>
                  <img src={advisorAya} alt="آية القماز" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontWeight:800, fontSize:15, color:OFF, marginBottom:6 }}>آية القماز</div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:F, fontSize:12.5, color:MUT }}>
                    <MapPin size={12} color={GLD} strokeWidth={2} /> حضوري · عمّان
                  </div>
                </div>
              </div>
              <a href={WA_AYA_LINK} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'transparent', border:'1.5px solid #25D366', color:'#25D366', fontFamily:F, fontWeight:700, fontSize:13.5, padding:'11px 20px', borderRadius:12, textDecoration:'none', boxSizing:'border-box' as const }}>
                <FaWhatsapp size={16} /> تواصلي مع آية
              </a>
            </div>
            <div className="elam-adv-col-b">
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                <div style={{ width:70, height:70, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid rgba(103,232,249,.30)' }}>
                  <img src={advisorYaqout} alt="ياقوت خشاشنة" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontWeight:800, fontSize:15, color:OFF, marginBottom:6 }}>ياقوت خشاشنة</div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:F, fontSize:12.5, color:MUT }}>
                    <Wifi size={12} color="#67e8f9" strokeWidth={2} /> مباشر تفاعلي · Online LIVE
                  </div>
                </div>
              </div>
              <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'transparent', border:'1.5px solid #25D366', color:'#25D366', fontFamily:F, fontWeight:700, fontSize:13.5, padding:'11px 20px', borderRadius:12, textDecoration:'none', boxSizing:'border-box' as const }}>
                <FaWhatsapp size={16} /> تواصلي مع ياقوت
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11 FAQ — أسئلة متكرّرة
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--faq" style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <SectionLabel text="أسئلة شائعة" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', marginTop:16, lineHeight:1.35, color:OFF }}>
              قبل أن <span style={{ color:GLD }}>تسأل</span>
            </h2>
          </div>
          <div style={{ maxWidth:820, marginInline:'auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSlug="masar-elami"
        courseTitle="ماستركلاس الإعلام المتكامل"
        cohortIdOnsite={305}
        cohortIdLive={306}
        cohortStartAr="15 أيلول"
        cohortDays="الأحد والثلاثاء"
        cohortTimeAr="6:00 – 8:00 مساءً"
        cohortTrainer="رنا العزام"
        priceJOD={700}
        priceUSD={1000}
        initialMode={checkoutMode}
      />

      {/* ── sticky CTA (mobile only, hides when #checkout is visible) ── */}
      {stickyVisible && (
        <div className="elam-sticky-cta" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:50, padding:'10px 16px 16px', background:'rgba(10,14,24,0.96)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={scrollToCheckout}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:9, width:'100%', boxSizing:'border-box', background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:15, padding:'14px 20px', borderRadius:14, border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(255,193,7,.28)' }}>
            <Lock size={15} />
            احجز مقعدك في الماستركلاس
            <ArrowLeft size={14} />
          </button>
        </div>
      )}
      <style>{`@media (min-width:769px) { .elam-sticky-cta { display:none !important; } }`}</style>
    </div>
  );
}
