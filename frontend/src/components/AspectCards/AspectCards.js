import React from 'react';
import { FaPalette, FaCreditCard, FaBolt, FaBatteryFull, FaTag, FaBullhorn, FaBoxOpen, FaExclamationTriangle, FaBug, FaShieldAlt } from 'react-icons/fa';
import './AspectCards.css';

function AspectCards({ findings = [] }) {
  
  // Map parsed categories to icons
  const getIconForCategory = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('hate') || cat.includes('speech')) return <FaExclamationTriangle />;
    if (cat.includes('frustration') || cat.includes('complaint')) return <FaBullhorn />;
    if (cat.includes('bug') || cat.includes('technical')) return <FaBug />;
    if (cat.includes('safety') || cat.includes('risk')) return <FaShieldAlt />;
    if (cat.includes('price') || cat.includes('cost')) return <FaCreditCard />;
    if (cat.includes('design') || cat.includes('look')) return <FaPalette />;
    if (cat.includes('perform') || cat.includes('speed')) return <FaBolt />;
    if (cat.includes('battery') || cat.includes('power')) return <FaBatteryFull />;
    if (cat.includes('market') || cat.includes('ad')) return <FaBullhorn />;
    if (cat.includes('product') || cat.includes('quality')) return <FaBoxOpen />;
    return <FaTag />;
  };

  const calculateSentimentPercentages = (items = []) => {
    if (!items || items.length === 0) {
      return { pos: 20, neu: 60, neg: 20 };
    }
    
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    items.forEach(item => {
      const sentiment = (item.sentiment_label || '').toLowerCase();
      if (sentiment.includes('positive')) {
        positive++;
      } else if (sentiment.includes('negative')) {
        negative++;
      } else {
        neutral++;
      }
    });
    
    const total = items.length;
    return {
      pos: Math.round((positive / total) * 100),
      neu: Math.round((neutral / total) * 100),
      neg: Math.round((negative / total) * 100)
    };
  };

  const getOverallStatus = (percentages) => {
    if (percentages.neg >= 50) return { status: 'NEUTRAL', color: 'red' };
    if (percentages.pos >= 50) return { status: 'NEUTRAL', color: 'green' };
    return { status: 'NEUTRAL', color: 'yellow' };
  };

  const aspects = findings.map((f, idx) => {
      const percentages = calculateSentimentPercentages(f.items);
      const status = getOverallStatus(percentages);
      
      return {
          id: idx,
          name: f.category || 'Unknown',
          icon: getIconForCategory(f.category),
          status: status.status,
          pos: percentages.pos,
          neu: percentages.neu,
          neg: percentages.neg,
          color: status.color
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
