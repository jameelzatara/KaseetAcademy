// /courses/voiceover-basics — أساسيات التعليق والأداء الصوتي (مسار ثانٍ)
import CoursePageLayout from '../components/CoursePageLayout';
import { voiceoverCourse } from '../data/courses/voiceover';

export default function CourseBasicsPage() {
  return <CoursePageLayout course={voiceoverCourse} />;
}
