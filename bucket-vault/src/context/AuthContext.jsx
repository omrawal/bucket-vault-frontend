import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token on mount
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend (requires adding this endpoint)
      const response = await apiClient.get('/api/auth/verify/');
      setUser(response.data.user);
    } catch (error) {
      // Token invalid, try refresh (handled by interceptor)
      // If refresh fails, interceptor redirects to login
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (accessToken, refreshToken, userData) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
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
