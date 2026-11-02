import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('recipehub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('recipehub_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('recipehub_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('recipehub_user', JSON.stringify(res.user));
          }
        } catch {
          // Token is invalid/expired
          localStorage.removeItem('recipehub_token');
          localStorage.removeItem('recipehub_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('recipehub_token', res.token);
      localStorage.setItem('recipehub_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.success && res.token) {
      localStorage.setItem('recipehub_token', res.token);
      localStorage.setItem('recipehub_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('recipehub_token');
    localStorage.removeItem('recipehub_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
