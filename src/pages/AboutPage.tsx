import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const techStack = [
    { name: 'React', desc: '核心框架' },
    { name: 'TypeScript', desc: '主要开发语言' },
    { name: 'Vite', desc: '构建工具' },
    { name: 'Tailwind CSS', desc: 'UI样式' },
    { name: 'TanStack Query', desc: '服务端状态管理' },
    { name: 'Zustand', desc: '客户端状态管理' },
    { name: 'React Router', desc: '路由管理' },
    { name: 'Axios', desc: '网络请求' },
  ];

  const features = [
    '虚拟列表渲染，万级数据流畅滚动',
    '无限滚动加载',
    '搜索关键词同步 URL，支持分享',
    '收藏状态本地持久化',
    '全端响应式适配',
    '更多详情请见Github仓库README ...',
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* 顶部返回区域 */}
      <div className="flex items-center mb-8 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 bg-white hover:text-pink-500 hover:bg-pink-50 p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-sm border border-gray-100 group"
          title="返回"
        >
          <FaArrowLeft className="text-sm sm:text-base group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800">ℹ️ 关于项目</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* 项目标题 */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-800 mb-2">Anime Track</h2>
          <p className="text-gray-500">探索全球热门动漫 ✨构建你的专属追番列表</p>
        </div>

        {/* 项目介绍 */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4">项目介绍</h3>
          <p className="text-gray-600 leading-relaxed">
            基于 React + TypeScript 开发的动漫浏览搜索与收藏管理网站，集成搜索、收藏、详情展示等功能。
            针对大数据列表采用虚拟列表渲染优化，配合无限滚动加载，提供流畅的浏览体验。
          </p>
        </section>

        {/* 技术栈 */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4">技术栈</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-gray-50 rounded-lg p-3 text-center hover:bg-pink-50 transition-colors"
              >
                <div className="font-semibold text-gray-800 text-sm">{tech.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 核心功能 */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4">核心功能</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 开发者信息 */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4">开发者</h3>
          <div className="flex items-center gap-4">
            <img
              src="https://github.com/Hang5222.png"
              alt="Hang's avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-800">Hang</div>
              <a
                href="https://github.com/Hang5222/anime-track"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-pink-500 transition-colors mt-1"
              >
                <FaGithub />
                <span>github.com/Hang5222/anime-track</span>
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>
        </section>

        {/* 数据来源 */}
        <section className="pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-400 text-center">
            数据来源：
            <a
              href="https://jikan.moe/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-pink-500 transition-colors"
            >
              Jikan API
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
