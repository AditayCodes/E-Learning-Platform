import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    lessons: 0,
    instructors: 0,
  });
  const [currentQuote, setCurrentQuote] = useState(0);
  const token = localStorage.getItem("token");
  const [theme, setTheme] = useState(
    document.body.getAttribute("data-bs-theme") || "light"
  );

  // 👤 Load user
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token]);

  // 🎨 Watch theme changes
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

  // 📊 Fetch courses + stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data.slice(0, 4));
        const totalStudents = 1200;
        const totalCourses = res.data.length;
        const totalLessons = res.data.reduce(
          (sum, c) => sum + (c.lessons?.length || 0),
          0
        );
        const totalInstructors = 5;
        setStats({
          students: totalStudents,
          courses: totalCourses,
          lessons: totalLessons,
          instructors: totalInstructors,
        });
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchData();
  }, []);

  // 💬 Quotes (auto-change every 4s)
  const quotes = [
    "“Education is not the learning of facts, but the training of the mind to think.” – Albert Einstein",
    "“The expert in anything was once a beginner.” – Helen Hayes",
    "“Push yourself, because no one else is going to do it for you.”",
    "“The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.” – Brian Herbert",
    "“Learning never exhausts the mind.” – Leonardo da Vinci",
    "“Success is the sum of small efforts, repeated day in and day out.” – Robert Collier",
    "“Develop a passion for learning. If you do, you will never cease to grow.” – Anthony J. D’Angelo",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const linkedin = "https://www.linkedin.com/in/aditay-sharma/";
  const github = "https://github.com/AditayCodes";
  const email = "support@elearning.com";

  return (
    <div
      className={`${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      {/* 🌟 Hero Section with Animated Gradient */}
      <motion.div
        className="d-flex flex-column justify-content-center align-items-center text-center vh-100 px-3 text-white"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 🌈 Animated gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "200%",
            height: "100%",
            background:
              theme === "dark"
                ? "linear-gradient(270deg, #0d6efd, #6610f2, #0dcaf0, #0d6efd)"
                : "linear-gradient(270deg, #0d6efd, #007bff, #00bfff, #0d6efd)",
            backgroundSize: "800% 100%",
            animation: "heroGradient 20s ease infinite",
            zIndex: 0,
          }}
        ></div>

        {/* Hero Content */}
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-5 fw-bold mb-3">Learn Anything, Anytime 🚀</h1>
          <p className="lead mb-4">
            Access professional online courses. Track your progress, learn new
            skills, and grow your career.
          </p>

          {user ? (
            <button
              className="btn btn-light shadow-sm px-4 py-2"
              style={{ fontSize: "1rem" }}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              className="btn btn-light shadow-sm px-4 py-2"
              style={{ fontSize: "1rem" }}
              onClick={() => navigate("/signup")}
            >
              Start Learning
            </button>
          )}
        </div>

        <style>
          {`
            @keyframes heroGradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
      </motion.div>

      {/* 💬 Animated Gradient Motivational Quotes */}
      <motion.section
        className="py-5 text-center"
        style={{ position: "relative", overflow: "hidden", minHeight: "120px" }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "200%",
            height: "100%",
            background:
              theme === "dark"
                ? "linear-gradient(270deg, #343a40, #495057, #343a40)"
                : "linear-gradient(270deg, #007bff, #00bfff, #007bff)",
            backgroundSize: "600% 100%",
            animation: "gradientShift 15s ease infinite",
            zIndex: 0,
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.h4
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="fw-semibold fst-italic"
            >
              {quotes[currentQuote]}
            </motion.h4>
          </AnimatePresence>
        </div>

        <style>
          {`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>
      </motion.section>

      {/* 📊 Platform Stats */}
      <section
        className={`py-5 ${
          theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Platform Statistics</h2>
          <div className="row text-center g-4">
            {Object.entries(stats).map(([key, value], index) => (
              <motion.div
                key={key}
                className="col-6 col-md-3"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="fw-bold">{value}</h3>
                <p className="text-capitalize">{key}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📚 Popular Courses */}
      <motion.section
        className={`py-5 ${
          theme === "dark" ? "bg-secondary text-light" : "bg-light text-dark"
        }`}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Popular Courses</h2>
          <div className="row g-4">
            {courses.length ? (
              courses.map((course) => (
                <motion.div
                  key={course._id}
                  className="col-12 col-sm-6 col-md-6 col-lg-3"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div
                    className={`card h-100 shadow-sm border-0 p-3 ${
                      theme === "dark"
                        ? "bg-dark text-light"
                        : "bg-white text-dark"
                    }`}
                  >
                    <h5 className="card-title fw-bold">{course.title}</h5>
                    <p
                      className="card-text text-truncate"
                      style={{ maxHeight: "60px" }}
                    >
                      {course.description}
                    </p>
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      <span className="badge bg-secondary">{course.category}</span>
                      <span className="badge bg-info text-dark">{course.difficulty}</span>
                    </div>
                    <p className="fw-semibold mb-2">💲 {course.price}</p>
                    <button
                      className={`btn w-100 ${
                        theme === "dark" ? "btn-outline-light" : "btn-primary"
                      }`}
                      onClick={() => navigate(`/courses/${course.slug}`)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center">No courses available yet.</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* 💬 Contact Section */}
<motion.section
  id="contact"
  className="py-5"
  style={{
    background:
      theme === "dark"
        ? "linear-gradient(135deg, #343a40, #212529)"
        : "linear-gradient(135deg, #007bff, #0056d6)",
    color: theme === "dark" ? "#f8f9fa" : "white",
  }}
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  viewport={{ once: true }}
>
  <div className="container d-flex justify-content-center">
    <motion.div
      className={`card p-4 shadow-lg border-0 ${
        theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"
      }`}
      style={{ maxWidth: "500px", width: "100%", borderRadius: "12px" }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="fw-bold mb-3 text-center">Contact Me</h3>
      <p className="text-center mb-3">
        Have a question or feedback? Let’s connect!
      </p>
      <div className="d-flex justify-content-center gap-3 mb-3">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`fs-4 ${theme === "dark" ? "text-light" : "text-primary"}`}
        >
          <i className="bi bi-linkedin"></i>
        </a>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={`fs-4 ${theme === "dark" ? "text-light" : "text-dark"}`}
        >
          <i className="bi bi-github"></i>
        </a>
        <a
          href={`mailto:${email}`}
          className={`fs-4 ${theme === "dark" ? "text-light" : "text-dark"}`}
        >
          <i className="bi bi-envelope-fill"></i>
        </a>
      </div>
      <p className="text-center mb-0">
        Made with ❤️ by{" "}
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-decoration-underline fw-semibold ${
            theme === "dark" ? "text-light" : "text-primary"
          }`}
        >
          Aditay Sharma
        </a>
      </p>
    </motion.div>
  </div>
</motion.section>

    </div>
  );
}
