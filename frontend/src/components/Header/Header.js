import React from 'react';
import './Header.css';

function Header({ setCurrentPage }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="shield-icon">🛡️</div>
          <span className="logo-text">BrandShield</span>
        </div>
        
        <nav className="nav-links">
          <a href="#product" className="nav-link">Product</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#about" className="nav-link">About</a>
        </nav>
        
        <button className="cta-button" onClick={() => setCurrentPage('dashboard')}>Start Analysis</button>
      </div>
    </header>
  );
}

export default Header;
