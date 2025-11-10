import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: {
    userId?: string;
    customerID?: string;  // Changed to string
    employeeID?: string;  // Changed to string
    vehicleID?: number;   // Added vehicleID
    role: string;
    email?: string;
  } | null;
  accessToken: string | null;
  login: (userData: any, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to decode JWT token
const decodeJWT = (token: string) => {
  try {
    // Split the token into header, payload, and signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64 and parse JSON
    const decodedPayload = JSON.parse(atob(paddedPayload));
    
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Function to extract user ID from token
const extractUserIdFromToken = (token: string): string | null => {
  const decoded = decodeJWT(token);
  if (decoded && decoded.sub) {
    return decoded.sub;
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // If user doesn't have userId, try to extract it from token
        if (!parsedUser.userId) {
          const userIdFromToken = extractUserIdFromToken(storedToken);
          if (userIdFromToken) {
            parsedUser.userId = userIdFromToken;
            // Update localStorage with the userId
            localStorage.setItem('user', JSON.stringify(parsedUser));
            localStorage.setItem('userId', userIdFromToken);
          }
        }
        
        setUser(parsedUser);
        setAccessToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
      }
    }
  }, []);

  const login = (userData: any, tokens: { accessToken: string; refreshToken: string }) => {
    // Extract user ID from access token
    const userIdFromToken = extractUserIdFromToken(tokens.accessToken);
    
    // Merge userData with extracted userId
    const updatedUserData = {
      ...userData,
      userId: userIdFromToken || userData.userId // Use token userId if available, fallback to userData
    };
    
    // Store in state
    setUser(updatedUserData);
    setAccessToken(tokens.accessToken);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('role', updatedUserData.role);
    
    // Store userId separately for easy access
    if (userIdFromToken) {
      localStorage.setItem('userId', userIdFromToken);
    }

    // Optional: Log the decoded token for debugging
    console.log('Decoded JWT payload:', decodeJWT(tokens.accessToken));
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export utility functions for use elsewhere in your app
export { decodeJWT, extractUserIdFromToken };