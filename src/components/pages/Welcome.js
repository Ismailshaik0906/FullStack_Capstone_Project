import React from "react";

const WelcomePage = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background circles */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "-60px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "50%",
          }}
        ></div>

        <div className="container position-relative">
          <h1 className="display-3 fw-bold mb-3">
            Welcome to{" "}
            <span style={{ color: "#ffd700" }}>Payroll Portal</span>
          </h1>
          <p className="lead mb-4">
            Manage employees, leaves, and payroll with ease and security.
          </p>

          <div className="row justify-content-center">
            <div className="col-auto">
              <a href="/login" className="btn btn-warning btn-lg px-4 shadow">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="fw-bold text-center mb-5">Why Choose Us?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 shadow rounded bg-white h-100 text-center">
              <h5 className="fw-bold mb-2">💰 Easy Payroll</h5>
              <p>Generate salary slips instantly with accurate tax and deduction calculations.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow rounded bg-white h-100 text-center">
              <h5 className="fw-bold mb-2">📅 Leave Tracking</h5>
              <p>Manage employee leaves, approvals, and balances in one place.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow rounded bg-white h-100 text-center">
              <h5 className="fw-bold mb-2">🔒 Secure Access</h5>
              <p>Role-based authentication ensures data safety and compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()} Payroll Management System. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default WelcomePage;