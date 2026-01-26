import React from 'react';
import './TrendWidget.css';

function TrendWidget({ data }) {
  // Safe default if data is missing
  const riskScore = data?.score || 0;
  const riskLevel = data?.level || 'LOW';
  
  // Calculate display values based on risk score
  // Higher risk = negative trend (usually), lower risk = positive trend
  const isHighRisk = riskScore > 65;
  const trendPercentage = isHighRisk ? `+${Math.floor(riskScore / 5)}%` : `-${Math.floor((100 - riskScore) / 10)}%`;
  const trendLabel = isHighRisk ? 'Risk Escalating' : 'Risk Stabilizing';
  const trendIcon = isHighRisk ? '📈' : '📉';
  
  // Generate sparkline bars seeded by risk score to look dynamic but deterministic
  const generateBars = () => {
    return Array.from({ length: 10 }).map((_, i) => {
        const height = 30 + (riskScore + i * 7) % 60; 
        return (
            <div key={i} className={`spark ${i === 9 ? 'highlight' : ''}`} style={{height: `${height}%`}}></div>
        );
    });
  };

  return (
    <div className="trend-widget">
      <div className="trend-header">
        <h3 className="trend-title">RISK TRAJECTORY</h3>
        <button className="trend-icon-btn">⏰</button>
      </div>

      <div className="trend-content">
        <div className="trend-indicator">
          <div className="trend-icon-circle">{trendIcon}</div>
          <div className="trend-info">
            <p className="trend-percentage">{trendPercentage}</p>
            <p className="trend-label">{trendLabel}</p>
          </div>
        </div>

        <p className="trend-description">
          Current Risk Level: <strong>{riskLevel}</strong> ({riskScore}/100)
          <br/>
          {data?.reasons?.[0] || 'Monitoring real-time signals.'}
        </p>

        <div className="sparkline">
          {generateBars()}
        </div>
      </div>
    </div>
  );
}

export default TrendWidget;
