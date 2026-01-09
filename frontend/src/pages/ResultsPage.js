import React, { useState, useEffect } from 'react';
import ResultsHeader from '../components/ResultsHeader/ResultsHeader';
import SentimentScore from '../components/SentimentScore/SentimentScore';
import AIInsight from '../components/AIInsight/AIInsight';
import './ResultsPage.css';

function ResultsPage({ setCurrentPage }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load analysis data from localStorage
    const data = localStorage.getItem('currentAnalysis');
    if (data) {
      setAnalysisData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem'
        }}>
          ⏳ Loading AI Analysis...
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="results-page">
        <div className="error-container" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem'
        }}>
          <p>❌ No analysis data found</p>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <ResultsHeader setCurrentPage={setCurrentPage} brand={analysisData.brand} />
      <main className="results-main">
        <div className="results-container">
          <section className="results-row">
            <SentimentScore data={analysisData} />
          </section>

          <AIInsight data={analysisData} />
          
          {/* Display AI Findings */}
          {analysisData.rag_findings && analysisData.rag_findings.length > 0 && (
            <section className="ai-findings-section" style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              marginTop: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>🧠 AI-Detected Issues</h3>
              <div className="findings-grid" style={{
                display: 'grid',
                gap: '12px'
              }}>
                {analysisData.rag_findings.map((finding, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderLeft: `4px solid ${finding.severity === 'high' ? '#DB4437' : finding.severity === 'medium' ? '#F4B400' : '#0F9D58'}`,
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      {finding.category || finding.issue_type}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#666' }}>
                      {finding.description || finding.summary}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResultsPage;
