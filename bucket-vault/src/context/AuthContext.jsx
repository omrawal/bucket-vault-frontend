// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // ✅ Verify token with backend
      const response = await apiClient.get('/api/finance/auth/verify/');
      setUser(response.data.user);
    } catch (error) {
      console.error('Token verification failed:', error);

      // Don't logout on verification failure during dev (HMR)
      // Only logout if token is actually invalid (401)
      if (error.response?.status === 401) {
        logout();
      } else {
        // Network error or other issue - keep user logged in
        // Optionally set a fallback user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
