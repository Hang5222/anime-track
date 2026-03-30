import type { Anime } from '../types/anime';
import { useNavigate } from 'react-router-dom';

// 定义这个组件的 Props 接口：它必须接收一个属性叫 anime，类型是 Anime
interface AnimeCardProps {
  anime: Anime;
}

// 声明组件并解构出 anime
const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anime/${anime.mal_id}`);
  }
  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={handleClick}>
      
      {/* 海报区域 */}
      <div className="relative aspect-3/4 overflow-hidden bg-gray-200">
        <img 
          src={anime.images.webp.large_image_url} 
          alt={anime.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* 评分小标签 */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          ⭐ {anime.score}
        </div>
      </div>

      {/* 文字信息区域 */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-bold text-gray-800 text-sm mb-1 truncate" title={anime.title}>
          {anime.title}
        </h3>
        
        <div className="flex justify-between items-center text-xs text-gray-500 font-medium mt-2">
          <span>📅 {anime.year || '未知'}</span>
          <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
            {anime.episodes ? `${anime.episodes} 集` : '连载中'}
          </span>
        </div>
      </div>

    </div>
  );
};

export default AnimeCard;