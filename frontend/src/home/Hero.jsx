import React from 'react';
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="relative bg-blue-950 min-h-screen flex justify-center items-center font-bold text-4xl">
      {/* Login Button */}
      <div className="absolute top-4 right-6">
        <Link to="/login">
          <button className="bg-white text-blue-950 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition">
            Login
          </button>
        </Link>
      </div>

      Merge conflicts again!! 🗿💀
    </div>
  );
};

export default Hero;
