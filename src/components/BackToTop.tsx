import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件，判断是否显示按钮
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 sm:p-4 rounded-full bg-linear-to-r from-pink-400 to-rose-400 text-white shadow-cute hover:shadow-cute-hover hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center border-2 border-white"
          aria-label="回到顶部"
          title="回到顶部"
        >
          <FaArrowUp className="text-lg sm:text-xl" />
        </button>
      )}
    </>
  );
};

export default BackToTop;
