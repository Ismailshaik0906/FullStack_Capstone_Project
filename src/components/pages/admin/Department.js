import { useEffect, useState } from "react";
import API from "../../../api/api";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: "", description: "" });
  const [editDept, setEditDept] = useState(null);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Add Department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.name.trim()) {
      alert("Department name is required");
      return;
    }
    try {
      await API.post("/departments", newDept);
      setNewDept({ name: "", description: "" });
      fetchDepartments();
    } catch (err) {
      console.error("Error adding department:", err.response?.data || err.message);
    }
  };

  // Delete Department
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await API.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err.response?.data || err.message);
    }
  };

  // Update Department
  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!editDept.name.trim()) {
      alert("Department name cannot be empty");
      return;
    }
    try {
      await API.put(`/departments/${editDept.departmentId}`, editDept);
      setEditDept(null);
      fetchDepartments();
    } catch (err) {
      console.error("Error updating department:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🏢 Manage Departments</h2>

      {/* Department Form */}
      <form onSubmit={handleAddDepartment} className="card p-3 mb-4 shadow-sm border-0">
        <h4 className="mb-3">➕ Add Department</h4>
        <div className="row">
          <div className="col-md-5 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Department Name"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-5 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
            />
          </div>
          <div className="col-md-2 mb-3 d-flex align-items-end">
            <button type="submit" className="btn btn-success w-100">
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Department List */}
      <div className="card p-3 shadow-sm border-0">
        <h4 className="mb-3">📋 Department List</h4>
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{ width: "200px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              [...departments]
                .sort((a, b) => a.departmentId - b.departmentId)
                .map((d) =>
                  editDept && editDept.departmentId === d.departmentId ? (
                    <tr key={d.departmentId} className="table-warning">
                      <td>{d.departmentId}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editDept.name}
                          onChange={(e) => setEditDept({ ...editDept, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editDept.description}
                          onChange={(e) =>
                            setEditDept({ ...editDept, description: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handleUpdateDepartment}
                          >
                            ✅ Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditDept(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={d.departmentId}>
                      <td>{d.departmentId}</td>
                      <td>{d.name}</td>
                      <td>{d.description}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setEditDept(d)}
                          >
                            ✏️ Update
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(d.departmentId)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;