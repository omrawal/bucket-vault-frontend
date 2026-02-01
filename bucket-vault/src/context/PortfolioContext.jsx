import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client.js';

const STORAGE_KEY = 'selectedPortfolioId';
const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from sessionStorage on mount (client-side only)
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedPortfolio(parseInt(stored));
    }
    setIsHydrated(true);
  }, []);

  const handleSetSelectedPortfolio = (portfolioId) => {
    setSelectedPortfolio(portfolioId);
    if (portfolioId) {
      sessionStorage.setItem(STORAGE_KEY, String(portfolioId));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      fetchPortfolios();
    }
  }, [isHydrated]);


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

  return (
    <PortfolioContext.Provider value={{
        selectedPortfolio,
        setSelectedPortfolio: handleSetSelectedPortfolio,
        portfolios,
        loading,
        fetchPortfolios,
      }}>
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
