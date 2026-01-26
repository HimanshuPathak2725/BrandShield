import React from 'react';
import { Link } from 'react-router-dom';
import './CTA.css';

function CTA() {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2 className="cta-title">Ready to decode your market?</h2>
        <p className="cta-subtitle">
          Join over 500 product teams using BrandShield to launch with confidence.
        </p>
        <div className="cta-buttons">
          <Link to="/dashboard" className="cta-btn cta-btn-primary" style={{ textDecoration: 'none' }}>Get Started Free</Link>
          <button className="cta-btn cta-btn-secondary">Schedule Demo</button>
        </div>
      </div>
    </section>
  );
}

export default CTA;
