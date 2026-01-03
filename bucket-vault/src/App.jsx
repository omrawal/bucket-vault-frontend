import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar.jsx';
import Topbar from './layout/Topbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles.css';

function App() {
  return (
    <Router>
      <AuthProvider>  {/* AuthProvider wraps everything */}
        <Routes>
          {/* Public routes - now inside AuthProvider */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <PortfolioProvider>  {/* PortfolioProvider only for authenticated routes */}
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
                </PortfolioProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
