import React from 'react';
import { useState } from 'react';
import AuthLayout from '../layout/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/client.js';
import { Link, Navigate, useNavigate } from 'react-router-dom';

function LoginPage({ onRouteChange }) {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      
      // Get user info
      const userResponse = await apiClient.get('/api/finance/auth/verify/', {
        headers: { Authorization: `Bearer ${access}` }
      });

      await login(access, refresh, userResponse.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bucket Vault"
      subtitle="Login to your portfolio"
    >
      <form onSubmit={handleSubmit}>
        <label className="auth-label">
          Username
          <input
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
