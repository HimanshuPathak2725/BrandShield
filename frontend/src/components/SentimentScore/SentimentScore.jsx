import React from 'react';
import { FaThumbsUp, FaFrown, FaMeh } from 'react-icons/fa';
import './SentimentScore.css';

function SentimentScore({ data }) {
  // Use data if provided, otherwise default to 0
  const positive = data?.positive || 0;
  const negative = data?.negative || 0;
  const neutral = data?.neutral || 0;
  
  // Calculate total sentiment score (weighted)
  // Simple formula: (Positive% * 1) + (Neutral% * 0.5)
  const score = Math.round(positive + (neutral * 0.5));
  
  const getLabel = () => {
      if (score >= 70) return { text: "Mostly Positive", color: "badge-positive", icon: <FaThumbsUp size={24} /> };
      if (score >= 40) return { text: "Mixed Results", color: "badge-neutral", icon: <FaMeh size={24} /> };
      return { text: "Mostly Negative", color: "badge-negative", icon: <FaFrown size={24} /> };
  };

  const labelInfo = getLabel();

  return (
      <div className="sentiment-score-card">
        <div className="score-content">
          <div className="score-info">
            <div className="score-label">OVERALL SENTIMENT</div>
            <div className="score-value">
              <span className="score-number">{score}</span>
              <span className="score-max">/ 100</span>
            </div>
            
            <div className="score-badges">
              <span className={`badge ${labelInfo.color}`}>{labelInfo.text}</span>
              <span className="badge-dot">•</span>
              <span className="score-confidence">Confidence High</span>
            </div>

            <p className="score-description">
              Analysis based on real-time data.<br/>
              <span style={{color: '#22c55e'}}>Positive: {positive}%</span> • 
              <span style={{color: '#ef4444'}}> Negative: {negative}%</span>
            </p>
          </div>

          <div className="circular-viz">
            <svg viewBox="0 0 100 100" className="viz-svg">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#232648" strokeWidth="8"></circle>
              {/* Calculate strokeDasharray based on score */}
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="url(#scoreGradient)" strokeDasharray={`${score * 2.83} 283`} strokeDashoffset="0" strokeLinecap="round" strokeWidth="8" transform="rotate(-90 50 50)"></circle>
              <defs>
                <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#1224e2"></stop>
                  <stop offset="100%" stopColor="#60a5fa"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="viz-icon">{labelInfo.icon}</div>
          </div>
        </div>

        <div className="volume-intensity">
          <div className="intensity-label">
            <span>Sentiment Distribution</span>
            <span>{positive}% Positive</span>
          </div>
          <div className="intensity-bar" style={{display: 'flex', overflow: 'hidden', borderRadius: '4px'}}>
            {/* Visual bar composed of 3 segments */}
             <div style={{height: '100%', width: `${positive}%`, backgroundColor: '#22c55e'}}></div>
             <div style={{height: '100%', width: `${neutral}%`, backgroundColor: '#eab308'}}></div>
             <div style={{height: '100%', width: `${negative}%`, backgroundColor: '#ef4444'}}></div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px', color: '#9ca3af'}}>
              <span>Pos</span>
              <span>Neu</span>
              <span>Neg</span>
          </div>
        </div>
      </div>
  );
}

export default SentimentScore;