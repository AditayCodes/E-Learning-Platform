import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </nav>
  );
}
