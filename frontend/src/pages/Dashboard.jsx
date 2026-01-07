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
          const percent = total ? Math.round((completed / total) * 100) : 0;

          return (
            <div className="col-12 col-sm-6 col-md-6 col-lg-4" key={enroll._id}>
              <div className="card h-100 shadow-sm border-0 bg-white"
                   style={{transition:"transform 0.3s, box-shadow 0.3s"}}
                   onMouseEnter={e=>{if(window.innerWidth>768){e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 10px 25px rgba(0,0,0,0.15)";}}}
                   onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 10px rgba(0,0,0,0.1)";}}>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{enroll.courseId.title}</h5>
                  <p className="card-text flex-grow-1">{enroll.courseId.description}</p>
                  <p className="mb-2">Progress: {completed}/{total} lessons</p>
                  <div className="progress mb-2">
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{width: `${percent}%`}} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">{percent}%</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
