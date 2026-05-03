// src/components/Navbar.tsx
import React from 'react';
// 🌟 1. 引入 NavLink 而不是 Link！NavLink 自带路由高亮检测功能
import { NavLink, Link } from 'react-router-dom';
import { FaFire, FaHeart, FaInfoCircle, FaStar } from 'react-icons/fa';
// 🌟 2. 引入全局状态，获取收藏数量
import { useFavoriteStore } from '../store/favoriteStore';

const Navbar: React.FC = () => {
  // 从 Zustand 中获取当前收藏数组的长度
  const favoritesCount = useFavoriteStore((state) => state.favorites.length);

  // 定义一个通用的高亮样式函数，传给 NavLink - 可爱风格
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `relative flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      isActive
        ? 'text-pink-600 bg-pink-100 shadow-cute'
        : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
    }`;
  };

  return (
    // 🌟 3. 可爱风格毛玻璃导航栏
    <header className="sticky top-0 z-50 w-full glass-cute shadow-cute transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* 左侧 Logo - 可爱风格 */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-pink-400 via-rose-400 to-purple-400 flex items-center justify-center text-white shadow-cute group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                 <FaStar className="text-xs sm:text-sm" />
              </div>
              <span className="text-lg sm:text-2xl font-cute text-gradient-cute group-hover:opacity-80 transition-opacity">
                AnimeTrack
              </span>
            </Link>
          </div>

          {/* 右侧导航菜单 - 可爱风格 */}
          <nav className="flex items-center space-x-1 sm:space-x-2">

            <NavLink to="/" className={navLinkClass} end>
              <FaFire className="text-base sm:text-lg" />
              <span className="hidden sm:block font-cute">发现</span>
            </NavLink>

            {/* 🌟 4. 带有徽章的收藏夹按钮 - 可爱风格 */}
            <NavLink to="/favorites" className={navLinkClass}>
              <div className="relative flex items-center justify-center">
                <FaHeart className="text-base sm:text-lg" />
                {/* 如果收藏数大于 0，就显示右上角的小徽章 */}
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-linear-to-r from-pink-400 to-rose-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-cute ring-2 ring-white animate-bounce">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block ml-1 font-cute">收藏</span>
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              <FaInfoCircle className="text-base sm:text-lg" />
              <span className="hidden sm:block font-cute">关于</span>
            </NavLink>

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;