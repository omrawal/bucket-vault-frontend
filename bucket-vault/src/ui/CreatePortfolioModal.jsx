import React, { useState } from 'react';
import { API_URLS } from '../api/urls.js';

function CreatePortfolioModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      const res = await fetch(API_URLS.create_portfolio, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
        setFormData({ name: '', description: '' });
      } else {
        setError('Failed to create portfolio.');
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
          <h2>Create New Portfolio</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Portfolio Name</label>
            <input
              id="name"
              className="form-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Investment Portfolio"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              className="form-input"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description for this portfolio"
              rows="3"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePortfolioModal;
