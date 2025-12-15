import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar.jsx';
import Topbar from './layout/Topbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import './styles.css';

function App() {
  return (
    <Router>
      <PortfolioProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <div className="app-root">
                <Sidebar />
                <div className="app-main">
                  <Topbar />
                  <main className="app-content">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/accounts" element={<AccountsPage />} />
                      <Route path="/transactions" element={<TransactionsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </PortfolioProvider>
    </Router>
  );
}

export default App;
