import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="bg-[#283f20] mt-2 shadow-lg shadow-teal-950 fixed w-full top-0 z-10 rounded-full">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="hidden md:flex space-x-6 justify-center">
          <Link to="/home" className="text-gray-100 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/about-us" className="text-gray-100 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link to="/contributions" className="text-gray-100 hover:text-blue-600 transition-colors">
            Contributions
          </Link>
        </nav>
        <button
          onClick={handleLoginClick}
          className="bg-white  px-6 py-1 font-semibold rounded-3xl"
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;