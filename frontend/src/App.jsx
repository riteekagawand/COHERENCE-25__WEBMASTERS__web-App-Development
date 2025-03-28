import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './home/Landing';
import NonAuthenticatedRoute from './routes/NonAuthenticatedRoute';
import Login from './auth/Login';
import News from './dashboard/News';
import GoogleTranslate from './components/GoogleTranslator';
import Location from './components/ALerts';
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      {/* Place GoogleTranslate outside of Routes */}
      <GoogleTranslate />
      <Toaster />
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
      </Routes>
    </Router>
  );
}

export default App;
