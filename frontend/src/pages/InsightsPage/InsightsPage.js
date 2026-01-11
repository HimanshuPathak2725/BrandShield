import React, { useState } from 'react';
import { FaCalendar, FaBullhorn, FaChartLine, FaChartBar, FaExternalLinkAlt, FaChevronRight, FaPalette, FaBrain, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import './InsightsPage.css';

function InsightsPage() {
  const [activeTimeRange, setActiveTimeRange] = useState('7d');
  const [activeAspect, setActiveAspect] = useState('design');

  const aspects = [
    { id: 'design', label: 'Product Design', mentions: 642, trend: 'up' },
    { id: 'price', label: 'Price & Value', mentions: 412, trend: 'neutral' },
    { id: 'performance', label: 'Performance', mentions: 891, trend: 'up' },
    { id: 'ux', label: 'User Experience', mentions: 225, trend: 'down' },
  ];

  const momentumCards = [
    { label: 'Positive Momentum', value: '+12.4%', change: '+5.2%', changeType: 'up', percentage: 75 },
    { label: 'Negative Momentum', value: '-2.1%', change: '0.8%', changeType: 'down', percentage: 15 },
    { label: 'Stability Index', value: '88%', change: '+1.5%', changeType: 'up', percentage: 88 },
  ];

  const footerLinks = [
    { label: 'Documentation', href: '#docs' },
    { label: 'API Status', href: '#api' },
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Security', href: '#security' },
  ];

  return (
    <div className="insights-page">
      <DashboardHeader />

      <main className="insights-main">
        {/* Page Header & Controls */}
        <div className="insights-header">
          <div className="header-content">
            <h1 className="page-title">Trend & Timeline Analysis</h1>
            <p className="page-subtitle">Analyzing 1.2M data points across Twitter, Reddit, and News globally.</p>
          </div>
          <div className="header-controls">
            <div className="time-range-selector">
              <button
                className={`time-btn ${activeTimeRange === '24h' ? 'active' : ''}`}
                onClick={() => setActiveTimeRange('24h')}
              >
                24h
              </button>
              <button
                className={`time-btn ${activeTimeRange === '7d' ? 'active' : ''}`}
                onClick={() => setActiveTimeRange('7d')}
              >
                7d
              </button>
              <button
                className={`time-btn ${activeTimeRange === '30d' ? 'active' : ''}`}
                onClick={() => setActiveTimeRange('30d')}
              >
                30d
              </button>
              <button className="time-btn custom-btn">
                Custom <span className="calendar-icon"><FaCalendar /></span>
              </button>
            </div>
            <button className="export-btn">
              <span className="export-icon"><FaExternalLinkAlt /></span>
              Export
            </button>
          </div>
        </div>

        {/* Hero Visualization */}
        <div className="hero-chart-card">
          <div className="chart-top-border"></div>
          <div className="chart-header">
            <div>
              <p className="chart-label">Global Pulse</p>
              <h3 className="chart-title">Daily Sentiment Aggregation</h3>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot positive"></span>
                <span className="legend-text">Positive</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot neutral"></span>
                <span className="legend-text">Neutral</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot negative"></span>
                <span className="legend-text">Negative</span>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <svg className="sentiment-chart" viewBox="0 0 1000 300" preserveAspectRatio="none">
              {/* Positive Line */}
              <path
                className="sentiment-line positive-line"
                d="M0,220 Q100,200 200,120 T400,100 T600,80 T800,150 T1000,60"
                fill="none"
                strokeWidth="3"
              />
              {/* Neutral Line */}
              <path
                className="sentiment-line neutral-line"
                d="M0,150 Q100,160 200,180 T400,170 T600,190 T800,160 T1000,175"
                fill="none"
                strokeWidth="3"
              />
              {/* Negative Line */}
              <path
                className="sentiment-line negative-line"
                d="M0,80 Q100,110 200,240 T400,250 T600,220 T800,260 T1000,240"
                fill="none"
                strokeWidth="3"
              />
              {/* Event Markers */}
              <circle cx="200" cy="120" r="6" className="marker positive" />
              <circle cx="600" cy="80" r="6" className="marker positive" />
              <circle cx="800" cy="260" r="6" className="marker negative" />
              {/* Vertical Line (crosshair) */}
              <line
                x1="600"
                y1="0"
                x2="600"
                y2="300"
                stroke="rgba(255,255,255,0.1)"
                strokeDasharray="4"
              />
            </svg>

            {/* Floating Tooltip */}
            <div className="chart-tooltip">
              <p className="tooltip-timestamp">Oct 24, 2023 - 14:00</p>
              <div className="tooltip-content">
                <div className="tooltip-row">
                  <span className="tooltip-label positive">Positive</span>
                  <span className="tooltip-value">72.4%</span>
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label negative">Negative</span>
                  <span className="tooltip-value">12.1%</span>
                </div>
              </div>
              <div className="tooltip-event">
                <span className="event-icon"><FaBullhorn /></span>
                <span className="event-text">Influencer Review Spike</span>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="chart-axis">
              <span>OCT 18</span>
              <span>OCT 19</span>
              <span>OCT 20</span>
              <span>OCT 21</span>
              <span>OCT 22</span>
              <span>OCT 23</span>
              <span>OCT 24</span>
            </div>
          </div>
        </div>

        {/* Momentum Cards */}
        <div className="momentum-grid">
          {momentumCards.map((card, idx) => (
            <div key={idx} className="momentum-card">
              <p className="momentum-label">{card.label}</p>
              <div className="momentum-content">
                <h4 className="momentum-value">{card.value}</h4>
                <div className={`momentum-change ${card.changeType}`}>
                  <span className="change-icon">
                    {card.changeType === 'up' ? <FaChartLine color="#4ade80" /> : <FaChartBar color="#f87171" />}
                  </span>
                  <span className="change-value">{card.change}</span>
                </div>
              </div>
              <div className="momentum-bar">
                <div className="bar-fill" style={{ width: `${card.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Aspect Breakdown & Deep Dive */}
        <div className="aspect-section">
          {/* Aspect List */}
          <div className="aspect-list">
            <div className="aspect-list-header">
              <h5 className="aspect-list-title">Aspect Breakdown</h5>
            </div>
            <div className="aspect-items">
              {aspects.map((aspect) => (
                <div
                  key={aspect.id}
                  className={`aspect-item ${activeAspect === aspect.id ? 'active' : ''}`}
                  onClick={() => setActiveAspect(aspect.id)}
                >
                  <div className="aspect-info">
                    <span className="aspect-name">{aspect.label}</span>
                    <span className="aspect-mentions">{aspect.mentions} mentions</span>
                  </div>
                  <div className="aspect-sparkline">
                    <svg viewBox="0 0 80 30" preserveAspectRatio="none">
                      <path
                        d={
                          aspect.trend === 'up'
                            ? 'M0,20 Q10,15 20,25 T40,10 T60,20 T80,5'
                            : 'M0,10 Q10,20 20,5 T40,15 T60,5 T80,10'
                        }
                        fill="none"
                        stroke="#1224e2"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="aspect-chevron"><FaChevronRight /></span>
                </div>
              ))}
            </div>
          </div>

          {/* Aspect Detailed Graph */}
          <div className="aspect-deep-dive">
            <div className="deep-dive-header">
              <div className="header-left">
                <div className="icon-box">
                  <span className="icon"><FaPalette /></span>
                </div>
                <div>
                  <h5 className="deep-dive-title">Performance Deep-Dive: Design</h5>
                </div>
              </div>
              <button className="view-full-btn">View Full Correlation</button>
            </div>

            <div className="deep-dive-chart">
              <svg className="area-chart" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1224e2" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1224e2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 Q50,140 100,160 T200,80 T300,70 T400,120 T500,40 T600,60 V200 H0 Z"
                  fill="url(#areaGrad)"
                />
                <path
                  d="M0,150 Q50,140 100,160 T200,80 T300,70 T400,120 T500,40 T600,60"
                  fill="none"
                  stroke="#1224e2"
                  strokeWidth="3"
                />
                <circle cx="500" cy="40" fill="#1224e2" r="5" />
              </svg>

              {/* Annotation Callout */}
              <div className="chart-annotation">
                <div className="annotation-line"></div>
                <div className="annotation-box">
                  <span className="annotation-text">Spike after viral influencer review on TikTok</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictive Model */}
        <div className="ai-section">
          <div className="ai-content">
            <div className="ai-icon-circle">
              <span className="ai-icon"><FaBrain /></span>
            </div>
            <div className="ai-text">
              <div className="ai-header">
                <span className="ai-model">Predictive Model v4.2</span>
                <span className="ai-status-dot"></span>
                <span className="ai-status">Analysis Complete</span>
              </div>
              <p className="ai-insight">
                "Anticipated <span className="highlight-text">15% increase</span> in positive sentiment over the next 48 hours. Velocity indicators suggest the current viral trajectory for <span className="underline-text">Product Design</span> will peak on Wednesday afternoon. Recommendation: Launch 'Behind the Design' content series immediately to maintain momentum."
              </p>
            </div>
            <button className="apply-btn">Apply Recommendation</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="insights-footer">
        <div className="footer-left">
          <div className="footer-logo"><FaShieldAlt /></div>
          <span className="footer-text">BrandShield Intelligence © 2023</span>
        </div>
        <div className="footer-links">
          {footerLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="footer-link">
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer-region">
          <span className="region-label">Region:</span>
          <div className="region-badge">
            <span className="region-icon"><FaGlobe /></span>
            Global (US-West)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default InsightsPage;
