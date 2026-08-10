// /courses/voiceover — أساسيات التعليق والأداء الصوتي (حضوري ومباشر تفاعلي)
import CoursePageLayout from '../components/CoursePageLayout';
import { voiceoverCourse } from '../data/courses/voiceover';

export default function CourseVoiceoverPage() {
  return <CoursePageLayout course={voiceoverCourse} />;
}
