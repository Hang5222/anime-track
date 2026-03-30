export interface TopAnimeResponse {
  data: Anime[];
}
export interface Anime {
  mal_id: number;
  title: string;
  images: WebpImage;
  score: number;
  year: number;
  episodes: number; //集数
}
export interface WebpImage {
  webp: {
    image_url: string;
    large_image_url: string;
  }
}