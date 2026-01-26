import React from 'react';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import AnalysisForm from '../components/AnalysisForm/AnalysisForm';
import RecentAnalyses from '../components/RecentAnalyses/RecentAnalyses';
import DemoAnalysis from '../components/DemoAnalysis/DemoAnalysis';
import ActionCenter from '../components/ActionCenter/ActionCenter';
import VelocityGauge from '../components/VelocityGauge/VelocityGauge';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="metrics-row">
               <div className="analysis-section">
                  <AnalysisForm />
               </div>
               {/* Mock data for Gauge until initial load */}
               <VelocityGauge 
                 currentVelocity={42} 
                 predictedPeak={85} 
                 trendProbability={78.5} 
               />
            </div>
            
            <ActionCenter />
            <DemoAnalysis />
          </div>
          <aside className="dashboard-sidebar">
            <RecentAnalyses />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
