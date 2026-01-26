import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, Globe, Users, Search } from 'lucide-react';
import './OnboardingPage.css';

const Onboarding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        brandName: '',
        website: '',
        industry: 'Tech',
        competitors: '', 
        keywords: ''     
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const payload = {
                ...formData,
                competitors: formData.competitors.split(',').map(s => s.trim()).filter(s => s),
                keywords: formData.keywords.split(',').map(s => s.trim()).filter(s => s)
            };

            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                localStorage.setItem('companyId', data.companyId);
                navigate('/dashboard');
            } else {
                const errData = await res.json();
                alert(`Setup Failed: ${errData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="onboarding-card"
            >
                <div className="onboarding-header">
                    <h2>Setup BrandShield</h2>
                    <p>Configure your AI watchdog in 60 seconds.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><Building2 size={16}/> Brand Name</label>
                        <input name="brandName" placeholder="e.g. Acme Corp" onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label><Globe size={16}/> Website</label>
                        <input name="website" placeholder="https://..." onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Industry</label>
                        <select name="industry" onChange={handleChange}>
                            <option value="Tech">Tech</option>
                            <option value="Finance">Finance</option>
                            <option value="Retail">Retail</option>
                            <option value="Airline">Airline</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label><Users size={16}/> Competitors (comma separated)</label>
                        <input name="competitors" placeholder="Competitor A, Competitor B" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                         <label><Search size={16}/> Critical Keywords</label>
                         <input name="keywords" placeholder="scam, lawsuit, outage" onChange={handleChange} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Configuring AI...' : 'Initialize System'} <ChevronRight size={16} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Onboarding;
