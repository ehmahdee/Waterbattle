import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth'

const Nav = () => {
  const Logout = (event) => {
    event.preventDefault();
    Auth.logout();
  }
  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          {Auth.loggedIn() ? (
            <>
              <li className="nav-item"><a href="./lobby">New Game</a></li>

              <li className="nav-item"><a onClick={Logout}>Logout</a></li>
            </>
          ) : (null)}

        </ul>

      </nav>
    </div>
  )
}

export default Nav;