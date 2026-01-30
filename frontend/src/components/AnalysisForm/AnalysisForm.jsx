import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import './AnalysisForm.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function AnalysisForm() {
  const navigate = useNavigate();
  const [target, setTarget] = useState('');
  const [dataSource, setDataSource] = useState('Reddit Discussions');
  const [scenarioMode, setScenarioMode] = useState(''); // Empty = Real-Time
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dataSources = [
    'Unified Stream (Reddit + YouTube + News)', // New Default
    'Reddit Only',
    'Twitter / X',
    'News Aggregator'
  ];

  const scenarios = [
    { id: '', label: '🟢 Real-Time Monitoring (Live API)' },
    { id: 'battery_fire', label: '🔥 Simulation: Battery Fire Crisis' },
    { id: 'privacy', label: '🛡️ Simulation: Data Privacy Breach' },
    { id: 'outage', label: '🔌 Simulation: Service Outage' }
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
          data_source: dataSource,
          scenario_mode: scenarioMode // Pass the intent to backend
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
          Monitor real-time data or dispatch autonomous agents to simulate crisis scenarios.
        </p>

        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}
        
        {/* adding a space in search input and brand name */}

        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <label className="form-label">BRAND NAME</label>
            <div className="input-wrapper">
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
              style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
            >
              {dataSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-blue-400">OPERATION MODE</label>
            <select
              className="form-select"
              value={scenarioMode}
              onChange={(e) => setScenarioMode(e.target.value)}
              disabled={loading}
              style={{ backgroundColor: '#1e293b', borderColor: scenarioMode ? '#ef4444' : '#334155', color: scenarioMode ? '#fca5a5' : '#fff' }}
            >
              {[
                { id: '', label: '🟢 Real-Time Monitoring (Live API)' },
                { id: 'battery_fire', label: '🔥 Simulation: Battery Fire Crisis' },
                { id: 'privacy', label: '🛡️ Simulation: Data Privacy Breach' },
                { id: 'outage', label: '🔌 Simulation: Service Outage' }
              ].map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
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
