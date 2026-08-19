import cohortsData from './cohorts.json';

export type CatalogCohort = {
  id: number;
  course: string;
  mode: 'onsite' | 'live';
  status: 'open' | 'running';
  trainer: string;
  start: string;
  end: string;
  start_ar: string;
  end_ar: string;
  days: string;
  time_24: string | null;
  time_ar: string | null;
  hours: number;
  sessions: number;
  platform: string;
  enrolled: number | null;
  capacity: number;
  remaining: number | null;
  fill: number | null;
  level?: 'advanced';
};

/**
 * Latest cohort roster imported from "دفعات ماستركلاس التعليق".
 * The duplicate 5–31 August onsite row was intentionally reduced to its
 * confirmed eight-seat version.
 */
export const voiceoverCohorts: CatalogCohort[] = [
  {
    id: 135, course: 'voiceover', mode: 'onsite', status: 'running', trainer: 'يسار عبده',
    start: '2026-08-05', end: '2026-08-31', start_ar: '5 أغسطس', end_ar: '31 أغسطس',
    days: 'الاثنين والأربعاء', time_24: '12:00-14:00', time_ar: '12:00 ظهراً – 2:00 بعد الظهر',
    hours: 16, sessions: 8, platform: 'استوديو كاسيت', enrolled: 8, capacity: 8, remaining: 0, fill: 100,
  },
  {
    id: 136, course: 'voiceover', mode: 'live', status: 'running', trainer: 'رنا العزام',
    start: '2026-08-07', end: '2026-09-11', start_ar: '7 أغسطس', end_ar: '11 سبتمبر',
    days: 'الجمعة', time_24: '17:00-19:00', time_ar: '5:00 عصراً – 7:00 مساءً',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 11, capacity: 12, remaining: 1, fill: 92,
  },
  {
    id: 138, course: 'voiceover', mode: 'live', status: 'running', trainer: 'عمر الدرابكة',
    start: '2026-08-17', end: '2026-09-02', start_ar: '17 أغسطس', end_ar: '2 سبتمبر',
    days: 'الاثنين والأربعاء', time_24: '18:00-20:00', time_ar: '6:00 مساءً – 8:00 مساءً',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 13, capacity: 13, remaining: 0, fill: 100,
  },
  {
    id: 401, course: 'voiceover', mode: 'live', status: 'running', trainer: 'عمر الدرابكة',
    start: '2026-08-18', end: '2026-09-03', start_ar: '18 أغسطس', end_ar: '3 سبتمبر',
    days: 'الثلاثاء والخميس', time_24: '17:00-19:00', time_ar: '5:00 عصراً – 7:00 مساءً',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 13, capacity: 13, remaining: 0, fill: 100,
  },
  {
    id: 143, course: 'voiceover', mode: 'live', status: 'open', trainer: 'عمر الدرابكة',
    start: '2026-08-29', end: '2026-10-03', start_ar: '29 أغسطس', end_ar: '3 أكتوبر',
    days: 'السبت', time_24: '12:00-14:00', time_ar: '12:00 ظهراً – 2:00 بعد الظهر',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 1, capacity: 12, remaining: 11, fill: 8,
  },
  {
    id: 402, course: 'voiceover', mode: 'live', status: 'open', trainer: 'عمر الدرابكة',
    start: '2026-08-31', end: '2026-09-16', start_ar: '31 أغسطس', end_ar: '16 سبتمبر',
    days: 'الاثنين والأربعاء', time_24: '18:00-20:00', time_ar: '6:00 مساءً – 8:00 مساءً',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 0, capacity: 13, remaining: 13, fill: 0,
  },
  {
    id: 403, course: 'voiceover', mode: 'live', status: 'open', trainer: 'عمر الدرابكة',
    start: '2026-09-01', end: '2026-10-06', start_ar: '1 سبتمبر', end_ar: '6 أكتوبر',
    days: 'الثلاثاء', time_24: '18:00-20:00', time_ar: '6:00 مساءً – 8:00 مساءً',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 0, capacity: 7, remaining: 7, fill: 0, level: 'advanced',
  },
  {
    id: 404, course: 'voiceover', mode: 'live', status: 'open', trainer: 'رنا العزام',
    start: '2026-09-19', end: '2026-10-24', start_ar: '19 سبتمبر', end_ar: '24 أكتوبر',
    days: 'السبت', time_24: '18:00-20:00', time_ar: '6:00 مساءً – 8:00 مساءً',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 0, capacity: 13, remaining: 13, fill: 0,
  },
  {
    id: 405, course: 'voiceover', mode: 'live', status: 'open', trainer: 'يسار عبده',
    start: '2026-09-15', end: '2026-10-12', start_ar: '15 سبتمبر', end_ar: '12 أكتوبر',
    days: 'السبت', time_24: '12:00-14:00', time_ar: '12:00 ظهراً – 2:00 بعد الظهر',
    hours: 12, sessions: 6, platform: 'Google Meet', enrolled: 5, capacity: 13, remaining: 8, fill: 38,
  },
  {
    id: 137, course: 'voiceover', mode: 'onsite', status: 'running', trainer: 'رنا العزام',
    start: '2026-08-10', end: '2026-09-02', start_ar: '10 أغسطس', end_ar: '2 سبتمبر',
    days: 'الاثنين والأربعاء', time_24: '12:00-14:00', time_ar: '12:00 ظهراً – 2:00 بعد الظهر',
    hours: 16, sessions: 8, platform: 'استوديو كاسيت', enrolled: 10, capacity: 10, remaining: 0, fill: 100,
  },
  {
    id: 406, course: 'voiceover', mode: 'onsite', status: 'open', trainer: 'رنا العزام',
    start: '2026-08-27', end: '2026-09-13', start_ar: '27 أغسطس', end_ar: '13 سبتمبر',
    days: 'الأحد والثلاثاء والخميس', time_24: '12:00-14:00', time_ar: '12:00 ظهراً – 2:00 بعد الظهر',
    hours: 16, sessions: 8, platform: 'استوديو كاسيت', enrolled: 2, capacity: 10, remaining: 8, fill: 20,
  },
  {
    id: 407, course: 'voiceover', mode: 'onsite', status: 'open', trainer: 'رنا العزام',
    start: '2026-08-30', end: '2026-09-23', start_ar: '30 أغسطس', end_ar: '23 سبتمبر',
    days: 'الاثنين والأربعاء', time_24: '16:00-18:00', time_ar: '4:00 عصراً – 6:00 مساءً',
    hours: 16, sessions: 8, platform: 'استوديو كاسيت', enrolled: 4, capacity: 10, remaining: 6, fill: 40, level: 'advanced',
  },
  {
    id: 408, course: 'voiceover', mode: 'onsite', status: 'open', trainer: 'عمر الدرابكة',
    start: '2026-08-31', end: '2026-09-17', start_ar: '31 أغسطس', end_ar: '17 سبتمبر',
    days: 'الأحد والثلاثاء والخميس', time_24: '18:00-20:00', time_ar: '6:00 مساءً – 8:00 مساءً',
    hours: 16, sessions: 8, platform: 'استوديو كاسيت', enrolled: 3, capacity: 10, remaining: 7, fill: 30,
  },
];

const remainingCohorts = (cohortsData.cohorts as CatalogCohort[])
  .filter((cohort) => cohort.course !== 'voiceover');

export const currentCohorts: CatalogCohort[] = [...remainingCohorts, ...voiceoverCohorts];