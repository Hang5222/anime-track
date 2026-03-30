import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-bold">AboutAbout</h1>
      <button onClick={() => navigate('/')} className="bg-blue-400 text-white font-bold px-4 py-2 rounded-md">返回主页</button>
    </div>
  );
};
export default AboutPage;
