import React from 'react';
import './AIInsight.css';

function AIInsight({ data }) {
  // If no data provided, show default demo content
  if (!data || !data.emotion_analysis) {
    return (
      <section className="ai-insight-section">
        <div className="ai-insight-card">
          <div className="ai-icon">✨</div>
          <div className="ai-content">
            <div className="ai-header">
              <h4 className="ai-title">AI Insight Summary</h4>
              <span className="ai-badge">Just now</span>
            </div>
            <p className="ai-text">
              Overall sentiment is trending positive <span className="highlight">(+12%)</span> driven by the new <span className="highlight">Design</span> changes, specifically the titanium material. However, <span className="highlight">Pricing</span> remains a significant friction point for early adopters, generating 60% negative reactions in that category. Watch for potential supply chain complaints affecting sentiment in the next hour.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { emotion_analysis, risk_metrics, sentiment_stats } = data;
  const positivePercent = sentiment_stats?.positive || 0;
  const negativePercent = sentiment_stats?.negative || 0;
  const riskLevel = risk_metrics?.level || 'UNKNOWN';
  const riskScore = risk_metrics?.score || 0;

  const getSentimentTrend = () => {
    if (positivePercent > negativePercent) {
      return `positive (+${(positivePercent - negativePercent).toFixed(1)}%)`;
    } else if (negativePercent > positivePercent) {
      return `negative (-${(negativePercent - positivePercent).toFixed(1)}%)`;
    }
    return 'neutral';
  };

  const getRiskColor = () => {
    if (riskScore > 80) return '#DB4437';
    if (riskScore > 50) return '#F4B400';
    return '#0F9D58';
  };

  return (
    <section className="ai-insight-section">
      <div className="ai-insight-card">
        <div className="ai-icon">🤖</div>
        <div className="ai-content">
          <div className="ai-header">
            <h4 className="ai-title">AI Crisis Analysis Summary</h4>
            <span className="ai-badge" style={{ backgroundColor: getRiskColor() }}>
              Risk: {riskLevel}
            </span>
          </div>
          <p className="ai-text">
            Overall sentiment is trending <span className="highlight" style={{
              color: positivePercent > negativePercent ? '#0F9D58' : '#DB4437'
            }}>
              {getSentimentTrend()}
            </span> based on recent mentions. 
            Dominant emotion detected: <span className="highlight">
              {emotion_analysis.dominant_emotion || 'Mixed'}
            </span>.
            {riskScore > 70 && (
              <> <strong style={{ color: '#DB4437' }}>⚠️ High risk detected - immediate action recommended.</strong></>
            )}
            {riskScore > 50 && riskScore <= 70 && (
              <> <strong style={{ color: '#F4B400' }}>⚠️ Moderate risk - monitor closely.</strong></>
            )}
            {riskScore <= 50 && (
              <> <strong style={{ color: '#0F9D58' }}>✅ Low risk - sentiment is stable.</strong></>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

export default AIInsight;
