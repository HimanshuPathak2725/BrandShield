import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CrisisGraph from './CrisisGraph';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000');

const Dashboard = () => {
  const [alert, setAlert] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('alert', (data) => {
      console.log('Alert received:', data);
      setAlert(data.forecast);
      setGraphData(data.graph_data);
      if (data.agents_run) {
        setStrategy(data.strategy);
        setClusters(data.clusters);
        setSentiment(data.sentiment);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('alert');
    };
  }, []);

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/analyze', {
        query: "Boeing safety issues, technical failures, and whistleblower complaints"
      });
      const data = response.data;
      setAlert(data.forecast);
      setGraphData(data.graph_data);
      if (data.agents_run) {
        setStrategy(data.strategy);
        setClusters(data.clusters);
        setSentiment(data.sentiment);
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Controls & Status */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Monitoring:</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Boeing Crisis</span>
          </div>
          <button
            onClick={triggerAnalysis}
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Analyzing...' : 'Run Real-time Analysis'}
          </button>
        </div>

        {/* Alert Box */}
        {alert && (
          <div className={`p-6 rounded-lg shadow-md border-l-4 ${
            alert.alert_level === 'RED' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-2 ${alert.alert_level === 'RED' ? 'animate-pulse' : ''}`}>
                {alert.alert_level === 'RED' ? '🚨' : '✅'}
              </span>
              <h2 className={`text-xl font-bold ${
                alert.alert_level === 'RED' ? 'text-red-700' : 'text-green-700'
              }`}>
                {alert.alert_level} ALERT
              </h2>
            </div>
            <div className="space-y-1 text-sm">
              <p><strong>Velocity (y):</strong> {alert.actual_y}</p>
              <p><strong>Threshold (yhat_upper):</strong> {alert.yhat_upper?.toFixed(2)}</p>
              <p><strong>Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
        
        {/* Sentiment Stats */}
        {sentiment && (
           <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
             <div className="flex items-center">
               <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                 <div className="bg-red-600 h-2.5 rounded-full" style={{width: `${(sentiment.negative_ratio * 100).toFixed(0)}%`}}></div>
               </div>
               <span className="ml-2 text-sm font-medium text-gray-700">{(sentiment.negative_ratio * 100).toFixed(0)}% Neg</span>
             </div>
           </div>
        )}
      </div>

      {/* Middle Column: Graph */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Crisis Velocity Graph</h2>
        <div className="h-64 w-full">
           {/* Placeholder for graph if no data, or pass data if available */}
           <CrisisGraph data={graphData} />
        </div>
      </div>

      {/* Bottom Row: Strategy & Clusters */}
      {strategy && (
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">🤖 AI Strategic Response</h2>
            <div className="prose max-w-none bg-gray-50 p-4 rounded border border-gray-200">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{strategy}</pre>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Edit</button>
              <button className="px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded">Approve & Deploy</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">🔍 Narrative Clusters</h2>
            <div className="space-y-3">
              {clusters && Object.entries(clusters).map(([key, texts]) => (
                <div key={key} className="border border-gray-200 rounded p-3">
                  <h3 className="font-bold text-sm text-gray-800 mb-1">{key}</h3>
                  <p className="text-xs text-gray-500 italic">"{texts[0]?.substring(0, 100)}..."</p>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded mt-2 inline-block">
                    {texts.length} mentions
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
