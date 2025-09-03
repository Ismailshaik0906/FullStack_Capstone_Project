import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");

    if (!token || role !== "ADMIN") {
      navigate("/login");
    } else {
      setUsername(storedUsername || "Admin");
    }
  }, [navigate]);

  return (
    <div className="container-fluid p-0">
      {/* Dashboard Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "white",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="lead mb-3">
          Manage employees, payroll, leaves, reports, users, departments, and jobs
        </p>

        {/* Show Username Only */}
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fw-bold fs-5">
            <i className="bi bi-person-circle me-2"></i>
            {username}
          </span>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="container mt-5">
        <div className="row g-4">
          {/* Employees */}
          <div className="col-md-4">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Employees</h5>
              <p>View, add, and manage employees</p>
              <button
                className="btn btn-primary w-100 fw-bold"
                onClick={() => navigate("/admin/employees")}
              >
                Manage Employees
              </button>
            </div>
          </div>

          {/* Payroll */}
          <div className="col-md-4">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Payroll</h5>
              <p>Handle salaries, deductions, and bonuses</p>
              <button
                className="btn btn-success w-100 fw-bold"
                onClick={() => navigate("/admin/payroll")}
              >
                Manage Payroll
              </button>
            </div>
          </div>

          {/* Leave Approvals */}
          <div className="col-md-4">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Leave Approvals</h5>
              <p>Review and approve employee leave requests</p>
              <button
                className="btn btn-warning w-100 fw-bold"
                onClick={() => navigate("/admin/leave")}
              >
                Approve Leaves
              </button>
            </div>
          </div>

          {/* Reports */}
          <div className="col-md-4">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Reports</h5>
              <p>Generate payroll and leave reports</p>
              <button
                className="btn btn-info w-100 fw-bold"
                onClick={() => navigate("/admin/reports")}
              >
                View Reports
              </button>
            </div>
          </div>

          {/* Users */}
          <div className="col-md-4">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Users</h5>
              <p>Manage user accounts and roles</p>
              <button
                className="btn btn-dark w-100 fw-bold"
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </button>
            </div>
          </div>

          {/* Departments */}
          <div className="col-md-4">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Departments</h5>
              <p>Manage company departments</p>
              <button
                className="btn w-100 fw-bold"
                style={{ backgroundColor: "#c75717d5", color: "white" }}
                onClick={() => navigate("/admin/departments")}
              >
                Manage Departments
              </button>
            </div>
          </div>

          {/* Jobs */}
          <div className="col-md-6">
            <div className="card text-center shadow p-4 h-100 rounded-4">
              <h5 className="fw-bold">Jobs</h5>
              <p>Define job roles and positions</p>
              <button
                className="btn w-100 fw-bold"
                style={{ backgroundColor: "#6f42c1", color: "white" }}
                onClick={() => navigate("/admin/jobs")}
              >
                Manage Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;