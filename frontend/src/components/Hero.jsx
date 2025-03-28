import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: 'url("https://via.placeholder.com/1920x1080?text=City+Skyline")',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <motion.div
        className="relative z-10 max-w-2xl px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Providing best growing solutions
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          You can read this text, but it doesn't matter. It's not important for you or your friends.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
          Get Free Consultation
        </button>
      </motion.div>

      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 group">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-4">
          <div className="relative">
            <img
              src="https://via.placeholder.com/80x80?text=Stats+Icon"
              alt="Stats Icon"
              className="w-16 h-16 object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">View</span>
            </div>
          </div>
          <div className="text-black">
            <h3 className="text-2xl font-bold">50K</h3>
            <p className="text-sm">Monthly Users</p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default Hero;