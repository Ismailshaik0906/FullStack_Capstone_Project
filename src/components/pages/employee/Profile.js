import { useEffect, useState } from "react";
import API from "../../../api/api";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/employees/me/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setEmployee(res.data);

        if (res.data.employeeId) {
          localStorage.setItem("employeeId", res.data.employeeId);
        }
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3">Loading Profile...</h5>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">No profile data found.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Profile Header */}
      <div
        className="p-4 mb-4 rounded text-white shadow text-center"
        style={{
          background: "linear-gradient(135deg, #4e73df, #224abe)",
        }}
      >
        <h2 className="fw-bold">👤 My Profile</h2>
        <p className="mb-0">Manage and review your personal and job details</p>
      </div>

      <div className="row g-4">
        {/* Personal Info */}
        <div className="col-md-6">
          <div className="card shadow h-100 border-0">
            <div className="card-body">
              <h4 className="text-primary fw-bold mb-3">📌 Personal Information</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Employee ID:</b> {employee.employeeId}
                </li>
                <li className="list-group-item">
                  <b>First Name:</b> {employee.firstName}
                </li>
                <li className="list-group-item">
                  <b>Last Name:</b> {employee.lastName}
                </li>
                <li className="list-group-item">
                  <b>Date of Birth:</b> {employee.dob}
                </li>
                <li className="list-group-item">
                  <b>Phone:</b> {employee.phone}
                </li>
                <li className="list-group-item">
                  <b>Address:</b> {employee.address}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="col-md-6">
          <div className="card shadow h-100 border-0">
            <div className="card-body">
              <h4 className="text-success fw-bold mb-3">💼 Job Information</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Department:</b>{" "}
                  <span className="badge bg-primary">
                    {employee.department?.name || "N/A"}
                  </span>
                </li>
                <li className="list-group-item">
                  <b>Job Title:</b>{" "}
                  <span className="badge bg-success">
                    {employee.job?.title || "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="col-md-12">
          <div className="card shadow border-0 mt-3">
            <div className="card-body">
              <h4 className="text-info fw-bold mb-3">🔐 Account Information</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Username:</b> {employee.user?.username}
                </li>
                <li className="list-group-item">
                  <b>Email:</b> {employee.user?.email}
                </li>
                <li className="list-group-item">
                  <b>Role:</b>{" "}
                  <span className="badge bg-dark">{employee.user?.role}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;