// src/components/Navbar.tsx
import React from 'react';
// 🌟 1. 引入 NavLink 而不是 Link！NavLink 自带路由高亮检测功能
import { NavLink, Link } from 'react-router-dom'; 
import { FaFire, FaHeart, FaInfoCircle } from 'react-icons/fa';
// 🌟 2. 引入全局状态，获取收藏数量
import { useFavoriteStore } from '../store/favoriteStore';

const Navbar: React.FC = () => {
  // 从 Zustand 中获取当前收藏数组的长度
  const favoritesCount = useFavoriteStore((state) => state.favorites.length);

  // 定义一个通用的高亮样式函数，传给 NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      isActive 
        ? 'bg-purple-100 text-purple-700 shadow-sm' // 当前页面的样式
        : 'text-gray-500 hover:bg-gray-100 hover:text-purple-600' // 非当前页面的样式
    }`;
  };

  return (
    // 🌟 3. 毛玻璃吸顶特效：sticky top-0 z-50 bg-white/80 backdrop-blur-md
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 左侧 Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500 hover:opacity-80 transition-opacity">
              AnimeTrack
            </Link>
          </div>

          {/* 右侧导航菜单 */}
          <nav className="flex space-x-2 sm:space-x-4">
            
            <NavLink to="/" className={navLinkClass} end>
              <FaFire className="text-lg" />
              <span className="hidden sm:block">发现</span>
            </NavLink>

            {/* 🌟 4. 带有徽章(Badge)的收藏夹按钮 */}
            <NavLink to="/favorites" className={navLinkClass}>
              <div className="relative">
                <FaHeart className="text-lg" />
                {/* 如果收藏数大于 0，就显示右上角的小红点 */}
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-bounce-short">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block ml-1">收藏</span>
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              <FaInfoCircle className="text-lg" />
              <span className="hidden sm:block">关于</span>
            </NavLink>

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;