import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BookService from "./pages/BookService";

// Development Pages (bypass auth)
import DevNavigation from "./components/DevNavigation";
import TestPage from "./pages/TestPage";
import DashboardMock from "./components/Dashboard/DashboardMock";
import BookingFormMock from "./components/Booking/BookingFormMock";
import { MockDataProvider } from "./contexts/MockDataProvider";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Development Route Component (bypasses authentication)
const DevRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set mock data in localStorage for development
  React.useEffect(() => {
    const mockUser = {
      id: "dev-user-1",
      email: "dev@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("authToken", "mock-jwt-token-123");
    localStorage.setItem("user", JSON.stringify(mockUser));
  }, []);

  return (
    <div>
      <DevNavigation />
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
        <p className="text-yellow-800 font-medium">
          🚧 Development Mode - Authentication Bypassed
        </p>
        <p className="text-yellow-700 text-sm">
          This page bypasses authentication for development purposes. Mock data
          is loaded.
        </p>
      </div>
      {children}
    </div>
  );
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

function App() {
  return (
    <AuthProvider>
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

            {/* Protected Routes */}
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
            <Route
              path="/dev"
              element={
                <DevRoute>
                  <div className="min-h-screen bg-gray-50 p-8">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Development Mode - Vehicle Service Center ERP
                      </h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Available Pages
                          </h2>
                          <ul className="space-y-2">
                            <li>
                              <Link
                                to="/dev/test"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                🧪 Test Page
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/dev/dashboard"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                📊 Dashboard
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/dev/book-service"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                🚗 Book Service
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                🔐 Login
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/signup"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                📝 Signup
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Features
                          </h2>
                          <ul className="space-y-2 text-gray-600">
                            <li>✅ Authentication bypassed</li>
                            <li>✅ Mock data loaded</li>
                            <li>✅ All components accessible</li>
                            <li>✅ No backend required</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </DevRoute>
              }
            />
            <Route
              path="/dev/test"
              element={
                <DevRoute>
                  <TestPage />
                </DevRoute>
              }
            />
            <Route
              path="/dev/dashboard"
              element={
                <DevRoute>
                  <MockDataProvider>
                    <Layout>
                      <DashboardMock />
                    </Layout>
                  </MockDataProvider>
                </DevRoute>
              }
            />
            <Route
              path="/dev/book-service"
              element={
                <DevRoute>
                  <MockDataProvider>
                    <Layout>
                      <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                          <h1 className="text-3xl font-bold text-gray-900">
                            Book Vehicle Service
                          </h1>
                          <p className="text-gray-600 mt-2">
                            Schedule your vehicle service appointment in just a
                            few simple steps.
                          </p>
                        </div>
                        <BookingFormMock />
                      </div>
                    </Layout>
                  </MockDataProvider>
                </DevRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
