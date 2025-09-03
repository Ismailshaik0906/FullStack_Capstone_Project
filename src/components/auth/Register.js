import { useState } from "react";
import API from "../../api/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error when typing
  };


  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return; 

    setLoading(true);
    try {
      await API.post("/auth/register", {
        ...formData,
        role: "EMPLOYEE",
      });
      navigate("/login");
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body">
              <h2 className="card-title text-center mb-4 fw-bold">
                <i className="bi bi-person-plus-fill me-2"></i> Employee Registration
              </h2>

              {apiError && (
                <div className="alert alert-danger text-center" role="alert">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person me-2"></i> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-envelope-at me-2"></i> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-2"></i> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-success w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <i className="spinner-border spinner-border-sm me-2"></i>
                      Registering...
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-person-check-fill me-2"></i> Register
                    </span>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-decoration-none">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;