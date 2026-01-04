import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get('/courses'); // fetch all courses
        const selected = res.data.find(c => c.slug === slug);
        setCourse(selected);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await API.post('/enrollments', { courseId: course._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Enrolled successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="container">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Category: {course.category}</p>
      <p>Difficulty: {course.difficulty}</p>
      <p>Price: ${course.price}</p>
      <button onClick={handleEnroll}>Enroll Now</button>

      <h3>Lessons</h3>
      <ul>
        {course.lessons.map(lesson => (
          <li key={lesson.order}>{lesson.order}. {lesson.title}</li>
        ))}
      </ul>
    </div>
  );
}
