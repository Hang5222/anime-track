// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 引入页面和组件
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import Navbar from './components/Navbar'; // 🌟 引入新导航栏

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 整个应用的背景色设为极浅的灰色，凸显白色的卡片 */}
      <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
        <BrowserRouter>
          
          {/* 🌟 放置全局导航栏 */}
          <Navbar />

          {/* 主体内容区域：给顶部留出 padding，防止被吸顶导航栏挡住 */}
          <main className="mx-auto max-w-7xl px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/anime/:id" element={<DetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};

export default App;