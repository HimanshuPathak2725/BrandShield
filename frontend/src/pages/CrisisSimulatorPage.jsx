import React, { useState } from 'react';
import DigitalTwinSimulation from '../components/DigitalTwinSimulation/DigitalTwinSimulation';
import ResponseStrategies from '../components/ResponseStrategies/ResponseStrategies';

const CrisisSimulatorPage = () => {
  const [activeSimulation, setActiveSimulation] = useState(null);

  const handleRunSimulation = (strategyId) => {
    setActiveSimulation({ status: 'running', strategyId });
    // Simulate API delay
    const delay = Math.floor(Math.random() * 1500) + 1000;
    setTimeout(() => {
       setActiveSimulation({ status: 'complete', strategyId });
    }, delay);
  };

  return (
    <div className="crisis-simulator-page h-full p-6 bg-[#0f111a] overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Crisis Simulation Room</h1>
        <p className="text-blue-200 opacity-80">
          Test response strategies against a Digital Twin of your audience to predict outcomes.
        </p>
      </header>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <ResponseStrategies onSimulate={handleRunSimulation} />
        <DigitalTwinSimulation simulationState={activeSimulation} />
      </div>
    </div>
  );
};

export default CrisisSimulatorPage;
