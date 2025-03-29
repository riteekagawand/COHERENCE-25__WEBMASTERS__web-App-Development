import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/dashboard/Dashboard';
import NonAuthenticatedRoute from './routes/NonAuthenticatedRoute';
import Login from './auth/Login';
import News from './dashboard/News';
import GoogleTranslate from './components/GoogleTranslator';
import Location from './components/ALerts';
import { Toaster } from "sonner";
import Home from './home/Landing';
import CarbonFootprintCalculator from './dashboard/CarbonFootprint';
import EnergyDashboard from './dashboard/EnergyDashboard'; 
// import Navbar from './home/Navbar';

function App() {
  return (
    <Router>
      <GoogleTranslate />
      <Toaster />
      {/* <Navbar /> */}
      {/* Define your routes */}
      <Routes>
        <Route 
          path="/login" 
          element={
            <NonAuthenticatedRoute>
              <Login />
            </NonAuthenticatedRoute>
          } 
        />
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/location" element={<Location />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/carbon-footprint" element={<CarbonFootprintCalculator />} />
        <Route path="/energy-dashboard" element={<EnergyDashboard />} />

        </Routes>
    </Router>
  );
}

export default App;
