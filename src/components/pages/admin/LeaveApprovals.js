import { useEffect, useState } from "react";
import API from "../../../api/api";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pending leaves
  const fetchPendingLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get("/leaves/pending", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching pending leaves:", err.response?.data || err.message);
      setError("Failed to load pending leaves");
    } finally {
      setLoading(false);
    }
  };

  // Approve or Reject leave
  const handleAction = async (leaveId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this leave?`)) return;

    try {
      await API.patch(`/leaves/${leaveId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setLeaves(leaves.filter((l) => l.leaveId !== leaveId));
      alert(`Leave ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing leave:`, err.response?.data || err.message);
      alert(`Failed to ${action} leave`);
    }
  };

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📋 Pending Leave Requests</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {leaves.length === 0 && !loading ? (
        <div className="alert alert-info text-center">No pending leave requests.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle shadow-sm">
            <thead className="table-dark text-center">
              <tr>
                <th>Leave ID</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.leaveId}>
                  <td className="text-center">{leave.leaveId}</td>
                  <td>{leave.employee?.firstName} {leave.employee?.lastName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark px-3 py-2">
                      {leave.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm px-3 me-2"
                      onClick={() => handleAction(leave.leaveId, "approve")}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm px-3"
                      onClick={() => handleAction(leave.leaveId, "reject")}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;