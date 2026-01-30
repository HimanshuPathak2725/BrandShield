import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerk } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart2, 
  ShieldAlert, 
  Settings, 
  Menu, 
  Bell, 
  Search,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all duration-300 group relative overflow-hidden ${
          isActive 
            ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
        }`
      }
    >
      <Icon size={20} className="min-w-[20px]" />
      <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
        {label}
      </span>
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-slate-700">
          {label}
        </div>
      )}
    </NavLink>
  );
};

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut({ redirectUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const newsItems = [
    "BREAKING: Tesla mentions spike 200% following battery report...",
    "ALERT: Competitor launch detected in APAC region...",
    "UPDATE: Sentiment recovering in North American sector...",
    "NEWS: New social media platform gaining traction among Gen Z...",
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 260 }}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="h-full bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20 relative transition-all duration-300"
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <ShieldAlert size={18} className="text-white" />
          </div>
          <motion.div 
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
            className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden"
          >
            BrandShield
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            
            <SidebarItem icon={Activity} label="Live Feed" to="/dashboard" isCollapsed={isCollapsed} /> {/* Pointing to same for demo */}
            <SidebarItem icon={BarChart2} label="Analytics" to="/analytics" isCollapsed={isCollapsed} />
            <SidebarItem icon={ShieldAlert} label="Crisis Simulator" to="/simulator" isCollapsed={isCollapsed} />
          </div>
          
          <div className="mt-8">
            <div className={`px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
              System
            </div>
            <SidebarItem icon={Settings} label="Settings" to="/settings" isCollapsed={isCollapsed} />
          </div>
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-slate-800/50">
          <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
             <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <User size={18} className="text-slate-300" />
             </div>
             {!isCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-medium truncate">Admin User</div>
                 <div className="text-xs text-slate-500 truncate">admin@brandshield.ai</div>
               </div>
             )}
             {!isCollapsed && (
                 <button onClick={(e) => {
                     e.stopPropagation();
                     handleLogout();
                 }} className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                    <LogOut size={16} className="text-slate-500 hover:text-red-400" />
                 </button>
             )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-50"
        >
          <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        
        {/* Global Header */}
        <header className="h-16 bg-slate-900/30 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10">
          
          {/* Breaking News Ticker */}
          <div className="flex items-center overflow-hidden max-w-2xl text-sm">
            <div className="flex items-center gap-2 text-red-400 font-bold whitespace-nowrap mr-4 shrink-0">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
               LIVE ALERTS
            </div>
            
            <div className="relative overflow-hidden w-full h-6 mask-linear-fade"> 
             {/* Simple ticker effect using Tailwind animate-scroll would need custom keyframes, simpler to use Framer Motion or just text slider */}
             <motion.div 
               className="flex whitespace-nowrap gap-8 text-slate-400"
               animate={{ x: ["0%", "-100%"] }}
               transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
             >
               {[...newsItems, ...newsItems].map((item, i) => (
                 <span key={i} className="flex items-center gap-2">
                   <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                   {item}
                 </span>
               ))}
             </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Live Status */}
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                SYSTEM ONLINE
             </div>

             <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
             </button>
          </div>
        </header>

        {/* Page Content Output */}
        <main className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
           <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="h-full"
             >
               <Outlet />
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
