import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProviderDev } from "./contexts/AuthContextDev";
import Layout from "./components/Layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BookService from "./pages/BookService";

// Development Pages (bypass auth)
import DashboardDev from "./pages/dev/DashboardDev";
import BookServiceDev from "./pages/dev/BookServiceDev";

// Mock Protected Route Component (always allows access)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

// Mock Public Route Component (always allows access)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

function AppDev() {
  return (
    <AuthProviderDev>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected Routes (now accessible without auth) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-service"
              element={
                <ProtectedRoute>
                  <BookService />
                </ProtectedRoute>
              }
            />

            {/* Development Routes (bypass authentication) */}
            <Route path="/dev/dashboard" element={<DashboardDev />} />
            <Route path="/dev/book-service" element={<BookServiceDev />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProviderDev>
  );
}

export default AppDev;
