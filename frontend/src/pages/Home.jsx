import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Check if user is logged in
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token]);

  // Fetch featured courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        // Optional: show only first 3 courses as featured
        setCourses(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the E-Learning Platform</h1>

      {/* Show logged-in user */}
      {user ? <p>Hello, <strong>{user.name}</strong>!</p> : <p>Please <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link></p>}

      <h2>Featured Courses</h2>
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem', borderRadius: '5px' }}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Category: {course.category} | Difficulty: {course.difficulty}</p>
              <Link to={`/courses/${course.slug}`}>View Course</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
