/**
 * Seeds the cohorts table (schedule metadata) from the previously-hardcoded
 * roster in the frontend's src/data/currentCohorts.ts. It is idempotent:
 * every missing legacy cohort is backfilled without overwriting records
 * brought in later by lib/db/scripts/import-cohorts.ts.
 */
import { pool } from "@workspace/db";
import { logger } from "./logger.js";

const LEGACY_COHORTS = [
  { id: 135, courseSlug: "voiceover", level: "beginner", mode: "onsite", trainerName: "يسار عبده", startDate: "2026-08-05", endDate: "2026-08-31", daysAr: "الاثنين والأربعاء", time24: "12:00-14:00", timeAr: "12:00 ظهراً – 2:00 بعد الظهر", platform: "استوديو كاسيت", capacity: 8, enrolled: 8 },
  { id: 136, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "رنا العزام", startDate: "2026-08-07", endDate: "2026-09-11", daysAr: "الجمعة", time24: "17:00-19:00", timeAr: "5:00 عصراً – 7:00 مساءً", platform: "Google Meet", capacity: 12, enrolled: 11 },
  { id: 138, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "عمر الدرابكة", startDate: "2026-08-17", endDate: "2026-09-02", daysAr: "الاثنين والأربعاء", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "Google Meet", capacity: 13, enrolled: 13 },
  { id: 401, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "عمر الدرابكة", startDate: "2026-08-18", endDate: "2026-09-03", daysAr: "الثلاثاء والخميس", time24: "17:00-19:00", timeAr: "5:00 عصراً – 7:00 مساءً", platform: "Google Meet", capacity: 13, enrolled: 13 },
  { id: 143, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "عمر الدرابكة", startDate: "2026-08-29", endDate: "2026-10-03", daysAr: "السبت", time24: "12:00-14:00", timeAr: "12:00 ظهراً – 2:00 بعد الظهر", platform: "Google Meet", capacity: 12, enrolled: 1 },
  { id: 402, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "عمر الدرابكة", startDate: "2026-08-31", endDate: "2026-09-16", daysAr: "الاثنين والأربعاء", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "Google Meet", capacity: 13, enrolled: 0 },
  { id: 403, courseSlug: "voiceover", level: "advanced", mode: "live", trainerName: "عمر الدرابكة", startDate: "2026-09-01", endDate: "2026-10-06", daysAr: "الثلاثاء", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "Google Meet", capacity: 7, enrolled: 0 },
  { id: 404, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "رنا العزام", startDate: "2026-09-19", endDate: "2026-10-24", daysAr: "السبت", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "Google Meet", capacity: 13, enrolled: 0 },
  { id: 405, courseSlug: "voiceover", level: "beginner", mode: "live", trainerName: "يسار عبده", startDate: "2026-09-15", endDate: "2026-10-12", daysAr: "السبت", time24: "12:00-14:00", timeAr: "12:00 ظهراً – 2:00 بعد الظهر", platform: "Google Meet", capacity: 13, enrolled: 5 },
  { id: 137, courseSlug: "voiceover", level: "beginner", mode: "onsite", trainerName: "رنا العزام", startDate: "2026-08-10", endDate: "2026-09-02", daysAr: "الاثنين والأربعاء", time24: "12:00-14:00", timeAr: "12:00 ظهراً – 2:00 بعد الظهر", platform: "استوديو كاسيت", capacity: 10, enrolled: 10 },
  { id: 406, courseSlug: "voiceover", level: "beginner", mode: "onsite", trainerName: "رنا العزام", startDate: "2026-08-27", endDate: "2026-09-13", daysAr: "الأحد والثلاثاء والخميس", time24: "12:00-14:00", timeAr: "12:00 ظهراً – 2:00 بعد الظهر", platform: "استوديو كاسيت", capacity: 10, enrolled: 2 },
  { id: 407, courseSlug: "voiceover", level: "advanced", mode: "onsite", trainerName: "رنا العزام", startDate: "2026-08-30", endDate: "2026-09-23", daysAr: "الاثنين والأربعاء", time24: "16:00-18:00", timeAr: "4:00 عصراً – 6:00 مساءً", platform: "استوديو كاسيت", capacity: 10, enrolled: 4 },
  { id: 408, courseSlug: "voiceover", level: "beginner", mode: "onsite", trainerName: "عمر الدرابكة", startDate: "2026-08-31", endDate: "2026-09-17", daysAr: "الأحد والثلاثاء والخميس", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "استوديو كاسيت", capacity: 10, enrolled: 3 },
  { id: 201, courseSlug: "public-speaking", level: "beginner", mode: "onsite", trainerName: "د. صهيب الخوالدة", startDate: "2026-09-06", endDate: "2026-09-22", daysAr: "الأحد والثلاثاء والخميس", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "استوديو كاسيت", capacity: 15, enrolled: 6 },
  { id: 202, courseSlug: "presenter", level: "beginner", mode: "onsite", trainerName: "رنا العزام", startDate: "2026-09-08", endDate: "2026-09-24", daysAr: "الأحد والثلاثاء والخميس", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "استوديو كاسيت", capacity: 10, enrolled: 3 },
  { id: 203, courseSlug: "arabic-language", level: "beginner", mode: "live", trainerName: "رنا العزام", startDate: "2026-08-31", endDate: "2026-09-16", daysAr: "الاثنين والأربعاء", time24: "18:00-20:00", timeAr: "6:00 مساءً – 8:00 مساءً", platform: "Google Meet", capacity: 10, enrolled: 4 },
];

export async function seedCohortsIfEmpty(): Promise<void> {
  try {
    for (const c of LEGACY_COHORTS) {
      await pool.query(
        `INSERT INTO cohorts (
           id, course_slug, level, mode, trainer_name,
           start_date, end_date, days_ar, time_24, time_ar, platform
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.courseSlug, c.level, c.mode, c.trainerName, c.startDate, c.endDate, c.daysAr, c.time24, c.timeAr, c.platform],
      );
      await pool.query(
        `INSERT INTO cohort_seats (cohort_id, capacity, enrolled, is_open)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (cohort_id) DO NOTHING`,
        [c.id, c.capacity, c.enrolled],
      );
    }
    logger.info("legacy cohorts backfilled");
  } catch (err) {
    logger.warn({ err }, "seedCohortsIfEmpty failed (non-fatal)");
  }
}
