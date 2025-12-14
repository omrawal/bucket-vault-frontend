import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import CreateAccountModal from '../ui/CreateAccountModal.jsx';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch(API_URLS.accounts, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      } else {
        setError('Failed to fetch accounts.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="page"><p>Loading accounts...</p></div>;
  if (error) return <div className="page"><p className="auth-error">{error}</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Accounts</h2>
        <button
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + New Account
        </button>
      </div>
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Bucket</th>
              <th className="text-right">Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, index) => (
              <tr key={index}>
                <td>{acc.name}</td>
                <td>{acc.type}</td>
                <td>{acc.bucket}</td>
                <td className="text-right">
                  {acc.balance.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAccounts}
      />
    </div>
  );
}

export default AccountsPage;
