import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
        <h1>Water Battle!!</h1>
        <img style={{ width: '90px' }} src="./images/splashhero.png" alt="hero image" class="logo" />
        <div className="button-container">
        <button><Link to="/signup">Sign Up</Link></button>
        <button><Link to="/login">Login</Link></button>
        </div>
        </div>
    )
}

export default Home;