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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">E-Learning</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/courses">Courses</Link></li>
            {user && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
            {user?.role === 'admin' && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
            {!user && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>}
            {!user && <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>}
            {user && <li className="nav-item"><button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button></li>}
          </ul>
        </div>
      </div>
    </nav>
  );
}
