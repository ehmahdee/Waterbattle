import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <div>
      <nav className="navbar">
                <ul className="navbar-nav">
                   {/*  <li className="nav-item"><a href="./highScores.html">High scores</a></li> */}
                    <li className="nav-item"><a href="./lobby">New Game</a></li>
                </ul>
            </nav>
      <header>
        <a href="https://github.com/ehmahdee/Waterbattle" target="_blank"><img style={{width:'90px'}} src="../images/vaporeonlogo.png" alt="vaporeon" class="logo"/></a>
    </header>
    
    </div>
  )
}

export default Header;