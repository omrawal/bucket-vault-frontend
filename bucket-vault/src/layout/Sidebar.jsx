import { FiPieChart, FiLayers, FiList } from 'react-icons/fi';
import React from 'react';
function Sidebar({ current, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">BV</span>
        <span className="sidebar-title">Bucket Vault</span>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${current === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <FiPieChart className="nav-icon" />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-item ${current === 'accounts' ? 'active' : ''}`}
          onClick={() => onNavigate('accounts')}
        >
          <FiLayers className="nav-icon" />
          <span>Accounts</span>
        </button>
        <button
          className={`nav-item ${current === 'transactions' ? 'active' : ''}`}
          onClick={() => onNavigate('transactions')}
        >
          <FiList className="nav-icon" />
          <span>Transactions</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
