// /courses/public-speaking — فن الخطابة والإلقاء الجماهيري المؤثّر
import CoursePageLayout from '../components/CoursePageLayout';
import { publicSpeakingCourse } from '../data/courses/publicSpeaking';

export default function CoursePublicSpeakingPage() {
  return <CoursePageLayout course={publicSpeakingCourse} />;
}
