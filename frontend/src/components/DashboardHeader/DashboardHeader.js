import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './DashboardHeader.css';

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <div className="header-left">
          <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">BrandShield AI</span>
          </Link>
        </div>

        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ textDecoration: 'none' }}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ textDecoration: 'none' }}>Dashboard</NavLink>
          <NavLink to="/insights" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ textDecoration: 'none' }}>Insights</NavLink>
          <NavLink to="/trends" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ textDecoration: 'none' }}>Trends</NavLink>
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
