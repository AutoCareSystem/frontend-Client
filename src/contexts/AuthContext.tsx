import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import type { User, AuthState, LoginForm, SignupForm } from "../types";
import { apiService } from "../services/api";

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  signup: (userData: SignupForm) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          dispatch({ type: "AUTH_START" });
          const response = await apiService.getCurrentUser();

          if (response.success && response.data) {
            dispatch({ type: "AUTH_SUCCESS", payload: response.data });
          } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            dispatch({ type: "AUTH_LOGOUT" });
          }
        } catch (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          dispatch({ type: "AUTH_LOGOUT" });
        }
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginForm): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user });
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const signup = async (userData: SignupForm): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await apiService.signup(userData);

      if (response.success && response.data) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user });
      } else {
        throw new Error(response.message || "Signup failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Signup failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
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
