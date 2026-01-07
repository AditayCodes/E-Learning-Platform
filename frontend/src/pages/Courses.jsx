import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(document.body.getAttribute("data-bs-theme") || "dark");

  // ✅ Watch theme changes (for dark/light mode)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-bs-theme") || "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-bs-theme"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch Courses + Enrollments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
        if (token) {
          const enrollRes = await API.get("/enrollments/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnrollments(enrollRes.data);
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const isEnrolled = (courseId) => enrollments.some((e) => e.courseId._id === courseId);

  const handleEnroll = async (courseId) => {
    if (!token) return navigate("/login");
    try {
      await API.post(
        "/enrollments",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enrolled successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to enroll");
    }
  };

  if (loading) return <div className="container py-5">Loading courses...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">All Courses</h2>

      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={course._id}>
            <div
              className={`card h-100 border-0 shadow-sm ${
                theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"
              }`}
              style={{
                transition: "all 0.3s ease",
                borderRadius: "10px",
              }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="card-text flex-grow-1 text-truncate" style={{ maxHeight: "60px" }}>
                  {course.description}
                </p>

                <div className="d-flex flex-wrap mb-2">
                  <span className="badge bg-secondary me-1 mb-1">{course.category}</span>
                  <span className="badge bg-info text-dark mb-1">{course.difficulty}</span>
                </div>

                <p className="mb-2 fw-semibold">💲 {course.price}</p>

                {/* ✅ Buttons Section */}
                <div className="mt-auto d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  >
                    View Details
                  </button>

                  {user ? (
                    isEnrolled(course._id) ? (
                      <button className="btn btn-success w-100" disabled>
                        ✅ Already Enrolled
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleEnroll(course._id)}
                      >
                        Enroll Now
                      </button>
                    )
                  ) : (
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => navigate("/login")}
                    >
                      Login to Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
