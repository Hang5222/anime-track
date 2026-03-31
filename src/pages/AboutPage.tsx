import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* 返回按钮 */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-18 flex items-center text-purple-600 hover:text-purple-800 font-bold transition-colors"
      >
        <span className="mr-2">←</span> 返回
      </button>
      {/* 关于内容 */}
      <div className="text-lg">
        <h2 className="font-bold text-2xl md:text-3xl text-center">Anime Track</h2>
        <p className="text-center m-6">
          这是一个基于React+TypeScript开发的动漫跟踪网站，用于搜索、记录和管理用户关注的动漫。
        </p>
        <p className="text-center m-6">
          该网站使用了React框架，以及React Router、React Query、Zustand、Tailwind CSS等库。
        </p>
        <p className="text-center m-6">
          api: <a href="https://api.jikan.moe/v4" className='text-blue-600' target="_blank">https://api.jikan.moe/v4</a>
        </p>
      </div>
    </div>
  );
};
export default AboutPage;
