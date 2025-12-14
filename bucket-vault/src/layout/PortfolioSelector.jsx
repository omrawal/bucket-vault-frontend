import React, { useState, useEffect } from 'react';
import { API_URLS } from '../api/urls.js';
import CreatePortfolioModal from '../ui/CreatePortfolioModal.jsx';

function PortfolioSelector() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        // Auto-select first portfolio if available
        if (data.length > 0 && !selectedPortfolio) {
          setSelectedPortfolio(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioChange = (e) => {
    setSelectedPortfolio(e.target.value);
  };

  return (
    <div className="portfolio-selector">
      <label htmlFor="portfolio-select" className="portfolio-label">Portfolio:</label>
      <select
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
      </select>
      <button
        className="btn-new-portfolio"
        onClick={() => setIsModalOpen(true)}
        title="Create new portfolio"
      >
        +
      </button>

      <CreatePortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchPortfolios();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default PortfolioSelector;
