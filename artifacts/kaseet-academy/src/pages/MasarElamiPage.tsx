/**
 * المسار الإعلامي (ماستركلاس) — wrapper رفيع
 * كلّ المحتوى في src/data/masterclasses.ts
 */
import MasterclassLayout from '../layouts/MasterclassLayout';
import { getElamData }   from '../data/masterclasses';

import heroBgSrc      from '@assets/cover_المسار_الاعلامي_1785777356196.png';
import trainerRamiSrc from '@assets/رامي_ابو_جبارة_1785777158127.png';
import trainerRanaSrc from '@assets/trainer-rana-azzam_1785692178863.JPG';
import advisorYaqoutSrc  from '@assets/ياقوت__1785784311527.jpeg';
import advisorImgSrc     from '@assets/ياقوت_الخشاشنة_المستشارة_1785852509109.jpeg';
import advisorAyaImgSrc  from '@assets/0_اية_القماز_1786476075148.jpeg';

const data = getElamData({
  heroBgSrc,
  trainerRamiSrc,
  trainerRanaSrc,
  advisorYaqoutSrc,
  advisorImgSrc,
  advisorAyaImgSrc,
});

export default function MasarElamiPage() {
  return <MasterclassLayout data={data} />;
}
