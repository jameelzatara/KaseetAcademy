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
  FolderCheck, CheckCircle2, ShieldCheck, Home,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
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

/* ─── portfolio (8 filmed deliverables) ────────────────────────── */
const PORTFOLIO = [
  { n:'01', title:'تقرير مرئي',      desc:'أمام الكاميرا · لجنة تقييم' },
  { n:'03', title:'تقرير صحفي',     desc:'تحقيق من مصادر متعددة' },
  { n:'04', title:'تقرير ميداني',   desc:'تصوير + تعليق + إخراج' },
  { n:'05', title:'سلسلة محتوى',    desc:'ثلاث قطع لعلامة أو موضوع' },
  { n:'06', title:'حلقة بودكاست',   desc:'منتَجة ومنشورة على منصّة' },
  { n:'07', title:'محاكاة صحفية',   desc:'مؤتمر صحفي وإدارة أزمة' },
  { n:'08', title:'فيلم إعلامي',    desc:'منتَج بالكامل: سيناريو + إخراج' },
  { n:'09', title:'مشروع الذكاء',   desc:'مشروع إعلامي بأدوات AI' },
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
  { q:'التعليق الصوتي ثلاث جلسات فقط — لماذا؟', a:'لأن هدفه هنا محدود: ضبط تنفّسك ومخارج حروفك ونبرتك تمهيداً للكاميرا والمايكروفون في بقية المحطات. أما إن كان هدفك أن تصبح معلّقاً صوتياً محترفاً، فذلك تخصص مستقل يستلزم دورة أعمق.' },
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
  const [openIdx,   setOpenIdx]   = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

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
        @keyframes kaseetSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes kaPulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .ka-spin-ring { animation:kaseetSpin 18s linear infinite; transform-origin:200px 200px; }
        .ka-spin-slow { animation:kaseetSpin 32s linear infinite reverse; transform-origin:200px 200px; }
        .ka-pulse-dot { animation:kaPulse 2s ease-in-out infinite; }
        @media (prefers-reduced-motion:reduce){
          .ka-spin-ring,.ka-spin-slow{animation:none!important}
          .ka-pulse-dot{animation:none!important}
        }
        html { scroll-behavior:smooth }
        :focus-visible { outline:2px solid #FFC107!important; outline-offset:3px!important; border-radius:4px!important; }

        /* § 01 hero */
        .elam-hero-grid   { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr); gap:56px; align-items:center; }
        .elam-hero-visual { position:relative; aspect-ratio:1; max-width:400px; width:100%; margin-inline:auto; }

        /* camera HUD — single instance */
        .elam-hud { display:none; position:absolute; top:72px; left:0; right:0; z-index:5;
          padding:0 clamp(16px,4vw,48px); align-items:center; justify-content:space-between;
          opacity:.38; pointer-events:none; direction:ltr; font-family:monospace; font-size:11px;
          color:rgba(255,255,255,.7); letter-spacing:.06em; }
        @media (min-width:769px){ .elam-hud{display:flex!important} }

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
          .elam-hero-visual  { max-width:240px!important; order:-1; margin:0 auto 24px; }
          .elam-trainer-card { grid-template-columns:1fr!important }
          .elam-trainer-photo{ min-height:220px!important }
        }
        @media (max-width:400px){ .elam-hero-visual{max-width:200px!important} }

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
          §01 HERO — full-cover with camera HUD
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ position:'relative', minHeight:640, padding:'0 0 88px', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>

        {/* cover image — objectPosition tuned to show face */}
        <img
          src={coverMasar} alt="" aria-hidden="true"
          fetchPriority="high" decoding="async"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'50% 12%', zIndex:0 }}
        />

        {/* darkening overlay */}
        <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(to bottom, rgba(2,6,23,.72) 0%, rgba(2,6,23,.40) 38%, rgba(2,6,23,.90) 100%)' }} />

        {/* ── camera HUD — SINGLE instance inside hero ── */}
        <div className="elam-hud" aria-hidden="true" style={{ zIndex:5, position:'absolute', top:72, left:0, right:0 }}>
          <span>● REC &nbsp;|&nbsp; 1920×1080</span>
          <span>00:00:08:15</span>
          <span>50FPS &nbsp;|&nbsp; 35mm &nbsp;|&nbsp; ▮▮▮▮▯ 78%</span>
        </div>

        {/* content */}
        <div style={{ position:'relative', zIndex:3, ...INNER }}>

          {/* breadcrumb — inside hero, not a separate bar */}
          <nav aria-label="مسار التنقل" style={{ display:'flex', alignItems:'center', gap:6, marginBottom:28, paddingTop:96 }}>
            <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <a href="/#masterclasses" style={{ fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>الماستركلاسات</a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <span style={{ fontFamily:F, fontSize:12.5, color:GLD }}>الإعلامي</span>
          </nav>

          <div className="elam-hero-grid">

            {/* text column */}
            <div>
              {/* chip */}
              <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,193,7,.10)', border:'1px solid rgba(255,193,7,.28)', color:GLD, fontFamily:F, fontSize:13, fontWeight:700, padding:'7px 16px', borderRadius:999 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:GLD }} />
                مسار متكامل · 10 محطات
              </span>

              <h1 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(36px,5.5vw,64px)', lineHeight:1.2, letterSpacing:-1.2, margin:'18px 0 0', color:OFF }}>
                المسار <span style={{ color:GLD }}>الإعلامي</span>
              </h1>

              <p style={{ fontFamily:F, fontSize:'clamp(14px,1.2vw,16.5px)', color:MUT, maxWidth:540, marginTop:16, lineHeight:1.85 }}>
                منهج واحد متكامل من 10 محطات: يبدأ بالتقديم والحضور أمام الكاميرا، ويمرّ بكل تخصص إعلامي —
                صحافة، ميدان، محتوى، بودكاست، متحدث رسمي، وإنتاج — وكل محطة تُسلَّم فيها مشروع تطبيقي.
              </p>

              {/* stat chips — hours (40) dominant */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:9, marginTop:22 }}>

                {/* ★ hours chip — bigger/bolder */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,193,7,.13)', border:`1px solid ${GL}`, backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', padding:'10px 16px', borderRadius:11, fontFamily:F, fontSize:13, color:GLD, fontWeight:700 }}>
                  <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, fontSize:20, color:GLD, fontWeight:900, lineHeight:1 }}>40</b>
                  ساعة تدريبية موزَّعة
                </span>

                <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(2,6,23,.60)', border:'1px solid rgba(255,255,255,.10)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Layers size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>10</b> محطات تدريبية
                </span>

                <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(2,6,23,.60)', border:'1px solid rgba(255,255,255,.10)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <FolderCheck size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>8</b> مشاريع تُسلَّم
                </span>

                <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(2,6,23,.60)', border:'1px solid rgba(255,255,255,.10)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <MapPin size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  حضوري في عمّان أو Online LIVE
                </span>
              </div>

              {/* Wajeez badge */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:16, background:'rgba(2,6,23,.75)', border:'1px solid rgba(255,193,7,.18)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:14, padding:'12px 16px', maxWidth:500 }}>
                <div style={{ flexShrink:0, width:38, height:38, borderRadius:8, background:'#fff', display:'grid', placeContent:'center', padding:4 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontSize:13, fontWeight:700, color:OFF }}>الشهادة معتمدة من تطبيق وجيز</div>
                  <div style={{ fontFamily:F, fontSize:11.5, color:MUT }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </div>

              {/* CTAs — primary (WA) first (rightmost in RTL) */}
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:12, marginTop:22 }}>
                <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:9, background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:14.5, padding:'13px 26px', borderRadius:12, textDecoration:'none', boxShadow:'0 6px 20px rgba(255,193,7,.22)' }}>
                  <FaWhatsapp size={17} /> تحدّث مع ياقوت عبر واتساب
                </a>
                <a href="#tree"
                  style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.13)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', color:OFF, fontFamily:F, fontWeight:700, fontSize:14.5, padding:'13px 26px', borderRadius:12, textDecoration:'none' }}>
                  استكشف شجرة المسار <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* spinning ring visual */}
            <div className="elam-hero-visual">
              <svg viewBox="0 0 400 400" style={{ width:'100%', height:'100%', display:'block' }}>
                <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,255,255,.05)" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,.04)" />
                <g className="ka-spin-ring">
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="300 1056" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,193,7,.40)" strokeWidth="3" strokeLinecap="round" strokeDasharray="380 1056" strokeDashoffset="-330" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="3" strokeLinecap="round" strokeDasharray="150 1056" strokeDashoffset="-740" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(30,122,133,.90)" strokeWidth="3" strokeLinecap="round" strokeDasharray="120 1056" strokeDashoffset="-910" transform="rotate(-90 200 200)" />
                  <circle cx="200" cy="32"  r="6" fill={GLD} />
                  <circle cx="352" cy="268" r="6" fill={GLD} />
                  <circle cx="66"  cy="286" r="6" fill="#1E7A85" />
                </g>
                <g className="ka-spin-slow">
                  <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(255,193,7,.06)" strokeWidth="1" strokeDasharray="12 20" />
                </g>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'grid', placeContent:'center', textAlign:'center' }}>
                <div style={{ fontFamily:FP, fontSize:68, fontWeight:700, color:OFF, lineHeight:1 }}>10</div>
                <div style={{ fontFamily:F, fontSize:15, color:MUT, marginTop:4 }}>محطات</div>
                <div style={{ width:36, height:1, background:'rgba(255,193,7,.35)', margin:'10px auto' }} />
                <div style={{ fontFamily:F, fontSize:11.5, color:'rgba(255,193,7,.65)' }}>تأسيس ← تخصصات ← قيادة</div>
              </div>
            </div>

          </div>{/* /hero grid */}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §02 AUDIENCE — شبكة مربعات + دوائر outline + عنوان عادي
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding:'80px 0',
        background:'#0B1628',
        backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',
        backgroundSize:'48px 48px',
        borderTop:`1px solid ${CARD_BORDER}`,
      }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            {/* badge — teal dot, card colors */}
            <span style={{ display:'inline-flex', alignItems:'center', gap:7, fontFamily:F, fontSize:12.5, fontWeight:700, color:MUT, background:CARD, border:`1px solid ${CARD_BORDER}`, padding:'5px 14px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#67e8f9' }} />
              لمن صُمّم هذا البرنامج؟
            </span>
            {/* plain title — no gold highlight */}
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(24px,3.6vw,40px)', color:OFF, marginTop:16, lineHeight:1.35, maxWidth:680, marginInline:'auto' }}>
              هذه الرحلة لك إذا كنت تطمح للتميز في الفضاء الإعلامي الحديث
            </h2>
          </div>

          {/* 3 × 3 grid — align-items:stretch */}
          <div className="elam-aud-grid" style={{ maxWidth:920, marginInline:'auto' }}>
            {AUDIENCE_ITEMS.map((item, i) => (
              <div key={i} style={{
                background:CARD, border:`1px solid ${CARD_BORDER}`,
                borderRadius:14, padding:'20px 18px',
                display:'flex', alignItems:'flex-start', gap:14,
              }}>
                {/* outlined circle — not gold filled */}
                <span style={{
                  flexShrink:0, width:26, height:26, borderRadius:'50%',
                  background:'transparent',
                  border:'1px solid rgba(255,255,255,.12)',
                  color:MUT, fontFamily:FP, fontWeight:700, fontSize:12,
                  display:'grid', placeContent:'center',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontFamily:F, fontSize:14, color:LT, lineHeight:1.75, margin:0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §03 OUTCOMES — ألوان فاتحة (cream)
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--outcomes" style={{ padding:'80px 0', position:'relative', overflow:'hidden' }}>
        <div className="geo" aria-hidden="true">
          <svg viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-100,470 Q420,250 760,360 T1560,190" fill="none" stroke="rgba(255,193,7,.55)" strokeWidth="2.5"/>
          </svg>
        </div>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center' }}>
            <SectionLabel text="مخرجات المسار" light />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', marginTop:16, lineHeight:1.35, color:DH }}>
              ما الذي ستُحقّقه <span style={{ color:'#92600a' }}>بعد المسار؟</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:DM, maxWidth:580, marginInline:'auto', marginTop:12 }}>
              مخرجات ملموسة تُقدّمها لأصحاب العمل والعملاء — لا مجرد شعور عام بالتحسّن.
            </p>
          </div>
          <div className="masar-outcome-panel">
            {OUTCOMES.map(o => (
              <div key={o.n} className="masar-oc">
                <span className="masar-oc-n">{o.n}</span>
                <h3 className="masar-oc-title">{o.title}</h3>
                <p className="masar-oc-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §04 PORTFOLIO — 8 مشاريع تطبيقية
      ════════════════════════════════════════════════════════════ */}
      <section style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <SectionLabel text="محفظة الأعمال" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', marginTop:16, lineHeight:1.35, color:OFF }}>
              8 مشاريع حقيقية <span style={{ color:GLD }}>تُسلَّم وتُقيَّم</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15, color:MUT, maxWidth:520, marginInline:'auto', marginTop:12, lineHeight:1.8 }}>
              كل محطة تنتهي بمخرج موثَّق يُضاف إلى محفظة أعمالك المهنية — لا محاضرات فقط.
            </p>
          </div>

          <div className="elam-pf-grid" style={{ maxWidth:900, marginInline:'auto' }}>
            {PORTFOLIO.map(p => (
              <div key={p.n} style={{ background:CARD, border:`1px solid ${CARD_BORDER}`, borderRadius:14, padding:'20px 18px' }}>
                <div style={{ fontFamily:FP, fontSize:11, color:GLD, fontWeight:700, marginBottom:8, letterSpacing:'.04em' }}>مشروع {p.n}</div>
                <h4 style={{ fontFamily:F, fontWeight:800, fontSize:15, color:OFF, margin:'0 0 6px' }}>{p.title}</h4>
                <p style={{ fontFamily:F, fontSize:12.5, color:MUT, margin:0, lineHeight:1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Wajeez final output bar */}
          <div style={{ maxWidth:900, marginInline:'auto', marginTop:20, border:'1px solid rgba(30,122,133,.40)', borderRadius:16, background:'linear-gradient(160deg,rgba(30,122,133,.14),rgba(11,17,32,.8) 60%)', padding:'26px 24px', display:'flex', flexWrap:'wrap', gap:18, alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ width:54, height:54, borderRadius:12, background:'#fff', display:'grid', placeContent:'center', padding:7, flexShrink:0 }}>
                <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              <div>
                <h4 style={{ fontFamily:F, fontWeight:800, fontSize:17, color:OFF, margin:'0 0 3px' }}>شهادة كاسيت أكاديمي · معتمدة من تطبيق وجيز</h4>
                <p style={{ fontFamily:F, fontSize:13, color:MUT, margin:0 }}>شهادة المسار الكاملة + محفظة 8 مشاريع + توصية مهنية من المدربين</p>
              </div>
            </div>
            <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:GLD, color:'#1A1206', fontFamily:F, fontWeight:700, fontSize:13.5, padding:'11px 22px', borderRadius:12, textDecoration:'none' }}>
              التسجيل في المسار <ArrowLeft size={13} />
            </a>
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
            <SectionLabel text="شجرة المسار" />
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
          §06 TRAINERS — رامي + رنا
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
              مَن <span style={{ color:GLD }}>يُرشدك</span> في هذا المسار
            </h2>
            <p style={{ fontFamily:F, fontSize:15.5, color:MUT, maxWidth:540, marginInline:'auto', marginTop:12 }}>
              خبراء إعلاميون بمسيرات مهنية حقيقية — يُرشدونك ويُقيّمونك على مدار المسار.
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
          §07 PRICING — 700 JOD / 1000 USD
      ════════════════════════════════════════════════════════════ */}
      <section id="enroll" className="sec sec--pricing" style={{ position:'relative', borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div className="geo" aria-hidden="true">
          <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="rgba(138,98,0,.16)" strokeWidth="1.5">
              <polygon points="720,150 1010,320 1010,560 720,730 430,560 430,320"/>
              <polygon points="720,240 930,362 930,608 720,730 510,608 510,362" strokeOpacity=".55"/>
            </g>
          </svg>
        </div>
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', maxWidth:580, margin:'0 auto 44px' }}>
            <SectionLabel text="الالتحاق بالمسار" />
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', color:OFF, marginTop:16, lineHeight:1.3 }}>
              اختر <span style={{ color:GLD }}>خيار الالتحاق</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:15, color:MUT, marginTop:10, lineHeight:1.8 }}>
              التحق بالمسار الكامل وتحوّل إلى إعلامي محترف — أو ابدأ بدورة منفردة واكتشف الأسلوب المناسب لك.
            </p>
          </div>

          <div style={{ maxWidth:620, margin:'0 auto', position:'relative' }}>
            <div style={{ position:'absolute', inset:-2, background:`linear-gradient(135deg,rgba(255,193,7,.18),rgba(103,232,249,.08))`, borderRadius:28, filter:'blur(18px)', opacity:.6, pointerEvents:'none' }} />
            <div style={{ position:'relative', background:'#131B27', border:`1px solid rgba(255,193,7,.55)`, borderRadius:24, padding:'clamp(26px,4vw,40px)', boxShadow:'0 0 0 1px rgba(255,193,7,.20),inset 0 1px 0 rgba(255,193,7,.10),0 34px 70px rgba(24,32,47,.28)' }}>

              <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:12, padding:'5px 18px', borderRadius:999, whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(255,193,7,.28)' }}>
                الأشمل والأوفر
              </div>

              <div style={{ textAlign:'center', paddingBottom:24, borderBottom:`1px solid ${CARD_BORDER}` }}>
                <h3 style={{ fontFamily:F, fontWeight:800, fontSize:21, color:OFF }}>ماستركلاس الإعلام</h3>
                <p style={{ fontFamily:F, fontSize:13, color:MUT, marginTop:6, lineHeight:1.65 }}>
                  10 محطات · التأسيس + التخصصات + القيادة الإعلامية
                </p>
                {/* dual price */}
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:16, margin:'20px 0 0', flexWrap:'wrap' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:FP, fontSize:52, fontWeight:900, color:GLD, lineHeight:1 }}>700</div>
                    <div style={{ fontFamily:F, fontSize:13, color:MUT }}>دينار أردني</div>
                  </div>
                  <div style={{ fontFamily:F, fontSize:13, color:'rgba(255,255,255,.20)', alignSelf:'center', marginBottom:18 }}>أو</div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontFamily:FP, fontSize:52, fontWeight:900, color:'rgba(255,193,7,.55)', lineHeight:1 }}>1000</div>
                    <div style={{ fontFamily:F, fontSize:13, color:MUT }}>دولار أمريكي</div>
                  </div>
                </div>

                <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:14, background:GS, border:`1px solid ${GL}`, borderRadius:12, padding:'9px 15px' }}>
                  <span className="ka-pulse-dot" style={{ width:7, height:7, borderRadius:'50%', background:GLD, flexShrink:0 }} />
                  <span style={{ fontFamily:F, fontSize:13, color:LT }}>
                    التقسيط متاح · <b style={{ color:GLD, fontFamily:FP }}>50 د.أ</b> تُثبَّت مقعدك
                  </span>
                </div>
                <p style={{ fontFamily:F, fontSize:12.5, color:MUT, marginTop:10 }}>40 ساعة موزَّعة · حضوري أو Online LIVE</p>
              </div>

              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:13, padding:'24px 0', margin:0 }}>
                {[
                  '10 محطات متسلسلة — 3 مراحل كاملة',
                  'تغطية جميع التخصصات الإعلامية',
                  '8 محطات حصريّة داخل المسار',
                  '8 مشاريع تطبيقية مصوَّرة بإشراف مباشر',
                  'محطة القيادة الإعلامية وتأهيل البروفايل',
                  'شهادة معتمدة من تطبيق وجيز',
                  'إمكانية خصم قيمة أي دورة درستها سابقاً',
                ].map(feat => (
                  <li key={feat} style={{ display:'flex', alignItems:'flex-start', gap:11, fontFamily:F, fontSize:14, color:LT, lineHeight:1.65 }}>
                    <span style={{ color:GLD, fontWeight:800, flexShrink:0 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>

              <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', boxSizing:'border-box', background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:15, padding:'14px 24px', borderRadius:14, textDecoration:'none', boxShadow:'0 6px 22px rgba(255,193,7,.20)' }}>
                <FaWhatsapp size={17} /> التسجيل في المسار
              </a>
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
          §08 COHORT — الفوج القادم + CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="sec sec--cohort" style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'64px 0 80px' }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <SectionLabel text="الفوج القادم" />
          <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,46px)', marginTop:16, lineHeight:1.3, color:OFF }}>
            يبدأ <span style={{ color:GLD }}>14 أيلول</span>
          </h2>

          <div className="cohort-facts">
            <div><span className="cf-l">الجدول</span><b>الأحد والثلاثاء · 6:00–8:00 مساءً</b></div>
            <div><span className="cf-l">المدة</span><b>40 ساعة · 10 محطات · 3 أشهر</b></div>
            <div><span className="cf-l">المقاعد</span><b>10 مقاعد فقط</b></div>
          </div>

          <a href="#enroll" style={{ display:'inline-flex', alignItems:'center', gap:10, background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:15.5, padding:'15px 32px', borderRadius:12, textDecoration:'none', boxShadow:'0 8px 26px rgba(255,193,7,.24)' }}>
            احجز مقعدك في هذا الفوج <ArrowLeft size={15} />
          </a>
          <p style={{ fontFamily:F, fontSize:14, color:MUT, marginTop:18 }}>
            أو <a href="#consult" style={{ color:GLD, textDecoration:'underline', textUnderlineOffset:3 }}>احكِ مع المستشارة أولاً</a> — استشارة مجانية بدون التزام.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §09 STUDY MODES — أسلوب الدراسة
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
          §10 ADVISORS — آية القماز + ياقوت خشاشنة (بطاقة عمودين)
      ════════════════════════════════════════════════════════════ */}
      <section id="consult" className="sec sec--advisor" style={{ borderTop:`1px solid ${CARD_BORDER}`, padding:'80px 0' }}>
        <div className="geo geo--scan" aria-hidden="true" />
        <div style={{ ...INNER }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <SectionLabel text="الاستشارة التعليمية" />
            {/* plain heading — no gold highlight */}
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,40px)', marginTop:16, lineHeight:1.35, color:OFF }}>
              تحدّثي مع مستشارتنا قبل التسجيل
            </h2>
            <p style={{ fontFamily:F, fontSize:15, color:MUT, marginTop:10, maxWidth:520, marginInline:'auto', lineHeight:1.8 }}>
              جلسة استشارية مجانية على واتساب — تساعدك تحديد إذا المسار هو الخيار الصح لك، وكيف تبدأ.
            </p>
          </div>

          {/* two-column advisor card */}
          <div className="elam-adv-card">

            {/* آية — حضوري */}
            <div className="elam-adv-col-a" style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:12 }}>
              <img
                src={advisorAya} alt="آية القماز — مستشارة تعليمية"
                loading="lazy" decoding="async"
                style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(255,193,7,.25)' }}
              />
              <div>
                <h3 style={{ fontFamily:F, fontWeight:900, fontSize:18, color:OFF, margin:'0 0 4px' }}>آية القماز</h3>
                <p style={{ fontFamily:F, fontSize:13, color:MUT, margin:'0 0 10px' }}>المستشارة التعليمية — الحضوري</p>
                {/* mode badge */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:F, fontSize:12, color:GLD, background:GS, border:`1px solid ${GL}`, borderRadius:999, padding:'4px 11px' }}>
                  <MapPin size={11} color={GLD} strokeWidth={2} /> حضوري — عمّان
                </span>
              </div>
              <p style={{ fontFamily:F, fontSize:13.5, color:MUT, lineHeight:1.75, margin:0 }}>
                تُقيّم معك مستواك الحالي وتُحدّد الفوج الحضوري الأنسب لجدولك في عمّان.
              </p>
              {/* outline green WA button — no phone number in label */}
              <a href={WA_AYA_LINK} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:'auto', background:'transparent', border:'1.5px solid rgba(34,197,94,.55)', color:'#4ade80', fontFamily:F, fontWeight:700, fontSize:13.5, padding:'10px 20px', borderRadius:11, textDecoration:'none' }}>
                <FaWhatsapp size={16} /> واتساب آية
              </a>
            </div>

            {/* ياقوت — مباشر تفاعلي */}
            <div className="elam-adv-col-b" style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:12 }}>
              <img
                src={advisorYaqout} alt="ياقوت خشاشنة — مستشارة تعليمية"
                loading="lazy" decoding="async"
                style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', objectPosition:'center top', border:'2px solid rgba(103,232,249,.25)' }}
              />
              <div>
                <h3 style={{ fontFamily:F, fontWeight:900, fontSize:18, color:OFF, margin:'0 0 4px' }}>ياقوت خشاشنة</h3>
                <p style={{ fontFamily:F, fontSize:13, color:MUT, margin:'0 0 10px' }}>المستشارة التعليمية — Online LIVE</p>
                {/* mode badge */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:F, fontSize:12, color:'#67e8f9', background:'rgba(103,232,249,.08)', border:'1px solid rgba(103,232,249,.22)', borderRadius:999, padding:'4px 11px' }}>
                  <Wifi size={11} color="#67e8f9" strokeWidth={2} /> مباشر تفاعلي
                </span>
              </div>
              <p style={{ fontFamily:F, fontSize:13.5, color:MUT, lineHeight:1.75, margin:0 }}>
                تُقيّم معك مستواك وتُرشّح لك فوج المباشر التفاعلي الأنسب من أي مكان في العالم.
              </p>
              {/* outline green WA button */}
              <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:'auto', background:'transparent', border:'1.5px solid rgba(34,197,94,.55)', color:'#4ade80', fontFamily:F, fontWeight:700, fontSize:13.5, padding:'10px 20px', borderRadius:11, textDecoration:'none' }}>
                <FaWhatsapp size={16} /> واتساب ياقوت
              </a>
            </div>

          </div>

          <p style={{ textAlign:'center', fontFamily:F, fontSize:12.5, color:MUT, marginTop:20 }}>
            مجانية تماماً · على واتساب · بدون أي التزام
          </p>
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

    </div>
  );
}
