import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import DashboardPage from './pages/Dashboard';
import Layout from './components/Layout/Layout';
import ResultsPage from './pages/ResultsPage';
import TrendsPage from './pages/TrendsPage/TrendsPage';
import InsightsPage from './pages/InsightsPage/InsightsPage';
import AuthPage from './pages/AuthPage/AuthPage';
import AdminPage from './pages/AdminPage/AdminPage';
import CrisisSimulatorPage from './pages/CrisisSimulatorPage';
import SettingsPage from './pages/SettingsPage';
import ConstructionPage from './pages/ConstructionPage';
import NotFound from './pages/NotFound';

import Onboarding from './pages/Onboarding';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function HomePage() {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="App">
      <Header />
      <section className="main-content">
        <div className="container">
          <Hero />
        </div>
      </section>
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminPage />} />
        
        <Route path="/onboarding" element={
            <ProtectedRoute>
                <Onboarding />
            </ProtectedRoute>
        } />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/analytics" element={<TrendsPage />} />
          <Route path="/simulator" element={<CrisisSimulatorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
