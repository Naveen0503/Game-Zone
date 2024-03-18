import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import "./LandingPage.css";
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [showPopup, setShowPopup] = useState(sessionStorage.getItem("user") ? false : true);
  const [userData, setUserData] = useState([]);
  const [highestScores, setHighestScores] = useState({
    "2048": 0,
    "Candy Crush": 0,
    "Flappy Bird": 0
  });
  useEffect(() => {
    axios.get('https://game-zone-api-v1.azurewebsites.net/api/Scores')
      .then((response) => {
        setScores(response.data);
      })
      .catch(error => {
        console.error('Error fetching scores:', error);
      });

    axios.get('https://game-zone-api-v1.azurewebsites.net/api/Gamers')
      .then((response) => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    // Calculate highest scores for each game
    const calculateHighestScores = () => {
      const games = ["2048", "Candy Crush", "Flappy Bird"];
      const highestScoresData = {};
      games.forEach(game => {
        const gameScores = scores.filter(score => score.game === game);
        if (gameScores.length > 0) {
          const highestScore = Math.max(...gameScores.map(score => score.gameScore));
          highestScoresData[game] = highestScore;
        } else {
          highestScoresData[game] = 0;
        }
      });
      return highestScoresData;
    };

    const highestScoresData = calculateHighestScores();
    setHighestScores(highestScoresData);

    // Store highest scores in session storage
    sessionStorage.setItem("2048highestScores", highestScoresData["2048"]);
    sessionStorage.setItem("CandyCrushhighestScores", highestScoresData["Candy Crush"]); 
    sessionStorage.setItem("FlappyBirdhighestScores", highestScoresData["Flappy Bird"]);
  }, [scores]);

  const redirectTo = (path) => {
    navigate(path);
  };

  const handleNewUser = (user) => {
    setUserData([...userData, user]);
    setShowPopup(false);
    sessionStorage.setItem('user', user.id);
    sessionStorage.setItem("userName",user.name);
    window.location.reload();
  };

  const handleExistingUser = (user) => {
    setShowPopup(false);
    sessionStorage.setItem("user",user.id);
    sessionStorage.setItem("userName",user.name);
    window.location.reload();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Function to get player name based on gamerId
  const getPlayerName = (gamerId) => {
    const user = userData.find(user => user.id === gamerId);
    return user ? user.name : "Unknown";
  };

  // Function to filter scores by game name and sort in descending order
  const filterScoresByGame = (gameName) => {
    return scores
      .filter(score => score.game === gameName)
      .sort((a, b) => b.gameScore - a.gameScore); // Sort in descending order
  };
  const getLoggedInUserScore = (gameName) => {
    const userScore = scores.find(score => score.game === gameName && score.gamerId == sessionStorage.getItem("user"));
    return userScore ? userScore.gameScore : '-';
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
        <div className="scores-container">
          <h2>Your Scores</h2>
          <div className="highscores-container">
          <p className="Game2048-score-column">
              2048: {getLoggedInUserScore("2048")}
            </p>
            <p className="GameCandyCrush-score-column">
              Candy Crush: {getLoggedInUserScore("Candy Crush")}
            </p>
            <p className="GameFlappyBird-score-column">
              Flappy Bird: {getLoggedInUserScore("Flappy Bird")}
            </p>
            </div>
          <h3>High Scores</h3>
          <div className="highscores-container">
          <div className="Game2048-score-column">
            <h4>2048</h4>
            {filterScoresByGame("2048").map((score, index) => (
              <p key={score.id} style={{textAlign: 'left'}}>
                {index + 1}. {getPlayerName(score.gamerId)}: {score.gameScore}
              </p>
            ))}
          </div>
          <div className="GameCandyCrush-score-column">
            <h4>Candy Crush</h4>
            {filterScoresByGame("Candy Crush").map((score, index) => (
              <p key={score.id} style={{textAlign: 'left'}}>
                {index + 1}. {getPlayerName(score.gamerId)}: {score.gameScore}
              </p>
            ))}
          </div>
          <div className="GameFlappyBird-score-column">
            <h4>Flappy Bird</h4>
            {filterScoresByGame("Flappy Bird").map((score, index) => (
              <p key={score.id} style={{textAlign: 'left'}}>
                {index + 1}. {getPlayerName(score.gamerId)}: {score.gameScore}
              </p>
            ))}
          </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup
          onNewUser={handleNewUser}
          onExistingUser={handleExistingUser}
          onClosePopup={handleClosePopup}
        />
      )}
    </div>
  );
}

export default LandingPage;
