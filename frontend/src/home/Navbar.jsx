import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link'; // Import HashLink
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollingDirection, setScrollingDirection] = useState('up'); // Tracking scroll direction
  const [prevScrollPos, setPrevScrollPos] = useState(0); // Previous scroll position

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // Check if the user is scrolling up or down
      if (currentScrollPos > prevScrollPos) {
        setScrollingDirection('down'); // Scrolling down
      } else {
        setScrollingDirection('up'); // Scrolling up
      }

      // Update the previous scroll position
      setPrevScrollPos(currentScrollPos);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white/90 z-50 shadow-sm font-grotesk min-w-full transition-transform duration-300 ${
        scrollingDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        {/* Logo (Optional) */}
        <div className="text-xl font-bold text-gray-900">Logo</div>

        {/* Hamburger Menu for Mobile */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? 'flex' : 'hidden'
          } sm:flex flex-col sm:flex-row gap-4 sm:gap-6 items-center absolute sm:static top-16 left-0 w-full sm:w-auto bg-white/90 sm:bg-transparent p-4 sm:p-0 shadow-sm sm:shadow-none transition-all duration-300`}
        >
          <li className="text-gray-700 hover:text-black cursor-pointer text-sm sm:text-base">
            <HashLink to="#home" className="hover:text-gray-600">
              Home
            </HashLink>
          </li>
          <li className="text-gray-700 hover:text-black cursor-pointer text-sm sm:text-base">
            <HashLink to="#usp" className="hover:text-gray-600">
              About
            </HashLink>
          </li>
          <li className="text-gray-700 hover:text-black cursor-pointer text-sm sm:text-base">
            <HashLink to="#news-updates" className="hover:text-gray-600">
              News & Updates
            </HashLink>
          </li>
          <li className="text-gray-700 hover:text-black cursor-pointer text-sm sm:text-base">
            <HashLink to="#inovations" className="hover:text-gray-600">
              Inovations
            </HashLink>
          </li>
          <li className="text-gray-700 hover:text-black cursor-pointer text-sm sm:text-base">
            <HashLink to="#traffic" className="hover:text-gray-600">
              Traffic Data
            </HashLink>
          </li>
          <li>
            <Link to='/login' className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-800 text-sm sm:text-base">
              Login/Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
