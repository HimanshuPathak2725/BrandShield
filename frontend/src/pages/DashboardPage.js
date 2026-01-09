import React from 'react';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import AnalysisForm from '../components/AnalysisForm/AnalysisForm';
import RecentAnalyses from '../components/RecentAnalyses/RecentAnalyses';
import DemoAnalysis from '../components/DemoAnalysis/DemoAnalysis';
import './DashboardPage.css';

function DashboardPage({ setCurrentPage }) {
  return (
    <div className="dashboard-page">
      <DashboardHeader setCurrentPage={setCurrentPage} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            <AnalysisForm setCurrentPage={setCurrentPage} />
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
