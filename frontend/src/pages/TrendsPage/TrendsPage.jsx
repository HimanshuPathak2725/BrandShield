import React, { useState, useEffect } from 'react';
import { FaSmile, FaFrown, FaMeh, FaChevronDown, FaChartLine, FaChartBar, FaComments, FaBrain, FaCog, FaInfoCircle, FaDownload } from 'react-icons/fa';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import './TrendsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function TrendsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeTimeRange, setActiveTimeRange] = useState('30days');
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, [activeTimeRange]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const days = activeTimeRange === '30days' ? 30 : activeTimeRange === '90days' ? 90 : 365;
      const response = await fetch(`${API_BASE_URL}/api/trends?days=${days}`);
      const data = await response.json();
      setTrendsData(data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use real data if available, otherwise use defaults
  // Convert aspects object to array if needed
  let aspects = [
    { name: 'Design', sentiment: { positive: 82, neutral: 12, negative: 6 }, themes: { positive: [], negative: [] } },
    { name: 'Price', sentiment: { positive: 45, neutral: 30, negative: 25 }, themes: { positive: [], negative: [] } },
    { name: 'Performance', sentiment: { positive: 74, neutral: 16, negative: 10 }, themes: { positive: [], negative: [] } },
    { name: 'UX & Comfort', sentiment: { positive: 61, neutral: 20, negative: 19 }, themes: { positive: [], negative: [] } },
  ];

  // If trendsData has aspects, process them
  if (trendsData?.aspects) {
    if (Array.isArray(trendsData.aspects)) {
      aspects = trendsData.aspects;
    } else {
      // Convert object to array
      aspects = Object.entries(trendsData.aspects).map(([brand, sentiment]) => ({
        name: brand,
        sentiment: sentiment,
        themes: { positive: [], negative: [] }
      }));
    }
  }

  const sentimentData = Array.isArray(aspects) ? aspects.map(aspect => ({
    aspect: aspect.name,
    positive: aspect.sentiment?.positive || 0,
    neutral: aspect.sentiment?.neutral || 0,
    negative: aspect.sentiment?.negative || 0
  })) : [];

  const currentAspect = Array.isArray(aspects) && aspects.length > 0 
    ? (aspects.find(a => a.name === 'Design') || aspects[0])
    : { name: 'Design', sentiment: { positive: 82, neutral: 12, negative: 6 }, themes: { positive: [], negative: [] } };
  
  const positiveThemes = currentAspect.themes?.positive || [
    { text: 'Sleek side profile', count: 244 },
    { text: 'Minimalist interior', count: 189 },
    { text: 'Headlight signature', count: 112 },
    { text: 'Wheel design', count: 94 },
  ];

  const negativeThemes = currentAspect.themes?.negative || [
    { text: 'Front grill size', count: 112 },
    { text: 'Plastic dash trim', count: 76 },
    { text: 'Rear visibility', count: 43 },
  ];

  const comments = trendsData?.recentComments || [
    {
      text: '"The side profile of the new model is absolutely stunning. They finally got the proportions right. It looks much faster than it actually is."',
      aspect: 'Design',
      sentiment: 'positive',
      timestamp: '2 min ago',
    },
    {
      text: '"Why is the front grill so massive? It ruins the otherwise elegant aesthetic. I\'m having second thoughts about the pre-order."',
      aspect: 'Design',
      sentiment: 'negative',
      timestamp: '14 min ago',
    },
    {
      text: '"Acceleration is punchy, but the infotainment system lags when switching between maps and music. Fixable via OTA?"',
      aspect: 'UX',
      sentiment: 'neutral',
      timestamp: '45 min ago',
    },
    {
      text: '"Wait times are way too long for this price point. I can get a competitor model delivered in 2 weeks vs 6 months here."',
      aspect: 'Price',
      sentiment: 'negative',
      timestamp: '1 hour ago',
    },
    {
      text: '"Comfortable seats, even for long road trips. The lumbar support is a game changer for my back."',
      aspect: 'Comfort',
      sentiment: 'positive',
      timestamp: '2 hours ago',
    },
  ];

  const totalComments = trendsData?.totalComments || 14242;
  const totalSessions = trendsData?.totalSessions || 0;
  const dataSourceText = totalSessions > 0 
    ? `Analyzing ${totalComments} comments from ${totalSessions} brand analyses over the last ${activeTimeRange === '30days' ? '30' : activeTimeRange === '90days' ? '90' : '365'} days`
    : `Analyzing ${totalComments} public comments across key product dimensions from last ${activeTimeRange === '30days' ? '30' : activeTimeRange === '90days' ? '90' : '365'} days`;

  const aspectsList = [
    { id: 'overview', label: 'Overview', hasLabel: false },
    { id: 'design', label: 'Design', hasLabel: true, labelText: 'Focus' },
    { id: 'price', label: 'Price', hasLabel: false },
    { id: 'performance', label: 'Performance', hasLabel: false },
    { id: 'ux', label: 'UX & Comfort', hasLabel: false },
  ];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FaSmile />;
      case 'negative':
        return <FaFrown />;
      case 'neutral':
        return <FaMeh />;
      default:
        return <FaMeh />;
    }
  };

  const getAspectColor = (aspect) => {
    const colors = {
      'Design': '#1224e2',
      'Price': '#f97316',
      'Performance': '#06b6d4',
      'UX': '#a855f7',
      'Comfort': '#3b82f6',
    };
    return colors[aspect] || '#1224e2';
  };

  return (
    <div className="trends-page">
      <DashboardHeader />
      
      <main className="trends-main">
        {/* Page Heading */}
        <div className="trends-heading">
          <div>
            <h1 className="trends-title">Aspect-Level Public Sentiment Analysis</h1>
            <p className="trends-subtitle">{dataSourceText}</p>
          </div>
          <div className="trends-controls">
            <div className="time-range-buttons">
              <button className={`time-btn ${activeTimeRange === '30days' ? 'active' : ''}`} onClick={() => setActiveTimeRange('30days')}>Last 30 Days</button>
              <button className={`time-btn ${activeTimeRange === '90days' ? 'active' : ''}`} onClick={() => setActiveTimeRange('90days')}>90 Days</button>
              <button className={`time-btn ${activeTimeRange === '1year' ? 'active' : ''}`} onClick={() => setActiveTimeRange('1year')}>1 Year</button>
            </div>
            <button className="ai-settings-btn">
              <span className="settings-icon"><FaCog /></span>
              AI Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="trends-tabs">
          {aspectsList.map((aspect) => (
            <a
              key={aspect.id}
              href={`#${aspect.id}`}
              className={`tab-link ${activeTab === aspect.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(aspect.id);
              }}
            >
              <span className="tab-label">{aspect.label}</span>
              {aspect.hasLabel && <span className="tab-focus-badge">{aspect.labelText}</span>}
            </a>
          ))}
        </div>

        {/* Main Grid: Sentiment Distribution & Key Themes */}
        <div className="trends-grid">
          {/* Sentiment Distribution Card */}
          <div className="sentiment-card glass-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Sentiment Distribution</h3>
                <p className="card-subtitle">Net positive score: <span className="positive-score">+62%</span></p>
              </div>
              <span className="info-icon"><FaInfoCircle /></span>
            </div>

            <div className="sentiment-bars">
              {sentimentData.map((item, idx) => (
                <div key={idx} className="bar-item">
                  <div className="bar-header">
                    <span className="bar-label">{item.aspect}</span>
                    <span className="bar-percentage">{item.positive}% Pos</span>
                  </div>
                  <div className="bar-container">
                    <div className="bar-segment positive" style={{ width: `${item.positive}%` }}></div>
                    <div className="bar-segment neutral" style={{ width: `${item.neutral}%` }}></div>
                    <div className="bar-segment negative" style={{ width: `${item.negative}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bar-legend">
              <div className="legend-item">
                <span className="legend-dot positive"></span>
                <span className="legend-label">Positive</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot neutral"></span>
                <span className="legend-label">Neutral</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot negative"></span>
                <span className="legend-label">Negative</span>
              </div>
            </div>
          </div>

          {/* Key Opinion Themes Card */}
          <div className="themes-card glass-card">
            <div className="card-header">
              <h3 className="card-title">
                Key Opinion Themes: <span className="italic-accent">Design</span>
              </h3>
              <button className="filter-btn"><FaChevronDown /></button>
            </div>

            <div className="themes-grid">
              {/* Positive Themes */}
              <div className="theme-section">
                <div className="theme-header positive-header">
                  <span className="trend-icon"><FaChartLine color="#4ade80" size={20} /></span>
                  <span className="theme-title">Top Positive</span>
                </div>
                <div className="theme-tags">
                  {positiveThemes.map((theme, idx) => (
                    <div key={idx} className="theme-tag positive-tag">
                      <span className="tag-text">{theme.text}</span>
                      <span className="tag-count">{theme.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negative Themes */}
              <div className="theme-section">
                <div className="theme-header negative-header">
                  <span className="trend-icon"><FaChartBar color="#f87171" size={20} /></span>
                  <span className="theme-title">Top Negative</span>
                </div>
                <div className="theme-tags">
                  {negativeThemes.map((theme, idx) => (
                    <div key={idx} className="theme-tag negative-tag">
                      <span className="tag-text">{theme.text}</span>
                      <span className="tag-count">{theme.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Traceability Feed */}
        <div className="comments-card glass-card">
          <div className="comments-header">
            <h3 className="comments-title">
              <span className="chat-icon"><FaComments size={24} /></span>
              Comment Traceability Feed
            </h3>
            <div className="comments-controls">
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span className="live-text">Live Updates</span>
              </div>
              <button className="view-all-btn">View All Comments</button>
            </div>
          </div>

          <div className="comments-table-wrapper">
            <table className="comments-table">
              <thead>
                <tr>
                  <th>Comment Text</th>
                  <th>Aspect</th>
                  <th>Sentiment</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, idx) => (
                  <tr key={idx} className="comment-row">
                    <td className="comment-text">{comment.text}</td>
                    <td className="comment-aspect">
                      <span
                        className="aspect-badge"
                        style={{ borderColor: getAspectColor(comment.aspect), color: getAspectColor(comment.aspect) }}
                      >
                        {comment.aspect}
                      </span>
                    </td>
                    <td className="comment-sentiment">
                      <div className={`sentiment-badge ${comment.sentiment || 'neutral'}`}>
                        <span className="sentiment-icon">{getSentimentIcon(comment.sentiment)}</span>
                        <span className="sentiment-text">
                          {comment.sentiment 
                            ? comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)
                            : 'Neutral'}
                        </span>
                      </div>
                    </td>
                    <td className="comment-time">{comment.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="ai-summary-card">
          <div className="ai-summary-content">
            <div className="ai-icon-box">
              <span className="ai-icon"><FaBrain size={24} /></span>
            </div>
            <div className="ai-summary-text">
              <div className="ai-header">
                <span className="ai-label">AI Executive Summary</span>
                <span className="ai-divider">•</span>
                <span className="ai-label">Design Deep-Dive</span>
              </div>
              <p className="ai-insight">
                <span className="insight-highlight">Design</span> sentiment is trending upwards (+12% WoW) largely due to the "Sleek Side Profile" which is consistently praised in 45% of recent positive comments. However, "Front Grill Design" remains a polarizing factor that contributes to 68% of negative design feedback. Recommendation: Feature more profile-angle imagery in upcoming campaigns.
              </p>
            </div>
            <div className="ai-actions">
              <button className="ai-button primary-ai-btn">
                Generate Report
                <span className="download-icon"><FaDownload /></span>
              </button>
              <button className="ai-button secondary-ai-btn">Ask AI Assistant</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="trends-footer">
        <div className="footer-left">© 2024 BRANDSHIELD AI SOLUTIONS</div>
        <div className="footer-links">
          <a href="#api">API Docs</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#status">System Status</a>
        </div>
      </footer>
    </div>
  );
}

export default TrendsPage;
