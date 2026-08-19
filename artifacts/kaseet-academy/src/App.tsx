import { lazy, Suspense, type ReactNode } from 'react';
import { ClerkProvider } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { arSA } from '@clerk/localizations';
import { Route, Switch, Router as WouterRouter, Redirect, useLocation } from 'wouter';
import { CurrencyProvider } from '@/context/CurrencyContext';
// AuthProvider removed — student auth deleted (⑤)
import ScrollToTop from '@/components/ScrollToTop';
import Analytics   from '@/components/Analytics';
import Navbar from '@/components/Navbar';
import AuthScreen from '@/components/AuthScreen';
// Home stays eager — it's the first paint for most visitors.
import Home from '@/pages/Home';

// Everything else is route-split: each page ships as its own chunk instead
// of bloating the initial bundle every visitor downloads on the homepage.
const CourseVoiceoverPage      = lazy(() => import('@/pages/CourseVoiceoverPage'));
const CourseBasicsPage         = lazy(() => import('@/pages/CourseBasicsPage'));
const CourseVoiceoverLivePage  = lazy(() => import('@/pages/CourseVoiceoverLivePage'));
const CoursePresenterPage      = lazy(() => import('@/pages/CoursePresenterPage'));
const CourseArabicLanguagePage = lazy(() => import('@/pages/CourseArabicLanguagePage'));
const CoursePublicSpeakingPage = lazy(() => import('@/pages/CoursePublicSpeakingPage'));
const MasarElamiPage           = lazy(() => import('@/pages/MasarElamiPage'));
const MasarSotiPage            = lazy(() => import('@/pages/MasarSotiPage'));
const MasarKhatabaPage         = lazy(() => import('@/pages/MasarKhatabaPage'));
const VoiceTestPage            = lazy(() => import('@/pages/VoiceTestPage'));
const PrivacyPolicyPage        = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsPage                = lazy(() => import('@/pages/TermsPage'));
const RefundPolicyPage         = lazy(() => import('@/pages/RefundPolicyPage'));
const ApplyVoiceTalentPage     = lazy(() => import('@/pages/ApplyVoiceTalentPage'));
const ApplyTrainerPage         = lazy(() => import('@/pages/ApplyTrainerPage'));
const CheckoutPage             = lazy(() => import('@/pages/CheckoutPage'));
const CheckoutSuccessPage      = lazy(() => import('@/pages/CheckoutSuccessPage'));
const AdminDashboard           = lazy(() => import('@/pages/admin/AdminDashboard'));
const EventsPage               = lazy(() => import('@/pages/EventsPage'));
const TrainersPage             = lazy(() => import('@/pages/TrainersPage'));
const TrainerDetailPage        = lazy(() => import('@/pages/TrainerDetailPage'));
const BlogIndexPage            = lazy(() => import('@/pages/BlogIndexPage'));
const BlogPostPage             = lazy(() => import('@/pages/BlogPostPage'));
const NotFoundPage             = lazy(() => import('@/pages/not-found'));
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
// Development instances talk to Clerk directly. Published builds route Clerk
// through the API artifact so the public site uses one verified origin.
const clerkProxyUrl = import.meta.env.PROD
  ? new URL('/api/__clerk', window.location.origin).toString()
  : undefined;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

function ClerkShell({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      localization={arSA}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}

function AuthRoute({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  return (
    <>
      <Home />
      <AuthScreen mode={mode} basePath={basePath} />
    </>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
      <Switch>
        {/* Clerk needs these exact optional wildcard routes for OAuth callbacks. */}
        <Route path="/sign-in/*?" component={() => <AuthRoute mode="sign-in" />} />
        <Route path="/sign-up/*?" component={() => <AuthRoute mode="sign-up" />} />
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
        <Route path="/admin/orders"             component={() => <Redirect to="/admin" />} />
        <Route path="/admin"                    component={AdminDashboard} />

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
      </Suspense>
    </>
  );
}

/** Hide the public site navbar on the full-screen admin dashboard. */
function ChromeAwareNavbar() {
  const [location] = useLocation();
  if (location.startsWith('/admin')) return null;
  return <Navbar />;
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkShell>
        <CurrencyProvider>
        <Analytics />
        <ChromeAwareNavbar />
        <Router />
        </CurrencyProvider>
      </ClerkShell>
    </WouterRouter>
  );
}

export default App;
