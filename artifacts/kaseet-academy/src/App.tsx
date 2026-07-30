import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from '@/pages/Home';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
