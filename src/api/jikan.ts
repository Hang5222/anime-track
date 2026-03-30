import axios from 'axios';
import type { TopAnimeResponse} from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

// 请求热门动漫
export const getTopAnime = async ():Promise<TopAnimeResponse> => {
  const response = await axios.get<TopAnimeResponse>(`${BASE_URL}/top/anime`, {
    params: {
      limit: 10
    }
  }); 
  return response.data;
}

// 搜索动漫
export const searchAnime = async (query: string): Promise<TopAnimeResponse> => {
  const response = await axios.get<TopAnimeResponse>(`${BASE_URL}/anime`, {
    params: {
      q: query,
      limit: 10,
      sfw: true
    }
  });
  return response.data;
}

// 获取动漫详情
export const getAnimeById = async (id: string | number) => {
  const response = await axios.get(`${BASE_URL}/anime/${id}/full`);
  return response.data;
};