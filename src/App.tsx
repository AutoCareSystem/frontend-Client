import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerDashboard from "./pages/customer/Dashboard";
// import BookAppointment from "./pages/customer/BookAppointment";
// import Modifications from "./pages/customer/Modifications";
import ServicePage from "./pages/customer/ServicePage";
import ProjectPage from "./pages/customer/Projectpage";
import Chatbot from "./pages/customer/Chatbot";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import TimeLogs from "./pages/employee/TimeLogs";
import Projects from "./pages/employee/Projects";
import Appointments from "./pages/employee/Appointments";
import Profile from "./pages/employee/Profile";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        {/* <Route path="/customer/appointments" element={<BookAppointment />} />
        <Route path="/customer/modifications" element={<Modifications />} /> */}
        <Route path="/customer/appointments" element={<ServicePage />} />
        <Route path="/Servicepage" element={<ServicePage />} />
        <Route path="/customer/modifications" element={<ProjectPage />} />
        <Route path="/Projectpage" element={<ProjectPage />} />
        <Route path="/customer/chatbot" element={<Chatbot />} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/timelogs" element={<TimeLogs />} />
        <Route path="/employee/projects" element={<Projects />} />
        <Route path="/employee/appointments" element={<Appointments />} />
        <Route path="/employee/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
