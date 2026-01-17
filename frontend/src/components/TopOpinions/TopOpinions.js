import React from 'react';
import './TopOpinions.css';

function TopOpinions({ positiveOpinions = [], negativeOpinions = [] }) {
  const hasPositive = positiveOpinions.length > 0;
  const hasNegative = negativeOpinions.length > 0;

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'neutral';
    if (sentiment.includes('Positive') || sentiment.includes('Strongly')) return 'positive';
    return 'negative';
  };

  const getSourceIcon = (source) => {
    if (!source) return '📱';
    const s = source.toLowerCase();
    if (s.includes('x') || s.includes('twitter')) return '𝕏';
    if (s.includes('reddit')) return '🤖';
    return '📱';
  };

  return (
    <section className="opinions-section">
      <h3 className="opinions-title">Top Opinions</h3>

      <div className="opinions-grid">
        {/* Positive Column */}
        <div className="opinions-column">
          <div className="column-header positive">
            <span className="dot"></span>
            <span>MOST POSITIVE</span>
          </div>

          {!hasPositive ? (
             <div className="opinion-empty-state">
               No significant positive opinions detected in this analysis.
            </div>
          ) : (
            positiveOpinions.map((opinion, idx) => (
              <div key={opinion.id || idx} className="opinion-card">
                <div className="opinion-source">{getSourceIcon(opinion.source)}</div>
                <div className="opinion-tags">
                  <span className="tag">{opinion.aspect || 'General'}</span>
                  <span className={`tag sentiment ${getSentimentColor(opinion.sentiment)}`}>
                    {opinion.sentiment}
                  </span>
                </div>
                <p className="opinion-text">"{opinion.text}"</p>
              </div>
            ))
          )}
        </div>

        {/* Negative Column */}
        <div className="opinions-column">
          <div className="column-header negative">
            <span className="dot"></span>
            <span>MOST NEGATIVE</span>
          </div>

          {!hasNegative ? (
             <div className="opinion-empty-state">
               No significant negative opinions detected in this analysis.
            </div>
          ) : (
             negativeOpinions.map((opinion, idx) => (
              <div key={opinion.id || idx} className="opinion-card">
                <div className="opinion-source">{getSourceIcon(opinion.source)}</div>
                <div className="opinion-tags">
                  <span className="tag">{opinion.aspect || 'General'}</span>
                  <span className={`tag sentiment ${getSentimentColor(opinion.sentiment)}`}>
                    {opinion.sentiment}
                  </span>
                </div>
                <p className="opinion-text">"{opinion.text}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default TopOpinions;
