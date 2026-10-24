import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router';

const Home = lazy(() => import('@/pages/Home'));
const Watch = lazy(() => import('@/pages/Watch'));

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:channelId" element={<Watch />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
