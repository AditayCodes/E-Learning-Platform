import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses
        const courseRes = await API.get("/courses");
        console.log("Courses fetched:", courseRes.data);
        setCourses(courseRes.data);

        // Fetch user's enrollments if logged in
        if (token) {
          const enrollRes = await API.get("/enrollments/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Enrollments fetched:", enrollRes.data);
          setEnrollments(enrollRes.data);
        }
      } catch (err) {
        console.error("Backend connection error:", err);
        setError(
          "Unable to connect to the server. Please check your backend is running and CORS is enabled."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const isEnrolled = (courseId) =>
    enrollments.some((e) => e.courseId?._id === courseId);

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
      console.error("Enroll error:", err);
      alert(
        "Failed to enroll: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // 🌀 Loading
  if (loading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading courses...</p>
      </div>
    );

  // ❌ Backend or network error
  if (error)
    return (
      <div className="container py-5 text-center">
        <h5 className="text-danger">{error}</h5>
        <p className="text-muted">
          Try restarting your backend server or check your API base URL.
        </p>
      </div>
    );

  // 🕳️ No courses
  if (!courses.length)
    return (
      <div className="container py-5 text-center">
        <h4>No courses found</h4>
        <p className="text-muted">
          Add new courses from the Admin Panel to see them here.
        </p>
      </div>
    );

  // ✅ Courses list
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-dark">All Courses</h2>
      <div className="row g-4">
        {courses.map((course) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4" key={course._id}>
            <div
              className="card h-100 shadow-sm border-0 bg-white"
              style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">
                  {course.title || "Untitled Course"}
                </h5>
                <p className="card-text flex-grow-1">
                  {course.description || "No description available."}
                </p>

                <div className="d-flex flex-wrap mb-2">
                  {course.category && (
                    <span className="badge bg-secondary me-1 mb-1">
                      {course.category}
                    </span>
                  )}
                  {course.difficulty && (
                    <span className="badge bg-info text-dark mb-1">
                      {course.difficulty}
                    </span>
                  )}
                </div>

                {course.price !== undefined && (
                  <p className="mb-3 fw-bold">Price: ${course.price}</p>
                )}

                {user ? (
                  isEnrolled(course._id) ? (
                    <button className="btn btn-success w-100 shadow-sm">
                      Already Enrolled
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary w-100 shadow-sm"
                      style={{ transition: "transform 0.2s" }}
                      onMouseEnter={(e) =>
                        window.innerWidth > 768 &&
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        window.innerWidth > 768 &&
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll Now
                    </button>
                  )
                ) : (
                  <button
                    className="btn btn-secondary w-100 shadow-sm"
                    style={{ transition: "transform 0.2s" }}
                    onMouseEnter={(e) =>
                      window.innerWidth > 768 &&
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      window.innerWidth > 768 &&
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => navigate("/login")}
                  >
                    Login to Enroll
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
