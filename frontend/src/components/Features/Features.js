import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      id: 1,
      icon: '⚡',
      title: 'Real-Time Opinion Analysis',
      description: 'Instant feedback loops from millions of data points. Watch sentiment shift the moment your product drops.'
    },
    {
      id: 2,
      icon: '🔍',
      title: 'Aspect-Level Insights',
      description: 'Don\'t just know "people hate it." Know they have the battery life but love the display. Drill down to specific feature feedback.'
    },
    {
      id: 3,
      icon: '📈',
      title: 'Trend Direction Prediction',
      description: 'AI forecasting for viral coefficient and churn risk. Our models predict where the conversation is heading next.'
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Intelligence beyond simple keywords</h2>
          <p className="features-subtitle">
            BrandShield goes deeper than basic social listening. We use LLMs to understand context, sarcasm, and specific product attributes.
          </p>
        </div>

        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
