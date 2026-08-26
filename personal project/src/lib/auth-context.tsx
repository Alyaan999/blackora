'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { useToast } from './toast-context';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSeller: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const refreshUser = async () => {
    try {
      const storedId = localStorage.getItem('blackora_user_id');
      if (!storedId) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`/api/users/${storedId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('blackora_user_id');
        setUser(null);
      }
    } catch (_e) {
      console.error('Error refreshing user', _e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('blackora_user_id', data.user.id);
        toast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (_e) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('blackora_user_id', data.user.id);
        toast('Admin Access Granted', 'success');
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid admin credentials' };
    } catch (_e) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('blackora_user_id', data.user.id);
        toast(`Account created! Welcome to Blackora, ${data.user.name}.`, 'success');
        return { success: true };
      }
      return { success: false, error: data.error || 'Signup failed' };
    } catch (_e) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('blackora_user_id');
    setUser(null);
    toast('Logged out successfully', 'info');
  };

  const isAdmin = user?.role === 'admin';
  const isSeller = !!user?.isSeller;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isSeller,
        isLoading,
        login,
        adminLogin,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
