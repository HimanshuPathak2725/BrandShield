import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="shield-icon">🛡️</div>
          <span className="logo-text">BrandShield</span>
        </Link>
        
        <nav className="nav-links">
          <a href="#product" className="nav-link">Product</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#about" className="nav-link">About</a>
        </nav>
        
        <Link to="/dashboard" className="cta-button" style={{ textDecoration: 'none' }}>Start Analysis</Link>
      </div>
    </header>
  );
}

export default Header;
