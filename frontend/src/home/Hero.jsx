import React from 'react';

const HeroSection = () => {
  return (
    <div id='home' className="relative min-h-screen bg-white">
      {/* Navigation */}
      

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center justify-between min-h-screen px-4 sm:px-6 md:px-10">
        {/* Left Side - Text and Button */}
        <div className="md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-grotesk leading-tight">
          "Building a Smarter  <span className="text-green-500">Future,</span>  One Innovation at a Time"
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg font-grotesk">
          "Experience the next generation of urban living with cutting-edge technology, sustainable solutions, and seamless connectivity."
          </p>
          <button className="bg-[#36512e] text-white px-4 py-2 sm:px-6 font-grotesk sm:py-3 rounded-full text-sm sm:text-base hover:bg-gray-800">
          Explore Innovations
          </button>
        </div>

        {/* Right Side - Image with Overlays */}
        <div className="md:w-1/2 relative mt-8 md:mt-0 w-full">
          {/* Background Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/681335/pexels-photo-681335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Cityscape"
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-3xl"
            />
            {/* Overlay Elements */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 8v8m-4-4h8"
                />
              </svg>
            </div>
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10 bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h18v18H3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12h18M12 3v18"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 sm:px-6 sm:py-2 rounded-t-lg shadow-lg">
              <p className="text-gray-600 text-xs sm:text-sm md:text-base font-grotesk">Hassle free Life</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Circles for Design */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gray-100 rounded-full -z-10"></div>
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gray-100 rounded-full -z-10"></div>
    </div>
  );
};

export default HeroSection;