import React, { createContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const NavbarContext = createContext()
export const NavbarColorContext = createContext()

export const NavigationContext = createContext()

const NavContext = ({ children }) => {

    const [navColor, setNavColor] = useState('white')
    
    const [navOpen, setNavOpen] = useState(false)
    
    const [pendingPath, setPendingPath] = useState(null)

    const locate = useLocation().pathname
    useEffect(function(){
        if(locate == '/projects' || locate == '/agence'){
            setNavColor('black')
        }else{
            setNavColor('white')
        }
    },[locate])
    

    return (
        <div>
            <NavigationContext.Provider value={[pendingPath, setPendingPath]}>
                <NavbarContext.Provider value={[navOpen, setNavOpen]}>
                    <NavbarColorContext.Provider value={[navColor,setNavColor]}>
                        {children}
                    </NavbarColorContext.Provider>
                </NavbarContext.Provider>
            </NavigationContext.Provider>
        </div>
    )
}

export default NavContext