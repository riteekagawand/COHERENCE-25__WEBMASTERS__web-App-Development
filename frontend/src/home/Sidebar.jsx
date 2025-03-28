import  { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Icons from react-icons (matching the design)
import { FaHome, FaBars, FaTimes, FaNewspaper} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex">
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
        className={`bg-[#1A2417] fixed  left-0 top-0 flex flex-col h-scroll shadow-md shadow-gray-400 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-16'
        } md:w-64 md:static`} // Toggle width on mobile; always expanded on desktop
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4">
          {/* <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className={`transition-all duration-300 ${isOpen ? 'w-[190px]' : 'w-0'} md:w-[190px]`}
            />
          </Link> */}
          {isOpen && (
            <button onClick={toggleSidebar} className="text-2xl text-black md:hidden">
              <FaTimes />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex flex-1 flex-col items-start px-4 py-20">
          <Link
            to="/userdash"
            className={`flex items-center w-full py-2 my-1 rounded-lg transition-colors ${
              isActive('/userdash') ? 'bg-blue-100 font-medium text-gray-600' : 'text-gray-100 font-medium hover:text-gray-600 hover:bg-[#d1ebc9]'
            } ${isOpen ? 'justify-start pl-4' : 'justify-center'} md:justify-start md:pl-4`}
          >
            <FaHome className="text-2xl" />
            <span className={`ml-3 ${isOpen ? 'block' : 'hidden'} md:block text-lg`}>Overview</span>
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
        
        </div>
      </div>
    </div>
  );
};

export default Sidebar;