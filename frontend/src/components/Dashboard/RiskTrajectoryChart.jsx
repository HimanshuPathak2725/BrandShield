import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Send, Activity } from 'lucide-react';

const initialData = [
  { time: '00:00', risk: 20 },
  { time: '04:00', risk: 35 },
  { time: '08:00', risk: 45 },
  { time: '12:00', risk: 75 },
  { time: '16:00', risk: 50 },
  { time: '20:00', risk: 65 },
  { time: '24:00', risk: 80 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-red-100 p-3 rounded shadow-lg">
        <p className="text-slate-500 text-xs mb-1 font-bold tracking-wider uppercase">{label}</p>
        <p className="text-[#D32F2F] font-bold text-lg font-mono">
          {payload[0].value}% <span className="text-xs font-normal text-slate-500">RISK INDEX</span>
        </p>
      </div>
    );
  }
  return null;
};

const RiskTrajectoryChart = ({ isCrisis, velocityScore }) => {
  const [chartData, setChartData] = useState(initialData);
  const [simulationInput, setSimulationInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic Update Simulation
  useEffect(() => {
    // If we have a real velocity score, use it to bias the random changes
    const baseRisk = velocityScore ? Math.min(100, velocityScore * 1.2) : 50;
    
    const interval = setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1];
        // Fluctuate risk slightly
        const volatility = isCrisis ? 15 : 5;
        // Bias towards the actual API velocity
        const drift = (baseRisk - last.risk) * 0.1; 
        const change = (Math.random() - 0.5) * volatility + drift;
        
        let newRisk = Math.max(0, Math.min(100, last.risk + change));
        
        // Rolling window: Remove first, add new
        const newTime = new Date();
        const timeStr = newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newData = [...prev.slice(1), { time: timeStr, risk: Math.round(newRisk) }];
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isCrisis, velocityScore]);

  const handleSimulation = (e) => {
    e.preventDefault();
    if(!simulationInput) return;
    
    setIsSimulating(true);
    // Mock simulation effect: Drop risk if strategy is "good"
    setTimeout(() => {
      setChartData(prev => {
         const last = prev[prev.length - 1];
         // Simulate a "drop" in risk
         return [...prev.slice(1), { time: 'PREDICTED', risk: Math.max(10, last.risk - 30) }];
      });
      setIsSimulating(false);
      setSimulationInput('');
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans text-sm p-2">
      <div className="flex justify-between items-center mb-4 pl-2 pr-2">
        <div className="flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2 text-[#D32F2F]">
            <Activity size={18} className="text-[#D32F2F]" />
            Risk Trajectory
            </h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">
                Predictive Analysis • Live
            </span>
        </div>
        
        {/* Simulator Input */}
        <form onSubmit={handleSimulation} className="flex gap-2 items-center">
            <input 
                type="text" 
                value={simulationInput}
                onChange={(e) => setSimulationInput(e.target.value)}
                placeholder="Simulate Counter-Measure..." 
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 focus:outline-none focus:border-[#D32F2F] w-56 transition-colors placeholder:text-slate-400 rounded-lg shadow-sm"
            />
            <button type="submit" className={`p-1.5 bg-[#D32F2F] text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm ${isSimulating ? 'animate-pulse' : ''}`}>
               <Send size={14} />
            </button>
        </form>
      </div>
      
      <div className="flex-1 w-full relative rounded-xl overflow-hidden">
        {isSimulating && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-[2px] transition-all">
                <div className="text-[#D32F2F] text-xs font-bold animate-pulse flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-red-100">
                    <span className="w-3 h-3 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin"></span>
                    CALCULATING IMPACT...
                </div>
            </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRiskLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} />
            <ReferenceLine y={70} stroke="#D32F2F" strokeDasharray="3 3" label={{ value: 'CRITICAL THRESHOLD', fill: '#D32F2F', fontSize: 10, position: 'insideTopRight', fontWeight: 'bold' }} />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="#D32F2F" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRiskLight)" 
              animationDuration={800}
              isAnimationActive={true}
              dot={{ stroke: '#D32F2F', strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{ r: 6, stroke: '#D32F2F', strokeWidth: 2, fill: '#D32F2F' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskTrajectoryChart;
