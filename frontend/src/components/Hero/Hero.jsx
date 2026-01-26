import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaUser } from 'react-icons/fa';
import './Hero.css';
import Dashboard from '../Dashboard/Dashboard';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            Live Intelligence Engine v2.0
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">AI-Powered Public</span>
            <span className="title-line highlight">Reaction</span>
            <span className="title-line highlight">Intelligence</span>
          </h1>
          
          <p className="hero-description">
            Decode market sentiment in real-time. We turn millions of social signals 
            into actionable product strategy before your launch even finishes.
          </p>
          
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              <span className="btn-icon"><FaPlay /></span> Start Analysis
            </Link>
            <button className="btn btn-secondary">
              <span className="btn-icon"><FaPlay /></span> View Demo
            </button>
          </div>
          
          <div className="trusted-by">
            <div className="avatars">
              <div className="avatar"><FaUser /></div>
              <div className="avatar"><FaUser /></div>
              <div className="avatar"><FaUser /></div>
            </div>
            <span className="trusted-text">Trusted by 500+ Product Teams</span>
          </div>
        </div>
        
        <div className="hero-visual">
          <Dashboard />
        </div>
      </div>
    </section>
  );
}

export default Hero;
