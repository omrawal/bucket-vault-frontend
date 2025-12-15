import React, { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const value = {
    selectedPortfolio,
    setSelectedPortfolio,
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
