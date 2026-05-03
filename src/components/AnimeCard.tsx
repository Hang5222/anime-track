import React, { memo } from 'react';
import type { Anime } from '../types/anime';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { useFavoriteStore } from '../store/favoriteStore';

// 定义这个组件的 Props 接口：它必须接收一个属性叫 anime，类型是 Anime
interface AnimeCardProps {
  anime: Anime;
}

// 使用 React.memo 包裹组件
const AnimeCard: React.FC<AnimeCardProps> = memo(({ anime }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const isFav = isFavorite(anime.mal_id);

    // 处理爱心点击事件
  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 重要！阻止事件冒泡，防止点爱心时触发卡片的跳转！

    if (isFav) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite({
        mal_id: anime.mal_id,
        title: anime.title,
        image_url: anime.images.webp.large_image_url,
        score: anime.score
      });
    }
  };

  const handleClick = () => {
    navigate(`/anime/${anime.mal_id}`);
  }
  return (
    <div className="group card-cute overflow-hidden cursor-pointer flex flex-col"
      onClick={handleClick}>

      {/* 海报区域 */}
      <div className="relative aspect-3/4 overflow-hidden bg-pink-50">
        <img
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* 评分小标签 - 可爱风格 */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-sm text-pink-500 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full shadow-cute flex items-center gap-1 border border-pink-100">
          <FaStar className="text-yellow-400" />
          <span>{anime.score || 'N/A'}</span>
        </div>

        {/* 爱心收藏按钮区域 - 可爱风格 */}
        <button
          onClick={handleHeartClick}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-cute hover:scale-110 transition-all duration-300"
        >
          {isFav ? <FaHeart className="text-rose-500 text-sm sm:text-lg" /> : <FaRegHeart className="text-rose-300 text-sm sm:text-lg" />}
        </button>
      </div>

      {/* 文字信息区域 - 可爱风格 */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-1 sm:mb-2 truncate leading-relaxed" title={anime.title}>
          {anime.title}
        </h3>

        <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500 font-medium gap-1">
          <span className="tag-cute hidden sm:inline">📅 {anime.year || '未知'}</span>
          <span className="tag-cute sm:hidden">{anime.year || '?'}</span>
          <span className="bg-pink-50 text-pink-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-pink-200 whitespace-nowrap">
            {anime.episodes ? `${anime.episodes}集` : '连载'}
          </span>
        </div>
      </div>

    </div>
  );
});

export default AnimeCard;