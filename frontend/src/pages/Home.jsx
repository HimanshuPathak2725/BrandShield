import React from 'react'
import NavbarComp from '../components/NavbarComp/NavbarComp.jsx'
import HomeHeroText from '../components/Home/HomeHeroText'
import HomeBottomText from '../components/Home/HomeBottomText'
import Footer from '../components/Footer/Footer.jsx'
import Aurora from '../components/Aurora/Aurora.jsx'
import DotGrid from '../components/DotGrid/DotGrid.jsx'
import LaserFlow from '../components/LaserFlow/LaserFlow.jsx'
// import HomeFull from '../components/Home/HomeFull.jsx'
import Galaxy from '../components/Galaxy/Galaxy.jsx'

const Home = () => {

  return (


    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* DotGrid Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        /> */}
        {/* <Aurora
          colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        /> */}
       
      </div>

      {/* Navbar */}
      <div className=" top-0 left-0 right-0 z-50">
        <NavbarComp />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* <HomeFull /> */}
        <HomeHeroText />

      </div>
      <div className='bg-black'>
        <Footer />
      </div>

      {/* return <LaserFlowBoxExample /> */}
    </div>
  )
}

export default Home
