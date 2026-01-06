import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #ddd',
        padding: '1rem 2rem',
        marginTop: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        <Link to="/" style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/courses" style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'none' }}>
          Courses
        </Link>
        <Link to="/dashboard" style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
          Login
        </Link>
      </div>

      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        © {year} E-Learning Platform. All rights reserved.
      </p>
    </footer>
  );
}
