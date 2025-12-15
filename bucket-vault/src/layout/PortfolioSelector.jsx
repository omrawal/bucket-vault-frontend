import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import CreatePortfolioModal from '../ui/CreatePortfolioModal.jsx';
import DeletePortfolioModal from '../ui/DeletePortfolioModal.jsx';
import FormField from '../ui/FormField.jsx';
import Button from '../ui/Button.jsx';

function PortfolioSelector() {
  const { selectedPortfolio, setSelectedPortfolio } = usePortfolio();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URLS.get_portfolio_list, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setPortfolios(data);
        console.log('Fetched portfolios:', data);
        // Auto-select first portfolio if current one is not in the list
        if (data.length > 0) {
          const currentExists = data.find((p) => p.id === selectedPortfolio);
          if (!currentExists) {
            setSelectedPortfolio(data[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioChange = (value) => {
    setSelectedPortfolio(parseInt(value));
  };

  return (
    <div className="portfolio-selector">
      <FormField
        type="select"
        name="portfolio-select"
        label="Portfolio Name"
        value={selectedPortfolio}
        onChange={handlePortfolioChange}
        options={portfolios.map((p) => ({ label: p.name, value: p.id }))}
        // placeholder="Select a portfolio"
        disabled={loading}
      />
      {/* <select
        id="portfolio-select"
        className="portfolio-select"
        value={selectedPortfolio}
        onChange={handlePortfolioChange}
        disabled={loading}
      >
        <option value="">Select a portfolio</option>
        {portfolios.map((portfolio) => (
          <option key={portfolio.id} value={portfolio.id}>
            {portfolio.name}
          </option>
        ))}
      </select> */}
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
        onSuccess={() => {
          fetchPortfolios();
          setIsModalOpen(false);
        }}
      />

      <DeletePortfolioModal
        isOpen={isDeleteModalOpen}
        portfolio={portfolios.find((p) => p.id === parseInt(selectedPortfolio))}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          fetchPortfolios();
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

export default PortfolioSelector;
