import { TopNav } from './components/TopNav';
import { Home } from './components/Home';
import { CompareView } from './components/CompareView';
import { ComparePending } from './components/ComparePending';
import { LearnPage } from './components/learn/LearnPage';
import { useHashRoute } from './components/learn/useHashRoute';
import { COMPARE_ENABLED } from './config';

export default function App() {
  const route = useHashRoute();

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <TopNav active={route.view} />
        {route.view === 'home' && <Home />}
        {route.view === 'compare' && (COMPARE_ENABLED ? <CompareView /> : <ComparePending />)}
        {route.view === 'learn' && <LearnPage route={route} />}
      </div>
    </main>
  );
}
