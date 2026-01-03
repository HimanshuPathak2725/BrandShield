import React from 'react';
import './TrendWidget.css';

function TrendWidget() {
  return (
    <div className="trend-widget">
      <div className="trend-header">
        <h3 className="trend-title">TREND DIRECTION</h3>
        <button className="trend-icon-btn">⏰</button>
      </div>

      <div className="trend-content">
        <div className="trend-indicator">
          <div className="trend-icon-circle">📈</div>
          <div className="trend-info">
            <p className="trend-percentage">+12%</p>
            <p className="trend-label">Positive Sentiment</p>
          </div>
        </div>

        <p className="trend-description">
          Compared to previous 10 minute window. Spikes detected in "Design" discussions.
        </p>

        <div className="sparkline">
          <div className="spark" style={{height: '30%'}}></div>
          <div className="spark" style={{height: '45%'}}></div>
          <div className="spark" style={{height: '35%'}}></div>
          <div className="spark" style={{height: '60%'}}></div>
          <div className="spark" style={{height: '50%'}}></div>
          <div className="spark" style={{height: '70%'}}></div>
          <div className="spark" style={{height: '65%'}}></div>
          <div className="spark" style={{height: '85%'}}></div>
          <div className="spark" style={{height: '80%'}}></div>
          <div className="spark highlight" style={{height: '90%'}}></div>
        </div>
      </div>
    </div>
  );
}

export default TrendWidget;
