import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🛡️</span>
              <span className="footer-logo-text">BrandShield</span>
            </div>
            <p className="footer-description">
              Turning social noise into product signal. The leading AI intelligence platform for modern product teams.
            </p>
            <div className="footer-social">
              <a href="#twitter" className="social-link">𝕏</a>
              <a href="#github" className="social-link">⚙️</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#integrations">Integrations</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#changelog">Changelog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookie">Cookie Policy</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2024 BrandShield Inc. All rights reserved.</p>
          <p className="footer-disclaimer">Built for the AI innovation revolution. Not for commercial use.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
