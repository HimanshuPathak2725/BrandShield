import React from 'react';
import { Link } from 'react-router-dom';
import './ResultsHeader.css';

function ResultsHeader({ brand }) {
  return (
    <header className="results-header">
      <div className="results-header-container">
        <div className="header-left">
          <Link to="/" className="header-logo" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="logo-icon">🛡️</span>
            <h1 className="logo-text">BrandShield AI</h1>
          </Link>
          <div className="header-divider"></div>
          <p className="page-title">Dashboard</p>
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

          <Link 
            to="/"
            className="platform-btn"
            style={{
              padding: '8px 16px',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '12px',
              textDecoration: 'none'
            }}
          >
            ← Home
          </Link>

          <Link 
            to="/dashboard"
            className="platform-btn"
            style={{
              padding: '8px 16px',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            + New Analysis
          </Link>

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
