import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, StudentUser, AdminUser } from '../types';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from '../services/storageService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  studentUser: StudentUser | null;
  adminUser: AdminUser | null;
  loginStudent: (email: string, pass: string) => Promise<{ success: boolean; message: string; user?: StudentUser }>;
  registerNewStudent: (data: {
    fullName: string;
    studentId: string;
    email: string;
    password: string;
    department: string;
    yearSemester: string;
    phone?: string;
  }) => Promise<{ success: boolean; message: string; user?: StudentUser }>;
  loginAdmin: (identifier: string, pass: string) => Promise<{ success: boolean; message: string; user?: AdminUser }>;
  registerAdmin: (data: any) => Promise<{ success: boolean; message: string; user?: AdminUser }>;
  logout: () => void;
  updateProfile: (updates: Partial<StudentUser>) => { success: boolean; message: string; user?: StudentUser };
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('college_auth_updated', handleAuthChange);
    return () => {
      window.removeEventListener('college_auth_updated', handleAuthChange);
    };
  }, []);

  const loginStudent = async (email: string, pass: string) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        data.user.role = 'student';
        setCurrentUser(data.user);
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const registerNewStudent = async (studentData: any) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        data.user.role = 'student';
        setCurrentUser(data.user);
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const loginAdmin = async (identifier: string, pass: string) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass })
      });
      const data = await res.json();
      if (data.success && data.user) {
        data.user.role = 'admin';
        setCurrentUser(data.user);
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const registerAdmin = async (adminData: any) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        data.user.role = 'admin';
        setCurrentUser(data.user);
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  const updateProfile = (updates: Partial<StudentUser>) => {
    // This is still using local storage for now, but we don't have a profile update API yet.
    if (!user || user.role !== 'student') {
      return { success: false, message: 'No student logged in' };
    }
    return { success: false, message: 'Profile update API not implemented yet' };
  };

  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';
  const studentUser = isStudent ? (user as StudentUser) : null;
  const adminUser = isAdmin ? (user as AdminUser) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isStudent,
        isAdmin,
        studentUser,
        adminUser,
        loginStudent,
        registerNewStudent,
        loginAdmin,
        registerAdmin,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
