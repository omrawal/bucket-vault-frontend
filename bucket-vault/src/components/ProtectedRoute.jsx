import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import React from 'react';
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'radial-gradient(circle at top, #1f2937 0, #020617 55%)',
        color: '#e5e7eb'
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;