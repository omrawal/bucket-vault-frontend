import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import CreatePortfolioModal from '../ui/CreatePortfolioModal.jsx';
import DeletePortfolioModal from '../ui/DeletePortfolioModal.jsx';
import FormField from '../ui/FormField.jsx';
import Button from '../ui/Button.jsx';
import apiClient from '../api/client.js';

function PortfolioSelector() {
  const { selectedPortfolio,
    setSelectedPortfolio,
    portfolios,
    loading,
    refreshPortfolios, } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePortfolioChange = (value) => {
    setSelectedPortfolio(parseInt(value));
  };

  const handleCreateSuccess = async () => {
    await refreshPortfolios(); // ✅ Refresh from context
    setIsModalOpen(false);
  };

  const handleDeleteSuccess = async () => {
    await refreshPortfolios(); // ✅ Refresh from context
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="portfolio-selector">
      <FormField
        type="select"
        name="portfolio-select"
        label="Portfolio Name"
        value={selectedPortfolio || ''}
        onChange={handlePortfolioChange}
        options={portfolios.map((p) => ({ label: p.name, value: p.id }))}
        disabled={loading}
      />

      <Button
        variant="icon"
        size="small"
        className="btn-icon-add"
        onClick={() => setIsModalOpen(true)}
        title="Create new portfolio"
      >
        +
      </Button>

      <Button
        variant="icon"
        size="small"
        className="btn-icon-delete"
        onClick={() => setIsDeleteModalOpen(true)}
        title="Delete selected portfolio"
        disabled={!selectedPortfolio || loading}
      >
        −
      </Button>

      <CreatePortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <DeletePortfolioModal
        isOpen={isDeleteModalOpen}
        portfolio={portfolios.find((p) => p.id === parseInt(selectedPortfolio))}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

export default PortfolioSelector;