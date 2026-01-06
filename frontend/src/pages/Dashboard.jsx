import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEnrollments = async () => {
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

  const handleCompleteLesson = async (enrollId, lessonId) => {
    try {
      await API.put(`/enrollments/${enrollId}/progress`,
        { lessonId, completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrollments(prev =>
        prev.map(enroll => {
          if (enroll._id === enrollId) enroll.progress[lessonId] = true;
          return enroll;
        })
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update progress');
    }
  };

  if (loading) return <p className="container">Loading your courses...</p>;
  if (enrollments.length === 0) return <p className="container">You are not enrolled in any courses yet.</p>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>{user.name}'s Dashboard</h2>
      <div className="course-list">
        {enrollments.map(enroll => {
          const total = enroll.courseId.lessons.length;
          const completed = Object.values(enroll.progress).filter(Boolean).length;

          return (
            <div key={enroll._id} className="course-card">
              <h3>{enroll.courseId.title}</h3>
              <p>{enroll.courseId.description}</p>
              <p>Progress: {completed} / {total} lessons completed</p>
              <ul>
                {enroll.courseId.lessons.map(lesson => (
                  <li key={lesson._id} style={{ marginBottom: '0.5rem' }}>
                    {lesson.order}. {lesson.title}
                    {!enroll.progress[lesson._id] && (
                      <button
                        onClick={() => handleCompleteLesson(enroll._id, lesson._id)}
                        style={{
                          marginLeft: '0.5rem',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Mark Complete
                      </button>
                    )}
                    {enroll.progress[lesson._id] && (
                      <span style={{ marginLeft: '0.5rem', color: 'green' }}>Completed ✅</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
