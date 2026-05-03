import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoriteStore } from '../store/favoriteStore';
import { FaHeart, FaArrowLeft } from 'react-icons/fa'; 
import BackToTop from '../components/BackToTop';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavoriteStore();
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center mb-8 gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 bg-white hover:text-purple-600 hover:bg-purple-50 p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-sm border border-gray-100 group" 
          title="返回"
        >
          <FaArrowLeft className="text-sm sm:text-base group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800">💖我的追番列表</h1> 
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl">
          <p className="text-xl mb-4">你的追番列表空空如也~</p>
          <button onClick={() => navigate('/')} className="text-purple-600 font-bold hover:underline">
            去首页逛逛吧
          </button>
        </div>
      ) : (
        /* 遍历 favorites 数组，渲染收藏卡片 */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* 使用 favorites.map 进行遍历 */}
          {favorites.map((anime) => (
            <div key={anime.mal_id} className="relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
              
              {/* 海报区域 */}
              <div 
                className="relative aspect-3/4 overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => navigate(`/anime/${anime.mal_id}`)}
              >
                <img src={anime.image_url} alt={anime.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                
                {/* 移除收藏的按钮 */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(anime.mal_id);
                  }}
                  className="absolute top-2 left-2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  title="取消收藏"
                >
                  <FaHeart className="text-lg" />
                </button>

                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                  ⭐ {anime.score}
                </div>
              </div>

              {/* 文字区域 */}
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-sm truncate" title={anime.title}>
                  {anime.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 回到顶部组件 */}
      <BackToTop />
    </div>
  );
}

export default FavoritesPage;
