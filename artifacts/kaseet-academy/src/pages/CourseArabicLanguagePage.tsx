// /courses/arabic-language — تمكين اللغة العربية وفنون التحرير اللغوي
import CoursePageLayout from '../components/CoursePageLayout';
import { arabicCourse } from '../data/courses/arabic';

export default function CourseArabicLanguagePage() {
  return <CoursePageLayout course={arabicCourse} />;
}
