import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";

const Home = () => {
  return (
    <div>
      <h1 style={{ marginTop: "2rem" }}>Water Battle!!</h1>
      <img
        style={{ width: "600px" }}
        src="../images/spashhero.png"
        alt="hero image"
        className="splash-logo"
      />
      <div
        style={{ margin: "0rem", marginBottom: "2rem" }}
        className="button-container"
      >
        <button>
          <Link to="/signup">Sign Up</Link>
        </button>
        <button>
          <Link to="/login">Login</Link>
        </button>
      </div>
      <div className="audio">
      <ReactAudioPlayer src="../audio/TopGunAnthem.mp3" autoPlay="true" volume="0.1" loop="true" controls/>
      </div>
    </div>
    
  );
};

export default Home;
