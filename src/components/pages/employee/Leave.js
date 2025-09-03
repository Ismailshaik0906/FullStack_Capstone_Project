import { useEffect, useState } from "react";
import API from "../../../api/api";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    leaveType: "SICK",
  });
  const [message, setMessage] = useState(null);

  const employeeId = localStorage.getItem("employeeId");

  // Fetch employee's leave history
  const fetchLeaves = async () => {
    try {
      const res = await API.get(`/leaves/employee/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchLeaves();
    }
  }, [employeeId]);

  // Apply for leave
  const handleApply = async (e) => {
    e.preventDefault();

    // Simple validation
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setMessage({ type: "danger", text: "End date cannot be before start date." });
      return;
    }

    try {
      await API.post(`/leaves/employee/${employeeId}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage({ type: "success", text: "Leave applied successfully!" });
      setForm({ startDate: "", endDate: "", leaveType: "SICK" }); // reset form
      fetchLeaves(); // Refresh leave list
    } catch (err) {
      console.error("Error applying leave:", err.response?.data || err.message);
      setMessage({ type: "danger", text: "Failed to apply leave." });
    }
  };

  const renderStatusBadge = (status) => {
    const colors = {
      APPROVED: "success",
      PENDING: "warning",
      REJECTED: "danger",
    };
    return (
      <span className={`badge bg-${colors[status] || "secondary"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary">My Leaves</h2>
      <p>
        <b>Employee ID:</b> {employeeId}
      </p>

      {/* Message */}
      {message && (
        <div className={`alert alert-${message.type} mt-2`} role="alert">
          {message.text}
        </div>
      )}

      {/* Leave Apply Form */}
      <form className="card p-3 shadow mt-3" onSubmit={handleApply}>
        <h4 className="text-success">Apply for Leave</h4>

        <div className="form-group mt-2">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group mt-2">
          <label>Leave Type</label>
          <select
            className="form-control"
            value={form.leaveType}
            onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
          >
            <option value="SICK">Sick Leave</option>
            <option value="CASUAL">Casual Leave</option>
            <option value="ANNUAL">Annual Leave</option>
          </select>
        </div>

        <button className="btn btn-primary mt-3" type="submit">
          Apply
        </button>
      </form>

      {/* Leave History */}
      <div className="card p-3 shadow mt-4">
        <h4 className="text-info">Leave History</h4>
        {leaves.length === 0 ? (
          <p className="text-muted">No leaves applied yet.</p>
        ) : (
          <table className="table table-bordered mt-2">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Leave Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.leaveId}>
                  <td>{leave.leaveId}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{renderStatusBadge(leave.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leave;