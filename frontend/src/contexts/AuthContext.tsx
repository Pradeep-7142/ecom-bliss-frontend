import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  isActive: boolean;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  googleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await authAPI.getProfile();
          setUser(response.user);
        }
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing OAuth callback data:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    setIsLoading(true);
    try {
      console.log('AuthContext: Attempting signup with:', userData);
      const response = await authAPI.signup(userData);
      console.log('AuthContext: Signup successful:', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error: any) {
      console.error('AuthContext: Signup error:', error);
      console.error('AuthContext: Error response:', error.response);
      throw new Error(error.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = { ...user, ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authAPI.forgotPassword(email);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send reset email');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authAPI.resetPassword(token, newPassword);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
  };

  const googleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};