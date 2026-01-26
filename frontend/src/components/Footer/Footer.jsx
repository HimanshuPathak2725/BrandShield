import { Link } from "react-router-dom"
import React from "react"
import TextPressure from "../TextPressure/TextPressure"

const Footer = () => {
  return (
    <footer className="py-5">

      <div className="flex flex-col items-end gap-4 px-10">

        <div className="flex gap-6 text-lg">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <p>/</p>
          <Link to="/about" className="hover:text-red-500">About</Link>
          <p>/</p>
          <Link to="/pricing" className="hover:text-red-500">Pricing</Link>
          <p>/</p>
          <Link to="/dashboard" className="hover:text-red-500">Dashboard</Link>
        </div>

        <div className="w-[90vh] h-[2px] bg-black"></div>

      </div>

    
      <div className="text-[29vh] leading-[180px] font-oswald font-bold text-center mt-10">
        BRANDSHIELD
      </div>

    </footer>
  )
}

export default Footer
