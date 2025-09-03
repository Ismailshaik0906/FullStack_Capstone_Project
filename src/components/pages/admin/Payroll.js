import { useEffect, useState } from "react";
import API from "../../../api/api";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingPayroll, setEditingPayroll] = useState(null);

  const [newPayroll, setNewPayroll] = useState({
    employeeId: "",
    basicSalary: "",
    bonus: "",
    deductions: "",
    year: "",
    month: ""
  });

  // Fetch payrolls
  const fetchPayrolls = async () => {
    try {
      const res = await API.get("/payroll");
      setPayrolls(res.data);
    } catch (err) {
      console.error("Error fetching payrolls:", err.response?.data || err.message);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  // Add payroll
  const handleAddPayroll = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/payroll/employee/${newPayroll.employeeId}`, {
        basicSalary: newPayroll.basicSalary,
        bonus: newPayroll.bonus,
        deductions: newPayroll.deductions,
        year: newPayroll.year,
        month: newPayroll.month
      });
      resetForm();
      fetchPayrolls();
    } catch (err) {
      console.error("Error adding payroll:", err.response?.data || err.message);
    }
  };

  // Update payroll
  const handleUpdatePayroll = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/payroll/${editingPayroll.payrollId}`, {
        basicSalary: newPayroll.basicSalary,
        bonus: newPayroll.bonus,
        deductions: newPayroll.deductions,
        year: newPayroll.year,
        month: newPayroll.month
      });
      resetForm();
      fetchPayrolls();
    } catch (err) {
      console.error("Error updating payroll:", err.response?.data || err.message);
    }
  };

  // Delete payroll
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payroll?")) return;
    try {
      await API.delete(`/payroll/${id}`);
      fetchPayrolls();
    } catch (err) {
      console.error("Error deleting payroll:", err.response?.data || err.message);
    }
  };

  // Lock payroll
  const handleLockPayroll = async (id) => {
    if (!window.confirm("Lock this payroll? Once locked, it cannot be edited.")) return;
    try {
      await API.patch(`/payroll/${id}/lock`);
      fetchPayrolls();
    } catch (err) {
      console.error("Error locking payroll:", err.response?.data || err.message);
    }
  };

  // Edit payroll
  const handleEdit = (pay) => {
    setEditingPayroll(pay);
    setNewPayroll({
      employeeId: pay.employee?.employeeId || "",
      basicSalary: pay.basicSalary,
      bonus: pay.bonus,
      deductions: pay.deductions,
      year: pay.year,
      month: pay.month
    });
  };

  // Reset form
  const resetForm = () => {
    setNewPayroll({
      employeeId: "",
      basicSalary: "",
      bonus: "",
      deductions: "",
      year: "",
      month: ""
    });
    setEditingPayroll(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center fw-bold text-primary">Payroll Management</h2>

      {/* Add / Update Payroll Form */}
      <form
        onSubmit={editingPayroll ? handleUpdatePayroll : handleAddPayroll}
        className="card p-4 mb-4 shadow-lg border-0"
      >
        <h4 className="mb-3 text-secondary">
          {editingPayroll ? "Update Payroll" : "Add New Payroll"}
        </h4>
        <div className="row">
          {/* Employee dropdown */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Employee</label>
            <select
              className="form-control"
              value={newPayroll.employeeId}
              onChange={(e) =>
                setNewPayroll({ ...newPayroll, employeeId: e.target.value })
              }
              required
              disabled={!!editingPayroll}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Salary */}
          <div className="col-md-2 mb-3">
            <label className="form-label">Basic Salary</label>
            <input
              type="number"
              className="form-control"
              value={newPayroll.basicSalary}
              onChange={(e) =>
                setNewPayroll({ ...newPayroll, basicSalary: e.target.value })
              }
              required
            />
          </div>

          {/* Bonus */}
          <div className="col-md-2 mb-3">
            <label className="form-label">Bonus</label>
            <input
              type="number"
              className="form-control"
              value={newPayroll.bonus}
              onChange={(e) =>
                setNewPayroll({ ...newPayroll, bonus: e.target.value })
              }
            />
          </div>

          {/* Deductions */}
          <div className="col-md-2 mb-3">
            <label className="form-label">Deductions</label>
            <input
              type="number"
              className="form-control"
              value={newPayroll.deductions}
              onChange={(e) =>
                setNewPayroll({ ...newPayroll, deductions: e.target.value })
              }
            />
          </div>

          {/* Year */}
          <div className="col-md-1 mb-3">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-control"
              value={newPayroll.year}
              onChange={(e) =>
                setNewPayroll({ ...newPayroll, year: e.target.value })
              }
              required
            />
          </div>

          {/* Month */}
          <div className="col-md-2 mb-3">
            <label className="form-label">Month</label>
            <input
              type="number"
              className="form-control"
              value={newPayroll.month}
              onChange={(e) =>
                setNewPayroll({ ...newPayroll, month: e.target.value })
              }
              required
              min="1"
              max="12"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-success me-2 px-4">
            {editingPayroll ? "Update" : "Add"}
          </button>
          {editingPayroll && (
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Payroll Table */}
      <div className="card p-3 shadow-lg border-0">
        <h4 className="mb-3 text-dark">Payroll Records</h4>
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Basic</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Year</th>
              <th>Month</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length > 0 ? (
              payrolls.map((pay) => (
                <tr key={pay.payrollId} style={{ height: "65px" }}>
                  <td>{pay.payrollId}</td>
                  <td>
                    {pay.employee?.firstName} {pay.employee?.lastName}
                  </td>
                  <td>{pay.basicSalary}</td>
                  <td>{pay.bonus}</td>
                  <td>{pay.deductions}</td>
                  <td className="fw-bold text-success">{pay.netSalary}</td>
                  <td>{pay.year}</td>
                  <td>{pay.month}</td>
                  <td>
                    {pay.locked ? (
                      <span className="badge bg-danger">Locked</span>
                    ) : (
                      <span className="badge bg-success">Unlocked</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm px-3"
                        onClick={() => handleEdit(pay)}
                        disabled={pay.locked}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => handleDelete(pay.payrollId)}
                        disabled={pay.locked}
                      >
                        Delete
                      </button>
                      {!pay.locked && (
                        <button
                          className="btn btn-primary btn-sm px-3"
                          onClick={() => handleLockPayroll(pay.payrollId)}
                        >
                          Lock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted py-3">
                  No payroll records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;