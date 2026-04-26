import axios from 'axios';
import type { TopAnimeResponse} from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

// 请求热门动漫
export const getTopAnime = async ({ pageParam = 1 }): Promise<TopAnimeResponse> => {
  const response = await axios.get<TopAnimeResponse>(`${BASE_URL}/top/anime`, {
    params: { 
      page: pageParam, // 传给后端的页码
      limit: 15        
    } 
  });
  return response.data;
}

// 搜索动漫
export const searchAnime = async (query: string, { pageParam = 1 }): Promise<TopAnimeResponse> => {
  const response = await axios.get<TopAnimeResponse>(`${BASE_URL}/anime`, {
    params: {
      q: query,
      page: pageParam, // 传给后端的页码
      limit: 15,
      sfw: true // 仅返回安全的动漫
    }
  });
  return response.data;
}

// 获取动漫详情
export const getAnimeById = async (id: string | number) => {
  const response = await axios.get(`${BASE_URL}/anime/${id}/full`);
  return response.data;
};