import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import './AnalysisForm.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AnalysisForm() {
  const navigate = useNavigate();
  const [target, setTarget] = useState('');
  const [dataSource, setDataSource] = useState('Reddit Discussions');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dataSources = [
    'Reddit Discussions',
    'Twitter',
    'News Articles',
    'Product Reviews',
    'TikTok',
    'YouTube'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!target.trim()) {
      setError('Please enter a brand name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: target,
          data_source: dataSource
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }
      
      const data = await response.json();
      
      // Store session data in localStorage for ResultsPage
      localStorage.setItem('currentAnalysis', JSON.stringify(data));
      
      navigate('/results');
    } catch (err) {
      setError(err.message || 'Failed to start analysis. Please check your API configuration.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-form-container">
      <div className="form-content">
        <h1 className="form-title">AI-Powered Brand Crisis Analysis</h1>
        <p className="form-description">
          Real-time sentiment analysis and crisis prediction using advanced AI agents and semantic search.
        </p>

        {error && (
          <div className="error-message" style={{
            backgroundColor: '#fee',
            color: '#c00',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #fcc',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaExclamationTriangle /> {error}
          </div>
        )}
        
        {/* adding a space in search input and brand name */}

        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <label className="form-label">BRAND NAME</label>
            <div className="input-wrapper">
              <span className="input-icon"><FaSearch /></span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Tesla, Apple, Nike..."
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">DATA SOURCE</label>
            <select
              className="form-select"
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              disabled={loading}
            >
              {dataSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <span className="btn-icon">{loading ? '⏳' : '●'}</span>
            {loading ? 'Analyzing with AI Agents...' : 'Start AI Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AnalysisForm;
