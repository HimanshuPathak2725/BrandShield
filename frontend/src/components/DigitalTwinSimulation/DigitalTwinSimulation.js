import React from 'react';
import './DigitalTwinSimulation.css';

function DigitalTwinSimulation() {
  return (
    <section className="digital-twin-section">
      <h3 className="digital-twin-title">Digital Twin Simulation Results</h3>
      <div className="simulation-grid">
        {/* Public Reaction Card */}
        <div className="simulation-card glass-panel">
          <div className="card-header">
            <span className="card-icon">👥</span>
            <h4 className="card-title">Public Reaction</h4>
          </div>
          <div className="card-content">
            <div className="metric-row">
              <span className="metric-label">Sentiment Shift</span>
              <span className="metric-value text-green-400">+34%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '34%' }}></div>
            </div>
            <div className="metric-row">
              <span className="metric-label">Predicted Volume</span>
              <span className="metric-value">High</span>
            </div>
            <div className="emotion-section">
              <span className="emotion-label">Dominant Emotion</span>
              <p className="emotion-text">Relief / Cautious Optimism</p>
            </div>
          </div>
        </div>

        {/* Media Reaction Card */}
        <div className="simulation-card glass-panel">
          <div className="card-header">
            <span className="card-icon">📰</span>
            <h4 className="card-title">Media Reaction</h4>
          </div>
          <div className="card-content">
            <div className="coverage-section">
              <span className="coverage-label">Coverage Likelihood</span>
              <div className="coverage-bars">
                <div className="coverage-bar filled"></div>
                <div className="coverage-bar filled"></div>
                <div className="coverage-bar filled"></div>
                <div className="coverage-bar empty"></div>
                <div className="coverage-bar empty"></div>
              </div>
            </div>
            <div className="narrative-section">
              <span className="narrative-label">Narrative Framing</span>
              <ul className="narrative-list">
                <li className="narrative-item">
                  <span className="bullet">•</span>
                  <span>"Brand takes responsibility"</span>
                </li>
                <li className="narrative-item">
                  <span className="bullet">•</span>
                  <span>"Transparent communication"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Competitor Reaction Card */}
        <div className="simulation-card glass-panel">
          <div className="card-header">
            <span className="card-icon">📊</span>
            <h4 className="card-title">Competitor Reaction</h4>
          </div>
          <div className="card-content">
            <div className="action-box target-move">
              <p className="action-label">Target Move</p>
              <p className="action-text">Competitor A likely to launch "Price Comparison" campaign within 4 hours.</p>
            </div>
            <div className="action-box defensive-action">
              <p className="action-label">Defensive Action</p>
              <p className="action-text">Competitor B expected to remain neutral.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DigitalTwinSimulation;
