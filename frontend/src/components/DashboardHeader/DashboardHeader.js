import React from 'react';
import './DashboardHeader.css';

function DashboardHeader({ setCurrentPage }) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <div className="header-left">
          <div className="logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">BrandShield AI</span>
          </div>
        </div>

        <nav className="header-nav">
          <span className="nav-link" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>Home</span>
          <span className="nav-link active">AI Crisis Predictor</span>
        </nav>

        <div className="header-right">
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            🤖 Powered by Advanced AI Agents
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
