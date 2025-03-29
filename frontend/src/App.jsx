import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/dashboard/Dashboard';
import NonAuthenticatedRoute from './routes/NonAuthenticatedRoute';
import AuthenticatedRoute from './routes/AuthenticatedRoute';
import Login from './auth/Login';
import News from './dashboard/News';
import GoogleTranslate from './components/GoogleTranslator';
import Location from './components/ALerts';
import { Toaster } from "sonner";
import Navbar from './home/Navbar';
import Home from './home/Landing';
import AddDetailForm from './home/AddDetails';

function App() {
  return (
    <Router>
      <GoogleTranslate />
      <Toaster />
      <Navbar />
      <Routes>
        <Route 
          path="/login" 
          element={
            <NonAuthenticatedRoute>
              <Login />
            </NonAuthenticatedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <NonAuthenticatedRoute> 
              <Home /> 
            </NonAuthenticatedRoute>
          } 
        />
        <Route 
          path="/adduserdetail" 
          element={
            <AuthenticatedRoute>
              <AddDetailForm />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/news" 
          element={
            <AuthenticatedRoute>
              <News />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <AuthenticatedRoute> 
              <Dashboard /> 
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/location" 
          element={
            <NonAuthenticatedRoute> 
              <Location /> 
            </NonAuthenticatedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;