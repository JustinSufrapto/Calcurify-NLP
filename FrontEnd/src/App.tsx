import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Calculate from "./pages/Calculate";
import BMR from "./pages/BMR";
import Food from "./pages/Food";
import Mission from "./pages/Mission";
import Features from "./pages/Features";
import Hasil from "./pages/Hasil";
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/bmr" element={
          <ProtectedRoute>
            <BMR />
          </ProtectedRoute>
        } />
        <Route path="/Home" element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>} />
        <Route path="/Calculate" element={<ProtectedRoute>
          <Calculate />
        </ProtectedRoute>} />
        <Route path="/BMR" element={<ProtectedRoute>
          <BMR />
        </ProtectedRoute>} />
        <Route path="/Food" element={<ProtectedRoute>
          <Food />
        </ProtectedRoute>} />
        <Route path="/Hasil" element={<ProtectedRoute>
          <Hasil />
        </ProtectedRoute>} />

        <Route path="/Mission" element={<Mission />} />
        <Route path="/Features" element={<Features />} />

        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
