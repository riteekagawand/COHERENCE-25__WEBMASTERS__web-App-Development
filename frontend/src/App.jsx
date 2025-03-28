import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './home/Landing'
import NonAuthenticatedRoute from './routes/NonAuthenticatedRoute';
import Login from "./auth/Login"
import News from "./dashboard/News"

function App() {
 
  return (
    <Router>
        {/* Define your routes */}
        <Routes>
          <Route
              path="/login"
              element={
                // <NonAuthenticatedRoute>
                  <Login />
                // </NonAuthenticatedRoute>
              }
            />
            <Route path="/" element={<Landing />} />
          <Route path='/news' element={<News />} />
        </Routes>
    </Router>
  );
}

export default App;