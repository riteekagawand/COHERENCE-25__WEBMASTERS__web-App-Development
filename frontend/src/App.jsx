import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Landing from './home/Landing';
import NonAuthenticatedRoute from './routes/NonAuthenticatedRoute';
import Login from './auth/Login';
import News from './dashboard/News';
import GoogleTranslate from './components/GoogleTranslator';
import Location from './components/ALerts'

function App() {
  return (
    <Router>
      <GoogleTranslate />
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
        <Route path="/" element={<Landing />} />
        <Route path="/news" element={<News />} />
        <Route path="/location" element={<Location />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
  );
}

export default App;
