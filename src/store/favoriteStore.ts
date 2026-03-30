import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavAnime {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;  
}
interface FavoriteState {
  favorites: FavAnime[]; // 收藏列表
  addFavorite: (anime: FavAnime) => void; 
  removeFavorite: (id: number) => void; 
  isFavorite: (id: number) => boolean; // 判断是否已收藏 (方便组件调用)
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites:[], // 初始状态为空数组

      // 动作：添加
      addFavorite: (anime) => set((state) => ({
        // 把新的 anime 放到数组最前面，保留原来的 favorites
        favorites: [anime, ...state.favorites]
      })),

      // 动作：移除
      removeFavorite: (id) => set((state) => ({
        // 过滤掉那个 id，剩下的保留
        favorites: state.favorites.filter((a) => a.mal_id !== id)
      })),

      // 动作：判断 (这是一个便捷方法，不修改 state，只读取)
      isFavorite: (id) => {
        return get().favorites.some((a) => a.mal_id === id);
      }
    }),
    {
      // 🌟 persist 的配置项
      name: 'anime-favorites-storage', // 存在 LocalStorage 里的 key 叫什么名字
    }
  )
);