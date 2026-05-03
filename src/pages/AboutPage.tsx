import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 顶部返回区域，和 FavoritesPage 保持统一布局 */}
      <div className="flex items-center mb-8 gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 bg-white hover:text-purple-600 hover:bg-purple-50 p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-sm border border-gray-100 group" 
          title="返回"
        >
          <FaArrowLeft className="text-sm sm:text-base group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800">ℹ️关于项目</h1> 
      </div>

      {/* 关于内容 */}
      <div className="text-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h2 className="font-black text-3xl md:text-4xl text-center text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500 mb-8">Anime Track</h2>
        <p className="text-center mb-6 text-gray-600 leading-relaxed max-w-2xl mx-auto">
          这是一个基于 <strong className="text-gray-800">React + TypeScript</strong> 开发的动漫跟踪网站，用于搜索、记录和管理用户关注的动漫。
        </p>
        <p className="text-center mb-6 text-gray-600 leading-relaxed max-w-2xl mx-auto">
          该网站使用了最新的前端技术栈，包括 React Router 路由管理、React Query 状态缓存、Zustand 全局状态管理以及 Tailwind CSS 原子化样式。
        </p>
        <p className="text-center mt-12 text-gray-500 text-sm">
          数据来源 API: <a href="https://api.jikan.moe/v4" className="text-purple-600 hover:underline font-medium ml-1" target="_blank" rel="noreferrer">https://api.jikan.moe/v4</a>
        </p>
      </div>
    </div>
  );
};
export default AboutPage;
