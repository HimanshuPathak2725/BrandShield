import { div } from 'motion/react-client'
import React, { useRef } from 'react'
import styled from 'styled-components';
import Card from './Card';
import Footer from '../Footer/Footer.jsx';
import Orb from '../Orb/Orb.jsx';

const CheckIcon = () => (
    <span>
    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
    </span>
);

const PriceCard = () => {
    const containerRef = useRef(null)

    return (
    <div className='bg-slate-950'>
    

        <div className="min-h-screen text-[10rem] flex text-bold font-[font1] items-center justify-center bg-slate-950 text-white/5 relative overflow-hidden">
        <h1 className="z-10 relative">PRICING</h1>

        <div style={{ width: '100%', height: '600px', position: 'absolute', opacity: 0.5 }}>
        <Orb
            hoverIntensity={2}
            rotateOnHover
            hue={0}
            forceHoverState={false}
            backgroundColor="transparent"
            />
        </div>
            </div>
      <div className='flex justify-center items-center flex-wrap gap-8 p-10 bg-[#050505] min-h-screen relative z-10'>
        <StyledWrapper>
          {/* FREE PLAN */}
          <div className="pack-container">
            <div className="header">
              <p className="title">Free</p>
              <div className="price-container">
                <span>$</span>0.00<span>/mo</span>
              </div>
              <p className="description">Great for trying out BrandShield and for tiny teams</p>
            </div>
            <div className="button-container">
              <button type="button" className="btn-secondary">Start for Free</button>
            </div>
            <div className="separator"></div>
            <ul className="lists">
              <li className="list">
                <CheckIcon />
                <p>Account Aggregation</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Expense Tracking</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Budgeting Tools</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Transaction Insights</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Basic Security</p>
              </li>
            </ul>
          </div>

          {/* PROFESSIONAL PLAN (Highlighted) */}
          <div className="pack-container professional">
             <div className="most-popular">Most Popular</div>
             <div className="header">
              <p className="title">Professional</p>
              <div className="price-container">
                <span>$</span>98.00<span>/mo</span>
              </div>
              <p className="description">Best for growing startups and growth companies</p>
            </div>
            <div className="button-container">
              <button type="button" className="btn-primary">Sign Up with Professional</button>
            </div>
            <div className="separator"></div>
            <ul className="lists">
              <li className="list">
                <CheckIcon />
                <p>Everything in Free</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Customizable Dashboards</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Advanced Budgeting</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Investment Tracking</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Enhanced Security</p>
              </li>
            </ul>
          </div>

          {/* ENTERPRISE PLAN */}
          <div className="pack-container">
            <div className="header">
              <p className="title">Enterprise</p>
              <div className="price-container">
                <span>$</span>160.00<span>/mo</span>
              </div>
              <p className="description">Best for large companies and teams requiring high security</p>
            </div>
            <div className="button-container">
              <button type="button" className="btn-secondary">Sign Up with Enterprise</button>
            </div>
            <div className="separator"></div>
            <ul className="lists">
              <li className="list">
                <CheckIcon />
                <p>Financial Planning Tools</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Priority Support</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Premium Widgets</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Advanced Security</p>
              </li>
              <li className="list">
                <CheckIcon />
                <p>Integration with 3rd-Party</p>
              </li>
            </ul>
          </div>
        </StyledWrapper>
      </div>
      <Footer />
    </div>
  )
}

export default PriceCard



const StyledWrapper = styled.div`
  /* Glass Gradient Background for Cards */
  .pack-container {
    position: relative;
    display: flex;
    width: 350px;
    flex-direction: column;
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08); /* Subtle border */
    padding: 2.5rem 2rem;
    color: #e2e8f0;
    transition: all 0.3s ease;
  }

  /* Hover Effect mainly for desktop */
  .pack-container:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
  }
  
  /* Highlighted "Professional" Card Style */
  .pack-container.professional {
    background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 40px rgba(0,0,0,0.5); /* Deep shadow */
  }

  /* "Most Popular" Badge */
  .most-popular {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #ccc;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .header {
    position: relative;
    margin-bottom: 2rem;
    text-align: left; /* Finament aligns text to left ?? - actually centered in screenshot? No, left aligned text, centered price in screenshot? Let's look closer. Alignment seems responsive but screenshot looks Left Aligned for text */
    text-align: left;
  }

  .title {
    font-size: 1.1rem;
    color: #cbd5e1;
    margin-bottom: 0.5rem;
    font-weight: 400;
  }

  .price-container {
    display: flex;
    align-items: baseline;
    gap: 2px;
    font-family: sans-serif;
    font-size: 3.5rem;
    font-weight: 500;
    line-height: 1.1;
    color: #fff;
    margin-bottom: 1rem;
  }

  .price-container span:first-child {
    font-size: 1.5rem;
    font-weight: 400;
    color: #94a3b8;
    margin-right: 4px;
  }
  
  .price-container span:last-child {
    font-size: 1rem;
    font-weight: 400;
    color: #64748b;
  }

  .description {
    font-size: 0.9rem;
    color: #94a3b8;
    line-height: 1.5;
    min-height: 3rem; /* Align buttons */
  }

  /* Buttons */
  .button-container {
    margin-bottom: 2rem;
  }

  .button-container button {
    width: 100%;
    padding: 12px 0;
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  /* Primary Button (Use Orange/Red Gradient) */
  .btn-primary {
    background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%); /* Fallback or close match */
    background: linear-gradient(180deg, #ff5e3a 0%, #ff2a00 100%); /* Finament Orange */
    box-shadow: 0 4px 15px rgba(255, 69, 0, 0.4);
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(255, 69, 0, 0.5);
  }

  /* Secondary Button (Gray/Ghost) */
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Separator Line */
  .separator {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    margin-bottom: 2rem;
  }

  /* Features List */
  .lists {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .list {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* Circle around Check Icon */
  .list span {
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1); /* Dark grey circle */
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e2e8f0; /* White check */
    flex-shrink: 0;
  }

  .list span svg {
    height: 10px;
    width: 10px;
    stroke-width: 3;
  }

  .list p {
    font-size: 0.9rem;
    color: #cbd5e1;
    font-weight: 300;
  }
`;

