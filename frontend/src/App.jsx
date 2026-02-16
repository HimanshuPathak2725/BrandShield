import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Pricing from './pages/Pricing.jsx'
import Stairs from './components/Stairs/Stairs.jsx'
import NavContext from './components/NavContext/NavContext.jsx'

// Legacy Imports from App.js for Functionality
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

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

function RedirectIfAuthenticated({ children }) {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NavContext>
      
      <Stairs>
        <Routes>
          {/* Public Routes with Redirect if logged in */}
          <Route path='/' element={<Home/>}/>
          <Route path='/auth' element={
            <RedirectIfAuthenticated>
              <AuthPage />
            </RedirectIfAuthenticated>
          }/>

          {/* Marketing Pages - accessible to all */}
          <Route path='/about' element={<About/>}/>
          <Route path='/pricing' element={<Pricing/>}/>

          {/* Protected Logic Routes */}
          <Route path="/onboarding" element={
              <ProtectedRoute>
                  <Onboarding />
              </ProtectedRoute>
          } />
          
          <Route path="/admin" element={<AdminPage />} />

          {/* Dashboard Layout Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/analytics" element={<TrendsPage />} />
            <Route path="/simulator" element={<CrisisSimulatorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/construction" element={<ConstructionPage />} />
          </Route>
            
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Stairs>
    </NavContext>
    </>
  )
}

export default App
