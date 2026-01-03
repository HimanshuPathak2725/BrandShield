import React from 'react';
import './ResultsHeader.css';

function ResultsHeader({ setCurrentPage }) {
  return (
    <header className="results-header">
      <div className="results-header-container">
        <div className="header-left">
          <div className="header-logo">
            <span className="logo-icon">🛡️</span>
            <h1 className="logo-text">BrandShield</h1>
          </div>
          <div className="header-divider"></div>
          <p className="page-title">Live Public Reaction Monitor</p>
        </div>

        <div className="header-right">
          <select className="product-dropdown">
            <option>iPhone 15 Pro Max</option>
            <option>Tesla Cybertruck</option>
            <option>GTA VI Trailer</option>
          </select>

          <div className="platform-toggles">
            <button className="platform-btn">📱 Reddit</button>
            <button className="platform-btn">𝕏 X (Twitter)</button>
          </div>

          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ResultsHeader;
