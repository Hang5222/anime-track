import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navbar from './components/Navbar';

// 路由懒加载
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen text-gray-800">
        <BrowserRouter>

          <Navbar />

          <main className="mx-auto max-w-7xl px-4 py-8">
            <Suspense fallback={<div className="flex justify-center items-center h-64 text-pink-500 animate-pulse font-cute text-2xl">正在加载页面... ⭐</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/anime/:id" element={<DetailPage />} />    {/* :id 占位符 */}
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </Suspense>
          </main>

        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

export default App;