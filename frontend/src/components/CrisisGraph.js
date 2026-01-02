import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

const CrisisGraph = ({ data }) => {
  // Mock data if none provided for visualization structure
  const chartData = data || [
    { time: '10:00', y: 10, yhat: 12, yhat_upper: 15 },
    { time: '11:00', y: 15, yhat: 13, yhat_upper: 16 },
    { time: '12:00', y: 20, yhat: 14, yhat_upper: 17 },
    { time: '13:00', y: 45, yhat: 15, yhat_upper: 18, alert: true }, // Spike
    { time: '14:00', y: null, yhat: 16, yhat_upper: 19 }, // Forecast
    { time: '15:00', y: null, yhat: 15, yhat_upper: 18 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        {/* Uncertainty Interval */}
        {/* Recharts doesn't support area ranges easily in LineChart without custom shapes, 
            so we'll just plot the upper bound as a dashed line for now */}
        <Line type="monotone" dataKey="yhat_upper" stroke="#82ca9d" strokeDasharray="5 5" name="Threshold (Upper Bound)" />
        
        {/* Forecast */}
        <Line type="monotone" dataKey="yhat" stroke="#8884d8" name="Expected (Forecast)" />
        
        {/* Actuals */}
        <Line type="monotone" dataKey="y" stroke="#ff0000" strokeWidth={2} name="Actual Mentions" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CrisisGraph;
