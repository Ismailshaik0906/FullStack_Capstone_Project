import { useEffect, useState } from "react";
import API from "../../../api/api";

const SalarySlip = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [salarySlip, setSalarySlip] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employee profile once to get employeeId
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/employees/me/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmployeeId(res.data.employeeId);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        setError("Failed to fetch employee profile.");
      }
    };
    fetchProfile();
  }, []);

  // Fetch salary slip
  const fetchSalarySlip = async () => {
    if (!employeeId) {
      setError("Employee ID not found. Please re-login.");
      return;
    }

    setLoading(true);
    setError("");
    setSalarySlip(null);

    try {
      const res = await API.get(`/payroll/my/${employeeId}/${year}/${month}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.data) {
        setError("No salary slip found for this month/year.");
      } else {
        setSalarySlip(res.data);
      }
    } catch (err) {
      console.error("Error fetching salary slip:", err.response?.data || err.message);
      setError("No salary slip found for this month/year.");
    } finally {
      setLoading(false);
    }
  };

  // Month options
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container-fluid py-4">
      <h2 className="text-center fw-bold mb-4">💼 My Salary Slip</h2>

      {/* Year & Month Selector */}
      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Year</label>
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">Month</label>
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthNames.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={fetchSalarySlip}
              disabled={loading || !employeeId}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Fetching...
                </span>
              ) : (
                "Get Salary Slip"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Salary Slip Details */}
      {salarySlip && (
        <div className="card shadow-lg p-4">
          <h4 className="mb-4 text-center">
            📑 Payslip for <b>{monthNames[month - 1]} {year}</b>
          </h4>

          <div className="row mb-3">
            <div className="col-md-6">
              <p><b>Employee ID:</b> {salarySlip.employee?.employeeId}</p>
              <p><b>Name:</b> {salarySlip.employee?.firstName} {salarySlip.employee?.lastName}</p>
              <p><b>Department:</b> {salarySlip.employee?.department?.name}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p><b>Pay Date:</b> {new Date(salarySlip.payDate).toLocaleDateString()}</p>
              <p>
                <b>Status:</b>{" "}
                <span className={`badge ${salarySlip.locked ? "bg-success" : "bg-warning"}`}>
                  {salarySlip.locked ? "Finalized ✅" : "Draft ⏳"}
                </span>
              </p>
            </div>
          </div>

          <hr />

          <div className="row text-center">
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <p className="mb-1 fw-bold">Basic Salary</p>
                <h5>₹{salarySlip.basicSalary}</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <p className="mb-1 fw-bold">Bonus</p>
                <h5>₹{salarySlip.bonus}</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <p className="mb-1 fw-bold">Deductions</p>
                <h5 className="text-danger">- ₹{salarySlip.deductions}</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 border rounded bg-light">
                <p className="mb-1 fw-bold">Net Salary</p>
                <h4 className="text-success">₹{salarySlip.netSalary}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySlip;