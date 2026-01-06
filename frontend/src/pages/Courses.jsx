import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!token) return;
      try {
        const res = await API.get('/enrollments/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrollments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [token]);

  const isEnrolled = (courseId) => enrollments.some(e => e.courseId._id === courseId);

  const handleEnroll = async (courseId) => {
    if (!token) return navigate('/login');
    try {
      await API.post('/enrollments', { courseId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Enrolled successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Enrollment failed');
    }
  };

  if (loading) return <p className="container">Loading courses...</p>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>All Courses</h2>
      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Category: {course.category} | Difficulty: {course.difficulty}</p>
            <p>Price: ${course.price}</p>
            <Link to={`/courses/${course.slug}`} style={{ textDecoration: 'none', color: '#007bff' }}>View Details</Link>
            {user ? (
              isEnrolled(course._id) ? (
                <button className="course-card success" disabled>✅ Already Enrolled</button>
              ) : (
                <button className="primary" onClick={() => handleEnroll(course._id)}>Enroll Now</button>
              )
            ) : (
              <button onClick={() => navigate('/login')} style={{ backgroundColor: '#6c757d', color: 'white' }}>Login to Enroll</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
