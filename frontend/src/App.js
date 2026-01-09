import './App.css';
import { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'dashboard') {
    return <DashboardPage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'results') {
    return <ResultsPage setCurrentPage={setCurrentPage} />;
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
