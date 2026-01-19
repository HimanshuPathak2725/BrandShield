import React from 'react'
import { useState } from 'react'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Pricing from './pages/Pricing.jsx'
import Stairs from './components/Stairs/Stairs.jsx'
import NavContext from './components/NavContext/NavContext.jsx'
import { Route,Routes } from 'react-router-dom'
import BlobCursor from './components/BlobCursor/BlobCursor.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BlobCursor
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
    />
    <NavContext>
      
      <Stairs>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/pricing' element={<Pricing/>}/>
        </Routes>
      </Stairs>
    </NavContext>
    </>
  )
}

export default App
