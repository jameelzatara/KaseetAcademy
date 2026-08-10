// ── Shared instructor data for all course pages ────────────────────────────────
// Photos are imported once here; course data files reference instructors by key.
import type { Instructor } from '../components/InstructorsSection';
import { Users, Clock, Globe, Award, Tv, GraduationCap, Mic } from 'lucide-react';

// Photo assets
import yasarPhoto from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import ranaPhoto  from '@assets/trainer-rana-azzam_1785428982698.JPG';
import omarPhoto  from '@assets/trainer-omar_1785428945248.jpg';
import sohaibPhoto from '@assets/instructor-sohaib_1785692401461.jpeg';

// Advisor photos (used in help card)
export { default as ayaImg }    from '@assets/اية_القماز_1785619557679.jpeg';
export { default as yaqoutImg } from '@assets/ياقوت__1785619557679.jpeg';

export const YASAR: Instructor = {
  initials: 'ي.ع',
  photo: yasarPhoto,
  name: 'يسار عبده',
  role: 'مدرّبة إعلامية وخبيرة تعليق صوتي',
  badges: [
    { icon: Users,         label: '3,000+ طالب مدرَّب'       },
    { icon: Clock,         label: 'خبرة +20 سنة'             },
    { icon: Globe,         label: 'معتمدة لدى الأمم المتحدة' },
  ],
  bio: 'مدرّبة معتمدة لدى الأمم المتحدة والمؤسسات الوطنية، بخبرة تزيد على عشرين عامًا في الإعلام والتعليق الصوتي والتدريب المهني. تحمل درجة البكالوريوس في اللغة الإنجليزية وعلم الأصوات (Phonetics)، ودرجة الماجستير في حقوق الإنسان والتنمية البشرية. خبرتها تشمل الدبلجة، الأخبار، الأفلام الوثائقية، الكتب الصوتية، والتعليق الصوتي الإعلاني.',
};

export const RANA: Instructor = {
  initials: 'ر.ع',
  photo: ranaPhoto,
  name: 'رنا العزام',
  role: 'إعلامية ومدرّبة أداء ومختصّة بالتحرير اللغوي',
  badges: [
    { icon: Tv,            label: 'قنوات فضائية وإذاعات'          },
    { icon: Award,         label: 'جوائز إعلامية'                 },
    { icon: GraduationCap, label: 'بكالوريوس لغة عربية — اليرموك' },
  ],
  bio: 'الإعلامية رنا محمد العزام معدة ومقدمة برامج فضائية وإذاعية وبودكاست معتمدة. تنقلت بين كبرى المؤسسات الإعلامية مثل قناة رؤيا الفضائية وقناة صاد وإذاعة حياة FM. عملت لسنوات محررة ومدققة لغوية في مجمع اللغة العربية ومذيعة في إذاعة المجمع. قدّمت برامج تدريبية متخصصة لطلبة الإعلام في جامعة البتراء ولمؤسسات حكومية كبرى، وحازت جائزة أفضل إنتاج إعلاني حول المرأة العربية.',
};

export const OMAR: Instructor = {
  initials: 'ع.د',
  photo: omarPhoto,
  name: 'عمر الدرابكة',
  role: 'معلّق صوتي محترف ومدرّب أداء وإلقاء',
  badges: [
    { icon: Mic,           label: 'مئات الأعمال المسجّلة' },
    { icon: Clock,         label: 'خبرة +12 سنة'           },
    { icon: GraduationCap, label: 'دبلوم إعلام — فلوريدا' },
  ],
  bio: 'معلّق صوتي محترف ومدرّب أداء وإلقاء. سجّل بصوته مئات الأفلام الوثائقية والإعلانات التجارية لكبرى الشركات والمؤسسات الإعلامية في الخليج والشرق الأوسط. حاصل على دبلوم الإعلام من الأكاديمية العالمية للفنون والإبداع بفلوريدا. يمتلك خبرة واسعة في التدريب الصوتي والتمكين اللغوي تتجاوز 12 عامًا.',
};

export const SOHAIB: Instructor = {
  initials: 'ص.خ',
  photo: sohaibPhoto,
  name: 'د. صهيب الخوالدة',
  role: 'خبير تخطيط استراتيجي وتواصل قيادي',
  badges: [
    { icon: GraduationCap, label: 'دكتوراه — جامعة أستون، المملكة المتحدة' },
    { icon: Globe,         label: 'مدير الأبحاث — مؤسسة قطر'               },
    { icon: Clock,         label: 'خبرة +16 سنة'                           },
    { icon: Award,         label: 'MBA امتياز — الشرق الأوسط'              },
  ],
  bio: 'خبير تخطيط استراتيجي وتواصل قيادي، يشغل حالياً منصب مدير الأبحاث والسياسات في مؤسسة قطر، بخبرة مهنية تتجاوز 16 عاماً في تطوير الأعمال وإدارة المشاريع والقيادة الاستراتيجية. حاصل على دكتوراه في إدارة الأعمال من جامعة أستون (المملكة المتحدة)، وماجستير إدارة أعمال بامتياز من الجامعة الأردنية.',
};

export const RANA_LANG: Instructor = {
  ...RANA,
  role: 'إعلامية ومختصّة تحرير لغوي ومدقّقة لغة',
  badges: [
    { icon: Globe, label: 'مجمع اللغة العربية — محررة ومدققة' },
    { icon: Tv,    label: 'رؤيا | صاد | حياة FM'              },
    { icon: Clock, label: 'خبرة +10 سنوات'                    },
    { icon: Users, label: 'مئات المتدرّبين'                    },
  ],
};
