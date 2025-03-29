import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Adjust path if needed
import Maps from './pages/Maps'; // Adjust path if needed

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar: Always visible, width varies */}
        <Sidebar />
        {/* Main content: Takes remaining space */}
        <div className="flex-1">
          <Routes>
            <Route path="/maps" element={<Maps />} />
            {/* Uncomment and adjust as needed */}
            {/* <Route path="/overview" element={<div className="p-6">Overview Page</div>} />
            <Route path="/inventory" element={<div className="p-6">Inventory Page</div>} />
            <Route path="/training" element={<div className="p-6">Training Modules Page</div>} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;