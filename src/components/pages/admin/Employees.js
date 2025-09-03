import { useEffect, useState } from "react";
import API from "../../../api/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [phoneError, setPhoneError] = useState("");

  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    address: "",
    departmentId: "",
    jobId: "",
    userId: "",
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err.response?.data || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err.response?.data || err.message);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
    fetchDepartments();
    fetchJobs();
  }, []);

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/; // exactly 10 digits
    return regex.test(phone);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!validatePhone(newEmployee.phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    try {
      await API.post("/employees", newEmployee);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error("Error adding employee:", err.response?.data || err.message);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!validatePhone(newEmployee.phone)) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    try {
      await API.put(`/employees/${editingEmployee.employeeId}`, newEmployee);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err.response?.data || err.message);
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setNewEmployee({
      firstName: emp.firstName,
      lastName: emp.lastName,
      dob: emp.dob,
      phone: emp.phone,
      address: emp.address,
      departmentId: emp.department?.departmentId || "",
      jobId: emp.job?.jobId || "",
      userId: emp.user?.userId || "",
    });
    setPhoneError(""); // reset error when editing
  };

  const resetForm = () => {
    setNewEmployee({
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      address: "",
      departmentId: "",
      jobId: "",
      userId: "",
    });
    setEditingEmployee(null);
    setPhoneError("");
  };

  return (
    <div className="container my-4">
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </h4>
        </div>
        <form
          onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          className="card-body"
        >
          <div className="row g-3">
            {/* First Name */}
            <div className="col-md-2">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.firstName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, firstName: e.target.value })
                }
                required
              />
            </div>

            {/* Last Name */}
            <div className="col-md-2">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.lastName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, lastName: e.target.value })
                }
                required
              />
            </div>

            {/* DOB */}
            <div className="col-md-2">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={newEmployee.dob}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, dob: e.target.value })
                }
                required
              />
            </div>

            {/* Phone */}
            <div className="col-md-2">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className={`form-control ${phoneError ? "is-invalid" : ""}`}
                value={newEmployee.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNewEmployee({ ...newEmployee, phone: value });
                    setPhoneError("");
                  }
                }}
                maxLength="10"
                required
              />
              {phoneError && (
                <div className="invalid-feedback">{phoneError}</div>
              )}
            </div>

            {/* Address */}
            <div className="col-md-4">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={newEmployee.address}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, address: e.target.value })
                }
                required
              />
            </div>

            {/* Dropdowns */}
            <div className="col-md-3">
              <label className="form-label">Department</label>
              <select
                className="form-control"
                value={newEmployee.departmentId}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, departmentId: e.target.value })
                }
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.departmentId} value={d.departmentId}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Job</label>
              <select
                className="form-control"
                value={newEmployee.jobId}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, jobId: e.target.value })
                }
                required
              >
                <option value="">Select Job</option>
                {jobs.map((j) => (
                  <option key={j.jobId} value={j.jobId}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">User</label>
              <select
                className="form-control"
                value={newEmployee.userId}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, userId: e.target.value })
                }
                required
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </button>
            {editingEmployee && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Employee List */}
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Employee List</h4>
        </div>
        <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Department</th>
                <th>Job</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    className={
                      editingEmployee?.employeeId === emp.employeeId
                        ? "table-warning"
                        : ""
                    }
                  >
                    <td>{emp.employeeId}</td>
                    <td>
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td>{emp.dob}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.address}</td>
                    <td>{emp.department?.name}</td>
                    <td>{emp.job?.title}</td>
                    <td>{emp.user?.username}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.employeeId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;