import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query'; // 引入 useInfiniteQuery (无限查询)
import { useInView } from 'react-intersection-observer'; // 引入视口雷达 Hook
import { getTopAnime, searchAnime } from '../api/jikan';
import AnimeCard from '../components/AnimeCard';
import { useSearchParams } from 'react-router-dom';

const HomePage: React.FC = () => {
  const[searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [inputValue, setInputValue] = useState(initialQuery); 
  const [searchQuery, setSearchQuery] = useState(initialQuery); 

  // 召唤视口雷达：
  // ref: 用来绑定到底部的“哨兵”元素上
  // inView: 布尔值，哨兵进入屏幕时为 true，离开时为 false
  const { ref, inView } = useInView({
    threshold: 0.5, // 哨兵露出一半时就触发
  });

  // 同步 URL 状态
  useEffect(() => {
    if (searchQuery) setSearchParams({ q: searchQuery });
    else setSearchParams({});
  },[searchQuery, setSearchParams]);


  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    fetchNextPage,    // 核心函数：调用它就去拉取下一页
    hasNextPage,      // 布尔值：是否还有下一页 (根据 getNextPageParam 计算)
    isFetchingNextPage// 布尔值：当前是否正在拉取下一页
  } = useInfiniteQuery({
    queryKey: ['animeList', searchQuery],
    // 注意：这里的 pageParam 是 React Query 自动传给我们的，初始值由 initialPageParam 决定
    queryFn: ({ pageParam = 1 }) => {
      // 如果没有搜索关键词，就请求热门动漫
      if (!searchQuery) return getTopAnime({ pageParam });
      return searchAnime(searchQuery, { pageParam });
    },
    // 初始化第一页
    initialPageParam: 1,
    // 核心逻辑：判断如何获取下一页的页码
    getNextPageParam: (lastPage, allPages) => {
      // Jikan API 的返回体中有 pagination.has_next_page 字段
      const hasNext = lastPage.pagination?.has_next_page;
      // 如果有下一页，返回当前的页数 + 1；如果没有，返回 undefined
      return hasNext ? allPages.length + 1 : undefined;
    },

    // 修复重回主页的429报错：
    // 数据在 5 分钟内保持新鲜，不会自动重新请求
    staleTime: 1000 * 60 * 5,
    // 缓存数据在 10 分钟内保留，即使组件卸载
    gcTime: 1000 * 60 * 10,
    // 窗口重新聚焦时不自动刷新
    refetchOnWindowFocus: false,
    // 网络重连时不自动刷新
    refetchOnReconnect: false,
    // 组件重新挂载时不自动刷新
    refetchOnMount: false,
  });

  // 雷达探测逻辑
  // 当 inView 为 true（滑到底了），并且允许有下一页，并且当前没在加载时，去拉取下一页
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },[inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const executeSearch = () => {
    setSearchQuery(inputValue.trim());
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 搜索框区域 (保持不变) */}
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 text-black text-center">
          AnimeTrack 动漫指南
        </h1>
        <div className="relative w-full max-w-md flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
              placeholder="英文名搜索 (如: Naruto)"
              className="w-full px-5 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 outline-none text-gray-700 shadow-sm"
            />
            {inputValue && <button onClick={clearSearch} className="absolute right-4 top-3 text-gray-400 hover:text-red-500 font-bold">✕</button>}
          </div>
          <button onClick={executeSearch} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl shadow-md transition-colors">搜索</button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 border-b-2 border-purple-100 pb-2">
        <h2 className="text-sm md:text-lg lg:text-2xl font-bold text-gray-800 border-l-4 border-purple-500 pl-3">
          {searchQuery ? `"${searchQuery}" 的搜索结果` : '🔥本季霸权排行榜'}
        </h2>
      </div>

      {isLoading && <div className="p-10 text-center text-xl text-purple-600 animate-pulse">正在跨次元解析数据... ⏳</div>}
      {isError && <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl mb-6">获取数据失败: {(error as Error).message}</div>}

      {/* 渲染无限列表 */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* 因为 data.pages 是一个二维数组，我们需要 map 两层 */}
            {data?.pages.map((page, pageIndex) => (
              // 第一层：遍历每一页
              <React.Fragment key={pageIndex}>
                {page.data.map((animeItem: any) => (
                  // 第二层：遍历每一页里的动漫数据
                  <AnimeCard key={animeItem.mal_id} anime={animeItem} />
                ))}
              </React.Fragment>
            ))}
          </div>

          {data?.pages[0].data.length === 0 && (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl">
              没找到相关动漫，换个名字试试吧~ 
            </div>
          )}

          {/* 安插底部的“哨兵”！ */}
          <div 
            ref={ref} // 把雷达绑在它身上
            className="w-full py-10 flex justify-center items-center"
          >
            {isFetchingNextPage ? (
               <span className="text-purple-500 animate-pulse font-bold">📡 正在查询更多动漫...</span>
            ) : hasNextPage ? (
               <span className="text-gray-400">继续滑动加载更多</span>
            ) : (
               <span className="text-gray-400 font-bold">🎉 已经是所有的动漫啦！</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;