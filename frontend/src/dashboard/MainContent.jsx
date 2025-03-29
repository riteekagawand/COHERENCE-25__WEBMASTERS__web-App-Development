import { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; // Adjust path if needed
import News from '../components/news';

const NewsPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (on the left side) */}
      <Sidebar />

      {/* Main Content (News Section on the right side) */}
      <div className="flex-1 bg-[#d1ebc9] p-6">
        <News />
      </div>
    </div>
  );
};

export default NewsPage;
