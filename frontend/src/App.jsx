import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import News from '@/pages/News';
import Landing from '@/pages/Landing';

function App() {
 
  return (
    <Router>
        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path='/news' element={<News />} />
          <Route path="/" element={<Landing />} />
        </Routes>
    </Router>
  );
}

export default App;