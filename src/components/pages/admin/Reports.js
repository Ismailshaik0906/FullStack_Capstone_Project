import { useEffect, useState } from "react";
import API from "../../../api/api";

const Reports = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [deptCost, setDeptCost] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err.response?.data || err.message);
    }
  };

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leaves/pending");
      setLeaves(res.data || []);
    } catch (err) {
      console.error("Error fetching pending leaves:", err.response?.data || err.message);
    }
  };

  // Fetch payroll summary
  const fetchPayrollSummary = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/reports/payroll-summary?year=${year}&month=${month}`);
      setPayrolls(res.data || []);
    } catch (err) {
      console.error("Error fetching payroll summary:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch department-wise cost
  const fetchDeptCost = async () => {
    try {
      const res = await API.get(`/reports/department-cost?year=${year}&month=${month}`);
      setDeptCost(res.data || {});
    } catch (err) {
      console.error("Error fetching department cost:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchPayrollSummary();
    fetchDeptCost();
  }, [year, month]);

  // Derived values
  const totalEmployees = employees.length;
  const pendingLeaves = leaves.filter((l) => l.status === "PENDING").length;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-center">📊 Reports Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-4 text-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 p-4 bg-primary text-white rounded-3">
            <h5>Total Employees</h5>
            <h2>{totalEmployees}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-lg border-0 p-4 bg-warning text-dark rounded-3">
            <h5>Pending Leaves</h5>
            <h2>{pendingLeaves}</h2>
          </div>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="card p-4 shadow mt-5 rounded-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-semibold">💰 Payroll Summary – {month}/{year}</h4>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control border-dark"
              style={{ width: "100px" }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <input
              type="number"
              className="form-control border-dark"
              style={{ width: "80px" }}
              value={month}
              min="1"
              max="12"
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading payroll...</p>
        ) : (
          <table className="table table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Employee</th>
                <th>Year</th>
                <th>Month</th>
                <th>Net Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.length > 0 ? (
                payrolls.map((p) => (
                  <tr key={p.payrollId}>
                    <td>{p.employee?.firstName} {p.employee?.lastName}</td>
                    <td>{p.year}</td>
                    <td>{p.month}</td>
                    <td><strong>₹{p.netSalary}</strong></td>
                    <td>
                      <span className={`badge px-3 py-2 ${p.locked ? "bg-success" : "bg-secondary"}`}>
                        {p.locked ? "✅ Finalized" : "📝 Draft"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Department Cost */}
      <div className="card p-4 shadow mt-5 rounded-3">
        <h4 className="fw-semibold mb-3">🏢 Department-wise Cost – {month}/{year}</h4>
        {Object.keys(deptCost).length > 0 ? (
          <div className="row g-4">
            {Object.entries(deptCost).map(([dept, cost]) => (
              <div className="col-md-4" key={dept}>
                <div className="card p-3 shadow-sm text-center border-0 bg-light rounded-3">
                  <h6 className="fw-bold">{dept}</h6>
                  <h5 className="text-success fw-semibold">₹{cost.toFixed(2)}</h5>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No department cost data available</p>
        )}
      </div>
    </div>
  );
};

export default Reports;