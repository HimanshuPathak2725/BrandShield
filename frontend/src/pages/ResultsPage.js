import React, { useState, useEffect } from 'react';
import ResultsHeader from '../components/ResultsHeader/ResultsHeader';
import SentimentScore from '../components/SentimentScore/SentimentScore';
import TrendWidget from '../components/TrendWidget/TrendWidget';
import AspectCards from '../components/AspectCards/AspectCards';
import TopOpinions from '../components/TopOpinions/TopOpinions';
import AIInsight from '../components/AIInsight/AIInsight';
import './ResultsPage.css';

function ResultsPage() {
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
        <ResultsHeader />
        <main className="results-main">
          <div className="results-container">
            <section className="results-row">
              <SentimentScore />
              <TrendWidget />
            </section>

            <AspectCards />
            <TopOpinions />
            <AIInsight />
          </div>
        </main>
      </div>
    );
  }

  // Prepare data for TopOpinions
  const positiveOpinions = [];
  const negativeOpinions = [];

  if (analysisData) {
      // 1. Extract from RAG Findings
      if (analysisData.rag_findings) {
        analysisData.rag_findings.forEach(category => {
          if (category.items) {
            category.items.forEach(item => {
               const opinion = {
                 id: item.url || Math.random(),
                 aspect: category.category,
                 sentiment: item.sentiment_label,
                 text: item.context,
                 source: item.source
               };
               if (item.sentiment_label === 'Positive') positiveOpinions.push(opinion);
               else if (item.sentiment_label === 'Negative') negativeOpinions.push(opinion);
            });
          }
        });
      }

      // 2. Extract from Social Media Replies (mostly negative)
      if (analysisData.social_media_replies) {
          analysisData.social_media_replies.forEach((reply, idx) => {
               negativeOpinions.push({
                   id: reply.id || `sm-${idx}`,
                   aspect: 'Social Feedback',
                   sentiment: 'Negative',
                   text: reply.content,
                   source: reply.source
               });
          });
      }
  }

  return (
    <div className="results-page">
      <ResultsHeader brand={analysisData.brand} />
      <main className="results-main">
        <div className="results-container">
          <section className="results-row">
            <SentimentScore data={analysisData} />
            <TrendWidget />
          </section>

          <AspectCards />
          <TopOpinions positiveOpinions={positiveOpinions.slice(0, 3)} negativeOpinions={negativeOpinions.slice(0, 3)} />
          <AIInsight data={analysisData} />
          
          {/* Display AI Findings */}
          {analysisData.rag_findings && analysisData.rag_findings.length > 0 && (
            <section className="ai-findings-section" style={{
              backgroundColor: '#15172b',
              padding: '24px',
              borderRadius: '12px',
              marginTop: '20px',
              border: '1px solid #323767',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ marginBottom: '16px', color: '#ffffff' }}>🧠 AI-Detected Issues</h3>
              <div className="findings-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {analysisData.rag_findings.map((finding, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    backgroundColor: '#1c1f33',
                    borderLeft: `4px solid ${finding.severity === 'high' ? '#DB4437' : finding.severity === 'medium' ? '#F4B400' : '#0F9D58'}`,
                    borderRadius: '8px',
                    border: '1px solid #323767'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#e2e8f0' }}>
                      {finding.category || finding.issue_type}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
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
