import React, { createContext, useContext, ReactNode } from "react";
import type { User, AuthState, LoginForm, SignupForm } from "../types";

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  signup: (userData: SignupForm) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const mockUser: User = {
  id: "dev-user-1",
  email: "dev@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "123-456-7890",
  role: "customer",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockAuthState: AuthState = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProviderDev: React.FC<AuthProviderProps> = ({ children }) => {
  const login = async (credentials: LoginForm): Promise<void> => {
    console.log("Mock login:", credentials);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const signup = async (userData: SignupForm): Promise<void> => {
    console.log("Mock signup:", userData);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const logout = async (): Promise<void> => {
    console.log("Mock logout");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const clearError = (): void => {
    console.log("Mock clear error");
  };

  const value: AuthContextType = {
    ...mockAuthState,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
