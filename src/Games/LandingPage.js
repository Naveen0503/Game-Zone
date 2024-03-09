import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LandingPage.css";
import Popup from "./Popup";

function LandingPage() {
  const navigate = useNavigate();

  const redirectTo = (path) => {
    navigate(path);
  };
  const [showPopup, setShowPopup] = useState(true);
  const [existingUsers, setExistingUsers] = useState([]);

  const handleNewUser = (user) => {
    setExistingUsers([...existingUsers, user]);
    setShowPopup(false);
  };

  const handleExistingUser = (user) => {
    setShowPopup(false);
  };

  const handleClosePopup = () => {
  };
  return (
    <div className="landing-page">
      <div className="header">
        <h1>Welcome to Game Zone</h1>
      </div>
      <div className="buttons-container">
        <div className="button-group">
          <button
            className="game-button btn-2048"
            onClick={() => redirectTo("/2048")}
          >
            2048
          </button>
          <button
            className="game-button btn-candy-crush"
            onClick={() => redirectTo("/candycrush")}
          >
            Candy Crush
          </button>
          <button
            className="game-button btn-flappy-bird"
            onClick={() => redirectTo("/flappybird")}
          >
            Flappy Bird
          </button>
        </div>
        {/* <div className="scores-container">
          <h2>Your Scores</h2>
          <h3>High Scores</h3>
          <p>2048</p>
          <p>Candy Crush</p>
          <p>Flappy Bird</p>
        </div> */}
      </div>
    </div>
  );
}

export default LandingPage;
