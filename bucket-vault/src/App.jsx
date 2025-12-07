import React from 'react';
import { useState } from 'react';
import Sidebar from './layout/Sidebar.jsx';
import Topbar from './layout/Topbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';

function App() {
  const [route, setRoute] = useState('dashboard');

  const renderPage = () => {
    switch (route) {
      case 'accounts':
        return <AccountsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-root">
      <Sidebar current={route} onNavigate={setRoute} />
      <div className="app-main">
        <Topbar />
        <main className="app-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
