// ── Unified Course Data Types ─────────────────────────────────────────────────
import type { Instructor } from '../components/InstructorsSection';

export type { Instructor };

/** One delivery mode (onsite or live) */
export interface CourseMode {
  label: string;           // 'حضوري' | 'مباشر تفاعلي (Online LIVE)'
  hours: number;
  sessions: number;
  price: number;
  currency: 'JOD' | 'USD';
  old?: number;
  brochure?: string;       // PDF download path — hidden if absent
  waPhone: string;
  waMsg: string;
}

/** A single cohort/batch entry (maps both cohorts.json + legacy ScheduleEntry) */
export interface CohortBatch {
  id: string | number;
  mode: 'onsite' | 'online';
  status: 'open' | 'running' | 'closed';
  trainer?: string;
  start_ar?: string;
  end_ar?: string;
  days?: string;
  time_ar?: string;
  platform?: string;
  remaining?: number;
  capacity?: number;
  fill?: number;           // 0-100 percentage
  batchLabel?: string;     // '#101'
  badgeDate?: string;      // 'أغسطس 2026'
}

/** Single session in a syllabus track */
export interface SyllabusSession {
  title: string;
  content: string;
  unit?: string;           // e.g. 'الوحدة الأولى: الأساسيات والجمهور'
}

/** A single programme goal/objective */
export interface GoalItem {
  icon: string;            // lucide icon name string
  title: string;
  desc: string;
}

/** A single training outcome */
export interface OutcomeItem {
  icon: string;
  title: string;
  desc: string;
}

/** Root course data object — passed to <CoursePageLayout course={...} /> */
export interface CourseData {
  slug: string;
  title: string;
  stage?: string;          // 'المرحلة التأسيسية'
  tagline?: string;
  cover: string;           // resolved image URL (import result)
  tags: string[];
  language: string;
  seats: number;
  about?: string;
  modes: {
    onsite?: CourseMode;
    live?: CourseMode;
  };
  instructors: Instructor[];
  cohorts: CohortBatch[];
  syllabus: {
    onsite?: SyllabusSession[];
    live?: SyllabusSession[];
  };
  hasGradProject?: boolean;
  gradProjectNote?: string;  // custom grad project text for non-voiceover courses
  goals?: GoalItem[];
  outcomes?: OutcomeItem[];
  og: {
    title?: string;
    description: string;
    image?: string;
  };
}
