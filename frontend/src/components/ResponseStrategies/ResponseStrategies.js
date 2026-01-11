import React, { useState } from 'react';
import './ResponseStrategies.css';

function ResponseStrategies() {
  const [simulatedResponse, setSimulatedResponse] = useState(null);

  const strategies = [
    {
      id: 'safe',
      title: 'Safe Response',
      risk: 'Low Risk | Conservative',
      riskColor: 'text-green-400',
      icon: 'shield',
      description: 'Focuses on technical facts and operational timelines without direct emotional engagement.',
      outcome: 'Stable Reaction',
      outcomeColor: 'bg-blue-400'
    },
    {
      id: 'empathetic',
      title: 'Empathetic Response',
      risk: 'Balanced | Trust-Building',
      riskColor: 'text-primary',
      icon: 'favorite',
      description: 'Acknowledges customer frustration directly and provides immediate value-based resolution.',
      outcome: 'Positive Recovery',
      outcomeColor: 'bg-green-400',
      recommended: true
    },
    {
      id: 'aggressive',
      title: 'Aggressive Response',
      risk: 'High Risk | Defensive',
      riskColor: 'text-red-500',
      icon: 'campaign',
      description: 'Counter-narrative strategy highlighting industry-wide challenges and competitor pricing.',
      outcome: 'Polarized Reaction',
      outcomeColor: 'bg-red-400'
    }
  ];

  const handleSimulate = (strategyId) => {
    setSimulatedResponse(strategyId);
    setTimeout(() => setSimulatedResponse(null), 2000);
  };

  return (
    <section className="response-strategies-section">
      <h3 className="response-strategies-title">AI-Generated Response Strategies</h3>
      <div className="response-strategies-grid">
        {strategies.map((strategy) => (
          <div 
            key={strategy.id} 
            className={`response-card ${strategy.recommended ? 'recommended' : ''} ${strategy.id}`}
          >
            {strategy.recommended && (
              <div className="recommended-badge">Recommended</div>
            )}
            <div className="response-header">
              <div>
                <h4 className="response-title">{strategy.title}</h4>
                <p className={`response-risk ${strategy.riskColor}`}>
                  {strategy.risk}
                </p>
              </div>
              <span className={`material-symbols-outlined response-icon ${strategy.id}-icon`}>
                {strategy.icon}
              </span>
            </div>
            <p className="response-description">
              {strategy.description}
            </p>
            <div className="response-outcome">
              <p className="outcome-label">Expected Outcome</p>
              <div className="outcome-display">
                <span className={`outcome-dot ${strategy.id}-dot`}></span>
                <span className="outcome-text">{strategy.outcome}</span>
              </div>
            </div>
            <button 
              className={`simulate-btn ${strategy.recommended ? 'recommended-btn' : ''}`}
              onClick={() => handleSimulate(strategy.id)}
              disabled={simulatedResponse === strategy.id}
            >
              {simulatedResponse === strategy.id ? 'Simulating...' : 'Simulate Response'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResponseStrategies;
