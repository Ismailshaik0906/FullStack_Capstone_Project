import { useEffect, useState } from "react";
import API from "../../../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [editUser, setEditUser] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Validation
  const validateUser = (user, isNew = true) => {
    const newErrors = {};

    if (!user.username || user.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (isNew && (!user.password || user.password.length < 6)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!user.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateUser(newUser, true)) return;

    try {
      await API.post("/users", newUser);
      setNewUser({ username: "", email: "", password: "", role: "EMPLOYEE" });
      setErrors({});
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err.response?.data || err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };

  // Save updated user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateUser(editUser, false)) return;

    try {
      const payload = { ...editUser };
      if (!payload.password) delete payload.password; // don’t send empty password

      await API.put(`/users/${editUser.userId}`, payload);
      setEditUser(null);
      setErrors({});
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👥 Manage Users</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="card p-3 mb-4 shadow-sm">
        <h4 className="mb-3">➕ Add User</h4>
        <div className="row">
          {/* Username */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          {/* Email */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Role */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Role</label>
            <select
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && (
              <div className="invalid-feedback">{errors.role}</div>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-success">
          Add User
        </button>
      </form>

      {/* User List */}
      <div className="card p-3 shadow-sm">
        <h4 className="mb-3">📋 User List</h4>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: "220px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) =>
                  editUser && editUser.userId === u.userId ? (
                    <tr key={u.userId}>
                      <td>{u.userId}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editUser.username}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              username: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          className="form-control"
                          value={editUser.email}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              email: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={editUser.role}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              role: e.target.value,
                            })
                          }
                        >
                          <option value="EMPLOYEE">EMPLOYEE</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>
                        {/* Optional password update */}
                        <input
                          type="password"
                          className="form-control mb-2"
                          placeholder="New password (leave empty to keep)"
                          value={editUser.password || ""}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              password: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleUpdateUser}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditUser(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u.userId}>
                      <td>{u.userId}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => setEditUser({ ...u, password: "" })}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u.userId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;