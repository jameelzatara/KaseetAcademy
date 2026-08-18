/**
 * صفحة ماستركلاس فن الخطابة والتواصل القيادي — كاسيت أكاديمي
 * هيكل مطابق لصفحة سوتي — المحتوى من بيانات الخطابة
 */
import { useState, useEffect } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  ChevronDown, ArrowLeft, MapPin, Wifi, Home,
  Layers, Clock, Users, Target, MessageCircle,
  ShieldCheck, CalendarDays, CheckCircle2, Lock,
} from 'lucide-react';
import { GOLD, OFF, F, FP, INNER, waLink } from './shared/coursePageHelpers';
import PaymentModal from '../components/PaymentModal';
import wajeezLogo    from '@assets/wajeez-logo_1785688262989.png';
import heroShot      from '@assets/cover-public-speaking-tedx_1785865159100.jpeg';
import trainerSohaib from '@assets/instructor-sohaib_1785863334821.jpeg';
import trainerOmar   from '@assets/trainer-omar_1785692015818.jpg';
import advisorImg    from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAyaImg from '@assets/0_اية_القماز_1786476075148.jpeg';
import galleryImg1   from '@assets/khataba-g1.jpg';
import galleryImg2   from '@assets/khataba-g2.jpg';
import galleryImg3   from '@assets/khataba-g3.jpg';
import galleryImg4   from '@assets/khataba-g4.jpg';

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

const WA_PHONE_ONLINE = '962771052222';
const WA_PHONE_ONSITE = '962790234483';

const WA_CONSULT = waLink(WA_PHONE_ONLINE, 'مرحباً، أودّ حجز استشارة تعليمية مجانية عن ماستركلاس فن الخطابة والتواصل القيادي');

/* ── wave helper ─────────────────────────────────── */
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
const AUDIENCE_ITEMS = [
  'تتحدّث أمام الجمهور بثقة ووضوح واتزان.',
  'تبني حضوراً قيادياً يسبق كلماتك ويعزّزها.',
  'تصمّم رسالة مترابطة تخدم هدفاً محدداً.',
  'تقدّم نفسك وخبرتك دون مبالغة أو تقليل من الذات.',
  'ترتجل بوعي وتتكيّف مع المواقف والأسئلة المفاجئة.',
  'تفهم جمهورك وتكيّف لغتك وأمثلتك دون أن تفقد هويتك.',
  'تدير مقاومة الجمهور وتحافظ على هدوئك تحت الضغط.',
  'تصنع بداية قوية ونهاية تبقى في الذاكرة.',
  'تستخدم الإنصات والقصة والدعابة بذكاء في تواصلك.',
];

const STATIONS = [
  { n:'01', phase:1,
    title:'أركان الخطابة وتحليل الجمهور',
    sub:'لا يُبنى خطاب قبل أن يُعرَف لمن يُقال؛ فالجمهور أوّل قيد على الكلام لا آخره.',
    chips:['أجزاء الخطاب','أنماط الاستدلال الثلاثة','تحليل الجمهور','الغرض الخطابي','الرسالة المركزية','مصداقية المتحدّث'],
    project:'بطاقة تحليل جمهور لموقف خطابي حقيقي من واقعك المهني، مع الغرض والرسالة المركزية.',
    hours:'4 ساعات', badge:'' },
  { n:'02', phase:1,
    title:'إدارة رهبة المنصّة',
    sub:'رهبة المنصّة ليست عيباً في الشخصية، بل استجابة فسيولوجية معروفة الأسباب وقابلة للضبط.',
    chips:['فسيولوجيا القلق التواصلي','إعادة التأطير المعرفي','تمارين التنفّس والتهيئة','التعرّض المتدرّج','ضبط الجسد تحت التوتّر','التحضير المنهجي'],
    project:'إلقاء أوّل خطاب مدّته دقيقتان، مسجَّلاً بالفيديو، مع تقييم ذاتي موثَّق.',
    hours:'4 ساعات', badge:'' },
  { n:'03', phase:1,
    title:'الصوت الخطابي: الجرس والإلقاء',
    sub:'الصوت المسموع في قاعة ليس الصوت المسموع في ميكروفون؛ ولكلٍّ منهما تقنيته.',
    chips:['التنفّس الحجابي','إسقاط الصوت','التنويع في الطبقة والسرعة','الصمت الوظيفي','مخارج الحروف','العناية بالصوت'],
    project:'إلقاء نصّ واحد بثلاث معالجات صوتية، مع تحليل أثر كلٍّ منها على المعنى.',
    hours:'2 ساعة', badge:'' },
  { n:'04', phase:1,
    title:'لغة الجسد والحضور التنفيذي',
    sub:'يُحاكَم الخطيب على ما يُرى منه قبل أن يُحاكَم على ما يُقال؛ والتناقض بين الاثنين يُسقط الرسالة.',
    chips:['الوقفة والاتّزان','الإيماءة الوظيفية','التواصل البصري وتوزيعه','الحركة في المساحة','مكوّنات الحضور التنفيذي','التطابق اللفظي وغير اللفظي'],
    project:'تحليل مصوَّر لأدائك الجسدي، مع خطّة تصحيح فردية محدَّدة البنود.',
    hours:'4 ساعات', badge:'' },
  { n:'05', phase:2,
    title:'هندسة بناء الخطاب',
    sub:'الخطاب بلا بناء يُنسى قبل انتهائه؛ والبناء لا يُلغي العفوية بل يحملها.',
    chips:['أنماط التنظيم الخمسة','خطّافات الافتتاح','الأطروحة وموضعها','الانتقالات والجُمل الرابطة','الخاتمة ودعوة الفعل','قاعدة الاقتصاد اللغوي'],
    project:'مخطَّط خطاب كامل مُراجَعاً ومُعدَّلاً بإشراف المدرّب.',
    hours:'4 ساعات', badge:'' },
  { n:'06', phase:2,
    title:'الحجاج والإقناع',
    sub:'الإقناع صناعةٌ لها أركان تُدرَس، لا موهبةُ إلحاح.',
    chips:['أركان الحجّة وفق نموذج تولمِن','أنواع الأدلّة وتراتبها','المغالطات المنطقية','تفنيد الحجّة المضادّة','الإقناع الوجداني المشروع','أخلاقيات الإقناع'],
    project:'خطاب إقناعي (5 دقائق) مبنيّ على حجّة موثَّقة يتضمّن تفنيد حجّة مضادّة.',
    hours:'4 ساعات', badge:'محطة ذهبية' },
  { n:'07', phase:2,
    title:'الأساليب البلاغية: التروب والسكيم',
    sub:'ما يُقرأ بالعين لا يُسمَع بالأذن؛ وأكثر الخطابات ضعفاً نصوصٌ كُتبت للقراءة ثمّ أُلقيت.',
    chips:['لغة الكتابة ولغة الإسماع','التروب: الاستعارة والكناية والمجاز','السكيم: التوازي والتضادّ والتكرار','التوازن والسجع','إيقاع الجملة المُلقاة','العبارة القابلة للاقتباس'],
    project:'إعادة صياغة نصّ إداري جافّ إلى نصّ خطابي مسموع مع بيان التعديلات البلاغية.',
    hours:'2 ساعة', badge:'' },
  { n:'08', phase:2,
    title:'السرد الشخصي وصناعة الحكاية',
    sub:'الحجّة تُقنِع العقل، والحكاية تُبقي الرسالة. ومن لا يملك حكايته لا يُذكَر.',
    chips:['بنية الحكاية: الموقف والتحوّل والنتيجة','حدود الكشف الذاتي','اختيار الحكاية للرسالة','التفصيل الحسّي','الحكاية في مستهلّ الخطاب','أخلاقيات السرد الشخصي'],
    project:'حكاية شخصية (3 دقائق) مربوطة برسالة مهنية، مُلقاة ومصوَّرة.',
    hours:'4 ساعات', badge:'محطة ذهبية' },
  { n:'09', phase:3,
    title:'العرض التقديمي والوسائل البصرية',
    sub:'الشريحة سندٌ للمتحدّث لا بديلٌ عنه؛ ومن قرأ شرائحه استغنى الجمهور عنه.',
    chips:['مبدأ الشريحة السند','التصميم المعرفي','البيانات في سياق خطابي','تسلسل الكشف','التعامل مع العطل التقني','الخطاب بلا وسائل'],
    project:'عرض تقديمي (7 دقائق) يُلقى مرّةً بالشرائح ومرّةً بدونها.',
    hours:'4 ساعات', badge:'' },
  { n:'10', phase:3,
    title:'الحديث المرتجل وإدارة الأسئلة',
    sub:'يُختبَر المتحدّث في السؤال الذي لم يتوقّعه، لا في الخطاب الذي أعدّه.',
    chips:['أُطُر الإجابة المرتجلة','شراء الوقت مهنياً','إعادة صياغة السؤال','إدارة جلسة الأسئلة','السؤال العدائي','«لا أعرف» كإجابة مهنية'],
    project:'جلسة أسئلة محاكاة أمام مجموعة مدرَّبة على المعارضة، ثلاثة أسئلة غير معلَنة.',
    hours:'2 ساعة', badge:'' },
  { n:'11', phase:3,
    title:'التواصل القيادي والحوارات الصعبة',
    sub:'أصعب ما يُلقيه القائد ليس الخطاب التحفيزي، بل القرار الذي لا يُرضي أحداً.',
    chips:['خطاب القائد أمام فريقه','الحوارات الصعبة','إدارة الاجتماعات','الخطاب في الأزمات','التواصل مع مجلس الإدارة','بناء السرد المؤسسي'],
    project:'خطابان: الأوّل يُبلّغ قراراً مؤسسياً صعباً، والثاني يُحفّز فريقاً بعد انتكاسة.',
    hours:'4 ساعات', badge:'' },
  { n:'12', phase:3,
    title:'الخطابة الجماهيرية والظهور الإعلامي',
    sub:'على المنصّة تملك الوقت؛ وأمام الكاميرا يملكه المحاور.',
    chips:['الخطاب أمام جمهور كبير','المسرح والإضاءة والميكروفون','المحفوظ مقابل المرتَجل المبنيّ','إيقاع الخطاب الطويل','المنصّة مقابل الكاميرا','المقابلة الصعبة والتصريح الصحفي'],
    project:'خطاب جماهيري (8 دقائق) على منصّة، ومقابلة محاكاة مصوَّرة.',
    hours:'4 ساعات', badge:'' },
] as const;

const PHASE_BANDS = [
  { from:0, to:4,  label:'المرحلة الأولى',  sub:'التأسيس · 14 ساعة · 7 جلسات',               color: GLD },
  { from:4, to:8,  label:'المرحلة الثانية', sub:'بناء الخطاب والإقناع · 16 ساعة · 8 جلسات',  color: '#67e8f9' },
  { from:8, to:12, label:'المرحلة الثالثة', sub:'المنصّة والقيادة · 12 ساعة · 6 جلسات',       color: '#a78bfa' },
];

const ALBUM = [
  { n:'01', title:'بطاقة تحليل جمهور لموقف مهني',          kind:'وثيقة',         hot:false },
  { n:'02', title:'خطاب أوّل (دقيقتان) + تقييم ذاتي',      kind:'فيديو',         hot:false },
  { n:'03', title:'نصّ واحد بثلاث معالجات صوتية',           kind:'صوت',           hot:false },
  { n:'04', title:'تحليل أداء جسدي + خطّة تصحيح',          kind:'فيديو ووثيقة',  hot:false },
  { n:'05', title:'مخطَّط خطاب كامل مُراجَع',                kind:'وثيقة',         hot:false },
  { n:'06', title:'خطاب إقناعي (5 دقائق) بحجّة موثَّقة',   kind:'فيديو',         hot:true  },
  { n:'07', title:'نصّ إداري معاد الصياغة بلاغياً',         kind:'وثيقة',         hot:false },
  { n:'08', title:'حكاية شخصية (3 دقائق) مربوطة برسالة',   kind:'فيديو',         hot:true  },
  { n:'09', title:'عرض تقديمي (7 دقائق) + نسخة بلا شرائح', kind:'فيديو وشرائح',  hot:false },
  { n:'10', title:'جلسة أسئلة محاكاة أمام معارضة',          kind:'فيديو',         hot:false },
  { n:'11', title:'خطاب قرار صعب + خطاب تحفيزي',           kind:'فيديو',         hot:false },
  { n:'12', title:'خطاب جماهيري (8 دقائق) + مقابلة محاكاة', kind:'فيديو',         hot:false },
  { n:'13', title:'خارطة التطوير الشخصي (90 يوماً)',         kind:'وثيقة',         hot:false },
];

const OUTCOMES = [
  { title:'النطاق اللفظي',    desc:'تحسين اختيار الكلمات ودقة التعبير ووضوح اللغة، لتصبح رسالتك أكثر حضوراً وإقناعاً وابتعاداً عن الحشو والمصطلحات الجامدة.' },
  { title:'النطاق الذهني',    desc:'تنظيم الأفكار قبل النطق بها، وبناء هياكل واضحة تساعدك على التفكير والاستجابة والارتجال تحت الضغط.' },
  { title:'النطاق الاجتماعي', desc:'فهم الآخرين، وقراءة القاعة، وبناء الثقة والألفة، وتكييف الرسالة مع طبيعة الجمهور والسياق.' },
  { title:'هندسة الخطاب',     desc:'بناء محتوى مترابط يبدأ بهدف واضح، ويتقدم بمنطق مقنع، ويستخدم أمثلة وقصصاً، وينتهي بخطوة أو أثر مقصود.' },
  { title:'الإلقاء القيادي',  desc:'تطوير الحضور الجسدي والصوتي، وإدارة الإيقاع والنبرة والصمت والتواصل البصري بما يعكس الثقة والاتزان.' },
  { title:'الخطابة الأصيلة',  desc:'صياغة خطاب ينسجم مع قيمك وهويتك وسلوكك، ويمنح كلماتك مصداقية وتأثيراً حقيقيين.' },
];

const TRAINERS = [
  {
    name: 'د. صهيب الخوالدة',
    role: 'خبير تخطيط استراتيجي وتواصل قيادي · المدرّب الرئيس',
    bio: 'يشغل منصب مدير الأبحاث والسياسات في مؤسسة قطر، بخبرة مهنية تتجاوز ستة عشر عاماً في تطوير الأعمال وإدارة المشاريع والقيادة الاستراتيجية. حاصل على الدكتوراة في إدارة الأعمال من جامعة أستون (المملكة المتحدة)، وماجستير إدارة الأعمال بتقدير امتياز، وماجستير في المحاسبة والتمويل من جامعة برمنغهام.',
    chips: ['أركان الخطابة', 'هندسة البناء', 'الحجاج والإقناع', 'الحديث المرتجل', 'التواصل القيادي', 'مدرّب من موقع القرار'],
    img: trainerSohaib, imgPosition: 'center top',
  },
  {
    name: 'عمر الدرابكة',
    role: 'معلّق صوتي محترف · مدرّب أداء وإلقاء خطابي',
    bio: 'سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع في فلوريدا، بخبرة تزيد على اثنتَي عشرة سنة في التدريب الصوتي.',
    chips: ['رهبة المنصّة', 'الصوت الخطابي', 'لغة الجسد', 'الأساليب البلاغية', 'السرد', 'المنصّة والكاميرا'],
    img: trainerOmar, imgPosition: '50% 16%',
  },
];

const FAQS = [
  { q:'أخاف من الحديث أمام الناس خوفاً شديداً — هل هذا الماستركلاس لي؟', a:'نعم، وهو مبنيّ على ذلك. المحطة الثانية مخصّصة بالكامل لرهبة المنصّة، وتُعالِجها بوصفها استجابة فسيولوجية معروفة الأسباب لا عيباً في الشخصية: بإعادة التأطير المعرفي، وتمارين التهيئة، والتعرّض المتدرّج من المجموعة الصغيرة إلى المنصّة. ويبدأ أوّل أداء لك بخطاب من دقيقتين لا بخطاب جماهيري.' },
  { q:'هل الدفع آمن؟ وهل التقسيط متاح؟', a:'الدفع إلكتروني عبر بوّابة دفع آمنة بفيزا أو ماستركارد، ولا تحتفظ كاسيت ببيانات بطاقتك. والتقسيط متاح للحضوري: تُثبَّت مقعدك بـ50 ديناراً، وتُوزَّع باقي الدفعات على مراحل الماستركلاس.' },
  { q:'متى يبدأ الفوج القادم؟ وما الجدول الأسبوعي؟', a:'يبدأ الفوج القادم في 14 أيلول (سبتمبر)، الجدول الأسبوعي: الاثنين والأربعاء والسبت.' },
  { q:'هل يُصوَّر أدائي؟ لا أرغب في ذلك.', a:'يُصوَّر، والتصوير جزء بنيوي من المنهج لا خيار فيه؛ فلا يُصحَّح أداء لم يُرَ. أمّا التسجيلات فتبقى خاصّة بك وبمدرّبك، ولا تُنشر إلا بإذنك الصريح. ومن لا يستطيع الالتزام بذلك، فالماستركلاس غير مناسب له.' },
  { q:'هل أحتاج خبرة سابقة في الخطابة؟', a:'لا. المرحلة الأولى تفترض عدم وجود خبرة، وتبني الحضور والصوت والجسد من الأساس. أمّا من لديه خبرة، فالمرحلتان الثانية والثالثة تُضيفان إليه بناءَ الخطاب والحجاج والسرد وإدارة الجمهور.' },
  { q:'هل يمكنني اختيار بعض المحطات فقط؟', a:'لا، والقرار أكاديمي. المحطات مترتّبة ترتيباً بنائياً: يُفترض إتمام كلٍّ منها لدخول ما بعدها. ومن أراد مهارة واحدة فقط، فالأنسب له دورة مستقلّة لا ماستركلاس.' },
  { q:'ما الفرق بين هذا الماستركلاس وماستركلاس التعليق الصوتي؟', a:'المعلّق الصوتي يعمل خلف ميكروفون ولا يراه أحد؛ فالصوت عنده هو المنتَج بأكمله. والخطيب يُرى ويُحاكَم على حضوره وبناء كلامه وقدرته على الإقناع كما يُحاكَم على صوته. لذلك يتضمّن هذا الماستركلاس محاور غائبة عن الآخر: القلق التواصلي، ولغة الجسد، والحجاج، والسرد، وإدارة الجمهور المعارض.' },
  { q:'ما قيمة فيديو التخرّج عملياً؟', a:'هو ما يُطلَب منك حين تُرشَّح للحديث في مؤتمر أو فعالية: تسجيل سابق لأداء كامل. وإنتاجه بجودة النشر — مصوَّراً بكاميرتين وبصوت ملتقط منفصلاً ومُخرَجاً — يفرق فرقاً حاسماً عن تسجيل هاتف من الصفوف الخلفية.' },
  { q:'ما خارطة التطوير لمدة 90 يوماً؟', a:'وثيقة شخصية تُسلَّم مع مشروع التخرّج، تُحدّد أهدافك القصيرة المدى بعد الماستركلاس: المواقف التي ستُطبَّق فيها المهارات، ومؤشّرات قياس التقدّم، وجلسة متابعة اختيارية مع مدرّبك.' },
];

const CHECKOUT_FEATURES = [
  '42 ساعة تدريبية على 21 جلسة',
  'ثماني محطات لا تُتاح خارج الماستركلاس',
  '14 مخرجاً موثَّقاً بتغذية راجعة مصوَّرة',
  'ثلاث جلسات إنتاج + مونتاج احترافي',
  'تقرير تحليل أداء + خارطة تطوير 90 يوماً',
  'فوج من خمسة عشر متدرّباً لا أكثر',
];

/* ── sub-components ──────────────────────────────── */
type StationType = typeof STATIONS[number];

function StationItem({ s, open, onToggle }: { s: StationType; open: boolean; onToggle: () => void }) {
  const isGold = s.badge === 'محطة ذهبية';
  return (
    <div
      role="button" tabIndex={0}
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{
        background: open ? `linear-gradient(160deg, ${GS}, rgba(255,255,255,0.025) 60%)` : CARD,
        border: `1px solid ${open ? GL : CBR}`,
        borderRadius: 14, padding: '18px 22px', cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          flexShrink: 0, width: 42, height: 42, borderRadius: 12,
          background: 'rgba(0,0,0,.22)',
          border: `1px solid ${open ? GL : CBR}`,
          display: 'grid', placeContent: 'center',
          fontFamily: FP, fontSize: 14, fontWeight: 700,
          color: GLD,
        }}>{s.n}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: F, fontSize: 16.5, fontWeight: 800, color: OFF, lineHeight: 1.5 }}>{s.title}</span>
            {isGold && (
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: GLD, color: '#1A1206', padding: '2px 9px', borderRadius: 999 }}>
                ★ محطة ذهبية
              </span>
            )}
          </div>
          <div style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.7 }}>{s.sub}</div>
        </div>

        <ChevronDown size={16} color={GLD}
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} />
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
            <span style={{ color: GLD, fontWeight: 700 }}>المشروع التطبيقي: </span>{s.project}
          </div>
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

/* ── page ─────────────────────────────────────────── */
const scrollToCheckout = () => {
  document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function MasarKhatabaPage() {
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
    title: 'ماستركلاس فن الخطابة والتواصل القيادي',
    description: 'ماستركلاس 42 ساعة في فن الخطابة والتواصل القيادي مع د. صهيب الخوالدة. 14 مخرجاً موثَّقاً وشهادة معتمدة من تطبيق وجيز — كاسيت أكاديمي.',
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
        @keyframes khataba-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes kaseetSpinK { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .khataba-vu-bar { width:3px;border-radius:2px;background:rgba(255,193,7,.85);animation:vu 1.5s ease-in-out infinite; }
        .khataba-live-dot { animation:khataba-pulse 2s ease-in-out infinite; }
        @media (max-width:768px) {
          .khataba-hero-grid { grid-template-columns:1fr !important; }
          .khataba-hero-shot { max-width:300px !important; order:-1; margin:0 auto 20px; }
          .khataba-modes-grid { grid-template-columns:1fr !important; }
          .khataba-audience-grid { grid-template-columns:1fr !important; }
        }
        :focus-visible { outline:2px solid #FFC107 !important;outline-offset:3px !important;border-radius:4px !important; }
      `}</style>

      {/* ═══════════════════════════════════════
          01. HERO
      ═══════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ padding: '0 0 88px' }}>
        <div style={WRP}>

          {/* breadcrumb */}
          <nav aria-label="مسار التنقل" style={{ display:'flex', alignItems:'center', gap:6, paddingTop:96, marginBottom:28 }}>
            <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>
              <Home size={12} strokeWidth={2} /> الرئيسية
            </a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <a href="/#masterclasses" style={{ fontFamily:F, fontSize:12.5, color:MUT, textDecoration:'none' }}>الماستركلاسات</a>
            <span style={{ color:'rgba(255,255,255,.20)', fontSize:11 }}>/</span>
            <span style={{ fontFamily:F, fontSize:12.5, color:GLD }}>الخطابة والتواصل القيادي</span>
          </nav>

          <div className="khataba-hero-grid" style={{ display:'grid', gridTemplateColumns:'1.12fr .88fr', gap:52, alignItems:'center' }}>

            <div>
              {/* pills */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
                  <Users size={12} strokeWidth={2.2} /> للمهنيين والقادة
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(103,232,249,.08)', border:'1px solid rgba(103,232,249,.22)', color:'#67e8f9', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
                  <MessageCircle size={12} strokeWidth={2.2} /> خطابة وتواصل
                </span>
              </div>

              <h1 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(34px,5vw,58px)', lineHeight:1.22, letterSpacing:-1.2, margin:'0 0 0', color:OFF }}>
                ماستركلاس فن الخطابة {' '}<br />
                <span style={{ color:GLD }}>والتواصل القيادي</span>
              </h1>

              <p style={{ fontFamily:F, fontSize:16, color:MUT, maxWidth:560, marginTop:16, lineHeight:1.85 }}>
                برنامج مهني متكامل يُعِدّك للحديث أمام جمهور والتأثير فيه: اثنتا عشرة محطة تبدأ من تحليل الجمهور وضبط رهبة المنصّة، وتمرّ ببناء الخطاب والحجاج والسرد، وتُختَم بمشروع تخرّج مصوَّر أمام جمهور حقيقي — وأربعة عشر مخرجاً موثَّقاً تغادر بها القاعة.
              </p>

              {/* feature cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:24, maxWidth:500 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Layers size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>12</b> محطة تدريبية متسلسلة
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, color:OFF, fontWeight:700 }}>42</b> ساعة تدريبية مكثفة
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,193,7,.11)', border:`1px solid ${GL}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:GLD, fontWeight:700 }}>
                  <Target size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  <b style={{ fontFamily:FP, fontSize:19, color:GLD, fontWeight:900, lineHeight:1 }}>14</b> مخرجاً موثَّقاً (ألبوم التخرّج)
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'10px 13px', borderRadius:11, fontFamily:F, fontSize:13, color:LT }}>
                  <MapPin size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                  حضوري في عمّان أو مباشر تفاعلي (Online LIVE)
                </span>
              </div>

              {/* wajeez badge */}
              <a href="https://wajeez.com" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:14, marginTop:18, background:'rgba(2,6,23,.75)', border:'1px solid rgba(255,193,7,.18)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderRadius:14, padding:'12px 16px', maxWidth:500, textDecoration:'none', cursor:'pointer', transition:'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.42)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,193,7,.18)')}>
                <div style={{ flexShrink:0, width:38, height:38, borderRadius:8, background:'#fff', display:'grid', placeContent:'center', padding:4 }}>
                  <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily:F, fontSize:13, fontWeight:700, color:OFF }}>شريك الاعتماد الرسمي — تطبيق وجيز</div>
                  <div style={{ fontFamily:F, fontSize:11.5, color:MUT }}>أكبر منصّة صوتية في الشرق الأوسط</div>
                </div>
              </a>

              {/* CTAs */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginTop:22 }}>
                <button onClick={scrollToCheckout}
                  style={{ display:'inline-flex', alignItems:'center', gap:9, background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:15, padding:'13px 26px', borderRadius:12, border:'none', cursor:'pointer', boxShadow:'0 6px 20px rgba(255,193,7,.22)' }}>
                  احجز مقعدك في الماستركلاس <ArrowLeft size={14} />
                </button>
                <a href="#tree"
                  style={{ display:'inline-flex', alignItems:'center', gap:9, background:'rgba(255,255,255,.05)', border:`1px solid ${CBR}`, color:OFF, fontFamily:F, fontWeight:700, fontSize:15, padding:'13px 26px', borderRadius:12, textDecoration:'none' }}>
                  استكشف المنهج <ArrowLeft size={14} />
                </a>
              </div>
            </div>

            {/* hero shot */}
            <div className="khataba-hero-shot" style={{ position:'relative', maxWidth:380, marginInline:'auto', width:'100%' }}>
              <div style={{ position:'absolute', inset:'-14% -10% -8%', borderRadius:40, background:'radial-gradient(ellipse at 50% 40%, rgba(255,193,7,.22), transparent 68%)', filter:'blur(8px)', zIndex:-1 }} />
              <div style={{ position:'relative', borderRadius:26, overflow:'hidden', border:`1px solid ${GL}`, aspectRatio:'3/4', boxShadow:'0 34px 90px rgba(0,0,0,.5)' }}>
                <img src={heroShot} alt="ماستركلاس فن الخطابة والتواصل القيادي" fetchPriority="high"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'18% 18%', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(26,37,51,.95) 0%, rgba(26,37,51,.32) 30%, transparent 58%)' }} />
                {/* pill */}
                <span style={{ position:'absolute', top:18, right:18, zIndex:3, display:'inline-flex', alignItems:'center', gap:7, background:'rgba(26,37,51,.74)', backdropFilter:'blur(6px)', border:`1px solid ${GL}`, color:GLD, fontSize:11.5, fontWeight:700, fontFamily:F, padding:'7px 13px', borderRadius:999 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:GLD }} />
                  تدريب أمام جمهور حقيقي
                </span>
                {/* foot */}
                <div style={{ position:'absolute', inset:'auto 0 0 0', zIndex:3, padding:'22px 22px 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16 }}>
                  <div>
                    <span style={{ fontFamily:FP, fontSize:38, fontWeight:700, color:GLD, lineHeight:.95 }}>14</span>
                    <span style={{ fontFamily:F, fontSize:12.5, color:LT, marginTop:4, display:'block' }}>مخرجاً موثَّقاً · ألبوم التخرّج</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:34 }}>
                    {Array.from({ length:9 }, (_, i) => (
                      <span key={i} className="khataba-vu-bar" style={{ animationDelay:`${i * 0.11}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          02. لمن صُمِّم البرنامج؟
      ═══════════════════════════════════════ */}
      <section className="sec" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD }} />
              لمن صُمِّم البرنامج؟
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, letterSpacing:-.5, margin:'18px 0 0', color:OFF }}>
              هذه الرحلة لك إذا كنت تريد أن <span style={{ color:GLD }}>...</span>
            </h2>
          </div>

          <div className="khataba-audience-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:820, marginInline:'auto' }}>
            {AUDIENCE_ITEMS.map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, background:CARD, border:`1px solid ${CBR}`, borderRadius:14, padding:'16px 18px' }}>
                <span style={{ width:22, height:22, borderRadius:'50%', background:GS, border:`1px solid ${GL}`, flexShrink:0, display:'grid', placeContent:'center', marginTop:1 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:GLD, display:'block' }} />
                </span>
                <span style={{ fontFamily:F, fontSize:14, color:LT, lineHeight:1.75 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          03. محفظة الأعمال — قسم فاتح
      ═══════════════════════════════════════ */}
      <section className="sec sec--cream" style={{ padding:'96px 0' }}>
        <div className="geo geo--halftone" style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none' }} />
        <div style={{ ...WRP, position:'relative', zIndex:3 }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(138,98,0,.09)', border:'1px solid rgba(138,98,0,.28)', color:'#8A6200', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>محفظة الأعمال</span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, letterSpacing:-.5, margin:'18px 0 0', color:INK }}>
              تتخرّج بأدلّة <span style={{ color:'#8A6200' }}>لا بشهادة</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16, color:INK2, maxWidth:680, marginTop:14, marginInline:'auto', lineHeight:1.8 }}>
              الجهة المنظِّمة لا تسأل عن شهادتك، بل تطلب أن ترى تسجيلاً سابقاً لأدائك. هذه محفظتك عند إتمام الماستركلاس: أربعة عشر مخرجاً موثَّقاً بين فيديو ووثيقة.
            </p>
          </div>

          {/* album table */}
          <div style={{ background:'#fff', border:'1px solid rgba(24,32,47,.10)', borderRadius:22, boxShadow:'0 22px 60px rgba(24,32,47,.12)', overflow:'hidden' }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid rgba(24,32,47,.10)', display:'flex', flexWrap:'wrap', gap:16, alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontFamily:F, fontWeight:800, fontSize:20, color:INK }}>محفظتك · 13 مخرجاً + مشروع التخرّج</div>
                <div style={{ fontFamily:F, fontSize:13, color:INK2, marginTop:3 }}>أربعة عشر مخرجاً بين فيديو ووثيقة وتحليل</div>
              </div>
              <span style={{ fontFamily:FP, fontSize:13, fontWeight:700, color:'#8A6200', border:'1px solid rgba(138,98,0,.32)', background:'rgba(138,98,0,.07)', padding:'7px 15px', borderRadius:999, whiteSpace:'nowrap' }}>14 مخرجاً</span>
            </div>
            {ALBUM.map((trk, i) => (
              <div key={trk.n} style={{
                display:'grid', gridTemplateColumns:'44px 1fr 108px 130px', gap:14, alignItems:'center',
                padding:'13px 28px', borderBottom:'1px solid rgba(24,32,47,.10)',
                background:trk.hot ? 'rgba(255,193,7,.10)' : 'transparent',
              }}>
                <span style={{ fontFamily:FP, fontSize:12.5, fontWeight:700, color:trk.hot ? '#8A6200' : INK2 }}>{trk.n}</span>
                <span style={{ fontFamily:F, fontSize:14.5, fontWeight:700, color:trk.hot ? '#8A6200' : INK, lineHeight:1.5 }}>{trk.title}</span>
                <span style={{ fontFamily:F, fontSize:11.5, color:INK2, border:'1px solid rgba(24,32,47,.10)', background:'rgba(24,32,47,.035)', padding:'3px 11px', borderRadius:999, textAlign:'center' }}>{trk.kind}</span>
                <span style={{ color:trk.hot ? 'rgba(138,98,0,.78)' : 'rgba(138,98,0,.34)', height:26, display:'block' }}
                  dangerouslySetInnerHTML={{ __html: waveThumb(50 + i) }} />
              </div>
            ))}
            {/* grad row */}
            <div style={{ display:'grid', gridTemplateColumns:'44px 1fr 108px 130px', gap:14, alignItems:'center', padding:'14px 28px', background:'linear-gradient(90deg, rgba(255,193,7,.24), rgba(255,193,7,.08))', borderTop:'1px solid rgba(138,98,0,.28)' }}>
              <span style={{ fontFamily:FP, fontSize:15, fontWeight:700, color:'#8A6200' }}>★</span>
              <span style={{ fontFamily:F, fontSize:14.5, fontWeight:800, color:'#8A6200' }}>مشروع التخرّج: فيديو احترافي + تقرير أداء + خارطة 90 يوماً</span>
              <span style={{ fontFamily:F, fontSize:11.5, color:'#8A6200', border:'1px solid rgba(138,98,0,.32)', background:'rgba(138,98,0,.08)', padding:'3px 11px', borderRadius:999, textAlign:'center' }}>إنتاج كامل</span>
              <span style={{ color:'rgba(138,98,0,.9)', height:26, display:'block' }}
                dangerouslySetInnerHTML={{ __html: waveThumb(999) }} />
            </div>
            <div style={{ padding:'20px 28px', borderTop:'1px solid rgba(24,32,47,.10)', fontFamily:F, fontSize:14, color:INK2, lineHeight:1.8 }}>
              <strong style={{ color:INK }}>المخرجان المميَّزان بالذهبي</strong> هما الأكثر أثراً عملياً: الخطاب الإقناعي يُثبت قدرتك على بناء حجّة، والحكاية الشخصية هي ما يُذكَر منك بعد انتهاء الخطاب. أمّا مشروع التخرّج فهو ما يُطلَب منك حين تُرشَّح للحديث في مؤتمر أو فعالية.
            </div>
          </div>

          {/* outcome cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:18, marginTop:40 }}>
            {OUTCOMES.map((oc, i) => (
              <div key={i} style={{ background:'rgba(24,32,47,.06)', border:'1px solid rgba(24,32,47,.10)', borderRadius:18, padding:'30px 26px' }}>
                <span style={{ display:'block', fontFamily:FP, fontSize:44, fontWeight:700, lineHeight:1, color:'#8A6200', opacity:.28 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid rgba(24,32,47,.10)', position:'relative' }}>
                  <div style={{ position:'absolute', top:0, right:0, width:32, height:3, background:'#8A6200', borderRadius:2 }} />
                  <h4 style={{ fontFamily:F, fontWeight:800, fontSize:18, lineHeight:1.5, color:INK, marginBottom:10 }}>{oc.title}</h4>
                  <p style={{ fontFamily:F, fontSize:14, color:INK2, lineHeight:1.8 }}>{oc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* wajeez strip */}
          <div style={{ marginTop:40, border:'1px solid rgba(30,122,133,.40)', borderRadius:20, background:'linear-gradient(150deg, rgba(30,122,133,.10), rgba(24,32,47,.04) 56%)', padding:'clamp(22px,3vw,34px)' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:18, alignItems:'center', marginBottom:22 }}>
              <div style={{ flexShrink:0, width:54, height:54, borderRadius:12, background:'#fff', display:'grid', placeContent:'center', padding:7 }}>
                <img src={wajeezLogo} alt="وجيز" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              <div>
                <h3 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(17px,2.2vw,22px)', lineHeight:1.35, margin:0, color:INK }}>
                  من متدرّب <span style={{ color:'#1e7a85' }}>إلى متحدّث معتمَد</span>
                </h3>
                <p style={{ fontFamily:F, fontSize:13.5, color:INK2, marginTop:5 }}>
                  الشهادة من كاسيت أكاديمي، والاعتماد من تطبيق وجيز — أكبر منصّة صوتية في الشرق الأوسط. وكلاهما مضمونان لكلّ من يُكمل الماستركلاس بنجاح.
                </p>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(210px, 1fr))', gap:12 }}>
              {[
                { n:'STEP 01', t:'تتخرّج بمخرج قابل للنشر', d:'فيديو خطابك النهائي + تقرير تحليل الأداء + خارطة التطوير الشخصي (90 يوماً) — مُنتَجة بجودة تصلح للعرض المهني وملفّ الترشّح.' },
                { n:'STEP 02', t:'شهادة معتمدة من وجيز',     d:'تصلك شهادتان: شهادة إتمام من كاسيت أكاديمي، وشهادة اعتماد من تطبيق وجيز — دون اشتراط تقييم فنّي إضافي.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background:'rgba(24,32,47,.05)', border:'1px solid rgba(24,32,47,.09)', borderRadius:12, padding:'16px 15px' }}>
                  <div style={{ fontFamily:FP, fontSize:11, fontWeight:700, color:'#1e7a85', letterSpacing:1.2, marginBottom:7 }}>{n}</div>
                  <h4 style={{ fontFamily:F, fontWeight:800, fontSize:15, marginBottom:6, color:INK, lineHeight:1.5 }}>{t}</h4>
                  <p style={{ fontFamily:F, fontSize:12.5, color:INK2, lineHeight:1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:F, fontSize:12, color:INK2, borderTop:'1px solid rgba(24,32,47,.08)', paddingTop:16, marginTop:18, lineHeight:1.8 }}>
              الشهادة والاعتماد مضمونان لكلّ من يُكمل الماستركلاس. لا يوجد تقييم فنّي إضافي بعد التخرّج.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          04. الطريق — 12 محطة
      ═══════════════════════════════════════ */}
      <section id="tree" className="sec sec--tree" style={{ padding:'96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GLD, color:'#1A1206', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'7px 16px', borderRadius:999, boxShadow:'0 6px 22px rgba(255,193,7,.2)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#1A1206' }} />
              منهج الماستركلاس
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, letterSpacing:-.5, margin:'18px 0 0', color:OFF }}>
              الطريق من رهبة المنصّة <span style={{ color:GLD }}>إلى الإقناع</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16.5, color:MUT, maxWidth:680, marginTop:14, marginInline:'auto', lineHeight:1.8 }}>
              اثنتان وأربعون ساعة على إحدى وعشرين جلسة، تُختَم بمرحلة إنتاج فعلي مصوَّرة أمام جمهور. كلّ محطة إلزامية وبترتيب مقصود.
            </p>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', maxWidth:900, margin:'0 auto 18px' }}>
            <button onClick={handleExpandAll}
              style={{ background:CARD, border:`1px solid ${CBR}`, color:MUT, fontFamily:F, fontSize:13, fontWeight:700, padding:'9px 18px', borderRadius:999, cursor:'pointer' }}>
              {expandAll ? 'إغلاق جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          {PHASE_BANDS.map(band => (
            <div key={band.label} style={{ maxWidth:900, margin:'0 auto' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, padding:'4px 0', margin:'18px 0 12px' }}>
                <div style={{ flex:1, height:1, background:CBR }} />
                <span style={{ fontFamily:F, fontSize:12.5, fontWeight:700, color:MUT, whiteSpace:'nowrap' }}>
                  {band.label} · <span style={{ color:band.color }}>{band.sub}</span>
                </span>
                <div style={{ flex:1, height:1, background:CBR }} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {STATIONS.slice(band.from, band.to).map((s, localI) => {
                  const globalI = band.from + localI;
                  return <StationItem key={s.n} s={s} open={isOpen(globalI)} onToggle={() => toggle(globalI)} />;
                })}
              </div>
            </div>
          ))}

          {/* grad project */}
          <div style={{ maxWidth:900, margin:'32px auto 0', background:`linear-gradient(160deg, rgba(255,193,7,.16), ${CARD} 54%)`, border:`1px solid ${GLD}`, borderRadius:20, padding:'32px 30px', boxShadow:`0 0 0 1px rgba(255,193,7,.18), 0 26px 70px rgba(0,0,0,.4)` }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:18, alignItems:'flex-start', justifyContent:'space-between', marginBottom:22 }}>
              <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
                <div style={{ flexShrink:0, width:52, height:52, borderRadius:15, background:GLD, color:'#1A1206', display:'grid', placeContent:'center', fontSize:22, boxShadow:'0 10px 26px rgba(255,193,7,.32)' }}>★</div>
                <div>
                  <h3 style={{ fontFamily:F, fontWeight:800, fontSize:22, lineHeight:1.4, margin:0, color:OFF }}>مشروع التخرّج · الإنتاج الفعلي</h3>
                  <p style={{ fontFamily:F, fontSize:14, color:LT, marginTop:8, maxWidth:540, lineHeight:1.8 }}>
                    بعد إتمام المحطات الاثنتَي عشرة تبدأ مرحلة الإنتاج الفعلي. ليست واجباً دراسياً، بل تجربة إلقاء وتصوير حقيقية تخرج منها بفيديو خطاب احترافي يصلح للنشر المهني.
                  </p>
                </div>
              </div>
              <span style={{ fontFamily:F, fontSize:12.5, fontWeight:700, color:GLD, background:'rgba(0,0,0,.3)', border:`1px solid ${GL}`, padding:'7px 14px', borderRadius:999, whiteSpace:'nowrap', flexShrink:0 }}>
                3 جلسات + المونتاج
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
              {[
                { n:'01', t:'بناء المخطَّط ومراجعته',    d:'اختيار موضوع مشروعك وبناء المخطَّط وضبط الأطروحة والافتتاح والخاتمة.' },
                { n:'02', t:'التمرين الموجَّه والتصحيح',  d:'تمرين حيّ على الإلقاء، وتصحيح الأداء جملةً بجملة: الصوت والوقفات والإيماءة.' },
                { n:'03', t:'الإلقاء النهائي المصوَّر',    d:'إلقاء أمام جمهور حقيقي، مصوَّراً بكاميرتين وبصوت مُلتقط بميكروفون منفصل.' },
                { n:'★',  t:'المخرج النهائي',              d:'فيديو خطاب كامل احترافي + تقرير تحليل أداء + خارطة تطوير شخصية لمدة 90 يوماً.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background:'rgba(0,0,0,.24)', border:`1px solid ${CBR}`, borderRadius:14, padding:'16px 15px' }}>
                  <div style={{ fontFamily:FP, fontSize:11.5, fontWeight:700, color:GLD, letterSpacing:1, marginBottom:6 }}>الجلسة {n}</div>
                  <div style={{ fontFamily:F, fontSize:14.5, fontWeight:800, marginBottom:6, color:OFF }}>{t}</div>
                  <div style={{ fontFamily:F, fontSize:12.5, color:MUT, lineHeight:1.7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:34 }}>
            <button onClick={scrollToCheckout}
              style={{ display:'inline-flex', alignItems:'center', gap:9, background:GLD, color:'#1A1206', fontFamily:F, fontWeight:800, fontSize:15.5, padding:'14px 30px', borderRadius:999, border:'none', cursor:'pointer', boxShadow:'0 10px 30px rgba(255,193,7,.24)' }}>
              احجز مقعدك في الماستركلاس <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          05. أسلوب الدراسة + الفوج
      ═══════════════════════════════════════ */}
      <section className="sec sec--modes" style={{ padding:'96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD }} />
              أسلوب الدراسة
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, margin:'18px 0 0', color:OFF }}>
              اختر <span style={{ color:GLD }}>أسلوب تعلّمك</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16, color:MUT, maxWidth:620, marginTop:14, marginInline:'auto' }}>
              نفس المنهج، ونفس المدرّبين، ونفس مستوى التدريب — اختر الطريقة التي تناسبك.
            </p>
          </div>

          <div className="khataba-modes-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginTop:52 }}>

            {/* حضوري */}
            <div style={{ background:CARD, border:`1px solid rgba(255,193,7,.22)`, borderRadius:20, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'clamp(22px,2.5vw,28px)', flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:GLD, display:'grid', placeContent:'center', flexShrink:0, boxShadow:'0 6px 16px rgba(255,193,7,.28)' }}>
                    <MapPin size={18} color="#1A1206" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily:F, fontWeight:800, fontSize:15.5, color:OFF }}>حضوري — قاعة كاسيت في عمّان</div>
                    <div style={{ fontFamily:F, fontSize:12, color:MUT, marginTop:2 }}>حضور فعلي في عمّان</div>
                  </div>
                </div>
                <ul style={{ listStyle:'none', display:'grid', gap:9, margin:0, padding:0 }}>
                  {['قاعة إلقاء بمنصّة وميكروفون وإضاءة', 'تصوير كلّ أداء والمراجعة عليه فوراً', 'جمهور حقيقي من المتدرّبين لمحطّات المنصّة', 'ثلاث زيارات لمرحلة الإنتاج الفعلي'].map(item => (
                    <li key={item} style={{ display:'flex', gap:10, fontFamily:F, fontSize:13.5, color:LT, lineHeight:1.7 }}>
                      <span style={{ color:GLD, fontSize:14, marginTop:3, flexShrink:0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ borderTop:`1px solid rgba(255,193,7,.18)`, background:'rgba(255,193,7,.05)', padding:'16px clamp(18px,2.5vw,24px)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:GLD, flexShrink:0 }} />
                  <span style={{ fontFamily:F, fontSize:11.5, fontWeight:700, color:GLD, letterSpacing:.5 }}>الفوج القادم</span>
                </div>
                <div style={{ display:'grid', gap:9 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <CalendarDays size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:LT }}>
                      <span style={{ color:MUT, marginInlineEnd:4 }}>يبدأ</span>
                      <strong style={{ color:OFF }}>الاثنين، 14 أيلول</strong>
                    </span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Clock size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:LT }}>3 أيام أسبوعياً · الاثنين والأربعاء والسبت</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Users size={14} color={GLD} strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:'#f87171', fontWeight:700 }}>المقاعد محدودة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* مباشر تفاعلي */}
            <div style={{ background:CARD, border:`1px solid rgba(103,232,249,.22)`, borderRadius:20, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'clamp(22px,2.5vw,28px)', flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'#67e8f9', display:'grid', placeContent:'center', flexShrink:0, boxShadow:'0 6px 16px rgba(103,232,249,.22)' }}>
                    <Wifi size={18} color="#1A1206" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontFamily:F, fontWeight:800, fontSize:15.5, color:OFF }}>مباشر تفاعلي (Online LIVE)</div>
                    <div style={{ fontFamily:F, fontSize:12, color:MUT, marginTop:2 }}>من أي مكان في العالم العربي</div>
                  </div>
                </div>
                <ul style={{ listStyle:'none', display:'grid', gap:9, margin:0, padding:0 }}>
                  {['جلسات مباشرة تفاعلية بالكامل دون تسجيلات مسبقة', 'تسليم أدائك مصوَّراً للمراجعة الفردية', 'تسجيلات الجلسات متاحة للمراجعة', 'الإلقاء النهائي لمشروع التخرّج حضوري'].map(item => (
                    <li key={item} style={{ display:'flex', gap:10, fontFamily:F, fontSize:13.5, color:LT, lineHeight:1.7 }}>
                      <span style={{ color:'#67e8f9', fontSize:14, marginTop:3, flexShrink:0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ borderTop:`1px solid rgba(103,232,249,.18)`, background:'rgba(103,232,249,.05)', padding:'16px clamp(18px,2.5vw,24px)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#67e8f9', flexShrink:0 }} />
                  <span style={{ fontFamily:F, fontSize:11.5, fontWeight:700, color:'#67e8f9', letterSpacing:.5 }}>الفوج القادم</span>
                </div>
                <div style={{ display:'grid', gap:9 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <CalendarDays size={14} color="#67e8f9" strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:LT }}>
                      <span style={{ color:MUT, marginInlineEnd:4 }}>يبدأ</span>
                      <strong style={{ color:OFF }}>الأربعاء، 17 أيلول</strong>
                    </span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Clock size={14} color="#67e8f9" strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:LT }}>يومان أسبوعياً · الأربعاء والسبت</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Users size={14} color="#67e8f9" strokeWidth={2} style={{ flexShrink:0 }} />
                    <span style={{ fontFamily:F, fontSize:13, color:'#f87171', fontWeight:700 }}>المقاعد محدودة</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          06. مَن يُدرّبك
      ═══════════════════════════════════════ */}
      <section className="sec sec--trainers" style={{ padding:'96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GLD, color:'#1A1206', fontFamily:F, fontSize:12.5, fontWeight:700, padding:'7px 16px', borderRadius:999 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#1A1206' }} />
              هيئة التدريب
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, margin:'18px 0 0', color:OFF }}>
              مَن <span style={{ color:GLD }}>يُدرّبك؟</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16, color:MUT, maxWidth:620, marginTop:14, marginInline:'auto' }}>
              مدرّبان، وتقسيم واضح: الأوّل يبني ما تقوله، والثاني يبني كيف تقوله.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:24, marginTop:52 }}>
            {TRAINERS.map(tr => (
              <article key={tr.name} style={{ background:CARD, border:`1px solid ${CBR}`, borderRadius:20, padding:'clamp(22px,2.5vw,30px)', display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div className="tr-ava">
                    <img src={tr.img} alt={tr.name} style={tr.imgPosition ? { objectPosition:tr.imgPosition } : undefined} />
                  </div>
                  <div>
                    <div style={{ fontFamily:F, fontWeight:800, fontSize:18, color:OFF }}>{tr.name}</div>
                    <div style={{ fontFamily:F, fontSize:12.5, color:GLD, marginTop:4, lineHeight:1.5 }}>{tr.role}</div>
                  </div>
                </div>
                <p style={{ fontFamily:F, fontSize:13.5, color:MUT, lineHeight:1.85, flex:1 }}>{tr.bio}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {tr.chips.map(c => (
                    <span key={c} style={{ fontFamily:F, fontSize:12, color:LT, background:'rgba(255,255,255,.04)', border:`1px solid ${CBR}`, padding:'4px 11px', borderRadius:999 }}>{c}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:34 }}>
            <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:9, background:CARD, color:OFF, border:`1px solid ${CBR}`, fontFamily:F, fontWeight:700, fontSize:15, padding:'13px 28px', borderRadius:999, textDecoration:'none' }}>
              اسأل عن جدول المدرّبين <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          07. معرض الصور — من داخل القاعة
      ═══════════════════════════════════════ */}
      <section style={{ padding:'96px 0', background:'#080610', overflow:'hidden' }}>
        <div style={WRP}>

          {/* Header */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:52 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,193,7,.1)', border:`1px solid rgba(255,193,7,.25)`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'7px 16px', borderRadius:999, marginBottom:18 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:GLD }} />
              من داخل القاعة
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(26px,4vw,42px)', color:OFF, lineHeight:1.3, margin:0 }}>
              لحظات <span style={{ color:GLD }}>حقيقية</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16, color:MUT, marginTop:12, maxWidth:520 }}>
              تدريب أمام جمهور حقيقي، في قاعة حقيقية — هذا ما يميّز الماستركلاس.
            </p>
          </div>

          {/* ── Grid ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gridTemplateRows:'320px 240px', gap:8, borderRadius:24, overflow:'hidden' }}>

            {/* صورة 1 — صهيب يتكلم، تمتد عامودياً */}
            <div style={{ gridColumn:'1', gridRow:'1 / 3', position:'relative', overflow:'hidden' }}>
              <img src={galleryImg1} alt="د. صهيب الخوالدة يتحدث أمام الجمهور"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(8,6,16,.7) 0%, transparent 50%)' }} />
              <div style={{ position:'absolute', bottom:16, right:16, left:16 }}>
                <span style={{ fontFamily:F, fontSize:12, fontWeight:700, color:'rgba(255,255,255,.9)', background:'rgba(0,0,0,.45)', backdropFilter:'blur(6px)', padding:'5px 12px', borderRadius:999 }}>
                  د. صهيب · أمام جمهور حقيقي
                </span>
              </div>
            </div>

            {/* صورة 2 — قاعة جمهور كبيرة */}
            <div style={{ gridColumn:'2 / 4', gridRow:'1', position:'relative', overflow:'hidden' }}>
              <img src={galleryImg2} alt="جمهور ماستركلاس الخطابة في قاعة كبيرة"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(8,6,16,.65) 0%, transparent 55%)' }} />
              <div style={{ position:'absolute', bottom:16, right:16 }}>
                <span style={{ fontFamily:F, fontSize:12, fontWeight:700, color:'rgba(255,255,255,.9)', background:'rgba(0,0,0,.45)', backdropFilter:'blur(6px)', padding:'5px 12px', borderRadius:999 }}>
                  تدريب أمام جمهور حقيقي
                </span>
              </div>
            </div>

            {/* صورة 3 — جلسة ورشة عمل */}
            <div style={{ gridColumn:'2', gridRow:'2', position:'relative', overflow:'hidden' }}>
              <img src={galleryImg4} alt="جلسة تدريب تفاعلية داخل قاعة الماستركلاس"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(8,6,16,.6) 0%, transparent 50%)' }} />
              <div style={{ position:'absolute', bottom:14, right:14 }}>
                <span style={{ fontFamily:F, fontSize:11.5, fontWeight:700, color:'rgba(255,255,255,.9)', background:'rgba(0,0,0,.45)', backdropFilter:'blur(6px)', padding:'4px 10px', borderRadius:999 }}>
                  Workshop تفاعلي
                </span>
              </div>
            </div>

            {/* خانة 4 — إحصاء + صورة فوج الإمارات كـبيكغراوند */}
            <div style={{ gridColumn:'3', gridRow:'2', position:'relative', overflow:'hidden' }}>
              <img src={galleryImg3} alt="فوج خريجي الماستركلاس"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter:'brightness(.35)' }} />
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
                <span style={{ fontFamily:FP, fontSize:52, fontWeight:800, color:GLD, lineHeight:1 }}>+100</span>
                <span style={{ fontFamily:F, fontSize:13, fontWeight:700, color:OFF }}>خطيب تخرّج</span>
                <span style={{ fontFamily:F, fontSize:11, color:'rgba(255,255,255,.5)', textAlign:'center', maxWidth:120 }}>من أفواج الماستركلاس السابقة</span>
              </div>
            </div>

          </div>
          {/* ── نهاية الـGrid ── */}

        </div>
      </section>

      {/* ═══════════════════════════════════════
          08. التسجيل والدفع
      ═══════════════════════════════════════ */}
      <section id="checkout" className="sec sec--access" style={{ padding:'96px 0', scrollMarginTop:80 }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD }} />
              خطوتك نحو المنصّة
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, margin:'18px 0 0', color:OFF }}>
              استثمر في <span style={{ color:GLD }}>حضورك القيادي</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16, fontWeight:700, color:LT, marginTop:10 }}>
              الماستركلاس الكامل — اختر أسلوب دراستك وابدأ فوراً
            </p>
            <p style={{ fontFamily:F, fontSize:14.5, color:MUT, maxWidth:580, marginInline:'auto', marginTop:10, lineHeight:1.85 }}>
              برنامج متكامل يأخذك من رهبة المنصّة إلى الإنتاج الفعلي. اختر بين الحضور المباشر في القاعة أو الأونلاين التفاعلي.
            </p>
          </div>

          <div style={{ maxWidth:600, margin:'52px auto 0', position:'relative' }}>
            <div style={{ position:'absolute', inset:-3, background:`linear-gradient(135deg, rgba(255,193,7,.22), rgba(103,232,249,.10))`, borderRadius:30, filter:'blur(20px)', opacity:0.7, pointerEvents:'none' }} />

            <div style={{ position:'relative', background:'#131B27', border:`1px solid ${GL}`, borderRadius:26, overflow:'hidden', boxShadow:'0 0 0 1px rgba(255,193,7,.12), 0 34px 70px rgba(13,11,20,.45)' }}>

              {/* تبويبات */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${CBR}` }}>
                <button onClick={() => setCheckoutMode('onsite')} style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  padding:'18px 16px', border:'none', cursor:'pointer',
                  background:checkoutMode === 'onsite' ? 'rgba(255,193,7,.08)' : 'transparent',
                  borderBottom:checkoutMode === 'onsite' ? `2px solid ${GLD}` : '2px solid transparent',
                  transition:'background .2s, border-color .2s',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <MapPin size={14} color={checkoutMode === 'onsite' ? GLD : MUT} strokeWidth={2.2} />
                    <span style={{ fontFamily:F, fontSize:14.5, fontWeight:800, color:checkoutMode === 'onsite' ? GLD : MUT }}>حضوري</span>
                  </div>
                  <span style={{ fontFamily:F, fontSize:11.5, color:MUT }}>قاعة كاسيت | عمّان · 14 أيلول</span>
                  <span style={{ fontFamily:FP, fontSize:22, fontWeight:700, color:checkoutMode === 'onsite' ? GLD : LT, lineHeight:1 }}>500 <span style={{ fontSize:13 }}>JOD</span></span>
                </button>
                <button onClick={() => setCheckoutMode('live')} style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  padding:'18px 16px', border:'none', cursor:'pointer',
                  background:checkoutMode === 'live' ? 'rgba(103,232,249,.07)' : 'transparent',
                  borderBottom:checkoutMode === 'live' ? '2px solid #67e8f9' : '2px solid transparent',
                  transition:'background .2s, border-color .2s',
                  borderRight:`1px solid ${CBR}`,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <Wifi size={14} color={checkoutMode === 'live' ? '#67e8f9' : MUT} strokeWidth={2.2} />
                    <span style={{ fontFamily:F, fontSize:14.5, fontWeight:800, color:checkoutMode === 'live' ? '#67e8f9' : MUT }}>مباشر تفاعلي</span>
                  </div>
                  <span style={{ fontFamily:F, fontSize:11.5, color:MUT }}>عن بُعد (Online LIVE) · 17 أيلول</span>
                  <span style={{ fontFamily:FP, fontSize:22, fontWeight:700, color:checkoutMode === 'live' ? '#67e8f9' : LT, lineHeight:1 }}>$700</span>
                </button>
              </div>

              <div style={{ padding:'clamp(24px,3.5vw,36px)' }}>

                {/* سطر القيمة */}
                <p style={{ fontFamily:F, fontSize:13.5, color:LT, textAlign:'center', margin:'0 0 22px', lineHeight:1.7, minHeight:42 }}>
                  {checkoutMode === 'onsite'
                    ? <>42 ساعة تدريبية بـ<strong style={{ color:GLD }}>500 ديناراً</strong> — أي <strong style={{ color:GLD }}>أقلّ من 12 دينار للساعة</strong></>
                    : <>42 ساعة تدريبية تفاعلية — <strong style={{ color:'#67e8f9' }}>حضور مباشر من أي مكان بالعالم</strong></>
                  }
                </p>

                {/* قائمة المحتويات */}
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, padding:0, margin:'0 0 24px' }}>
                  {CHECKOUT_FEATURES.map(feat => (
                    <li key={feat} style={{ display:'flex', alignItems:'flex-start', gap:10, fontFamily:F, fontSize:14, color:LT, lineHeight:1.6 }}>
                      <CheckCircle2 size={16} color={GLD} strokeWidth={2.2} style={{ flexShrink:0, marginTop:2 }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* ضمان الجلسة الأولى */}
                <div style={{ display:'flex', alignItems:'flex-start', gap:13, background:'rgba(255,193,7,.07)', border:`1px solid rgba(255,193,7,.26)`, borderRadius:16, padding:'16px 18px', marginBottom:18 }}>
                  <ShieldCheck size={22} color={GLD} strokeWidth={2} style={{ flexShrink:0, marginTop:2 }} />
                  <div>
                    <div style={{ fontFamily:F, fontWeight:800, fontSize:14, color:OFF, marginBottom:5 }}>ضمان الجلسة الأولى — Risk Reversal</div>
                    <p style={{ fontFamily:F, fontSize:13, color:LT, lineHeight:1.8, margin:0 }}>
                      جرّب الجلسة الأولى كاملة. إن شعرت أنّ الماستركلاس لا يلبّي توقّعاتك، اطلب استرداداً كاملاً لرسومك خلال 24 ساعة من انتهائها — <strong style={{ color:OFF }}>دون أسئلة ولا شروط</strong>.
                    </p>
                  </div>
                </div>

                {/* تنبيه التقسيط */}
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:GS, border:`1px solid ${GL}`, borderRadius:12, padding:'11px 15px', marginBottom:22 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:GLD, flexShrink:0, marginTop:6 }} />
                  <span style={{ fontFamily:F, fontSize:13, color:LT, lineHeight:1.7 }}>
                    <strong style={{ color:OFF }}>التقسيط متاح:</strong> يمكنك الدفع كاملاً الآن أو تثبيت مقعدك بدفع الدفعة الأولى فقط
                    {' '}<strong style={{ color:GLD }}>{checkoutMode === 'onsite' ? '(50 JOD)' : '($70)'}</strong>.
                  </span>
                </div>

                {/* زر الدفع */}
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
                  احجز مقعدك في الماستركلاس — ادفع {checkoutMode === 'onsite' ? '50 ديناراً' : '$70'} الآن
                  <ArrowLeft size={15} />
                </button>

                {/* أمان */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:16, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:F, fontSize:12, color:MUT }}>
                    <Lock size={12} color={MUT} strokeWidth={2} />
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
        </div>
      </section>

      {/* ═══════════════════════════════════════
          07.5 استشارة مجانية
      ═══════════════════════════════════════ */}
      <section className="sec sec--consult" style={{ padding:'0 0 88px' }}>
        <div style={WRP}>
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

          <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:28 }}>
            {[
              { mode:'onsite' as const, label:'الحضوري', img:advisorAyaImg,  name:'آية القماز' },
              { mode:'live'   as const, label:'المباشر', img:advisorImg,     name:'ياقوت الخشاشنة' },
            ].map(({ mode, label, img, name }) => (
              <button key={mode} onClick={() => setCheckoutMode(mode)} style={{
                display:'flex', alignItems:'center', gap:9,
                background:checkoutMode === mode ? GS : 'transparent',
                border:`1px solid ${checkoutMode === mode ? GL : CBR}`,
                borderRadius:999, padding:'7px 16px 7px 10px', cursor:'pointer',
              }}>
                <div style={{ width:30, height:30, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:checkoutMode === mode ? `2px solid ${GLD}` : '2px solid transparent' }}>
                  <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <span style={{ fontFamily:F, fontWeight:700, fontSize:13, color:checkoutMode === mode ? GLD : MUT }}>{label}</span>
              </button>
            ))}
          </div>

          {(() => {
            const isOnsite = checkoutMode === 'onsite';
            const advisor = isOnsite
              ? { name:'آية القماز', role:'مستشارة المسار الحضوري', img:advisorAyaImg,
                  msg:'أهلاً 👋 أنا آية، مستشارة ماستركلاس الخطابة الحضوري. أخبرني عن تجربتك في التحدّث أمام الجمهور — وأساعدك تختار نقطة البداية الصح.',
                  link:waLink(WA_PHONE_ONSITE, 'مرحباً، أودّ حجز استشارة مجانية عن ماستركلاس الخطابة الحضوري') }
              : { name:'ياقوت الخشاشنة', role:'مستشارة المسار المباشر', img:advisorImg,
                  msg:'أهلاً 👋 أنا ياقوت، مستشارة ماستركلاس الخطابة المباشر. أخبرني عن تجربتك في التحدّث أمام الجمهور — وأساعدك تختار نقطة البداية الصح.',
                  link:WA_CONSULT };
            return (
              <div style={{ maxWidth:480, marginInline:'auto', borderRadius:20, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ background:'#1F2C34', padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid #25D366' }}>
                    <img src={advisor.img} alt={advisor.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:F, fontWeight:700, fontSize:14.5, color:'#E9EEF1', lineHeight:1.3 }}>{advisor.name}</div>
                    <div style={{ fontFamily:F, fontSize:12, color:'#8696A0', marginTop:1 }}>{advisor.role}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:'#25D366', boxShadow:'0 0 6px #25D366' }} />
                    <span style={{ fontFamily:F, fontSize:11, color:'#25D366', fontWeight:600 }}>متاحة</span>
                  </div>
                </div>
                <div style={{ background:'#0B141A', padding:'20px 16px 16px', minHeight:140, position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize:'20px 20px', pointerEvents:'none' }} />
                  <div style={{ position:'relative', maxWidth:'82%', background:'#1F2C34', borderRadius:'0 14px 14px 14px', padding:'10px 14px 8px', marginRight:'auto' }}>
                    <div style={{ position:'absolute', top:0, right:'100%', width:0, height:0, borderStyle:'solid', borderWidth:'0 8px 8px 0', borderColor:`transparent #1F2C34 transparent transparent` }} />
                    <p style={{ fontFamily:F, fontSize:14.5, color:'#E9EEF1', lineHeight:1.7, margin:0 }} dir="rtl">{advisor.msg}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:4, marginTop:5 }}>
                      <span style={{ fontFamily:F, fontSize:10.5, color:'#8696A0' }}>الآن</span>
                      <svg width="14" height="9" viewBox="0 0 16 10" fill="none"><path d="M1 5l3.5 3.5L10 1M6 5l3.5 3.5L15 1" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
                <a href={advisor.link} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:10, background:'#1F2C34', padding:'10px 12px', textDecoration:'none', borderTop:'1px solid rgba(255,255,255,0.06)', cursor:'pointer' }}>
                  <div style={{ flex:1, background:'#2A3942', borderRadius:22, padding:'9px 16px' }}>
                    <span style={{ fontFamily:F, fontSize:14, color:'#8696A0' }}>ابدأ المحادثة…</span>
                  </div>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(37,211,102,.4)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </div>
                </a>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          08. الأسئلة الشائعة
      ═══════════════════════════════════════ */}
      <section id="consult" className="sec sec--advisor" style={{ padding:'96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:GS, border:`1px solid ${GL}`, color:GLD, fontFamily:F, fontSize:12.5, fontWeight:700, padding:'6px 15px', borderRadius:999 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:GLD }} />
              الأسئلة الشائعة
            </span>
            <h2 style={{ fontFamily:F, fontWeight:800, fontSize:'clamp(28px,4.4vw,44px)', lineHeight:1.35, margin:'18px 0 0', color:OFF }}>
              ما يُسأَل <span style={{ color:GLD }}>قبل التسجيل</span>
            </h2>
            <p style={{ fontFamily:F, fontSize:16, color:MUT, maxWidth:580, marginInline:'auto', marginTop:14, lineHeight:1.8 }}>
              إجابات واضحة للأسئلة التي تتردّد كثيراً قبل الانضمام.
            </p>
          </div>
          <div style={{ maxWidth:780, marginInline:'auto' }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>

          <div style={{ textAlign:'center', marginTop:56 }}>
            <button onClick={scrollToCheckout}
              style={{ display:'inline-flex', alignItems:'center', gap:9, background:GLD, color:'#1A1206', fontFamily:F, fontWeight:800, fontSize:16, padding:'15px 32px', borderRadius:999, border:'none', cursor:'pointer', boxShadow:'0 10px 30px rgba(255,193,7,.24)' }}>
              احجز مقعدك في الفوج القادم <ArrowLeft size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* sticky CTA */}
      {stickyVisible && (
        <div style={{ position:'fixed', bottom:0, insetInline:0, zIndex:50, padding:'12px 16px', background:'rgba(13,11,20,.94)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', borderTop:`1px solid ${CBR}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ fontFamily:F, fontSize:13.5, color:LT, lineHeight:1.4 }}>
            <span style={{ fontWeight:800, color:OFF }}>ماستركلاس الخطابة</span>
            <span style={{ color:MUT, marginInlineStart:8 }}>يبدأ 14 أيلول</span>
          </div>
          <button onClick={scrollToCheckout}
            style={{ display:'inline-flex', alignItems:'center', gap:7, background:GLD, color:'#0f172a', fontFamily:F, fontWeight:800, fontSize:13.5, padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            احجز مقعدك <ArrowLeft size={13} />
          </button>
        </div>
      )}

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSlug="masar-khataba"
        courseTitle="ماستركلاس فن الخطابة والتواصل القيادي"
        cohortIdOnsite={303}
        cohortIdLive={304}
        cohortStartAr={checkoutMode === 'onsite' ? 'الاثنين، 14 أيلول 2025' : 'الأربعاء، 17 أيلول 2025'}
        cohortStartISOOnsite="2025-09-14"
        cohortStartISOLive="2025-09-17"
        cohortDays={checkoutMode === 'onsite' ? 'الاثنين والأربعاء والسبت' : 'الأربعاء والسبت'}
        cohortTimeAr="6:00 مساءً"
        cohortTrainer="د. صهيب الخوالدة"
        priceJOD={500}
        priceUSD={700}
        initialMode={checkoutMode}
      />
    </div>
  );
}
