import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Validation function
  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");


    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("userId", res.data.user.userId);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("role", res.data.user.role);

        if (res.data.user.role === "ADMIN") {
          navigate("/admin");
        } else if (res.data.user.role === "EMPLOYEE") {
          navigate("/employee");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid email or password";
        
      setError(errorMessage);
      console.error("Login error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 fw-bold">
                <i className="bi bi-person-lock me-2"></i> Login
              </h2>

              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope-at me-2"></i> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-2"></i> Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <i className="spinner-border spinner-border-sm me-2"></i>
                      Logging in...
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-box-arrow-in-right me-2"></i> Login
                    </span>
                  )}
                </button>
              </form>

              <p className="text-center mt-3">
                Don’t have an account?{" "}
                <Link to="/register" className="fw-bold text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;