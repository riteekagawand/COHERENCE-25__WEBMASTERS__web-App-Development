import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link'; // Import HashLink
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil'; // ✅ Import useRecoilValue
import { loggedInState } from '../state/authState'; // ✅ Import loggedInState
import { Button } from '@/components/ui/button'; // ✅ Ensure correct import
import logo from '../assets/logo-dark.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollingDirection, setScrollingDirection] = useState('up'); // Tracking scroll direction
  const [prevScrollPos, setPrevScrollPos] = useState(0); // Previous scroll position
  const isLoggedIn = useRecoilValue(loggedInState); // ✅ Using Recoil state
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setScrollingDirection(currentScrollPos > prevScrollPos ? 'down' : 'up');
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
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
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" className="w-56 h-auto ml-3" />
        </Link>

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
          <li><HashLink to="#home" className="text-gray-700 hover:text-black">Home</HashLink></li>
          <li><HashLink to="#usp" className="text-gray-700 hover:text-black">About</HashLink></li>
          <li><HashLink to="#news-updates" className="text-gray-700 hover:text-black">News & Updates</HashLink></li>
          <li><HashLink to="#inovations" className="text-gray-700 hover:text-black">Innovations</HashLink></li>
          <li><HashLink to="#traffic" className="text-gray-700 hover:text-black">Traffic Data</HashLink></li>
          
          {!isLoggedIn && (
            <Button size="lg" onClick={() => navigate("/login")} className='text-lg bg-[#36512e] w-62 hover:bg-[#36512e] text-white px-6 rounded-md py-2 font-semibold'>
              Login / Signup
            </Button>
          )}
          {isLoggedIn && (
            <Button size="lg" onClick={() => navigate("/dashboard")} className='text-lg w-full px-6 rounded-md py-2'>
              Dashboard
            </Button>
          )}
          {isLoggedIn && (
            <Button size="lg" variant="destructive" onClick={() => handleLogout()} className='text-lg w-full px-6 rounded-md py-2'>
              Logout
            </Button>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;