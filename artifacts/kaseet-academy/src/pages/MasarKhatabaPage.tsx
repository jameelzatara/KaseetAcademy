/**
 * ماستركلاس فن الخطابة والتواصل القيادي — wrapper رفيع
 * كلّ المحتوى في src/data/masterclasses.ts
 */
import MasterclassLayout  from '../layouts/MasterclassLayout';
import { getKhatabaData } from '../data/masterclasses';

import heroBgSrc      from '@assets/cover-public-speaking-tedx_1785865159100.jpeg';
import trainerSohaibSrc from '@assets/instructor-sohaib_1785863334821.jpeg';
import trainerOmarSrc   from '@assets/trainer-omar_1785692015818.jpg';
import advisorImgSrc    from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAyaImgSrc from '@assets/0_اية_القماز_1786476075148.jpeg';

import corpPhoto1 from '@assets/WhatsApp_Image_2026-08-04_at_7.40.10_PM_1785863327459.jpeg';
import corpPhoto2 from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(1)_1785863327459.jpeg';
import corpPhoto3 from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(2)_1785863327459.jpeg';
import corpPhoto5 from '@assets/WhatsApp_Image_2026-08-04_at_7.40.09_PM_(7)_1785865787231.jpeg';

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

const galleryItems = [
  { src: gal1,  alt: 'مشاركون في ورشة الخطابة' },
  { src: gal2,  alt: 'تدريب الخطابة — كاسيت' },
  { src: gal3,  alt: 'جلسة تطبيقية' },
  { src: gal4,  alt: 'تمارين الإلقاء' },
  { src: gal5,  alt: 'التواصل القيادي' },
  { src: gal6,  alt: 'ورشة عملية' },
  { src: gal7,  alt: 'التدريب الجماعي' },
  { src: gal8,  alt: 'مشروع الخطاب التطبيقي' },
  { src: gal9,  alt: 'التواصل المؤسسي' },
  { src: gal10, alt: 'حفل التخرج' },
];

const data = getKhatabaData({
  heroBgSrc,
  trainerSohaibSrc,
  trainerOmarSrc,
  advisorImgSrc,
  advisorAyaImgSrc,
  corpPhotos: [corpPhoto1, corpPhoto2, corpPhoto3, corpPhoto5],
  galleryItems,
});

export default function MasarKhatabaPage() {
  return <MasterclassLayout data={data} />;
}
