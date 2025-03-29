import React from 'react';
import hero from '../assets/FH.png'
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
              src={hero}
              alt="Cityscape"
              className="w-[680px] h-[420px] sm:h-[500px] md:h-[600px] mt-12"
            />
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