// /courses/presenter — الدورة المكثّفة: المذيع المحترف ومهارات الإعلام الرقمي
import CoursePageLayout from '../components/CoursePageLayout';
import { presenterCourse } from '../data/courses/presenter';

export default function CoursePresenterPage() {
  return <CoursePageLayout course={presenterCourse} />;
}
