import React from 'react';
import './VelocityGauge.css';

const VelocityGauge = ({ currentVelocity, predictedPeak, trendProbability }) => {
  // Normalize trend probability (0-100) to gauge angle (0-180)
  // 0% -> 0deg (Green)
  // 100% -> 180deg (Red)
  const angle = (trendProbability / 100) * 180;
  
  // Clamp angle
  const clampedAngle = Math.max(0, Math.min(180, angle));

  return (
    <div className="velocity-gauge">
      <div className="gauge-header">
        <h3>Crisis Velocity Forecast</h3>
      </div>
      <div className="gauge-body">
        <div className="gauge-chart">
           {/* Simple CSS Gauge */}
           <div className="gauge-arc"></div>
           <div className="gauge-cover"></div>
           <div 
             className="gauge-needle" 
             style={{ transform: `rotate(${clampedAngle - 90}deg)` }} // -90 because 0deg is usually 3 o'clock, we want 9 o'clock start
           ></div>
        </div>
        
        <div className="velocity-stats">
          <div className="stat">
            <span className="stat-label">Current Vol</span>
            <span className="stat-value">{currentVelocity} /min</span>
          </div>
          <div className="stat">
            <span className="stat-label">Predicted Peak</span>
            <span className="stat-value">~{predictedPeak} /min</span>
          </div>
          <div className="stat">
            <span className="stat-label">Trend Prob</span>
            <span className="stat-value">{trendProbability.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityGauge;
