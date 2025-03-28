import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from "./home/Hero"
import NonAuthenticatedRoute from './routes/NonAuthenticatedRoute';
import Login from "./auth/Login"

function App() {
 
  return (
    <Router>
        {/* Define your routes */}
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route
              path="/login"
              element={
                <NonAuthenticatedRoute>
                  <Login />
                </NonAuthenticatedRoute>
              }
            />
        </Routes>
    </Router>
  );
}

export default App;