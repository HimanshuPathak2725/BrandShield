import React, { useState } from 'react';
import { FaShieldAlt, FaHeart, FaBullhorn, FaPen, FaMagic, FaCheckCircle, FaRobot } from 'react-icons/fa';
import './ResponseStrategies.css';

function ResponseStrategies({ onSimulate }) {
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);
  const [draft, setDraft] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('idle'); // idle, analyzing, ready

  const templates = {
    safe: "We are actively investigating the reports regarding the recent service disruption. Our engineering team has identified the potential cause and is deploying a fix. We are committed to maintaining platform stability and will provide an update within the hour.",
    empathetic: "We are deeply sorry for the frustration this issue has caused. We know you rely on us, and we let you down today. We are working non-stop to fix this, and we will be offering credits to all affected users as a gesture of our apology.",
    aggressive: "We want to address the misinformation circulating about our product. Our data confirms that 99.9% of systems are operating normally. The reported 'failures' are isolated incidents being exaggerated by competitors. We stand by our technology."
  };

  const strategies = [
    {
      id: 'safe',
      title: 'Safe / Operational',
      risk: 'Low Risk',
      riskColor: 'text-green-400',
      icon: <FaShieldAlt />,
      description: 'Stick to facts and timelines. Minimize liability.',
      outcome: 'Stable',
      outcomeColor: 'bg-blue-400'
    },
    {
      id: 'empathetic',
      title: 'Empathetic / Human',
      risk: 'Medium Risk',
      riskColor: 'text-primary',
      icon: <FaHeart />,
      description: 'Apologize and validate user feelings. Build trust.',
      outcome: 'Recovery',
      outcomeColor: 'bg-green-400',
      recommended: true
    },
    {
      id: 'aggressive',
      title: 'Aggressive / Defend',
      risk: 'High Risk',
      riskColor: 'text-red-500',
      icon: <FaBullhorn />,
      description: 'Deny fault and counter-attack narratives.',
      outcome: 'Polarized',
      outcomeColor: 'bg-red-400'
    }
  ];

  const handleSelect = (id) => {
    setSelectedStrategyId(id);
    setDraft(templates[id]);
    setSimulationStatus('idle');
  };

  const handleRefine = (style) => {
    setIsRefining(true);
    // Simulate AI refinement
    setTimeout(() => {
        if (style === 'formal') setDraft(prev => "OFFICIAL STATEMENT: " + prev.replace("We are", "The company is").replace("sorry", "regretful"));
        if (style === 'shorter') setDraft(prev => prev.split('.')[0] + ".");
        setIsRefining(false);
    }, 800);
  };

  const handleRunSimulation = () => {
    setSimulationStatus('analyzing');
    if (onSimulate) {
      onSimulate(selectedStrategyId);
    }
  };

  return (
    <section className="response-strategies-section">
      <div className="flex flex-col gap-6">
        
        {/* Strategy Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
            <div 
                key={strategy.id} 
                onClick={() => handleSelect(strategy.id)}
                className={`cursor-pointer transition-all duration-300 border rounded-xl p-4 relative overflow-hidden group
                    ${selectedStrategyId === strategy.id 
                        ? 'bg-[#1e293b] border-blue-500 shadow-lg shadow-blue-500/20' 
                        : 'bg-[#0f172a] border-slate-700 hover:border-slate-500 hover:bg-[#1e293b]/50'
                    }
                `}
            >
                {strategy.recommended && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">
                    Recommended
                </div>
                )}
                
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-opacity-20 ${strategy.id === 'safe' ? 'bg-blue-500 text-blue-400' : strategy.id === 'empathetic' ? 'bg-purple-500 text-purple-400' : 'bg-red-500 text-red-400'}`}>
                        {strategy.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-100 text-sm">{strategy.title}</h4>
                        <span className={`text-xs ${strategy.riskColor}`}>{strategy.risk}</span>
                    </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{strategy.description}</p>
            </div>
            ))}
        </div>

        {/* Draft Editor Console - Only shows when strategy selected */}
        {selectedStrategyId && (
            <div className="animate-fade-in-up bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <FaPen className="text-blue-400" /> Response Drafter
                    </h3>
                    <div className="flex gap-2">
                         <button onClick={() => handleRefine('formal')} disabled={isRefining} className="text-xs px-3 py-1.5 rounded-lg bg-[#334155] text-slate-300 hover:bg-[#475569] transition flex items-center gap-1">
                            <FaMagic /> Make Formal
                         </button>
                         <button onClick={() => handleRefine('shorter')} disabled={isRefining} className="text-xs px-3 py-1.5 rounded-lg bg-[#334155] text-slate-300 hover:bg-[#475569] transition flex items-center gap-1">
                            <FaMagic /> Shorten
                         </button>
                    </div>
                </div>

                <div className="relative mb-6">
                    <textarea 
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        disabled={isRefining || simulationStatus === 'analyzing'}
                        className="w-full h-32 bg-[#0f172a] border border-slate-600 rounded-lg p-4 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed resize-none"
                    />
                    {isRefining && (
                        <div className="absolute inset-0 bg-[#0f172a]/80 flex items-center justify-center backdrop-blur-sm rounded-lg">
                            <div className="flex flex-col items-center gap-2">
                                <FaRobot className="text-blue-400 text-2xl animate-bounce" />
                                <span className="text-blue-200 text-xs font-mono">AI Refining...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-mono">
                        {draft.length} chars | Estimate Reading Time: {Math.ceil(draft.length / 200)}s
                    </div>
                    <button 
                        onClick={handleRunSimulation}
                        disabled={simulationStatus === 'analyzing'}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        {simulationStatus === 'analyzing' ? (
                            <>Processing Simulation...</>
                        ) : (
                            <>Run Digital Twin Simulation <FaCheckCircle /></>
                        )}
                    </button>
                </div>
            </div>
        )}
      </div>
    </section>
  );
}

export default ResponseStrategies;
