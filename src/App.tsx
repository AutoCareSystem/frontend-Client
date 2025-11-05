import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import ServicePage from "./pages/customer/ServicePage";
import ProjectPage from "./pages/customer/Projectpage";
import Chatbot from "./pages/customer/Chatbot";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import TimeLogs from "./pages/employee/TimeLogs";
import Projects from "./pages/employee/Projects";
import Appointments from "./pages/employee/Appointments";
import Profile from "./pages/employee/Profile";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// 404 Page Component
function NotFound() {
  return <div style={{ textAlign: "center", marginTop: "50px" }}><h1>404 - Page Not Found</h1></div>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/appointments" element={<ServicePage />} />
        <Route path="/Servicepage" element={<ServicePage />} /> {/* optional duplicate */}
        <Route path="/customer/modifications" element={<ProjectPage />} />
        <Route path="/Projectpage" element={<ProjectPage />} /> {/* optional duplicate */}
        <Route path="/customer/chatbot" element={<Chatbot />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/timelogs" element={<TimeLogs />} />
        <Route path="/employee/projects" element={<Projects />} />
        <Route path="/employee/appointments" element={<Appointments />} />
        <Route path="/employee/profile" element={<Profile />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
