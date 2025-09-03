import "bootstrap/dist/css/bootstrap.min.css";   
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import EmployeeDashboard from "./components/pages/employee/EmployeeDashboard";
import Employees from "./components/pages/admin/Employees";
import Users from "./components/pages/admin/Users";
import Payroll from "./components/pages/admin/Payroll";
import LeaveApprovals from "./components/pages/admin/LeaveApprovals";
import Reports from "./components/pages/admin/Reports";
import Profile from "./components/pages/employee/Profile";
import Leave from "./components/pages/employee/Leave";
import SalarySlip from "./components/pages/employee/Salaryslip";
import Department from "./components/pages/admin/Department";
import Jobs from "./components/pages/admin/Job";
import Register from "./components/auth/Register";
import WelcomePage from "./components/pages/Welcome";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<WelcomePage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="register" element={<Register/>}/>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/payroll" element={<Payroll />} />
          <Route path="/admin/leave" element={<LeaveApprovals />} />
          <Route path="/admin/departments" element={<Department/>}/>
          <Route path="admin/jobs" element={<Jobs/>}/>
          <Route path="/admin/reports" element={<Reports />} />


          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<Profile />} />
          <Route path="/employee/leave" element={<Leave />} />
          <Route path="/employee/salary" element={<SalarySlip />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;