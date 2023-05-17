import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Lobby = () => {
    // javascript

    return (
        <div>
            <nav className="navbar">
                <ul className="navbar-nav">
                   {/*  <li className="nav-item"><a href="./highScores.html">High scores</a></li> */}
                    <li className="nav-item"><a href="./lobby">New Game</a></li>
                </ul>
            </nav>
            <header>
                {/* <a href="https://github.com/ehmahdee/Waterbattle" target="_blank"><img style={{width:'90px'}} src="../public/images/vaporeonlogo.png" alt="vaporeon" className="logo" /></a> */}
            </header>
            <div className="splash-container">
                <h1>Water Battle!!</h1>
                <div className="button-container">
                    <a href="./singleplayer" className="btn splash-btn">Singleplayer</a>
                    <a href="./multiplayer" className="btn splash-btn">Multiplayer</a>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
