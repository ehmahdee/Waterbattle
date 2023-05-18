import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item"><a href="./lobby">New Game</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav;