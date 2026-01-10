import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="engine-badge">Live Intelligence Engine v2.0</span>
        <div className="status-lights">
          <span className="light red"></span>
          <span className="light yellow"></span>
          <span className="light green"></span>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3 className="metric-label">Sentiment Score</h3>
          <div className="metric-value">84%</div>
          <div className="metric-change positive" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaArrowUp /> +12%
          </div>
        </div>

        <div className="metric-card">
          <h3 className="metric-label">Volume</h3>
          <div className="metric-value">12.5k</div>
          <div className="metric-change">Mentions / hr</div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">Live Reaction Trend</h3>
          <span className="chart-period">Last 24h</span>
        </div>
        <div className="chart">
          <div className="bar" style={{ height: '40%' }}></div>
          <div className="bar" style={{ height: '50%' }}></div>
          <div className="bar" style={{ height: '45%' }}></div>
          <div className="bar" style={{ height: '55%' }}></div>
          <div className="bar" style={{ height: '60%' }}></div>
          <div className="bar" style={{ height: '65%' }}></div>
          <div className="bar" style={{ height: '70%' }}></div>
          <div className="bar" style={{ height: '100%' }}></div>
        </div>
      </div>

      <div className="signals-section">
        <h3 className="signals-title">RECENT SIGNALS</h3>
        <div className="signal-item">
          <span className="signal-dot green"></span>
          <div className="signal-content">
            <p className="signal-text">"The new battery life is actually insane..."</p>
            <span className="signal-meta">Reddit • r/tech • 2~ ago</span>
          </div>
        </div>
        <div className="signal-item">
          <span className="signal-dot orange"></span>
          <div className="signal-content">
            <p className="signal-text">"UI feels a bit sluggish on older devices?"</p>
            <span className="signal-meta">Twitter • @tech_follower • 5m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
