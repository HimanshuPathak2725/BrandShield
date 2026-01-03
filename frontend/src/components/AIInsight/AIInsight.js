import React from 'react';
import './AIInsight.css';

function AIInsight() {
  return (
    <section className="ai-insight-section">
      <div className="ai-insight-card">
        <div className="ai-icon">✨</div>
        <div className="ai-content">
          <div className="ai-header">
            <h4 className="ai-title">AI Insight Summary</h4>
            <span className="ai-badge">Just now</span>
          </div>
          <p className="ai-text">
            Overall sentiment is trending positive <span className="highlight">(+12%)</span> driven by the new <span className="highlight">Design</span> changes, specifically the titanium material. However, <span className="highlight">Pricing</span> remains a significant friction point for early adopters, generating 60% negative reactions in that category. Watch for potential supply chain complaints affecting sentiment in the next hour.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AIInsight;
