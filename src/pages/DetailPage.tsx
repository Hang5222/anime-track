import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAnimeById } from '../api/jikan'

interface AnimeDetail {
  mal_id: number;
  title: string;
  title_japanese: string;
  images: { webp: { large_image_url: string } };
  synopsis: string; // 剧情简介
  score: number;
  year: number;
  status: string; // 连载状态
  genres: { name: string }[]; // 题材类型，是个数组
}

const DetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => getAnimeById(id as string),
  })
    
  // 边界状态处理
  if (isLoading) return <div className="p-20 text-center text-2xl text-purple-600 animate-pulse">正在跨次元解析数据... ⏳</div>;
  if (isError) return <div className="p-20 text-center text-red-500 text-xl">解析失败: {(error as Error).message}</div>;

  // API 返回的实际数据包裹在 data.data 里
  const anime: AnimeDetail = data?.data;

  // 如果没拿到数据，安全返回
  if (!anime) return null;

  return (
    <div className="container mx-auto p-4 max-w-5xl mt-6">
      
      {/* 返回按钮 */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-bold transition-colors"
      >
        <span className="mr-2">←</span> 返回列表
      </button>

      {/* 🌟 Tailwind 神级排版：左边海报，右边详情 (md:flex-row 实现了响应式并排) */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-50 flex flex-col md:flex-row">
        
        {/* 左侧：超大海报 */}
        <div className="md:w-1/3 bg-gray-100 shrink-0">
          <img 
            src={anime.images.webp.large_image_url} 
            alt={anime.title} 
            className="w-full h-full object-cover aspect-3/4"
          />
        </div>

        {/* 右侧：详细信息 */}
        <div className="p-8 md:w-2/3 flex flex-col">
          
          <div className="mb-4">
            <h1 className="text-3xl font-black text-gray-800 mb-2">{anime.title}</h1>
            <h2 className="text-lg text-gray-500 font-medium">{anime.title_japanese}</h2>
          </div>

          {/* 徽章横幅 (Tags) */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              ⭐ {anime.score || '暂无评分'}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              📅 {anime.year || '年份未知'}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              📺 {anime.status}
            </span>
          </div>

          {/* 题材类型 (遍历对象数组) */}
          <div className="flex gap-2 mb-6">
            {anime.genres.map(genre => (
              <span key={genre.name} className="border border-gray-300 text-gray-600 px-2 py-1 rounded-md text-xs">
                {genre.name}
              </span>
            ))}
          </div>

          {/* 剧情简介 (Synopsis) */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-purple-100 pb-2 inline-block">剧情简介</h3>
            {/* leading-relaxed 增加行高，让长文本阅读更舒适 */}
            <p className="text-gray-600 leading-relaxed text-justify">
              {anime.synopsis || '暂无剧情简介...'}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailPage;
