import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEnrollments = async () => {
      const res = await API.get('/enrollments/me', { headers: { Authorization: `Bearer ${token}` } });
      setEnrollments(res.data);
      setLoading(false);
    };
    fetchEnrollments();
  }, [token]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!enrollments.length) return <div className="container py-5">No enrolled courses yet.</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">{user.name}'s Dashboard</h2>
      <div className="row g-4">
        {enrollments.map(enroll => {
          const total = enroll.courseId.lessons.length;
          const completed = Object.values(enroll.progress).filter(Boolean).length;
          return (
            <div className="col-lg-4 col-md-6" key={enroll._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{enroll.courseId.title}</h5>
                  <p className="card-text flex-grow-1">{enroll.courseId.description}</p>
                  <p>Progress: {completed}/{total} lessons</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
