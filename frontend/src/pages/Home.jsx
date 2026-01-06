import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token]);

  return (
    <div className="hero">
      <h1>Learn Anything, Anytime</h1>
      <p>
        Join thousands of learners and access professional courses online.
        Track your progress, enroll in courses, and start learning today!
      </p>
      {user ? (
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      ) : (
        <button onClick={() => navigate('/signup')}>Start Learning</button>
      )}
    </div>
  );
}
