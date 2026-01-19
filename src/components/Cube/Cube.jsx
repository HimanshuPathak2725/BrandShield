import React from "react"
import styled from "styled-components"

const Cube = () => {
    return (
        <StyledWrapper>

            <div className="container">

                {[...Array(3)].map((_, cubeIndex) => (
                    <div className="cube" key={cubeIndex}>

                        {[-1, 0, 1].map((x, rowIndex) => (
                            <div key={rowIndex} style={{ "--x": x, "--y": 0 }}>
                                {[3, 2, 1].map(i => (
                                    <span key={i} style={{ "--i": i }} />
                                ))}
                            </div>
                        ))}

                    </div>
                ))}

            </div>
        </StyledWrapper>
    )
}

export default Cube


const StyledWrapper = styled.div`
  @keyframes animate {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
     @keyframes spinCube {
                0 % { transform: rotateX(0deg) rotateY(0deg); }
                    100% {transform: rotateX(360deg) rotateY(360deg); }
                }

  .container {
    position: relative;
    top: -80px;
    transform: skewY(-20deg);
    animation: animate 5s linear infinite;
  }

  .cube {
    position: relative;
    z-index: 2;
  }

  .cube:nth-child(2) {
    z-index: 1;
    transform: translate(-60px, -60px);
  }

  .cube:nth-child(3) {
    z-index: 3;
    transform: translate(60px, 60px);
  }

  .cube div {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 30px;
    transform: translate(
      calc(-70px * var(--x)),
      calc(-60px * var(--y))
    );
  }

  .cube span {
    position: relative;
    width: 50px;
    height: 50px;
    background: #dcdcdc;
    transition: 1.5s;
  }

  .cube span:hover {
    background: #ef4149;
    filter: drop-shadow(0 0 30px #ef4149);
  }

  .cube span:before {
    content: "";
    position: absolute;
    left: -40px;
    width: 40px;
    height: 100%;
    background: #fff;
    transform-origin: right;
    transform: skewY(45deg);
  }

  .cube span:after {
    content: "";
    position: absolute;
    top: -40px;
    width: 100%;
    height: 40px;
    background: #f2f2f2;
    transform-origin: bottom;
    transform: skewX(45deg);
  }

  .cube span:hover:before,
  .cube span:hover:after {
    background: #ef4149;
  }
`
