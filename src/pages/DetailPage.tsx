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

  // 全局拦截条件渲染，处理数据加载状态 - 可爱风格
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-2xl text-pink-500 animate-pulse font-cute">正在加载动漫详情... ⭐</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-rose-500 text-xl font-cute">解析失败: {(error as Error).message} 💦</div>;
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
    <div className="min-h-screen pb-20">

      {/* 顶部全屏横幅 (Hero Banner) - 可爱风格 */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden bg-linear-to-br from-pink-200 via-rose-100 to-purple-100">
        {/* 背景图：放大、变暗、模糊，烘托氛围 */}
        <img
          src={anime.images.webp.large_image_url}
          alt="bg"
          className="w-full h-full object-cover opacity-30 blur-xl scale-110"
        />

        {/* 返回按钮 - 可爱风格 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-pink-500 bg-white/90 hover:bg-white p-3 rounded-full shadow-cute transition-all duration-300 z-10 flex items-center justify-center group"
          title="返回"
        >
          <FaArrowLeft className="text-sm sm:text-base group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* 覆盖在背景上的主要信息 */}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 bg-linear-to-t from-white via-white/80 to-transparent flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 md:gap-8">
          {/* 左侧海报 */}
          <img
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            className="w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 object-cover rounded-cute shadow-cute border-4 border-white sm:translate-y-8"
          />
          {/* 右侧标题区 */}
          <div className="pb-0 sm:pb-4 text-center sm:text-left w-full sm:w-auto overflow-hidden">
            <h1
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-cute text-gray-800 drop-shadow-sm mb-1 sm:mb-2 truncate sm:whitespace-normal sm:overflow-visible sm:wrap-break-word max-w-full"
              title={anime.title}
            >
              {anime.title}
            </h1>
            <p
              className="text-sm sm:text-lg md:text-xl text-pink-400 font-medium mb-2 sm:mb-4 truncate sm:whitespace-normal sm:overflow-visible sm:wrap-break-word max-w-full"
              title={anime.title_japanese}
            >
              {anime.title_japanese}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              <span className="bg-linear-to-r from-yellow-400 to-orange-400 text-white px-3 sm:px-4 py-1 rounded-full font-bold shadow-cute text-xs sm:text-sm">⭐ {anime.score || 'N/A'}</span>
              <span className="hidden sm:inline-block bg-white/80 text-pink-500 backdrop-blur-sm px-3 sm:px-4 py-1 rounded-full font-bold border-2 border-pink-200 text-xs sm:text-sm">📺 {anime.status}</span>
              <span className="hidden md:inline-block bg-white/80 text-pink-500 backdrop-blur-sm px-3 sm:px-4 py-1 rounded-full font-bold border-2 border-pink-200 text-xs sm:text-sm">📅 {anime.year || '未知'}</span>

              {/* 收藏大按钮 - 可爱风格 */}
              <button
                onClick={handleHeartClick}
                className={`px-4 sm:px-6 py-1.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-cute text-xs sm:text-sm ${isFav ? 'bg-rose-100 text-rose-500 border-2 border-rose-200' : 'bg-linear-to-r from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500'}`}
              >
                <FaHeart /> {isFav ? '已收藏 💕' : '加入收藏 🌸'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 下半部分 - 可爱风格 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">

        {/* 基础信息数据条 - 可爱风格 */}
        <div className="flex flex-wrap gap-x-8 sm:gap-x-12 gap-y-4 mb-8 sm:mb-10 pb-4 sm:pb-6 border-b-2 border-pink-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">类型</span>
            <span className="text-base sm:text-lg font-cute text-gray-800">{anime.type || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">集数</span>
            <span className="text-base sm:text-lg font-cute text-gray-800">{anime.episodes || '?'}</span>
          </div>
        </div>

        {/* 剧情简介 - 可爱风格 */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-cute text-gradient-cute mb-3 sm:mb-4">📖 剧情简介</h2>
          <div className="card-cute p-4 sm:p-6">
            <div className="text-gray-600 leading-7 sm:leading-8 text-sm sm:text-[15px] md:text-base text-justify">
              {anime.synopsis ? (
                // 如果文字包含换行符，简单的分隔处理让段落更清晰
                anime.synopsis.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 sm:mb-4">{paragraph}</p>
                ))
              ) : (
                '暂无剧情简介。'
              )}
            </div>
          </div>
        </div>

        {/* 角色列表阵列 - 可爱风格 */}
        <div>
          <h2 className="text-xl sm:text-2xl font-cute text-gradient-cute mb-4 sm:mb-6">🎭 主要登场角色</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {characters && characters.length > 0 ? characters.map((char: any) => (
              <div key={char.character.mal_id} className="group relative overflow-hidden rounded-cute bg-pink-50 shadow-cute">
                {/* 图片放大，取消多余留白 */}
                <div className="aspect-3/4 w-full">
                  <img
                    src={char.character.images.webp.image_url}
                    alt={char.character.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {/* 底部信息遮罩 */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-pink-500/90 to-transparent p-2 sm:p-3 pt-6 sm:pt-8">
                  <p className="font-bold text-white text-[10px] sm:text-xs truncate" title={char.character.name}>{char.character.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-pink-100 mt-0.5 truncate">{char.role}</p>
                </div>
              </div>
            )) : (
              <span className="text-pink-400 font-cute">暂无角色信息 💦</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailPage;