import React from 'react';
import './DashboardHeader.css';

function DashboardHeader({ setCurrentPage }) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <div className="header-left">
          <div className="logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">BrandShield</span>
          </div>
        </div>

        <nav className="header-nav">
          <a href="#dashboard" className="nav-link active" onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }}>Dashboard</a>
          <a href="#insights" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('insights'); }}>Insights</a>
          <a href="#trends" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('trends'); }}>Trends</a>
        </nav>

        <div className="header-right">
          <button className="notification-btn">
            <span className="bell-icon">🔔</span>
            <span className="notification-dot"></span>
          </button>
          <button className="profile-btn">👤</button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
