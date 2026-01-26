import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import CreateTransactionModal from '../ui/CreateTransactionModal.jsx';
import Button from '../ui/Button.jsx';
import apiClient from '../api/client.js';

function TransactionsPage() {
  const { selectedPortfolio } = usePortfolio();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [selectedPortfolio]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await apiClient.get(`${API_URLS.get_all_transactions}?${params}`);
      const data = await res.data;
      setTransactions(data);
    } catch (err) {
    setError('Unable to reach server.');
  } finally {
    setLoading(false);
  }
};

if (loading) return <div className="page"><p>Loading transactions...</p></div>;
if (!selectedPortfolio) return <div className="page"><p className="auth-error">Please select a portfolio first.</p></div>;


return (
  <div className="page">
    <div className="page-header">
      <h2 className="page-title">Transactions</h2>
      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
      >
        + New Transaction
      </Button>
    </div>
    <div className="panel">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                No transactions created
              </td>
            </tr>
          ) : (
            transactions.map((t, index) => (
              <tr key={index}>
                <td>{t.date}</td>
                <td>{t.account}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>
                  {parseFloat(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>{t.note}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <CreateTransactionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={fetchTransactions}
    />
  </div>
);
}

export default TransactionsPage;
