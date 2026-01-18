import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './DashboardHeader.css';

function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">BrandShield AI</span>
          </Link>
        </div>

        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/insights" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Insights</NavLink>
          <NavLink to="/trends" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Trends</NavLink>
        </nav>

        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
