import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Pricing from './pages/Pricing.jsx'
import Stairs from './components/Stairs/Stairs.jsx'
import NavContext from './components/NavContext/NavContext.jsx'
// import BlobCursor from './components/BlobCursor/BlobCursor.jsx'

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
    {/* <BlobCursor
      blobType="circle"
      fillColor="#5227FF"
      trailCount={3}
      sizes={[60,125,75]}
      innerSizes={[20,35,25]}
      innerColor="rgba(255,255,255,0.8)"
      opacities={[0.6,0.6,0.6]}
      shadowColor="rgba(0,0,0,0.75)"
      shadowBlur={5}
      shadowOffsetX={10}
      shadowOffsetY={10}
      filterStdDeviation={30}
      useFilter={true}
      fastDuration={0.1}
      slowDuration={0.5}
      zIndex={100}
    /> */}
    <NavContext>
      
      <Stairs>
        <Routes>
          {/* Public Routes with Redirect if logged in */}
          <Route path='/' element={
            <RedirectIfAuthenticated>
              <Home/>
            </RedirectIfAuthenticated>
          }/>
          <Route path='/auth' element={
            <RedirectIfAuthenticated>
              <AuthPage />
            </RedirectIfAuthenticated>
          }/>

          {/* Marketing Pages */}
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
