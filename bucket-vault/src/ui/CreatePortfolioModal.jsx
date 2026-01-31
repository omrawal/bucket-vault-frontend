import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { API_URLS } from '../api/urls.js';
import FormField from './FormField.jsx';
import Button from './Button.jsx';
import apiClient from '../api/client.js';

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
      const res = await apiClient.post(API_URLS.create_portfolio, formData);

      onSuccess();
      setFormData({ name: '', description: '' });
      onClose();
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      setError(err.response?.data?.detail || 'Failed to create portfolio.');
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
            <FormField
              type="text"
              name="name"
              label="Portfolio Name"
              value={formData.name}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, name: val }))
              }
              // placeholder="e.g., My Investment Portfolio"
              required
            />
          </div>

          <div className="mb-3">
            <FormField
              type="textarea"
              name="description"
              label="Description (Optional)"
              value={formData.description}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, description: val }))
              }
            // placeholder="Add a description for this portfolio"
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
