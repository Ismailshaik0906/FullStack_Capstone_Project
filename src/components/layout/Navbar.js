import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username"); //

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username"); // clear username too
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(60deg, #2575fc, #6a11cb)",
        fontWeight: "bold",
        paddingTop: "0.8rem",
        paddingBottom: "0.8rem",
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            fontSize: "1.3rem",
          }}
        >
          <i className="bi bi-cash-coin me-2"></i> Payroll System
        </Link>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {token && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/employees">
                    <i className="bi bi-people me-1"></i> Employees
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    <i className="bi bi-person-gear me-1"></i> Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/departments">
                    <i className="bi bi-building me-1"></i> Departments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/jobs">
                    <i className="bi bi-briefcase me-1"></i> Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/payroll">
                    <i className="bi bi-cash me-1"></i> Payroll
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/leave">
                    <i className="bi bi-calendar-check me-1"></i> Leave Approvals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/reports">
                    <i className="bi bi-bar-chart-line me-1"></i> Reports
                  </Link>
                </li>
              </>
            )}

            {token && role === "EMPLOYEE" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee">
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/profile">
                    <i className="bi bi-person-circle me-1"></i> Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/leave">
                    <i className="bi bi-calendar-event me-1"></i> My Leave
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employee/salary">
                    <i className="bi bi-file-earmark-text me-1"></i> Salary Slip
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-3">
            {!token && (
              <Link className="btn btn-info btn-sm fw-bold" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            )}

            {token ? (
              <>
                {/* 👇 Username Display */}
                <span className="text-white fw-bold d-flex align-items-center">
                  <i className="bi bi-person-circle me-1"></i>
                  {username || "User"}
                </span>
                <button
                  className="btn btn-outline-light btn-sm fw-bold"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-warning btn-sm fw-bold" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link className="btn btn-success btn-sm fw-bold" to="/register">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;