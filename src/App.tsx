import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

const Home = lazy(() => import('@/pages/Home'));
const Watch = lazy(() => import('@/pages/Watch'));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:channelId" element={<Watch />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
