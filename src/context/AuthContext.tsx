import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: {
    userId?: string;
    customerID?: string; // Changed to string
    employeeID?: string; // Changed to string
    vehicleID?: number; // Added vehicleID
    role: string;
    email?: string;
  } | null;
  accessToken: string | null;
  login: (
    userData: any,
    tokens: { accessToken: string; refreshToken: string }
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    const storedCustomerId = localStorage.getItem("customerId");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");

    if (storedToken) {
      try {
        // Try to parse stored user first
        let userData = storedUser ? JSON.parse(storedUser) : null;

        // If no stored user, construct from localStorage values
        if (!userData && storedRole) {
          userData = {
            userId: storedUserId || "",
            role: storedRole,
            email: storedEmail || "",
            customerID: storedCustomerId || storedUserId || "",
          };
        }

        // Ensure customerID is set for customers
        if (userData && storedRole === "Customer" && !userData.customerID) {
          userData.customerID = storedCustomerId || storedUserId || "";
        }

        setUser(userData);
        setAccessToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  const login = (
    userData: any,
    tokens: { accessToken: string; refreshToken: string }
  ) => {
    // Store in state
    setUser(userData);
    setAccessToken(tokens.accessToken);

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    localStorage.setItem("role", userData.role);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        isAuthenticated: !!user && !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
