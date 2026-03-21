import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/navbar';
import LandingPage from './Landing';
import SignIn from './pages/Auth/SignIn';
import Register from './pages/Auth/Register';
import CreateProfile from './pages/Auth/CreateProfile';
import JoinTeam from './pages/Auth/JoinTeam';
import DashboardLayout from './pages/Dashboard/DashboardLayout';

function AppContent() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/dashboard');

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/create-profile" element={<CreateProfile />} />
        <Route path="/auth/join-team" element={<JoinTeam />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
