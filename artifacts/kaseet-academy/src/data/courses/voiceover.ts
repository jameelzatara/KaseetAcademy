// ── أساسيات التعليق والأداء الصوتي ───────────────────────────────────────────
// Used by: /courses/voiceover  AND  /courses/voiceover-basics
import type { CourseData, CohortBatch } from '../../types/courseTypes';
import { YASAR, RANA, OMAR } from '../instructors';
import heroCover    from '@assets/voiceover-group-photo_1785690181212.jpg';
import cohortsJson  from '../cohorts-voiceover.json';

const PHONE_IP     = '962790234483';
const PHONE_ONLINE = '962771052222';

const cohorts: CohortBatch[] = (cohortsJson.cohorts as Array<{
  id: number; mode: string; status: string; trainer: string;
  start_ar: string; end_ar: string; days: string; time_ar: string;
  platform: string; remaining: number; capacity: number; fill: number;
}>).map(c => ({
  id:        c.id,
  mode:      c.mode as 'onsite' | 'online',
  status:    c.status as 'open' | 'running' | 'closed',
  trainer:   c.trainer,
  start_ar:  c.start_ar,
  end_ar:    c.end_ar,
  days:      c.days,
  time_ar:   c.time_ar,
  platform:  c.platform,
  remaining: c.remaining,
  capacity:  c.capacity,
  fill:      c.fill,
}));

export const voiceoverCourse: CourseData = {
  slug:     'voiceover',
  title:    'أساسيات التعليق والأداء الصوتي',
  stage:    'المرحلة التأسيسية',
  tagline:  'رؤيتنا تنبع من أن لكل نبرة قصة فريدة تستحق سردها',
  cover:    heroCover,
  tags:     ['المستوى المبتدئ', 'المستوى المتوسط', 'المعلّقون الصوتيون', 'المذيعون والمقدّمون', 'صنّاع المحتوى'],
  language: 'عربي',
  seats:    10,

  modes: {
    onsite: {
      label:    'حضوري',
      hours:    16,
      sessions: 8,
      price:    218,
      currency: 'JOD',
      old:      260,
      waPhone:  PHONE_IP,
      waMsg:    'السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي — النمط الحضوري.',
    },
    live: {
      label:    'مباشر تفاعلي (Online LIVE)',
      hours:    12,
      sessions: 6,
      price:    150,
      currency: 'USD',
      old:      200,
      waPhone:  PHONE_ONLINE,
      waMsg:    'السلام عليكم، أرغب في التسجيل في دورة أساسيات التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE).',
    },
  },

  instructors: [YASAR, RANA, OMAR],
  cohorts,

  about: 'يسعى هذا البرنامج إلى إعداد وتأهيل المتدربين لاحتراف مجال التعليق الصوتي وتجهيزهم بالمهارات اللازمة للاندماج في سوق العمل. ترتكز أهدافنا على تطوير مخارج الحروف والنطق السليم، والتمكّن من التحكم في الطبقات الصوتية وضبط الإيقاع، بالإضافة إلى كسر رهبة الميكروفون تماماً لتعزيز الثقة بالنفس وتنمية مهارات الإلقاء والتواصل المهني.',

  goals: [
    { icon: 'AudioLines',        title: 'جميع ألوان التعليق الصوتي',   desc: 'إتقان جميع ألوان التعليق الصوتي: الإعلانات، والرد الآلي، والكتب الصوتية، والوثائقيات، والأخبار، والدوبلاج.' },
    { icon: 'Volume2',           title: 'مخارج الحروف والنطق',          desc: 'تحسين مخارج الحروف وضبط الأداء اللغوي والتخلّص من عيوب النطق.' },
    { icon: 'SlidersHorizontal', title: 'الطبقات الصوتية والإيقاع',    desc: 'التحكم بالطبقات الصوتية والإيقاع والنَفَس واكتساب مرونة صوتية كاملة.' },
    { icon: 'Mic',               title: 'كسر رهبة الميكروفون',         desc: 'التأقلم الكامل مع البيئة الصوتية الاحترافية والعمل بثقة تامة.' },
    { icon: 'Sparkles',          title: 'الثقة والحضور الصوتي',        desc: 'بناء شخصية صوتية قوية تعكس الاحترافية أمام العملاء وشركات الإنتاج.' },
    { icon: 'Briefcase',         title: 'التواصل المهني',               desc: 'فهم سوق العمل الصوتي والتفاعل مع التوجيهات الإخراجية بكفاءة.' },
  ],

  outcomes: [
    { icon: 'Mic',         title: 'تسجيلات استوديو عالية الجودة',  desc: 'عيّنات صوتية احترافية مسجّلة بأحدث اللاقطات داخل استوديوهات كاسيت الفعلية.' },
    { icon: 'AudioLines',  title: 'ديمو صوتي احترافي (Voice Demo CV)', desc: 'ملفّ صوتي متكامل مُهندَس، يستعرض خامات صوتك في مختلف ألوان التعليق.' },
    { icon: 'Award',       title: 'شهادة معتمدة',                   desc: 'شهادة إتمام البرنامج، معتمدة من تطبيق وجيز.' },
  ],

  hasGradProject: true,

  syllabus: {
    onsite: [
      { title: 'الصوت وأساسيات الأداء',        content: 'فهم الصوت، وخصائصه، وكيفية استخدامه في الأداء الصوتي.' },
      { title: 'التنفّس والتحكم بالصوت',         content: 'تدريب عملي على التنفّس، ودعم الصوت، والتحكم في النبرة والإيقاع.' },
      { title: 'أعضاء النطق ومخارج الحروف',      content: 'التعرّف إلى أعضاء النطق، وضبط المخارج والوضوح أثناء الأداء.' },
      { title: 'الاستماع والنقد السمعي',          content: 'تطوير القدرة على الاستماع، وتحليل الأداء، واكتشاف نقاط القوة ومجالات التطوير.' },
      { title: 'اللغة العربية للمعلّق الصوتي',   content: 'النطق السليم، والتشكيل، وسلامة القراءة، والتعامل مع النصوص الصوتية.' },
      { title: 'التعبير والأداء الصوتي',          content: 'التحكم في المشاعر، والنبرة، والإيقاع، والوقفات بما يخدم المعنى.' },
      { title: 'ألوان التعليق الصوتي',            content: 'التدريب العملي على الإعلان، والوثائقي، والسرد، والأنماط المختلفة.' },
      { title: 'التطبيق المهني والانطلاق',        content: 'تطبيق متكامل على نصوص حقيقية، وتوجيهات عملية لبناء الملفّ الصوتي.' },
    ],
    live: [
      { title: 'الاستوديو المنزلي والمعدات',    content: 'بيئة التسجيل المنزلية، واختيار المعدات، وضبط إعدادات التسجيل.' },
      { title: 'أساسيات الصوت والتنفّس',         content: 'فهم الصوت، والتحكم في التنفّس، ودعم الأداء الصوتي.' },
      { title: 'النطق ومخارج الحروف',            content: 'تطوير وضوح النطق، وضبط المخارج، وتحسين سلامة الأداء.' },
      { title: 'اللغة العربية للمعلّق الصوتي',   content: 'سلامة القراءة، والتشكيل، والتعامل مع النصّ، ومهارات الأداء اللغوي.' },
      { title: 'التعبير والأداء الصوتي',          content: 'التحكم في النبرة، والإيقاع، والوقفات، والانفعالات بما يخدم المعنى.' },
      { title: 'التطبيق الصوتي والاستعداد المهني', content: 'تطوير الأداء عبر نصوص متنوّعة، والتطبيق على ألوان التعليق المختلفة مع توجيه عملي.' },
    ],
  },

  og: {
    description: 'دورة أساسيات التعليق والأداء الصوتي — 16 ساعة حضوري أو 12 ساعة مباشر تفاعلي، بإشراف نخبة من المدرّبين، وشهادة معتمدة من تطبيق وجيز.',
  },
};

/** Voiceover-live variant: same course, filtered to online cohorts only */
export const voiceoverLiveCourse: CourseData = {
  ...voiceoverCourse,
  slug:  'voiceover-live',
  title: 'أساسيات التعليق والأداء الصوتي — مباشر تفاعلي (Online LIVE)',
  modes: { live: voiceoverCourse.modes.live },
  cohorts: cohorts.filter(c => c.mode === 'online'),
  og: {
    description: 'دورة أساسيات التعليق والأداء الصوتي — نمط مباشر تفاعلي 100% عبر الإنترنت، 12 ساعة، 6 لقاءات، مع شهادة معتمدة من تطبيق وجيز.',
  },
};
