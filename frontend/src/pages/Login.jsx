import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = document.body.getAttribute("data-bs-theme") || "light";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <h2 className="text-center fw-bold mb-4">Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">

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
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-3 text-center text-muted">
          Don’t have an account?{" "}
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
