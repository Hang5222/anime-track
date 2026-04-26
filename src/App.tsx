import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
        <BrowserRouter>
          
          <Navbar />

          <main className="mx-auto max-w-7xl px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/anime/:id" element={<DetailPage />} />    {/* :id 占位符 */}
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