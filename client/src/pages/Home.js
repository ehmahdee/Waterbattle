import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="button-container">
        <h1>Water Battle!!</h1>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
        </div>
    )
}

export default Home;