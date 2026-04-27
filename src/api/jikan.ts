import axios from 'axios';
import type { TopAnimeResponse, AnimeFullDetail } from '../types/anime';

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

// 动漫基础详情信息
export const getAnimeById = async (id: string | number) => {
  const response = await axios.get(`${BASE_URL}/anime/${id}/full`);
  return response.data;
};
// 获取角色列表
export const getAnimeCharacters = async (id: string | number) => {
  const response = await axios.get(`${BASE_URL}/anime/${id}/characters`);
  return response.data;
};

// 性能优化——聚合请求函数：同时拉取详情和角色，拼装成一个大对象返回
export const getFullAnimeInfo = async (id: string): Promise<AnimeFullDetail> => {
  // 使用 Promise.all 并发请求
  const [detailRes, charsRes] = await Promise.all([
    axios.get(`${BASE_URL}/anime/${id}/full`),
    axios.get(`${BASE_URL}/anime/${id}/characters`)
  ]);

  return {
    anime: detailRes.data.data,
    characters: charsRes.data.data.slice(0, 12) // 只取前 12 个主要角色展示
  };
};