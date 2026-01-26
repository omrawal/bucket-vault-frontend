import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import FormField from './FormField.jsx';
import Button from './Button.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api/client.js';

function CreateTransactionModal({ isOpen, onClose, onSuccess }) {
  const { selectedPortfolio } = usePortfolio();
  const [transactionType, setTransactionType] = useState('Income'); // Income, Expense, Transfer
  const [accounts, setAccounts] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formDefaults = {
    date: new Date(),
    account_id: '',
    category: '',
    subcategory: '',
    amount: '',
    note: '',
    // Transfer-specific
    from_account_id: '',
    to_account_id: '',
  };

  const [formData, setFormData] = useState(formDefaults);

  useEffect(() => {
    if (isOpen && selectedPortfolio) {
      fetchAccounts();
      if (transactionType !== 'Transfer') {
        fetchTransactionCategories(transactionType);
      }
    }
  }, [isOpen, selectedPortfolio, transactionType]);

  // Filter subcategories based on selected category
  // useEffect(() => {
  //   if (formData.category) {
  //     fetchTransactionSubCategory(formData.category);
  //   } else {
  //     setTransactionSubcategories([]);
  //   }
  // }, [formData.category]);

  // Reset form when transaction type changes
  useEffect(() => {
    setFormData(formDefaults);
    setError('');
  }, [transactionType]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ portfolio_id: selectedPortfolio });
      const res = await apiClient.get(`${API_URLS.get_all_accounts}?${params}`);
      setAccounts(res.data);
    } catch (err) {
      setError('Unable to fetch accounts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionCategories = async (type) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        portfolio_id: selectedPortfolio,
        type: type  // 'Income' or 'Expense'
      });
      const res = await apiClient.get(`${API_URLS.get_transaction_categories}?${params}`);
      setTransactionCategories(res.data);
    } catch (err) {
      setError('Unable to fetch transaction categories.');
    } finally {
      setLoading(false);
    }
  };

  // const fetchTransactionSubCategory = async (categoryId) => {
  //   try {
  //     const params = new URLSearchParams({
  //       portfolio_id: selectedPortfolio,
  //       category_id: categoryId
  //     });
  //     const res = await apiClient.get(`${API_URLS.get_transaction_subcategories}?${params}`);
  //     setTransactionSubcategories(res.data);
  //   } catch (err) {
  //     setError('Unable to fetch transaction subcategories.');
  //   }
  // };

  const handleChange = (name, value) => {
    if (name === 'amount') {
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

    const dateObj = new Date(formData.date);
    dateObj.setHours(0, 0, 0, 0);
    const dateString = dateObj.toISOString().split('T')[0];

    try {
      if (transactionType === 'Transfer') {
        // Use transfer API
        await apiClient.post(API_URLS.create_transfer, {
          portfolio_id: selectedPortfolio,
          from_account_id: parseInt(formData.from_account_id),
          to_account_id: parseInt(formData.to_account_id),
          date: dateString,
          amount: parseFloat(formData.amount),
          note: formData.note,
        });
      } else {
        // Use income/expense API
        await apiClient.post(API_URLS.create_transaction, {
          portfolio_id: selectedPortfolio,
          account_id: parseInt(formData.account_id),
          date: dateString,
          type: transactionType === 'Income' ? 'Credit' : 'Debit',
          category: parseInt(formData.category),
          subcategory: parseInt(formData.subcategory),
          amount: parseFloat(formData.amount),
          note: formData.note,
        });
      }
      onSuccess();
      onClose();
      setFormData(formDefaults);
      setTransactionType('Income'); // Reset to default
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create transaction.');
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

        {/* Transaction Type Toggle Buttons */}
        <div className="transaction-type-toggle">
          <button
            type="button"
            className={`type-btn ${transactionType === 'Income' ? 'active success' : ''}`}
            onClick={() => setTransactionType('Income')}
          >
            Income
          </button>
          <button
            type="button"
            className={`type-btn ${transactionType === 'Expense' ? 'active danger' : ''}`}
            onClick={() => setTransactionType('Expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-btn ${transactionType === 'Transfer' ? 'active primary' : ''}`}
            onClick={() => setTransactionType('Transfer')}
          >
            Transfer
          </button>
        </div>

        {loading ? (
          <p className="modal-body">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            {/* Common Date Field */}
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

            {/* Income/Expense Form */}
            {transactionType !== 'Transfer' && (
              <>
                <FormField
                  type="select"
                  name="account_id"
                  label="Account"
                  options={accounts.map((acc) => ({ label: acc.name, value: acc.id }))}
                  value={formData.account_id}
                  onChange={(val) => handleChange('account_id', val)}
                  required
                />

                <FormField
                  type="text"
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                  required
                />

                {/* <FormField
                  type="select"
                  name="subcategory"
                  label="Subcategory"
                  options={transactionSubcategories.map((sub) => ({ label: sub.name, value: sub.id }))}
                  value={formData.subcategory}
                  onChange={(val) => handleChange('subcategory', val)}
                  required
                  disabled={!formData.category}
                /> */}

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
                    placeholder="0.00"
                    required
                  />
                </div>
              </>
            )}

            {/* Transfer Form */}
            {transactionType === 'Transfer' && (
              <>
                <FormField
                  type="select"
                  name="from_account_id"
                  label="From Account"
                  options={accounts.map((acc) => ({ label: acc.name, value: acc.id }))}
                  value={formData.from_account_id}
                  onChange={(val) => handleChange('from_account_id', val)}
                  required
                />

                <FormField
                  type="select"
                  name="to_account_id"
                  label="To Account"
                  options={accounts.filter(acc => acc.id !== parseInt(formData.from_account_id)).map((acc) => ({ label: acc.name, value: acc.id }))}
                  value={formData.to_account_id}
                  onChange={(val) => handleChange('to_account_id', val)}
                  required
                  disabled={!formData.from_account_id}
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
                    placeholder="0.00"
                    required
                  />
                </div>
              </>
            )}

            {/* Common Note Field */}
            <div className="form-group">
              <label htmlFor="note" className="form-label">Note (Optional)</label>
              <textarea
                id="note"
                className="form-input"
                name="note"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                rows="3"
                placeholder="Add a note..."
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
                {submitting ? 'Adding...' : `Add ${transactionType}`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateTransactionModal;
