/**
 * ماستركلاس التعليق والأداء الصوتي — wrapper رفيع
 * كلّ المحتوى في src/data/masterclasses.ts
 */
import MasterclassLayout from '../layouts/MasterclassLayout';
import { getVoiceData }  from '../data/masterclasses';

import heroCardSrc    from '@assets/voiceover-track1_1785854995070.jpeg';
import trainerYasarSrc from '@assets/المدربة_يسار_عبده_1785855126478.jpeg';
import trainerOmarSrc  from '@assets/trainer-omar_1785692015818.jpg';
import advisorImgSrc   from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAyaImgSrc from '@assets/0_اية_القماز_1786476075148.jpeg';

const data = getVoiceData({
  heroCardSrc,
  trainerYasarSrc,
  trainerOmarSrc,
  advisorImgSrc,
  advisorAyaImgSrc,
});

export default function MasarSotiPage() {
  return <MasterclassLayout data={data} />;
}
