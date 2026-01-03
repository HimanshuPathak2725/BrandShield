import React from 'react';
import './DemoAnalysis.css';

function DemoAnalysis() {
  const demoAnalyses = [
    {
      id: 1,
      title: 'BMW EV Launch',
      description: 'Sentiment analysis on new IX series release.',
      icon: '🚗'
    },
    {
      id: 2,
      title: 'iPhone Launch',
      description: 'Global reaction tracking for latest keynote.',
      icon: '📱'
    },
    {
      id: 3,
      title: 'Headphones Pricing',
      description: 'Market response to premium audio pricing.',
      icon: '🎧'
    }
  ];

  return (
    <section className="demo-analysis">
      <div className="demo-header">
        <h2 className="demo-title">TRY A DEMO ANALYSIS</h2>
      </div>

      <div className="demo-grid">
        {demoAnalyses.map((demo) => (
          <div key={demo.id} className="demo-card">
            <div className="demo-icon">{demo.icon}</div>
            <h3 className="demo-card-title">{demo.title}</h3>
            <p className="demo-description">{demo.description}</p>
            <button className="demo-btn">View Analysis →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DemoAnalysis;
