// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-50 shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left side: Logo or empty space (as in the image) */}
      <div className="flex-1">
        {/* You can add a logo here if needed */}
      </div>

      {/* Center: Navigation Links */}
      <div className="flex space-x-8">
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          Home
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          About
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          Services
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          Pricing
        </a>
        <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
          Contact
        </a>
      </div>

      {/* Right side: Try for Free Button */}
      <div className="flex-1 flex justify-end">
        <button className="bg-black text-white font-medium py-2 px-4 rounded-full hover:bg-gray-800 transition">
          Try for Free
        </button>
      </div>
    </nav>
  );
};

export default Navbar;