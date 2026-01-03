import React from 'react';
import './RecentAnalyses.css';

function RecentAnalyses() {
  const analyses = [
    {
      id: 1,
      name: 'Nike Air Jordan',
      source: 'Reddit',
      timestamp: '2h ago',
      badge: 'Insane',
      badgeColor: 'orange'
    },
    {
      id: 2,
      name: 'SpaceX Starship',
      source: 'Twitter',
      timestamp: '1d ago',
      badge: 'Trending',
      badgeColor: 'blue'
    },
    {
      id: 3,
      name: 'OpenAI Leadership',
      source: 'News',
      timestamp: '3d ago',
      badge: 'Breaking',
      badgeColor: 'purple'
    },
    {
      id: 4,
      name: 'PS5 Pro Release',
      source: 'Reddit',
      timestamp: '5d ago',
      badge: 'Viral',
      badgeColor: 'orange'
    }
  ];

  const getIcon = (source) => {
    const icons = {
      'Reddit': '📱',
      'Twitter': '🐦',
      'News': '📰',
      'TikTok': '🎵',
      'YouTube': '📺'
    };
    return icons[source] || '📱';
  };

  return (
    <div className="recent-analyses">
      <div className="analyses-header">
        <h3 className="analyses-title">Recent Analyses</h3>
        <button className="refresh-btn">🔄</button>
      </div>

      <div className="analyses-list">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="analysis-item">
            <div className="analysis-icon">
              {getIcon(analysis.source)}
            </div>
            <div className="analysis-info">
              <h4 className="analysis-name">{analysis.name}</h4>
              <span className={`analysis-badge badge-${analysis.badgeColor}`}>
                {analysis.badge}
              </span>
              <p className="analysis-meta">
                {analysis.source} • {analysis.timestamp}
              </p>
            </div>
            <button className="analysis-action">→</button>
          </div>
        ))}
      </div>

      <button className="view-all-btn">VIEW ALL HISTORY</button>
    </div>
  );
}

export default RecentAnalyses;
