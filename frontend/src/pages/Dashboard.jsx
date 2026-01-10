import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(
    document.body.getAttribute("data-bs-theme") || "light"
  );

  // 🌗 Theme watcher
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-bs-theme") || "light");
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // 📦 Fetch user enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await API.get("/enrollments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(res.data.filter((e) => e.courseId !== null));
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [token]);

  // 🌀 Loading screen
  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading your courses...</p>
      </div>
    );

  // ❌ No enrollments
  if (!enrollments.length)
    return (
      <div className="container py-5 text-center">
        <h4>No enrolled courses yet</h4>
        <p className="text-muted">Enroll in a course to start learning.</p>
      </div>
    );

  // ✅ Dashboard UI
  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-center">
        Welcome back, {user?.name || "Learner"} 👋
      </h2>

      <div className="row g-4">
        {enrollments.map((enroll) => {
          const course = enroll.courseId;
          if (!course) return null;

          const lessons = course.lessons || [];
          const totalLessons = lessons.length;
          const completedLessons = Object.values(enroll.progress || {}).filter(Boolean).length;
          const percentComplete = totalLessons
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

          return (
            <div
              className="col-12 col-sm-6 col-md-6 col-lg-4"
              key={enroll._id}
            >
              <div
                className={`card h-100 shadow-sm border-0 p-3 ${
                  theme === "dark"
                    ? "bg-dark text-light border-secondary"
                    : "bg-white text-dark"
                }`}
                style={{
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="card-text text-muted small">
                  {course.description?.slice(0, 100) || "No description."}
                </p>

                {/* Progress Bar */}
                <p className="mb-1 small fw-semibold">
                  Progress: {completedLessons}/{totalLessons} lessons
                </p>
                <div
                  className="progress mb-3"
                  style={{ height: "8px", borderRadius: "4px" }}
                >
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${percentComplete}%` }}
                    aria-valuenow={percentComplete}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                {/* View Course Button */}
                <button
                  className={`btn w-100 mt-auto fw-semibold ${
                    theme === "dark" ? "btn-outline-light" : "btn-primary"
                  }`}
                  onClick={() => {
                    if (course.slug) navigate(`/courses/${course.slug}`);
                    else alert("Course details unavailable.");
                  }}
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
