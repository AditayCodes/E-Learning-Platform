import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch course by slug
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get("/courses");
        const selected = res.data.find((c) => c.slug === slug);
        setCourse(selected || null);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  // ✅ Fetch user enrollments (if logged in)
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!token) return;
      try {
        const res = await API.get("/enrollments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(res.data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      }
    };
    fetchEnrollments();
  }, [token]);

  // ✅ Check if already enrolled
  const isEnrolled = () => {
    if (!user || !course) return false;
    return enrollments.some((enroll) => enroll.courseId._id === course._id);
  };

  // ✅ Enroll user
  const handleEnroll = async () => {
    if (!token) return navigate("/login");
    try {
      await API.post(
        "/enrollments",
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enrolled successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  // 🌀 Loading state
  if (loading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading course...</p>
      </div>
    );

  // ❌ Course not found
  if (!course)
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">Course not found</h4>
        <p className="text-muted">The requested course does not exist.</p>
      </div>
    );

  // ✅ Main layout
  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4">
        <div className="card-body">
          <h2 className="fw-bold mb-3">{course.title}</h2>
          <p className="text-muted mb-4">{course.description}</p>

          <div className="d-flex flex-wrap mb-3">
            {course.category && (
              <span className="badge bg-secondary me-2 mb-2">
                {course.category}
              </span>
            )}
            {course.difficulty && (
              <span className="badge bg-info text-dark mb-2">
                {course.difficulty}
              </span>
            )}
          </div>

          <p className="fw-bold fs-5 mb-4">Price: ${course.price}</p>

          {/* Enrollment Button */}
          {user ? (
            isEnrolled() ? (
              <button
                className="btn btn-success btn-lg w-100 w-md-auto"
                disabled
              >
                ✅ Already Enrolled
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg w-100 w-md-auto"
                onClick={handleEnroll}
              >
                Enroll Now
              </button>
            )
          ) : (
            <button
              className="btn btn-secondary btn-lg w-100 w-md-auto"
              onClick={() => navigate("/login")}
            >
              Login to Enroll
            </button>
          )}
        </div>
      </div>

      {/* Lessons Section */}
      <div className="mt-5">
        <h4 className="fw-bold mb-3">Lessons</h4>
        {course.lessons?.length ? (
          <ul className="list-group list-group-flush">
            {course.lessons.map((lesson) => (
              <li className="list-group-item" key={lesson.order}>
                <strong>Lesson {lesson.order}:</strong>{" "}
                {lesson.title || "Untitled"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No lessons available yet.</p>
        )}
      </div>
    </div>
  );
}
