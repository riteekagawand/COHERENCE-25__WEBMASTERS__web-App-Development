import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import News from '@/pages/News';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';

function App() {
 
  return (
    <Router>
        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path='/news' element={<News />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
  );
}

export default App;