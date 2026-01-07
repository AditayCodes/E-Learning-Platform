import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await API.get('/courses');
      setCourses(res.data);
    };
    fetchCourses();

    const fetchEnrollments = async () => {
      if (!token) return setLoading(false);
      const res = await API.get('/enrollments/me', { headers: { Authorization: `Bearer ${token}` } });
      setEnrollments(res.data);
      setLoading(false);
    };
    fetchEnrollments();
  }, [token]);

  const isEnrolled = (courseId) => enrollments.some(e => e.courseId._id === courseId);
  const handleEnroll = async (courseId) => {
    if (!token) return navigate('/login');
    await API.post('/enrollments', { courseId }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Enrolled successfully!');
    navigate('/dashboard');
  };

  if (loading) return <div className="container py-5">Loading courses...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">All Courses</h2>
      <div className="row g-4">
        {courses.map(course => (
          <div className="col-lg-4 col-md-6" key={course._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text flex-grow-1">{course.description}</p>
                <p><strong>Category:</strong> {course.category}</p>
                <p><strong>Difficulty:</strong> {course.difficulty}</p>
                <p><strong>Price:</strong> ${course.price}</p>
                {user ? (
                  isEnrolled(course._id) ? (
                    <button className="btn btn-success" disabled>Already Enrolled</button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleEnroll(course._id)}>Enroll Now</button>
                  )
                ) : (
                  <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login to Enroll</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
