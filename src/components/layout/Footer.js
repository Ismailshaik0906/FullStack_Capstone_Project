import React from "react";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>Efficient • Secure • Reliable</p>
        </div>


        <div className="footer-right">
          <p>© {new Date().getFullYear()} Payroll Management System</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;