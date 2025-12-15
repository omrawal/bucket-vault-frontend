import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import FormField from './FormField.jsx';
import Button from './Button.jsx';

function CreateTransactionModal({ isOpen, onClose, onSuccess }) {
  const { selectedPortfolio } = usePortfolio();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    account_id: '',
    type: 'Debit',
    amount: '',
    note: '',
  });

  useEffect(() => {
    if (isOpen && selectedPortfolio) {
      fetchAccounts();
    }
  }, [isOpen, selectedPortfolio]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await fetch(`${API_URLS.get_all_accounts}?${params}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      } else {
        setError('Failed to load accounts.');
      }
    } catch (err) {
      setError('Unable to fetch accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    if (name === 'amount') {
      // Allow only numbers and one decimal point
      const numValue = value.replace(/[^\d.]/g, '');
      const parts = numValue.split('.');
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 2) return;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(API_URLS.create_transaction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          portfolio_id: selectedPortfolio,
          account_id: parseInt(formData.account_id),
          date: formData.date,
          type: formData.type,
          amount: parseFloat(formData.amount),
          note: formData.note,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          date: new Date().toISOString().split('T')[0],
          account_id: '',
          type: 'Debit',
          amount: '',
          note: '',
        });
      } else {
        setError('Failed to create transaction.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <p className="modal-body">Loading accounts...</p>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                id="date"
                className="form-input"
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="account_id" className="form-label">Account</label>
              <select
                id="account_id"
                className="form-input"
                name="account_id"
                value={formData.account_id}
                onChange={(e) => handleChange('account_id', e.target.value)}
                required
              >
                <option value="">Select account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">Transaction Type</label>
              <select
                id="type"
                className="form-input"
                name="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">Category</label>
              <select
                id="type"
                className="form-input"
                name="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">Transaction Type</label>
              <select
                id="type"
                className="form-input"
                name="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                id="amount"
                className="form-input"
                type="text"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                inputMode="decimal"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="note" className="form-label">Note</label>
              <textarea
                id="note"
                className="form-input"
                name="note"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                rows="3"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="modal-footer">
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateTransactionModal;
