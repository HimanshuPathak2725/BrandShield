import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React  from 'react'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer/Footer.jsx'
import Stairs from './components/Stairs/Stairs.jsx'
import BlobCursor from './components/BlobCursor/BlobCursor.jsx'
// import FullScreenNav from './components/NavbarComp/FullScreenNav.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>
    {/* <FullScreenNav> */}
    <Stairs>
  
    <App />
    </Stairs>
    {/* </FullScreenNav > */}
    </BrowserRouter>
  </StrictMode>,
)
