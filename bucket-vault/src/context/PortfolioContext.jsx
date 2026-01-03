import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client.js';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/finance/portfolios/');
      const data = response.data;
      setPortfolios(data);

      // Auto-select first portfolio if none selected
      if (data.length > 0) {
        const currentExists = data.find((p) => p.id === selectedPortfolio);
        if (!currentExists || !selectedPortfolio) {
          setSelectedPortfolio(data[0].id);
        }
      } else {
        setSelectedPortfolio(null);
      }
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    selectedPortfolio,
    setSelectedPortfolio,
    portfolios,
    loading,
    refreshPortfolios: fetchPortfolios, 
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
