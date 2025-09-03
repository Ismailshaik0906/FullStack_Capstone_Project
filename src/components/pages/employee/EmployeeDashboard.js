import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "EMPLOYEE") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container-fluid px-4 mt-4">
      {/* Header */}
      <div className="p-4 mb-4 text-white rounded shadow"
        style={{
          background: "linear-gradient(135deg, #4e73df, #224abe)",
        }}
      >
        <h2 className="fw-bold">👋 Welcome to Your Employee Dashboard</h2>
        <p className="mb-0">
          Manage your profile, apply for leaves, and check your salary slips easily.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4">
        {/* Profile */}
        <div className="col-md-4">
          <div className="card shadow h-100 text-center border-0"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold">Profile</h5>
                <p className="text-muted">View and update your personal information</p>
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/employee/profile")}
              >
                👤 Go to Profile
              </button>
            </div>
          </div>
        </div>

        {/* Leaves */}
        <div className="col-md-4">
          <div className="card shadow h-100 text-center border-0"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold">Leaves</h5>
                <p className="text-muted">Apply for leave and track leave status</p>
              </div>
              <button
                className="btn btn-success mt-3"
                onClick={() => navigate("/employee/leave")}
              >
                📝 Manage Leaves
              </button>
            </div>
          </div>
        </div>

        {/* Salary Slip */}
        <div className="col-md-4">
          <div className="card shadow h-100 text-center border-0"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold">Salary Slip</h5>
                <p className="text-muted">View and download your monthly salary slip</p>
              </div>
              <button
                className="btn btn-warning mt-3 text-white"
                onClick={() => navigate("/employee/salary")}
              >
                💰 View Salary Slip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;