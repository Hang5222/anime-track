// 动漫列表响应体
export interface TopAnimeResponse {
  data: Anime[];
  pagination: {
    has_next_page: boolean;
  }
}
// 单个动漫基本信息
export interface Anime {
  mal_id: number;
  title: string;
  images: WebpImage;
  score: number;
  year: number;
  episodes: number; //集数
}
// 动漫图片
export interface WebpImage {
  webp: {
    image_url: string;
    large_image_url: string;
  }
}
// 动漫详情信息
export interface AnimeDetail {
  mal_id: number;
  title: string;
  title_japanese: string;
  images: WebpImage;
  synopsis: string; 
  score: number;
  year: number;
  status: string; 
  genres: { name: string }[];
  type: string;     
  episodes: number; 
  rating: string;   
}
// 角色信息
export interface Character {
  character: {
    mal_id: number;
    name: string;
    images: WebpImage;
  };
  role: string;
}
// 动漫详情完整总信息
export interface AnimeFullDetail {
  anime: AnimeDetail; 
  characters: Character[];
}