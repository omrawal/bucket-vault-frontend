import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { API_URLS } from '../api/urls.js';
import Button from './Button.jsx';
import apiClient from '../api/client.js';

function DeletePortfolioModal({ isOpen, portfolio, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!portfolio) return;
    
    setError('');
    setDeleting(true);

    try {
      const res = await apiClient.delete(`${API_URLS.delete_portfolio}${portfolio.id}/`);
        onSuccess();
        onClose();
        
    } catch (err) {
      setError('Unable to reach server.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop={deleting ? 'static' : true}
      keyboard={!deleting}
    >
      <Modal.Header closeButton={!deleting}>
        <Modal.Title>Delete Portfolio</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">
          Are you sure you want to delete <strong>{portfolio?.name}</strong>?
        </p>
        <p className="text-warning small mb-0">
          ⚠️ This action cannot be undone. All accounts and transactions in this portfolio will be deleted.
        </p>
        {error && <p className="text-danger small mt-3 mb-0">{error}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Portfolio'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeletePortfolioModal;
