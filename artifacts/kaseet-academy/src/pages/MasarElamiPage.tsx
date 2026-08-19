/**
 * صفحة ماستركلاس الإعلام — كاسيت أكاديمي
 * هيكل مطابق تماماً لـ MasarSotiPage — نفس الـ tokens والـ CSS والترتيب.
 * §01 Hero  §02 Audience-grid  §03 Cream/Portfolio  §04 Curriculum
 * §05 Modes  §06 Trainers  §07 Checkout  §08 Consultation  §09 FAQs
 */
import { useState, useEffect } from 'react';
import { usePageMeta }         from '../hooks/usePageMeta';
import {
  ChevronDown, ArrowLeft, MapPin, Wifi, Home, Layers, Clock,
  Target, Radio, ShieldCheck, CalendarDays, Users, CheckCircle2, Lock,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { GOLD, OFF, F, FP, INNER, waLink } from './shared/coursePageHelpers';
import PaymentModal from '../components/PaymentModal';

import wajeezLogo     from '@assets/wajeez-logo_1785688262989.png';
import coverMasar     from '@assets/cover_المسار_الاعلامي_1785777356196.png';
import instructorRami from '@assets/رامي_ابو_جبارة_1785777158127.png';
import instructorRana from '@assets/trainer-rana-azzam_1785692178863.JPG';
import advisorYaqout  from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAya     from '@assets/0_اية_القماز_1786476075148.jpeg';

/* ── tokens — identical to MasarSotiPage ───────────────────────── */
const GLD  = GOLD;
const GS   = 'rgba(255,193,7,0.09)';
const GL   = 'rgba(255,193,7,0.26)';
const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const CARD = 'rgba(255,255,255,0.04)';
const CBR  = 'rgba(255,255,255,0.08)';
const INK  = '#18202F';
const INK2 = '#56617A';

/* ── WhatsApp ───────────────────────────────────────────────────── */
const WA_PHONE_LIVE   = '962771052222';   // ياقوت
const WA_PHONE_ONSITE = '962790234483';   // آية
const WA_CONSULT  = waLink(WA_PHONE_LIVE,   'مرحباً، أودّ حجز استشارة تعليمية مجانية عن ماستركلاس الإعلام');
const WA_TRACK    = waLink(WA_PHONE_LIVE,   'مرحباً، أودّ الاستفسار عن المسار الإعلامي');
const WA_AYA_LINK = waLink(WA_PHONE_ONSITE, 'مرحباً آية، أودّ الاستفسار عن ماستركلاس الإعلام الحضوري');

/* ── wave thumbnail (identical helper) ─────────────────────────── */
function waveThumb(seed: number, n = 38, w = 120, h = 26): string {
  let s = ((seed * 1234567 + 89) >>> 0);
  const rand = () => { s = ((s * 1664525 + 1013904223) >>> 0); return s / 4294967296; };
  const step = w / n;
  const lines = Array.from({ length: n }, (_, i) => {
    const a = (0.28 + rand() * 0.72) * (h / 2 - 1);
    const x = i * step + step / 2;
    return `<line x1="${x.toFixed(1)}" y1="${(h/2-a).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(h/2+a).toFixed(1)}"/>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round">${lines.join('')}</g></svg>`;
}

/* ── data ────────────────────────────────────────────────────────── */
const STATIONS = [
  { n:'01', phase:1, standalone:true,  badge:'',
    title:'التقديم التلفزيوني والإذاعي',
    sub:'مرحلة التأسيس — الحضور والإلقاء والتقديم أمام الكاميرا.',
    chips:['الإلقاء الاحترافي','لغة الجسد','الحضور أمام الكاميرا','قراءة النشرة','تقديم البرامج','إدارة الحوارات','المقابلات','البث المباشر'],
    project:'تقرير مرئي كامل يُقدَّم أمام الكاميرا ويُقيَّم من لجنة مدربين.',
    hours:'16 ساعة', note:'متاحة كدورة مستقلة: المذيع المحترف' },
  { n:'02', phase:1, standalone:false, badge:'',
    title:'التعليق الصوتي (Voice Over)',
    sub:'مرحلة التأسيس — ضبط الصوت والنبرة والتنفس.',
    chips:['أساسيات الأداء الصوتي','التنفس الصحيح','مخارج الحروف','ضبط النبرات'],
    project:'تسجيل صوتي مقيَّم: إعلان، تمهيد برنامج، أو خبر.',
    hours:'6 ساعات', note:'' },
  { n:'03', phase:2, standalone:false, badge:'',
    title:'الصحافة والتحرير الإعلامي',
    sub:'مرحلة التخصص — الكتابة والتحرير الصحفي الاحترافي.',
    chips:['الخبر','التقرير','التحقيق','المقال','التحرير الرقمي','العناوين','التحقق من الأخبار'],
    project:'تقرير صحفي مكتوب مع تحقيق من مصادر متعددة.',
    hours:'12 ساعة', note:'' },
  { n:'04', phase:2, standalone:false, badge:'',
    title:'المراسل الميداني',
    sub:'مرحلة التخصص — التغطية الميدانية والتقارير المصوَّرة.',
    chips:['الوقفة الميدانية','التقارير','التغطيات','البث المباشر','صناعة القصة','السلامة المهنية'],
    project:'تقرير ميداني مصوَّر يُجهَّز كاملاً: تصوير وتعليق وإخراج.',
    hours:'12 ساعة', note:'' },
  { n:'05', phase:2, standalone:false, badge:'',
    title:'صناعة المحتوى الإعلامي',
    sub:'مرحلة التخصص — المحتوى الرقمي وصناعة الريلز.',
    chips:['كتابة السكريبت','الريلز','صناعة الهوية','تصوير المحتوى','السرد القصصي','استراتيجيات النشر'],
    project:'سلسلة محتوى من ثلاث قطع لعلامة تجارية أو موضوع إعلامي.',
    hours:'10 ساعات', note:'' },
  { n:'06', phase:2, standalone:false, badge:'',
    title:'البودكاست',
    sub:'مرحلة التخصص — إعداد الحلقات وإدارة الحوار وصناعة الصوت.',
    chips:['إعداد الحلقة','كتابة الأسئلة','إدارة الحوار','التسجيل','المونتاج الأساسي','نشر البودكاست'],
    project:'حلقة بودكاست منتَجة ومنشورة على إحدى المنصات.',
    hours:'10 ساعات', note:'' },
  { n:'07', phase:2, standalone:false, badge:'',
    title:'الإعلام الرقمي والمتحدث الرسمي',
    sub:'مرحلة التخصص — التصريحات وإدارة الأزمات الإعلامية.',
    chips:['التعامل مع الإعلام','المؤتمرات الصحفية','التصريحات','إدارة الأزمات الإعلامية','بناء الرسائل'],
    project:'محاكاة مؤتمر صحفي مع إدارة موقف أزمة.',
    hours:'10 ساعات', note:'' },
  { n:'08', phase:2, standalone:false, badge:'',
    title:'الإنتاج الإعلامي',
    sub:'مرحلة التخصص — الإخراج والإنتاج المرئي الكامل.',
    chips:['التخطيط للإنتاج','كتابة السيناريو','التصوير','الإخراج','أساسيات المونتاج','إدارة فريق الإنتاج'],
    project:'فيلم قصير أو مقطع إعلامي منتَج بالكامل.',
    hours:'12 ساعة', note:'' },
  { n:'09', phase:2, standalone:false, badge:'',
    title:'الذكاء الاصطناعي للإعلاميين',
    sub:'مرحلة التخصص — أدوات المستقبل في الإعلام.',
    chips:['كتابة الأخبار بالذكاء الاصطناعي','صناعة السكريبت','تحويل النص إلى صوت','توليد الصور','أدوات المونتاج','الترجمة والدبلجة','التحقق من المعلومات'],
    project:'مشروع إعلامي كامل منتَج بأدوات الذكاء الاصطناعي.',
    hours:'8 ساعات', note:'' },
  { n:'10', phase:3, standalone:false, badge:'',
    title:'القيادة الإعلامية',
    sub:'مرحلة القيادة — الإدارة والاستراتيجية وبناء المؤسسة الإعلامية.',
    chips:['إدارة المؤسسات الإعلامية','التخطيط الإعلامي','إدارة فرق العمل','بناء الهوية الإعلامية','إدارة المشاريع الإعلامية'],
    project:'خطة إعلامية متكاملة لمؤسسة أو مشروع.',
    hours:'10 ساعات', note:'' },
] as const;

const PHASE_BANDS = [
  { from:0, to:2,  label:'المرحلة الأولى',  sub:'التأسيس · 22 ساعة',          color: GLD      },
  { from:2, to:9,  label:'المرحلة الثانية', sub:'التخصّصات · 62 ساعة',         color: '#67e8f9' },
  { from:9, to:10, label:'المرحلة الثالثة', sub:'القيادة الإعلامية · 10 ساعات', color: '#a78bfa' },
];

const PORTFOLIO = [
  { n:'01', title:'تقرير مرئي',    kind:'تقديم',   hot:false },
  { n:'02', title:'تقرير صحفي',   kind:'صحافة',   hot:false },
  { n:'03', title:'تقرير ميداني', kind:'ميدان',   hot:true  },
  { n:'04', title:'سلسلة محتوى',  kind:'محتوى',   hot:false },
  { n:'05', title:'حلقة بودكاست', kind:'بودكاست', hot:true  },
  { n:'06', title:'محاكاة صحفية', kind:'محاكاة',  hot:false },
  { n:'07', title:'فيلم إعلامي',  kind:'إنتاج',   hot:true  },
  { n:'08', title:'مشروع الذكاء', kind:'AI',       hot:false },
];

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

const TRAINERS = [
  { name:'رامي أبو جبارة',
    role:'صحفي تلفزيوني — مدرّب الإعلامي الشامل',
    bio:'خبرة تمتد لـ 17 عاماً في الصحافة التلفزيونية والقيادة التحريرية؛ تنقّل خلالها بين كبرى المؤسسات الإعلامية مثل Sky News عربية، وصولاً إلى رئاسة تحرير «الشرق مع Bloomberg».',
    chips:['الصحافة التلفزيونية','القيادة التحريرية','Sky News عربية','الشرق مع Bloomberg'],
    img: instructorRami, imgPosition: '50% 15%' },
  { name:'أ. رنا محمد العزام',
    role:'مدرّبة الأداء والتحرير اللغوي والتقديم التلفزيوني',
    bio:'إعلامية ومدربة أداء متخصصة في التقديم التلفزيوني والتحرير اللغوي وتأهيل المتحدث الرسمي — تُدرّس محطتَي التأسيس في المسار وتُشرف على تطوير الحضور الإعلامي لكل متدرّب.',
    chips:['الإعلام التلفزيوني','التحرير اللغوي','المتحدث الرسمي','الحضور الإعلامي'],
    img: instructorRana, imgPosition: '50% 12%' },
];

const OUTCOMES = [
  { n:'01', title:'أداء وحضور مضبوطان',     desc:'إلقاء نظيف، لغة جسد واعية، ثقة حقيقية أمام الكاميرا — لا ارتجالاً بل تأسيساً.' },
  { n:'02', title:'تخصص مهني محدد',          desc:'تتخرّج بعنوان واضح: مراسل، معدّ، صانع محتوى، أو متحدث رسمي — لا مجرد "مهتم بالإعلام".' },
  { n:'03', title:'محفظة أعمال احترافية',     desc:'ثمانية مشاريع مصوَّرة موثَّقة على مدار المسار، مع فيلم إعلامي مكتمل يُمثّل مشروع التخرّج.' },
  { n:'04', title:'شهادة معتمدة من وجيز',     desc:'شهادة المسار صادرة عن كاسيت أكاديمي ومعتمدة من وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط.' },
];

const FAQS = [
  { q:'هل يمكن اختيار بعض المحطات فقط؟',
    a:'لا، ولذلك مقصود. المسار مصمَّم ليخرّج إعلامياً متكاملاً قادراً على الكتابة والتقديم والتغطية والإنتاج، لأن سوق الإعلام اليوم لا يطلب مهارة واحدة بمعزل عن سواها. إن كنتَ تبحث عن مهارة محددة، فالدورة المنفردة هي الخيار الأنسب.' },
  { q:'التعليق الصوتي ثلاث جلسات فقط — لماذا؟',
    a:'لأن هدفه هنا محدود: ضبط تنفّسك ومخارج حروفك ونبرتك تمهيداً للكاميرا والاستوديو في بقية المحطات. أما إن كان هدفك أن تصبح معلّقاً صوتياً محترفاً، فذلك تخصص مستقل يستلزم دورة أعمق.' },
  { q:'أنا مبتدئ تماماً — هل المسار مناسب لي؟',
    a:'نعم، وهذا بالضبط ما بُني عليه المسار. المرحلة التأسيسية لا تفترض أي خبرة سابقة، وتبني معك الإلقاء والحضور والصوت من البداية قبل الدخول إلى التخصصات.' },
  { q:'ما الفرق بين محطة القيادة وباقي المحطات؟',
    a:'المحطات 01–09 تُعلّمك التنفيذ: التقديم، الكتابة، التغطية، والإنتاج. أما المحطة 10 فهي مستوى مختلف تُعلّمك الإدارة: مؤسسة، فريق، خطة، وهوية إعلامية.' },
  { q:'درستُ إحدى الدورات سابقاً — هل تُحتسب لي؟',
    a:'نعم. إن أكملتَ دورة المذيع المحترف معنا، تُخصم قيمتها من سعر المسار ولن تُعيد دراستها، إذ هي نفسها المحطة 01. تحدّث مع ياقوت عبر واتساب لمراجعة سجلك.' },
  { q:'ما الفرق بين الحضوري والمباشر التفاعلي؟',
    a:'المنهج والمدرّبون ومستوى التدريب واحد في الحالتين. الفرق في بيئة التعلّم: في الحضوري تتدرّب وتصوَّر داخل استوديو الإنتاج في كاسيت مع تصحيح فوري. وفي المباشر تتدرّب من موقعك عبر جلسات حيّة مع المدرّب وتُحفظ لك التسجيلات.' },
  { q:'من أيّ جهة معتمدة الشهادة؟',
    a:'الشهادة صادرة عن كاسيت أكاديمي ومعتمدة من تطبيق وجيز، أكبر مكتبة صوتية وبودكاست في الشرق الأوسط.' },
  { q:'هل الدفع آمن؟ وهل التقسيط متاح؟',
    a:'الدفع إلكتروني عبر Stripe (بوابة دفع آمنة ومشفّرة). والتقسيط متاح: تُسدَّد دفعة أولى لتثبيت المقعد، وتتوزّع الدفعات المتبقية على مراحل المسار.' },
];

/* ── sub-components ─────────────────────────────────────────────── */
type StationType = typeof STATIONS[number];

function StationItem({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const isPhase3 = s.phase === 3;
  const ac = isPhase3 ? '#a78bfa' : GLD;
  const acBorder = isPhase3 ? 'rgba(167,139,250,.45)' : (open ? GL : CBR);
  return (
    <div
      role="button" tabIndex={0}
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: open ? `linear-gradient(160deg, ${isPhase3 ? 'rgba(167,139,250,.09)' : GS}, rgba(255,255,255,0.025) 60%)` : CARD,
        border: `1px solid ${acBorder}`,
        borderRadius: 14, padding: '18px 22px', cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          flexShrink: 0, width: 42, height: 42, borderRadius: 12,
          background: 'rgba(0,0,0,.22)',
          border: `1px solid ${acBorder}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 14, fontWeight: 700, color: ac,
        }}>{s.n}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 16.5, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {s.standalone && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                متاحة منفردةً
              </span>
            )}
            {isPhase3 && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.35)', color: '#c4b5fd', padding: '2px 9px', borderRadius: 999 }}>
                القيادة
              </span>
            )}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.7 }}>{s.sub}</div>
        </div>
        <ChevronDown size={16} color={ac}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0, marginTop: 12 }} />
      </div>
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${CBR}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
            {(s.chips as readonly string[]).map(chip => (
              <span key={chip} style={{ fontFamily: F, fontSize: 12, color: LT, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '4px 11px', borderRadius: 999 }}>{chip}</span>
            ))}
          </div>
          <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.75, marginBottom: 10 }}>
            <span style={{ color: ac, fontWeight: 700 }}>المشروع التطبيقي: </span>{s.project}
          </div>
          {s.note && <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 8 }}>{s.note}</div>}
          <div style={{ fontFamily: F, fontSize: 12, color: MUT }}>⏱ {s.hours}</div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: CARD, border: `1px solid ${open ? GL : CBR}`, borderRadius: 14, overflow: 'hidden', marginBottom: 10, transition: 'border-color .2s' }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: OFF, textAlign: 'right' }}>{q}</span>
        <span aria-hidden="true" style={{ color: GLD, fontSize: 22, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 22px 18px', fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85 }}>{a}</div>
      )}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────────── */
const scrollToCheckout = () => {
  document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function MasarElamiPage() {
  const [openIdx,       setOpenIdx]       = useState<number | null>(null);
  const [checkoutMode,  setCheckoutMode]  = useState<'onsite' | 'live'>('onsite');
  const [modalOpen, setModalOpen] = useState(false);
  const [expandAll,     setExpandAll]     = useState(false);
  const [stickyVisible, setStickyVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById('checkout');
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStickyVisible(false);
      else setStickyVisible(entry.boundingClientRect.top > 0);
    }, { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  usePageMeta({
    title: 'ماستركلاس الإعلام والأداء الإعلامي',
    description: 'مسار إعلامي متكامل: 10 محطات، 40 ساعة تدريبية، 8 مشاريع مصوَّرة. تقديم تلفزيوني، صحافة، محتوى، بودكاست، وإنتاج. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function isOpen(i: number) { return expandAll || openIdx === i; }
  function handleExpandAll() { setExpandAll(v => !v); setOpenIdx(null); }

  const WRP: React.CSSProperties = { ...INNER };
  const SH:  React.CSSProperties = { textAlign: 'center', marginBottom: 52, direction: 'rtl' };

  return (
    <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes vu-elam { 0%,100%{height:22%} 50%{height:100%} }
        @keyframes elam-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .elam-vu-bar { width:3px;border-radius:2px;background:rgba(255,193,7,.85);animation:vu-elam 1.5s ease-in-out infinite; }
        .elam-live-dot { animation:elam-pulse 2s ease-in-out infinite; }
        @media (prefers-reduced-motion:reduce){ .elam-vu-bar,.elam-live-dot{animation:none!important} }
        @media (max-width:768px) {
          .elam-hero-grid { grid-template-columns:1fr !important; }
          .elam-hero-shot { max-width:300px !important; order:-1; margin:0 auto 20px; }
          .elam-modes-grid { grid-template-columns:1fr !important; }
          .elam-aud-grid   { grid-template-columns:1fr !important; }
        }
        :focus-visible { outline:2px solid #FFC107 !important;outline-offset:3px !important;border-radius:4px !important; }
      `}</style>

      {/* ═══════════════════════════════════════
          §01 HERO
      ═══════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ padding: '0 0 88px' }}>
        <div style={WRP}>

          {/* breadcrumb */}
          <nav aria-label="مسار التنقل" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 96, marginBottom: 28 }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F, fontSize: 12.5, color: MUT, textDecoration: 'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color: 'rgba(255,255,255,.20)', fontSize: 11 }}>/</span>
            <a href="/#masterclasses" style={{ fontFamily: F, fontSize: 12.5, color: MUT, textDecoration: 'none' }}>الماستركلاسات</a>
            <span style={{ color: 'rgba(255,255,255,.20)', fontSize: 11 }}>/</span>
            <span style={{ fontFamily: F, fontSize: 12.5, color: GLD }}>المسار الإعلامي</span>
          </nav>

          <div className="elam-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.12fr .88fr', gap: 52, alignItems: 'center' }}>

            <div>
              {/* pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                  <Target size={12} strokeWidth={2.2} /> للمبتدئين والصاعدين
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(103,232,249,.08)', border: '1px solid rgba(103,232,249,.22)', color: '#67e8f9', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                  <Radio size={12} strokeWidth={2.2} /> صحافة وإعلام
                </span>
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.22, letterSpacing: -1.2, margin: 0, color: OFF }}>
                ماستركلاس الإعلام{' '}<br />
                <span style={{ color: GLD }}>والأداء الإعلامي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 560, marginTop: 16, lineHeight: 1.85 }}>
                برنامج تدريبي يأخذك من تأسيس الحضور والإلقاء إلى قيادة المؤسسة الإعلامية: 10 محطات متسلسلة، 8 مشاريع مصوَّرة في محفظتك، وفيلم إعلامي مكتمل كمشروع تخرّج — بشهادة معتمدة من وجيز.
              </p>

              {/* feature cards 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginTop: 24, maxWidth: 500 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT }}>
                  <Layers size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <b style={{ fontFamily: FP, color: OFF, fontWeight: 700 }}>10</b> محطات تدريبية متسلسلة
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT }}>
                  <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <b style={{ fontFamily: FP, color: OFF, fontWeight: 700 }}>40</b> ساعة تدريبية مكثفة
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,193,7,.11)', border: `1px solid ${GL}`, padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: GLD, fontWeight: 700 }}>
                  <CheckCircle2 size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                  <b style={{ fontFamily: FP, fontSize: 19, color: GLD, fontWeight: 900, lineHeight: 1 }}>8</b> مشاريع تطبيقية مصوَّرة
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '10px 13px', borderRadius: 11, fontFamily: F, fontSize: 13, color: LT }}>
                  <MapPin size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                  حضوري في الاستوديو أو أونلاين (Online LIVE)
                </span>
              </div>

              {/* wajeez badge */}
              <a href="https://wajeez.com" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, background: 'rgba(2,6,23,.75)', border: '1px solid rgba(255,193,7,.18)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 14, padding: '12px 16px', maxWidth: 500, textDecoration: 'none', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.42)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.18)')}>
                <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 8, background: '#fff', display: 'grid', placeContent: 'center', padding: 4 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: OFF }}>شريك الاعتماد الرسمي — تطبيق وجيز</div>
                  <div style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</div>
                </div>
              </a>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
                <button onClick={scrollToCheckout}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '13px 26px', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,193,7,.22)' }}>
                  احجز مقعدك في الماستركلاس <ArrowLeft size={14} />
                </button>
                <a href="#tree"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.05)', border: `1px solid ${CBR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 26px', borderRadius: 12, textDecoration: 'none' }}>
                  استكشف المنهج <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* hero shot */}
            <div className="elam-hero-shot" style={{ position: 'relative', maxWidth: 380, marginInline: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)', filter: 'blur(8px)', zIndex: -1 }} />
              <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, aspectRatio: '3/4', boxShadow: '0 34px 90px rgba(0,0,0,.5)' }}>
                <img src={coverMasar} alt="ماستركلاس المسار الإعلامي" fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,37,51,.95) 0%, rgba(26,37,51,.32) 30%, transparent 58%)' }} />
                <span style={{ position: 'absolute', top: 18, right: 18, zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(26,37,51,.74)', backdropFilter: 'blur(6px)', border: `1px solid ${GL}`, color: GLD, fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '7px 13px', borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD }} />
                  تصوير داخل استوديو الإنتاج
                </span>
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', zIndex: 3, padding: '22px 22px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <span style={{ fontFamily: FP, fontSize: 38, fontWeight: 700, color: GLD, lineHeight: .95 }}>8</span>
                    <span style={{ fontFamily: F, fontSize: 12.5, color: LT, marginTop: 4, display: 'block' }}>مشاريع مصوَّرة · محفظة التخرج</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 34 }}>
                    {Array.from({ length: 9 }, (_, i) => (
                      <span key={i} className="elam-vu-bar" style={{ animationDelay: `${i * 0.11}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §02 FOR WHOM — 9-item audience checkmark grid
      ═══════════════════════════════════════ */}
      <section className="sec" style={{ padding: '96px 0', borderTop: `1px solid ${CBR}` }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              هذا المسار لك
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, letterSpacing: -.5, margin: '18px 0 0', color: OFF }}>
              هذه الرحلة لك إذا كنت تريد أن <span style={{ color: GLD }}>...</span>
            </h2>
          </div>
          <div className="elam-aud-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 880, margin: '0 auto' }}>
            {AUDIENCE_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, background: CARD, border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px 18px' }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: GLD, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                  <CheckCircle2 size={13} color="#1A1206" strokeWidth={2.5} />
                </span>
                <span style={{ fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.75 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §03 PORTFOLIO — cream section (identical structure to Soti)
      ═══════════════════════════════════════ */}
      <section className="sec sec--cream" style={{ padding: '96px 0' }}>
        <div className="geo geo--halftone" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ ...WRP, position: 'relative', zIndex: 3 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(138,98,0,.09)', border: '1px solid rgba(138,98,0,.28)', color: '#8A6200', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>محفظة الأعمال</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, letterSpacing: -.5, margin: '18px 0 0', color: INK }}>
              تتخرّج <span style={{ color: '#8A6200' }}>بمحفظة</span> لا بشهادة
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: INK2, maxWidth: 680, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              أصحاب العمل لا يسألون عن شهادتك، بل يطلبون أن يشاهدوا أعمالك. هذه محفظتك عند إتمام الماستركلاس.
            </p>
          </div>

          {/* portfolio table */}
          <div style={{ background: '#fff', border: '1px solid rgba(24,32,47,.10)', borderRadius: 22, boxShadow: '0 22px 60px rgba(24,32,47,.12)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(24,32,47,.10)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: INK }}>محفظتك الإعلامية</div>
                <div style={{ fontFamily: F, fontSize: 13, color: INK2, marginTop: 3 }}>ثمانية مشاريع مصوَّرة من المحطات، ومشروع التخرّج — فيلم إعلامي مكتمل</div>
              </div>
              <span style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: '#8A6200', border: '1px solid rgba(138,98,0,.32)', background: 'rgba(138,98,0,.07)', padding: '7px 15px', borderRadius: 999, whiteSpace: 'nowrap' }}>8 مشاريع</span>
            </div>
            {PORTFOLIO.map((trk, i) => (
              <div key={trk.n} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 108px 130px', gap: 14, alignItems: 'center',
                padding: '13px 28px', borderBottom: '1px solid rgba(24,32,47,.10)',
                background: trk.hot ? 'rgba(255,193,7,.10)' : 'transparent',
                transition: 'background .2s',
              }}>
                <span style={{ fontFamily: FP, fontSize: 12.5, fontWeight: 700, color: trk.hot ? '#8A6200' : INK2 }}>{trk.n}</span>
                <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 700, color: trk.hot ? '#8A6200' : INK, lineHeight: 1.5 }}>{trk.title}</span>
                <span style={{ fontFamily: F, fontSize: 11.5, color: INK2, border: '1px solid rgba(24,32,47,.10)', background: 'rgba(24,32,47,.035)', padding: '3px 11px', borderRadius: 999, textAlign: 'center', whiteSpace: 'nowrap' }}>{trk.kind}</span>
                <span style={{ color: trk.hot ? 'rgba(138,98,0,.78)' : 'rgba(138,98,0,.34)', height: 26, display: 'block' }}
                  dangerouslySetInnerHTML={{ __html: waveThumb(50 + i) }} />
              </div>
            ))}
            {/* graduation row */}
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 108px 130px', gap: 14, alignItems: 'center', padding: '14px 28px', background: 'linear-gradient(90deg, rgba(255,193,7,.24), rgba(255,193,7,.08))', borderTop: '1px solid rgba(138,98,0,.28)' }}>
              <span style={{ fontFamily: FP, fontSize: 15, fontWeight: 700, color: '#8A6200' }}>★</span>
              <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: '#8A6200' }}>مشروع التخرّج · فيلم إعلامي مكتمل</span>
              <span style={{ fontFamily: F, fontSize: 11.5, color: '#8A6200', border: '1px solid rgba(138,98,0,.32)', background: 'rgba(138,98,0,.08)', padding: '3px 11px', borderRadius: 999, textAlign: 'center' }}>التخرّج</span>
              <span style={{ color: 'rgba(138,98,0,.9)', height: 26, display: 'block' }}
                dangerouslySetInnerHTML={{ __html: waveThumb(999) }} />
            </div>
            <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(24,32,47,.10)', fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8 }}>
              <strong style={{ color: INK }}>الأعمال المميّزة بالذهبي</strong> هي الأكثر أثراً في السوق: التقرير الميداني يثبت قدرتك في العمل الحقيقي، والفيلم الإعلامي أثقل قطعة في محفظتك، وحلقة البودكاست دليلٌ على تعدّد أدواتك الإعلامية.
            </div>
          </div>

          {/* outcome cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 40 }}>
            {OUTCOMES.map(oc => (
              <div key={oc.n} style={{ background: 'rgba(24,32,47,.06)', border: '1px solid rgba(24,32,47,.10)', borderRadius: 18, padding: '30px 26px' }}>
                <span style={{ display: 'block', fontFamily: FP, fontSize: 44, fontWeight: 700, lineHeight: 1, color: '#8A6200', opacity: .28 }}>{oc.n}</span>
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(24,32,47,.10)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 3, background: '#8A6200', borderRadius: 2 }} />
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, lineHeight: 1.5, color: INK, marginBottom: 10 }}>{oc.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8 }}>{oc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* wajeez strip */}
          <div style={{ marginTop: 40, border: '1px solid rgba(30,122,133,.40)', borderRadius: 20, background: 'linear-gradient(150deg, rgba(30,122,133,.10), rgba(24,32,47,.04) 56%)', padding: 'clamp(22px,3vw,34px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', marginBottom: 22 }}>
              <div style={{ flexShrink: 0, width: 54, height: 54, borderRadius: 12, background: '#fff', display: 'grid', placeContent: 'center', padding: 7 }}>
                <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(17px,2.2vw,22px)', lineHeight: 1.35, margin: 0, color: INK }}>
                  من متدرّب <span style={{ color: '#1e7a85' }}>إلى إعلامي معتمد من وجيز</span>
                </h3>
                <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, marginTop: 5 }}>
                  وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط — هي جهة الاعتماد الرسمية للمسار.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
              {[
                { n:'STEP 01', t:'تتخرّج بمحفظة احترافية', d:'ثمانية مشاريع مصوَّرة وفيلم إعلامي مكتمل — مبنيّ على مواصفات القبول في المؤسسات الإعلامية.' },
                { n:'STEP 02', t:'تُقيَّم أعمالك فنياً',   d:'تُسلّم مشاريعك للمراجعة الفنية وتصلك ملاحظات محدّدة قبل التسليم النهائي.' },
                { n:'STEP 03', t:'شهادة معتمدة من وجيز',   d:'باجتيازك المسار تحصل على شهادة كاسيت أكاديمي المعتمدة من تطبيق وجيز.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background: 'rgba(24,32,47,.05)', border: '1px solid rgba(24,32,47,.09)', borderRadius: 12, padding: '16px 15px' }}>
                  <div style={{ fontFamily: FP, fontSize: 11, fontWeight: 700, color: '#1e7a85', letterSpacing: 1.2, marginBottom: 7 }}>{n}</div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, marginBottom: 6, color: INK, lineHeight: 1.5 }}>{t}</h4>
                  <p style={{ fontFamily: F, fontSize: 12.5, color: INK2, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §04 CURRICULUM — 10 محطات
      ═══════════════════════════════════════ */}
      <section id="tree" className="sec sec--tree" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              منهج الماستركلاس
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, letterSpacing: -.5, margin: '18px 0 0', color: OFF }}>
              الطريق من الحضور <span style={{ color: GLD }}>إلى القيادة الإعلامية</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 680, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              عشر محطات على ثلاث مراحل، مُختَمة بفيلم إعلامي مكتمل كمشروع التخرّج.
              كلّ محطة إلزامية وبترتيب مقصود.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 900, margin: '0 auto 18px' }}>
            <button onClick={handleExpandAll}
              style={{ background: CARD, border: `1px solid ${CBR}`, color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 999, cursor: 'pointer' }}>
              {expandAll ? 'إغلاق جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          {PHASE_BANDS.map(band => (
            <div key={band.label} style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0', margin: '18px 0 12px' }}>
                <div style={{ flex: 1, height: 1, background: CBR }} />
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: MUT, whiteSpace: 'nowrap' }}>
                  {band.label} · <span style={{ color: band.color }}>{band.sub}</span>
                </span>
                <div style={{ flex: 1, height: 1, background: CBR }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STATIONS.slice(band.from, band.to).map((s, localI) => {
                  const globalI = band.from + localI;
                  return <StationItem key={s.n} s={s} open={isOpen(globalI)} onToggle={() => toggle(globalI)} />;
                })}
              </div>
            </div>
          ))}

          {/* graduation box */}
          <div style={{ maxWidth: 900, margin: '32px auto 0', background: `linear-gradient(160deg, rgba(255,193,7,.16), ${CARD} 54%)`, border: `1px solid ${GLD}`, borderRadius: 20, padding: '32px 30px', boxShadow: `0 0 0 1px rgba(255,193,7,.18), 0 26px 70px rgba(0,0,0,.4)` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 15, background: GLD, color: '#1A1206', display: 'grid', placeContent: 'center', fontSize: 22, boxShadow: '0 10px 26px rgba(255,193,7,.32)' }}>★</div>
                <div>
                  <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, lineHeight: 1.4, margin: 0, color: OFF }}>مشروع التخرّج — الفيلم الإعلامي المكتمل</h3>
                  <p style={{ fontFamily: F, fontSize: 14, color: LT, marginTop: 8, maxWidth: 540, lineHeight: 1.8 }}>
                    بعد إتمام المحطات العشر تبدأ مرحلة الإنتاج الفعلي. ليست واجبات دراسية، بل تجربة تصوير واستوديو حقيقية تخرج منها بفيلم إعلامي احترافي جاهز للعرض والسوق.
                  </p>
                </div>
              </div>
              <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD, background: 'rgba(0,0,0,.3)', border: `1px solid ${GL}`, padding: '7px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                إنتاج داخل الاستوديو
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { n:'01', t:'اختيار الموضوع وكتابة السيناريو', d:'تحديد موضوع الفيلم وبناء السيناريو الكامل مع المدرّب.' },
                { n:'02', t:'التصوير الميداني والاستوديو',       d:'تصوير مشاهد الفيلم بإشراف مباشر من المدرّب والفريق التقني.' },
                { n:'03', t:'المونتاج والإخراج النهائي',         d:'تجميع المشاهد وإخراج الفيلم بمعايير البثّ الاحترافي.' },
                { n:'★',  t:'التسليم والعرض أمام لجنة التقييم',  d:'عرض الفيلم على لجنة مدربين وتلقّي التقييم والشهادة.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background: 'rgba(0,0,0,.24)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px 15px' }}>
                  <div style={{ fontFamily: FP, fontSize: 11.5, fontWeight: 700, color: GLD, letterSpacing: 1, marginBottom: 6 }}>الجلسة {n}</div>
                  <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, marginBottom: 6, color: OFF }}>{t}</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, lineHeight: 1.7 }}>{d}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: F, fontSize: 14, color: LT, marginTop: 20, lineHeight: 1.8 }}>
              <strong style={{ color: GLD }}>المخرج النهائي:</strong> فيلم إعلامي مكتمل (وثائقي قصير أو تقرير موسّع) مُنتَج ومُخرَج بالكامل، ليكون أقوى قطعة في محفظتك أمام أصحاب العمل.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <button onClick={scrollToCheckout}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '14px 30px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,193,7,.24)' }}>
              احجز مقعدك في الماستركلاس <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §05 MODES — أسلوب الدراسة + الفوج
      ═══════════════════════════════════════ */}
      <section className="sec sec--modes" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              أسلوب الدراسة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              اختر <span style={{ color: GLD }}>أسلوب تعلّمك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 620, marginTop: 14, marginInline: 'auto' }}>
              نفس المنهج، ونفس المدرّبين، ونفس مستوى التدريب — اختر الطريقة التي تناسبك.
            </p>
          </div>

          <div className="elam-modes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 52 }}>

            {/* حضوري */}
            <div style={{ background: CARD, border: `1px solid rgba(255,193,7,.22)`, borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: 'clamp(22px,2.5vw,28px)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: GLD, display: 'grid', placeContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(255,193,7,.28)' }}>
                    <MapPin size={18} color="#1A1206" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>حضوري — استوديو كاسيت</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>حضور فعلي في عمّان</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 9, margin: 0, padding: 0 }}>
                  {[
                    'تدريب مباشر داخل استوديو الإنتاج في كاسيت',
                    'تصوير وتطبيق وتصحيح فوري مع المدرّب',
                    'تعامل مباشر مع المعدات وبيئة الإنتاج الحقيقية',
                    'تفاعل مع المدرّبين وزملاء المسار',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: GLD, fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ borderTop: `1px solid rgba(255,193,7,.18)`, background: 'rgba(255,193,7,.05)', padding: '16px clamp(18px,2.5vw,24px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: GLD, letterSpacing: .5 }}>الفوج القادم</span>
                </div>
                <div style={{ display: 'grid', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CalendarDays size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT }}>
                      <span style={{ color: MUT, marginInlineEnd: 4 }}>يبدأ</span>
                      <strong style={{ color: OFF }}>الثلاثاء، 15 أيلول</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT }}>يومان أسبوعياً · الأحد والثلاثاء</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: '#f87171', fontWeight: 700 }}>المقاعد محدودة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* مباشر تفاعلي */}
            <div style={{ background: CARD, border: `1px solid rgba(103,232,249,.22)`, borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: 'clamp(22px,2.5vw,28px)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#67e8f9', display: 'grid', placeContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(103,232,249,.22)' }}>
                    <Wifi size={18} color="#1A1206" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>مباشر تفاعلي (Online LIVE)</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>من أي مكان في العالم العربي</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 9, margin: 0, padding: 0 }}>
                  {[
                    'جلسات مباشرة مع المدرّب في الوقت الفعلي',
                    'تطبيق وتقييم فردي أثناء التدريب',
                    'تسجيلات الجلسات متاحة للمراجعة',
                    'مشروع التخرّج بإشراف مباشر مع فريق الإنتاج',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: '#67e8f9', fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ borderTop: `1px solid rgba(103,232,249,.18)`, background: 'rgba(103,232,249,.05)', padding: '16px clamp(18px,2.5vw,24px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#67e8f9', flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: '#67e8f9', letterSpacing: .5 }}>الفوج القادم</span>
                </div>
                <div style={{ display: 'grid', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CalendarDays size={14} color="#67e8f9" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT }}>
                      <span style={{ color: MUT, marginInlineEnd: 4 }}>يبدأ</span>
                      <strong style={{ color: OFF }}>الأربعاء، 16 أيلول</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Clock size={14} color="#67e8f9" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT }}>يومان أسبوعياً · الأربعاء والسبت</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={14} color="#67e8f9" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: '#f87171', fontWeight: 700 }}>المقاعد محدودة</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §06 TRAINERS — circular avatar cards (identical to Soti)
      ═══════════════════════════════════════ */}
      <section className="sec sec--trainers" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              خبراء ماستركلاس الإعلام
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              مَن يُرشدك في <span style={{ color: GLD }}>هذا المسار؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 620, marginTop: 14, marginInline: 'auto' }}>
              إعلاميون ومدرّبون من داخل بيئة العمل الحقيقية — يمنحونك خبرة الكاميرا والاستوديو وتوجيه الأداء طوال رحلتك التدريبية.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 52 }}>
            {TRAINERS.map(tr => (
              <article key={tr.name} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(22px,2.5vw,30px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="tr-ava">
                    <img src={tr.img} alt={tr.name} style={{ objectPosition: tr.imgPosition }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF }}>{tr.name}</div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: GLD, marginTop: 4, lineHeight: 1.5 }}>{tr.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.85, flex: 1 }}>{tr.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {tr.chips.map(c => (
                    <span key={c} style={{ fontFamily: F, fontSize: 12, color: LT, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '4px 11px', borderRadius: 999 }}>{c}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href={WA_TRACK} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              اسأل عن المدرّبين <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §07 CHECKOUT — interactive pricing card (identical to Soti)
      ═══════════════════════════════════════ */}
      {/* ⑦ استفسار وتسجيل */}
      {/* ⑦ التسجيل والدفع */}
      <section id="checkout" className="sec sec--access" style={{ padding: '96px 0', scrollMarginTop: 80 }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD }} />
              خطوتك نحو الإعلام
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, margin:'18px 0 0', color:OFF }}>
              استثمر في <span style={{ color:GLD }}>مستقبلك الإعلامي</span>
            </h2>
          </div>

          {/* ── اختيار المسار ── */}
          <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:36, flexWrap:'wrap' }}>
            {(['onsite', 'live'] as const).map(mode => {
              const sel = checkoutMode === mode;
              return (
                <button key={mode} onClick={() => setCheckoutMode(mode)}
                  style={{ fontFamily:F, fontWeight:700, fontSize:15, padding:'12px 28px', borderRadius:12, border:`2px solid ${sel ? GLD : CBR}`, background:sel ? GS : 'transparent', color:sel ? GLD : MUT, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                  {mode === 'onsite' ? <><MapPin size={15} /> حضوري</> : <><Wifi size={15} /> مباشر أونلاين</>}
                </button>
              );
            })}
          </div>

          <div style={{ maxWidth:600, marginInline:'auto', background:'#131B27', border:`1px solid ${GL}`, borderRadius:26, padding:'clamp(24px,3.5vw,36px)', boxShadow:'0 0 0 1px rgba(255,193,7,.12), 0 34px 70px rgba(13,11,20,.45)' }}>
            {/* السعر */}
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <span style={{ fontFamily:FP, fontWeight:800, fontSize:56, color:GLD }}>
                {checkoutMode === 'onsite' ? '700' : '1000'}
              </span>
              <span style={{ fontFamily:F, fontWeight:600, fontSize:18, color:MUT, marginInlineStart:8 }}>
                {checkoutMode === 'onsite' ? 'دينار أردني' : 'دولار أمريكي'}
              </span>
            </div>

            {/* المميزات */}
            {(checkoutMode === 'onsite' ? [
              '10 محطات تدريبية متسلسلة',
              '8 مشاريع إعلامية مصوَّرة',
              'شهادة معتمدة من تطبيق وجيز',
              'فيلم إعلامي مكتمل في محفظتك',
              'تسجيل داخل استوديو الإنتاج',
            ] : [
              '10 محطات تدريبية متسلسلة',
              '8 مشاريع إعلامية مصوَّرة',
              'شهادة معتمدة من تطبيق وجيز',
              'فيلم إعلامي مكتمل في محفظتك',
              'جلسات تفاعلية مباشرة أونلاين',
            ]).map((feat, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.03)', border:`1px solid ${CBR}`, borderRadius:10, padding:'10px 14px', marginBottom:8 }}>
                <CheckCircle2 size={15} color={GLD} strokeWidth={2.5} />
                <span style={{ fontFamily:F, fontSize:14, color:LT }}>{feat}</span>
              </div>
            ))}

            {/* ضمان الجلسة الأولى */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:13, background:'rgba(255,193,7,.07)', border:'1px solid rgba(255,193,7,.26)', borderRadius:16, padding:'16px 18px', margin:'18px 0' }}>
              <ShieldCheck size={22} color={GLD} strokeWidth={2} style={{ flexShrink:0, marginTop:2 }} />
              <div>
                <div style={{ fontFamily:F, fontWeight:800, fontSize:14, color:OFF, marginBottom:5 }}>ضمان الجلسة الأولى — Risk Reversal</div>
                <p style={{ fontFamily:F, fontSize:13, color:LT, lineHeight:1.8, margin:0 }}>
                  جرّب الجلسة الأولى كاملة. إن شعرت أنّ الماستركلاس لا يلبّي توقّعاتك، اطلب استرداداً كاملاً لرسومك خلال 24 ساعة من انتهائها — <strong style={{ color:OFF }}>دون أسئلة ولا شروط</strong>.
                </p>
              </div>
            </div>

            {/* إمكانية التقسيط — متاحة للمسارين */}
            <div style={{ padding:'14px 18px', borderRadius:12, background:'rgba(255,193,7,0.08)', border:'1px solid rgba(255,193,7,0.22)', margin:'16px 0 22px' }}>
              <p style={{ fontFamily:F, fontSize:13.5, color:GLD, margin:0, lineHeight:1.7 }}>
                <strong>إمكانية التقسيط:</strong>{' '}
                {checkoutMode === 'onsite'
                  ? 'بإمكانك دفع 50 ديناراً الآن وإكمال المبلغ قبل بدء الفوج.'
                  : 'بإمكانك دفع $70 الآن وإكمال المبلغ على دفعتين عبر Stripe.'}
              </p>
            </div>

            {/* زر الحجز */}
            <button onClick={() => setModalOpen(true)}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', boxSizing:'border-box', background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:16, padding:'16px 24px', borderRadius:14, border:'none', cursor:'pointer', boxShadow:'0 10px 30px rgba(255,193,7,.28)', marginBottom:14 }}>
              <Lock size={16} />
              احجز مقعدك — {checkoutMode === 'onsite' ? 'ادفع 50 ديناراً الآن' : 'ادفع $70 الآن'}
              <ArrowLeft size={14} />
            </button>

            {/* الأمان */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:F, fontSize:12, color:MUT }}>
                <ShieldCheck size={12} color={MUT} strokeWidth={2} />
                معاملة آمنة ومشفّرة 100% عبر Stripe
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §08 CONSULTATION — WhatsApp chat mockup (identical to Soti)
      ═══════════════════════════════════════ */}
      <section className="sec sec--consult" style={{ padding: '0 0 88px' }}>
        <div style={WRP}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12, fontWeight: 700, padding: '5px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
              استشارة مجانية · دون التزام
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(24px,3.4vw,36px)', lineHeight: 1.4, color: OFF, margin: '16px 0 10px' }}>
              قبل أن تسجّل، تحدّث مع <span style={{ color: GLD }}>مستشارتك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, lineHeight: 1.75, maxWidth: 520, marginInline: 'auto' }}>
              جلسة قصيرة على واتساب تُحدَّد فيها نقطة بدايتك — لكلّ مسار مستشارة مخصّصة.
            </p>
          </div>

          {/* advisor toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
            {[
              { mode: 'onsite' as const, label: 'الحضوري', img: advisorAya,    name: 'آية القماز' },
              { mode: 'live'   as const, label: 'المباشر', img: advisorYaqout, name: 'ياقوت خشاشنة' },
            ].map(({ mode, label, img, name }) => (
              <button key={mode} onClick={() => setCheckoutMode(mode)} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                background: checkoutMode === mode ? GS : 'transparent',
                border: `1px solid ${checkoutMode === mode ? GL : CBR}`,
                borderRadius: 999, padding: '7px 16px 7px 10px', cursor: 'pointer',
              }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: checkoutMode === mode ? `2px solid ${GLD}` : '2px solid transparent' }}>
                  <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: checkoutMode === mode ? GLD : MUT }}>{label}</span>
              </button>
            ))}
          </div>

          {/* WhatsApp chat mockup */}
          {(() => {
            const isOnsite = checkoutMode === 'onsite';
            const advisor = isOnsite
              ? { name: 'آية القماز', role: 'مستشارة المسار الحضوري', img: advisorAya,
                  msg: 'أهلاً 👋 أنا آية، مستشارة ماستركلاس الإعلام الحضوري. أخبريني عن طموحك الإعلامي — وأساعدك تختاري نقطة البداية الصح.',
                  link: WA_AYA_LINK }
              : { name: 'ياقوت خشاشنة', role: 'مستشارة المسار المباشر', img: advisorYaqout,
                  msg: 'أهلاً 👋 أنا ياقوت، مستشارة ماستركلاس الإعلام المباشر. أخبريني عن طموحك الإعلامي — وأساعدك تختاري نقطة البداية الصح.',
                  link: WA_CONSULT };
            return (
              <div style={{ maxWidth: 480, marginInline: 'auto', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ background: '#1F2C34', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #25D366' }}>
                    <img src={advisor.img} alt={advisor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontWeight: 700, fontSize: 14.5, color: '#E9EEF1', lineHeight: 1.3 }}>{advisor.name}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: '#8696A0', marginTop: 1 }}>{advisor.role}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#25D366', boxShadow: '0 0 6px #25D366' }} />
                    <span style={{ fontFamily: F, fontSize: 11, color: '#25D366', fontWeight: 600 }}>متاحة</span>
                  </div>
                </div>
                <div style={{ background: '#0B141A', padding: '20px 16px 16px', minHeight: 140, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', maxWidth: '82%', background: '#1F2C34', borderRadius: '0 14px 14px 14px', padding: '10px 14px 8px', marginRight: 'auto' }}>
                    <div style={{ position: 'absolute', top: 0, right: '100%', width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 8px 8px 0', borderColor: 'transparent #1F2C34 transparent transparent' }} />
                    <p style={{ fontFamily: F, fontSize: 14.5, color: '#E9EEF1', lineHeight: 1.7, margin: 0 }} dir="rtl">{advisor.msg}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 5 }}>
                      <span style={{ fontFamily: F, fontSize: 10.5, color: '#8696A0' }}>الآن</span>
                      <svg width="14" height="9" viewBox="0 0 16 10" fill="none"><path d="M1 5l3.5 3.5L10 1M6 5l3.5 3.5L15 1" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
                <a href={advisor.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1F2C34', padding: '10px 12px', textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                  <div style={{ flex: 1, background: '#2A3942', borderRadius: 22, padding: '9px 16px' }}>
                    <span style={{ fontFamily: F, fontSize: 14, color: '#8696A0' }}>ابدأ المحادثة…</span>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(37,211,102,.4)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </div>
                </a>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          §09 FAQs
      ═══════════════════════════════════════ */}
      <section className="sec sec--advisor" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              أسئلة متكرّرة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              قبل أن <span style={{ color: GLD }}>تسأل</span>
            </h2>
          </div>
          <div style={{ maxWidth: 840, margin: '48px auto 0' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* PaymentModal */}

      {/* sticky CTA — mobile only */}
      {stickyVisible && (
        <div className="elam-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '10px 16px 16px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))', background: 'rgba(10,14,24,0.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={scrollToCheckout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,193,7,.28)' }}>
            <Lock size={15} />
            احجز مقعدك في الماستركلاس
            <ArrowLeft size={14} />
          </button>
        </div>
      )}
      <style>{`@media (min-width:769px) { .elam-sticky-cta { display:none !important; } }`}</style>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSlug="masar-elami"
        courseTitle="ماستركلاس الإعلام والأداء الإعلامي"
        cohortIdOnsite={305}
        cohortIdLive={306}
        cohortStartAr={checkoutMode === 'onsite' ? 'الثلاثاء، 15 أيلول 2026' : 'الأربعاء، 16 أيلول 2026'}
        cohortStartISOOnsite="2026-09-15"
        cohortStartISOLive="2026-09-16"
        cohortDays={checkoutMode === 'onsite' ? 'الأحد والثلاثاء' : 'الأربعاء والسبت'}
        cohortTimeAr={checkoutMode === 'onsite' ? '6:00 مساءً' : '7:00 مساءً'}
        cohortTrainer="رامي أبو جبارة، رنا العزام"
        priceJOD={700}
        priceUSD={1000}
        initialMode={checkoutMode}
      />
    </div>
  );
}
