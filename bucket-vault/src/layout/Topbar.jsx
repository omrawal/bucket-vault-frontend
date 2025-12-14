import React from 'react';
import PortfolioSelector from './PortfolioSelector.jsx';

function Topbar() {
  return (
    <header className="topbar">
      <h1 className="topbar-title">Personal Finance Overview</h1>
      <div className="topbar-center">
        <PortfolioSelector />
      </div>
      <div className="topbar-right">
        <span className="topbar-user">Hello, Om</span>
      </div>
    </header>
  );
}

export default Topbar;
