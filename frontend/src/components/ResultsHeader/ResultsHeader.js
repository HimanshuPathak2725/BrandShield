import React from 'react';
import './ResultsHeader.css';

function ResultsHeader({ setCurrentPage, brand }) {
  return (
    <header className="results-header">
      <div className="results-header-container">
        <div className="header-left">
          <div className="header-logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🛡️</span>
            <h1 className="logo-text">BrandShield AI</h1>
          </div>
          <div className="header-divider"></div>
          <p className="page-title">AI Crisis Analysis Dashboard</p>
        </div>

        <div className="header-right">
          <div style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            {brand || 'Analysis'}
          </div>

          <button 
            className="platform-btn"
            onClick={() => setCurrentPage('home')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e8eaed',
              color: '#1f2937',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            ← Home
          </button>

          <button 
            className="platform-btn"
            onClick={() => setCurrentPage('dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              color: '#1f2937',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            + New Analysis
          </button>

          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">AI ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ResultsHeader;
