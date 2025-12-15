import { FiPieChart, FiLayers, FiList } from 'react-icons/fi';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">BV</span>
        <span className="sidebar-title">Bucket Vault</span>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <FiPieChart className="nav-icon" />
          <span>Dashboard</span>
        </button>
        <button
          className={`nav-item ${isActive('/accounts') ? 'active' : ''}`}
          onClick={() => navigate('/accounts')}
        >
          <FiLayers className="nav-icon" />
          <span>Accounts</span>
        </button>
        <button
          className={`nav-item ${isActive('/transactions') ? 'active' : ''}`}
          onClick={() => navigate('/transactions')}
        >
          <FiList className="nav-icon" />
          <span>Transactions</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
