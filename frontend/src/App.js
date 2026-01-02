import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            🛡️ BrandShield <span className="ml-2 text-sm font-normal bg-blue-800 px-2 py-1 rounded">War Room</span>
          </h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
