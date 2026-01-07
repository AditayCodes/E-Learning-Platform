import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100 bg-primary text-white p-4">
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">Learn Anything, Anytime</h1>
        <p className="lead mb-4">
          Join thousands of learners and access professional online courses. Track your progress, learn new skills, and grow your career.
        </p>
        {user ? (
          <button className="btn btn-light btn-lg" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        ) : (
          <button className="btn btn-light btn-lg" onClick={() => navigate("/signup")}>Start Learning</button>
        )}
      </div>
    </div>
  );
}
