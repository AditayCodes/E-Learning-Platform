import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="container">
      <h2>All Courses</h2>
      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Category: {course.category}</p>
            <p>Difficulty: {course.difficulty}</p>
            <Link to={`/courses/${course.slug}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
