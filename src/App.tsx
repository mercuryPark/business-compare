import { TopNav } from './components/TopNav';
import { Home } from './components/Home';
import { CompareView } from './components/CompareView';
import { LearnPage } from './components/learn/LearnPage';
import { useHashRoute } from './components/learn/useHashRoute';

export default function App() {
  const route = useHashRoute();

  return (
    <main className="min-h-screen text-ink">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <TopNav active={route.view} />
        {route.view === 'home' && <Home />}
        {route.view === 'compare' && <CompareView />}
        {route.view === 'learn' && <LearnPage route={route} />}
      </div>
    </main>
  );
}
