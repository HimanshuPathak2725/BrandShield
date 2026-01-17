import React, { useMemo } from 'react';
import { FaUsers, FaNewspaper, FaChartBar, FaSpinner } from 'react-icons/fa';
import './DigitalTwinSimulation.css';

function DigitalTwinSimulation({ simulationState }) {
  const simulationData = useMemo(() => {
    if (!simulationState || simulationState.status !== 'complete') return null;

    const data = {
      safe: {
        sentimentShift: '+12%',
        sentimentColor: 'text-blue-400',
        progress: '12%',
        progressColor: '#60a5fa',
        volume: 'Medium',
        emotion: 'Acceptance / Neutral',
        coverage: [true, true, false, false, false],
        narrative: [
            '"Company clarifies stance"',
            '"Standard operational update"'
        ],
        targetMove: {
            title: 'Market Response',
            text: 'Competitor B launches feature comparison table.',
            isRisk: false
        },
        defensiveAction: {
            title: 'Industry Trend',
            text: 'No major shifts in competitor pricing.'
        }
      },
      empathetic: {
        sentimentShift: '+45%',
        sentimentColor: 'text-green-400',
        progress: '45%',
        progressColor: '#22c55e',
        volume: 'High',
        emotion: 'Relief / Gratitude',
        coverage: [true, true, true, true, false],
        narrative: [
            '"Brand takes full responsibility"',
            '"Community praises transparent fix"'
        ],
        targetMove: {
            title: 'Competitor Opportunity',
            text: 'Competitors silent as brand rebuilds trust effectively.',
            isRisk: false
        },
        defensiveAction: {
            title: 'Brand Equity',
            text: 'Customer loyalty metrics projected to recover by 85%.'
        }
      },
      aggressive: {
        sentimentShift: '-15%',
        sentimentColor: 'text-red-500',
        progress: '15%',
        progressColor: '#ef4444',
        volume: 'Very High',
        emotion: 'Anger / Polarization',
        coverage: [true, true, true, true, true],
        narrative: [
            '"Brand attacks critics"',
            '"Controversy explodes on Twitter"'
        ],
        targetMove: {
            title: 'Competitor Attack',
            text: 'Competitor A escalates conflict with aggressive ad campaign.',
            isRisk: true
        },
        defensiveAction: {
            title: 'Crisis Deepening',
            text: 'Potential for sustained boycott increases by 40%.'
        }
      }
    };

    return data[simulationState.strategyId] || data.safe;
  }, [simulationState]);

  // Default state (before simulation)
  if (!simulationState || simulationState.status !== 'complete') {
      return (
        <section className="digital-twin-section">
          <h3 className="digital-twin-title">Digital Twin Simulation Results</h3>
          <div className="simulation-grid">
             {simulationState && simulationState.status === 'running' ? (
                <div style={{gridColumn: 'span 3', padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px'}}>
                    <FaSpinner className="icon-spin" style={{fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem', animation: 'spin 1s linear infinite'}} />
                    <p style={{color: '#94a3b8'}}>Running Multi-Agent Simulation...</p>
                    <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
             ) : (
                <div style={{gridColumn: 'span 3', padding: '30px', textAlign: 'center', border: '1px dashed #334155', borderRadius: '12px', color: '#64748b'}}>
                    Select a response strategy above to run a Digital Twin simulation.
                </div>
             )}
          </div>
        </section>
      );
  }

  return (
    <section className="digital-twin-section">
      <h3 className="digital-twin-title">
        Simulation Results: <span style={{color: '#60a5fa'}}>{simulationState.strategyId.charAt(0).toUpperCase() + simulationState.strategyId.slice(1)} Strategy</span>
      </h3>
      <div className="simulation-grid">
        {/* Public Reaction Card */}
        <div className="simulation-card glass-panel">
          <div className="card-header">
            <span className="card-icon"><FaUsers /></span>
            <h4 className="card-title">Public Reaction</h4>
          </div>
          <div className="card-content">
            <div className="metric-row">
              <span className="metric-label">Sentiment Shift</span>
              <span className={`metric-value ${simulationData.sentimentColor}`}>{simulationData.sentimentShift}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: simulationData.progress, backgroundColor: simulationData.progressColor }}></div>
            </div>
            <div className="metric-row">
              <span className="metric-label">Predicted Volume</span>
              <span className="metric-value">{simulationData.volume}</span>
            </div>
            <div className="emotion-section">
              <span className="emotion-label">Dominant Emotion</span>
              <p className="emotion-text">{simulationData.emotion}</p>
            </div>
          </div>
        </div>

        {/* Media Reaction Card */}
        <div className="simulation-card glass-panel">
          <div className="card-header">
            <span className="card-icon"><FaNewspaper /></span>
            <h4 className="card-title">Media Reaction</h4>
          </div>
          <div className="card-content">
            <div className="coverage-section">
              <span className="coverage-label">Coverage Likelihood</span>
              <div className="coverage-bars">
                {simulationData.coverage.map((filled, idx) => (
                    <div key={idx} className={`coverage-bar ${filled ? 'filled' : 'empty'}`}></div>
                ))}
              </div>
            </div>
            <div className="narrative-section">
              <span className="narrative-label">Narrative Framing</span>
              <ul className="narrative-list">
                {simulationData.narrative.map((item, idx) => (
                    <li key={idx} className="narrative-item">
                      <span className="bullet">•</span>
                      <span>{item}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Competitor Reaction Card */}
        <div className="simulation-card glass-panel">
          <div className="card-header">
            <span className="card-icon"><FaChartBar /></span>
            <h4 className="card-title">Competitor Reaction</h4>
          </div>
          <div className="card-content">
            <div className={`action-box ${simulationData.targetMove.isRisk ? 'target-move' : 'defensive-action'}`}>
              <p className="action-label">{simulationData.targetMove.title}</p>
              <p className="action-text">{simulationData.targetMove.text}</p>
            </div>
            <div className="action-box defensive-action">
              <p className="action-label">{simulationData.defensiveAction.title}</p>
              <p className="action-text">{simulationData.defensiveAction.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DigitalTwinSimulation;
