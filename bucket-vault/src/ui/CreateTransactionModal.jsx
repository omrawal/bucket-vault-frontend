import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import FormField from './FormField.jsx';
import Button from './Button.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CreateTransactionModal({ isOpen, onClose, onSuccess }) {
  const { selectedPortfolio } = usePortfolio();
  const [accounts, setAccounts] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [transactionSubcategories, setTransactionSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formDefaults = {
    date: new Date().toISOString().split('T')[0],
    account_id: '',
    type: '',
    category: '',
    subcategory: '',
    amount: '',
    note: '',
  }

  const [formData, setFormData] = useState(formDefaults);

  useEffect(() => {
    if (isOpen && selectedPortfolio) {
      fetchAccounts();
      fetchTransactionType();
      fetchTransactionCategory();
      fetchTransactionSubCategory();
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
  const fetchTransactionType = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await fetch(`${API_URLS.get_transaction_types}?${params}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Fetched transaction types:', data);
        setTransactionTypes(data);
      } else {
        setError('Failed to load transaction types.');
      }
    } catch (err) {
      setError('Unable to fetch transaction types.');
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactionCategory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await fetch(`${API_URLS.get_transaction_categories}?${params}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setTransactionCategories(data);
      } else {
        setError('Failed to load transaction categories.');
      }
    } catch (err) {
      setError('Unable to fetch transaction categories.');
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactionSubCategory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await fetch(`${API_URLS.get_transaction_subcategories}?${params}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setTransactionSubcategories(data);
      } else {
        setError('Failed to load transaction subcategories.');
      }
    } catch (err) {
      setError('Unable to fetch transaction subcategories.');
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
    console.log('Submitting transaction with data:', formData);

    // Convert Date to YYYY-MM-DD format with 00:00:00 time
    const dateObj = new Date(formData.date);
    dateObj.setHours(0, 0, 0, 0);
    const dateString = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

    try {
      const res = await fetch(API_URLS.create_transaction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          portfolio_id: selectedPortfolio,
          account_id: parseInt(formData.account_id),
          date: dateString,
          type: formData.type,
          category: formData.category,
          subcategory: formData.subcategory,
          amount: parseFloat(formData.amount),
          note: formData.note,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData(formDefaults);
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
              <DatePicker
                id="date"
                selected={formData.date}
                onChange={(date) => handleChange('date', date)}
                dateFormat="dd/MM/yyyy"
                className="form-input"
                placeholderText="Select date"
                required
                maxDate={new Date()}
              />
            </div>
            <FormField
              type="select"
              name="account_id"
              label="Account"
              options={accounts.map((acc) => ({ label: acc.name, value: acc.id }))}
              value={formData.account_id}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, account_id: val }))
              }
              required
            />

            <FormField
              type="select"
              name="type"
              label="Transaction Type"
              options={transactionTypes.map((transaction) => ({ label: transaction.name, value: transaction.id }))}
              value={formData.type}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, type: val }))
              }
              required
            />
            <FormField
              type="select"
              name="category"
              label="Transaction Category"
              options={transactionCategories.map((category) => ({ label: category.name, value: category.id }))}
              value={formData.category}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, category: val }))
              }
              required
            />
            <FormField
              type="select"
              name="subcategory"
              label="Transaction Sub-Category"
              options={transactionSubcategories.map((subcategory) => ({ label: subcategory.name, value: subcategory.id }))}
              value={formData.subcategory}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, subcategory: val }))
              }
              required
            />

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
