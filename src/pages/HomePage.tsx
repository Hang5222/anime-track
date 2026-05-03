import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query'; // 引入 useInfiniteQuery (无限查询)
import { useInView } from 'react-intersection-observer'; // 引入视口雷达 Hook
import { useWindowVirtualizer } from '@tanstack/react-virtual'; // 引入虚拟列表 Hook
import { getTopAnime, searchAnime } from '../api/jikan';
import AnimeCard from '../components/AnimeCard';
import BackToTop from '../components/BackToTop';
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

  // 将所有页的数据扁平化为一个一维数组，方便虚拟列表计算
  const allAnimes = data ? data.pages.flatMap((page) => page.data) : [];

  // 获取当前屏幕宽度，用于计算列数
  const [columns, setColumns] = useState(5);
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(2); // sm 以下 2 列
      else if (window.innerWidth < 768) setColumns(3); // md 以下 3 列
      else if (window.innerWidth < 1024) setColumns(4); // lg 以下 4 列
      else setColumns(5); // 默认 5 列
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 虚拟列表配置
  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(allAnimes.length / columns), // 总行数
    estimateSize: () => {
      // 动态计算响应式预估高度
      // 容器最大宽度 1280px (max-w-7xl)，左右内边距共 32px (p-4)
      const containerWidth = Math.min(window.innerWidth, 1280) - 32; 
      const gapWidth = (columns - 1) * 24; // gap-6 是 24px
      const cardWidth = (containerWidth - gapWidth) / columns;
      // 卡片图片是 aspect-3/4 (高度是宽度的 1.33倍)
      // 下方文字区高度约为 90px，再加行底部的间距 pb-6 (24px)
      return cardWidth * 1.333 + 114; 
    },
    overscan: 3, // 屏幕外多渲染 3 行，防止滚动过快白屏
  });

  const executeSearch = () => {
    setSearchQuery(inputValue.trim());
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 顶部标题与搜索区域 - 可爱风格 */}
      <div className="mb-8 sm:mb-12 mt-4 sm:mt-6 flex flex-col items-center px-2 sm:px-0">
        {/* 可爱风格标题设计 */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-cute text-gradient-cute mb-2 sm:mb-3">
              🌸 Anime Track 🌸
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-pink-400 font-medium tracking-wide">
              探索全球热门动漫与你的专属追番列表 ✨
            </p>
          </div>

          <div className="relative w-full max-w-xl flex gap-2 sm:gap-3 px-2 sm:px-0">
            <div className="relative flex-1 group">
              <input
                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                placeholder="搜索动漫英文名 (如: Naruto)"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 input-cute text-gray-700 shadow-cute text-sm sm:text-base"
              />
              {inputValue && <button onClick={clearSearch} className="absolute right-3 sm:right-4 top-3 sm:top-4 text-pink-300 hover:text-pink-500 p-1 rounded-full hover:bg-pink-50 transition-colors">✕</button>}
            </div>
            <button onClick={executeSearch} className="px-4 sm:px-8 py-3 sm:py-4 btn-cute active:scale-95 text-sm sm:text-base whitespace-nowrap">
              🔍 <span className="hidden sm:inline">搜索</span>
            </button>
          </div>
        </div>

      {/* 列表标题 - 可爱风格 */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 pb-3 sm:pb-4 border-b-2 border-pink-100 px-2 sm:px-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-cute text-gray-800 flex items-center gap-2 sm:gap-3">
          {searchQuery ? (
            <>
              <span className="text-pink-300">🔍</span>
              <span className="text-pink-500 truncate max-w-[120px] sm:max-w-[200px]">"{searchQuery}"</span>
              <span className="text-gray-400 hidden sm:inline">的搜索结果</span>
            </>
          ) : (
            <>
              <span className="text-xl sm:text-2xl">🔥</span>
              <span className="text-gradient-cute">本季热门动漫</span>
            </>
          )}
        </h2>
      </div>

      {isLoading && <div className="p-10 text-center text-xl text-pink-500 animate-pulse font-cute">正在加载动漫数据... ⭐</div>}
      {isError && <div className="p-10 text-center text-rose-500 bg-rose-50 rounded-cute mb-6 border-2 border-rose-200">获取数据失败: {(error as Error).message}</div>}

      {/* 渲染无限列表 */}
      {!isLoading && !isError && (
        <>
          <div 
            style={{ 
              height: `${virtualizer.getTotalSize()}px`, 
              width: '100%', 
              position: 'relative' 
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              // 计算当前行包含的卡片索引范围
              const startIndex = virtualRow.index * columns;
              const rowItems = allAnimes.slice(startIndex, startIndex + columns);

              return (
                <div
                  key={virtualRow.index}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`grid gap-6 ${
                    columns === 2 ? 'grid-cols-2 sm:grid-cols-2' : 
                    columns === 3 ? 'grid-cols-3 md:grid-cols-3' : 
                    columns === 4 ? 'grid-cols-4 lg:grid-cols-4' : 'grid-cols-5 lg:grid-cols-5'
                  }`}
                >
                  {rowItems.map((animeItem) => (
                    <div key={animeItem.mal_id} className="h-full pb-6">
                      <AnimeCard anime={animeItem} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {data?.pages[0].data.length === 0 && (
            <div className="text-center text-gray-500 py-10 bg-white rounded-cute border-2 border-pink-100">
              没找到相关动漫，换个名字试试吧~ 🌸
            </div>
          )}

          {/* 安插底部的"哨兵"！ */}
          <div
            ref={ref} // 把雷达绑在它身上
            className="w-full py-10 flex justify-center items-center"
          >
            {isFetchingNextPage ? (
               <span className="text-pink-500 animate-pulse font-cute text-lg">正在加载更多动漫... ⭐</span>
            ) : hasNextPage ? (
               <span className="text-pink-300 font-cute">继续滑动加载更多 ✨</span>
            ) : (
               <span className="text-pink-400 font-cute text-lg">🎉 已经是所有的动漫啦！</span>
            )}
          </div>
        </>
      )}

      {/* 回到顶部组件 */}
      <BackToTop />
    </div>
  );
};

export default HomePage;