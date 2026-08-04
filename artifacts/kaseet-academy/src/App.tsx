import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from '@/pages/Home';
import CourseVoiceoverPage      from '@/pages/CourseVoiceoverPage';
import CourseBasicsPage         from '@/pages/CourseBasicsPage';
import CourseVoiceoverLivePage  from '@/pages/CourseVoiceoverLivePage';
import CoursePresenterPage      from '@/pages/CoursePresenterPage';
import CourseArabicLanguagePage from '@/pages/CourseArabicLanguagePage';
import CoursePublicSpeakingPage from '@/pages/CoursePublicSpeakingPage';
import MasarElamiPage           from '@/pages/MasarElamiPage';
import MasarSotiPage            from '@/pages/MasarSotiPage';
import MasarKhatabaPage         from '@/pages/MasarKhatabaPage';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses/voiceover"        component={CourseVoiceoverPage} />
      <Route path="/courses/voiceover-basics" component={CourseBasicsPage} />
      <Route path="/courses/voiceover-live"   component={CourseVoiceoverLivePage} />
      <Route path="/courses/presenter"        component={CoursePresenterPage} />
      <Route path="/courses/arabic-language"  component={CourseArabicLanguagePage} />
      <Route path="/courses/public-speaking"  component={CoursePublicSpeakingPage} />
      <Route path="/masar-elami"              component={MasarElamiPage} />
      <Route path="/masar-soti"               component={MasarSotiPage} />
      <Route path="/masar-khataba"            component={MasarKhatabaPage} />
      <Route component={() => <div className="text-center p-20">صفحة غير موجودة 404</div>} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
