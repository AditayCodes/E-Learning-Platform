import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(document.body.getAttribute("data-bs-theme") || "dark");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Theme listener
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-bs-theme") || "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-bs-theme"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Fetch course + enrollment
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await API.get("/courses");
        const selected = courseRes.data.find((c) => c.slug === slug);
        setCourse(selected || null);

        if (token && selected) {
          const enrollRes = await API.get("/enrollments/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const found = enrollRes.data.find((e) => e.courseId._id === selected._id);
          setEnrollment(found || null);
        }
      } catch (err) {
        console.error("Error fetching course detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, token]);

  // ✅ Enroll user
  const handleEnroll = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await API.post(
        "/enrollments",
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enrolled successfully!");
      setEnrollment(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  // ✅ Toggle lesson progress
  const toggleLessonProgress = async (lessonIndex) => {
    if (!enrollment) return;
    const lessonId = `lesson_${lessonIndex + 1}`;
    const current = enrollment.progress?.[lessonId] || false;

    try {
      const res = await API.put(
        `/enrollments/${enrollment._id}/progress`,
        { lessonId, completed: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrollment(res.data.enrollment);
    } catch (err) {
      console.error("Error updating progress:", err);
      alert("Failed to update progress");
    }
  };

  if (loading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading course...</p>
      </div>
    );

  if (!course)
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">Course not found</h4>
        <p className="text-muted">The requested course does not exist.</p>
      </div>
    );

  const progress =
    enrollment && course.lessons?.length
      ? Math.round(
          (Object.values(enrollment.progress || {}).filter(Boolean).length /
            course.lessons.length) *
            100
        )
      : 0;

  return (
    <div className="container py-4">
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <button
          className={`btn ${
            theme === "dark" ? "btn-outline-light" : "btn-outline-dark"
          } d-flex align-items-center gap-2`}
          onClick={() => navigate("/courses")}
        >
          <i className="bi bi-arrow-left"></i> Back to Courses
        </button>
      </div>

      {/* 🧩 Two-column layout */}
      <div className="row g-4">
        {/* Left Column - Course Content */}
        <div className="col-lg-8 col-md-12">
          <div
            className={`card shadow-sm border-0 p-4 mb-4 ${
              theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"
            }`}
          >
            <h2 className="fw-bold mb-3">{course.title}</h2>
            <p className="mb-3">{course.description}</p>

            <div className="d-flex flex-wrap mb-3 gap-2">
              <span className="badge bg-secondary">{course.category}</span>
              <span className="badge bg-info text-dark">{course.difficulty}</span>
              <span className="badge bg-primary">
                ⏱️ {course.duration || `${course.lessons.length} lessons`}
              </span>
            </div>

            <p className="fw-semibold mb-3">
              👨‍🏫 Instructor: {course.instructor || "E-Learning Academy"}
            </p>

            {/* Progress */}
            {enrollment && (
              <>
                <p className="fw-semibold mb-1">
                  Progress: {progress}% (
                  {Object.values(enrollment.progress || {}).filter(Boolean).length}/
                  {course.lessons.length} lessons)
                </p>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </>
            )}
          </div>

          {/* Lessons List */}
          <div
            className={`card shadow-sm border-0 p-4 ${
              theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"
            }`}
          >
            <h4 className="fw-bold mb-3">Lessons</h4>
            {course.lessons?.length ? (
              <ul className="list-group list-group-flush">
                {course.lessons.map((lesson, index) => {
                  const lessonId = `lesson_${index + 1}`;
                  const completed = enrollment?.progress?.[lessonId] || false;

                  return (
                    <li
                      key={lesson.order || index}
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        theme === "dark" ? "bg-dark text-light border-secondary" : ""
                      }`}
                    >
                      <div>
                        <strong>Lesson {index + 1}:</strong> {lesson.title}
                      </div>
                      {enrollment && (
                        <button
                          className={`btn btn-sm ${
                            completed ? "btn-success" : "btn-outline-success"
                          }`}
                          onClick={() => toggleLessonProgress(index)}
                        >
                          {completed ? "Completed ✅" : "Mark Complete"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted">No lessons available yet.</p>
            )}
          </div>
        </div>

        {/* Right Column - Summary Sidebar */}
        <div className="col-lg-4 col-md-12">
          <div
            className={`card shadow-sm border-0 p-4 sticky-top ${
              theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"
            }`}
            style={{ top: "90px" }}
          >
            <h4 className="fw-bold mb-3">Course Summary</h4>
            <ul className="list-unstyled mb-4">
              <li className="mb-2">
                <strong>💲 Price:</strong> ${course.price}
              </li>
              <li className="mb-2">
                <strong>📘 Category:</strong> {course.category}
              </li>
              <li className="mb-2">
                <strong>📈 Difficulty:</strong> {course.difficulty}
              </li>
              <li className="mb-2">
                <strong>⏱️ Duration:</strong> {course.duration || "Self-paced"}
              </li>
              <li className="mb-2">
                <strong>👨‍🏫 Instructor:</strong> {course.instructor || "E-Learning Academy"}
              </li>
            </ul>

            {/* Enroll Button */}
            {user ? (
              enrollment ? (
                <button className="btn btn-success w-100" disabled>
                  ✅ Already Enrolled
                </button>
              ) : (
                <button className="btn btn-primary w-100" onClick={handleEnroll}>
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
  );
}
