import React from 'react';
import ResultsHeader from '../components/ResultsHeader/ResultsHeader';
import SentimentScore from '../components/SentimentScore/SentimentScore';
import TrendWidget from '../components/TrendWidget/TrendWidget';
import AspectCards from '../components/AspectCards/AspectCards';
import TopOpinions from '../components/TopOpinions/TopOpinions';
import AIInsight from '../components/AIInsight/AIInsight';
import './ResultsPage.css';

function ResultsPage({ setCurrentPage }) {
  return (
    <div className="results-page">
      <ResultsHeader setCurrentPage={setCurrentPage} />
      <main className="results-main">
        <div className="results-container">
          <section className="results-row">
            <SentimentScore />
            <TrendWidget />
          </section>

          <AspectCards />
          <TopOpinions />
          <AIInsight />
        </div>
      </main>
    </div>
  );
}

export default ResultsPage;
