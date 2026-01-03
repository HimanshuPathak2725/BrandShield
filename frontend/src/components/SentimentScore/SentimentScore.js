import React from 'react';
import './SentimentScore.css';

function SentimentScore() {
  return (
    <div className="sentiment-score-card">
      <div className="score-content">
        <div className="score-info">
          <div className="score-label">OVERALL SENTIMENT</div>
          <div className="score-value">
            <span className="score-number">78</span>
            <span className="score-max">/ 100</span>
          </div>
          
          <div className="score-badges">
            <span className="badge badge-positive">Mostly Positive</span>
            <span className="badge-dot">•</span>
            <span className="score-confidence">High Confidence (92%)</span>
          </div>

          <p className="score-description">
            Score calculated from <span className="highlight">12.4k</span> real-time reactions across social platforms in the last hour.
          </p>
        </div>

        <div className="circular-viz">
          <svg viewBox="0 0 100 100" className="viz-svg">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#232648" strokeWidth="8"></circle>
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="url(#scoreGradient)" strokeDasharray="283" strokeDashoffset="62" strokeLinecap="round" strokeWidth="8"></circle>
            <defs>
              <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#1224e2"></stop>
                <stop offset="100%" stopColor="#60a5fa"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="viz-icon">👍</div>
        </div>
      </div>

      <div className="volume-intensity">
        <div className="intensity-label">
          <span>Volume Intensity</span>
          <span>Very High</span>
        </div>
        <div className="intensity-bar">
          <div className="intensity-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default SentimentScore;
