import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import CreateAccountModal from '../ui/CreateAccountModal.jsx';
import Button from '../ui/Button.jsx';
import apiClient from '../api/client.js';

function AccountsPage() {
  const { selectedPortfolio } = usePortfolio();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchAccounts();
    } else {
      setLoading(false);
    }
  }, [selectedPortfolio]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await apiClient(`${API_URLS.get_all_accounts}?${params}`);
        setAccounts(res.data);
    } catch (err) {
      setError('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="page"><p>Loading accounts...</p></div>;
  if (!selectedPortfolio) return <div className="page"><p className="auth-error">Please select a portfolio first.</p></div>;
  if (error) return <div className="page"><p className="auth-error">{error}</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Accounts</h2>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          + New Account
        </Button>
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
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                  No accounts created
                </td>
              </tr>
            ) : (
              accounts.map((acc, index) => (
                <tr key={index}>
                  <td>{acc.name}</td>
                  <td>{acc.category}</td>
                  <td>{acc.bucket}</td>
                  <td className="text-right">
                    {acc.balance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
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
