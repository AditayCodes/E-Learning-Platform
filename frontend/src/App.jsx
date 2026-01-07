import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CourseDetail from './pages/CourseDetail';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}
