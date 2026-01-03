import React, { useState } from 'react';
import './AnalysisForm.css';

function AnalysisForm({ setCurrentPage }) {
  const [target, setTarget] = useState('');
  const [dataSource, setDataSource] = useState('Reddit Discussions');

  const dataSources = [
    'Reddit Discussions',
    'Twitter',
    'News Articles',
    'Product Reviews',
    'TikTok',
    'YouTube'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage('results');
  };

  return (
    <div className="analysis-form-container">
      <div className="form-content">
        <h1 className="form-title">Start a New Analysis</h1>
        <p className="form-description">
          Monitor public reactions to any product, launch, or campaign in real time with AI-driven sentiment tracking.
        </p>

        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <label className="form-label">TARGET</label>
            <div className="input-wrapper">
              <span className="input-icon">🔍</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Tesla Cybertruck, Nike Air Max..."
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">DATA SOURCE</label>
            <select
              className="form-select"
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
            >
              {dataSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            <span className="btn-icon">●</span>
            Start Monitoring
          </button>
        </form>
      </div>
    </div>
  );
}

export default AnalysisForm;
