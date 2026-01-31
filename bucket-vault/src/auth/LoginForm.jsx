import { useState } from 'react';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', // important for Django session cookie
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (res.ok) {
        setSuccess('Logged in successfully.');
        // TODO: redirect to dashboard route / set global auth state
      } else {
        setError('Invalid username or password.',res);
      }
    } catch (err) {
      setError('Unable to reach server.',err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={styles.label}>
        Username
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </label>

      <label style={styles.label}>
        Password
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          ...styles.button,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

const styles = {
  label: {
    display: 'block',
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginTop: 4,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #1f2937',
    background: '#020617',
    color: '#e5e7eb',
    fontSize: 13,
  },
  button: {
    width: '100%',
    marginTop: 12,
    padding: '8px 10px',
    borderRadius: 999,
    border: 'none',
    background:
      'linear-gradient(135deg, #2563eb, #22c55e)',
    color: '#f9fafb',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    color: '#f87171',
  },
  success: {
    marginTop: 6,
    fontSize: 12,
    color: '#4ade80',
  },
};

export default LoginForm;
