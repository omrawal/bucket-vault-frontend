import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
        onClose();
      } else {
        setError('Failed to create portfolio.');
      }
    } catch (err) {
      setError('Unable to reach server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop={submitting ? 'static' : true}
      keyboard={!submitting}
    >
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Create New Portfolio</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Portfolio Name
            </label>
            <input
              id="name"
              className="form-control"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Investment Portfolio"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description for this portfolio"
              rows="3"
            />
          </div>

          {error && <p className="text-danger small mb-0">{error}</p>}
        </Modal.Body>

        <Modal.Footer>
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
            {submitting ? 'Creating...' : 'Create Portfolio'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default CreatePortfolioModal;
