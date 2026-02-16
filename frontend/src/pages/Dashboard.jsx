import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Megaphone, 
  Lock, 
  Globe, 
  Zap,
  TrendingUp,
  X,
  Radio
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import RiskTrajectoryChart from '../components/Dashboard/RiskTrajectoryChart';

// --- VISUAL CONSTANTS ---
const ANIM_TRANSITION = { type: "spring", stiffness: 100, damping: 20 };
const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    show: { 
        opacity: 1, 
        transition: { staggerChildren: 0.1 } 
    }
};
const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: ANIM_TRANSITION }
};

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, borderClass }) => (
  <div className={`group bg-white/80 backdrop-blur-sm p-5 rounded-xl border ${borderClass} shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between min-h-[110px]`}>
    <div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">{title}</p>
      <h3 className={`text-3xl font-mono font-bold tracking-tight ${colorClass} drop-shadow-sm`}>{value}</h3>
      <p className="text-slate-400 text-xs mt-2 font-medium flex items-center gap-1">
        {subtext.includes('+') ? <TrendingUp size={12} className={colorClass} /> : null}
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${colorClass.replace('text-', 'bg-').replace('600', '50').replace('500', '50')}`}>
       <Icon size={22} className={colorClass} strokeWidth={2} />
    </div>
  </div>
);

const TickerItem = ({ text, severity }) => (
  <div className="flex items-center gap-3 px-8 border-r border-red-900/20 whitespace-nowrap">
    <div className={`relative flex h-2 w-2`}>
      {severity === 'CRITICAL' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${severity === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-400'}`}></span>
    </div>
    <span className="text-slate-100 text-xs font-mono font-medium uppercase tracking-wider antialiased drop-shadow-sm">{text}</span>
  </div>
);

const VelocityGauge = ({ riskLevel }) => {
  // Convert 0-100 to angle (0 = -90deg, 100 = 90deg)
  const angle = (riskLevel / 100) * 180 - 90;
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-4">
       <div className="relative w-64 h-32 overflow-hidden">
         {/* SVG Gauge */}
         <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background Track - Grey (Left) */}
            <path d="M 20 100 A 80 80 0 0 1 100 20" fill="none" stroke="#E2E8F0" strokeWidth="20" strokeLinecap="butt" />
            {/* Danger Zone - Red (Right) */}
            <path d="M 100 20 A 80 80 0 0 1 180 100" fill="none" stroke="#EF4444" strokeWidth="20" strokeLinecap="butt" />
            
            {/* Needle */}
            <g transform={`translate(100, 100) rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2="-75" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
                <circle cx="0" cy="0" r="8" fill="#1E293B" />
            </g>
         </svg>
       </div>
       
       <div className="mt-2 text-center">
        <span className="text-5xl font-black text-slate-800 tracking-tighter">{riskLevel}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-widest mt-1">Velocity Index</span>
      </div>
    </div>
  );
};

const HeatmapItem = ({ topic, sentiment, volume }) => {
    // Styling based on 'image.png'
    // Red cards for Negative, White/Grey for others.
    const isNegative = sentiment === 'Negative';
    
    // Dynamic styles
    const containerClasses = isNegative 
      ? "bg-[#C62828] text-white shadow-lg shadow-red-900/20 border-red-800"
      : "bg-white text-slate-700 border-slate-200 shadow-sm hover:border-slate-300";

    const titleColor = isNegative ? "text-white" : "text-slate-700";
    const subTextColor = isNegative ? "text-red-100" : "text-slate-400";
    const barBg = isNegative ? "bg-red-900/40" : "bg-slate-100";
    const barFill = isNegative ? "bg-white" : "bg-slate-400";
    const iconColor = isNegative ? "text-white" : "text-slate-400";

    return (
        <motion.div 
            variants={ITEM_VARIANTS}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl border p-4 w-full mb-3 last:mb-0 relative overflow-hidden transition-all duration-300 ${containerClasses}`}
        >
            <div className="flex justify-between items-start mb-6">
                <span className={`font-bold uppercase tracking-tight text-sm ${titleColor}`}>{topic}</span>
                <AlertTriangle size={16} className={`${iconColor} ${isNegative ? 'animate-pulse' : 'hidden'}`} />
            </div>
            
            <div className="flex justify-between items-end w-full">
               <span className={`font-mono text-xs font-medium ${subTextColor}`}>{volume}% Vol</span>
               
               {/* Progress Bar - Right Aligned */}
               <div className={`h-1.5 w-24 rounded-full overflow-hidden ${barBg}`}>
                  <div className={`h-full rounded-full ${barFill}`} style={{ width: `${volume}%` }}></div>
               </div>
            </div>
            
            {/* Subtle Gradient Overlay for Depth */}
            {isNegative && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>}
        </motion.div>
    );
};


const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [crisisMode, setCrisisMode] = useState(false);
    const [stats, setStats] = useState({
        activeThreats: 0,
        velocity: 0,
        sentimentDiff: 0
    });
    const [liveAlerts, setLiveAlerts] = useState([]);
    
    // API CONFIG
    const API_BASE_URL = process.env.REACT_APP_API_URL || '';

    useEffect(() => {
        const fetchLiveAlerts = async () => {
          try {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch(`${API_BASE_URL}/api/alerts/stream`, { headers });
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0) {
                  setLiveAlerts(data);
                  // Update stats based on live alerts
                  setStats(prev => ({
                      ...prev,
                      activeThreats: data.length,
                      velocity: data.length > 2 ? 92 : 45
                  }));
                  setCrisisMode(data.some(a => a.severity === 'high'));
              }
            }
          } catch (e) {
            console.error("Dashboard alerts error:", e);
          }
        };
        
        fetchLiveAlerts();
        const interval = setInterval(fetchLiveAlerts, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleCounterMeasure = (label) => {
        const confirm = window.confirm(`⚠️ ESTABLISHING SECURE CONNECTION\n\nAre you sure you want to execute: ${label}?\nThis action will be logged.`);
        if(confirm) {
            alert(`ACTION QUEUED: ${label}\nWaiting for multi-signature authorization...`);
        }
    };

    const handleGenerateReport = () => {
        const reportContent = `
BRANDSHIELD AI - EXECUTIVE REPORT
Date: ${new Date().toLocaleDateString()}
----------------------------------------

1. AI INSIGHT SUMMARY
----------------------------------------
Design sentiment is trending upwards (+12% WoW) largely due to the "Sleek Side Profile" which is consistently praised in 45% of recent positive comments. 
However, "Front Grill Design" remains a polarizing factor that contributes to 68% of negative design feedback.

CRISIS INDICATORS:
- Velocity Index: ${stats.velocity}/100 (CRITICAL) - Indicating coordinated activity.
- Emerging Threats: "Battery Fire" speculation is gaining traction (92% Vol).
- Sentiment Drift: ${stats.sentimentDiff}% in last 24h due to viral support complaints.
- Active Threats: ${stats.activeThreats} detected vectors.

2. RECOMMENDATIONS
----------------------------------------
[IMMEDIATE] Activate "Operation Truth" bot swarm to counter misinformation regarding battery safety.
[SHORT-TERM] Feature more profile-angle imagery in upcoming campaigns to capitalize on current positive sentiment.
[MONITOR] Keep close watch on "Refunds" keyword spike in APAC region.

3. METRICS OVERVIEW
----------------------------------------
- Active Time Range: 30 Days
- Total Mentions Analyzed: ${stats.velocity * 124}
- Net Sentiment Score: +18 (Down from +33)
- Top Platform: Twitter/X (62% of volume)

4. DETAILED SENTIMENT BREAKDOWN
----------------------------------------
| Aspect       | Positive | Negative | Primary Driver          |
|--------------|----------|----------|-------------------------|
| Design       | 82%      | 6%       | Side Profile (Pos)      |
| Price        | 45%      | 25%      | Entry Level Cost (Neg)  |
| Performance  | 74%      | 10%      | Acceleration (Pos)      |
| Service      | 30%      | 55%      | Wait Times (Neg)        |

----------------------------------------
Generated by BrandShield AI - Corporate Watchtower
Confidential - Internal Use Only
`;
    
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BrandShield_Report_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch live metrics from Dashboard API
                // This endpoint needs to actually return something useful in python
                const res = await fetch(`${API_BASE_URL}/api/dashboard`);
                if(!res.ok) throw new Error("Dashboard fetch failed");
                const data = await res.json();
                
                // 2. Fetch recent session insights (Live Mode)
                const insightsRes = await fetch(`${API_BASE_URL}/api/insights?days=1`);
                const insights = await insightsRes.json();
                
                // Combine Data
                // If we have live mentions from api/dashboard (based on analysis_history), use them.
                // Otherwise falls back to mock in backend, which is fine for now.
                
                const livePosts = data.topMentions || [];
                const criticalCount = livePosts.filter(p => p.sentiment === 'Negative').length;
                
                setPosts(livePosts.slice(0, 10)); // Top 10 for ticker
                
                setStats({
                    activeThreats: data.activeAlerts?.length || criticalCount,
                    velocity: data.velocityScore || 0,
                    sentimentDiff: insights.momentum?.negative || 0
                });
                
                setCrisisMode(data.velocityScore > 70 || criticalCount > 2);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard Sync Failed:", err);
                // Graceful fallback to static if API down
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#F4F7FA] text-slate-400 flex-col gap-4">
            <Activity className="animate-spin text-slate-300" size={32} />
            <span className="text-xs uppercase tracking-widest font-bold animate-pulse">Initializing Watchtower...</span>
        </div>
    );

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-800 font-sans overflow-x-hidden relative selection:bg-red-100 selection:text-red-900">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* 1. TOP TICKER - SMOOTH & PROFESSIONAL */}
      <AnimatePresence>
      {crisisMode && (
         <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-full h-12 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] flex items-center overflow-hidden relative shadow-lg z-50 border-b border-red-900/20"
         >
            <div className="bg-[#8B0000] h-full px-6 flex items-center z-20 font-bold text-white text-xs tracking-[0.2em] shadow-xl">
                <span className="flex items-center gap-3">
                    <ShieldAlert size={18} className="animate-pulse" />
                    LIVE THREATS
                </span>
                <div className="h-full w-4 absolute right-[-16px] top-0 bg-gradient-to-r from-[#8B0000] to-transparent z-20"></div>
            </div>
            
            <div className="flex animate-marquee items-center absolute left-0 h-full whitespace-nowrap overflow-hidden w-full mask-linear-fade">
                <motion.div 
                    animate={{ x: [0, -2000] }} 
                    transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                    className="flex pl-[200px]"
                >
                    {posts.filter(p => p.severity === 'CRITICAL' || p.severity === 'HIGH').map((p, i) => (
                        <TickerItem key={i} text={`[${p.platform.toUpperCase()}] ${p.theme?.toUpperCase() || 'ALERT'}: ${p.text.substring(0, 60)}...`} severity={p.severity} />
                    ))}
                    {/* Duplicate for seamless loop effect if list is short */}
                    {posts.filter(p => p.severity === 'CRITICAL' || p.severity === 'HIGH').map((p, i) => (
                        <TickerItem key={`dup-${i}`} text={`[${p.platform.toUpperCase()}] ${p.theme?.toUpperCase() || 'ALERT'}: ${p.text.substring(0, 60)}...`} severity={p.severity} />
                    ))}
                </motion.div>
            </div>
         </motion.div>
      )}
      </AnimatePresence>

      <div className="p-8 max-w-[1800px] mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200/60">
            <div>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4"
                >
                    CORPORATE WATCHTOWER
                    {crisisMode && (
                        <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-200 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            Emergency Protocol
                        </motion.span>
                    )}
                </motion.h1>
                <p className="text-slate-500 font-medium text-sm mt-2 flex items-center gap-2">
                    <Radio size={14} className="text-emerald-500 animate-pulse" />
                    System Online • Monitoring Global Channels • Real-time
                </p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={handleGenerateReport}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold tracking-wide shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all hover:shadow"
                >
                    EXPORT REPORT
                </button>
                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold tracking-wide shadow-lg shadow-slate-900/20 hover:bg-black hover:scale-[1.02] transition-all flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400 fill-current" />
                    AUTO-MITIGATE
                </button>
            </div>
        </header>

        {/* MAIN GRID */}
        <motion.div 
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="show"
            className="grid grid-cols-12 gap-8"
        >

            {/* LEFT COLUMN: METRICS & CHART */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
                
                {/* 3 STAT CARDS */}
                <div className="grid grid-cols-3 gap-8">
                    <motion.div variants={ITEM_VARIANTS}>
                        <StatCard 
                            title="Threat Velocity" 
                            value={`${stats.velocity} P/M`} 
                            subtext="+24% surge"
                            icon={Activity}
                            colorClass="text-[#D32F2F]"
                            borderClass="border-red-100 bg-red-50/30"
                        />
                    </motion.div>
                    <motion.div variants={ITEM_VARIANTS}>
                        <StatCard 
                            title="Active Themes" 
                            value={stats.activeThreats} 
                            subtext="Critical Attention"
                            icon={Megaphone}
                            colorClass="text-orange-600"
                            borderClass="border-orange-100 bg-orange-50/30"
                        />
                    </motion.div>
                    <motion.div variants={ITEM_VARIANTS}>
                         <StatCard 
                            title="Sentiment Drift" 
                            value={`${stats.sentimentDiff}%`} 
                            subtext="Negative Slide"
                            icon={TrendingUp}
                            colorClass="text-slate-600"
                            borderClass="border-slate-200"
                        />
                    </motion.div>
                </div>

                {/* MAIN CHART - GLASSY CONTAINER */}
                <motion.div 
                    variants={ITEM_VARIANTS}
                    className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-5 h-[500px] flex flex-col items-stretch justify-items-stretch overflow-hidden"
                >
                    <RiskTrajectoryChart isCrisis={crisisMode} velocityScore={stats.velocity} />
                </motion.div>

                {/* BOTTOM: ACTION CENTER */}
                <motion.div 
                    variants={ITEM_VARIANTS}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2 tracking-wide">
                            <Lock size={18} className="text-slate-400" />
                            Executive Counter-Measures
                        </h3>
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold tracking-widest border border-slate-200">ADMIN AUTHORIZATION ONLY</span>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {[
                            { label: 'Deploy Bot Swarm', color: 'bg-indigo-600 hover:bg-indigo-700', icon: Zap }, 
                            { label: 'Issue Legal Takedown', color: 'bg-slate-800 hover:bg-slate-900', icon: Lock }, 
                            { label: 'Suppress Viral Hashtags', color: 'bg-red-700 hover:bg-red-800', icon: ShieldAlert }, 
                            { label: 'Crisis PR Blast', color: 'bg-emerald-600 hover:bg-emerald-700', icon: Megaphone }
                        ].map((action, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleCounterMeasure(action.label)}
                                className={`${action.color} text-white py-4 px-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-xs font-bold uppercase tracking-wide flex flex-col gap-2 items-center justify-center group active:scale-95`}
                            >
                                <action.icon size={20} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* RIGHT COLUMN: VELOCITY & HEATMAP */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
                
                {/* VELOCITY GAUGE */}
                <motion.div 
                    variants={ITEM_VARIANTS}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-red-500 to-slate-200 opacity-50"></div>
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-6 self-start w-full border-b border-slate-100 pb-3 flex justify-between">
                        <span>Traffic Intensity</span>
                        <Activity size={14} />
                    </h3>
                    <VelocityGauge riskLevel={stats.velocity > 0 ? stats.velocity : 85} />
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-8 w-full">
                        <p className="text-center text-xs text-red-800 leading-relaxed font-medium">
                            <AlertTriangle size={12} className="inline mr-1 mb-0.5" />
                            Current ingestion rate indicates a coordinated attack vector. Volume is <strong>CRITICAL</strong>.
                        </p>
                    </div>
                </motion.div>

                {/* HEATMAP / CRISIS CLOUD */}
                <motion.div 
                    variants={CONTAINER_VARIANTS}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[500px] flex flex-col"
                >
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-6 flex justify-between items-center">
                        <span>Thematic Heatmap</span>
                        <Globe size={14} />
                    </h3>
                    <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                        {/* Live Data or Mock Fallback */}
                        {liveAlerts.length > 0 ? (
                            liveAlerts.map((alert, i) => (
                                <HeatmapItem 
                                    key={i} 
                                    topic={alert.title.length > 25 ? alert.title.substring(0,25)+"..." : alert.title} 
                                    sentiment={alert.severity === 'high' ? "Negative" : "Neutral"} 
                                    volume={alert.severity === 'high' ? 85 + (i*2) : 45} 
                                />
                            ))
                        ) : (
                            <>
                                <HeatmapItem topic="BATTERY FIRE" sentiment="Negative" volume={92} />
                                <HeatmapItem topic="Stock Price" sentiment="Negative" volume={65} />
                                <HeatmapItem topic="CEO Statement" sentiment="Neutral" volume={40} />
                                <HeatmapItem topic="Refunds" sentiment="Negative" volume={55} />
                                <HeatmapItem topic="Support" sentiment="Negative" volume={30} />
                            </>
                        )}
                    </div>
                </motion.div>

            </div>

        </motion.div>
      </div>
    </div>
  );
};
export default Dashboard;
