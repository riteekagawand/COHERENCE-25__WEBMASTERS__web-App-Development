import { useState } from 'react';
import video from '../../public/GreenBg.mp4';

const HeroSection = () => {
  const [showCard, setShowCard] = useState(false);

  const handleJoinClick = () => {
    setShowCard(!showCard);
  };

  return (
    <section className="relative mt-10 flex justify-center items-center rounded-3xl min-h-screen bg-gray-100">
      <div className="relative w-full max-w-7xl h-[80vh] rounded-3xl">
        <video
          src={video}
          alt="Children smiling and playing"
          className="w-full h-full object-cover rounded-3xl"
          autoPlay
          muted
          loop
        />
        <div 
          id='home' 
          className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4 rounded-3xl"
        >
     <h1 className="text-6xl font-serif font-bold text-center">
            SmartGrid
          </h1>
          <p className="text-lg font-serif text-center mt-2 font-medium">
            Powering Cities, Connecting Lives
          </p>
          <p className=" mt-9 text-sm text-center  max-w-2xl">
            Discover real-time traffic, EV stations, air quality, and energy insights on interactive maps. 
            SmartGrid delivers alerts, dashboards, and solutions for a cleaner, smarter tomorrow.
          </p>
          <div className="mt-6">
            <button
              onClick={handleJoinClick}
              className="bg-[#d1ebc9] bg-opacity-85 border-2 border-green-500 px-6 py-2 rounded-2xl text-gray-900 font-semibold hover:opacity-75 transition-opacity"
            >
              Get Started 
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;