import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Database, Lock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 mb-6"
  >
    <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
      <div className="p-2 rounded-lg bg-blue-500/10">
        {/* Icon can be added here if needed */}
        {Icon && <Icon size={24} className="text-blue-400" />}
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

const InputField = ({ label, type = "text", value, onChange, placeholder, disabled = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);
  
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    company: ''
  });

  const [brandConfig, setBrandConfig] = useState({
    brandName: '',
    website: '',
    industry: '',
    competitors: '',
    keywords: ''
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile({
            name: data.name || '',
            email: data.email || '',
            role: data.role || 'Admin', // default role
            company: data.company || ''
        });

        if (data.brand_config) {
            const config = data.brand_config;
            setBrandConfig({
                brandName: config.brandName || '',
                website: config.website || '',
                industry: config.industry || 'Tech',
                competitors: Array.isArray(config.competitors) ? config.competitors.join(', ') : (config.competitors || ''),
                keywords: Array.isArray(config.keywords) ? config.keywords.join(', ') : (config.keywords || '')
            });
        }
      }
    } catch (error) {
        console.error("Failed to fetch profile", error);
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const payload = {
          name: profile.name,
          company: profile.company,
          brand_config: {
              ...brandConfig,
              // convert comma-separated strings back to arrays if backend expects arrays
              competitors: Array.isArray(brandConfig.competitors) ? brandConfig.competitors : brandConfig.competitors.split(',').map(s => s.trim()).filter(s => s),
              keywords: Array.isArray(brandConfig.keywords) ? brandConfig.keywords : brandConfig.keywords.split(',').map(s => s.trim()).filter(s => s)
          }
      };

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Settings saved successfully!");
        fetchProfile(); // refresh data
      } else {
        const err = await response.json();
        alert(`Error saving settings: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
        console.error("Error saving settings", error);
        alert("Error saving settings");
    } finally {
        setLoading(false);
    }
  };

  if (loading && !profile.email) {
      return <div className="p-10 text-white">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">User Profile & Settings</h1>
           <p className="text-slate-400">Manage your account and brand configuration</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Changes'}
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
             onChange={(v) => {}} 
             disabled={true}
           />
           <InputField 
             label="Role" 
             value={profile.role} 
             onChange={() => {}} 
             disabled
           />
           <InputField 
             label="Company" 
             value={profile.company} 
             onChange={(v) => setProfile({...profile, company: v})} 
           />
        </div>
      </SettingsSection>

      <SettingsSection title="Brand Configuration (Onboarding)" icon={Building2}>
         <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                    label="Brand Name" 
                    value={brandConfig.brandName} 
                    onChange={(v) => setBrandConfig({...brandConfig, brandName: v})} 
                    placeholder="e.g. Acme Corp"
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Industry</label>
                    <select 
                        value={brandConfig.industry}
                        onChange={(e) => setBrandConfig({...brandConfig, industry: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                        <option value="Tech">Tech</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Airline">Airline</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <InputField 
                label="Website" 
                value={brandConfig.website} 
                onChange={(v) => setBrandConfig({...brandConfig, website: v})} 
                placeholder="https://example.com"
            />
            <InputField 
                label="Competitors (comma separated)" 
                value={brandConfig.competitors} 
                onChange={(v) => setBrandConfig({...brandConfig, competitors: v})} 
                placeholder="Competitor A, Competitor B"
            />
            <InputField 
                label="Critical Keywords (comma separated)" 
                value={brandConfig.keywords} 
                onChange={(v) => setBrandConfig({...brandConfig, keywords: v})} 
                placeholder="scam, lawsuit, outage"
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
