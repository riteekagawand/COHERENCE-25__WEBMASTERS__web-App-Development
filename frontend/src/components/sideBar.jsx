import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaTimes, FaNewspaper } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Hamburger Icon (Visible when sidebar is closed on mobile) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 text-2xl text-black md:hidden"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-[#1A2417] fixed top-0 left-0 flex flex-col h-screen shadow-md shadow-gray-400 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-16'
        } md:w-64`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4">
          {isOpen && (
            <button onClick={toggleSidebar} className="text-2xl text-white md:hidden">
              <FaTimes />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex flex-1 flex-col items-start px-4 py-20">
          <Link
            to="/maps"
            className={`flex items-center w-full py-2 my-1 rounded-lg transition-colors ${
              isActive('/maps') ? 'bg-blue-100 font-medium text-gray-600' : 'text-gray-100 font-medium hover:text-gray-600 hover:bg-[#d1ebc9]'
            } ${isOpen ? 'justify-start pl-4' : 'justify-center'} md:justify-start md:pl-4`}
          >
            <FaHome className="text-2xl" />
            <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} md:block text-lg`}>Maps</span>
          </Link>

          <Link
            to="/news"
            className={`flex items-center w-full py-2 my-1 rounded-lg transition-colors ${
              isActive('/news') ? 'bg-blue-100 font-medium text-gray-600' : 'text-gray-100 font-medium hover:text-gray-600 hover:bg-[#d1ebc9]'
            } ${isOpen ? 'justify-start pl-4' : 'justify-center'} md:justify-start md:pl-4`}
          >
            <FaNewspaper className="text-lg size-6" />
            <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} md:block text-lg`}>Local News</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center w-full py-2 my-1 rounded-lg transition-colors ${
              isActive('/dashboard') ? 'bg-blue-100 font-medium text-gray-600' : 'text-gray-100 font-medium hover:text-gray-600 hover:bg-[#d1ebc9]'
            } ${isOpen ? 'justify-start pl-4' : 'justify-center'} md:justify-start md:pl-4`}
          >
            <FaNewspaper className="text-lg size-6" />
            <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} md:block text-lg`}>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;