import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatbotButton from "./components/ChatbotButton";
import CustomerDashboard from "./pages/customer/Dashboard";
import CleanDashboard from "./pages/customer/CleanDashboard";
import BookAppointment from "./pages/customer/BookAppointment";
import Modifications from "./pages/customer/Modifications";
import CustomerProfile from "./pages/customer/Profile";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import TimeLogs from "./pages/employee/TimeLogs";
import Projects from "./pages/employee/Projects";
import Appointments from "./pages/employee/Appointments";
import Profile from "./pages/employee/Profile";
import Services from "./pages/employee/Services";
import AddService from "./pages/employee/AddService";
import UserManagement from "./pages/employee/UserManagement";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function App() {
  return (
    <Router>
      <div className="relative">
        <Routes>
          {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CleanDashboard />} />
        <Route path="/customer/dashboard-old" element={<CustomerDashboard />} />
        <Route path="/customer/appointments" element={<BookAppointment />} />
        <Route path="/customer/modifications" element={<Modifications />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/timelogs" element={<TimeLogs />} />
        <Route path="/employee/projects" element={<Projects />} />
        <Route path="/employee/services" element={<Services />} />
    <Route path="/employee/services/add" element={<AddService />} />
  <Route path="/employee/users" element={<UserManagement />} />
        <Route path="/employee/appointments" element={<Appointments />} />
        <Route path="/employee/profile" element={<Profile />} />
      </Routes>
      <ChatbotButton />
      </div>
    </Router>
  );
}
