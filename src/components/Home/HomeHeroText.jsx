import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cube from '../Cube/Cube'
import LaserFlow from '../LaserFlow/LaserFlow'
import Galaxy from '../Galaxy/Galaxy'
import Threads from '../Threads/Threads.jsx'
import Squares from '../Squares/Squares.jsx'
import PrismaticBurst from '../PrismaticBurst/PrismaticBurst.jsx'
import GridDistortion from '../GridDistortion/GridDistortion.jsx'

gsap.registerPlugin(ScrollTrigger)




const HomeHeroText = () => {

  const image = useRef(null);
  // const text= useRef(null);
  const showcaseSection = useRef(null)
  const miniImage = useRef(null)



  useEffect(() => {

    const card = miniImage.current;
    const content = card.querySelector(".showcase-content");

    gsap.set(card, {
      width: "40vw",
      height: "30vh",
      borderRadius: "30px",
      overflow: "hidden"
    });

    gsap.set(content, {
      opacity: 0,
      y: 60,
      overflowY: "hidden"
    });

    gsap.set(".mini-heading", {
      opacity: 1
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: showcaseSection.current,
        start: "top top",
        end: "+=500%",
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    });

    // --- Expand Card ---
    tl.to(card, {
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      ease: "none"
    });

    // Hide small heading
    tl.to(".mini-heading", {
      opacity: 0,
      ease: "none"
    }, "<");

    // Show content
    tl.to(content, {
      opacity: 1,
      y: 0,
      ease: "none",
      onComplete: () => {
        content.style.overflowY = "auto";
      },
      onReverseComplete: () => {
        content.style.overflowY = "hidden";
        content.scrollTop = 0;
      }
    });

    // --- Hold fullscreen state across scroll ---
    tl.to(card, { scale: 1, duration: 1 });
    // dummy tween gives scroll length while keeping state

    // --- Fade content before shrink ---
    tl.to(content, {
      opacity: 0,
      y: 60,
      ease: "none",
      onComplete: () => {
        content.style.overflowY = "hidden";
        content.scrollTop = 0;
      }
    });

    // --- Shrink back ---
    tl.to(card, {
      width: "40vw",
      height: "30vh",
      borderRadius: "30px",
      ease: "none"
    });

    // Bring back small heading
    tl.to(".mini-heading", {
      opacity: 1,
      ease: "none"
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());

  }, []);


  useEffect(() => {
    gsap.to(image.current, {
      width: "100%",
      borderRadius: "0px",
      scrollTrigger: {
        trigger: image.current,
        start: "top 70%",
        end: "top 20%",
        scrub: true,
      }
    })
  }, []);


  return (
    <div>
      <div className='left-0 mt-100 pt-10  font-bold text-7xl'>
        <h1>Welcome to
          <div className='text-[13rem] pt-5 font-bold 
  bg-gradient-to-r from-[#44E9E4] via-[#B1F1F4] to-[#FAF6FF]
  bg-clip-text text-transparent'>BRANDSHIELD</div></h1>
      </div>


      <div className='pt-10 rounded-4xl m-auto' style={{ width: '90%', height: '600px', position: 'relative' }}>
        <GridDistortion
          imageSrc="https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="custom-class"
        />
      </div>


      <div className='mx-[10%] mt-25 font-[font4]'>
        <p> lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
      </div>

      {/* <div ref={miniImage} className="bg-red-500 h-[50vh] mx-[10vh] mt-40 w-[100vh] rounded-4xl flex items-center justify-end px-10">
                <div className='-mr-[30rem]'>




                </div>

            </div> */}

      <section ref={showcaseSection} className="relative w-full bg-black overflow-hidden">
        {/* Small inline styles for scrollbar hiding + minor visual tweaks */}
        <style>{`
        /* hide scrollbar for the inner content but still allow scrolling */
        .no-scrollbar::-webkit-scrollbar { height: 0; width: 0; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* small responsive caps */
        @media (max-width: 960px) {
          .mini-heading { font-size: 1.25rem; }
        }
      `}</style>


        {/* This wrapper defines the scrollable length for the pinned experience */}
        <div className="h-[100vh]">

          {/* pinned stage */}
          <div className="sticky top-0 h-screen w-full   flex items-center justify-center">
            {/* --- expanding card (starts small, expands to full screen) --- */}

            <div
              ref={miniImage}
              className="relative w-[40vw] h-[30vh] bg-white  rounded-3xl overflow-hidden flex "
            >
              =



              {/* Collapsed small heading (visible before expansion and reappears after shrink) */}
              <h2 className="mini-heading absolute font-[font3] text-center items-center justify-center  top-6 left-8 text-black text-3xl font-semibold tracking-tight z-20">
                Brand Experience
              </h2>

              {/* FULL content that becomes visible and scrollable when expanded.
                It is absolutely positioned inside the card and scrollable (overflow-y-auto).
                We add a 'no-scrollbar' utility to hide the native scrollbars visually. */}
              <div
                className="showcase-content absolute inset-0 opacity-0 overflow-y-auto no-scrollbar px-8 md:px-20 py-12"
                aria-hidden={false}
              >
                {/* HERO */}
                <div className="max-w-4xl">
                  <h2 className="text-5xl font-[font2] md:text-6xl mt-10 font-semibold text-black tracking-tight leading-tight">
                    Crafted to feel calm
                  </h2>
                  <p className="mt-6 text-lg md:text-xl text-black/65 leading-relaxed max-w-2xl">
                    Our intentions are designed to feel as calm as they look. Every interaction and transition is built to create clarity, confidence, and elegance.
                  </p>
                </div>

                {/* Feature grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  <div className="rounded-4xl overflow-hidden shadow-2xl">
                    <img src="/img1.jpeg" alt="workspace" className="w-full h-[320px] object-cover" />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-[font2] font-semibold text-black">Enterprise-grade experiences</h3>
                    <p className="text-lg text-black/65 leading-relaxed">
                      We craft digital environments that feel intuitive, refined and trustworthy — empowering teams to move faster and make smarter decisions.
                    </p>

                    <div className="flex gap-8 pt-4">
                      <div>
                        <p className="text-3xl font-semibold text-black">99.9%</p>
                        <p className="text-sm text-black/50">Uptime reliability</p>
                      </div>
                      <div>
                        <p className="text-3xl font-semibold text-black">3x</p>
                        <p className="text-sm text-black/50">Faster insights</p>
                      </div>
                      <div>
                        <p className="text-3xl font-semibold text-black">24/7</p>
                        <p className="text-sm text-black/50">Monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wide visual */}
                <div className="mt-14 rounded-4xl bg-black overflow-hidden shadow-2xl">
                  {/* <img src="/img3.jpeg" alt="visual" className="w-full h-[420px] object-cover" /> */}
                  <div className="mt-14 max-w-3xl">
                    <h3 className="text-2xl  text-white px-15 md:text-3xl font-semibold bg-black text-white mb-4">Designed for focus</h3>
                    <p className="text-lg text-white px-15 leading-relaxed">
                      Minimal interfaces reduce noise. Thoughtful motion guides attention. Every frame is purposeful.
                    </p>
                  </div>

                  <div className='bg-black' style={{ width: '90rem', height: '700px', position: 'relative' }}>

                    <Threads
                      amplitude={1.2}
                      distance={0.1}
                      enableMouseInteraction
                    />


                  </div>

                </div>


              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Extra space to allow scrolling */}
      {/* <div className="h-screen" /> */}
    </div>
  )
}


export default HomeHeroText
