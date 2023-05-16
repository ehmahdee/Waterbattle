import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Singleplayer = () => {
    return (
        <div>
            <nav class="navbar">
                <ul class="navbar-nav">
                    <li class="nav-item">High Scores</li>
                    <li class="nav-item">New Game</li>
                </ul>
            </nav>
            <h1>Single player</h1>
            <div class="container">
                <div class="battleship-grid grid-user"></div>
                <div class="battleship-grid grid-computer"></div>
            </div>

            <div class="container hidden-info">
                <div class="setup-buttons" id="setup-buttons">
                    <button id="start" class="btn">Start Game</button>
                    <button id="rotate" class="btn">Rotate Ships</button>
                </div>
                <h3 id="whose-go" class="info-text">Your Go</h3>
                <h3 id="info" class="info-text"></h3>
            </div>


            <div class="container">
                <div class="grid-display">
                    <div class="ship destroyer-container" draggable="true">
                        <div id="destroyer-0"></div>
                        <div id="destroyer-1"></div>
                    </div>
                    <div class="ship submarine-container" draggable="true">
                        <div id="submarine-0"></div>
                        <div id="submarine-1"></div>
                        <div id="submarine-2"></div>
                    </div>
                    <div class="ship cruiser-container" draggable="true">
                        <div id="cruiser-0"></div>
                        <div id="cruiser-1"></div>
                        <div id="cruiser-2"></div>
                    </div>
                    <div class="ship battleship-container" draggable="true">
                        <div id="battleship-0"></div>
                        <div id="battleship-1"></div>
                        <div id="battleship-2"></div>
                        <div id="battleship-3"></div>
                    </div>
                    <div class="ship carrier-container" draggable="true">
                        <div id="carrier-0"></div>
                        <div id="carrier-1"></div>
                        <div id="carrier-2"></div>
                        <div id="carrier-3"></div>
                        <div id="carrier-4"></div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Singleplayer;