/**
 * CourseArabicLanguagePage — تمكين اللغة العربية وفنون التحرير اللغوي
 * غلاف رفيع — كل المنطق في CoursePageLayout
 */

import { BookOpen, SlidersHorizontal, Star, Mic, Briefcase, Zap, Tv, Video, Award } from 'lucide-react';
import CoursePageLayout, { type CoursePageLayoutProps } from '../components/CoursePageLayout';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCoursePricing } from '../hooks/useCoursePricing';

import heroCover from '@assets/دورة_اللغة_العربية_1785758462657.png';
import ranaImg   from '@assets/trainer-rana-azzam_1785428982698.JPG';
import yaqoutImg from '@assets/ياقوت__1785619557679.jpeg';

const GOLD_INK = '#8A6200';

const config: CoursePageLayoutProps = {
  courseSlug: 'arabic-language',
  title: 'تمكين اللغة العربية وفنون التحرير اللغوي',
  categoryBadge: 'اللغة العربية',
  description: 'ثماني جلسات مباشرة تتقن فيها النحو والصرف والإملاء وفنون التحرير، وتنتج نصوصاً عربية سليمة وبليغة — بإشراف الإعلامية رنا العزام.',
  heroImage: heroCover,
  heroImagePosition: 'center 30%',
  showBackLink: false,
  installmentStyle: 'muted',

  modes: [
    {
      key: 'live',
      label: 'مباشر تفاعلي (Online LIVE)',
      icon: 'wifi',
      platform: 'Google Meet',
      price: '150',
      currency: '$',
      cohortFilter: 'live',
      badgeSeats: '≤25 متدرّباً',
      badgeMeetings: '8 جلسات',
      badgeHours: '16 ساعة تدريبية',
      brochure: { href: '/brochures/arabic-language.pdf', label: 'تحميل البروشور', style: 'gold' },
      waPhone: '962771052222',
      waMessage: 'السلام عليكم، أرغب في الاستفسار عن دورة تمكين اللغة العربية وفنون التحرير اللغوي (مباشر تفاعلي Online LIVE)',
      accentStyle: 'teal',
    },
  ],

  heroTrainers: [
    { img: ranaImg, name: 'رنا العزام' },
  ],

  shareTitle: 'تمكين اللغة العربية وفنون التحرير — كاسيت أكاديمي',
  shareDescription: 'ثماني جلسات مباشرة تتقن فيها النحو والصرف والإملاء وفنون التحرير مع رنا العزام',

  programDescription: 'دورة متكاملة تعالج اللغة العربية من جذورها: النحو والصرف والإملاء، مع فنون التحرير الأدبي والإعلامي المعاصر. ثماني جلسات مباشرة تحوّلك من كاتب صحيح إلى كاتب مؤثر — بإشراف الإعلامية رنا العزام.',

  advisors: [
    { name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي (Online LIVE)', img: yaqoutImg, href: 'https://wa.me/962771052222' },
  ],

  goals: [
    { icon: <BookOpen size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'النحو والصرف في الكتابة والتحدث',  text: 'توظيف قواعد النحو والصرف بسلاسة في الكتابة والتحدث بثقة كاملة — من القاعدة إلى التطبيق الفوري.' },
    { icon: <SlidersHorizontal size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'التحرير والتدقيق المعاصر',    text: 'امتلاك أدوات تحرير النصوص ومراجعتها وتدقيقها بمعايير معاصرة مع القدرة على رصد الأخطاء وتصحيحها.' },
    { icon: <Star size={22} strokeWidth={1.8} color={GOLD_INK} />,         title: 'تجنّب الأخطاء الإعلامية الشائعة', text: 'تجنب الأخطاء الإملائية والأسلوبية الشائعة في الإعلام والمنصات الرقمية والتحدث بلغة سليمة ومهنية.' },
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,          title: 'نصوص عربية رصينة ومتماسكة',       text: 'إنتاج نصوص عربية سليمة ومتماسكة بأسلوب رصين يجمع الفصاحة والإيجاز — يناسب الإعلام والمحتوى الرقمي.' },
    { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'تحليل النصوص وتشخيص الخلل اللغوي', text: 'تطوير القدرة على تحليل النصوص الأدبية والإعلامية واكتشاف مواطن القوة والخلل اللغوي فيها بدقة.' },
    { icon: <Zap size={22} strokeWidth={1.8} color={GOLD_INK} />,          title: 'البلاغة والأسلوب والرشاقة اللغوية', text: 'الأسلوب العربي وفنون رشاقة النص، والبلاغة الوظيفية في التحرير اللغوي المعاصر لرفع مستوى الكتابة.' },
  ],

  outcomes: [
    { icon: <Tv size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'تقرير صحفي ميداني متكامل',       text: 'إنتاج تقرير صحفي احترافي بمعايير غرف الأخبار، يُستخدم في المحفظة المهنية مباشرة.' },
    { icon: <Video size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'تسجيل تقديمي أمام الكاميرا',    text: 'تسجيل أداء تقديمي مُقيَّم مباشرةً من المدربة — وثيقة مهنية تُبرز قدراتك الإعلامية.' },
    { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'شهادة معتمدة رسمياً',            text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
  ],

  graduationProject: {
    intro: 'في الجلسة الثامنة يُنتج كل متدرّب مشروعه الختامي بإشراف مباشر من المدربة: <strong style="color:#18202F">تحرير نصوص إعلامية وأدبية وأكاديمية مع تصويب فوري — وإنتاج المشروع النهائي.</strong>',
    sessions: [
      { num: '1', title: 'التحرير والمراجعة اللغوية', body: 'تطبيق شامل لمهارات التحرير والتدقيق على نصوص متنوعة مع تصويب فوري من المدربة.' },
      { num: '2', title: 'المشروع الختامي المتكامل', body: 'إنتاج نص عربي محرَّر ومدقَّق يجمع كل ما تعلّمته — وتقديمه لتقييم المدربة المباشر.' },
    ],
    finalOutput: 'مشروع تحرير متكامل + شهادة إتمام معتمدة من وجيز وكاسيت.',
  },

  curriculumModes: [
    {
      key: 'live',
      label: 'مباشر تفاعلي (Online LIVE)',
      icon: 'wifi',
      accentStyle: 'teal',
      lectures: [
        { title: 'النظام اللغوي في العربية وتفكيك الأخطاء الشائعة', desc: 'فهم منظومة اللغة العربية وبنية الجملة — الأساس الذي تُبنى عليه كل المهارات اللغوية والكتابية.' },
        { title: 'النحو الوظيفي وبناء الجمل المستقيمة',              desc: 'نحو عملي: إعراب الجمل في السياق الحقيقي، بناء الجمل الاسمية والفعلية وتطبيقها في التحرير.' },
        { title: 'الأساليب اللغوية والتوظيف الأدائي',               desc: 'أنماط التعبير العربي المختلفة: الخبري والإنشائي، المباشر والأدبي — وكيف تختار الأسلوب لكل سياق.' },
        { title: 'علم الصرف الوظيفي وصياغة الألفاظ المشتقة',        desc: 'أوزان الأفعال والمصادر والمشتقات — مفتاح توسيع المعجم الذهني واستخدام الألفاظ بدقة ومرونة.' },
        { title: 'سلامة الإملاء وعلامات الترقيم في الإعلام الجديد',  desc: 'قواعد الإملاء الحاسمة: الهمزات، التاء المربوطة والمفتوحة، الألف اللينة — مع تدريبات تصحيح نصوص.' },
        { title: 'الأسلوب العربي وفنون رشاقة النص',                 desc: 'تقنيات تحسين الأسلوب وبناء الفقرات وتدفق الأفكار — الانتقال من الصحيح إلى المؤثر.' },
        { title: 'البلاغة الوظيفية وفنون التحرير اللغوي المعاصر',   desc: 'علمَا البيان والبديع: التشبيه والاستعارة والمجاز — كيف ترفع مستوى كتابتك وتُحيي النص.' },
        { title: 'التطبيقات العملية الكبرى ومشروع التخرّج المتكامل', desc: 'ورشة تحرير نصوص إعلامية وأدبية وأكاديمية مع تصويب فوري — وإنتاج المشروع الختامي الذي تُقيّمه المدربة.' },
      ],
      note: 'كل جلسة تبدأ بمراجعة التطبيق السابق وتنتهي بتمرين على نص حقيقي — التعلّم عملي من اللحظة الأولى.',
    },
  ],

  trainers: [
    {
      img: ranaImg, name: 'رنا العزام', title: 'إعلامية ومختصة تحرير لغوي ومدققة لغة',
      bio: 'معدّة ومقدّمة برامج فضائية وإذاعية معتمدة. محررة ومدققة لغوية في مجمع اللغة العربية الأردني — المرجع اللغوي الأول في المنطقة. حاصلة على بكالوريوس اللغة العربية بتقدير جيد جداً من جامعة اليرموك والمركز الثاني عربياً لأفضل إنتاج إعلامي.',
      badges: [
        { label: 'مجمع اللغة العربية — محررة', type: 'qual'    },
        { label: '+10 سنوات خبرة',             type: 'achieve' },
        { label: 'مدرّبة معتمدة',              type: 'cert'    },
      ],
    },
  ],
};

export default function CourseArabicLanguagePage() {
  usePageMeta({
    title: 'تمكين اللغة العربية وفنون التحرير اللغوي',
    description: 'دورة 16 ساعة مباشر تفاعلي مع رنا العزام. إتقان النحو والصرف والإملاء وفنون التحرير. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  const { pricing } = useCoursePricing('arabic-language');
  const dynamicConfig = {
    ...config,
    modes: config.modes.map(m => ({
      ...m,
      ...(m.key === 'onsite' && pricing?.onsitePriceJOD != null && { price: String(pricing.onsitePriceJOD) }),
      ...(m.key === 'live'   && pricing?.livePriceUSD  != null && { price: String(pricing.livePriceUSD) }),
    })),
  };
  return <CoursePageLayout {...dynamicConfig} />;
}
