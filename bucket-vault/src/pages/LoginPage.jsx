import React from 'react';
import { useState } from 'react';
import AuthLayout from '../layout/AuthLayout.jsx';
import { API_URLS } from '../api/urls.js';

function LoginPage({ onRouteChange }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(API_URLS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (res.ok) {
        // after successful login go to dashboard
        onRouteChange('dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Unable to reach server.');
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
          <button
            type="button"
            className="auth-link"
            onClick={() => onRouteChange('register')}
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
