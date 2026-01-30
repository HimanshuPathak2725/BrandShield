import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
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
import AdminPage from './pages/AdminPage/AdminPage';
import CrisisSimulatorPage from './pages/CrisisSimulatorPage';
import SettingsPage from './pages/SettingsPage';
import ConstructionPage from './pages/ConstructionPage';
import NotFound from './pages/NotFound';
import Onboarding from './pages/Onboarding';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RedirectIfAuthenticated({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <header style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
      <SignedOut>
        <SignInButton mode="modal" className="bg-white text-black px-4 py-2 rounded shadow mr-2"/>
        <SignUpButton mode="modal" className="bg-slate-900 text-white px-4 py-2 rounded shadow"/>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>

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
