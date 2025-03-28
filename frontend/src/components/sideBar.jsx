// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
// import logo from '../assets/logo.png'; // Ensure this path is correct

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-100 p-6 shadow-lg">
      {/* Logo Section - Commented Out */}
      {/* <div className="flex items-center mb-6">
        <img src={logo} alt="Logo" className="w-12 h-12 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Smart City India</h2>
      </div> */}

      {/* Navigation Links */}
      <ul className="space-y-4">
        <li>
          <Link
            to="/overview"
            className="block p-3 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to="/inventory"
            className="block p-3 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            Inventory
          </Link>
        </li>
        <li>
          <Link
            to="/training"
            className="block p-3 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            Training Modules
          </Link>
        </li>
        <li>
          <Link
            to="/maps"
            className="block p-3 rounded-lg hover:bg-gray-200 text-gray-700"
          >
            View Maps
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;