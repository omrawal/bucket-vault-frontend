import React from 'react';
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/client.js';
import AuthLayout from '../layout/AuthLayout.jsx';

function RegisterPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/finance/auth/signup/', {
        username,
        email,
        password,
      });

      const { access, refresh, user } = response.data;
      
      // Auto-login after signup
      await login(access, refresh, user);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Could not create account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bucket Vault"
      subtitle="Create your first portfolio"
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
          Email (optional)
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="auth-label">
          Password
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <label className="auth-label">
          Confirm Password
          <input
            className="auth-input"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;