import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Lobby = () => {
    // javascript

    return (
        <div>
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
