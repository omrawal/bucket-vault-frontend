import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import Button from './Button.jsx';

function CreateAccountModal({ isOpen, onClose, onSuccess }) {
  const { selectedPortfolio } = usePortfolio();
  const [accountTypes, setAccountTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [showNewType, setShowNewType] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewBucket, setShowNewBucket] = useState(false);

  const [newType, setNewType] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBucket, setNewBucket] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    account_type_id: '',
    category_id: '',
    bucket_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      const portfolioId = selectedPortfolio || '';
      const params = new URLSearchParams({ portfolio_id: portfolioId });
      const [typesRes, categoriesRes, bucketsRes] = await Promise.all([
        fetch(`${API_URLS.get_account_types}?${params}`, { credentials: 'include' }),
        fetch(`${API_URLS.get_account_categories}?${params}`, { credentials: 'include' }),
        fetch(`${API_URLS.get_bucket_types}?${params}`, { credentials: 'include' }),
      ]);

      if (typesRes.ok && categoriesRes.ok && bucketsRes.ok) {
        const typesData = await typesRes.json();
        const categoriesData = await categoriesRes.json();
        const bucketsData = await bucketsRes.json();

        setAccountTypes(typesData);
        setCategories(categoriesData);
        setBuckets(bucketsData);
      } else {
        setError('Failed to load form data.');
      }
    } catch (err) {
      setError('Unable to fetch form data.');
    } finally {
      setLoading(false);
    }
  };

  const createNewType = async () => {
    if (!newType.trim()) {
      setError('Account type name cannot be empty.');
      return;
    }

    try {
      const res = await apiClient.post(API_URLS.create_account_type, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newType }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccountTypes([...accountTypes, data]);
        setFormData((prev) => ({ ...prev, account_type_id: data.id }));
        setNewType('');
        setShowNewType(false);
        setError('');
      } else {
        setError('Failed to create account type.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    }
  };

  const createNewCategory = async () => {
    if (!newCategory.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    if (!formData.account_type_id) {
      setError('Please select an account type first.');
      return;
    }

    try {
      const res = await apiClient.post(API_URLS.create_category, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newCategory,
          account_type_id: parseInt(formData.account_type_id),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, data]);
        setFormData((prev) => ({ ...prev, category_id: data.id }));
        setNewCategory('');
        setShowNewCategory(false);
        setError('');
      } else {
        setError('Failed to create category.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    }
  };

  const createNewBucket = async () => {
    if (!newBucket.trim()) {
      setError('Bucket name cannot be empty.');
      return;
    }

    try {
      const res = await apiClient.post(API_URLS.create_bucket, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newBucket }),
      });

      if (res.ok) {
        const data = await res.json();
        setBuckets([...buckets, data]);
        setFormData((prev) => ({ ...prev, bucket_id: data.id }));
        setNewBucket('');
        setShowNewBucket(false);
        setError('');
      } else {
        setError('Failed to create bucket.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await apiClient.post(API_URLS.create_account, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          portfolio_id: selectedPortfolio,
          name: formData.name,
          category_id: parseInt(formData.category_id),
          bucket_id: parseInt(formData.bucket_id),
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({ name: '', account_type_id: '', category_id: '', bucket_id: '' });
      } else {
        setError('Failed to create account.');
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
          <h2>Create New Account</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <p className="modal-body">Loading form data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Account Name</label>
              <input
                id="name"
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., ICICI Savings"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="account_type_id" className="form-label">Account Type</label>
              <div className="dropdown-with-action">
                <select
                  id="account_type_id"
                  className="form-input"
                  name="account_type_id"
                  value={formData.account_type_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select account type</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => setShowNewType(!showNewType)}
                  title="Add new account type"
                >
                  +
                </button>
              </div>
              {showNewType && (
                <div className="add-new-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="New account type name"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={createNewType}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowNewType(false);
                      setNewType('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category_id" className="form-label">Category</label>
              <div className="dropdown-with-action">
                <select
                  id="category_id"
                  className="form-input"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                  title="Add new category"
                >
                  +
                </button>
              </div>
              {showNewCategory && (
                <div className="add-new-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={createNewCategory}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bucket_id" className="form-label">Bucket</label>
              <div className="dropdown-with-action">
                <select
                  id="bucket_id"
                  className="form-input"
                  name="bucket_id"
                  value={formData.bucket_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select bucket</option>
                  {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.id}>
                      {bucket.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => setShowNewBucket(!showNewBucket)}
                  title="Add new bucket"
                >
                  +
                </button>
              </div>
              {showNewBucket && (
                <div className="add-new-field">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="New bucket name"
                    value={newBucket}
                    onChange={(e) => setNewBucket(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={createNewBucket}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowNewBucket(false);
                      setNewBucket('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
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
                {submitting ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateAccountModal;
