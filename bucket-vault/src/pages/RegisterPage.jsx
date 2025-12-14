import React from 'react';
import { useState } from 'react';
import AuthLayout from '../layout/AuthLayout.jsx';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function RegisterPage({ onRouteChange }) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

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
      const res = await fetch(`${API_BASE}/api/finance/auth/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (res.ok || res.status === 201) {
        setSuccess('Account created. You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirm('');
        // Optionally auto-switch to login after short delay
        setTimeout(() => onRouteChange('login'), 1200);
      } else {
        const data = await res.json().catch(() => null);
        setError(
          data?.detail ||
            data?.error ||
            'Could not create account.'
        );
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
          <button
            type="button"
            className="auth-link"
            onClick={() => onRouteChange('login')}
          >
            Login
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
