/**
 * صفحة ماستركلاس فن الخطابة والتواصل القيادي — كاسيت أكاديمي
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '../hooks/usePageMeta';
import { ChevronDown, ArrowLeft, MapPin, Wifi } from 'lucide-react';
import { GOLD, OFF, F, FP, INNER, waLink } from './shared/coursePageHelpers';
import MasterclassGuarantee from '../components/masterclass/MasterclassGuarantee';
import MasterclassFaqAccordion from '../components/masterclass/MasterclassFaqAccordion';
import MasterclassAdvisorCard from '../components/masterclass/MasterclassAdvisorCard';
import PaymentModal from '../components/PaymentModal';
import wajeezLogo    from '@assets/wajeez-logo_1785688262989.png';
import heroShot      from '@assets/cover-public-speaking-tedx_1785865159100.jpeg';
import trainerSohaib from '@assets/instructor-sohaib_1785863334821.jpeg';
import trainerOmar   from '@assets/trainer-omar_1785692015818.jpg';
import advisorImg    from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import corpPhoto1    from '@assets/WhatsApp_Image_2026-08-04_at_7.40.10_PM_1785863327459.jpeg';
import corpPhoto2    from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(1)_1785863327459.jpeg';
import corpPhoto3    from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(2)_1785863327459.jpeg';
import corpPhoto4    from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(4)_1785863327460.jpeg';
import gal1  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(7)_1785864910806.jpeg';
import gal2  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(6)_1785865142790.jpeg';
import gal3  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.10_PM_1785865149268.jpeg';
import gal4  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_1785865149268.jpeg';
import gal5  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.10_PM_(1)_1785865149269.jpeg';
import gal6  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(5)_1785865156136.jpeg';
import gal7  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(1)_1785865156137.jpeg';
import gal8  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(2)_1785865156137.jpeg';
import gal9  from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(3)_1785865156138.jpeg';
import gal10 from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(4)_1785865156138.jpeg';
import corpPhoto5 from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(7)_1785865787231.jpeg';

/* ── data ─────────────────────────────────────────────── */
const STATIONS = [
  { n:'01', phase:1,
    title:'أركان الخطابة وتحليل الجمهور',
    sub:'لا يُبنى خطاب قبل أن يُعرَف لمن يُقال؛ فالجمهور أوّل قيد على الكلام لا آخره.',
    chips:['أجزاء الخطاب','أنماط الاستدلال الثلاثة','تحليل الجمهور','الغرض الخطابي','الرسالة المركزية','مصداقية المتحدّث'],
    project:'بطاقة تحليل جمهور لموقف خطابي حقيقي من واقعك المهني، مع الغرض والرسالة المركزية.',
    ref:'هارفارد · ستانفورد', hot:false },
  { n:'02', phase:1,
    title:'إدارة رهبة المنصّة',
    sub:'رهبة المنصّة ليست عيباً في الشخصية، بل استجابة فسيولوجية معروفة الأسباب وقابلة للضبط.',
    chips:['فسيولوجيا القلق التواصلي','إعادة التأطير المعرفي','تمارين التنفّس والتهيئة','التعرّض المتدرّج','ضبط الجسد تحت التوتّر','التحضير المنهجي'],
    project:'إلقاء أوّل خطاب مدّته دقيقتان، مسجَّلاً بالفيديو، مع تقييم ذاتي موثَّق.',
    ref:'ستانفورد', hot:false },
  { n:'03', phase:1,
    title:'الصوت الخطابي: الجرس والإلقاء',
    sub:'الصوت المسموع في قاعة ليس الصوت المسموع في ميكروفون؛ ولكلٍّ منهما تقنيته.',
    chips:['التنفّس الحجابي','إسقاط الصوت','التنويع في الطبقة والسرعة','الصمت الوظيفي','مخارج الحروف','العناية بالصوت'],
    project:'إلقاء نصّ واحد بثلاث معالجات صوتية، مع تحليل أثر كلٍّ منها على المعنى.',
    ref:'ستانفورد', hot:false },
  { n:'04', phase:1,
    title:'لغة الجسد والحضور التنفيذي',
    sub:'يُحاكَم الخطيب على ما يُرى منه قبل أن يُحاكَم على ما يُقال؛ والتناقض بين الاثنين يُسقط الرسالة.',
    chips:['الوقفة والاتّزان','الإيماءة الوظيفية','التواصل البصري وتوزيعه','الحركة في المساحة','مكوّنات الحضور التنفيذي','التطابق اللفظي وغير اللفظي'],
    project:'تحليل مصوَّر لأدائك الجسدي، مع خطّة تصحيح فردية محدَّدة البنود.',
    ref:'ستانفورد', hot:false },
  { n:'05', phase:2,
    title:'هندسة بناء الخطاب',
    sub:'الخطاب بلا بناء يُنسى قبل انتهائه؛ والبناء لا يُلغي العفوية بل يحملها.',
    chips:['أنماط التنظيم الخمسة','خطّافات الافتتاح','الأطروحة وموضعها','الانتقالات والجُمل الرابطة','الخاتمة ودعوة الفعل','قاعدة الاقتصاد اللغوي'],
    project:'مخطَّط خطاب كامل مُراجَعاً ومُعدَّلاً بإشراف المدرّب.',
    ref:'ستانفورد', hot:false },
  { n:'06', phase:2,
    title:'الحجاج والإقناع',
    sub:'الإقناع صناعةٌ لها أركان تُدرَس، لا موهبةُ إلحاح.',
    chips:['أركان الحجّة وفق نموذج تولمِن','أنواع الأدلّة وتراتبها','المغالطات المنطقية','تفنيد الحجّة المضادّة','الإقناع الوجداني المشروع','أخلاقيات الإقناع'],
    project:'خطاب إقناعي (5 دقائق) مبنيّ على حجّة موثَّقة يتضمّن تفنيد حجّة مضادّة.',
    ref:'تولمِن · هارفارد', hot:true },
  { n:'07', phase:2,
    title:'الأساليب البلاغية: التروب والسكيم',
    sub:'ما يُقرأ بالعين لا يُسمَع بالأذن؛ وأكثر الخطابات ضعفاً نصوصٌ كُتبت للقراءة ثمّ أُلقيت.',
    chips:['لغة الكتابة ولغة الإسماع','التروب: الاستعارة والكناية والمجاز','السكيم: التوازي والتضادّ والتكرار','التوازن والسجع','إيقاع الجملة المُلقاة','العبارة القابلة للاقتباس'],
    project:'إعادة صياغة نصّ إداري جافّ إلى نصّ خطابي مسموع مع بيان التعديلات البلاغية.',
    ref:'هارفارد', hot:false },
  { n:'08', phase:2,
    title:'السرد الشخصي وصناعة الحكاية',
    sub:'الحجّة تُقنِع العقل، والحكاية تُبقي الرسالة. ومن لا يملك حكايته لا يُذكَر.',
    chips:['بنية الحكاية: الموقف والتحوّل والنتيجة','حدود الكشف الذاتي','اختيار الحكاية للرسالة','التفصيل الحسّي','الحكاية في مستهلّ الخطاب','أخلاقيات السرد الشخصي'],
    project:'حكاية شخصية (3 دقائق) مربوطة برسالة مهنية، مُلقاة ومصوَّرة.',
    ref:'ستانفورد', hot:true },
  { n:'09', phase:3,
    title:'العرض التقديمي والوسائل البصرية',
    sub:'الشريحة سندٌ للمتحدّث لا بديلٌ عنه؛ ومن قرأ شرائحه استغنى الجمهور عنه.',
    chips:['مبدأ الشريحة السند','التصميم المعرفي','البيانات في سياق خطابي','تسلسل الكشف','التعامل مع العطل التقني','الخطاب بلا وسائل'],
    project:'عرض تقديمي (7 دقائق) يُلقى مرّةً بالشرائح ومرّةً بدونها.',
    ref:'ستانفورد', hot:false },
  { n:'10', phase:3,
    title:'الحديث المرتجل وإدارة الأسئلة',
    sub:'يُختبَر المتحدّث في السؤال الذي لم يتوقّعه، لا في الخطاب الذي أعدّه.',
    chips:['أُطُر الإجابة المرتجلة','شراء الوقت مهنياً','إعادة صياغة السؤال','إدارة جلسة الأسئلة','السؤال العدائي','«لا أعرف» كإجابة مهنية'],
    project:'جلسة أسئلة محاكاة أمام مجموعة مدرَّبة على المعارضة، ثلاثة أسئلة غير معلَنة.',
    ref:'ستانفورد', hot:false },
  { n:'11', phase:3,
    title:'التواصل القيادي والحوارات الصعبة',
    sub:'أصعب ما يُلقيه القائد ليس الخطاب التحفيزي، بل القرار الذي لا يُرضي أحداً.',
    chips:['خطاب القائد أمام فريقه','الحوارات الصعبة','إدارة الاجتماعات','الخطاب في الأزمات','التواصل مع مجلس الإدارة','بناء السرد المؤسسي'],
    project:'خطابان: الأوّل يُبلّغ قراراً مؤسسياً صعباً، والثاني يُحفّز فريقاً بعد انتكاسة.',
    ref:'ستانفورد', hot:false },
  { n:'12', phase:3,
    title:'الخطابة الجماهيرية والظهور الإعلامي',
    sub:'على المنصّة تملك الوقت؛ وأمام الكاميرا يملكه المحاور.',
    chips:['الخطاب أمام جمهور كبير','المسرح والإضاءة والميكروفون','المحفوظ مقابل المرتَجل المبنيّ','إيقاع الخطاب الطويل','المنصّة مقابل الكاميرا','المقابلة الصعبة والتصريح الصحفي'],
    project:'خطاب جماهيري (8 دقائق) على منصّة، ومقابلة محاكاة مصوَّرة.',
    ref:'هارفارد · ستانفورد', hot:false },
] as const;

const PHASE_BANDS = [
  { from:0, to:4,  label:'المرحلة الأولى',  sub:'التأسيس · 14 ساعة · 7 جلسات',               color: GOLD },
  { from:4, to:8,  label:'المرحلة الثانية', sub:'بناء الخطاب والإقناع · 16 ساعة · 8 جلسات',  color: '#67e8f9' },
  { from:8, to:12, label:'المرحلة الثالثة', sub:'المنصّة والقيادة · 14 ساعة · 7 جلسات',       color: '#a78bfa' },
];

const ALBUM = [
  { n:'01', title:'بطاقة تحليل جمهور لموقف مهني',         kind:'وثيقة', hot:false },
  { n:'02', title:'خطاب أوّل (دقيقتان) + تقييم ذاتي',     kind:'فيديو',  hot:false },
  { n:'03', title:'نصّ واحد بثلاث معالجات صوتية',          kind:'صوت',   hot:false },
  { n:'04', title:'تحليل أداء جسدي + خطّة تصحيح',         kind:'فيديو ووثيقة', hot:false },
  { n:'05', title:'مخطَّط خطاب كامل مُراجَع',               kind:'وثيقة', hot:false },
  { n:'06', title:'خطاب إقناعي (5 دقائق) بحجّة موثَّقة',  kind:'فيديو',  hot:true  },
  { n:'07', title:'نصّ إداري معاد الصياغة بلاغياً',        kind:'وثيقة', hot:false },
  { n:'08', title:'حكاية شخصية (3 دقائق) مربوطة برسالة',  kind:'فيديو',  hot:true  },
  { n:'09', title:'عرض تقديمي (7 دقائق) + نسخة بلا شرائح',kind:'فيديو وشرائح', hot:false },
  { n:'10', title:'جلسة أسئلة محاكاة أمام معارضة',         kind:'فيديو',  hot:false },
  { n:'11', title:'خطاب قرار صعب + خطاب تحفيزي',          kind:'فيديو',  hot:false },
  { n:'12', title:'خطاب جماهيري (8 دقائق) + مقابلة محاكاة',kind:'فيديو', hot:false },
];

const TRAINERS = [
  {
    name: 'د. صهيب الخوالدة',
    role: 'خبير تخطيط استراتيجي وتواصل قيادي · المدرّب الرئيس',
    bio: 'يشغل منصب مدير الأبحاث والسياسات في مؤسسة قطر، بخبرة مهنية تتجاوز ستة عشر عاماً في تطوير الأعمال وإدارة المشاريع والقيادة الاستراتيجية. حاصل على الدكتوراة في إدارة الأعمال من جامعة أستون (المملكة المتحدة)، وماجستير إدارة الأعمال بتقدير امتياز، وماجستير في المحاسبة والتمويل من جامعة برمنغهام.',
    chips: ['أركان الخطابة','هندسة البناء','الحجاج والإقناع','الحديث المرتجل','التواصل القيادي'],
    tag: 'يُدرّس المحطات 01 · 05 · 06 · 10 · 11 — المحتوى والاستراتيجية',
    img: trainerSohaib,
  },
  {
    name: 'عمر الدرابكة',
    role: 'معلّق صوتي محترف · مدرّب أداء وإلقاء خطابي',
    bio: 'سجّل بصوته مئات الأفلام الوثائقية والإعلانات لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع في فلوريدا، ويمتلك خبرة تزيد على اثنتي عشرة سنة في التدريب الصوتي والتمكين اللغوي.',
    chips: ['رهبة المنصّة','الصوت الخطابي','لغة الجسد','الأساليب البلاغية','السرد','المنصّة والكاميرا'],
    tag: 'يُدرّس المحطات 02 · 03 · 04 · 07 · 08 · 09 · 12 — الأداء والصوت والحضور',
    img: trainerOmar,
  },
];

const FAQS = [
  { q:'أخاف من الحديث أمام الناس خوفاً شديداً — هل هذا الماستركلاس لي؟',
    a:'نعم، وهو مبنيّ على ذلك. المحطة الثانية مخصّصة بالكامل لرهبة المنصّة، وتُعالِجها بوصفها استجابة فسيولوجية معروفة الأسباب لا عيباً في الشخصية: بإعادة التأطير المعرفي، وتمارين التهيئة، والتعرّض المتدرّج من المجموعة الصغيرة إلى المنصّة. ويبدأ أوّل أداء لك بخطاب من دقيقتين لا بخطاب جماهيري.' },
  { q:'هل الدفع آمن؟ وهل التقسيط متاح؟',
    a:'الدفع إلكتروني بالكامل عبر بوّابة دفع آمنة، ولا تحتفظ كاسيت ببيانات بطاقتك. والتقسيط متاح: تُثبَّت مقعدك بدفعة أولى، وتُوزَّع باقي الدفعات على مراحل الماستركلاس.' },
  { q:'متى يبدأ الفوج القادم؟ وما الجدول الأسبوعي؟',
    a:'يبدأ الفوج القادم في 14 أيلول (سبتمبر)، الجدول الأسبوعي: الاثنين والأربعاء والسبت.' },
  { q:'هل يُصوَّر أدائي؟ لا أرغب في ذلك.',
    a:'يُصوَّر، والتصوير جزء بنيوي من المنهج لا خيار فيه؛ فلا يُصحَّح أداء لم يُرَ. أمّا التسجيلات فتبقى خاصّة بك وبمدرّبك، ولا تُنشر إلا بإذنك الصريح. ومن لا يستطيع الالتزام بذلك، فالماستركلاس غير مناسب له.' },
  { q:'هل أحتاج خبرة سابقة في الخطابة؟',
    a:'لا. المرحلة الأولى تفترض عدم وجود خبرة، وتبني الحضور والصوت والجسد من الأساس. أمّا من لديه خبرة، فالمرحلتان الثانية والثالثة تُضيفان إليه بناءَ الخطاب والحجاج والسرد وإدارة الجمهور — وهي أكثر ما يُفقده الخطباء المتمرّسون.' },
  { q:'هل يمكنني اختيار بعض المحطات فقط؟',
    a:'لا، والقرار أكاديمي. المحطات مترتّبة ترتيباً بنائياً: يُفترض إتمام كلٍّ منها لدخول ما بعدها. ومن أراد مهارة واحدة فقط، فالأنسب له دورة مستقلّة لا ماستركلاس.' },
  { q:'ما الفرق بين هذا الماستركلاس وماستركلاس التعليق الصوتي؟',
    a:'المعلّق الصوتي يعمل خلف ميكروفون ولا يراه أحد؛ فالصوت عنده هو المنتَج بأكمله. والخطيب يُرى ويُحاكَم على حضوره وبناء كلامه وقدرته على الإقناع كما يُحاكَم على صوته. لذلك يتضمّن هذا الماستركلاس محاور غائبة عن الآخر: القلق التواصلي، ولغة الجسد، والحجاج، والسرد، وإدارة الجمهور المعارض.' },
  { q:'ما قيمة فيديو التخرّج عملياً؟',
    a:'هو ما يُطلَب منك حين تُرشَّح للحديث في مؤتمر أو فعالية: تسجيل سابق لأداء كامل. وإنتاجه بجودة النشر — مصوَّراً بكاميرتين وبصوت ملتقط منفصلاً ومُخرَجاً — يفرق فرقاً حاسماً عن تسجيل هاتف من الصفوف الخلفية.' },
];

/* ── tokens ─────────────────────────────────────────── */
const GLD  = GOLD;
const GS   = 'rgba(255,193,7,0.09)';
const GL   = 'rgba(255,193,7,0.26)';
const MUT  = '#8A97AE';
const LT   = '#C8D3E2';
const CARD = 'rgba(255,255,255,0.04)';
const CBR  = 'rgba(255,255,255,0.08)';
const INK  = '#18202F';

const WA_PHONE   = '962771052222';
const WA_PHONE2  = '962790234483';
const WA_ENROLL  = waLink(WA_PHONE,  'مرحباً، أودّ حجز مقعدي في ماستركلاس فن الخطابة والتواصل القيادي');
const WA_CONSULT = waLink(WA_PHONE,  'مرحباً، أودّ حجز استشارة تعليمية مجانية عن ماستركلاس فن الخطابة');
const WA_CORP    = waLink(WA_PHONE2, 'مرحباً، أودّ طلب عرض لفوج مؤسسي من ماستركلاس فن الخطابة والتواصل القيادي');

/* ── StudyRow accordion ────────────────────────────── */
function StudyRow({ variant }: { variant: 'inperson' | 'online' }) {
  const [open, setOpen] = useState(false);
  const isIP = variant === 'inperson';
  const ac = isIP ? GLD : '#67e8f9';
  const acRgb = isIP ? '255,193,7' : '103,232,249';
  const items = isIP
    ? [
        { t:'قاعة إلقاء بمنصّة وميكروفون وإضاءة', d:'تُلقي في بيئة المنصّة الحقيقية، لا في فصل دراسي.' },
        { t:'تصوير كلّ أداء والمراجعة عليه فوراً', d:'لا يُصحَّح أداء لم يُرَ؛ المراجعة المصوَّرة أسرع ألف مرة.' },
        { t:'جمهور حقيقي في محطّات المنصّة', d:'مجموعة مدرَّبة على المعارضة، لا زملاء متسامحون.' },
        { t:'ثلاث زيارات لمرحلة الإنتاج الفعلي', d:'مشروع التخرّج مُنتَج بكاميرتين وصوت ملتقط منفصل.' },
      ]
    : [
        { t:'جلسات مباشرة تفاعلية كاملاً', d:'لا تسجيلات مسبقة — التفاعل حيّ في الوقت الفعلي.' },
        { t:'تسليم أدائك مصوَّراً للمراجعة الفردية', d:'تُصوِّر إلقاءك وتُرسله قبل الجلسة للمراجعة.' },
        { t:'تسجيلات الجلسات متاحة للمراجعة', d:'تعود إليها متى شئت طوال فترة الماستركلاس.' },
        { t:'الإلقاء النهائي لمشروع التخرّج حضوري', d:'الأداء النهائي أمام جمهور حقيقي في عمّان.' },
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
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: 'rgba(252,251,251,0.96)' }}>
              {isIP ? 'حضوري — قاعة كاسيت في عمّان' : 'مباشر تفاعلي (Online LIVE)'}
            </div>
            <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>
              {isIP ? 'قاعة إلقاء بمنصّة وميكروفون وإضاءة احترافية' : 'من أي مكان في العالم — بث حيّ لا تسجيلات مسبقة'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          {['12 محطة','44 ساعة', isIP ? 'حضوري' : 'مباشر تفاعلي (Online LIVE)'].map(b => (
            <span key={b} style={{ fontFamily: F, fontSize: 10.5, color: MUT, background: CARD, border: `1px solid ${CBR}`, borderRadius: 6, padding: '2.5px 7px', whiteSpace: 'nowrap' }}>{b}</span>
          ))}
          <ChevronDown size={15} color={open ? ac : MUT} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
        </div>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid rgba(${acRgb},.18)` }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 20px', borderBottom: i < items.length - 1 ? `1px solid ${CBR}` : 'none' }}>
              <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 11, color: '#060A14', background: ac, borderRadius: '50%', flexShrink: 0, width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: 'rgba(252,251,251,0.96)', marginBottom: 3 }}>{item.t}</div>
                <div style={{ fontFamily: F, fontSize: 12.5, color: MUT, lineHeight: 1.7 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/* ── page ─────────────────────────────────────────────── */
export default function MasarKhatabaPage() {
  const [, navigate] = useLocation();
  const [openIdx, setOpenIdx]   = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment_intent') && p.get('redirect_status') === 'succeeded') setModalOpen(true);
  }, []);

  usePageMeta({
    title: 'ماستركلاس فن الخطابة والتواصل القيادي',
    description: 'ماستركلاس 44 ساعة في فن الخطابة والتواصل القيادي مع د. صهيب الخوالدة. بناء الحضور والثقة أمام الجمهور. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  function toggle(i: number) { setOpenIdx(openIdx === i ? null : i); setExpandAll(false); }
  function isOpen(i: number)  { return expandAll || openIdx === i; }
  function handleExpandAll()  { setExpandAll(v => !v); setOpenIdx(null); }

  const WRP: React.CSSProperties = { ...INNER };
  const SH: React.CSSProperties  = { textAlign: 'center', marginBottom: 52, direction: 'rtl' };

  return (
    <div dir="rtl" className="page-masar-canvas" style={{ fontFamily: F, color: OFF, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes kh-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .kh-live-dot { animation: kh-pulse 2s infinite; }

        /* Khataba geometric shapes — arcs + horizontal lines + stage triangle */
        .kh-arc {
          position: absolute; pointer-events: none; border-radius: 50%;
          border: 1px solid rgba(255,193,7,0.07);
        }
        .kh-hline {
          position: absolute; pointer-events: none; height: 1px;
          background: rgba(255,255,255,0.04);
        }
        .kh-triangle {
          position: absolute; pointer-events: none;
          width: 0; height: 0;
          border-left: 80px solid transparent;
          border-right: 80px solid transparent;
          border-bottom: 140px solid rgba(255,193,7,0.04);
        }

        /* trainer avatar */
        .kh-tr-ava { width:88px; height:88px; border-radius:50%; overflow:hidden; flex-shrink:0; border:2px solid rgba(255,193,7,.32); }
        .kh-tr-ava img { width:100%; height:100%; object-fit:cover; object-position:center top; }

        /* advisor avatar */
        .kh-adv-ava { width:100px; height:100px; border-radius:50%; overflow:hidden; border:3px solid ${GLD}; flex-shrink:0; }
        .kh-adv-ava img { width:100%; height:100%; object-fit:cover; object-position:center top; }

        /* album table */
        .kh-album-row { display:flex; align-items:flex-start; gap:16px; padding:13px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
        .kh-album-row:last-child { border-bottom:none; }

        /* cohort facts */
        .kh-cohort-facts { display:flex; flex-wrap:wrap; justify-content:center; gap:0; margin:28px auto 36px; max-width:800px; }
        .kh-cohort-facts > div { flex:1 0 240px; padding:20px 28px; border-left:1px solid rgba(255,255,255,0.08); text-align:center; }
        .kh-cohort-facts > div:first-child { border-left:none; }
        .kh-cf-l { display:block; font-size:11.5px; color:${MUT}; margin-bottom:6px; font-family:${F}; }

        /* modes grid */
        @media (max-width:640px) {
          .kh-modes-grid { grid-template-columns:1fr !important; }
          .kh-corp-grid  { grid-template-columns:1fr !important; }
          .kh-cohort-facts > div { flex:1 0 45%; }
        }
      `}</style>

      {/* back nav */}
      <div style={{ ...WRP, paddingTop: 92, paddingBottom: 0 }}>
        <button onClick={() => navigate('/')} aria-label="العودة إلى الدورات"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: F, fontSize: 13, color: MUT, padding: 0 }}>
          <ArrowLeft size={13} /> العودة إلى الدورات
        </button>
      </div>

      {/* ═══════════════════════════════════════
          1. HERO — full-cover background
      ═══════════════════════════════════════ */}
      <section className="sec sec--hero" style={{ position: 'relative', padding: 'clamp(72px,9vw,120px) 0 clamp(80px,10vw,130px)', overflow: 'hidden', minHeight: 600 }}>
        {/* full-cover background image */}
        <img src={heroShot} alt="" aria-hidden="true" fetchPriority="high" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 22%', zIndex: 0 }} />
        {/* dark gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.48) 40%, rgba(2,6,23,0.92) 100%)' }} />
        {/* subtle arc decorations */}
        {[320, 500, 680].map((r, i) => (
          <div key={i} className="kh-arc" style={{ width: r, height: r, bottom: -r*0.4, left: '50%', transform: 'translateX(-50%)', opacity: 0.28 - i*0.08, zIndex: 2 }} />
        ))}

        <div style={{ position: 'relative', zIndex: 3, ...WRP, direction: 'rtl' }}>
          {/* top chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '6px 14px', marginBottom: 28 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
            <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 700, color: GLD }}>ماستركلاس · 44 ساعة تدريبية</span>
          </div>

          <h1 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(34px,5vw,60px)', lineHeight: 1.22, margin: '0 0 20px', color: OFF, letterSpacing: -0.8, maxWidth: 720 }}>
            ماستركلاس<br />
            <span style={{ color: GLD }}>فن الخطابة</span><br />
            والتواصل القيادي
          </h1>

          <p style={{ fontFamily: F, fontSize: 16.5, color: MUT, lineHeight: 1.88, maxWidth: 560, marginBottom: 32,
            background: 'rgba(2,6,23,.50)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '16px 20px' }}>
            برنامج مهني متكامل يُعِدّك للحديث أمام جمهور والتأثير فيه: اثنتا عشرة محطة تبدأ من تحليل الجمهور وضبط رهبة المنصّة، وتمرّ ببناء الخطاب والحجاج والسرد، وتُختَم بمشروع تخرّج مصوَّر أمام جمهور حقيقي.
          </p>

          {/* fact chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
            {[
              { icon: '⏱', text: '44 ساعة · 22 جلسة' },
              { icon: '📁', text: '13 مخرجاً موثَّقاً' },
              { icon: '🎙', text: 'فيديو خطاب احترافي' },
              { icon: '🌐', text: 'حضوري أو مباشر تفاعلي (Online LIVE)' },
            ].map(({ icon, text }) => (
              <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(2,6,23,.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: `1px solid ${CBR}`, fontFamily: F, fontSize: 13.5, color: LT, padding: '8px 14px', borderRadius: 10 }}>
                <span>{icon}</span>{text}
              </span>
            ))}
          </div>

          {/* wajeez badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(2,6,23,.60)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${CBR}`, borderRadius: 12, padding: '10px 16px', marginBottom: 36 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: '#fff', display: 'grid', placeContent: 'center', padding: 5, flexShrink: 0 }}>
              <img src={wajeezLogo} alt="وجيز" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontFamily: F, fontSize: 13, color: MUT, lineHeight: 1.5 }}>
              <strong style={{ color: OFF }}>شهادة معتمدة من تطبيق وجيز</strong><br />
              أكبر مكتبة صوتية وبودكاست في الشرق الأوسط
            </span>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a href="#enroll" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: INK, fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.28)' }}>
              سجّل في الماستركلاس <ArrowLeft size={14} />
            </a>
            <a href="#tree"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9,
                background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                color: OFF, border: 'rgba(255,255,255,.18)', fontFamily: F, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 12, textDecoration: 'none',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)' }}>
              تصفّح المحطات الاثنتَي عشرة <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. STATIONS TREE
      ═══════════════════════════════════════ */}
      <section id="tree" className="sec sec--tree" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              منهج الماستركلاس
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              الطريق من رهبة المنصّة <span style={{ color: GLD }}>إلى الإقناع</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 640, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              أربع وأربعون ساعة على اثنتَين وعشرين جلسة، تُختَم بمرحلة إنتاج فعلي مصوَّرة أمام جمهور. كلّ محطة إلزامية وبترتيب مقصود؛ اضغط على أيّ محطة لتصفّح محاورها ومشروعها.
            </p>
          </div>

          {/* expand all */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button onClick={handleExpandAll}
              style={{ background: CARD, border: `1px solid ${CBR}`, color: LT, fontFamily: F, fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 10, cursor: 'pointer' }}>
              {expandAll ? 'إغلاق جميع المحاور' : 'فتح جميع المحاور'}
            </button>
          </div>

          {/* phase bands + stations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PHASE_BANDS.map(band => (
              <div key={band.label}>
                {/* phase header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 0' }}>
                  <div style={{ flex: 1, height: 1, background: `rgba(${band.color === GLD ? '255,193,7' : band.color === '#67e8f9' ? '103,232,249' : '167,139,250'},.25)` }} />
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: band.color, whiteSpace: 'nowrap' }}>{band.label}</span>
                  <span style={{ fontFamily: F, fontSize: 12, color: MUT }}>{band.sub}</span>
                  <div style={{ flex: 1, height: 1, background: `rgba(${band.color === GLD ? '255,193,7' : band.color === '#67e8f9' ? '103,232,249' : '167,139,250'},.25)` }} />
                </div>

                {/* stations in this phase */}
                {STATIONS.slice(band.from, band.to).map((st, idx) => {
                  const i = band.from + idx;
                  const open = isOpen(i);
                  return (
                    <div key={st.n} style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${open ? GL : CBR}`, marginBottom: 8, transition: 'border-color .2s' }}>
                      <button onClick={() => toggle(i)} aria-expanded={open}
                        style={{ width: '100%', background: open ? GS : CARD, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', cursor: 'pointer', textAlign: 'right', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: open ? GS : 'rgba(255,255,255,.04)', border: `1px solid ${open ? GL : CBR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 12, color: open ? GLD : MUT }}>{st.n}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: OFF }}>{st.title}</span>
                              {st.hot && <span style={{ background: GLD, color: INK, fontFamily: F, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999 }}>★ مميّز</span>}
                            </div>
                            <span style={{ fontFamily: F, fontSize: 13, color: MUT }}>{st.sub}</span>
                          </div>
                        </div>
                        <ChevronDown size={16} color={open ? GLD : MUT} strokeWidth={2.5} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }} />
                      </button>
                      {open && (
                        <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${GL}`, background: 'rgba(255,193,7,0.03)' }}>
                          {/* chips */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '16px 0 14px' }}>
                            {st.chips.map((c: string) => (
                              <span key={c} style={{ fontFamily: F, fontSize: 12.5, color: LT, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '5px 12px', borderRadius: 999 }}>{c}</span>
                            ))}
                          </div>
                          {/* project */}
                          <div style={{ background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
                            <span style={{ fontFamily: F, fontSize: 11.5, fontWeight: 700, color: GLD, marginBottom: 5, display: 'block' }}>مشروع المحطة</span>
                            <p style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.75, margin: 0 }}>{st.project}</p>
                          </div>
                          {/* ref */}
                          <span style={{ fontFamily: FP, fontSize: 11, color: MUT }}>المرجع: {st.ref}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* graduation project card */}
            <div style={{ borderRadius: 16, border: `1px solid rgba(255,193,7,.55)`, background: 'linear-gradient(135deg,rgba(255,193,7,0.07),rgba(103,232,249,0.03))', padding: 'clamp(22px,3vw,32px)', marginTop: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ background: GLD, color: INK, fontFamily: F, fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999 }}>3 جلسات + المونتاج</span>
                    <span style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: OFF }}>مشروع التخرّج · الإنتاج الفعلي</span>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.85, margin: '0 0 16px' }}>
                    بعد إتمام المحطات الاثنتَي عشرة تبدأ مرحلة الإنتاج الفعلي. ليست واجباً دراسياً، بل تجربة إلقاء وتصوير حقيقية تخرج منها بفيديو خطاب احترافي يصلح للنشر المهني.
                  </p>
                  {[
                    { n:'01', t:'بناء المخطَّط ومراجعته', d:'اختيار موضوع مشروعك وبناء المخطَّط وضبط الأطروحة والافتتاح والخاتمة.' },
                    { n:'02', t:'التمرين الموجَّه والتصحيح', d:'تمرين حيّ على الإلقاء، وتصحيح الأداء جملةً بجملة: الصوت والوقفات والإيماءة.' },
                    { n:'03', t:'الإلقاء النهائي المصوَّر', d:'إلقاء أمام جمهور حقيقي، مصوَّراً بكاميرتين وبصوت مُلتقط بميكروفون منفصل.' },
                  ].map(s => (
                    <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontFamily: FP, fontWeight: 800, fontSize: 11, color: INK, background: GLD, width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{s.n}</span>
                      <div>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 13.5, color: OFF, marginBottom: 2 }}>{s.t}</div>
                        <div style={{ fontFamily: F, fontSize: 12.5, color: MUT }}>{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* gold output box */}
                <div style={{ flex: '0 0 240px', background: GS, border: `1px solid ${GL}`, borderRadius: 14, padding: '18px 16px' }}>
                  <div style={{ fontFamily: F, fontSize: 12, fontWeight: 800, color: GLD, marginBottom: 10 }}>المخرج النهائي</div>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.8, margin: 0 }}>
                    فيديو خطاب كامل احترافي، صالح للنشر على المنصّات المهنية، مرفَق بتقرير تحليل أداء يوثّق نقاط قوّتك ومواضع تطوّرك — ويصلح ملفَّ ترشُّحٍ لمنصّات الحديث العامّ.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href="#enroll" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: INK, fontFamily: F, fontWeight: 800, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              احجز مقعدك في الفوج القادم <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. PORTFOLIO (album) — cream bg
      ═══════════════════════════════════════ */}
      <section className="sec sec--album" style={{ padding: '96px 0', background: '#F5F4F0' }}>
        <div style={WRP}>
          <div style={{ ...SH }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(138,98,0,.09)', border: '1px solid rgba(138,98,0,.28)', color: '#8A6200', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              محفظة الأعمال
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: '#18202F' }}>
              تتخرّج بأدلّة <span style={{ color: '#8A6200' }}>لا بشهادة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: '#4B5563', maxWidth: 620, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              الجهة المنظِّمة لا تسأل عن شهادتك، بل تطلب أن ترى تسجيلاً سابقاً لأدائك. هذه محفظتك عند إتمام الماستركلاس: ثلاثة عشر مخرجاً موثَّقاً بين فيديو ووثيقة.
            </p>
          </div>

          <div style={{ maxWidth: 760, margin: '0 auto', background: '#fff', borderRadius: 22, boxShadow: '0 22px 60px rgba(24,32,47,.12)', overflow: 'hidden', border: '1px solid rgba(24,32,47,.10)' }}>
            {/* header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid rgba(24,32,47,.10)' }}>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: '#374151' }}>محفظتك · 12 مخرجاً + مشروع التخرّج</span>
              <span style={{ background: '#8A6200', color: '#fff', fontFamily: FP, fontSize: 12, fontWeight: 800, padding: '4px 14px', borderRadius: 999 }}>13 مخرجاً</span>
            </div>

            {/* rows */}
            {ALBUM.map(item => (
              <div key={item.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '13px 28px', borderBottom: '1px solid rgba(24,32,47,.08)', background: item.hot ? 'rgba(255,193,7,.07)' : 'transparent' }}>
                <span style={{ fontFamily: FP, fontWeight: 700, fontSize: 12, color: item.hot ? '#8A6200' : '#9CA3AF', flexShrink: 0, width: 28, paddingTop: 2 }}>{item.n}</span>
                <span style={{ fontFamily: F, fontSize: 14, color: item.hot ? '#8A6200' : '#18202F', flex: 1, lineHeight: 1.55, fontWeight: item.hot ? 700 : 400 }}>
                  {item.title}
                  {item.hot && <span style={{ marginInlineStart: 8, background: '#8A6200', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 999 }}>★ ذهبي</span>}
                </span>
                <span style={{ fontFamily: F, fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{item.kind}</span>
              </div>
            ))}

            {/* graduation row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 28px', background: 'linear-gradient(90deg, rgba(255,193,7,.18), rgba(255,193,7,.06))', borderTop: '1px solid rgba(138,98,0,.28)' }}>
              <span style={{ fontFamily: FP, fontWeight: 900, fontSize: 14, color: '#8A6200', flexShrink: 0, paddingTop: 2 }}>★</span>
              <span style={{ fontFamily: F, fontSize: 14, color: '#8A6200', flex: 1, fontWeight: 800, lineHeight: 1.55 }}>مشروع التخرّج: فيديو احترافي + تقرير تحليل أداء</span>
              <span style={{ fontFamily: F, fontSize: 12, color: '#8A6200', flexShrink: 0, border: '1px solid rgba(138,98,0,.32)', background: 'rgba(138,98,0,.08)', padding: '3px 11px', borderRadius: 999 }}>إنتاج كامل</span>
            </div>

            <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(24,32,47,.10)', fontFamily: F, fontSize: 13.5, color: '#6B7280', lineHeight: 1.85 }}>
              <strong style={{ color: '#18202F' }}>المخرجان المميّزان بالذهبي</strong> هما الأكثر أثراً عملياً: الخطاب الإقناعي يُثبت قدرتك على بناء حجّة، والحكاية الشخصية هي ما يُذكَر منك بعد انتهاء الخطاب. أمّا مشروع التخرّج فهو ما يُطلَب منك حين تُرشَّح للحديث في مؤتمر أو فعالية.
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href="#trainers"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: '#18202F', border: '1px solid rgba(24,32,47,.22)', fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              تعرّف على المدرّبين <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. WAJEEZ
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
                  من متدرّب <span style={{ color: '#8FDAE3' }}>إلى متحدّث موثَّق</span>
                </h2>
                <p style={{ fontFamily: F, fontSize: 15, color: MUT, marginTop: 8, maxWidth: 540 }}>
                  لا يُختَم الماستركلاس بالشهادة. فوجيز — أكبر مكتبة صوتية وبودكاست في الشرق الأوسط — هي جهة الاعتماد، وهي كذلك المنصّة التي يصل إليها محتواك الصوتي.
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { n:'STEP 01', t:'تتخرّج بمخرج قابل للنشر', d:'فيديو خطابك النهائي وتقرير تحليل الأداء، منتَجان بجودة تصلح للعرض المهني.' },
                { n:'STEP 02', t:'تُقيَّم مادّتك فنياً', d:'تُسلّم مخرجك للمراجعة، وتصلك ملاحظات محدّدة إن احتاج الأمر تعديلاً.' },
                { n:'STEP 03', t:'يُتاح لك مسار المحتوى الصوتي', d:'باجتيازك التقييم تصبح مؤهَّلاً للترشيح لإنتاج محتوى صوتي على المنصّة.' },
              ].map(({ n, t, d }) => (
                <div key={n} style={{ background: 'rgba(255,255,255,.05)', border: `1px solid ${CBR}`, borderRadius: 14, padding: '22px 20px' }}>
                  <div style={{ fontFamily: FP, fontSize: 12, fontWeight: 700, color: '#8FDAE3', letterSpacing: 1.2, marginBottom: 8 }}>{n}</div>
                  <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 17, marginBottom: 8, color: OFF, lineHeight: 1.5 }}>{t}</h4>
                  <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: MUT, borderTop: `1px solid ${CBR}`, paddingTop: 20, marginTop: 24, lineHeight: 1.8 }}>
              الترشيح مرتبط باجتياز التقييم الفني وبتوفّر مشاريع مناسبة، وليس وعداً بعقد عمل. أمّا الشهادة والاعتماد فمضمونان لكلّ من يُكمل الماستركلاس.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. OUTCOMES — ما الذي ستُحقّقه
      ═══════════════════════════════════════ */}
      <section className="sec sec--outcomes" style={{ padding: '96px 0', background: '#0B1628' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              مخرجات الماستركلاس
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              ما الذي ستُحقّقه <span style={{ color: GLD }}>بعد الماستركلاس؟</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 560, marginTop: 14, marginInline: 'auto' }}>
              مخرجات ملموسة تُقدّمها لأصحاب العمل والجهات المنظِّمة — لا مجرّد شعور عام بالتحسّن.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginTop: 52 }}>
            {[
              { n:'01', t:'خطاب مبنيّ لا مرتجَل', d:'تُنشئ مخطَّطاً قبل أن تكتب، وتكتب للأذن لا للعين، فتُلقي في زمن أقلّ وبأثر أعلى.' },
              { n:'02', t:'حضور منصّي مضبوط', d:'صوت ثابت، وإيماءة مقصودة، وتواصل بصري موزَّع — وإجراء ثابت لضبط رهبة المنصّة.' },
              { n:'03', t:'قدرة إقناعية موثَّقة', d:'حجّة مكتملة الأركان، وتفنيد للحجّة المضادّة، وحكاية شخصية تحمل رسالتك.' },
              { n:'04', t:'فيديو خطاب احترافي وشهادة معتمدة', d:'مخرج منتَج بجودة النشر، مرفَق بتقرير تحليل أداء، وشهادة معتمدة من تطبيق وجيز.' },
            ].map(({ n, t, d }) => (
              <div key={n} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 18, padding: 'clamp(20px,2.5vw,28px)' }}>
                <div style={{ fontFamily: FP, fontSize: 11, fontWeight: 700, color: GLD, letterSpacing: 1.2, marginBottom: 12 }}>{n}</div>
                <h4 style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: OFF, marginBottom: 10, lineHeight: 1.4 }}>{t}</h4>
                <p style={{ fontFamily: F, fontSize: 13.5, color: MUT, lineHeight: 1.8, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="#enroll" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: INK, fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,193,7,.24)' }}>
              ابدأ مسيرتك على المنصّة <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. TRAINERS
      ═══════════════════════════════════════ */}
      <section id="trainers" className="sec sec--trainers" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              هيئة التدريب
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              مَن <span style={{ color: GLD }}>يُدرّبك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 540, marginTop: 14, marginInline: 'auto' }}>
              مدرّبان، وتقسيم واضح: الأوّل يبني ما تقوله، والثاني يبني كيف تقوله.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, marginTop: 52 }}>
            {TRAINERS.map(tr => (
              <article key={tr.name} style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(22px,2.5vw,30px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="kh-tr-ava">
                    <img src={tr.img} alt={tr.name} />
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
                <div style={{ fontFamily: F, fontSize: 12, color: MUT, paddingTop: 10, borderTop: `1px solid ${CBR}` }}>{tr.tag}</div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 999, textDecoration: 'none' }}>
              اسأل عن المدرّبين <ArrowLeft size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. PHOTO GALLERY
      ═══════════════════════════════════════ */}
      <section className="sec sec--gallery" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          {/* header */}
          <div style={{ ...SH, marginBottom: 48 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
              معرض التدريبات
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              على المنصّة —{' '}
              <span style={{ color: GLD }}>من صنعناهم في القاعة</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 580, marginTop: 14, marginInline: 'auto', lineHeight: 1.8 }}>
              لحظات من جلسات التدريب ومحطّات الإلقاء — هكذا يبدو تحوّل الخوف من المنصّة إلى ثقة في الخطاب.
            </p>
          </div>

          {/* masonry grid */}
          <style>{`
            .kh-gallery { columns: 3; column-gap: 14px; }
            .kh-gallery-item { break-inside: avoid; margin-bottom: 14px; border-radius: 14px; overflow: hidden; position: relative; display: block; }
            .kh-gallery-item img { width: 100%; height: auto; display: block; transition: transform .45s ease, filter .45s ease; filter: brightness(.88) saturate(.9); }
            .kh-gallery-item:hover img { transform: scale(1.04); filter: brightness(1) saturate(1); }
            .kh-gallery-item::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,14,24,.55) 0%, transparent 55%); pointer-events: none; }
            @media (max-width: 767px)  { .kh-gallery { columns: 2; } }
            @media (max-width: 480px)  { .kh-gallery { columns: 1; } }
          `}</style>

          <div className="kh-gallery">
            {([
              { src: gal4,  alt: 'خطيب أمام جمهور في قاعة محاضرات' },
              { src: gal1,  alt: 'منصّة مؤتمر — لجنة تحكيم' },
              { src: gal6,  alt: 'لقطة من جلسة تدريب' },
              { src: gal3,  alt: 'حوار تقديمي في بيئة مؤسسية' },
              { src: gal7,  alt: 'لقطة من جلسة تدريب' },
              { src: gal2,  alt: 'نقاش جماعي في التدريب' },
              { src: gal8,  alt: 'لقطة من جلسة تدريب' },
              { src: gal5,  alt: 'حضور مؤتمر وتواصل' },
              { src: gal9,  alt: 'لقطة من جلسة تدريب' },
              { src: gal10, alt: 'لقطة من جلسة تدريب' },
            ] as { src: string; alt: string }[]).map(({ src, alt }, i) => (
              <div key={i} className="kh-gallery-item">
                <img src={src} alt={alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. STUDY MODES
      ═══════════════════════════════════════ */}
      <section className="sec sec--modes" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              أسلوب الدراسة
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              المنهج واحد — <span style={{ color: GLD }}>والمكان اختيارك</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 16, color: MUT, maxWidth: 620, marginTop: 14, marginInline: 'auto' }}>
              نفس المنهج، ونفس المدرّبين، ونفس الشهادة المعتمدة. الفرق في مكان الإلقاء فقط.
            </p>
          </div>

          {/* summary cards */}
          <div className="kh-modes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 52 }}>
            {[
              { label:'حضوري — قاعة كاسيت في عمّان', sub:'حضور فعلي في عمّان', icon:<MapPin size={18} color="#1A1206" strokeWidth={2.2} />, ac:GLD, acRgb:'255,193,7',
                items:['قاعة إلقاء بمنصّة وميكروفون وإضاءة','تصوير كلّ أداء والمراجعة عليه فوراً','جمهور حقيقي من المتدرّبين لمحطّات المنصّة','ثلاث زيارات لمرحلة الإنتاج الفعلي'] },
              { label:'مباشر تفاعلي (Online LIVE)', sub:'من أي مكان في العالم العربي', icon:<Wifi size={18} color="#1A1206" strokeWidth={2.2} />, ac:'#67e8f9', acRgb:'103,232,249',
                items:['جلسات مباشرة تفاعلية بالكامل دون تسجيلات مسبقة','تسليم أدائك مصوَّراً للمراجعة الفردية','تسجيلات الجلسات متاحة للمراجعة','الإلقاء النهائي حضوري أمام جمهور'] },
            ].map(m => (
              <div key={m.label} style={{ background: CARD, border: `1px solid rgba(${m.acRgb},.22)`, borderRadius: 20, padding: 'clamp(22px,2.5vw,28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.ac, display: 'grid', placeContent: 'center', flexShrink: 0 }}>{m.icon}</div>
                  <div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15.5, color: OFF }}>{m.label}</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: MUT, marginTop: 2 }}>{m.sub}</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 9, margin: 0, padding: 0 }}>
                  {m.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontFamily: F, fontSize: 13.5, color: LT, lineHeight: 1.7 }}>
                      <span style={{ color: m.ac, fontSize: 14, marginTop: 3, flexShrink: 0 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* accordion rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <StudyRow variant="inperson" />
            <StudyRow variant="online" />
          </div>

          {/* why kaseet */}
          <div style={{ marginTop: 28, background: CARD, border: `1px solid ${CBR}`, borderRadius: 20, padding: 'clamp(24px,3vw,36px)' }}>
            <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(20px,2.6vw,26px)', color: OFF, marginBottom: 24 }}>
              ولماذا <span style={{ color: GLD }}>كاسيت</span> تحديداً؟
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
              {[
                { t:'الكاميرا جزء من المنهج', d:'لا يُصحَّح أداء لم يُرَ. يُصوَّر كلّ إلقاء ويُراجَع عليه، لأنّ المتحدّث لا يُدرك عادته الجسدية إلا رؤيةً.' },
                { t:'جمهور حقيقي لا زملاء متسامحون', d:'محطّات المنصّة وجلسة الأسئلة تُدار أمام مجموعة مدرَّبة على المعارضة، لأنّ التصفيق المُجامل لا يُخرِّج خطيباً.' },
                { t:'مدرّب من موقع القرار', d:'المدرّب الرئيس يمارس التواصل القيادي في منصب تنفيذي فعلي، فالمحتوى مبنيّ على تجربة إدارية لا على نظرية.' },
                { t:'فوج من خمسة عشر متدرّباً', d:'التغذية الراجعة المصوَّرة الفردية تستهلك وقتاً لكلّ متدرّب؛ وتجاوز العدد يعني تقليص نصيب كلٍّ منهم.' },
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
          9. PRICING
      ═══════════════════════════════════════ */}
      <section id="pricing" className="sec sec--access" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={SH}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GS, border: `1px solid ${GL}`, color: GLD, fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '6px 15px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: GLD }} />
              الأسعار والتسجيل
            </span>
            <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(28px,4.4vw,44px)', lineHeight: 1.35, margin: '18px 0 0', color: OFF }}>
              اختر طريقك <span style={{ color: GLD }}>إلى المنصّة</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 52, maxWidth: 860, margin: '52px auto 0' }}>
            {/* masterclass card — dark */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -2, background: 'linear-gradient(135deg,rgba(255,193,7,0.18),rgba(103,232,249,0.08))', borderRadius: 28, filter: 'blur(18px)', opacity: 0.6, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', background: '#131B27', border: '1px solid rgba(255,193,7,.55)', borderRadius: 24, padding: 'clamp(26px,4vw,38px)', boxShadow: '0 0 0 1px rgba(255,193,7,.20),inset 0 1px 0 rgba(255,193,7,.10),0 34px 70px rgba(24,32,47,.28)' }}>
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 12, padding: '5px 18px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(255,193,7,0.28)' }}>
                  الأكثر شمولاً
                </div>
                <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: `1px solid ${CBR}`, paddingTop: 10 }}>
                  <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF }}>الماستركلاس الكامل</h3>
                  <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginTop: 6, lineHeight: 1.65 }}>
                    44 ساعة · 12 محطة · 13 مخرجاً · مشروع تخرّج مصوَّر · شهادة معتمدة من وجيز
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 28, margin: '20px 0 0', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontFamily: FP, fontSize: 48, fontWeight: 700, color: GLD, lineHeight: 1, display: 'block' }}>500</span>
                      <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>JOD · حضوري عمّان</span>
                    </div>
                    <div style={{ width: 1, height: 52, background: CBR, flexShrink: 0 }} />
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontFamily: FP, fontSize: 48, fontWeight: 700, color: GLD, lineHeight: 1, display: 'block' }}>700</span>
                      <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>USD · مباشر تفاعلي (Online LIVE)</span>
                    </div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: GS, border: `1px solid ${GL}`, borderRadius: 12, padding: '9px 15px' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: GLD, flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13, color: LT }}>التقسيط متاح · تُثبَّت مقعدك بدفعة أولى</span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13, padding: '24px 0', margin: 0 }}>
                  {['44 ساعة تدريبية على 22 جلسة','ثماني محطات لا تُتاح خارج الماستركلاس','13 مخرجاً موثَّقاً بتغذية راجعة مصوَّرة','ثلاث جلسات إنتاج + مونتاج احترافي','تقرير تحليل أداء فردي','فوج من خمسة عشر متدرّباً لا أكثر'].map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.65 }}>
                      <span style={{ color: GLD, fontWeight: 800, flexShrink: 0 }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <a href="#enroll" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box', background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 6px 22px rgba(255,193,7,0.20)' }}>
                  احجز مقعدك في الفوج القادم <ArrowLeft size={15} />
                </a>
              </div>
            </div>

            {/* independent course card — light */}
            <div style={{ background: CARD, border: `1px solid ${CBR}`, borderRadius: 24, padding: 'clamp(26px,4vw,38px)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 21, color: OFF, marginBottom: 6 }}>دورة مستقلّة</h3>
              <p style={{ fontFamily: F, fontSize: 13, color: MUT, marginBottom: 20, lineHeight: 1.65 }}>
                للتجربة قبل الالتزام: «فن الخطابة والإلقاء الجماهيري المؤثّر».
              </p>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: FP, fontSize: 40, fontWeight: 700, color: LT, lineHeight: 1, display: 'block' }}>من 180</span>
                <span style={{ fontFamily: F, fontSize: 13, color: MUT, display: 'block', marginTop: 4 }}>JOD · 16 ساعة · 8 جلسات</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, padding: 0, margin: '0 0 24px', flex: 1 }}>
                {['مشروع تطبيقي واحد','شهادة إتمام الدورة','قيمتها تُخصم عند إكمال الماستركلاس'].map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontFamily: F, fontSize: 14, color: LT, lineHeight: 1.65 }}>
                    <span style={{ color: MUT, fontWeight: 800, flexShrink: 0 }}>✓</span> {feat}
                  </li>
                ))}
              </ul>
              <a href={WA_CONSULT} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', boxSizing: 'border-box', background: CARD, color: OFF, border: `1px solid ${CBR}`, fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 24px', borderRadius: 14, textDecoration: 'none' }}>
                تصفّح الدورات المستقلّة <ArrowLeft size={15} />
              </a>
            </div>
          </div>

          {/* institutional card — full width */}
          <div style={{ maxWidth: 860, margin: '20px auto 0', background: CARD, border: `1px solid ${CBR}`, borderRadius: 22, padding: 'clamp(24px,3.5vw,40px)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 28 }}>
            {/* photo strip */}
            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
              {[corpPhoto5, corpPhoto1, corpPhoto2].map((src, i) => (
                <div key={i} style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={src} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.82) saturate(.88)' }} />
                </div>
              ))}
            </div>
            {/* text */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: GS, border: `1px solid ${GL}`, borderRadius: 999, padding: '4px 12px', marginBottom: 10 }}>
                <span style={{ fontFamily: F, fontSize: 11.5, color: GLD, fontWeight: 700 }}>للمؤسسات والشركات</span>
              </div>
              <h3 style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: OFF, marginBottom: 8, lineHeight: 1.3 }}>هل أنت مؤسسة تعليمية أو شركة؟</h3>
              <p style={{ fontFamily: F, fontSize: 14, color: MUT, lineHeight: 1.78, margin: 0 }}>
                يُنفَّذ الماستركلاس كاملاً لفريق مؤسستك وحده، في مقرّكم أو في قاعة كاسيت، بجدول يُبنى على أوقات عملكم. ويُخصَّص المحتوى التطبيقي على مواقف حقيقية من بيئة مؤسستكم: عروض مجلس الإدارة، وإبلاغ القرارات، والخطاب في الأزمات.
              </p>
            </div>
            {/* CTA */}
            <a href={WA_CORP} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: GLD, color: '#0f172a', fontFamily: F, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 6px 22px rgba(255,193,7,.22)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
                <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.55 3.75 1.5 5.28L2 22l5-1.63a9.84 9.84 0 0 0 5.04 1.38c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2zm0 17.94c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.25 1.06 1.07-3.17-.2-.32a7.94 7.94 0 0 1-1.23-4.28c0-4.4 3.6-7.98 8.3-7.98 4.4 0 8 3.58 8 7.98s-3.6 8.1-8 8.1z"/>
              </svg>
              طلب استشارة مؤسسية <ArrowLeft size={14} />
            </a>
          </div>

          {/* payment strip */}
          <div style={{ maxWidth: 860, margin: '20px auto 0', background: CARD, border: `1px solid ${CBR}`, borderRadius: 16, padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F, fontSize: 13.5, color: MUT }}>الدفع إلكتروني بالكامل — تُسجَّل، وتدفع، ويصلك تأكيد المقعد فوراً</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['فيزا / ماستركارد','إي فواتيركم','CliQ','تقسيط على دفعات'].map(m => (
                <span key={m} style={{ fontFamily: F, fontSize: 12, color: LT, background: 'rgba(255,255,255,.04)', border: `1px solid ${CBR}`, padding: '5px 12px', borderRadius: 8 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GUARANTEE — ضمان الجلسة الأولى
      ═══════════════════════════════════════ */}
      <section style={{ padding: '72px 0' }}>
        <div style={WRP}>
          <MasterclassGuarantee />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          12. ADVISOR
      ═══════════════════════════════════════ */}
      <section id="consult" className="sec sec--advisor" style={{ padding: '96px 0' }}>
        <div style={WRP}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <MasterclassAdvisorCard
              name="ياقوت"
              role="المستشارة التعليمية — كاسيت أكاديمي"
              bio="جلسة قصيرة على واتساب تُحدَّد فيها نقطة بدايتك: يُقيَّم مستواك الحالي، ويُرشَّح لك المسار الأنسب لهدفك المهني."
              phone={WA_PHONE}
              waLabel="احجز استشارتك المجانية على واتساب (+962 77 105 2222)"
              imageSrc={advisorImg}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          13. FAQ
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
          <div style={{ marginTop: 48 }}>
            <MasterclassFaqAccordion faqs={FAQS} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          14. NEXT COHORT (closing CTA)
      ═══════════════════════════════════════ */}
      <section className="sec sec--cohort" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        {/* stage triangle light */}
        <div className="kh-triangle" style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }} aria-hidden="true" />
        {/* arcs */}
        {[320, 500, 680].map((r, i) => (
          <div key={i} className="kh-arc" style={{ width: r, height: r, bottom: -r * 0.6, left: '50%', transform: 'translateX(-50%)', opacity: 0.5 - i * 0.12 }} />
        ))}

        <div style={{ ...WRP, position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GLD, color: '#1A1206', fontFamily: F, fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1206' }} />
            الفوج القادم
          </span>
          <h2 style={{ fontFamily: F, fontWeight: 800, fontSize: 'clamp(30px,4.4vw,46px)', lineHeight: 1.3, margin: '16px 0 0', letterSpacing: -0.6, color: OFF }}>
            يبدأ في <span style={{ color: GLD }}>14 / 9</span>
          </h2>

          <div className="kh-cohort-facts" style={{ maxWidth: 880 }}>
            <div>
              <span className="kh-cf-l">الجدول الأسبوعي</span>
              <b style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: OFF }}>الاثنين والأربعاء والسبت</b>
            </div>
            <div>
              <span className="kh-cf-l">المدّة</span>
              <b style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: OFF }}>44 ساعة · 22 جلسة + الإنتاج</b>
            </div>
            <div>
              <span className="kh-cf-l">المقاعد</span>
              <b style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: '#f87171' }}>4 مقاعد متبقية</b>
            </div>
          </div>

          <a href="#enroll" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: GLD, color: '#1A1206', fontFamily: F, fontWeight: 800, fontSize: 15.5, padding: '15px 32px', borderRadius: 999, textDecoration: 'none', boxShadow: '0 10px 30px rgba(255,193,7,.28)' }}>
            احجز مقعدك في هذا الفوج <ArrowLeft size={14} />
          </a>
          <p style={{ fontFamily: F, fontSize: 14, color: MUT, marginTop: 18 }}>
            أو <a href="#consult" style={{ color: GLD, textDecoration: 'underline', textUnderlineOffset: 3 }}>تحدّث مع ياقوت أوّلاً</a> — استشارة مجانية دون التزام.
          </p>
        </div>
      </section>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSlug="masar-khataba"
        courseTitle="ماستركلاس فن الخطابة والتواصل القيادي"
        cohortIdOnsite={303}
        cohortIdLive={304}
        cohortStartAr="14 أيلول"
        cohortDays="الاثنين والأربعاء والسبت"
        cohortTimeAr="6:00 – 8:00 مساءً"
        cohortTrainer="عمر الدرابكة"
        priceJOD={500}
        priceUSD={700}
      />

    </div>
  );
}
