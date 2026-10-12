import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('eventops_token');
    const savedUser = localStorage.getItem('eventops_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('eventops_token');
        localStorage.removeItem('eventops_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      const { token: jwtToken, id, name, email: userEmail, role } = res.data;
      const userInfo = { id, name, email: userEmail, role };
      setToken(jwtToken);
      setUser(userInfo);
      localStorage.setItem('eventops_token', jwtToken);
      localStorage.setItem('eventops_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      const { token: jwtToken, id, name, email: userEmail, role } = res.data;
      const userInfo = { id, name, email: userEmail, role };
      setToken(jwtToken);
      setUser(userInfo);
      localStorage.setItem('eventops_token', jwtToken);
      localStorage.setItem('eventops_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eventops_token');
    localStorage.removeItem('eventops_user');
  };

  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    hasRole,
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
