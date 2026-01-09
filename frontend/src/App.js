import './App.css';
import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (currentPage === 'results') {
    return <ResultsPage setCurrentPage={setCurrentPage} />;
  }

  return <DashboardPage setCurrentPage={setCurrentPage} />;
}

export default App;
