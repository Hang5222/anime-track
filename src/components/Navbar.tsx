// src/components/Navbar.tsx
import React from 'react';
// 🌟 1. 引入 NavLink 而不是 Link！NavLink 自带路由高亮检测功能
import { NavLink, Link } from 'react-router-dom'; 
import { FaFire, FaHeart, FaInfoCircle, FaPlay } from 'react-icons/fa';
// 🌟 2. 引入全局状态，获取收藏数量
import { useFavoriteStore } from '../store/favoriteStore';

const Navbar: React.FC = () => {
  // 从 Zustand 中获取当前收藏数组的长度
  const favoritesCount = useFavoriteStore((state) => state.favorites.length);

  // 定义一个通用的高亮样式函数，传给 NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
      isActive 
        ? 'text-purple-700 bg-purple-50/80' 
        : 'text-slate-500 hover:text-purple-600 hover:bg-slate-50' 
    }`;
  };

  return (
    // 🌟 3. 恢复全宽的吸顶毛玻璃特效，使得内部容器 (max-w-7xl) 与页面主体内容完美对齐
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 左侧 Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                 <FaPlay className="text-[10px] ml-0.5" />
              </div>
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 group-hover:opacity-80 transition-opacity">
                AnimeTrack
              </span>
            </Link>
          </div>

          {/* 右侧导航菜单，回归清爽扁平的风格 */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            
            <NavLink to="/" className={navLinkClass} end>
              <FaFire className="text-lg transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:block">发现</span>
            </NavLink>

            {/* 🌟 4. 带有徽章(Badge)的收藏夹按钮 */}
            <NavLink to="/favorites" className={navLinkClass}>
              <div className="relative flex items-center justify-center">
                <FaHeart className="text-lg transition-transform duration-300 group-hover:scale-110" />
                {/* 如果收藏数大于 0，就显示右上角的小红点 */}
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm ring-2 ring-white/80 animate-bounce-short">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block ml-1">收藏</span>
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              <FaInfoCircle className="text-lg transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:block">关于</span>
            </NavLink>

          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;