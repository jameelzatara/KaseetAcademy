/**
 * صفحة ماستركلاس التعليق والأداء الصوتي — كاسيت أكاديمي
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';
import { ChevronDown, ArrowLeft, MapPin, Wifi } from 'lucide-react';
import { GOLD, OFF, F, FP, INNER, waLink } from './shared/coursePageHelpers';
import ReelsSection from '../components/ReelsSection';
import { Gold } from '../components/SectionHeader';
import wajeezLogo   from '@assets/wajeez-logo_1785688262989.png';
import heroShot     from '@assets/voiceover-track1_1785854995070.jpeg';
import trainerYasar from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import trainerOmar  from '@assets/trainer-omar_1785692015818.jpg';
import advisorImg   from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';

/* ── reel IDs ────────────────────────────────────── */
const SOTI_REEL_URLS = [
  'https://www.instagram.com/reel/DaQgWU2sONj/',
  'https://www.instagram.com/reel/DW04mgIDP6v/',
  'https://www.instagram.com/reel/DWvrH7_jH_G/',
  'https://www.instagram.com/reel/DWeE1BQjHuZ/',
  'https://www.instagram.com/reel/DU8dkRSjHAY/',
  'https://www.instagram.com/reel/DUlTk-LDDmy/',
  'https://www.instagram.com/reel/DQmcaCCDHbW/',
  'https://www.instagram.com/reel/DN5th1WDCW8/',
  'https://www.instagram.com/reel/DSUxFDODBOM/',
  'https://www.instagram.com/reel/DWlZzYmjDJp/',
  'https://www.instagram.com/reel/DYUo0GOMKuR/',
];

/* ── tokens ─────────────────────────────────────── */
const GLD  = GOLD;
const GS   = 'rgba(255,193,7,0.09)';
const GL   = 'rgba(255,193,7,0.26)';
const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const CARD = 'rgba(255,255,255,0.04)';
const CBR  = 'rgba(255,255,255,0.08)';
const INK  = '#18202F';
const INK2 = '#56617A';

const WA_PHONE_ONLINE  = '962771052222'; // ياقوت — مباشر تفاعلي
const WA_PHONE_ONSITE  = '962790234483'; // آية — حضوري

const WA_ENROLL  = waLink(WA_PHONE_ONLINE, 'مرحباً، أودّ حجز مقعدي في ماستركلاس التعليق والأداء الصوتي');
const WA_CONSULT = waLink(WA_PHONE_ONLINE, 'مرحباً، أودّ حجز استشارة تعليمية مجانية عن ماستركلاس التعليق والأداء الصوتي');
const WA_ENROLL_ONSITE  = waLink(WA_PHONE_ONSITE, 'مرحباً، أودّ حجز مقعدي في ماستركلاس التعليق والأداء الصوتي — الحضوري');
const WA_ENROLL_ONLINE  = waLink(WA_PHONE_ONLINE, 'مرحباً، أودّ حجز مقعدي في ماستركلاس التعليق والأداء الصوتي — المباشر التفاعلي');

/* ── wave helpers ────────────────────────────────── */
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


/* ── data ────────────────────────────────────────── */
const STATIONS = [
  { n:'01', phase:1, standalone:true,
    title:'أساسيات التعليق والأداء الصوتي',
    sub:'نبدأ بأن تسمع صوتك كما يسمعه الآخرون، لا كما يبلغك عبر عظام رأسك.',
    chips:['التنفّس الحجابي','مخارج الحروف','النبرات والتلوين','الإيقاع والوقفات','الاستماع النقدي','العناية بالصوت'],
    project:'تسجيل نصّ محايد نظيف، مع مقارنة موثّقة بين أدائك قبل التدريب وبعده.',
    hours:'6 ساعات', badge:'', note:'متاحة كدورة مستقلة أطول' },
  { n:'02', phase:1, standalone:true,
    title:'تمكين اللغة العربية وفنون التحرير اللغوي',
    sub:'المذيع تحميه الصورة من أثر الخطأ اللغوي؛ أمّا المعلّق فلا يملك إلا أذن المستمع.',
    chips:['سلامة اللغة','الإعراب التطبيقي','الوقف والابتداء','الأخطاء الشائعة','تشكيل النصّ','تحرير النصّ للأذن'],
    project:'قراءة نصّ مشكّل كامل دون خطأ، وتحرير نصّ ركيك ليصلح للقراءة الصوتية.',
    hours:'6 ساعات', badge:'', note:'متاحة كدورة مستقلة أطول' },
  { n:'03', phase:1, standalone:false,
    title:'التقنية والاستوديو',
    sub:'الغرفة تُسجَّل معك شئت أم أبيت؛ فأجود الأصوات في أسوأ الغرف يخرج رديئاً.',
    chips:['أنواع الميكروفونات','تجهيز مساحة التسجيل','ضبط الجين والمسافة','معالجة الضجيج','المعالجة الأساسية','مواصفات التصدير'],
    project:'مساحة تسجيل مجهّزة، وملفّ صوتي معالج بمواصفات البثّ.',
    hours:'4 ساعات', badge:'', note:'' },
  { n:'04', phase:2, standalone:false,
    title:'الإعلانات التجارية والراديو والبرومو',
    sub:'ثلاثون ثانية تحتمل مئة قرار: موضع الوقف، ومواضع الرفع، ومواضع الصمت.',
    chips:['قراءة الإعلان','الطاقة والإلحاح','البرومو الإذاعي','التاق لاين','الضبط على التوقيت','تنويعات الأداء'],
    project:'ثلاثة إعلانات بثلاث نبرات مختلفة، ثلاثون ثانية لكلٍّ منها.',
    hours:'4 ساعات', badge:'', note:'' },
  { n:'05', phase:2, standalone:false,
    title:'الوثائقي والتعليق السردي',
    sub:'غاية الأداء الوثائقي أن تختفي: صوتٌ يُنسي المستمع أنّ ثمّة من يقرأ.',
    chips:['نبرة الوثائقي','التعليق على الصورة','إدارة الأنفاس الطويلة','المزامنة مع المشهد','السرد التاريخي','الأدلّة الصوتية'],
    project:'تعليق كامل على مشهد وثائقي مدّته ثلاث دقائق.',
    hours:'4 ساعات', badge:'', note:'' },
  { n:'06', phase:2, standalone:false,
    title:'الكتب الصوتية والروايات',
    sub:'تقرأ ساعتين متّصلتين وتبقى على الشخصية نفسها والنبرة نفسها؛ أطول اختبار للنفس والذاكرة الصوتية.',
    chips:['التحمّل الصوتي','تمييز الشخصيات','السرد بصوت الراوي','إدارة الحوار الروائي','الاتّساق عبر الفصول','التصحيح والمراجعة'],
    project:'فصل كامل من رواية، من خمس عشرة إلى عشرين دقيقة بجودة النشر.',
    hours:'4 ساعات', badge:'محطة وجيز', note:'هذا المشروع أوّل عمل مؤهَّل للنشر على تطبيق وجيز.' },
  { n:'07', phase:2, standalone:false,
    title:'الدوبلاج وأداء الشخصيات',
    sub:'تعمل تحت قيدين: صوت غيرك، وحركة شفتيه؛ وبينهما ينبغي أن يبدو أداؤك طبيعياً.',
    chips:['مزامنة الشفاه','بناء الشخصية الصوتية','الدوبلاج الدرامي','أصوات الأنيميشن','شخصيات الألعاب','تعدّد الطبقات الصوتية'],
    project:'دوبلاج مشهد درامي، وثلاث شخصيات متمايزة من صوتك.',
    hours:'4 ساعات', badge:'', note:'' },
  { n:'08', phase:2, standalone:false,
    title:'التعليق التعليمي والتدريبي',
    sub:'سيستمع إليك المتعلّم ساعتين متّصلتين؛ والمهارة كلّها في أن لا يفقد تركيزه.',
    chips:['نبرة الشرح','إيقاع التعلّم','التعليق على الشرائح','محتوى التدريب المؤسسي','المناهج الصوتية','التبسيط الصوتي'],
    project:'وحدة تعليمية صوتية كاملة، جاهزة لمنصّة تعليم إلكتروني.',
    hours:'4 ساعات', badge:'', note:'' },
  { n:'09', phase:2, standalone:false,
    title:'التسجيلات المؤسسية و IVR',
    sub:'جملة واحدة يسمعها ألف عميل شهرياً؛ أدقّ عمل بأقلّ الكلمات.',
    chips:['رسائل الردّ الآلي (IVR)','قوائم الخيارات','رسائل الانتظار','التسجيلات ثنائية اللغة','الفيديو التعريفي','نبرة الهوية المؤسسية'],
    project:'حزمة IVR كاملة لشركة: ترحيب، وقوائم، وانتظار، ورسائل خارج أوقات العمل.',
    hours:'2 ساعة', badge:'', note:'' },
  { n:'10', phase:2, standalone:false,
    title:'البودكاست والمحتوى الرقمي',
    sub:'هنا لا تؤدّي دوراً، بل تتحدّث بصوتك أنت؛ وهذا أصعب من التمثيل.',
    chips:['نبرة البودكاست','الإنترو والأوترو','الإعلان المدمج','صوت المحتوى القصير','الاتّساق بين الحلقات','الحضور الصوتي الرقمي'],
    project:'حلقة بودكاست كاملة بصوتك، مع إنترو وأوترو وإعلان مدمج.',
    hours:'2 ساعة', badge:'', note:'التركيز على الأداء الصوتي. الإعداد والإنتاج موضعهما ماستركلاس الإعلام.' },
  { n:'11', phase:3, standalone:false,
    title:'الـ Demo Reel والهوية الصوتية',
    sub:'تسعون ثانية تُحدّد ما إذا كان العميل سيردّ عليك؛ وهي عملية انتقاء لا تجميع.',
    chips:['انتقاء المقاطع','بناء الـ Reel','الهوية الصوتية','الملفّ التعريفي','صفحة الأعمال','التسويق الذاتي'],
    project:'ملفّ تعريفي احترافي جاهز للإرسال إلى العملاء.',
    hours:'2 ساعة', badge:'', note:'' },
  { n:'12', phase:3, standalone:false,
    title:'احتراف السوق: التسعير والعقود',
    sub:'الصوت الجيّد وحده لا يكفي؛ ما ينقصك أن تعرف كيف تُسعّر، وأين لا تتنازل.',
    chips:['تسعير الساعة الصوتية','التسعير حسب الاستخدام','حقوق الاستخدام والبثّ','صياغة العقد','إدارة التعديلات','العملاء والفواتير'],
    project:'قائمة أسعارك، ونموذج عقدك، وعرض سعر لعميل حقيقي.',
    hours:'2 ساعة', badge:'', note:'' },
] as const;

const PHASE_BANDS = [
  { from:0,  to:3,  label:'المرحلة الأولى',  sub:'التأسيس · 16 ساعة · 8 جلسات',       color: GLD },
  { from:3,  to:10, label:'المرحلة الثانية', sub:'التخصّصات · 24 ساعة · 12 جلسة',     color: '#67e8f9' },
  { from:10, to:12, label:'المرحلة الثالثة', sub:'الاحتراف والسوق · 4 ساعات · 2 جلسة', color: '#a78bfa' },
];

const ALBUM = [
  { n:'01', title:'نصّ محايد · قبل وبعد',          kind:'تأسيس',    hot:false },
  { n:'02', title:'قراءة نصّ مشكّل كامل',           kind:'لغة',       hot:false },
  { n:'03', title:'ملفّ بمواصفات البثّ',            kind:'تقنية',    hot:false },
  { n:'04', title:'ثلاثة إعلانات · ثلاث نبرات',    kind:'إعلان',    hot:false },
  { n:'05', title:'تعليق وثائقي · ثلاث دقائق',     kind:'وثائقي',   hot:false },
  { n:'06', title:'فصل رواية · 15–20 دقيقة',        kind:'كتاب صوتي', hot:true  },
  { n:'07', title:'دوبلاج مشهد + ثلاث شخصيات',      kind:'دوبلاج',   hot:false },
  { n:'08', title:'وحدة تعليمية صوتية',             kind:'تعليمي',   hot:false },
  { n:'09', title:'حزمة IVR كاملة لشركة',           kind:'مؤسسي',    hot:false },
  { n:'10', title:'حلقة بودكاست بصوتك',             kind:'بودكاست',  hot:false },
  { n:'11', title:'ملفّ تعريفي احترافي',            kind:'هوية',     hot:true  },
  { n:'12', title:'قائمة أسعار ونموذج عقد',         kind:'سوق',      hot:false },
];


const TRAINERS = [
  { name:'يسار عبده', role:'مدرّبة إعلامية، وخبيرة تعليق صوتي، ومختصّة في تطوير الأداء الصوتي',
    bio:'مدرّبة معتمدة لدى الأمم المتحدة والمؤسسات الوطنية، بخبرة تزيد على عشرين عاماً في الإعلام والتعليق الصوتي والتدريب المهني. تحمل بكالوريوس اللغة الإنجليزية وعلم الأصوات (Phonetics)، وماجستير حقوق الإنسان. تشمل خبرتها الدبلجة والأفلام الوثائقية والكتب الصوتية والتعليق الإعلاني.',
    chips:['علم الأصوات','الدبلجة','الكتب الصوتية','التعليق الإعلاني','تطوير الأداء'],
    img: trainerYasar },
  { name:'عمر الدرابكة', role:'معلّق صوتي محترف، ومدرّب أداء وإلقاء خطابي',
    bio:'سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع في فلوريدا، بخبرة تزيد على اثنتَي عشرة سنة في التدريب الصوتي.',
    chips:['الوثائقي','الإعلانات','الإلقاء الخطابي','التدريب الصوتي','التمكين اللغوي'],
    img: trainerOmar },
];

const OUTCOMES = [
  { n:'01', title:'أداء صوتي مضبوط',    desc:'تنفّس محكم، ومخارج حروف سليمة، وقدرة على تلوين النبرة عند الطلب لا بالمصادفة.' },
  { n:'02', title:'لغة عربية سليمة',    desc:'قراءة نصّ مشكّل دون خطأ، وتحرير النصّ ليُقرأ بالأذن لا بالعين.' },
  { n:'03', title:'محفظة من 13 عملاً', desc:'ملفّات مسجّلة ومعالَجة تغطّي كلّ قطاعات السوق، تُرسل إلى العميل كما هي.' },
  { n:'04', title:'أدوات العمل الحرّ', desc:'قائمة أسعار، ونموذج عقد، وملفّ تعريفي مُهندَس — وشهادة معتمدة من تطبيق وجيز.' },
];

const FAQS = [
  { q:'صوتي عادي — هل أستطيع أن أصبح معلّقاً صوتياً؟',
    a:'التعليق الصوتي مهارة تُتعلَّم لا موهبة تُولَد. المطلوب صوت سليم، وأذن تُدرك الفرق، واستعداد للتدريب. والسوق لا يطلب نوعاً واحداً من الأصوات؛ فالصوت العادي يجد عملاً في الوثائقي والتعليمي أكثر ممّا يجده الصوت الرنّان. تحدّث مع ياقوت وسيُقيَّم صوتك مجاناً قبل أيّ التزام.' },
  { q:'هل أستطيع الالتحاق بالماستركلاس إذا لم أدرس التعليق الصوتي من قبل؟',
    a:'نعم، الماستركلاس مصمَّم ليبدأ من الصفر. المحطتان الأولى والثانية (الأساسيات واللغة العربية) تضعانك على أرضية صلبة قبل الدخول في التخصّصات. الشرط الوحيد: صوت سليم واستعداد للتدريب.' },
  { q:'هل يمكنني اختيار بعض المحطات فقط؟',
    a:'لا، والقرار مقصود. المعلّق الذي يعيش من صوته في السوق العربي لا يعتمد على تخصّص واحد: الإعلانات موسمية، والكتب الصوتية طويلة الأمد، والتسجيلات المؤسسية ثابتة. ومعرفتك بها جميعاً تحمي دخلك من خمود قطاع بعينه.' },
  { q:'ما الفرق بين الحضوري والمباشر التفاعلي (Online LIVE)؟',
    a:'المنهج والمدرّبون ومستوى التدريب واحد في الحالتين. الفرق في بيئة التعلّم: في الحضوري تسجّل داخل استوديو كاسيت بميكروفون كوندنسر وغرفة معالَجة صوتياً مع تصحيح فوري. وفي المباشر التفاعلي تتدرّب من موقعك عبر جلسات مباشرة حيّة مع المدرّب، وتُحفظ لك تسجيلات الجلسات للمراجعة.' },
  { q:'هل أحتاج استوديو ومعدّات خاصة؟',
    a:'لا في الحضوري، إذ تُسجّل في استوديو كاسيت. وفي المباشر التفاعلي (Online LIVE)، المحطة الثالثة مخصّصة لتعليمك تجهيز مساحة تسجيل مقبولة بأقلّ تكلفة. أمّا مشروع التخرّج فيُهندَس بيد مهندس الصوت في الحالتين.' },
  { q:'هل التسجيلات متاحة في Online LIVE؟',
    a:'نعم، تسجيلات الجلسات متاحة للمراجعة في مسار المباشر التفاعلي (Online LIVE). تعود إليها متى شئت طوال فترة الماستركلاس.' },
  { q:'هل التقسيط متاح؟',
    a:'نعم، التقسيط متاح. تُثبَّت مقعدك بالدفعة الأولى، وتُوزَّع باقي الدفعات على مراحل الماستركلاس. للتفاصيل تحدّث مع ياقوت مباشرة.' },
  { q:'هل أستطيع دراسة بعض الدورات أولًا ثم الالتحاق بالماستركلاس؟',
    a:'نعم. المحطتان الأولى والثانية متاحتان كدورات مستقلة أطول. إن أتممتَهما مسبقاً يُحتسب لك ذلك عند الالتحاق بالماستركلاس. تحدّث مع ياقوت لمعرفة كيفية احتساب ما أتممتَه.' },
  { q:'ما الذي أحصل عليه عند إكمال الماستركلاس؟',
    a:'تتخرّج بمحفظة من 13 مخرجاً صوتياً يغطّون كلّ قطاعات السوق، وملفّ تعريفي احترافي، وقائمة أسعار، ونموذج عقد — بالإضافة إلى شهادة معتمدة من تطبيق وجيز، ومسار التأهيل للنشر على المنصّة.' },
  { q:'كيف يعمل الاعتماد من وجيز؟',
    a:'وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط — هي جهة الاعتماد الرسمية. بعد إتمام الماستركلاس تُسلّم مشروعك لمراجعة فنية؛ باجتيازك التقييم تصبح مؤهَّلاً للترشيح لأعمال تسجيل على المنصّة كمعلّق صوتي. الشهادة والاعتماد مضمونان لكلّ من يُكمل الماستركلاس.' },
  { q:'هل الماستركلاس يضمن لي عملًا بعد التخرج؟',
    a:'لا يضمن الماستركلاس عقد عمل. ما يضمنه هو تخرّجك بمحفظة أعمال حقيقية، وأدوات الدخول للسوق من تسعير وعقود وملفّ تعريفي. الترشيح لأعمال وجيز مرتبط باجتياز التقييم الفني وبتوفّر مشاريع تناسب نبرة صوتك.' },
  { q:'ما الفرق بين هذا الماستركلاس وماستركلاس الإعلام؟',
    a:'ماستركلاس الإعلام يبنيك إعلامياً: تقديماً وصحافةً وعملاً ميدانياً وإنتاجاً — والصوت فيه أداة من أدوات عدّة. وهذا الماستركلاس يبنيك معلّقاً صوتياً: الصوت هو المنتَج نفسه من التنفّس إلى الدوبلاج إلى التسعير.' },
];

/* ── sub-components ──────────────────────────────── */
type StationType = typeof STATIONS[number];

function StationItem({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const isWj = s.badge === 'محطة وجيز';
  return (
    <div
      role="button" tabIndex={0}
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: isWj
          ? `linear-gradient(180deg, rgba(30,122,133,.14), ${open ? GS : CARD} 55%)`
          : (open ? `linear-gradient(160deg, ${GS}, rgba(255,255,255,0.025) 60%)` : CARD),
        border: `1px solid ${isWj ? (open ? 'rgba(30,122,133,.55)' : 'rgba(30,122,133,.36)') : (open ? GL : CBR)}`,
        borderRadius: 14, padding: '18px 22px', cursor: 'pointer',
        transition: 'border-color .2s, background .2s', marginBottom: 0,
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          flexShrink: 0, width: 42, height: 42, borderRadius: 12,
          background: 'rgba(0,0,0,.22)',
          border: `1px solid ${isWj ? 'rgba(30,122,133,.55)' : (open ? GL : CBR)}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 14, fontWeight: 700,
          color: isWj ? '#8FDAE3' : GLD,
        }}>{s.n}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 16.5, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {s.standalone && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                متاحة منفردةً
              </span>
            )}
            {isWj && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: 'rgba(30,122,133,.18)', border: '1px solid rgba(30,122,133,.45)', color: '#8FDAE3', padding: '2px 9px', borderRadius: 999 }}>
                محطة وجيز
              </span>
            )}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.7 }}>{s.sub}</div>
        </div>

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronDown size={16} color={isWj ? '#8FDAE3' : GLD}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${CBR}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
            {(s.chips as readonly string[]).map(chip => (
              <span key={chip} style={{
                fontFamily: F, fontSize: 12, color: LT,
                background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`,
                padding: '4px 11px', borderRadius: 999,
              }}>{chip}</span>
            ))}
          </div>
          <div style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.75, marginBottom: 10 }}>
            <span style={{ color: isWj ? '#8FDAE3' : GLD, fontWeight: 700 }}>المشروع التطبيقي: </span>{s.project}
          </div>
          {s.note && (
            <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginBottom: 8 }}>{s.note}</div>
          )}
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

function StudyRow({ variant }: { variant: 'inperson' | 'online' }) {
  const [open, setOpen] = useState(false);
  const isIP = variant === 'inperson';
  const ac = isIP ? GLD : '#67e8f9';
  const acRgb = isIP ? '255,193,7' : '103,232,249';
  const items = isIP
    ? [
        { t:'تسجيل داخل بيئة استوديو احترافية',      d:'تطبيق مباشر وتصحيح أثناء التسجيل.' },
        { t:'تصحيح الأداء على الميكروفون',           d:'ملاحظات فورية مخصّصة لأداء كل متدرّب.' },
        { t:'مشروع تخرّج بإنتاج فعلي',               d:'3 ساعات إنتاج مع المدرّب ومهندس الصوت.' },
        { t:'تجربة تدريبية داخل بيئة مهنية',          d:'تدريب يحاكي طبيعة العمل الحقيقي في الاستوديو.' },
      ]
    : [
        { t:'تدريب مباشر في الوقت الفعلي',           d:'لا يعتمد البرنامج على محتوى مسجّل مسبقاً.' },
        { t:'تجهيز مساحة التسجيل',                  d:'تتعلّم تجهيز مساحة مناسبة للتسجيل من المنزل.' },
        { t:'تطبيق وتصحيح فردي',                    d:'تسجّل أعمالك وتحصل على ملاحظات وتصحيح أثناء التدريب.' },
        { t:'مشروع تخرّج بإنتاج فعلي',              d:'3 ساعات إنتاج بإشراف المدرّب ومهندس الصوت.' },
      ];
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${open ? `rgba(${acRgb},.40)` : CBR}`, transition: 'border-color .2s' }}>
      <button onClick={() => setOpen(v => !v)} aria-expanded={open}
        style={{ width: '100%', background: open ? `rgba(${acRgb},.05)` : CARD, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', textAlign: 'right', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: open ? ac : `rgba(${acRgb},.12)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}>
            {isIP ? <MapPin size={15} color={open ? '#060A14' : ac} strokeWidth={2.2} /> : <Wifi size={15} color={open ? '#060A14' : ac} strokeWidth={2.2} />}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: OFF }}>
              {isIP ? 'حضوري — داخل استوديو كاسيت' : 'مباشر تفاعلي (Online LIVE)'}
            </div>
            <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>
              {isIP ? '12 محطة · 44 ساعة · 22 جلسة' : '12 محطة · 44 ساعة · 22 جلسة'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          {['12 محطة', '44 ساعة', isIP ? 'حضوري' : 'مباشر تفاعلي'].map(b => (
            <span key={b} style={{ fontFamily: F, fontSize: 10.5, color: MUT, background: CARD, border: `1px solid ${CBR}`, borderRadius: 6, padding: '2.5px 7px', whiteSpace: 'nowrap' }}>{b}</span>
          ))}
          <ChevronDown size={15} color={open ? ac : MUT} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
        </div>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid rgba(${acRgb},.18)` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 20px', borderBottom: i < items.length - 1 ? `1px solid ${CBR}` : 'none' }}>
              <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 11, color: '#060A14', background: ac, borderRadius: '50%', flexShrink: 0, width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: OFF, marginBottom: 3 }}>{item.t}</div>
                <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, lineHeight: 1.7 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── page ─────────────────────────────────────────── */
export default function MasarSotiPage() {
  const [, navigate]  = useLocation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  usePageMeta({
    title: 'ماستركلاس التعليق والأداء الصوتي',
    description: 'ماستركلاس 44 ساعة · 22 جلسة في التعليق والأداء الصوتي الاحترافي. 12 محطة تدريبية و13 مخرجاً صوتياً. حضوري ومباشر تفاعلي. شهادة معتمدة من وجيز.',
  });
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function isOpen(i: number) { return expandAll || openIdx === i; }
  function handleExpandAll() { setExpandAll(v => !v); setOpenIdx(null); }

  const WRP: React.CSSProperties = { ...INNER };
  const SH: React.CSSProperties = { textAlign: 'center', marginBottom: 52, direction: 'rtl' };

  return (
    <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes vu { 0%,100%{height:22%} 50%{height:100%} }
        @keyframes soti-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .soti-vu-bar { width:3px;border-radius:2px;background:rgba(255,193,7,.85);animation:vu 1.5s ease-in-out infinite; }
        .soti-live-dot { animation:soti-pulse 2s ease-in-out infinite; }
        @media (max-width:768px) {
          .soti-hero-grid { grid-template-columns:1fr !important; }
          .soti-hero-shot { max-width:260px !important; order:-1; margin:0 auto 20px; }
          .soti-modes-grid { grid-template-columns:1fr !important; }
          .soti-acc-grid { grid-template-columns:1fr !important; }
          .soti-enroll-grid { grid-template-columns:1fr !important; }
        }
        :focus-visible { outline:2px solid #FFC107 !important;outline-offset:3px !important;border-radius:4px !important; }
      `}</style>

      {/* back nav */}
      <div style={{ ...WRP, paddingTop: 92, paddingBottom: 0 }}>
        <button onClick={() => navigate('/')} aria-label="العودة إلى الدورات"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 13, color: MUT, padding: 0 }}>
          <ArrowLeft size={13} /> العودة إلى الدورات
        </button>
      </div>

      {/* ═══════════════════════════════════════
          01. HERO
      ═══════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ padding: '52px 0 88px' }}>
        <div style={WRP}>
          <div className="soti-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.12fr .88fr', gap: 52, alignItems: 'center' }}>

            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
                ماستركلاس · 44 ساعة
              </span>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.22, letterSpacing: -1.2, margin: '18px 0 0', color: OFF }}>
                ماستركلاس التعليق<br />
                <span style={{ color: GLD }}>والأداء الصوتي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 17, color: MUT, maxWidth: 560, marginTop: 16, lineHeight: 1.85 }}>
                برنامج تدريبي يأخذك من تأسيس الصوت إلى التعامل مع السوق: 12 محطة متسلسلة، 13 مخرجاً صوتياً في محفظتك، ومشروع تخرّج تنتجه داخل استوديو كاسيت — وصوتك يخرج مؤهَّلاً للنشر على تطبيق وجيز.
              </p>

              {/* stats boxes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
                {[
                  { num: '44',  label: 'ساعة تدريبية' },
                  { num: '22',  label: 'جلسة مباشرة' },
                  { num: '12',  label: 'محطة تدريبية' },
                  { num: '13',  label: 'مخرجاً صوتياً' },
                ].map(({ num, label }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,.045)', border: `1px solid ${CBR}`, borderRadius: 12, padding: '10px 16px', textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontFamily: FP, fontSize: 24, fontWeight: 700, color: GLD, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, fontFamily: F, fontSize: 13.5, color: LT }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                حضوري في عمّان أو مباشر تفاعلي (Online LIVE)
              </div>

              {/* wajeez chip */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 13, marginTop: 22, background: 'rgba(30,122,133,.16)', border: '1px solid rgba(30,122,133,.48)', borderRadius: 14, padding: '11px 16px 11px 13px' }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, display: 'block' }}>شريك الاعتماد الرسمي — تطبيق وجيز</span>
                  <span style={{ fontFamily: F, fontSize: 12, color: MUT, display: 'block' }}>أكبر مكتبة صوتية وبودكاست في الشرق الأوسط</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
                <a href={WA_ENROLL} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '13px 26px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 6px 20px rgba(255,193,7,.22)' }}>
                  التسجيل في الماستركلاس <ArrowLeft size={14} />
                </a>
                <a href="#tree"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.05)', border: `1px solid ${CBR}`, color: OFF, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 26px', borderRadius: 12, textDecoration: 'none' }}>
                  استكشف المنهج <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* hero shot */}
            <div className="soti-hero-shot" style={{ position: 'relative', maxWidth: 380, marginInline: 'auto', width: '100%' }}>
              <div style={{ position: 'absolute', inset: '-14% -10% -8%', borderRadius: 40, background: 'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)', filter: 'blur(8px)', zIndex: -1 }} />
              <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', border: `1px solid ${GL}`, aspectRatio: '3/4', boxShadow: '0 34px 90px rgba(0,0,0,.5)' }}>
                <img src={heroShot} alt="ماستركلاس التعليق والأداء الصوتي" fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '52% 20%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,37,51,.95) 0%, rgba(26,37,51,.32) 30%, transparent 58%)' }} />
                {/* pill */}
                <span style={{ position: 'absolute', top: 18, right: 18, zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(26,37,51,.74)', backdropFilter: 'blur(6px)', border: `1px solid ${GL}`, color: GLD, fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '7px 13px', borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD }} />
                   تسجيل داخل استوديو كاسيت
                </span>
                {/* foot */}
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', zIndex: 3, padding: '22px 22px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <span style={{ fontFamily: FP, fontSize: 38, fontWeight: 700, color: GLD, lineHeight: .95 }}>44</span>
                    <span style={{ fontFamily: F, fontSize: 12.5, color: LT, marginTop: 4, display: 'block' }}>ساعة · 13 مخرجاً صوتياً</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 34 }}>
                    {Array.from({ length: 9 }, (_, i) => (
                      <span key={i} className="soti-vu-bar" style={{ animationDelay: `${i * 0.11}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          02. أصوات تخرّجت من الماستركلاس
      ═══════════════════════════════════════ */}
      <ReelsSection
        badge="أصوات تخرّجت من الماستركلاس"
        heading={<>أصوات تخرّجت <Gold>من الماستركلاس</Gold></>}
        description="استمع إلى أصوات متدرّبينا وشاهد ما خرج من التدريب إلى التسجيل الفعلي."
        urls={SOTI_REEL_URLS}
        lightEmbed
      />

      {/* ═══════════════════════════════════════
          03. STATION TREE
      ═══════════════════════════════════════ */}
      <section id="tree" className="sec sec--tree" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999, boxShadow: '0 6px 22px rgba(255,193,7,.2)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              منهج الماستركلاس
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, letterSpacing: -.5, margin: '18px 0 0', color: OFF }}>
              الطريق من التنفّس <span style={{ color: GLD }}>إلى أوّل فاتورة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, maxWidth: 680, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              اثنتا عشرة محطة على اثنتَين وعشرين جلسة، مُختَمة بمرحلة إنتاج فعلي داخل الاستوديو.
              كلّ محطة إلزامية وبترتيب مقصود.
            </p>
          </div>

          {/* expand all */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 900, margin: '0 auto 18px' }}>
            <button onClick={handleExpandAll}
              style={{ background: CARD, border: `1px solid ${CBR}`, color: MUT, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 999, cursor: 'pointer' }}>
              {expandAll ? 'إغلاق جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          {PHASE_BANDS.map(band => (
            <div key={band.label} style={{ maxWidth: 900, margin: '0 auto' }}>
              {/* band header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0', margin: '18px 0 12px' }}>
                <div style={{ flex: 1, height: 1, background: CBR }} />
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: MUT, whiteSpace: 'nowrap' }}>
                  {band.label} · <span style={{ color: band.color }}>{band.sub}</span>
                </span>
                <div style={{ flex: 1, height: 1, background: CBR }} />
              </div>
              {/* stations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STATIONS.slice(band.from, band.to).map((s, localI) => {
                  const globalI = band.from + localI;
                  return (
                    <StationItem key={s.n} s={s} open={isOpen(globalI)} onToggle={() => toggle(globalI)} />
                  );
                })}
              </div>
            </div>
          ))}

          {/* graduation project */}
          <div style={{ maxWidth: 900, margin: '32px auto 0', background: `linear-gradient(160deg, rgba(255,193,7,.16), ${CARD} 54%)`, border: `1px solid ${GLD}`, borderRadius: 20, padding: '32px 30px', boxShadow: `0 0 0 1px rgba(255,193,7,.18), 0 26px 70px rgba(0,0,0,.4)` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 15, background: GLD, color: '#1A1206', display: 'grid', placeContent: 'center', fontSize: 22, boxShadow: '0 10px 26px rgba(255,193,7,.32)' }}>★</div>
                <div>
                  <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 22, lineHeight: 1.4, margin: 0, color: OFF }}>مشروع التخرّج الموحّد · الإنتاج الفعلي</h3>
                  <p style={{ fontFamily: F, fontSize: 14, color: LT, marginTop: 8, maxWidth: 540, lineHeight: 1.8 }}>
                    بعد إتمام المحطات الاثنتَي عشرة تبدأ مرحلة الإنتاج الفعلي. ليست واجبات دراسية، بل تجربة تسجيل واستوديو حقيقية تخرج منها بعمل احترافي جاهز للنشر والسوق.
                  </p>
                </div>
              </div>
              <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD, background: 'rgba(0,0,0,.3)', border: `1px solid ${GL}`, padding: '7px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>
                3 ساعات + الهندسة الصوتية
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { n:'01', t:'تحليل النصّ وتفكيك الأداء',    d:'اختيار نصّ مشروعك وتفكيكه كاملاً مع المدرّب ومهندس الصوت.' },
                { n:'02', t:'التوجيه المباشر على المايك',    d:'تدريب حيّ وتصحيح الأداء جملةً بجملة قبل التسجيل النهائي.' },
                { n:'03', t:'التسجيل النهائي الاحترافي',     d:'جلسة استوديو حقيقية بشروط العمل المهني مع مهندس الصوت.' },
                { n:'★',  t:'الهندسة والتسليم',              d:'مكساج وماسترنج وتصدير بأعلى مواصفات البثّ العالمية.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background: 'rgba(0,0,0,.24)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '16px 15px' }}>
                  <div style={{ fontFamily: FP, fontSize: 11.5, fontWeight: 700, color: GLD, letterSpacing: 1, marginBottom: 6 }}>الجلسة {n}</div>
                  <div style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, marginBottom: 6, color: OFF }}>{t}</div>
                  <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, lineHeight: 1.7 }}>{d}</div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: F, fontSize: 14, color: LT, marginTop: 20, lineHeight: 1.8 }}>
              <strong style={{ color: GLD }}>المخرج النهائي:</strong> عمل صوتي متكامل (Demo Reel) منتَج ومُهندَس بالكامل بيد مهندس صوت متخصّص، ليكون أقوى قطعة في محفظتك أمام العملاء.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href={WA_ENROLL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '14px 30px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,.24)' }}>
              التسجيل في الماستركلاس <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          04. ALBUM (cream)
      ═══════════════════════════════════════ */}
      <section className="sec sec--cream" style={{ padding: '96px 0' }}>
        <div className="geo geo--halftone" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ ...WRP, position: 'relative', zIndex: 3 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(138,98,0,.09)', border: '1px solid rgba(138,98,0,.28)', color: '#8A6200', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>محفظة الأعمال</span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, letterSpacing: -.5, margin: '18px 0 0', color: INK }}>
              تتخرّج <span style={{ color: '#8A6200' }}>بألبوم</span> لا بشهادة
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: INK2, maxWidth: 680, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              العميل لا يسأل عن شهادتك، بل يطلب أن يسمع أعمالك. هذه محفظتك عند إتمام الماستركلاس.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(24,32,47,.10)', borderRadius: 22, boxShadow: '0 22px 60px rgba(24,32,47,.12)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(24,32,47,.10)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: INK }}>محفظتك الصوتية</div>
                <div style={{ fontFamily: F, fontSize: 13, color: INK2, marginTop: 3 }}>اثنا عشر مخرجاً من المحطات، ومشروع التخرّج المُهندَس في الاستوديو</div>
              </div>
              <span style={{ fontFamily: FP, fontSize: 13, fontWeight: 700, color: '#8A6200', border: '1px solid rgba(138,98,0,.32)', background: 'rgba(138,98,0,.07)', padding: '7px 15px', borderRadius: 999, whiteSpace: 'nowrap' }}>13 مخرجاً</span>
            </div>

            {ALBUM.map((trk, i) => (
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
              <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: '#8A6200' }}>مشروع التخرّج · Demo Reel منتَج بيد مهندس صوت</span>
              <span style={{ fontFamily: F, fontSize: 11.5, color: '#8A6200', border: '1px solid rgba(138,98,0,.32)', background: 'rgba(138,98,0,.08)', padding: '3px 11px', borderRadius: 999, textAlign: 'center' }}>التخرّج</span>
              <span style={{ color: 'rgba(138,98,0,.9)', height: 26, display: 'block' }}
                dangerouslySetInnerHTML={{ __html: waveThumb(999) }} />
            </div>

            <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(24,32,47,.10)', fontFamily: F, fontSize: 14, color: INK2, lineHeight: 1.8 }}>
              <strong style={{ color: INK }}>الأعمال المميّزة بالذهبي</strong> هي الأكثر أثراً في السوق: فصل الرواية أوّل عمل مؤهَّل للنشر على وجيز، والملفّ التعريفي بطاقتك أمام العملاء، ومشروع التخرّج أثقل قطعة في محفظتك.
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          05. OUTCOMES
      ═══════════════════════════════════════ */}
      <section className="sec sec--out" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              مخرجات الماستركلاس
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              ما الذي <span style={{ color: GLD }}>ستُحقّقه</span> بعد الماستركلاس؟
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 640, marginTop: 14, marginInline: 'auto' }}>مخرجات ملموسة تُقدّمها لأصحاب العمل والعملاء — لا مجرّد شعور عام بالتحسّن.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 52 }}>
            {OUTCOMES.map(oc => (
              <div key={oc.n} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 18, padding: '30px 26px', transition: 'border-color .25s, background .25s' }}>
                <span style={{ display: 'block', fontFamily: FP, fontSize: 44, fontWeight: 700, lineHeight: 1, color: GLD, opacity: .28 }}>{oc.n}</span>
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${CBR}`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 3, background: GLD, borderRadius: 2 }} />
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, lineHeight: 1.5, color: OFF, marginBottom: 10 }}>{oc.title}</h4>
                  <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.8 }}>{oc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href="#tree" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              تصفّح منهج المحطات <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          06. WAJEEZ
      ═══════════════════════════════════════ */}
      <section className="sec sec--wajeez" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={{ border: '1px solid rgba(30,122,133,.48)', borderRadius: 26, background: 'linear-gradient(150deg, rgba(30,122,133,.24), rgba(0,0,0,.18) 56%)', padding: 'clamp(28px,3.5vw,44px)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'center', marginBottom: 32 }}>
              <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 15, background: '#fff', display: 'grid', placeContent: 'center', padding: 9 }}>
                <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(22px,3.2vw,34px)', lineHeight: 1.35, margin: 0, color: OFF }}>
                  من متدرّب <span style={{ color: '#8FDAE3' }}>إلى معلّق على وجيز</span>
                </h2>
                <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 8, maxWidth: 540 }}>
                  وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط — هي جهة الاعتماد، وهي المنصّة التي يصل صوتك إلى جمهورها.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { n:'STEP 01', t:'تتخرّج بعمل قابل للنشر', d:'مشروع المحطة السادسة — فصل رواية كامل بجودة النشر — مبنيّ على مواصفات وجيز الفنية.' },
                { n:'STEP 02', t:'يُقيَّم صوتك فنياً',      d:'تُسلّم عملك للمراجعة الفنية، وتصلك ملاحظات محدّدة إن احتاج الأمر تعديلاً قبل النشر.' },
                { n:'STEP 03', t:'تبدأ بتسجيل أعمال فعلية', d:'باجتيازك التقييم تصبح مؤهَّلاً للترشيح لأعمال تسجيل على المنصّة كمعلّق صوتي.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '22px 20px' }}>
                  <div style={{ fontFamily: FP, fontSize: 12, fontWeight: 700, color: '#8FDAE3', letterSpacing: 1.2, marginBottom: 8 }}>{n}</div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, marginBottom: 8, color: OFF, lineHeight: 1.5 }}>{t}</h4>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: MUT, borderTop: `1px solid ${CBR}`, paddingTop: 20, marginTop: 24, lineHeight: 1.8 }}>
              الترشيح للأعمال مرتبط باجتياز التقييم الفني وبتوفّر مشاريع تناسب نبرة صوتك، وليس وعداً بعقد عمل. أمّا الشهادة والاعتماد فمضمونان لكلّ من يُكمل الماستركلاس.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          07. TRAINERS
      ═══════════════════════════════════════ */}
      <section className="sec sec--trainers" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              هيئة التدريب
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              مَن <span style={{ color: GLD }}>يُدرّبك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 620, marginTop: 14, marginInline: 'auto' }}>
              مدرّبان متخصّصان: الأداء الصوتي، والتحرير اللغوي وعلم الأصوات.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 52 }}>
            {TRAINERS.map(tr => (
              <article key={tr.name} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(22px,2.5vw,30px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {tr.img ? (
                    <div className="tr-ava">
                      <img src={tr.img} alt={tr.name} />
                    </div>
                  ) : (
                    <div style={{ width: 88, height: 88, borderRadius: '50%', flexShrink: 0, border: '2px solid rgba(255,193,7,.32)', background: 'linear-gradient(135deg, #1A2E4A, #2D4A70)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 800, fontSize: 22, color: GLD }}>
                      يع
                    </div>
                  )}
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
            <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              اسأل عن جدول المدرّبين <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          08. MODES
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

          {/* top two summary cards */}
          <div className="soti-modes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 52 }}>
            {[
              {
                variant: 'inperson' as const,
                label: 'حضوري — استوديو كاسيت',
                sub: 'حضور فعلي في عمّان',
                icon: <MapPin size={18} color="#1A1206" strokeWidth={2.2} />,
                ac: GLD, acRgb: '255,193,7',
                items: [
                  'تدريب مباشر داخل استوديو كاسيت',
                  'تطبيق وتسجيل وتصحيح فوري',
                  'تعامل مباشر مع الميكروفون وبيئة التسجيل',
                  'تفاعل مباشر مع المدرّب والمتدرّبين',
                ],
              },
              {
                variant: 'online' as const,
                label: 'مباشر تفاعلي (Online LIVE)',
                sub: 'من أي مكان في العالم العربي',
                icon: <Wifi size={18} color="#1A1206" strokeWidth={2.2} />,
                ac: '#67e8f9', acRgb: '103,232,249',
                items: [
                  'جلسات مباشرة مع المدرّب في الوقت الفعلي',
                  'تطبيق وتقييم فردي أثناء التدريب',
                  'تسجيلات الجلسات متاحة للمراجعة',
                  'مشروع التخرّج بإشراف مباشر مع مهندس الصوت',
                ],
              },
            ].map(m => (
              <div key={m.label} style={{ background: CARD, border: `1px solid rgba(${m.acRgb},.22)`, borderRadius: 20, padding: 'clamp(22px,2.5vw,28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.ac, display: 'grid', placeContent: 'center', flexShrink: 0 }}>
                    {m.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>{m.label}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>{m.sub}</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 9, margin: 0, padding: 0 }}>
                  {m.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: m.ac, fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* detailed accordion rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <StudyRow variant="inperson" />
            <StudyRow variant="online" />
          </div>

          {/* why kaseet */}
          <div style={{ marginTop: 28, background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(24px,3vw,36px)' }}>
            <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(20px,2.6vw,26px)', color: OFF, marginBottom: 24 }}>
              ولماذا <span style={{ color: GLD }}>كاسيت</span> تحديداً؟
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
              {[
                { t:'الاستوديو ليس زينة',       d:'الفرق بين تسجيل في غرفة معالَجة وتسجيل في غرفة عادية يُسمع في الثانية الأولى.' },
                { t:'تصحيح على أذنك وحدك',      d:'عيوب الصوت شخصية: أحدهم يُدغم الحروف وآخر يقطع نفسه في غير موضعه.' },
                { t:'مهندس صوت في مشروعك',      d:'الملفّ النهائي يُهندَس ويُمكسَج ويُصدَّر بيد متخصّص، لا بيدك وحدك.' },
                { t:'جهة الاعتماد هي السوق',    d:'وجيز أكبر مكتبة صوتية في المنطقة؛ فمن يعتمد شهادتك هو من ينشر صوتك.' },
              ].map(({ t, d }) => (
                <div key={t} style={{ padding: '18px 16px', background: 'rgba(255,255,255,.03)', borderRadius: 14, border: `1px solid ${CBR}` }}>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF, marginBottom: 8 }}>{t}</h4>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          09. PRICING
      ═══════════════════════════════════════ */}
      <section className="sec sec--access" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              خيار الالتحاق
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              سعر <span style={{ color: GLD }}>الماستركلاس</span>
            </h2>
          </div>

          <div style={{ maxWidth: 560, margin: '48px auto 0', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -2, background: 'linear-gradient(135deg, rgba(255,193,7,0.18), rgba(103,232,249,0.08))', borderRadius: 28, filter: 'blur(18px)', opacity: 0.6, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', background: '#131B27', border: '1px solid rgba(255,193,7,.55)', borderRadius: 24, padding: 'clamp(26px,4vw,40px)', boxShadow: '0 0 0 1px rgba(255,193,7,.20), inset 0 1px 0 rgba(255,193,7,.10), 0 34px 70px rgba(24,32,47,.28)' }}>

              <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: `1px solid ${CBR}` }}>
                <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF }}>الماستركلاس الكامل</h3>
                <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6, lineHeight: 1.65 }}>
                  44 ساعة · 22 جلسة · 12 محطة · 13 مخرجاً + مشروع تخرّج
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 28, margin: '20px 0 0', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: FP, fontSize: 48, fontWeight: 700, color: GLD, lineHeight: 1, display: 'block' }}>500</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>JOD · حضوري عمّان</span>
                    <a href={WA_ENROLL_ONSITE} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontFamily: F, fontSize: 12, fontWeight: 700, color: '#7FE3A6', background: 'rgba(37,211,102,.10)', border: '1px solid rgba(37,211,102,.28)', borderRadius: 999, padding: '5px 11px', textDecoration: 'none' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.28L2 22l5-1.63a9.84 9.84 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2zm0 17.94c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.25 1.06 1.07-3.17-.2-.32a7.94 7.94 0 0 1-1.23-4.28c0-4.4 3.6-7.98 8.3-7.98 4.4 0 8 3.58 8 7.98s-3.6 8.1-8 8.1z"/></svg>
                      تواصل مع آية
                    </a>
                  </div>
                  <div style={{ width: 1, height: 52, background: CBR, flexShrink: 0 }} />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: FP, fontSize: 48, fontWeight: 700, color: GLD, lineHeight: 1, display: 'block' }}>700</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>USD · مباشر تفاعلي (Online LIVE)</span>
                    <a href={WA_ENROLL_ONLINE} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontFamily: F, fontSize: 12, fontWeight: 700, color: '#7FE3A6', background: 'rgba(37,211,102,.10)', border: '1px solid rgba(37,211,102,.28)', borderRadius: 999, padding: '5px 11px', textDecoration: 'none' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.28L2 22l5-1.63a9.84 9.84 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2zm0 17.94c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.25 1.06 1.07-3.17-.2-.32a7.94 7.94 0 0 1-1.23-4.28c0-4.4 3.6-7.98 8.3-7.98 4.4 0 8 3.58 8 7.98s-3.6 8.1-8 8.1z"/></svg>
                      تواصل مع ياقوت
                    </a>
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '9px 15px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                  <span style={{ fontFamily: F, fontSize: 13, color: LT }}>التقسيط متاح · تُثبَّت مقعدك بالدفعة الأولى</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13, padding: '24px 0', margin: 0 }}>
                {[
                  '44 ساعة تدريبية على 22 جلسة',
                  '12 محطة تدريبية متسلسلة',
                  '13 مخرجاً ضمن محفظة المتدرّب',
                  'مشروع تخرّج من 3 ساعات',
                  'إنتاج داخل استوديو كاسيت للحضوري',
                  'مسار التأهيل للنشر على وجيز',
                  'اعتماد من تطبيق وجيز',
                ].map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.65 }}>
                    <span style={{ color: GLD, fontWeight: 800, flexShrink: 0 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>

              <a href={WA_ENROLL} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 6px 22px rgba(255,193,7,0.20)' }}>
                التسجيل في الماستركلاس <ArrowLeft size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          10. ADVISORS
      ═══════════════════════════════════════ */}
      <section id="consult" className="sec sec--advisor" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              استشارة مجانية · دون التزام
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(26px,3.8vw,40px)', lineHeight: 1.35, margin: '16px 0 0', color: OFF }}>
              قبل أن تسجّل، <span style={{ color: GLD }}>تحدّث مع مستشارتك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 15.5, color: MUT, marginTop: 12, maxWidth: 540, marginInline: 'auto', lineHeight: 1.85 }}>
              جلسة قصيرة على واتساب تُحدَّد فيها نقطة بدايتك — لكلّ مسار مستشارة مخصّصة.
            </p>
          </div>

          <div className="soti-acc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

            {/* آية — حضوري */}
            <div style={{ background: 'rgba(42,54,72,.80)', border: `1px solid ${GL}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.40)' }}>
              <div style={{ background: `rgba(255,193,7,.08)`, borderBottom: `1px solid rgba(255,193,7,.18)`, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: GLD }}>حضوري · عمّان</span>
              </div>
              <div style={{ padding: 'clamp(22px,2.8vw,32px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #3A2800, #5A3F00)', border: `2px solid rgba(255,193,7,.40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontWeight: 800, fontSize: 22, color: GLD }}>آ</div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF }}>آية</div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 3, lineHeight: 1.5 }}>المستشارة التعليمية<br />ماستركلاس الحضوري</div>
                  </div>
                </div>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, background: 'rgba(14,20,31,.78)', border: '1px solid rgba(37,211,102,.36)', color: '#7FE3A6', fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '5px 11px', borderRadius: 999 }}>
                  <span className="soti-live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', display: 'block', flexShrink: 0 }} />
                  متاحة الآن
                </div>
                <a href={waLink(WA_PHONE_ONSITE, 'مرحباً آية، أودّ حجز استشارة مجانية عن ماستركلاس التعليق الصوتي الحضوري')}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#1F9D57', color: '#fff', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 22px rgba(31,157,87,.28)', marginTop: 4 }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.28L2 22l5-1.63a9.84 9.84 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2zm0 17.94c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.25 1.06 1.07-3.17-.2-.32a7.94 7.94 0 0 1-1.23-4.28c0-4.4 3.6-7.98 8.3-7.98 4.4 0 8 3.58 8 7.98s-3.6 8.1-8 8.1z"/></svg>
                  واتساب آية (+962 79 023 4483)
                </a>
              </div>
            </div>

            {/* ياقوت — مباشر */}
            <div style={{ background: 'rgba(42,54,72,.80)', border: `1px solid rgba(103,232,249,.35)`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.40)' }}>
              <div style={{ background: `rgba(103,232,249,.07)`, borderBottom: `1px solid rgba(103,232,249,.18)`, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#67e8f9', flexShrink: 0 }} />
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: '#67e8f9' }}>مباشر تفاعلي (Online LIVE)</span>
              </div>
              <div style={{ padding: 'clamp(22px,2.8vw,32px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="adv-ava" style={{ flexShrink: 0 }}>
                    <img src={advisorImg} alt="ياقوت — المستشارة التعليمية" />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF }}>ياقوت</div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 3, lineHeight: 1.5 }}>المستشارة التعليمية<br />ماستركلاس المباشر التفاعلي</div>
                  </div>
                </div>
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, background: 'rgba(14,20,31,.78)', border: '1px solid rgba(37,211,102,.36)', color: '#7FE3A6', fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '5px 11px', borderRadius: 999 }}>
                  <span className="soti-live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', display: 'block', flexShrink: 0 }} />
                  متاحة الآن
                </div>
                <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#1F9D57', color: '#fff', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 22px rgba(31,157,87,.28)', marginTop: 4 }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.28L2 22l5-1.63a9.84 9.84 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2zm0 17.94c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.25 1.06 1.07-3.17-.2-.32a7.94 7.94 0 0 1-1.23-4.28c0-4.4 3.6-7.98 8.3-7.98 4.4 0 8 3.58 8 7.98s-3.6 8.1-8 8.1z"/></svg>
                  واتساب ياقوت (+962 77 105 2222)
                </a>
              </div>
            </div>

          </div>

          <p style={{ textAlign: 'center', fontFamily: F, fontSize: 13.5, color: MUT, marginTop: 22, lineHeight: 1.8 }}>
            لست متأكّداً من المسار؟ <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer" style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3 }}>تحدّث مع ياقوت</a> وستساعدك في اختيار ما يناسبك.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          11. FAQ
      ═══════════════════════════════════════ */}
      <section className="sec sec--faq" style={{ padding: '96px 0' }}>
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

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              لم تجد سؤالك؟ اسأل ياقوت مباشرة <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12. COHORT
      ═══════════════════════════════════════ */}
      <section id="cohort" className="sec sec--cohort" style={{ padding: '96px 0' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <svg viewBox="0 0 1440 480" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
            <path d="M-120,470 Q400,150 760,270 T1560,120" fill="none" stroke="rgba(255,193,7,.28)" strokeWidth="2.5"/>
            <path d="M-120,500 Q380,220 740,330 T1560,190" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="1.5"/>
          </svg>
        </div>
        <div style={{ ...WRP, position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
            الفوج القادم
          </span>
          <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,46px)', lineHeight: 1.3, margin: '16px 0 0', letterSpacing: -.6, color: OFF }}>
            يبدأ <span style={{ color: GLD }}>الأحد، 9 آب</span>
          </h2>

          <div className="cohort-facts" style={{ maxWidth: 880 }}>
            <div>
              <span className="cf-l">الجدول الأسبوعي</span>
              <b>الأحد والثلاثاء · 6–8 مساءً</b>
            </div>
            <div>
              <span className="cf-l">المدّة</span>
              <b>44 ساعة تدريبية · 22 جلسة<br />+ 3 ساعات لإنتاج مشروع التخرّج</b>
            </div>
            <div>
              <span className="cf-l">المقاعد</span>
              <b style={{ color: '#f87171' }}>4 مقاعد متبقية</b>
            </div>
          </div>

          <a href={WA_ENROLL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,.28)' }}>
            التسجيل في الماستركلاس <ArrowLeft size={14} />
          </a>
          <p style={{ fontFamily: F, fontSize: 14, color: MUT, marginTop: 18 }}>
            أو <a href="#consult" style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3 }}>تحدّث مع ياقوت أوّلاً</a> — استشارة مجانية دون التزام.
          </p>
        </div>
      </section>

    </div>
  );
}
