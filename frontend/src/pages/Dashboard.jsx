import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await API.get("/enrollments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(res.data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [token]);

  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading your courses...</p>
      </div>
    );

  if (!enrollments.length)
    return (
      <div className="container py-5 text-center">
        <h4>No enrolled courses yet</h4>
        <p className="text-muted">
          Enroll in a course to track your progress.
        </p>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="mb-4">{user.name}'s Dashboard</h2>
      <div className="row g-4">
        {enrollments.map((enroll) => {
          const lessons = enroll.courseId.lessons || [];
          const totalLessons = lessons.length;
          const completedLessons = Object.values(enroll.progress || {}).filter(Boolean).length;
          const percentComplete = totalLessons
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

          return (
            <div className="col-12 col-sm-6 col-md-6 col-lg-4" key={enroll._id}>
              <div className="card h-100 shadow-sm border-0 bg-white p-3">
                <h5 className="card-title fw-bold">{enroll.courseId.title}</h5>
                <p className="card-text text-muted">{enroll.courseId.description}</p>

                <p className="mb-1">
                  Progress: {completedLessons}/{totalLessons} lessons
                </p>
                <div className="progress mb-2">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar"
                    style={{ width: `${percentComplete}%` }}
                    aria-valuenow={percentComplete}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {percentComplete}%
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={() =>
                    window.location.href = `/courses/${enroll.courseId.slug}`
                  }
                >
                  View Course
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
