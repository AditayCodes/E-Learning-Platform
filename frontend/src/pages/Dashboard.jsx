import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user info & token from localStorage
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

  // Function to mark lesson complete
  const handleCompleteLesson = async (enrollId, lessonId) => {
    try {
      await API.put(
        `/enrollments/${enrollId}/progress`,
        { lessonId, completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state for immediate UI feedback
      setEnrollments(prev =>
        prev.map(enroll => {
          if (enroll._id === enrollId) {
            enroll.progress[lessonId] = true;
          }
          return enroll;
        })
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update progress');
    }
  };

  if (loading) return <p>Loading your courses...</p>;
  if (enrollments.length === 0)
    return <p>You are not enrolled in any courses yet.</p>;

  return (
    <div className="container">
      <h2>{user.name}'s Dashboard</h2>

      {enrollments.map(enroll => {
        const totalLessons = enroll.courseId.lessons.length;
        const completedLessons = Object.values(enroll.progress).filter(Boolean)
          .length;

        return (
          <div key={enroll._id} className="course-card" style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
            <h3>{enroll.courseId.title}</h3>
            <p>{enroll.courseId.description}</p>
            <p>Progress: {completedLessons} / {totalLessons} lessons completed</p>

            <ul>
              {enroll.courseId.lessons.map(lesson => (
                <li key={lesson._id} style={{ marginBottom: '0.5rem' }}>
                  {lesson.order}. {lesson.title} - 
                  <button
                    onClick={() => handleCompleteLesson(enroll._id, lesson._id)}
                    disabled={enroll.progress[lesson._id]}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.2rem 0.5rem',
                      cursor: enroll.progress[lesson._id] ? 'not-allowed' : 'pointer',
                      backgroundColor: enroll.progress[lesson._id] ? 'green' : 'lightgray',
                      color: enroll.progress[lesson._id] ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                  >
                    {enroll.progress[lesson._id] ? 'Completed ✅' : 'Mark Complete'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
