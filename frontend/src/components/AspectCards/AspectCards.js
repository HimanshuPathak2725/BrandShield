import React from 'react';
import { FaPalette, FaCreditCard, FaBolt, FaBatteryFull } from 'react-icons/fa';
import './AspectCards.css';

function AspectCards() {
  const aspects = [
    { id: 1, name: 'Design', icon: <FaPalette />, status: 'LIKED', pos: 80, neu: 10, neg: 10, color: 'green' },
    { id: 2, name: 'Price', icon: <FaCreditCard />, status: 'DISLIKED', pos: 20, neu: 20, neg: 60, color: 'red' },
    { id: 3, name: 'Performance', icon: <FaBolt />, status: 'LIKED', pos: 90, neu: 5, neg: 5, color: 'green' },
    { id: 4, name: 'Battery', icon: <FaBatteryFull />, status: 'MIXED', pos: 40, neu: 20, neg: 40, color: 'yellow' }
  ];

  const getStatusColor = (color) => {
    const colors = {
      green: 'status-liked',
      red: 'status-disliked',
      yellow: 'status-mixed'
    };
    return colors[color] || '';
  };

  return (
    <section className="aspect-section">
      <div className="aspect-header">
        <h3 className="aspect-title">What People Are Talking About</h3>
        <button className="view-all-btn">View All Aspects</button>
      </div>

      <div className="aspect-grid">
        {aspects.map(aspect => (
          <div key={aspect.id} className="aspect-card">
            <div className="aspect-card-header">
              <div className="aspect-name">
                <span className="aspect-icon">{aspect.icon}</span>
                <h4 className="aspect-h4">{aspect.name}</h4>
              </div>
              <span className={`aspect-badge ${getStatusColor(aspect.color)}`}>
                {aspect.status}
              </span>
            </div>

            <div className="aspect-bar-container">
              <div className="aspect-bar">
                <div className="bar-segment pos" style={{width: `${aspect.pos}%`}}></div>
                <div className="bar-segment neu" style={{width: `${aspect.neu}%`}}></div>
                <div className="bar-segment neg" style={{width: `${aspect.neg}%`}}></div>
              </div>
            </div>

            <div className="aspect-stats">
              <span className="stat-label pos">{aspect.pos}% Pos</span>
              <span className="stat-label neu">{aspect.neu}% Neu</span>
              <span className="stat-label neg">{aspect.neg}% Neg</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AspectCards;
