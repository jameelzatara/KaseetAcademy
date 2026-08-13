import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { CurrencyProvider } from '@/context/CurrencyContext';
// AuthProvider removed — student auth deleted (⑤)
import ScrollToTop from '@/components/ScrollToTop';
import Analytics   from '@/components/Analytics';
import Navbar from '@/components/Navbar';
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
import VoiceTestPage             from '@/pages/VoiceTestPage';
import PrivacyPolicyPage         from '@/pages/PrivacyPolicyPage';
import TermsPage                 from '@/pages/TermsPage';
import RefundPolicyPage          from '@/pages/RefundPolicyPage';
import ApplyVoiceTalentPage      from '@/pages/ApplyVoiceTalentPage';
import ApplyTrainerPage          from '@/pages/ApplyTrainerPage';
import CheckoutPage              from '@/pages/CheckoutPage';
import CheckoutSuccessPage       from '@/pages/CheckoutSuccessPage';
import AdminOrdersPage           from '@/pages/AdminOrdersPage';
import EventsPage                from '@/pages/EventsPage';
import TrainersPage              from '@/pages/TrainersPage';
import TrainerDetailPage         from '@/pages/TrainerDetailPage';
import BlogIndexPage             from '@/pages/BlogIndexPage';
import BlogPostPage              from '@/pages/BlogPostPage';
import NotFoundPage              from '@/pages/not-found';

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />

        {/* Course detail pages */}
        <Route path="/courses/voiceover"        component={CourseVoiceoverPage} />
        <Route path="/courses/voiceover-basics" component={CourseBasicsPage} />
        <Route path="/courses/voiceover-live"   component={CourseVoiceoverLivePage} />
        <Route path="/courses/presenter"        component={CoursePresenterPage} />
        <Route path="/courses/arabic-language"  component={CourseArabicLanguagePage} />
        <Route path="/courses/public-speaking"  component={CoursePublicSpeakingPage} />

        {/* Masterclass pages — new canonical routes */}
        <Route path="/masterclass-elam"    component={MasarElamiPage} />
        <Route path="/masterclass-voice"   component={MasarSotiPage} />
        <Route path="/masterclass-khataba" component={MasarKhatabaPage} />

        {/* Client-side 301 redirects from old paths */}
        <Route path="/masar-elami"    component={() => <Redirect to="/masterclass-elam" />} />
        <Route path="/masar-soti"     component={() => <Redirect to="/masterclass-voice" />} />
        <Route path="/masar-khataba"  component={() => <Redirect to="/masterclass-khataba" />} />

        {/* Checkout & admin */}
        <Route path="/checkout/success"         component={CheckoutSuccessPage} />
        <Route path="/checkout"                 component={CheckoutPage} />
        <Route path="/admin"                    component={() => <Redirect to="/admin/orders" />} />
        <Route path="/admin/orders"             component={AdminOrdersPage} />

        {/* Community & Resources */}
        <Route path="/events"                   component={EventsPage} />
        <Route path="/trainers/:slug"           component={TrainerDetailPage} />
        <Route path="/trainers"                 component={TrainersPage} />
        <Route path="/blog/:slug"               component={BlogPostPage} />
        <Route path="/blog"                     component={BlogIndexPage} />

        {/* Utility */}
        <Route path="/voice-test"               component={VoiceTestPage} />
        <Route path="/privacy-policy"           component={PrivacyPolicyPage} />
        <Route path="/terms"                    component={TermsPage} />
        <Route path="/refund-policy"            component={RefundPolicyPage} />
        {/* /cookies removed — Cookie Policy page deleted */}
        <Route path="/apply/voice-talent"       component={ApplyVoiceTalentPage} />
        <Route path="/apply/trainer"            component={ApplyTrainerPage} />

        {/* 301-equivalent client redirect from old /kaseet-academy/ prefix */}
        <Route path="/kaseet-academy" component={() => <Redirect to="/" />} />
        <Route path="/kaseet-academy/:rest*" component={() => <Redirect to="/" />} />

        {/* 404 */}
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <CurrencyProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Analytics />
        <Navbar />
        <Router />
      </WouterRouter>
    </CurrencyProvider>
  );
}

export default App;
