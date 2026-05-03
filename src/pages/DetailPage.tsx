import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFullAnimeInfo } from '../api/jikan';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { useFavoriteStore } from '../store/favoriteStore';

const DetailPage: React.FC = () => {
  const { id } = useParams(); // 操作 URL 参数的 HOOK
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();

  // 进入详情页时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['animeFullDetail', id],
    queryFn: () => getFullAnimeInfo(id as string),
    enabled: !!id,
  });

  // 全局拦截条件渲染，处理数据加载状态
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-2xl text-purple-600 animate-pulse font-bold">正在跨次元解析数据... ⏳</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">解析失败: {(error as Error).message}</div>;
  if (!data) return null;

  // 从聚合的数据里解构出这两块内容：动漫详情和角色列表
  const { anime, characters } = data;
  
  // 收藏状态
  const isFav = isFavorite(anime.mal_id);

  // 处理收藏点击
  const handleHeartClick = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 🌟 1. 顶部全屏横幅 (Hero Banner) 加高斯模糊背景 */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden bg-black">
        {/* 背景图：放大、变暗、模糊，烘托氛围 */}
        <img
          src={anime.images.webp.large_image_url}
          alt="bg"
          className="w-full h-full object-cover opacity-40 blur-md scale-110"
        />

        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white bg-black/50 hover:bg-black/80 p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all z-10 flex items-center gap-2 text-sm sm:text-base"
        >
          <FaArrowLeft /> 返回
        </button>

        {/* 覆盖在背景上的主要信息 */}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 bg-linear-to-t from-slate-50 to-transparent flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 md:gap-8">
          {/* 左侧海报 */}
          <img
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            className="w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 object-cover rounded-xl shadow-2xl border-2 sm:border-4 border-white sm:translate-y-8"
          />
          {/* 右侧标题区 */}
          <div className="pb-0 sm:pb-4 text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg mb-1 sm:mb-2">{anime.title}</h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 font-medium mb-2 sm:mb-4">{anime.title_japanese}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="bg-yellow-400 text-yellow-900 px-3 sm:px-4 py-1 rounded-full font-bold shadow-md text-xs sm:text-sm">⭐ {anime.score || 'N/A'}</span>
              <span className="hidden sm:inline-block bg-white/20 text-white backdrop-blur-md px-3 sm:px-4 py-1 rounded-full font-bold border border-white/30 text-xs sm:text-sm">📺 {anime.status}</span>
              <span className="hidden md:inline-block bg-white/20 text-white backdrop-blur-md px-3 sm:px-4 py-1 rounded-full font-bold border border-white/30 text-xs sm:text-sm">📅 {anime.year || '未知'}</span>

              {/* 收藏大按钮 */}
              <button
                onClick={handleHeartClick}
                className={`px-4 sm:px-6 py-1 rounded-full font-bold flex items-center gap-2 transition-all shadow-md text-xs sm:text-sm ${isFav ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-red-500 text-white hover:bg-red-600'}`}
              >
                <FaHeart /> {isFav ? '已收藏' : '加入收藏'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 2. 极简下半部分：流式阅读排版 */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        
        {/* 2.1 基础信息数据条 (Data Bar) - 移出侧边栏，改为横向排列 */}
        <div className="flex flex-wrap gap-x-12 gap-y-4 mb-10 pb-6 border-b border-gray-200">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">类型</span>
            <span className="text-lg font-medium text-gray-800">{anime.type || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">集数</span>
            <span className="text-lg font-medium text-gray-800">{anime.episodes || '?'}</span>
          </div>
        </div>

        {/* 2.2 剧情简介 - 占据完整宽度，提升阅读体验 */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">剧情简介</h2>
          {/* 使用 prose 类 (需安装 @tailwindcss/typography 插件，如果没有安装，就用手写排版) */}
          <div className="text-gray-600 leading-8 text-[15px] md:text-base text-justify font-serif">
            {anime.synopsis ? (
              // 如果文字包含换行符，简单的分隔处理让段落更清晰
              anime.synopsis.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))
            ) : (
              '暂无剧情简介。'
            )}
          </div>
        </div>

        {/* 2.3 角色列表阵列 - 紧凑型极简卡片 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">主要登场角色</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {characters && characters.length > 0 ? characters.map((char: any) => (
              <div key={char.character.mal_id} className="group relative overflow-hidden rounded-md bg-gray-100">
                {/* 图片放大，取消多余留白 */}
                <div className="aspect-[3/4] w-full">
                  <img 
                    src={char.character.images.webp.image_url} 
                    alt={char.character.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* 底部信息遮罩，直接盖在图片下方，节省空间并增加高级感 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                  <p className="font-bold text-white text-xs truncate" title={char.character.name}>{char.character.name}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5 truncate">{char.role}</p>
                </div>
              </div>
            )) : (
              '暂无角色信息'
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailPage;