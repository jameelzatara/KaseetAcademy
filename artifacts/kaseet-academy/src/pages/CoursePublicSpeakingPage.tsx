/**
 * CoursePublicSpeakingPage — فن الخطابة والإلقاء الجماهيري المؤثر
 * غلاف رفيع — كل المنطق في CoursePageLayout
 */

import { Mic, Zap, SlidersHorizontal, Star, Briefcase, Award } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import CoursePageLayout, { type CoursePageLayoutProps } from '../components/CoursePageLayout';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCoursePricing } from '../hooks/useCoursePricing';

import heroCover  from '@assets/cover-public-speaking-tedx_1785865159100.jpeg';
import sohaibImg  from '@assets/instructor-sohaib_1785692401461.jpeg';
import ayaImg     from '@assets/اية_القماز_1785619557679.jpeg';
import yaqoutImg  from '@assets/ياقوت__1785619557679.jpeg';

const GOLD_INK = '#8A6200';

const config: CoursePageLayoutProps = {
  courseSlug: 'public-speaking',
  title: 'فن الخطابة والإلقاء الجماهيري المؤثر',
  categoryBadge: 'الخطابة والإلقاء',
  description: 'ثماني جلسات تكسر رهبة المنصة والكاميرا وتبني حضوراً وكاريزما خطابية حقيقية — بإشراف د. صهيب الخوالدة.',
  heroImage: heroCover,
  heroImagePosition: 'center',
  showBackLink: false,
  installmentStyle: 'muted',

  modes: [
    {
      key: 'onsite',
      label: 'حضوري',
      icon: 'map-pin',
      platform: 'استوديو كاسيت — عمّان',
      price: '180',
      currency: 'JOD',
      cohortFilter: 'onsite',
      badgeSeats: '≤25 متدرّباً',
      badgeMeetings: '8 جلسات',
      badgeHours: '16 ساعة تدريبية',
      brochure: { href: '/brochures/public-speaking.pdf', label: 'تحميل البروشور', style: 'gold' },
      waPhone: '962790234483',
      waMessage: 'السلام عليكم، أرغب في الاستفسار عن دورة فن الخطابة والإلقاء الجماهيري المؤثر (حضوري)',
      accentStyle: 'gold',
    },
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
      waPhone: '962771052222',
      waMessage: 'السلام عليكم، أرغب في الاستفسار عن دورة فن الخطابة والإلقاء الجماهيري المؤثر (مباشر تفاعلي Online LIVE)',
      accentStyle: 'teal',
    },
  ],
  defaultModeKey: 'onsite',

  heroTrainers: [
    { img: sohaibImg, name: 'د. صهيب الخوالدة' },
  ],

  shareTitle: 'فن الخطابة والإلقاء الجماهيري المؤثر — كاسيت أكاديمي',
  shareDescription: 'ثماني جلسات تكسر رهبة المنصة وتبني كاريزما خطابية حقيقية مع د. صهيب الخوالدة',

  programDescription: 'برنامج متكامل يأخذك من رهبة المنصة إلى امتلاكها بثقة: تقنيات الارتجال السريع، هندسة الخطاب المؤثر، الثبات الانفعالي، ونبرة الصوت القيادية — كل ذلك بتدريب تطبيقي مكثّف تحت إشراف د. صهيب الخوالدة.',

  advisors: [
    { name: 'آية القماز',      role: 'مستشارة التسجيل · حضوري',        img: ayaImg,    href: 'https://wa.me/962790234483' },
    { name: 'ياقوت الخشاشنة', role: 'مستشارة التسجيل · مباشر تفاعلي', img: yaqoutImg, href: 'https://wa.me/962771052222' },
  ],

  goals: [
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,      title: 'كسر الرهبة وامتلاك أي منصة',    text: 'الصعود إلى أي منصة أو كاميرا — أونلاين وفي الواقع — دون تردد أو ارتباك، وكسر رهبة الكاميرا والجمهور نهائياً.' },
    { icon: <Zap size={22} strokeWidth={1.8} color={GOLD_INK} />,      title: 'الارتجال بثقة ودون تردد',        text: 'إتقان الارتجال السريع وترتيب الأفكار عند التعرض لسؤال مفاجئ — حتى تصبح المفاجأة أداةً لا مصدر قلق.' },
    { icon: <SlidersHorizontal size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'صياغة خطاب متكامل ومؤثر', text: 'بناء الخطاب من الافتتاحية الخاطفة إلى الخاتمة المؤثرة، بهيكل ذكي يعكس حضوراً قيادياً مؤثراً أمام أي جمهور.' },
    { icon: <Star size={22} strokeWidth={1.8} color={GOLD_INK} />,     title: 'لغة الجسد والصوت القيادي',       text: 'ضبط نبرة صوتك ولغة جسدك وتعبيرات الوجه والتواصل البصري لتعكس حضوراً قيادياً مؤثراً وفصحى خالية من الحشو.' },
    { icon: <Briefcase size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'إدارة الأسئلة الصعبة والأزمات', text: 'التعامل بذكاء ودبلوماسية مع الأسئلة الصعبة والمحرجة، والثبات الانفعالي فوق المنصة في أشد اللحظات ضغطاً.' },
    { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />,    title: 'توثيق التطور بتقرير وشهادة',      text: 'توثيق تطورك بتقرير تقييم فردي مباشر من المدرب وشهادة معتمدة من وجيز وكاسيت تُثبّت مكانتك الخطابية.' },
  ],

  outcomes: [
    { icon: <Mic size={22} strokeWidth={1.8} color={GOLD_INK} />,   title: 'خطاب TEDx متكامل',             text: 'تصميم وتقديم خطاب TEDx أمام لجنة تقييم متخصصة وتسجيل رسمي يُضاف للمحفظة الشخصية.' },
    { icon: <Star size={22} strokeWidth={1.8} color={GOLD_INK} />,  title: 'تقرير هوية خطابية فردي',       text: 'تقرير تفصيلي يحدد هويتك الخطابية الشخصية ونقاط القوة والتطوير مع خريطة طريق للاستمرار.' },
    { icon: <Award size={22} strokeWidth={1.8} color={GOLD_INK} />, title: 'شهادة معتمدة رسمياً',           text: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز، أكبر منصة صوتية في الشرق الأوسط.' },
  ],

  graduationProject: {
    intro: 'في الجلسة الثامنة يُلقي كل متدرّب خطابه المتكامل أمام المدرب ليحصل على <strong style="color:#18202F">تقييم تفصيلي مباشر وتقرير تحسين مهني فردي يُوثّق تطوره.</strong>',
    sessions: [
      { num: '1', title: 'تصميم الخطاب وبناء المحتوى', body: 'اختيار الموضوع، هيكلة الأفكار، وصياغة مفتتح قوي ورسالة واضحة تتدفق بسلاسة.' },
      { num: '2', title: 'التقديم والتقييم الشامل',    body: 'إلقاء الخطاب أمام المدرب وتلقّي تقرير تقييم مفصّل بنقاط القوة وخريطة التطوير.' },
    ],
    finalOutput: 'خطاب TEDx مسجَّل + تقرير هوية خطابية فردي + شهادة معتمدة من وجيز وكاسيت.',
  },

  curriculumModes: [
    {
      key: 'shared',
      label: 'جلسات المنهج',
      icon: 'map-pin',
      accentStyle: 'gold',
      lectures: [
        { title: 'كسر الرهبة وبناء الثقة الجماهيرية',          desc: 'نفكّك سيكولوجية الخوف من التحدث أمام الجمهور ونتدرّب على السيطرة الكاملة على التوتر في الثواني الأولى من صعود المنصة.' },
        { title: 'مخارج الحروف والبيان العربي',                  desc: 'روتين مكثّف على إلقاء روائع الشعر والنثر لتفكيك عقد اللسان وضبط مخارج الحروف ونطق الكلمات بدقة خطابية.' },
        { title: 'هندسة الوقفات والتلحين الخطابي',              desc: 'أسرار الوقف البليغ — الصمت المؤثر الذي يشوّق المستمع — وفهم إيقاع الخطابة ومتى ترفع نبرتك ومتى تخفضها.' },
        { title: 'ورشة الارتجال السريع المفاجئ',                 desc: 'تطبيقات حية مباشرة: يطرح المدرب موضوعاً عشوائياً ويتحدث المتدرب فيه فوراً محافظاً على ترابط الأفكار وثبات النبرة.' },
        { title: 'بناء هيكل الخطاب الذكي والافتتاحيات الخاطفة', desc: 'نصيغ الخطاب المؤثر خطوة بخطوة: مقدمة تخطف الانتباه في سبع ثوانٍ، متن واضح، وخاتمة قوية تترك أثراً ممتداً.' },
        { title: 'خطابة الإقناع والتأثير القيادي المهني',         desc: 'مهارات إلقاء لبيئات العمل: بناء نبرة قيادية واستراتيجيات العروض التقديمية التي تُقنع الإدارات والمستثمرين.' },
        { title: 'إدارة الأزمات والردود الذكية',                  desc: 'توجيه أدائي للثبات الانفعالي فوق المنصة، وتدريب على الإجابة بذكاء ودبلوماسية على الأسئلة الصعبة والمفاجئة.' },
        { title: 'مشروع التخرّج والتقييم الخطابي الشامل',         desc: 'يلقي كل متدرب خطابه المتكامل أمام المدرب ليحصل على تقييم تفصيلي مباشر وتقرير تحسين مهني فردي يُوثّق تطوره.' },
      ],
      note: 'المنهج موحّد للنسختين الحضورية والأونلاين — الفارق الوحيد في بيئة التقديم، وتطبيقات الارتجال متاحة في الحالتين.',
    },
  ],

  trainers: [
    {
      img: sohaibImg, name: 'د. صهيب الخوالدة', title: 'خبير تخطيط استراتيجي وتواصل قيادي',
      bio: 'مدير الأبحاث والسياسات في مؤسسة قطر بخبرة تتجاوز 16 عاماً في تطوير الأعمال والقيادة الاستراتيجية. حاصل على الدكتوراه في إدارة الأعمال من جامعة أستون (المملكة المتحدة) وعمل مستشاراً لجهات حكومية وخاصة في المنطقة العربية والخليج.',
      badges: [
        { label: 'دكتوراه — جامعة أستون', type: 'cert'    },
        { label: 'خبرة +16 سنة',          type: 'achieve' },
        { label: 'مؤسسة قطر',             type: 'qual'    },
      ],
    },
  ],
};

export default function CoursePublicSpeakingPage() {
  usePageMeta({
    title: 'فن الخطابة والإلقاء الجماهيري المؤثر',
    description: 'دورة 16 ساعة مع د. صهيب الخوالدة. كسر رهبة المنصة وبناء كاريزما خطابية. شهادة معتمدة من وجيز — كاسيت أكاديمي.',
  });
  const { pricing, notFound } = useCoursePricing('public-speaking');
  const [, navigate] = useLocation();
  useEffect(() => { if (notFound) navigate('/'); }, [notFound, navigate]);
  if (notFound) return null;

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
