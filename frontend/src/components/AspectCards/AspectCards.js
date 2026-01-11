import React from 'react';
import { FaPalette, FaCreditCard, FaBolt, FaBatteryFull, FaTag, FaBullhorn, FaBoxOpen } from 'react-icons/fa';
import './AspectCards.css';

function AspectCards({ findings = [] }) {
  
  // Map parsed categories to icons
  const getIconForCategory = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('price') || cat.includes('cost')) return <FaCreditCard />;
    if (cat.includes('design') || cat.includes('look')) return <FaPalette />;
    if (cat.includes('perform') || cat.includes('speed')) return <FaBolt />;
    if (cat.includes('battery') || cat.includes('power')) return <FaBatteryFull />;
    if (cat.includes('market') || cat.includes('ad')) return <FaBullhorn />;
    if (cat.includes('product') || cat.includes('quality')) return <FaBoxOpen />;
    return <FaTag />;
  };

  const getSentimentDetails = (sentimentStr = '') => {
      const s = sentimentStr.toLowerCase();
      if (s.includes('positive')) return { status: 'LIKED', color: 'green', pos: 80, neu: 15, neg: 5 };
      if (s.includes('negative')) return { status: 'DISLIKED', color: 'red', pos: 10, neu: 20, neg: 70 };
      if (s.includes('mixed')) return { status: 'MIXED', color: 'yellow', pos: 40, neu: 20, neg: 40 };
      return { status: 'NEUTRAL', color: 'yellow', pos: 20, neu: 60, neg: 20 };
  };

  const aspects = findings.map((f, idx) => {
      const details = getSentimentDetails(f.sentiment);
      return {
          id: idx,
          name: f.category,
          icon: getIconForCategory(f.category),
          status: details.status,
          pos: details.pos,
          neu: details.neu,
          neg: details.neg,
          color: details.color
      };
  });

  // Fallback if no real data
  if (aspects.length === 0) {
      return (
        <section className="aspect-section">
             <div className="aspect-header">
                <h3 className="aspect-title">Key Discussions</h3>
             </div>
             <div style={{padding: '20px', color: '#6b7280', textAlign: 'center'}}>
                 No specific aspect data found in this analysis.
             </div>
        </section>
      );
  }

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
