import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

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
      <audio src="/music/good_enough.mp3" controls>
          <embed
            src="/music/good_enough.mp3"
            width="300"
            height="90"
            loop="true"
            autostart="true"
          />
        </audio>
    </div>
    
  );
};

export default Home;
