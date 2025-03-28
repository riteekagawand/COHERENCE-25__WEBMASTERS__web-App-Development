import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white/90 z-50 shadow-sm">
      <nav className="container mx-auto flex justify-center py-4">
        <ul className="flex gap-6 items-center">
          <li className="text-gray-700 hover:text-black cursor-pointer">Home</li>
          <li className="text-gray-700 hover:text-black cursor-pointer">About</li>
          <li className="text-gray-700 hover:text-black cursor-pointer">Services</li>
          <li className="text-gray-700 hover:text-black cursor-pointer">Pricing</li>
          <li className="text-gray-700 hover:text-black cursor-pointer">Contact</li>
          <li>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Try for free
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;