import React from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import './SentimentScore.css';

function SentimentScore({ data }) {
  // If no data provided, show default demo content
  if (!data) {
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
            <div className="viz-icon"><FaThumbsUp size={24} /></div>
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

  const { sentiment_stats, risk_metrics, emotion_analysis } = data;
  
  // Calculate overall sentiment score (0-100)
  const positivePercent = sentiment_stats?.positive || 0;
  const negativePercent = sentiment_stats?.negative || 0;
  const neutralPercent = sentiment_stats?.neutral || 0;
  
  // Weighted score: positive contributes positively, negative negatively
  const overallScore = Math.round(
    (positivePercent * 100 - negativePercent * 50 + neutralPercent * 50) / 
    (positivePercent + negativePercent + neutralPercent + 1)
  );
  
  const sentimentLabel = overallScore >= 70 ? 'Mostly Positive' : 
                         overallScore >= 50 ? 'Mixed' : 'Mostly Negative';
  
  const sentimentClass = overallScore >= 70 ? 'badge-positive' : 
                         overallScore >= 50 ? 'badge-neutral' : 'badge-negative';
  
  const riskScore = risk_metrics?.score || 0;
  const riskLevel = risk_metrics?.level || 'LOW';
  
  // Calculate circle progress (0-283 is full circle)
  const circleProgress = 283 - (overallScore / 100 * 283);

  return (
    <div className="sentiment-score-card">
      <div className="score-content">
        <div className="score-info">
          <div className="score-label">AI SENTIMENT ANALYSIS</div>
          <div className="score-value">
            <span className="score-number">{overallScore}</span>
            <span className="score-max">/ 100</span>
          </div>
          
          <div className="score-badges">
            <span className={`badge ${sentimentClass}`}>{sentimentLabel}</span>
            <span className="badge-dot">•</span>
            <span className="score-confidence">Risk: {riskLevel}</span>
          </div>

          <p className="score-description">
            AI analyzed sentiment across web mentions. 
            Positive: <span className="highlight">{positivePercent.toFixed(1)}%</span>, 
            Neutral: <span className="highlight">{neutralPercent.toFixed(1)}%</span>, 
            Negative: <span className="highlight">{negativePercent.toFixed(1)}%</span>
          </p>
        </div>

        <div className="circular-viz">
          <svg viewBox="0 0 100 100" className="viz-svg">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#232648" strokeWidth="8"></circle>
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="transparent" 
              stroke={overallScore >= 70 ? '#0F9D58' : overallScore >= 50 ? '#F4B400' : '#DB4437'} 
              strokeDasharray="283" 
              strokeDashoffset={circleProgress} 
              strokeLinecap="round" 
              strokeWidth="8"
            ></circle>
          </svg>
          <div className="viz-icon">
            {overallScore >= 70 ? '😊' : overallScore >= 50 ? '😐' : '😟'}
          </div>
        </div>
      </div>

      <div className="volume-intensity">
        <div className="intensity-label">
          <span>Risk Level</span>
          <span style={{ 
            color: riskScore > 70 ? '#DB4437' : riskScore > 50 ? '#F4B400' : '#0F9D58',
            fontWeight: 'bold'
          }}>
            {riskScore}/100
          </span>
        </div>
        <div className="intensity-bar">
          <div 
            className="intensity-fill" 
            style={{ 
              width: `${riskScore}%`,
              backgroundColor: riskScore > 70 ? '#DB4437' : riskScore > 50 ? '#F4B400' : '#0F9D58'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default SentimentScore;
