/**
 * صفحة ماستركلاس التعليق والأداء الصوتي — كاسيت أكاديمي
 */
import { useState, useEffect } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { ChevronDown, ArrowLeft, MapPin, Wifi, Home, Layers, Clock, Mic, Target, Radio, ShieldCheck, CalendarDays, Users, MessageCircle, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { GOLD, OFF, F, FP, INNER, waLink } from './shared/coursePageHelpers';
import ReelsSection from '../components/ReelsSection';
import { Gold } from '../components/SectionHeader';
import PaymentModal from '../components/PaymentModal';
import wajeezLogo   from '@assets/wajeez-logo_1785688262989.png';
import heroShot     from '@assets/voiceover-track1_1785854995070.jpeg';
import trainerYasar from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import trainerOmar  from '@assets/trainer-omar_1785692015818.jpg';
import advisorImg   from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAyaImg from '@assets/0_اية_القماز_1786476075148.jpeg';

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
    img: trainerYasar, imgPosition: '50% 32%' },
  { name:'عمر الدرابكة', role:'معلّق صوتي محترف، ومدرّب أداء وإلقاء خطابي',
    bio:'سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع في فلوريدا، بخبرة تزيد على اثنتَي عشرة سنة في التدريب الصوتي.',
    chips:['الوثائقي','الإعلانات','الإلقاء الخطابي','التدريب الصوتي','التمكين اللغوي'],
    img: trainerOmar, imgPosition: '50% 16%' },
];

const OUTCOMES = [
  { n:'01', title:'أداء صوتي مضبوط',     desc:'تنفّس محكم، ومخارج حروف سليمة، وقدرة على تلوين النبرة عند الطلب لا بالمصادفة.' },
  { n:'02', title:'لغة عربية سليمة',     desc:'قراءة نصّ مشكّل دون خطأ، وتحرير النصّ ليُقرأ بالأذن لا بالعين.' },
  { n:'03', title:'أدوات العمل الحرّ',   desc:'قائمة أسعار، ونموذج عقد، وملفّ تعريفي مُهندَس جاهز للإرسال إلى العميل.' },
  { n:'04', title:'جاهزية مهنية حقيقية', desc:'شهادة معتمدة من وجيز، ومسار تأهيل للنشر على المنصّة — وصوت مُقيَّم ومعتمد للانطلاق في السوق.' },
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
const scrollToCheckout = () => {
  document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function MasarSotiPage() {
  const [openIdx, setOpenIdx]           = useState<number | null>(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<'onsite' | 'live'>('onsite');
  const [expandAll, setExpandAll]       = useState(false);
  const [stickyVisible, setStickyVisible] = useState(true);

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
        @keyframes kaseetSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .soti-vu-bar { width:3px;border-radius:2px;background:rgba(255,193,7,.85);animation:vu 1.5s ease-in-out infinite; }
        .soti-live-dot { animation:soti-pulse 2s ease-in-out infinite; }
        .ka-spin-ring { animation:kaseetSpin 18s linear infinite; transform-origin:200px 200px; }
        .ka-spin-slow { animation:kaseetSpin 32s linear infinite reverse; transform-origin:200px 200px; }
        @media (prefers-reduced-motion:reduce){ .ka-spin-ring,.ka-spin-slow{animation:none!important} }
        @media (max-width:768px) {
          .soti-hero-grid { grid-template-columns:1fr !important; }
          .soti-hero-shot { max-width:300px !important; order:-1; margin:0 auto 20px; }
          .soti-modes-grid { grid-template-columns:1fr !important; }
          .soti-acc-grid { grid-template-columns:1fr !important; }
          .soti-enroll-grid { grid-template-columns:1fr !important; }
        }
        :focus-visible { outline:2px solid #FFC107 !important;outline-offset:3px !important;border-radius:4px !important; }
      `}</style>

      {/* ═══════════════════════════════════════
          01. HERO — breadcrumb داخل الهيرو + حلقة دوّارة + بطاقات ميزات
      ═══════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ padding: '0 0 88px' }}>
        <div style={WRP}>

          {/* breadcrumb — inside hero */}
          <nav aria-label="مسار التنقل" style={{ display:'flex', alignItems:'center', gap:6, paddingTop:96, paddingBottom:0, marginBottom:28 }}>
            <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <a href="/#masterclasses" style={{ fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>الماستركلاسات</a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <span style={{ fontFamily:F, fontSize:12.5, color:GLD }}>التعليق والأداء الصوتي</span>
          </nav>

          <div className="soti-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.12fr .88fr', gap: 52, alignItems: 'center' }}>

            <div>
              {/* two audience / skill pills */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
                  <Target size={12} strokeWidth={2.2} /> للمبتدئين والصاعدين
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(103,232,249,.08)', border:'1px solid rgba(103,232,249,.22)', color:'#67e8f9', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
                  <Radio size={12} strokeWidth={2.2} /> إعلانات وبودكاست
                </span>
              </div>

              <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.22, letterSpacing: -1.2, margin: '0 0 0', color: OFF }}>
                ماستركلاس التعليق {' '}<br />
                <span style={{ color: GLD }}>والأداء الصوتي</span>
              </h1>

              <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 560, marginTop: 16, lineHeight: 1.85 }}>
                برنامج تدريبي يأخذك من تأسيس الصوت إلى التعامل مع السوق: 12 محطة متسلسلة، 13 مخرجاً صوتياً في محفظتك، ومشروع تخرّج تنتجه داخل استوديو كاسيت — وصوتك يخرج مؤهَّلاً للنشر على تطبيق وجيز.
              </p>

              {/* feature cards — 2×2 grid with icons */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:24, maxWidth:500 }}>

                {/* 12 محطة */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Layers size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>12</b> محطة تدريبية متسلسلة
                </span>

                {/* 44 ساعة */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>44</b> ساعة تدريبية مكثفة
                </span>

                {/* ★ 13 مخرجاً — dominant */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,193,7,.11)', border:`1px solid ${GL}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:GLD, fontWeight:700 }}>
                  <Mic size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, fontSize:19, color:GLD, fontWeight:900, lineHeight:1 }}>13</b> مخرجاً صوتياً (ألبوم التخرج)
                </span>

                {/* حضوري / أونلاين */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <MapPin size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  حضوري في الاستوديو أو أونلاين (Online LIVE)
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

            {/* ── hero shot ── */}
            <div className="soti-hero-shot" style={{ position:'relative', maxWidth:380, marginInline:'auto', width:'100%' }}>
              <div style={{ position:'absolute', inset:'-14% -10% -8%', borderRadius:40, background:'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)', filter:'blur(8px)', zIndex:-1 }} />
              <div style={{ position:'relative', borderRadius:26, overflow:'hidden', border:`1px solid ${GL}`, aspectRatio:'3/4', boxShadow:'0 34px 90px rgba(0,0,0,.5)' }}>
                <img src={heroShot} alt="ماستركلاس التعليق والأداء الصوتي" fetchPriority="high"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'52% 20%', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(26,37,51,.95) 0%, rgba(26,37,51,.32) 30%, transparent 58%)' }} />
                {/* pill */}
                <span style={{ position:'absolute', top:18, right:18, zIndex:3, display:'inline-flex', alignItems:'center', gap:7, background:'rgba(26,37,51,.74)', backdropFilter:'blur(6px)', border:`1px solid ${GL}`, color:GLD, fontSize:11.5, fontWeight:700, fontFamily:F, padding:'7px 13px', borderRadius:999 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:GLD }} />
                  تسجيل داخل استوديو كاسيت
                </span>
                {/* foot */}
                <div style={{ position:'absolute', inset:'auto 0 0 0', zIndex:3, padding:'22px 22px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16 }}>
                  <div>
                    <span style={{ fontFamily:FP, fontSize:38, fontWeight:700, color:GLD, lineHeight:.95 }}>13</span>
                    <span style={{ fontFamily:F, fontSize:12.5, color:LT, marginTop:4, display:'block' }}>مخرجاً صوتياً · ألبوم التخرج</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:34 }}>
                    {Array.from({ length:9 }, (_, i) => (
                      <span key={i} className="soti-vu-bar" style={{ animationDelay:`${i * 0.11}s` }} />
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

      {/* ③ محفظة الأعمال */}
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

          {/* album table */}
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
                  من متدرّب <span style={{ color: '#1e7a85' }}>إلى معلّق على وجيز</span>
                </h3>
                <p style={{ fontFamily: F, fontSize: 13.5, color: INK2, marginTop: 5 }}>
                  وجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط — هي جهة الاعتماد والمنصّة التي يصل صوتك إلى جمهورها.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
              {[
                { n:'STEP 01', t:'تتخرّج بعمل قابل للنشر', d:'مشروع المحطة السادسة — فصل رواية كامل بجودة النشر — مبنيّ على مواصفات وجيز الفنية.' },
                { n:'STEP 02', t:'يُقيَّم صوتك فنياً',      d:'تُسلّم عملك للمراجعة الفنية، وتصلك ملاحظات محدّدة إن احتاج الأمر تعديلاً قبل النشر.' },
                { n:'STEP 03', t:'تبدأ بتسجيل أعمال فعلية', d:'باجتيازك التقييم تصبح مؤهَّلاً للترشيح لأعمال تسجيل على المنصّة كمعلّق صوتي.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background: 'rgba(24,32,47,.05)', border: '1px solid rgba(24,32,47,.09)', borderRadius: 12, padding: '16px 15px' }}>
                  <div style={{ fontFamily: FP, fontSize: 11, fontWeight: 700, color: '#1e7a85', letterSpacing: 1.2, marginBottom: 7 }}>{n}</div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 15, marginBottom: 6, color: INK, lineHeight: 1.5 }}>{t}</h4>
                  <p style={{ fontFamily: F, fontSize: 12.5, color: INK2, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: F, fontSize: 12, color: INK2, borderTop: '1px solid rgba(24,32,47,.08)', paddingTop: 16, marginTop: 18, lineHeight: 1.8 }}>
              الترشيح للأعمال مرتبط باجتياز التقييم الفني وبتوفّر مشاريع تناسب نبرة صوتك، وليس وعداً بعقد عمل. أمّا الشهادة والاعتماد فمضمونان لكلّ من يُكمل الماستركلاس.
            </p>
          </div>
        </div>
      </section>

      {/* ④ الطريق — 12 محطة */}
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
                  return (
                    <StationItem key={s.n} s={s} open={isOpen(globalI)} onToggle={() => toggle(globalI)} />
                  );
                })}
              </div>
            </div>
          ))}

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
            <button onClick={scrollToCheckout}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '14px 30px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,193,7,.24)' }}>
              احجز مقعدك في الماستركلاس <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ⑤ مَن يُدرّبك */}
      <section className="sec sec--trainers" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              خبراء ماستركلاس التعليق
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              مَن يُرشدك في <span style={{ color: GLD }}>هذا المسار؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 620, marginTop: 14, marginInline: 'auto' }}>
              معلّقون محترفون من داخل بيئة العمل الحقيقية — يمنحونك خبرة المايكرفون وتوجيه الأداء طوال رحلتك التدريبية.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 52 }}>
            {TRAINERS.map(tr => (
              <article key={tr.name} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(22px,2.5vw,30px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {tr.img ? (
                    <div className="tr-ava">
                      <img src={tr.img} alt={tr.name} style={tr.imgPosition ? { objectPosition: tr.imgPosition } : undefined} />
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

      {/* ⑤·٥ استشارة مجانية */}
      <section className="sec sec--consult" style={{ padding: '0 0 80px' }}>
        <div style={{ ...WRP }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,193,7,0.07) 0%, rgba(255,193,7,0.03) 100%)',
            border: `1px solid ${GL}`,
            borderRadius: 24,
            padding: 'clamp(28px,3.5vw,44px) clamp(24px,3vw,40px)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(24px,3vw,48px)',
            flexWrap: 'wrap',
          }}>
            {/* ── text side ── */}
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: GS, border: `1px solid ${GL}`,
                color: GLD, fontFamily: F, fontSize: 12, fontWeight: 700,
                padding: '5px 14px', borderRadius: 999, marginBottom: 18,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                استشارة مجانية · دون التزام
              </span>
              <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(20px,2.8vw,28px)', lineHeight: 1.45, color: OFF, margin: '0 0 12px' }}>
                قبل أن تسجّل، تحدّث مع مستشارتك
              </h2>
              <p style={{ fontFamily: F, fontSize: 15, color: MUT, lineHeight: 1.75, margin: '0 0 26px', maxWidth: 460 }}>
                جلسة قصيرة على واتساب تُحدَّد فيها نقطة بدايتك — لكلّ مسار مستشارة مخصّصة.
              </p>
              <a
                href={WA_CONSULT}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  background: '#25D366', color: '#fff',
                  fontFamily: F, fontWeight: 800, fontSize: 14.5,
                  padding: '12px 24px', borderRadius: 12,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37,211,102,.28)',
                }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ابدأ محادثتك المجانية
              </a>
            </div>

            {/* ── advisors side ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
              {/* ياقوت — مباشر */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: `2.5px solid ${GLD}`, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={advisorImg} alt="ياقوت الخشاشنة" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: OFF }}>ياقوت</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: MUT, marginTop: 1 }}>مسار المباشر</div>
                </div>
              </div>
              {/* آية — حضوري */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: `2.5px solid ${GL}`, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={advisorAyaImg} alt="آية القماز" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12.5, color: OFF }}>آية</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: MUT, marginTop: 1 }}>مسار الحضوري</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑥ أسلوب الدراسة + الفوج */}
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

          <div className="soti-modes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 52 }}>

            {/* بطاقة حضوري */}
            <div style={{ background: CARD, border: `1px solid rgba(255,193,7,.22)`, borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* رأس البطاقة */}
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
                    'تدريب مباشر داخل استوديو كاسيت',
                    'تطبيق وتسجيل وتصحيح فوري',
                    'تعامل مباشر مع الميكروفون وبيئة التسجيل',
                    'تفاعل مباشر مع المدرّب والمتدرّبين',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: GLD, fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* شريط الفوج */}
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
                    <span style={{ fontFamily: F, fontSize: 13, color: LT }}>3 أيام أسبوعياً · الأحد، الثلاثاء، الخميس</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={14} color={GLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: '#f87171', fontWeight: 700 }}>المقاعد محدودة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* بطاقة مباشر تفاعلي */}
            <div style={{ background: CARD, border: `1px solid rgba(103,232,249,.22)`, borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* رأس البطاقة */}
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
                    'مشروع التخرّج بإشراف مباشر مع مهندس الصوت',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: '#67e8f9', fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* شريط الفوج */}
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

      {/* ⑦ التسجيل والدفع — بطاقة checkout تفاعلية */}
      <section id="checkout" className="sec sec--access" style={{ padding: '96px 0', scrollMarginTop: 80 }}>
        <div style={WRP}>
          {/* رأس القسم */}
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              خطوتك نحو السوق
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              استثمر في <span style={{ color: GLD }}>مستقبلك المهني</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: LT, marginTop: 10 }}>
              الماستركلاس الكامل — اختر أسلوب دراستك وابدأ فوراً
            </p>
            <p style={{ fontFamily: F, fontSize: 14.5, color: MUT, maxWidth: 580, marginInline: 'auto', marginTop: 10, lineHeight: 1.85 }}>
              برنامج متكامل يأخذك من التأسيس وحتى الإنتاج الفعلي. اختر بين الحضور المباشر في الاستوديو أو الأونلاين التفاعلي.
            </p>
          </div>

          <div style={{ maxWidth: 600, margin: '52px auto 0', position: 'relative' }}>
            {/* وهج خلفي */}
            <div style={{ position: 'absolute', inset: -3, background: `linear-gradient(135deg, rgba(255,193,7,.22), rgba(103,232,249,.10))`, borderRadius: 30, filter: 'blur(20px)', opacity: 0.7, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', background: '#131B27', border: `1px solid ${GL}`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(255,193,7,.12), 0 34px 70px rgba(13,11,20,.45)' }}>

              {/* ── تبويبات المسار ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${CBR}` }}>
                {/* حضوري */}
                <button
                  onClick={() => setCheckoutMode('onsite')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '18px 16px', border: 'none', cursor: 'pointer',
                    background: checkoutMode === 'onsite' ? 'rgba(255,193,7,.08)' : 'transparent',
                    borderBottom: checkoutMode === 'onsite' ? `2px solid ${GLD}` : '2px solid transparent',
                    transition: 'background .2s, border-color .2s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color={checkoutMode === 'onsite' ? GLD : MUT} strokeWidth={2.2} />
                    <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: checkoutMode === 'onsite' ? GLD : MUT }}>حضوري</span>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>استوديو كاسيت | عمّان · 15 أيلول</span>
                  <span style={{ fontFamily: FP, fontSize: 22, fontWeight: 700, color: checkoutMode === 'onsite' ? GLD : LT, lineHeight: 1 }}>550 <span style={{ fontSize: 13 }}>JOD</span></span>
                </button>
                {/* مباشر تفاعلي */}
                <button
                  onClick={() => setCheckoutMode('live')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '18px 16px', border: 'none', cursor: 'pointer',
                    background: checkoutMode === 'live' ? 'rgba(103,232,249,.07)' : 'transparent',
                    borderBottom: checkoutMode === 'live' ? '2px solid #67e8f9' : '2px solid transparent',
                    transition: 'background .2s, border-color .2s',
                    borderRight: `1px solid ${CBR}`,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wifi size={14} color={checkoutMode === 'live' ? '#67e8f9' : MUT} strokeWidth={2.2} />
                    <span style={{ fontFamily: F, fontSize: 14.5, fontWeight: 800, color: checkoutMode === 'live' ? '#67e8f9' : MUT }}>مباشر تفاعلي</span>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 11.5, color: MUT }}>عن بُعد (Online LIVE) · 16 أيلول</span>
                  <span style={{ fontFamily: FP, fontSize: 22, fontWeight: 700, color: checkoutMode === 'live' ? '#67e8f9' : LT, lineHeight: 1 }}>$750</span>
                </button>
              </div>

              <div style={{ padding: 'clamp(24px,3.5vw,36px)' }}>

                {/* سطر القيمة الديناميكي */}
                <p style={{ fontFamily: F, fontSize: 13.5, color: LT, textAlign: 'center', margin: '0 0 22px', lineHeight: 1.7, minHeight: 42 }}>
                  {checkoutMode === 'onsite'
                    ? <>44 ساعة تدريبية بـ<strong style={{ color: GLD }}>550 ديناراً</strong> — أي <strong style={{ color: GLD }}>12.5 دينار فقط للساعة</strong></>
                    : <>44 ساعة تدريبية تفاعلية — <strong style={{ color: '#67e8f9' }}>حضور مباشر من أي مكان بالعالم</strong></>
                  }
                </p>

                {/* قائمة المحتويات */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: '0 0 24px' }}>
                  {[
                    '44 ساعة تدريبية مكثفة موزعة على 22 جلسة',
                    '12 محطة متسلسلة من التأسيس إلى سوق العمل',
                    '13 عملاً صوتياً جاهزاً داخل ألبوم تخرّجك',
                    'مشروع تخرّج بإنتاج فعلي (3 ساعات داخل الاستوديو)',
                    'تأهيل عملي لتسعير خدماتك وإدارة العروض',
                    'شهادة اعتماد وفرصة النشر عبر تطبيق وجيز',
                  ].map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.6 }}>
                      <CheckCircle2 size={16} color={GLD} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* صندوق ضمان الجلسة الأولى */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, background: 'rgba(255,193,7,.07)', border: `1px solid rgba(255,193,7,.26)`, borderRadius: 16, padding: '16px 18px', marginBottom: 18 }}>
                  <ShieldCheck size={22} color={GLD} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 14, color: OFF, marginBottom: 5 }}>ضمان الجلسة الأولى — Risk Reversal</div>
                    <p style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.8, margin: 0 }}>
                      جرّب الجلسة الأولى كاملة. إن شعرت أنّ الماستركلاس لا يلبّي توقّعاتك، اطلب استرداداً كاملاً لرسومك خلال 24 ساعة من انتهائها — <strong style={{ color: OFF }}>دون أسئلة ولا شروط</strong>.
                    </p>
                  </div>
                </div>

                {/* تنبيه التقسيط */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '11px 15px', marginBottom: 22 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GLD, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: F, fontSize: 13, color: LT, lineHeight: 1.7 }}>
                    <strong style={{ color: OFF }}>التقسيط متاح:</strong> يمكنك الدفع كاملاً الآن أو تثبيت مقعدك بدفع الدفعة الأولى فقط
                    {' '}<strong style={{ color: GLD }}>{checkoutMode === 'onsite' ? '(50 JOD)' : '($70)'}</strong>.
                  </span>
                </div>

                {/* زر Stripe */}
                <button
                  onClick={() => { setModalOpen(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    width: '100%', boxSizing: 'border-box',
                    background: GLD, color: '#0f172a',
                    fontFamily: F, fontWeight: 800, fontSize: 15.5,
                    padding: '16px 24px', borderRadius: 16, border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 28px rgba(255,193,7,.30)',
                    transition: 'transform .15s, box-shadow .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 38px rgba(255,193,7,.38)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,193,7,.30)'; }}>
                  <Lock size={15} />
                  احجز مقعدك في الماستركلاس — ادفع {checkoutMode === 'onsite' ? '50 ديناراً' : '$70'} الآن
                  <ArrowLeft size={15} />
                </button>

                {/* تذييل الأمان */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 12, color: MUT }}>
                    <Lock size={12} color={MUT} strokeWidth={2} />
                    معاملة آمنة ومشفّرة 100% عبر Stripe
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Visa */}
                    <svg width="32" height="11" viewBox="0 0 48 16" aria-label="Visa"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="50%" y="12" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#fff">VISA</text></svg>
                    {/* MC */}
                    <svg width="20" height="13" viewBox="0 0 34 22" aria-label="Mastercard"><circle cx="12" cy="11" r="11" fill="#EB001B"/><circle cx="22" cy="11" r="11" fill="#F79E1B"/><path d="M17 4.3a11 11 0 0 1 0 13.4A11 11 0 0 1 17 4.3z" fill="#FF5F00"/></svg>
                    {/* Apple Pay */}
                    <svg width="32" height="13" viewBox="0 0 50 20" aria-label="Apple Pay"><rect width="50" height="20" rx="4" fill="#000"/><text x="50%" y="14.5" textAnchor="middle" fontFamily="'-apple-system',sans-serif" fontWeight="600" fontSize="10" fill="#fff">Apple Pay</text></svg>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑧ المستشارة + الأسئلة */}
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

          {/* بطاقة المستشارتين — موحّدة */}
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            border: `1px solid rgba(255,193,7,.28)`,
            background: 'linear-gradient(160deg, rgba(255,193,7,.07) 0%, rgba(13,11,20,.96) 42%)',
            boxShadow: '0 32px 80px rgba(0,0,0,.45)',
          }}>
            {/* شريط العنوان */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '14px 28px', borderBottom: `1px solid rgba(255,193,7,.15)`, background: 'rgba(255,193,7,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} color={GLD} strokeWidth={2} />
                <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD }}>استشارة مجانية · دون التزام</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(37,211,102,.10)', border: '1px solid rgba(37,211,102,.30)', color: '#7FE3A6', fontSize: 11.5, fontWeight: 700, fontFamily: F, padding: '4px 12px', borderRadius: 999 }}>
                <span className="soti-live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#25D366', display: 'block', flexShrink: 0 }} />
                متاحتان الآن
              </div>
            </div>

            {/* المستشارتان جنباً إلى جنب */}
            <div className="soti-acc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

              {/* آية القماز */}
              <div style={{ padding: 'clamp(24px,3vw,38px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* badge */}
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 7, background: 'rgba(255,193,7,.08)', border: `1px solid rgba(255,193,7,.22)`, borderRadius: 999, padding: '5px 12px' }}>
                  <MapPin size={12} color={GLD} strokeWidth={2.5} />
                  <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: GLD }}>حضوري · عمّان</span>
                </div>
                {/* صورة + اسم */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="adv-ava" style={{ flexShrink: 0 }}>
                    <img src={advisorAyaImg} alt="آية القماز" style={{ objectPosition: '50% 15%' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: OFF, letterSpacing: -.3 }}>آية القماز</div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 5, lineHeight: 1.6 }}>
                      المستشارة التعليمية<br />
                      <span style={{ color: GLD }}>ماستركلاس الحضوري</span>
                    </div>
                  </div>
                </div>
                {/* زر واتساب */}
                <a href={waLink(WA_PHONE_ONSITE, 'مرحباً آية، أودّ حجز استشارة مجانية عن ماستركلاس التعليق الصوتي الحضوري')}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#1F9D57', color: '#fff', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '13px 20px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 8px 22px rgba(31,157,87,.28)', marginTop: 'auto' }}>
                  <MessageCircle size={16} strokeWidth={2.2} />
                  تحدّثي مع آية
                </a>
              </div>

              {/* فاصل عمودي */}
              <div style={{ position: 'absolute', top: '14%', bottom: '8%', right: '50%', width: 1, background: `linear-gradient(to bottom, transparent, rgba(255,193,7,.22) 30%, rgba(255,193,7,.22) 70%, transparent)`, pointerEvents: 'none' }} />

              {/* ياقوت الخشاشنة */}
              <div style={{ padding: 'clamp(24px,3vw,38px)', display: 'flex', flexDirection: 'column', gap: 20, borderRight: `1px solid transparent` }}>
                {/* badge */}
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 7, background: 'rgba(103,232,249,.07)', border: '1px solid rgba(103,232,249,.22)', borderRadius: 999, padding: '5px 12px' }}>
                  <Wifi size={12} color="#67e8f9" strokeWidth={2.5} />
                  <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: '#67e8f9' }}>مباشر تفاعلي · Online LIVE</span>
                </div>
                {/* صورة + اسم */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="adv-ava" style={{ flexShrink: 0 }}>
                    <img src={advisorImg} alt="ياقوت الخشاشنة" />
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: OFF, letterSpacing: -.3 }}>ياقوت الخشاشنة</div>
                    <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, marginTop: 5, lineHeight: 1.6 }}>
                      المستشارة التعليمية<br />
                      <span style={{ color: '#67e8f9' }}>ماستركلاس المباشر التفاعلي</span>
                    </div>
                  </div>
                </div>
                {/* زر واتساب */}
                <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#1F9D57', color: '#fff', fontFamily: F, fontWeight: 800, fontSize: 14, padding: '13px 20px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 8px 22px rgba(31,157,87,.28)', marginTop: 'auto' }}>
                  <MessageCircle size={16} strokeWidth={2.2} />
                  تحدّثي مع ياقوت
                </a>
              </div>
            </div>

            {/* تذييل البطاقة */}
            <div style={{ padding: '14px 28px', borderTop: `1px solid rgba(255,193,7,.12)`, background: 'rgba(0,0,0,.18)', textAlign: 'center', fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.8 }}>
              لست متأكّداً من المسار؟ <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer" style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 700 }}>تحدّث مع ياقوت</a> — ستساعدك في اختيار ما يناسبك.
            </div>
          </div>

          {/* FAQ merged */}
          <div style={{ marginTop: 72 }}>
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
        </div>
      </section>

      {/* ── PaymentModal — Stripe Elements ── */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSlug="masar-soti"
        courseTitle="ماستركلاس التعليق والأداء الصوتي"
        cohortIdOnsite={301}
        cohortIdLive={302}
        cohortStartAr={checkoutMode === 'onsite' ? 'الثلاثاء، 15 أيلول 2025' : 'الأربعاء، 16 أيلول 2025'}
        cohortDays={checkoutMode === 'onsite' ? 'الأحد، الثلاثاء، الخميس' : 'الأربعاء والسبت'}
        cohortTimeAr={checkoutMode === 'onsite' ? '5:00 مساءً' : '7:00 مساءً'}
        cohortTrainer="يسار عبده، عمر شروم"
        priceJOD={550}
        priceUSD={750}
        initialMode={checkoutMode}
      />

      {/* ── sticky CTA (mobile only, hides when #checkout is visible) ── */}
      {stickyVisible && (
        <div className="soti-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '10px 16px 16px', background: 'rgba(10,14,24,0.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={scrollToCheckout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,193,7,.28)' }}>
            <Lock size={15} />
            احجز مقعدك في الماستركلاس
            <ArrowLeft size={14} />
          </button>
        </div>
      )}
      <style>{`@media (min-width:769px) { .soti-sticky-cta { display:none !important; } }`}</style>
    </div>
  );
}
