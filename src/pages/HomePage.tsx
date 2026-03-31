import React, { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTopAnime, searchAnime } from '../api/jikan';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery); 
  const [searchQuery, setSearchQuery] = useState(initialQuery); 

  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({}); // 清空 URL 搜索参数
    }
  }, [searchQuery, setSearchParams]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['animeList', searchQuery],
    queryFn: () => {
      // 如果查询参数为空，调热门接口；否则调搜索接口
      if (!searchQuery) return getTopAnime();
      return searchAnime(searchQuery);
    },
    // 优化：在请求新数据期间，保留显示旧数据，配合 isFetching 使用，避免列表闪烁变空！
    placeholderData: keepPreviousData
  });

  // 点击搜索或按回车时执行
  const executeSearch = () => {
    // 把输入框的值同步给查询变量，触发 React Query 重新请求
    setSearchQuery(inputValue.trim());
  };

  // 清空搜索，返回排行榜
  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 搜索框区域 (保持框架稳定，绝不消失) */}
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 text-black text-center">
          AnimeTrack 动漫指南
        </h1>
        
        <div className="relative w-full max-w-md flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="英文名搜索 (如: Naruto)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
              className="w-full px-5 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 outline-none text-gray-700 shadow-sm"
            />
            {inputValue && (
              // 删除按钮
              <button 
                onClick={clearSearch}
                className="absolute right-4 top-3 text-gray-400 hover:text-red-500 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          
          <button 
            onClick={executeSearch}
            // 搜索时变灰色
            disabled={isFetching}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl shadow-md transition-colors disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-white"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 动态标题 */}
      <div className="flex justify-between items-center mb-6 border-b-2 border-purple-100 pb-2">
        <h2 className="text-sm md:text-lg lg:text-2xl font-bold text-gray-800 border-l-4 border-purple-500 pl-3">
          {searchQuery ? `"${searchQuery}" 的搜索结果` : '🔥本季霸权排行榜'}
        </h2>
        {/* 用 isFetching 在右上角显示一个小小的转圈，而不是清空整个页面 */}
        {isFetching && <span className="text-sm md:text-lg lg:text-xl text-purple-500 animate-pulse">正在更新数据... 🔄</span>}
      </div>

      {/* 错误状态局部渲染 */}
      {isError && (
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl mb-6">
          获取数据失败: {(error as Error).message}
        </div>
      )}

      {/* 列表渲染 */}
      {!isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data?.data.map((animeItem) => (
            <AnimeCard key={animeItem.mal_id} anime={animeItem} />
          ))}
          
          {data?.data.length === 0 && !isLoading && (
            <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-xl">
              没找到相关动漫，换个名字试试吧~ 
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;