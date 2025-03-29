import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaNewspaper } from 'react-icons/fa';
import  logo  from '../assets/Logo.png'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col w-[260px] bg-[#1A2417] fixed left-0 top-0 h-screen shadow-md transition-all duration-300 z-40">
      {/* Sidebar toggle button on mobile */}
      <button onClick={toggleSidebar} className="text-2xl text-black md:hidden">
        {!isOpen ? <FaBars /> : <FaTimes />}
      </button>

      {/* Logo */}
      <div className="flex justify-center items-center my-6">
        <img
          src={logo} // Replace with your logo path
          alt={logo}
          className="w-32 h-auto" // Adjust the size as needed
        />
      </div>

      {/* Menu Items */}
      <div className="flex flex-1  flex-col items-start px-4 py-6 mt-[30px]">
        <Link
          to="/dashboard"
          className={`flex items-center w-full py-2 my-1 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-blue-100 font-medium text-gray-600' : 'text-gray-100 font-medium hover:text-gray-600 hover:bg-[#d1ebc9]'} ${isOpen ? 'justify-start pl-4' : 'justify-center'}`}
        >
          <FaNewspaper className="text-2xl" />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} font-grotesk md:block text-lg`}>
            Dashboard
          </span>
        </Link>

        <Link
          to="/news"
          className={`flex items-center w-full py-2 my-1 rounded-lg transition-colors ${isActive('/news') ? 'bg-blue-100 font-medium text-gray-600' : 'text-gray-100 font-medium hover:text-gray-600 hover:bg-[#d1ebc9]'} ${isOpen ? 'justify-start pl-4' : 'justify-center'}`}
        >
          <FaNewspaper className="text-2xl " />
          <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} font-grotesk md:block text-lg`}>
            Local News
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
