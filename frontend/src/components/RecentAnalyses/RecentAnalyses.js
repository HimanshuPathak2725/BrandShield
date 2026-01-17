import React from 'react';
import './RecentAnalyses.css';

function RecentAnalyses() {
  const aiAgents = [
    {
      id: 1,
      name: 'Planning Agent',
      description: 'Research strategy',
      icon: '🗺️',
      status: 'Ready'
    },
    {
      id: 2,
      name: 'Search Agent',
      description: 'Web scraping',
      icon: '🔍',
      status: 'Ready'
    },
    {
      id: 3,
      name: 'RAG Agent',
      description: 'Semantic analysis',
      icon: '🧠',
      status: 'Ready'
    },
    {
      id: 4,
      name: 'Strategy Agent',
      description: 'Report generation',
      icon: '📊',
      status: 'Ready'
    }
  ];

  return (
    <div className="recent-analyses">
      <div className="analyses-header">
        <h3 className="analyses-title">AI Agent Pipeline</h3>
      </div>

      <div className="analyses-list">
        {aiAgents.map((agent) => (
          <div key={agent.id} className="analysis-item">
            <div className="analysis-icon">
              {agent.icon}
            </div>
            <div className="analysis-info">
              <h4 className="analysis-name">{agent.name}</h4>
              <p className="analysis-meta" style={{ marginTop: '4px' }}>
                {agent.description}
              </p>
            </div>
            <span style={{
              padding: '4px 8px',
              backgroundColor: '#0F9D58',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              ✓
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#3a85df',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#dce1e8',
        fontWeight: '500'
      }}>
        🔄 Multi-agent orchestration via LangGraph
      </div>
    </div>
  );
}

export default RecentAnalyses;
