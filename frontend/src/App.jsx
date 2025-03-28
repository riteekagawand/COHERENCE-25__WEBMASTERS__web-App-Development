// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Adjust path if needed
import Maps from './pages/Maps'; // Adjust path if needed

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar is always visible */}
        <Sidebar />
        {/* Define your routes */}
        <Routes>
          <Route path="/maps" element={<Maps />} />
          {/* <Route path="/overview" element={<div className="ml-64 p-6">Overview Page</div>} />
          <Route path="/inventory" element={<div className="ml-64 p-6">Inventory Page</div>} />
          <Route path="/training" element={<div className="ml-64 p-6">Training Modules Page</div>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;