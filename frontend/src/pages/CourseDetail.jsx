import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch course by slug
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get('/courses');
        const selected = res.data.find((c) => c.slug === slug);
        setCourse(selected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  // Fetch user enrollments (if logged in)
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!token) return;
      try {
        const res = await API.get('/enrollments/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEnrollments();
  }, [token]);

  // Check if user is already enrolled
  const isEnrolled = () => {
    if (!user || !course) return false;
    return enrollments.some((enroll) => enroll.courseId._id === course._id);
  };

  // Enroll user
  const handleEnroll = async () => {
    if (!token) return navigate('/login');
    try {
      await API.post(
        '/enrollments',
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="container">
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p>
          <strong>Category:</strong> {course.category}
        </p>
        <p>
          <strong>Difficulty:</strong> {course.difficulty}
        </p>
        <p>
          <strong>Price:</strong> ${course.price}
        </p>

        {/* Enrollment Button Logic */}
        {user ? (
          isEnrolled() ? (
            <button
              disabled
              style={{
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'not-allowed',
              }}
            >
              ✅ Already Enrolled
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Enroll Now
            </button>
          )
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Login to Enroll
          </button>
        )}

        <h3 style={{ marginTop: '2rem' }}>Lessons</h3>
        {course.lessons.length === 0 ? (
          <p>No lessons available yet.</p>
        ) : (
          <ul>
            {course.lessons.map((lesson) => (
              <li key={lesson.order}>
                {lesson.order}. {lesson.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
