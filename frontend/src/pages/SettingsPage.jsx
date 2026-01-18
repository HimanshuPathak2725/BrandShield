import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Database, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 mb-6"
  >
    <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
      <div className="p-2 rounded-lg bg-blue-500/10">
        <Icon size={20} className="text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Toggle = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-slate-300">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>
);

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@brandshield.ai',
    role: 'Administrator'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    browserPush: false,
    weeklyDigest: true,
    riskThreshold: true
  });

  const [apiConfig, setApiConfig] = useState({
    redditEnabled: true,
    youtubeEnabled: true,
    frequency: 'realtime'
  });

  const handleSave = () => {
    // Determine user feedback (could be a toast in a real app)
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
           <p className="text-slate-400">Manage your organization preferences and configurations</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <SettingsSection title="Profile Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputField 
             label="Full Name" 
             value={profile.name} 
             onChange={(v) => setProfile({...profile, name: v})} 
           />
           <InputField 
             label="Email Address" 
             value={profile.email} 
             onChange={(v) => setProfile({...profile, email: v})} 
           />
           <InputField 
             label="Role" 
             value={profile.role} 
             onChange={() => {}} 
             disabled
           />
        </div>
      </SettingsSection>

      <SettingsSection title="Notification Preferences" icon={Bell}>
        <div className="space-y-1">
          <Toggle 
            label="Email Alerts (High Risk)" 
            enabled={notifications.emailAlerts} 
            onChange={(v) => setNotifications({...notifications, emailAlerts: v})} 
          />
          <Toggle 
            label="Browser Push Notifications" 
            enabled={notifications.browserPush} 
            onChange={(v) => setNotifications({...notifications, browserPush: v})} 
          />
          <Toggle 
            label="Weekly Intelligence Details" 
            enabled={notifications.weeklyDigest} 
            onChange={(v) => setNotifications({...notifications, weeklyDigest: v})} 
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Data & Sources" icon={Database}>
        <div className="space-y-1">
          <Toggle 
            label="Monitor Reddit Discussions" 
            enabled={apiConfig.redditEnabled} 
            onChange={(v) => setApiConfig({...apiConfig, redditEnabled: v})} 
          />
          <Toggle 
            label="Monitor YouTube Comments" 
            enabled={apiConfig.youtubeEnabled} 
            onChange={(v) => setApiConfig({...apiConfig, youtubeEnabled: v})} 
          />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
           <label className="block text-sm font-medium text-slate-400 mb-2">Update Frequency</label>
           <select 
             value={apiConfig.frequency}
             onChange={(e) => setApiConfig({...apiConfig, frequency: e.target.value})}
             className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
           >
             <option value="realtime">Real-time (Active Polling)</option>
             <option value="15min">Every 15 Minutes</option>
             <option value="hourly">Hourly</option>
           </select>
        </div>
      </SettingsSection>

      <SettingsSection title="Security" icon={Shield}>
         <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-3">
               <Lock size={20} className="text-yellow-500" />
               <div>
                 <span className="block text-slate-200 font-medium">Two-Factor Authentication</span>
                 <span className="text-xs text-slate-400">Add an extra layer of security to your account</span>
               </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 rounded border border-slate-600 hover:bg-slate-700">
              Enable 2FA
            </button>
         </div>
      </SettingsSection>

    </div>
  );
};

export default SettingsPage;
