import React from 'react';
import './TopOpinions.css';

function TopOpinions() {
  const positiveOpinions = [
    {
      id: 1,
      aspect: 'Design',
      sentiment: 'Strongly Positive',
      text: '"The titanium finish feels absolutely amazing in hand. It\'s so much lighter than the previous pro models. Apple finally nailed the ergonomics!"',
      source: 'X'
    },
    {
      id: 2,
      aspect: 'Camera',
      sentiment: 'Positive',
      text: '"The 5x zoom is a game changer for concert photography. Super crisp results even in low light."',
      source: 'Reddit'
    }
  ];

  const negativeOpinions = [
    {
      id: 1,
      aspect: 'Price',
      sentiment: 'Negative',
      text: '"$1200 is just too much for this minor upgrade. The base storage should at least be 512GB at this price point. Disappointed."',
      source: 'X'
    },
    {
      id: 2,
      aspect: 'Availability',
      sentiment: 'Frustrated',
      text: '"Sold out everywhere within 5 minutes? This launch feels like a paper launch. Can\'t even get a delivery date until November."',
      source: 'Reddit'
    }
  ];

  const getSentimentColor = (sentiment) => {
    if (sentiment.includes('Positive') || sentiment.includes('Strongly')) return 'positive';
    return 'negative';
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

          {positiveOpinions.map(opinion => (
            <div key={opinion.id} className="opinion-card">
              <div className="opinion-source">{opinion.source === 'X' ? '𝕏' : '📱'}</div>
              <div className="opinion-tags">
                <span className="tag">{opinion.aspect}</span>
                <span className={`tag sentiment ${getSentimentColor(opinion.sentiment)}`}>
                  {opinion.sentiment}
                </span>
              </div>
              <p className="opinion-text">{opinion.text}</p>
            </div>
          ))}
        </div>

        {/* Negative Column */}
        <div className="opinions-column">
          <div className="column-header negative">
            <span className="dot"></span>
            <span>MOST NEGATIVE</span>
          </div>

          {negativeOpinions.map(opinion => (
            <div key={opinion.id} className="opinion-card">
              <div className="opinion-source">{opinion.source === 'X' ? '𝕏' : '📱'}</div>
              <div className="opinion-tags">
                <span className="tag">{opinion.aspect}</span>
                <span className={`tag sentiment ${getSentimentColor(opinion.sentiment)}`}>
                  {opinion.sentiment}
                </span>
              </div>
              <p className="opinion-text">{opinion.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopOpinions;
