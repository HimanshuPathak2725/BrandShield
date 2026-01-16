import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSkeleton } from '../components/Skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageCircle, 
  AlertTriangle, 
  Zap,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import RiskTrajectoryChart from '../components/Dashboard/RiskTrajectoryChart';

// --- MOCK DATA ---
const sentimentData = [
  { name: 'Positive', value: 3, color: '#10b981' },
  { name: 'Neutral', value: 33, color: '#64748b' },
  { name: 'Negative', value: 64, color: '#ef4444' },
];

const MOCK_MENTIONS = [
  { id: 1, user: "@tech_guru", text: "BrandShield's latest update is actually kinda fire 🔥", sentiment: "positive", platform: "Twitter", time: "2m ago" },
  { id: 2, user: "@angry_user", text: "Why is the service down again? #brandshield", sentiment: "negative", platform: "Reddit", time: "5m ago" },
  { id: 3, user: "@market_watch", text: "Tech stocks tumbling, impacting sector leaders.", sentiment: "neutral", platform: "News", time: "12m ago" },
];

const DashboardPage = () => {
  const [mentions, setMentions] = useState(MOCK_MENTIONS);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate live feed
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const newMention = {
        id: Date.now(),
        user: `@user_${Math.floor(Math.random() * 1000)}`,
        text: Math.random() > 0.5 ? "Loving the new features!" : "Still waiting for support response...",
        sentiment: Math.random() > 0.5 ? "positive" : "negative",
        platform: "Twitter",
        time: "Just now"
      };
      setMentions(prev => [newMention, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="grid grid-cols-12 gap-6 h-full max-h-[calc(100vh-8rem)]">
      
      {/* --- DASHBOARD GRID --- */}
      
      {/* 1. KEY METRICS (Middle Row in concept, but visually better at top or side for bento) 
          Let's follow the user's "Bento" request: 
          Top Left: Risk Trajectory 
          Top Right: Sentiment 
          Middle: Metrics 
      */}

      {/* RISK TRAJECTORY (Top Left - Large) */}
      <div className="col-span-12 lg:col-span-8 row-span-2 glass-card p-6 flex flex-col relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <RiskTrajectoryChart />
      </div>

      {/* OVERALL SENTIMENT (Top Right - Small) */}
      <div className="col-span-12 lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center relative group">
        <h3 className="absolute top-6 left-6 text-slate-400 text-sm font-medium uppercase tracking-wider">Overall Sentiment</h3>
        <button className="absolute top-6 right-6 text-slate-500 hover:text-white"><MoreHorizontal size={16} /></button>
        
        <div className="w-full h-48 relative flex items-center justify-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-white tracking-tighter">4/10</span>
            <span className="text-xs text-slate-500 uppercase mt-1">Negativity Index</span>
          </div>
        </div>
        
        <div className="flex gap-4 w-full justify-center mt-2">
           <div className="flex items-center gap-1.5 text-xs text-slate-400">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Pos
           </div>
           <div className="flex items-center gap-1.5 text-xs text-slate-400">
             <div className="w-2 h-2 rounded-full bg-slate-500"></div> Neu
           </div>
           <div className="flex items-center gap-1.5 text-xs text-slate-400">
             <div className="w-2 h-2 rounded-full bg-red-500"></div> Neg
           </div>
        </div>
      </div>

      {/* 3 METRIC CARDS (Middle Row) */}
      {[
        { title: "Hate Speech", value: "Critical", score: 85, color: "text-red-500", bg: "bg-red-500" },
        { title: "Product Frustration", value: "Elevated", score: 62, color: "text-orange-500", bg: "bg-orange-500" },
        { title: "Safety Risks", value: "Low", score: 12, color: "text-blue-500", bg: "bg-blue-500" }
      ].map((metric, i) => (
        <div key={i} className="col-span-12 md:col-span-4 glass-card p-5 group hover:scale-[1.02] transition-transform duration-300">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                <AlertTriangle size={18} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-700 ${metric.color}`}>
                {metric.value}
              </span>
           </div>
           <h4 className="text-slate-400 text-sm font-medium mb-1">{metric.title}</h4>
           <div className="flex items-end gap-2">
             <span className="text-2xl font-bold text-white">{metric.score}%</span>
             <span className="text-xs text-slate-500 mb-1 flex items-center">
               <TrendingUp size={12} className="mr-0.5" /> +2.4%
             </span>
           </div>
           {/* Mini Progress/Sparkline Visual */}
           <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
             <div 
               className={`h-full ${metric.bg} rounded-full`} 
               style={{ width: `${metric.score}%` }}
             ></div>
           </div>
        </div>
      ))}

      {/* BOTTOM SECTION: LIVE MENTIONS & ALERTS */}
      <div className="col-span-12 glass-card p-0 flex flex-col overflow-hidden max-h-[300px]">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/30">
          <h3 className="text-slate-300 text-sm font-semibold flex items-center gap-2">
            <MessageCircle size={16} /> Live Mentions Feed
          </h3>
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {mentions.map((mention) => (
              <motion.div
                key={mention.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                layout
                className={`p-3 rounded-lg border flex gap-3 ${
                  mention.sentiment === 'negative' 
                    ? 'bg-red-500/5 border-red-500/20' 
                    : mention.sentiment === 'positive'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                 <div className={`w-1 h-full rounded-full shrink-0 ${
                    mention.sentiment === 'negative' ? 'bg-red-500' : mention.sentiment === 'positive' ? 'bg-emerald-500' : 'bg-slate-500'
                 }`}></div>
                 
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                       <span className="font-semibold text-sm text-slate-200">{mention.user}</span>
                       <span className="text-xs text-slate-500">{mention.time}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 truncate">{mention.text}</p>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
