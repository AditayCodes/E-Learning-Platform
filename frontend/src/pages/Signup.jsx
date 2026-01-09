import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = document.body.getAttribute("data-bs-theme") || "light";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/signup", { name, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100`}
         style={{ backgroundColor: theme === "dark" ? "#f4f4f4" : "#f0f2f5" }}>
      <motion.div
        className={`card p-5 shadow-lg border-0 ${theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"}`}
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center fw-bold mb-4">Sign Up</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSignup} className="d-flex flex-column gap-3">

          {/* Name Input */}
          <div className="form-floating position-relative">
            <input
              type="text"
              className="form-control ps-5"
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="name">Full Name</label>
          </div>

          {/* Email Input */}
          <div className="form-floating position-relative">
            <input
              type="email"
              className="form-control ps-5"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email address</label>
          </div>

          {/* Password Input */}
          <div className="form-floating position-relative">
            <input
              type="password"
              className="form-control ps-5"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary w-100 shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-3 text-center text-muted">
          Already have an account?{" "}
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
