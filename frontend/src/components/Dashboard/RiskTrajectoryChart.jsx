import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
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
      <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-purple-400 font-bold text-lg">
          {payload[0].value}% <span className="text-xs font-normal text-slate-500">Risk</span>
        </p>
      </div>
    );
  }
  return null;
};

const RiskTrajectoryChart = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          Risk Trajectory
        </h3>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
          Last 24 Hours
        </span>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'CRITICAL', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="url(#colorRiskStroke)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRisk)" 
              animationDuration={2000}
            />
            {/* Gradient Stroke workaround */}
            <defs>
               <linearGradient id="colorRiskStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskTrajectoryChart;
