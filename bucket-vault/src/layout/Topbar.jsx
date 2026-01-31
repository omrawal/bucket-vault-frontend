import React from 'react';
import PortfolioSelector from './PortfolioSelector.jsx';
import ProfileDropdown from '../ui/ProfileDropdown.jsx';

function Topbar() {
  return (
    <header className="topbar">
      <h1 className="topbar-title">Personal Finance Overview</h1>
      <div className="topbar-center">
        <PortfolioSelector />
      </div>
      <div className="topbar-right">
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default Topbar;
