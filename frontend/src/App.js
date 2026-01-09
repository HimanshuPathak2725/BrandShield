import './App.css';
import { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import TrendsPage from './pages/TrendsPage/TrendsPage';
import InsightsPage from './pages/InsightsPage/InsightsPage';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If not authenticated and trying to access protected pages, show auth
  if (!isAuthenticated && (currentPage === 'dashboard' || currentPage === 'results' || currentPage === 'trends' || currentPage === 'insights')) {
    return <AuthPage setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />;
  }

  if (currentPage === 'dashboard') {
    return <DashboardPage setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />;
  }

  if (currentPage === 'results') {
    return <ResultsPage setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />;
  }

  if (currentPage === 'trends') {
    return <TrendsPage setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />;
  }

  if (currentPage === 'insights') {
    return <InsightsPage setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="App">
      <Header setCurrentPage={setCurrentPage} />
      <section className="main-content">
        <div className="container">
          <Hero setCurrentPage={setCurrentPage} />
        </div>
      </section>
      <Features />
      <CTA setCurrentPage={setCurrentPage} />
      <Footer />
    </div>
  );
}

export default App;
