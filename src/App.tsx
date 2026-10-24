import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router';

const Home = lazy(() => import('@/pages/Home'));
const Watch = lazy(() => import('@/pages/Watch'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="animate-pulse text-sm text-ink-faint">Loading…</p>
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:channelId" element={<Watch />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
