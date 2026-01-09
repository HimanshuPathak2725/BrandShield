import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import NotFound from './pages/NotFound';

function HomePage() {
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
