import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from "./home/Hero"

function App() {
 
  return (
    <Router>
        {/* Define your routes */}
        <Routes>
          <Route path='/' element={<Hero />} />
        </Routes>
    </Router>
  );
}

export default App;