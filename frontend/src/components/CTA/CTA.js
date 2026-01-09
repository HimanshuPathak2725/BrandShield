import React from 'react';
import './CTA.css';

function CTA({ setCurrentPage }) {
  return (
    <section className="cta">
      <div className="cta-container">
        <h2 className="cta-title">Ready to decode your market?</h2>
        <p className="cta-subtitle">
          Join over 500 product teams using BrandShield to launch with confidence.
        </p>
        <div className="cta-buttons">
          <button className="cta-btn cta-btn-primary" onClick={() => setCurrentPage('dashboard')}>Get Started Free</button>
          <button className="cta-btn cta-btn-secondary">Schedule Demo</button>
        </div>
      </div>
    </section>
  );
}

export default CTA;
