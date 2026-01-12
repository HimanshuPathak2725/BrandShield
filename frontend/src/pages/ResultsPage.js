import React, { useState, useEffect } from 'react';
import { FaBrain, FaHourglassHalf, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ResultsHeader from '../components/ResultsHeader/ResultsHeader';
import SentimentScore from '../components/SentimentScore/SentimentScore';
import TrendWidget from '../components/TrendWidget/TrendWidget';
import AspectCards from '../components/AspectCards/AspectCards';
import TopOpinions from '../components/TopOpinions/TopOpinions';
import EmotionVelocityMonitor from '../components/EmotionVelocityMonitor/EmotionVelocityMonitor';
import ResponseStrategies from '../components/ResponseStrategies/ResponseStrategies';
import DigitalTwinSimulation from '../components/DigitalTwinSimulation/DigitalTwinSimulation';
import AIInsight from '../components/AIInsight/AIInsight';
import './ResultsPage.css';

function ResultsPage() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState(null);

  useEffect(() => {
    // Load analysis data from localStorage
    const data = localStorage.getItem('currentAnalysis');
    if (data) {
      try {
        setAnalysisData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse analysis data", e);
      }
    }
    setLoading(false);
  }, []);

  const handleRunSimulation = (strategyId) => {
    setActiveSimulation({ status: 'running', strategyId });
    // Simulate API delay
    setTimeout(() => {
       setActiveSimulation({ status: 'complete', strategyId });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          color: '#e2e8f0'
        }}>
          <FaHourglassHalf className="loading-icon" style={{marginRight: '10px'}} /> Loading AI Analysis...
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="results-page">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
            <h2>No analysis data found</h2>
            <p>Please start a new analysis from the dashboard.</p>
            <Link to="/dashboard" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                <FaArrowLeft style={{ marginRight: '0.5rem' }}/> Go to Dashboard
            </Link>
        </div>
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

  // Calculate emotion velocity data
  const calculateVelocityData = () => {
    if (!analysisData) return null;

    const emotions = analysisData.emotion_analysis || {};
    const sentimentStats = analysisData.sentiment_stats || {};
    const riskMetrics = analysisData.risk_metrics || {};
    
    // Calculate overall velocity based on sentiment volatility and negative percentage
    const negativePercentage = sentimentStats.negative_percentage || 0;
    const positivePercentage = sentimentStats.positive_percentage || 0;
    const riskScore = riskMetrics.overall_risk_score || 0;
    
    // Velocity formula: combines sentiment polarity and risk
    const sentimentVolatility = Math.abs(negativePercentage - positivePercentage) / 100;
    const overallVelocity = (sentimentVolatility * 2) + (riskScore / 50);
    
    // Map emotion data to monitor bars
    const emotionMap = {
      'anger': { name: 'ANGER', color: 'red' },
      'fear': { name: 'FEAR', color: 'amber' },
      'neutral': { name: 'NEUTRAL', color: 'gray' },
      'joy': { name: 'JOY', color: 'green' }
    };
    
    const monitor_data = Object.keys(emotionMap).map(key => {
      const emotionValue = emotions[key] || 0;
      const multiplier = (emotionValue / 100 * 3).toFixed(1); // Scale to 0-3x range
      const filled = Math.round(emotionValue / 100 * 16); // Scale to 0-16 bars
      
      return {
        name: emotionMap[key].name,
        multiplier: `${multiplier}x`,
        color: emotionMap[key].color,
        filled: Math.min(filled, 16),
        status: emotionValue > 60 ? 'CRITICAL' : emotionValue > 30 ? 'ELEVATED' : 'STABLE'
      };
    });
    
    return {
      overall_velocity: overallVelocity,
      monitor_data
    };
  };

  const velocityData = calculateVelocityData();

  return (
    <div className="results-page">
      <ResultsHeader brand={analysisData.brand} />
      <main className="results-main">
        <div className="results-container">
          <section className="results-row">
            <SentimentScore data={analysisData.sentiment_stats} />
            <TrendWidget data={analysisData.risk_metrics} />
          </section>

          <AspectCards findings={analysisData.rag_findings} />
          <TopOpinions positiveOpinions={positiveOpinions.slice(0, 3)} negativeOpinions={negativeOpinions.slice(0, 3)} />
          <EmotionVelocityMonitor data={velocityData} />
          <ResponseStrategies onSimulate={handleRunSimulation} />
          <DigitalTwinSimulation simulationState={activeSimulation} />
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
              <h3 style={{ marginBottom: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaBrain /> AI-Detected Issues
              </h3>
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