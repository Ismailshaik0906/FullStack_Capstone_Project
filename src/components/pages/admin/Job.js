import { useEffect, useState } from "react";
import API from "../../../api/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: "" });
  const [editJob, setEditJob] = useState(null);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Add job
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.title.trim()) {
      alert("Job title is required");
      return;
    }
    try {
      await API.post("/jobs", newJob);
      setNewJob({ title: "" });
      fetchJobs();
    } catch (err) {
      console.error("Error adding job:", err.response?.data || err.message);
    }
  };

  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err.response?.data || err.message);
    }
  };

  // Update job
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editJob.title.trim()) {
      alert("Job title cannot be empty");
      return;
    }
    try {
      await API.put(`/jobs/${editJob.jobId}`, editJob);
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      console.error("Error updating job:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold">💼 Job Management</h2>

      {/* Add Job Section */}
      <form
        onSubmit={handleAddJob}
        className="card shadow-sm border-0 p-4 mb-5"
      >
        <h4 className="mb-3 text-primary">➕ Add a New Job</h4>
        <div className="row">
          <div className="col-md-9 mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 mb-3 d-grid">
            <button type="submit" className="btn btn-success btn-lg">
              Add Job
            </button>
          </div>
        </div>
      </form>

      {/* Job List Section */}
      <div>
        {jobs.length > 0 ? (
          <div className="row g-4">
            {[...jobs]
              .sort((a, b) => a.jobId - b.jobId)
              .map((job) => (
                <div className="col-md-6 col-lg-4" key={job.jobId}>
                  <div className="card shadow-sm border-0 h-100 p-3">
                    {editJob && editJob.jobId === job.jobId ? (
                      <>
                        <h5 className="text-warning">✏️ Editing Job</h5>
                        <input
                          type="text"
                          className="form-control mb-3"
                          value={editJob.title}
                          onChange={(e) =>
                            setEditJob({ ...editJob, title: e.target.value })
                          }
                        />
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-success btn-sm w-50 me-2"
                            onClick={handleUpdateJob}
                          >
                            ✅ Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm w-50"
                            onClick={() => setEditJob(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="fw-bold">{job.title}</h5>
                        <p className="text-muted mb-4">
                          Job ID: <strong>{job.jobId}</strong>
                        </p>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary btn-sm w-50 me-2"
                            onClick={() => setEditJob(job)}
                          >
                            ✏️ Update
                          </button>
                          <button
                            className="btn btn-danger btn-sm w-50"
                            onClick={() => handleDelete(job.jobId)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="alert alert-info text-center p-4">
            🚀 No jobs found. Start by adding one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;