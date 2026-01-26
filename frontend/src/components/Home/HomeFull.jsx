// import React, { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { SplitText } from 'gsap/SplitText'
// import Lenis from '@studio-freight/lenis'

// // Register plugins
// gsap.registerPlugin(ScrollTrigger, SplitText)

// const HomeFull = () => {
//   const rootRef = useRef(null)

//   useEffect(() => {
//     // Initialize Lenis (smooth scrolling)
//     const lenis = new Lenis()

//     function raf(time) {
//       lenis.raf(time)
//       requestAnimationFrame(raf)
//     }
//     requestAnimationFrame(raf)

//     // Helper: initialize SplitText for specific selectors
//     const initSplitText = () => {
//       const textElements = document.querySelectorAll('.col-3 h1, .col-3 p')

//       textElements.forEach((element) => {
//         const split = new SplitText(element, {
//           type: 'lines',
//           lineClass: 'line'
//         })

//         split.lines.forEach((line) => {
//           // wrap each line in a span so we can animate it
//           line.innerHTML = `<span>${line.textContent}</span>`
//         })
//       })
//     }

//     initSplitText()

//     // initial styles for lines
//     gsap.set('.col-3 .col-content-wrapper .line span', { y: '0%' })
//     gsap.set('.col-3 .col-content-wrapper-2 .line span', { y: '-125%' })

//     let currentPhase = 0

//     const st = ScrollTrigger.create({
//       trigger: '.sticky-cols',
//       start: 'top top',
//       end: `+=${window.innerHeight * 5}px`,
//       pin: true,
//       pinSpacing: true,
//       onUpdate: (self) => {
//         const progress = self.progress

//         if (progress > 0.25 && currentPhase === 0) {
//           currentPhase = 1

//           gsap.to('.col-1', { opacity: 0, scale: 0.75, duration: 0.75 })
//           gsap.to('.col-2', { x: '0%', duration: 0.75 })
//           gsap.to('.col-3', { y: '0%', duration: 0.75 })

//           gsap.to('.col-img-1 img', { scale: 1.25, duration: 0.75 })
//           gsap.to('.col-img-2', {
//             clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
//             duration: 0.75
//           })
//           gsap.to('.col-img-2 img', { scale: 1, duration: 0.75 })
//         }

//         if (progress >= 0.5 && currentPhase === 1) {
//           currentPhase = 2

//           gsap.to('.col-2', { opacity: 0, scale: 0.75, duration: 0.75 })
//           gsap.to('.col-3', { x: '0%', duration: 0.75 })
//           gsap.to('.col-4', { y: '0%', duration: 0.75 })

//           gsap.to('.col-3 .col-content-wrapper .line span', {
//             y: '-125%',
//             duration: 0.75
//           })

//           gsap.to('.col-3 .col-content-wrapper-2 .line span', {
//             y: '0%',
//             duration: 0.75,
//             delay: 0.5
//           })
//         }

//         if (progress < 0.25 && currentPhase === 1) {
//           currentPhase = 0

//           gsap.to('.col-1', { opacity: 1, scale: 1, duration: 0.75 })
//           gsap.to('.col-2', { x: '100%', duration: 0.75 })
//           gsap.to('.col-3', { y: '100%', duration: 0.75 })
//         }

//         if (progress < 0.5 && currentPhase === 2) {
//           currentPhase = 1

//           gsap.to('.col-2', { opacity: 1, scale: 1, duration: 0.75 })
//           gsap.to('.col-3', { x: '100%', duration: 0.75 })
//           gsap.to('.col-4', { y: '100%', duration: 0.75 })

//           gsap.to('.col-3 .col-content-wrapper .line span', {
//             y: '0%',
//             duration: 0.75
//           })
//         }
//       }
//     })

//     // Cleanup on unmount
//     return () => {
//       st.kill()
//       ScrollTrigger.getAll().forEach(s => s.kill && s.kill())
//       lenis.destroy && lenis.destroy()
//     }
//   }, [])

//   return (
//     <div ref={rootRef}>
//       <style>{`
// :root{
//     --bg: #141414;
//     --bg-200: #282828;
//     --fg: #fff;
//     --fg-100: #f1f1f1;
//     --fg-200: #a1a1a1
// }
// *{margin:0;padding:0;box-sizing:border-box}
// body{font-family: 'Inter', sans-serif}
// section{position:relative;width:100vw;height:100vh;background-color:var(--bg);color:var(--fg-100);overflow:hidden}
// h1{font-size:2.5rem;font-weight:500;line-height:1.1}
// p{font-size:1rem;font-weight:500}
// img{width:100%;height:100%;object-fit:cover}
// .intro,.outro{display:flex;justify-content:center;align-items:center}
// .intro h1,.outro h1{width:500%;text-align:center}
// .sticky-cols{padding:0.5rem}
// .sticky-cols-wrapper{position:relative;width:100%;height:100%}
// .col{position:absolute;width:50%;height:100%;will-change:transform}
// .col h1{color:var(--fg-200);width:60%}
// .col p{color:var(--fg-100);width:60%}
// .col-2{transform:translateX(100%)}
// .col-3{transform:translateX(100%) translateY(100%);padding:0.5rem}
// .col-4{transform:translateX(100%) translateY(100%)}
// .col-content,.col-img{position:relative;width:100%;height:100%;padding:0.5rem}
// .col-content-wrapper,.col-img-wrapper{position:relative;width:100%;height:100%;background-color:var(--bg-200);border-radius:3rem;overflow:hidden}
// .col-content-wrapper{padding:2.5rem;display:flex;flex-direction:column;justify-content:space-between}
// .col-content-wrapper-2{position:absolute;top:0;left:0;width:100%;height:100%;padding:2.5rem;display:flex;flex-direction:column;justify-content:space-between}
// .col-img-1,.col-img-2{position:absolute;top:0;left:0;width:100%;height:100%}
// .col-img-2{clip-path:polygon(0% 0%,100% 0%,100% 0%,0% 0%)}
// .col-img-2 img{transform:scale(1.25)}
// .line span{display:block;will-change:transform}
// @media(max-width:1000px){h1{font-size:1.25rem}p{font-size:0.85rem}.col h1,.col p{width:100%}.col-content-wrapper,.col-content-wrapper-2{padding:2rem}}
// `}</style>

//       <section className="intro">
//         <h1>We create modern designs</h1>
//       </section>

//       <section className="sticky-cols">
//         <div className="sticky-cols-wrapper">
//           <div className="col col-1">
//             <div className="col-content-wrapper">
//               <h1>
//                 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolorem sit quam eius at, odio ratione quibusdam odit officia repellat animi dolor ex. Perspiciatis, vero? Nihil neque voluptatum repudiandae laudantium!
//               </h1>
//               <p>
//                 Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non rerum consequuntur pariatur facere autem rem similique obcaecati tenetur temporibus! Perferendis recusandae rerum temporibus id ex fugiat quibusdam veniam molestiae nobis.
//               </p>
//             </div>
//           </div>

//           <div className="col col-2">
//             <div className="col-img col-img-1">
//               <img src="/bird.png" alt="" />
//             </div>
//           </div>

//           <div className="col-img col-img-2">
//             <div className="col-img-wrapper">
//               <img src="/bird.png" alt="" />
//             </div>
//           </div>

//           <div className="col col-3">
//             <div className="col-content-wrapper">
//               <h1>Our intention are crafted to  feel as calm as they look</h1>
//               <p>
//                 Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae molestias quos, accusamus temporibus nam quam, harum incidunt repellat illo quasi, at ad consequuntur veniam fugit! Eius minus quia rem non?
//               </p>
//             </div>
//             <div className="col-content-wrapper-2">
//               <h1>Every detail is chosen to bring ease and elegance into your space</h1>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis in, at minus, nemo dolor animi sit corporis nihil doloribus voluptatum cum labore debitis velit reprehenderit itaque hic aspernatur ipsam quam.
//               </p>
//             </div>
//           </div>

//           <div className="col col-4">
//             <div className="col-img">
//               <div className="col-img-wrapper">
//                 <img src="/bird.png" alt="" />
//               </div>
//             </div>
//           </div>

//         </div>
//       </section>

//       <section className="outro">
//         <h1>Timeless design with a conversation</h1>
//       </section>
//     </div>
//   )
// }

// export default HomeFull
