import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import { NavigationContext } from '../NavContext/NavContext.jsx'

gsap.registerPlugin(ScrollTrigger)

const Stairs = (props) => {

    const currentPath = useLocation().pathname
    const navigate = useNavigate()

    const contextValue = useContext(NavigationContext)
    const [pendingPath, setPendingPath] = contextValue || [null, () => {}]

    const stairParentRef = useRef(null)
    const pageRef = useRef(null)
    const stairsRef = useRef([])
    const isAnimating = useRef(false)
    const hasPlayedInitialAnimation = useRef(false)

    // Play animation on initial load
    useEffect(() => {
        if (!hasPlayedInitialAnimation.current && stairParentRef.current && stairsRef.current.length > 0) {
            hasPlayedInitialAnimation.current = true
            
            // Hide page initially
            gsap.set(pageRef.current, { opacity: 0 })
            
            // Show stairs
            gsap.set(stairParentRef.current, { display: 'block' })
            
            const tl = gsap.timeline()
            
            // Stairs cover from top
            tl.from(stairsRef.current, {
                height: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                stagger: {
                    each: 0.05,
                    from: 'start'
                }
            })
            
            // Brief pause
            tl.to({}, { duration: 0.2 })
            
            // Show page
            tl.set(pageRef.current, { opacity: 1 })
            
            // Stairs slide out
            tl.to(stairsRef.current, {
                y: '100%',
                duration: 0.4,
                ease: 'power2.inOut',
                stagger: {
                    each: 0.05,
                    from: 'start'
                }
            })
            
            // Hide stairs and reset
            tl.set(stairParentRef.current, { display: 'none' })
            tl.set(stairsRef.current, { y: '0%', height: '100%' })
            
            tl.call(() => {
                ScrollTrigger.refresh()
            })
        }
    }, [])

    // Handle pending navigation
    useEffect(() => {
        if (pendingPath && pendingPath !== currentPath && !isAnimating.current) {
            isAnimating.current = true
            
            // Show stairs
            if (stairParentRef.current) {
                gsap.set(stairParentRef.current, { display: 'block' })
            }
            
            // Animate stairs IN and fade out page smoothly
            const tl = gsap.timeline({
                onComplete: () => {
                    // Navigate after stairs cover screen
                    navigate(pendingPath)
                    setPendingPath(null)
                    isAnimating.current = false
                }
            })
            
            // Smooth fade out of page content
            tl.to(pageRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            })
            
            // Stairs animate in (slightly overlapping with fade)
            tl.from(stairsRef.current, {
                height: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                stagger: {
                    each: 0.05,
                    from: 'start'
                }
            }, '-=0.15')
        }
    }, [pendingPath, currentPath, navigate, setPendingPath])

    useGSAP(function () {
        if (!stairParentRef.current || stairsRef.current.length === 0) return
        if (isAnimating.current) return
        
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()
            
            // Stairs should already be visible from navigation trigger
            // Just animate them OUT
            tl.to({}, { duration: 0.2 }) // Small pause
            
            tl.set(pageRef.current, { opacity: 1 })
            
            tl.to(stairsRef.current, {
                y: '100%',
                duration: 0.4,
                ease: 'power2.inOut',
                stagger: {
                    each: 0.05,
                    from: 'start'
                }
            })
            
            tl.set(stairParentRef.current, { display: 'none' })
            tl.set(stairsRef.current, { y: '0%', height: '100%' })
            
            tl.call(() => {
                ScrollTrigger.refresh()
            })
        }, stairParentRef)

        return () => ctx.revert()
    }, [currentPath])
    

    return (
        <div>
            <div ref={stairParentRef} className='h-screen w-full fixed z-[100] top-0' style={{ display: 'none' }}>
                <div className='h-full w-full flex'>
                    <div ref={(el) => el && (stairsRef.current[0] = el)} className='stair h-full w-1/5 bg-black'></div>
                    <div ref={(el) => el && (stairsRef.current[1] = el)} className='stair h-full w-1/5 bg-black'></div>
                    <div ref={(el) => el && (stairsRef.current[2] = el)} className='stair h-full w-1/5 bg-black'></div>
                    <div ref={(el) => el && (stairsRef.current[3] = el)} className='stair h-full w-1/5 bg-black'></div>
                    <div ref={(el) => el && (stairsRef.current[4] = el)} className='stair h-full w-1/5 bg-black'></div>
                </div>
            </div>
            <div ref={pageRef}>
                {props.children}
            </div>
        </div>
    )
}

export default Stairs