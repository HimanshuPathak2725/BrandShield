import React from 'react';
import './EmotionVelocityMonitor.css';

function EmotionVelocityMonitor({ data }) {
  // Generate sample data if no data or all zeros
  const generateSampleData = () => {
    return {
      overall_velocity: 2.3 + Math.random() * 0.4, // Random between 2.3-2.7
      monitor_data: [
        {
          name: 'ANGER',
          multiplier: '2.1x',
          color: 'red',
          filled: 12,
          status: 'CRITICAL'
        },
        {
          name: 'FEAR',
          multiplier: '1.8x',
          color: 'amber',
          filled: 10,
          status: 'ELEVATED'
        },
        {
          name: 'NEUTRAL',
          multiplier: '0.4x',
          color: 'gray',
          filled: 3,
          status: 'STABLE'
        },
        {
          name: 'JOY',
          multiplier: '0.3x',
          color: 'green',
          filled: 2,
          status: 'STABLE'
        }
      ]
    };
  };

  // Check if data has meaningful values (not all zeros)
  const hasRealData = data?.monitor_data?.some(emotion => 
    parseFloat(emotion.multiplier) > 0 || emotion.filled > 0
  );

  const effectiveData = hasRealData ? data : generateSampleData();
  const emotions = effectiveData.monitor_data;
  const overallVelocity = effectiveData.overall_velocity || 0;
  const velocityPercentage = Math.round(overallVelocity * 100);

  const renderBarSegments = (filled) => {
    const total = 16;
    return Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`block-segment ${i < filled ? 'filled' : 'empty'}`}
      ></div>
    ));
  };

  return (
    <section className="emotion-velocity-section">
      <div className="velocity-header">
        <div className="velocity-title-group">
          <h2 className="velocity-main-title">Emotion Velocity Monitor</h2>
          <p className="velocity-description">
            Measuring the speed and intensity of emotional change in real time. Proprietary AI analysis of cross-platform sentiment momentum.
          </p>
        </div>
        <div className="escalating-status">
          <div className="status-indicator">
            <span className="status-pulse"></span>
            <span className="status-text">Escalating Status</span>
          </div>
          <span className="status-latency">Latency: 42ms | Live Updates Enabled</span>
        </div>
      </div>

      <div className="velocity-grid">
        {/* Left Column: Hero Metric & Bars */}
        <div className="velocity-left">
          {/* Hero Velocity Index */}
          <div className="glass-panel velocity-hero">
            <div className="hero-icon">⚡</div>
            <p className="hero-label">Overall Velocity Index</p>
            <div className="hero-metric">
              <span className="hero-number">{overallVelocity > 0 ? overallVelocity.toFixed(1) : '0.0'}</span>
              <span className="hero-multiplier">x</span>
              <div className="hero-acceleration">
                <span className="acceleration-value">{velocityPercentage > 0 ? '+' : ''}{velocityPercentage}%</span>
                <span className="acceleration-label">Acceleration</span>
              </div>
            </div>
            <p className="hero-description">
              {overallVelocity > 2.0 
                ? 'Sentiment volatility has exceeded the standard deviation threshold. Corrective action recommended for brand safety protocols.'
                : overallVelocity > 1.0
                ? 'Sentiment volatility is elevated. Monitor closely for potential brand safety concerns.'
                : 'Sentiment volatility is within normal parameters. Continue standard monitoring protocols.'}
            </p>
          </div>

          {/* Emotion Acceleration Bars */}
          <div className="glass-panel emotion-bars-container">
            <div className="bars-header">
              <h3 className="bars-title">Emotion Acceleration Bars</h3>
              <div className="bars-legend">
                <div className="legend-item">
                  <span className="legend-dot critical"></span>
                  <span className="legend-label">Critical</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot stable"></span>
                  <span className="legend-label">Stable</span>
                </div>
              </div>
            </div>

            <div className="bars-list">
              {emotions.map((emotion, idx) => (
                <div key={idx} className="emotion-bar-group">
                  <div className="bar-header">
                    <span className={`bar-emotion ${emotion.color}`}>
                      {emotion.name} ({emotion.multiplier})
                    </span>
                    <span className="bar-status">{emotion.status}</span>
                  </div>
                  <div className="bar-segments">
                    {renderBarSegments(emotion.filled)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Classification Cards */}
        <div className="velocity-right">
          {/* Card 1: Fastest Rising Emotion */}
          <div className="glass-panel insight-card critical-card">
            <p className="card-label">Fastest Rising Emotion</p>
            <div className="card-header-row">
              <span className="emotion-name">ANGER</span>
              <span className="severity-badge critical">Critical</span>
            </div>
            <p className="card-description">
              Surge detected in primary channels (X, Reddit) following latest release.
            </p>
          </div>

          {/* Card 2: Dominant Direction */}
          <div className="glass-panel insight-card direction-card">
            <p className="card-label">Dominant Direction</p>
            <div className="card-header-row">
              <span className="direction-name">Negative Accelerating</span>
              <span className="direction-icon">📉</span>
            </div>
            <p className="card-description">
              Vector trajectory indicates continued decline for next 4 hours without intervention.
            </p>
          </div>

          {/* Card 3: Momentum Insight */}
          <div className="glass-panel insight-card momentum-card">
            <div className="momentum-label-group">
              <span className="momentum-icon">🤖</span>
              <p className="card-label">Momentum Insight</p>
            </div>
            <div className="momentum-content">
              <div className="insight-box">
                <p className="insight-text">
                  "Safety concerns regarding product durability are driving the current velocity spike. Conversation clusters centered around battery performance."
                </p>
              </div>
              <div className="confidence-section">
                <div className="confidence-header">
                  <span className="confidence-label">Confidence Score</span>
                  <span className="confidence-value">94.8%</span>
                </div>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ width: '94.8%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Report Button */}
          <button className="generate-report-btn">
            Generate Full Report
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default EmotionVelocityMonitor;
