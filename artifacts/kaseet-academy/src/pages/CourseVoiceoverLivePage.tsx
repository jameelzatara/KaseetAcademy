/**
 * CourseVoiceoverLivePage — دورة التعليق والأداء الصوتي (مباشر تفاعلي)
 * غلاف رفيع — كل المنطق في CoursePageLayout
 */

import { AudioLines, Volume2, SlidersHorizontal, Mic, Sparkles, Briefcase, AudioWaveform, Award } from 'lucide-react';
import CoursePageLayout, { type CoursePageLayoutProps } from '../components/CoursePageLayout';
import { usePageMeta } from '../hooks/usePageMeta';

import heroCover from '@assets/course-omar-bg_1785692015818.png';
import omarImg   from '@assets/trainer-omar_1785428945248.jpg';
import ranaImg   from '@assets/trainer-rana-azzam_1785428982698.JPG';
import yaqoutImg from '@assets/ياقوت__1785619557679.jpeg';

const GOLD_INK = '#8A6200';

const config: CoursePageLayoutProps = {
  courseSlug: 'voiceover',
  showAdvancedCohorts: true,
  title: 'دورة التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE)',
  categoryBadge: 'التعليق الصوتي — أونلاين',
  description: 'البرنامج التطبيقي لتعليق الصوت عبر بث مباشر تفاعلي: من تجهيز الاستوديو المنزلي إلى إنتاج ديمو صوتي احترافي جاهز لسوق العمل.',
  heroImage: heroCover,
  heroImagePosition: 'top center',
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
      badgeSeats: '10 مقاعد محدودة',
      badgeMeetings: '6 محاضرات',
      badgeHours: '12 ساعة تدريبية',
      brochure: { href: '/brochures/voiceover-live.pdf', label: 'تحميل البروشور', style: 'teal' },
      waPhone: '962771052222',
      waMessage: 'السلام عليكم، أرغب في التسجيل في دورة التعليق والأداء الصوتي (مباشر تفاعلي Online LIVE)',
      accentStyle: 'teal',
    },
  ],

  heroTrainers: [
    { img: omarImg, name: 'عمر الدرابكة' },
    { img: ranaImg, name: 'رنا العزام' },
  ],

  shareTitle: 'دورة التعليق والأداء الصوتي (Online LIVE) — كاسيت أكاديمي',
  shareDescription: 'البرنامج التطبيقي لتعليق الصوت عبر بث مباشر تفاعلي مع عمر الدرابكة ورنا العزام',

  programDescription: 'برنامج متكامل يُعلّمك تجهيز الاستوديو المنزلي الاحترافي وبناء أساسك الصوتي، مع التدريب المكثّف على ألوان التعليق المختلفة — حتى تصل إلى إنتاج Voice Demo CV جاهز لسوق العمل، كل ذلك عبر جلسات بث مباشر تفاعلي.',

  advisors: [
    { name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي (Online LIVE)', img: yaqoutImg, href: 'https://wa.me/962771052222' },
  ],

  goals: [
    { icon: <AudioLines size={22} strokeWidth={1.8} color={GOLD_INK} />,        title: 'الاستوديو المنزلي',          text: 'تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة: اختيار الميكروفون، العزل الصوتي، وبرامج التسجيل.' },
    { icon: <Volume2 size={22} strokeWidth={1.8} color={GOLD_INK} />,           title: 'أساسيات الصوت والتنفس',     text: 'تأسيس مهاري شامل: مناطق الرنين، التنفس الحجابي وإدارة النَفَس أثناء التسجيل.' },
    { icon: <SlidersHorizontal size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'النطق ومخارج الحروف',       text: 'تشريح عملي على النطق السليم لكل حرف عربي — مخارج الحروف الـ28 والتخلص من النطق الرخو.' },
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,               title: 'اللغة العربية للمعلّق',     text: 'قواعد تطبيقية: الهمزات والمدود، فن الوقف والابتداء، ومنهجية التحرير اللغوي قبل التسجيل.' },
    { icon: <Sparkles size={22} strokeWidth={1.8} color={GOLD_INK} />,          title: 'التلوين الانفعالي',          text: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع: شجرة المشاعر وترميز النص عاطفياً.' },
    { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />,         title: 'التطبيق والانطلاق في السوق', text: 'إنتاج Voice Demo CV وبناء الهوية الصوتية الشخصية وخطة الـ100 يوم الأولى.' },
  ],

  outcomes: [
    { icon: <AudioWaveform size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'ملف صوتي احترافي (Voice Demo CV)', text: 'ملف صوتي متكامل مُهندَس بأحدث المؤثّرات، يستعرض خامات صوتك في مختلف ألوان التعليق.' },
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,           title: 'هوية صوتية متميزة',              text: 'تحديد بصمتك الصوتية الشخصية وأسلوبك في الأداء الاحترافي وبناء ثقتك أمام الميكروفون.' },
    { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,         title: 'شهادة معتمدة رسمياً',            text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
  ],

  graduationProject: {
    intro: 'بعد إتمام المحاضرات، تنتقل إلى مرحلة الإنتاج: <strong style="color:#18202F">تُسجّل Voice Demo CV كاملاً من استوديوك المنزلي الذي أعددته خلال الدورة، مع مراجعة وتغذية راجعة مباشرة من المدرب.</strong>',
    sessions: [
      { num: '1', title: 'مرحلة التحضير والتسجيل', body: 'تُطبّق كل ما تعلّمته من أداء صوتي وتقنيات تسجيل وتسجّل نصوصك في بيئتك المنزلية المُجهّزة.' },
      { num: '2', title: 'مرحلة المراجعة والتسليم', body: 'يُراجع المدرب تسجيلك ويُقدّم تغذية راجعة مفصّلة، وتحصل على Voice Demo CV جاهز لسوق العمل.' },
    ],
    finalOutput: 'Voice Demo CV يمثّل هويتك الصوتية الاحترافية + فرصة الانضمام لقاعدة بيانات كاسيت للمواهب الصوتية + شهادة معتمدة من وجيز وكاسيت.',
  },

  curriculumModes: [
    {
      key: 'live',
      label: 'مباشر تفاعلي (Online LIVE)',
      icon: 'wifi',
      accentStyle: 'teal',
      lectures: [
        { title: 'الاستوديو المنزلي والمعدات',    desc: 'تجهيز بيئة تسجيل احترافية في المنزل دون ميزانية ضخمة، واختيار الميكروفون المناسب وبرامج التسجيل.' },
        { title: 'أساسيات الصوت والتنفس',         desc: 'تأسيس مهاري شامل: مناطق الرنين الصوتي ومعادن الصوت، التنفس الحجابي وإدارة النَفَس، وتطوير الحضور الصوتي.' },
        { title: 'النطق ومخارج الحروف',           desc: 'تشريح عملي وتدريب مكثّف على النطق السليم لكل حرف عربي، والتخلص من "الفم الكسول" والنطق الرخو.' },
        { title: 'اللغة العربية والتحرير اللغوي', desc: 'قواعد لغوية تطبيقية: الهمزات والتنوين والمدود، فن الوقف والابتداء، ومنهجية التحرير اللغوي قبل التسجيل.' },
        { title: 'التلوين الانفعالي والمشاعر',    desc: 'أداء صادق يستحضر العاطفة دون تمثيل مصطنع: شجرة المشاعر، ترميز المشاعر داخل النص، والتحكم بكثافة العاطفة.' },
        { title: 'تطبيقات التعليق الصوتي',        desc: 'ورشة تطبيقية: الإعلانات التجارية، الرد الآلي (IVR)، الكتب الصوتية، الوثائقيات والأخبار.' },
      ],
      note: 'التطبيق العملي يبدأ مبكرًا ويستمر طوال البرنامج — بعد تأسيس مهارات الصوت والاستوديو، يبدأ التدريب الفعلي على نصوص وألوان مختلفة من التعليق الصوتي.',
      gradNote: '+ مشروع التخرّج: ثلاث جلسات إنتاج مباشرة مع مهندس الصوت — داخل الاستوديو كما في النسخة الحضورية.',
    },
  ],

  trainers: [
    {
      img: omarImg, name: 'عمر الدرابكة', title: 'معلّق صوتي محترف ومدرب أداء وإلقاء',
      bio: 'معلّق صوتي محترف سجّل بصوته مئات الأفلام الوثائقية والإعلانات لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا.',
      badges: [
        { label: 'خبرة +12 سنة',              type: 'achieve' },
        { label: 'مئات التسجيلات الاحترافية', type: 'achieve' },
        { label: 'دبلوم إعلام — فلوريدا',     type: 'cert'    },
      ],
    },
    {
      img: ranaImg, name: 'رنا العزام', title: 'مدرّبة التعليق الصوتي واللغة العربية',
      bio: 'الإعلامية رنا العزام معدة ومقدمة برامج فضائية وإذاعية، ومحررة ومدققة لغوية في مجمع اللغة العربية الأردني. حاصلة على بكالوريوس اللغة العربية من جامعة اليرموك. تقدّم التدريب على اللغة العربية للمعلّق والتحرير اللغوي الاحترافي.',
      badges: [
        { label: 'مجمع اللغة العربية',           type: 'qual'    },
        { label: 'قنوات فضائية وإذاعات',         type: 'qual'    },
        { label: 'بكالوريوس لغة عربية — اليرموك', type: 'qual'    },
      ],
    },
  ],
};

export default function CourseVoiceoverLivePage() {
  usePageMeta({
    title: 'دورة التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE)',
    description: 'البرنامج التطبيقي لتعليق الصوت عبر بث مباشر تفاعلي مع عمر الدرابكة ورنا العزام. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  return <CoursePageLayout {...config} />;
}
