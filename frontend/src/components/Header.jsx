import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Left side: App name */}
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
          E-Learning Platform
        </Link>
      </h2>

      {/* Right side: Navigation links */}
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
          Home
        </Link>
        <Link to="/courses" style={{ textDecoration: 'none', color: '#007bff' }}>
          Courses
        </Link>

        {user && (
          <Link
            to="/dashboard"
            style={{ textDecoration: 'none', color: '#007bff' }}
          >
            Dashboard
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            style={{ textDecoration: 'none', color: '#007bff' }}
          >
            Admin Panel
          </Link>
        )}

        {!user && (
          <>
            <Link
              to="/login"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              Signup
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
