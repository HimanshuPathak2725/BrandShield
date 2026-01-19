import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollFloatComp from "../ScrollFloat/ScrollFloatComp"
import ScrollReveal from "../ScrollReveal/ScrollReveal"
import Ballpit from '../Ballpit/Ballpit.jsx'
import LetterGlitch from "../LetterGlitch/LetterGlitch.jsx"
import Footer from "../Footer/Footer.jsx"


gsap.registerPlugin(ScrollTrigger)

const AboutPage = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const blue = useRef(null);
  const orange = useRef(null);
  const blackContainerRef = useRef(null);
  const wrapperRef = useRef(null)
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const overlayRef = useRef(null)

  // useEffect(() => {

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: section2Ref.current,
  //       start: "top top",
  //       end: "+=100%",
  //       scrub: true,
  //       pin: true,
  //       anticipatePin: 1
  //       // markers:true
  //     }
  //   })
  //   // Fade out Section 1
  //   tl.to(section1Ref.current, {
  //     opacity: 0,
  //     ease: "none"
  //   }, 0)

  //   // Fade in Section 2
  //   tl.fromTo(section2Ref.current,
  //     { opacity: 0 },
  //     { opacity: 1, ease: "none" },
  //     0
  //   )

  //   // // Background + text color transition
  //   // tl.to(wrapperRef.current, {
  //   //   backgroundColor: "#000",
  //   //   color: "#fff",
  //   //   ease: "none"
  //   // }, 0)

  //   return () => ScrollTrigger.getAll().forEach(t => t.kill())
  // }, [])


  //   useEffect(() => {

  //   gsap.to(blackContainerRef.current, {
  //     backgroundColor: "#000",
  //     color: "#fff",
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: containerRef.current,
  //       start: "top top",
  //       end: "bottom top",
  //       scrub: true
  //     }
  //   })

  // }, []);

  useEffect(() => {

    // BLUE CARD — slide from left
    gsap.fromTo(blue.current,
      { x: -120, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: blue.current,
          start: "top 85%",
          end: "top 60%",
          scrub: true
        }
      }
    )

    // ORANGE CARD — slide from right
    gsap.fromTo(orange.current,
      { x: 120, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: orange.current,
          start: "top 85%",
          end: "top 60%",
          scrub: true
        }
      }
    )

    // Extra polish — soft shadow on scroll
    gsap.to(image1Ref.current, {
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      scrollTrigger: {
        trigger: image1Ref.current,
        start: "top 90%",
        end: "bottom 40%",
        scrub: true
      }
    })

    gsap.to(image2Ref.current, {
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      scrollTrigger: {
        trigger: image2Ref.current,
        start: "top 90%",
        end: "bottom 40%",
        scrub: true
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())

  }, [])


  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500",
          scrub: 1,
          pin: true,
          markers: true,
        },
      });

      // Initial states
      gsap.set(image1Ref.current, { y: "150%", rotateX: -10, z: -100, opacity: 0 });
      gsap.set(image2Ref.current, { y: "200%", rotateX: -10, z: -200, opacity: 0 });

      // Animation sequence
      tl.to(image1Ref.current, {
        y: "62%",
        rotateX: 0,
        z: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      })
        .to(image2Ref.current, {
          y: "68%", // Stops lower to match the desired position
          rotateX: 0,
          z: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }, "-=0.2"); // Slight overlap in timing

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative">

      {/* ===== HERO SECTION ===== */}
      <div
        ref={el => { containerRef.current = el; section1Ref.current = el; }}
        className="bg-[#f5f5f7] text-black min-h-screen w-full relative overflow-hidden 
                 flex flex-col items-center justify-center p-4"
        style={{ perspective: "1000px" }}
      >
        {/* Background Text */}
        <h1
          ref={textRef}
          className="font-oswald font-bold text-[15vw] leading-none 
                   text-center z-0 uppercase tracking-tighter"
        >
          ABOUT US
        </h1>

        {/* Floating Cards */}
        <div className="absolute inset-0 flex items-center justify-center 
                      pointer-events-none z-10 w-full h-full"
          style={{ perspective: "1000px" }}>

          {/* Card 1 */}
          <div
            ref={image1Ref}
            className="absolute w-[40vw] h-[40vh] bg-black bg-cover bg-center 
                     rounded-3xl shadow-2xl flex items-end p-8"
            style={{
              backgroundImage:
                "url('https://media.istockphoto.com/id/1433041100/photo/communication-technology-with-global-internet-network-connected-in-europe-telecommunication.jpg?s=1024x1024&w=is&k=20&c=CuS3KHH4SHYUaHw2eLuSv0Vnsiys0iXKNgElA3janYY=')",
              transformStyle: "preserve-3d"
            }}
          >
            {/* <h2 className="text-white bg-black text-4xl font-bold">Atmos AE.1</h2> */}
          </div>

          {/* Card 2 */}
          <div
            ref={image2Ref}
            className="absolute w-[40vw] h-[40vh] bg-cover bg-center 
                     rounded-3xl shadow-2xl flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              transformStyle: "preserve-3d"
            }}

          >
            {/* <img src="\public\img1.jpeg" alt="" /> */}
            {/* <h2 className="text-white text-6xl font-bold">Panos AE.1</h2> */}
          </div>

        </div>
      </div>

      {/* ===== INTRO PARAGRAPH ===== */}
      {/* <div className="flex justify-center mt-20 px-4">
      <p className="text-black text-lg md:text-xl lg:text-2xl 
                    font-medium max-w-4xl text-center">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
        Voluptas dolor, nulla eligendi maxime molestias praesentium.
      </p> */}
      {/* </div> */}

      {/* ===== PROBLEM TITLE ===== */}
      {/* <div ref={section2Ref} className="flex justify-center mt-10 mb-20">
      <ScrollFloatComp
        animationDuration={1}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
        textClassName="text-6xl text-black font-bold"
      >
        PROBLEM TILL NOW
      </ScrollFloatComp>
    </div> */}

      {/* ===== PROBLEM TEXT ===== */}
      {/* <ScrollReveal
      baseOpacity={0}
      enableBlur={true}
      baseRotation={5}
      blurStrength={10}
      containerClassName="flex justify-center mt-20 px-4"
      textClassName="text-black text-lg md:text-xl lg:text-2xl 
                     font-medium max-w-4xl text-center"
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto culpa
      accusantium eos dicta praesentium esse impedit atque.
    </ScrollReveal> */}

      {/* ===== BLACK BALLPIT HERO ===== */}
      <div className="min-h-screen w-screen bg-white pt-[10rem] text-black relative overflow-hidden">

        {/* Ballpit Container */}
        <div className="h-[95vh] w-[92vw] bg-black m-auto  rounded-4xl 
                      overflow-hidden relative">

          {/* Ballpit Canvas */}
          <div className="absolute inset-0">
            <Ballpit
              count={50}
              gravity={0.7}
              friction={0.9}
              wallBounce={0.95}
              followCursor={true}
              colors={[0x0000ff, 0xffffff]}
            />

          </div>
          <h2 className="text-white text-[6rem] pt-40 font-bold items-center text-center justify-center" >BrandShield</h2>

          <div className="text-white  
                  items-center justify-center 
                  h-full text-white text-center px-50 mx-5-">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum explicabo id, numquam, mollitia adipisci quidem, voluptates corrupti laborum quo ratione repellendus delectus! Minus eos delectus excepturi, consectetur dicta magni sed!</p>
          </div>
        </div>

        {/* ===== CARDS SECTION ===== */}
      {/* ===== INTERACTIVE CARDS SECTION ===== */}
<div className="relative mt-20 flex justify-center items-center px-10">

  {/* Group wrapper controls shared hover state */}
  <div className="relative w-[90vw] h-[45vh] flex gap-6 group">

    {/* BLUE CARD */}
    {/* BLUE CARD */}
<div
  ref={blue}
  className="
    bg-blue-200 rounded-4xl h-full w-[60%]
    relative overflow-hidden p-8"
>

  {/* DEFAULT STATE */}
  <div className="absolute inset-0 flex flex-col justify-center px-10
                  transition-opacity duration-500
                  group-hover:opacity-0">

    <h3 className="text-4xl font-bold text-black mb-3">
      Our Mission
    </h3>
    <p className="text-lg text-black/70">
      Hover to read more →
    </p>
  </div>

  {/* HOVER STATE CONTENT */}
  <div className="absolute inset-0 flex flex-col justify-center px-10
                  opacity-0 translate-y-6
                  transition-all duration-500
                  group-hover:opacity-100 group-hover:translate-y-0">

    <h3 className="text-4xl font-bold text-black mb-4">
      Our Mission
    </h3>

    <p className="text-lg text-black/80 leading-relaxed max-w-md">
      We build immersive brand experiences that merge design,
      technology, and storytelling to create unforgettable digital presence.
    </p>

  </div>

</div>

      

    {/* ORANGE CARD */}
    
    <div
      ref={orange}
      className="
        bg-orange-200 rounded-4xl h-full w-[120%]
        transition-all duration-500 ease-out
        relative overflow-hidden

        hover:w-full hover:z-30

        peer-hover:w-[40%]
        peer-hover:h-[50%]
        peer-hover:absolute
        peer-hover:top-4
        peer-hover:right-4
        peer-hover:z-40

        group-hover:not-peer-hover:w-[40%]
      "
    >
    <img src="\public\Ai_Chatbot.jpg" alt="Chatbot" />
      </div>

  </div>
</div>


        {/* Spacer */}
        <div className="h-[40vh]"></div>
      </div>
      <div className="bg-white text-black">

      <Footer />
      </div>
    </div>
  )
}

export default AboutPage
