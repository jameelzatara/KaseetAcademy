// /courses/voiceover-live — أساسيات التعليق والأداء الصوتي (مباشر تفاعلي فقط)
// يستهلك نفس بيانات cohorts-voiceover.json مُصفَّاةً على mode:'online' — spec §9
import CoursePageLayout from '../components/CoursePageLayout';
import { voiceoverLiveCourse } from '../data/courses/voiceover';

export default function CourseVoiceoverLivePage() {
  return <CoursePageLayout course={voiceoverLiveCourse} />;
}
