import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // For the hamburger menu icon

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/">Logo</Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/traffic-analysis" className="text-gray-600 hover:text-blue-600 transition-colors">
            Traffic Analysis
          </Link>
        </nav>

        {/* Sign In and Hamburger */}
        <div className="flex items-center space-x-4">
          <Link
            to="/signin"
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Sign in
          </Link>
          <button className="md:hidden text-gray-600">
            <FaBars className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 bg-[#F5F6EE]">
          <h1 className="text-4xl md:text-8xl font-extrabold text-gray-800 mb-4">
            MAKE YOUR LIFE <br /> EASY
          </h1>
          <p className="text-gray-500 mb-8">Some small tagline</p>

          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-row items-center space-x-4 w-full max-w-4xl overflow-x-auto">
            <select
              className="w-1/3 md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Current Location
              </option>
              <option value="location1">Location 1</option>
              <option value="location2">Location 2</option>
              <option value="location3">Location 3</option>
            </select>

            <select
              className="w-1/3 md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Origin
              </option>
              <option value="origin1">Origin 1</option>
              <option value="origin2">Origin 2</option>
              <option value="origin3">Origin 3</option>
            </select>

            <select
              className="w-1/3 md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Destination
              </option>
              <option value="destination1">Destination 1</option>
              <option value="destination2">Destination 2</option>
              <option value="destination3">Destination 3</option>
            </select>

            <button className="w-auto bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors">
              Explore Now
            </button>
          </div>
        </div>

        {/* Right Section (Background Image from Public Folder) */}
        <div
          className="flex-1 bg-cover bg-center"
          style={{
            backgroundImage: `url('/Rectangle.png')`, // Reference the image directly from the public folder
          }}
        />
      </main>

      {/* Latest News Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header (Outside the Image) */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Find out the latest News
            </h2>
            <p className="text-gray-500">
              Find out what happens in last 24 hours
            </p>
          </div>

          {/* News Card (Image with Overlay Text) */}
          <div
            className="relative rounded-2xl overflow-hidden bg-cover bg-center h-64 md:h-96 flex items-center justify-end"
            style={{
              backgroundImage: `url('/news-image.svg')`, // Reference the SVG from the public folder
            }}
          >
            {/* Overlay for gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-70"></div>

            {/* Text and Button (Inside the Image, Right-Aligned) */}
            <div className="relative z-10 p-8 md:p-12 text-white max-w-md">
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                Making city smart
              </h3>
              <p className="text-gray-200 mb-4">
                Making city smart find out how by making YOUR life hassle free
              </p>
              <Link
                to="/news"
                className="inline-flex items-center px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Find Out More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Time Saver Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header (Outside the Image) */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              We are your time saver know how?
            </h2>
            <p className="text-gray-500">
              Give the reason why we are time saver
            </p>
          </div>

          {/* Time Saver Card (Image with Overlay Text) */}
          <div
            className="relative rounded-2xl overflow-hidden bg-cover bg-center h-64 md:h-96 flex items-center justify-start"
            style={{
              backgroundImage: `url('/time-saver-image.png')`, // Reference the image from the public folder
            }}
          >
            {/* Overlay for gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black opacity-70"></div>

            {/* Text and Button (Inside the Image, Left-Aligned) */}
            <div className="relative z-10 p-8 md:p-12 text-white max-w-md">
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                Making AQI Concept to Citizen WHY?
              </h3>
              <p className="text-gray-200 mb-4">
                Give us the reason for the above question
              </p>
              <Link
                to="/time-saver"
                className="inline-flex items-center px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Start Your Search
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;