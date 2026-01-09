import React from 'react';
import './DemoAnalysis.css';

function DemoAnalysis() {
  const aiFeatures = [
    {
      id: 1,
      title: 'Advanced RAG',
      description: 'Semantic search with vector embeddings for hidden crisis patterns.',
      icon: '🧠'
    },
    {
      id: 2,
      title: 'Multi-Agent AI',
      description: 'Planning, Search, Evaluator, and Strategy agents working in concert.',
      icon: '🤖'
    },
    {
      id: 3,
      title: 'Crisis Prediction',
      description: 'Real-time risk scoring with emotion analysis and trend detection.',
      icon: '⚡'
    }
  ];

  return (
    <section className="demo-analysis">
      <div className="demo-header">
        <h2 className="demo-title">AI CAPABILITIES</h2>
      </div>

      <div className="demo-grid">
        {aiFeatures.map((feature) => (
          <div key={feature.id} className="demo-card">
            <div className="demo-icon">{feature.icon}</div>
            <h3 className="demo-card-title">{feature.title}</h3>
            <p className="demo-description">{feature.description}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#6a9dd4',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#f8f2f2'
      }}>
        💡 Powered by LangGraph, Google Gemini, and FAISS Vector Database
      </div>
    </section>
  );
}

export default DemoAnalysis;
