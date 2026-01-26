import { div } from 'motion/react-client'
import React, { useRef } from 'react'
import styled from 'styled-components';
import Card from './Card';
import Footer from '../Footer/Footer.jsx';
import Orb from '../Orb/Orb.jsx';

const PriceCard = () => {
  const containerRef = useRef(null)

  return (
    <div className='bg-white'>
    

      <div className="min-h-screen text-[10rem] flex text-bold font-[font1]  items-center justify-center bg-white text-black">
        <h1>PRICING</h1>

        <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
          />
      </div>
          </div>
      <div className='flex gap-40 m-50 bg-white h-screen '>
        <StyledWrapper>
          <div className="pack-container">
            <div className="header">
              <p className="title">
                Starter

              </p>
              <div className="price-container">
                <span>$</span>27
                <span>/mo</span>
              </div>
            </div>
            <div>
              <ul className="lists">
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    2 team members
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    1000+ components
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    1 month free updates
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    Life time technical support
                  </p>
                </li>
              </ul>
            </div>
            <div className="button-container">
              <button type="button">
                Buy Now
              </button>
            </div>
          </div>
        </StyledWrapper>
        <StyledWrapper>
          <div className="pack-container">
            <div className="header">
              <p className="title">
                Starter
              </p>
              <div className="price-container">
                <span>$</span>27
                <span>/mo</span>
              </div>
            </div>
            <div>
              <ul className="lists">
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    2 team members
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    1000+ components
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    1 month free updates
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    Life time technical support
                  </p>
                </li>
              </ul>
            </div>
            <div className="button-container">
              <button type="button">
                Buy Now
              </button>
            </div>
          </div>
        </StyledWrapper>
        <StyledWrapper>
          <div className="pack-container">
            <div className="header">
              <p className="title">
                Starter
              </p>
              <div className="price-container">
                <span>$</span>27
                <span>/mo</span>
              </div>
            </div>
            <div>
              <ul className="lists">
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    2 team members
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    1000+ components
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    1 month free updates
                  </p>
                </li>
                <li className="list">
                  <span>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    Life time technical support
                  </p>
                </li>
              </ul>
            </div>
            <div className="button-container">
              <button type="button">
                Buy Now
              </button>
            </div>
          </div>
        </StyledWrapper>

      </div>
      <Footer />
    </div>
  )
}

export default PriceCard


const StyledWrapper = styled.div`
  .pack-container {
    position: relative;
    display: flex;
    max-width: 350px;
    flex-direction: column;
    border-radius: 12px;
    background-color: #212121;
    border: 1px solid #fff;
    padding: 1.6rem;
    color: #fff;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .header {
    position: relative;
    margin: 0;
    margin-bottom: 2rem;
    overflow: hidden;
    border-radius: 0;
    border-bottom: 1px solid #fff;
    background: transparent;
    padding-bottom: 1rem;
    text-align: center;
  }

  .title {
    display: block;
    font-family: sans-serif;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-transform: uppercase;
    color: #fff
  }

  .price-container {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    font-family: sans-serif;
    font-size: 4.5rem;
    line-height: 1;
  }

  .price-container span:first-child {
    margin-top: 10px;
    font-size: 2.25rem;
    line-height: 2.5rem;
  }

  .price-container span:last-child {
    align-self: flex-end;
    font-size: 2.25rem;
    line-height: 2.5rem;
  }

  .lists {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .list span {
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.24);
    background-color: rgba(255, 255, 255, 0.185);
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .list span svg {
    height: 12px;
    width: 12px;
  }

  .list p {
    display: block;
    font-family: sans-serif;
  }

  .button-container {
    margin-top: 20px;
    padding: 0;
  }

  .button-container button {
    display: block;
    width: 100%;
    background-color: #fff;
    padding: 10px 20px;
    text-transform: uppercase;
    color: #000;
    outline: 0;
    border: 0;
    border-radius: 10px;
  }`;

