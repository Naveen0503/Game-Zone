import React, { useState, useEffect } from "react";
import axios from "axios";
import "./tictactoe.css";

const TicTacToe = () => {
  return (
    <div className="game-container">
      <h1>Tic Tac Toe</h1>
      <GameBoard />
    </div>
  );
};

const GameBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameString, setGameString] = useState("");
  const [fetchData, setFetchData] = useState(false);
  const [player, setPlayer] = useState("");
  
  const fetchGameState = async () => {
    try {
      const response = await axios.get("https://game-zone-api-v1.azurewebsites.net/api/tictactoesessions/1")
      const { data } = response;
      const gameBoard  = data.gameBoard;
      const gameStatus = data.gameStatus;
      if (gameString !== gameBoard) {
        setGameString(gameBoard);
        updateGameBoard(gameBoard);
        checkWinner(gameBoard);
        setWaitingForOpponent(false);
        setFetchData(false);
      }
      if (gameStatus === "finished" && !winner) {
        setWinner("No one");
      }
    } catch (error) {
      console.error("Error fetching game state:", error);
    }
  };

  const updateGameBoard = (gameBoardString) => {
    const newBoard = gameBoardString.split("");
    setBoard(newBoard);
  };

  const handleClick = async (index) => {
    if (winner || board[index]==='X'|| board[index]==='O'|| waitingForOpponent) return;
    const newBoard = [...board];
    newBoard[index] = player; 
    setBoard(newBoard);
    setWaitingForOpponent(true);
    const gameBoardString = newBoard.map((value, idx) => {
      return value || (idx === index ? "X" : "-");
    }).join("");
    checkWinner(gameBoardString);
    try {
      await axios.put(
        "https://game-zone-api-v1.azurewebsites.net/api/tictactoesessions/1",
        {
          sessionId: 1,
          player1Id: 19,
          player2Id: 20,
          currentPlayerId: 19,
          gameBoard: gameBoardString,
          gameStatus: winner ? "finished" : "ongoing",
          updatedAt: new Date().toISOString(),
        }
      );
      setFetchData(true);
      setGameString(gameBoardString);
    } catch (error) {
      console.error("Error updating game session:", error);
      setWaitingForOpponent(false);
    }
  };

  const checkWinner = (gameBoardString) => {
    const winCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
  
    for (let combination of winCombinations) {
      const [a, b, c] = combination;
      const symbolA = gameBoardString[a];
      const symbolB = gameBoardString[b];
      const symbolC = gameBoardString[c];
      
      if (symbolA !== "-" && symbolA === symbolB && symbolA === symbolC) {
        setWinner(symbolA);
        return;
      }
    }
  
    if (!gameBoardString.includes("-")) {
      setWinner("Draw");
    }
  };
  
  

  useEffect(() => {
    if (fetchData) {
      const intervalId = setInterval(fetchGameState, 2000); 
      return () => clearInterval(intervalId); 
    }
  }, [fetchData]);
    useEffect( async () => {
        const response = await axios.get("https://game-zone-api-v1.azurewebsites.net/api/tictactoesessions/1")
        const { data } = response;
       if(data.gameBoard === "---------" || data.gameBoard === ""){
        setPlayer("X");
       }
       else if(data.gameBoard.includes("X") && !data.gameBoard.includes("O")){
        setPlayer("O");
        updateGameBoard(data.gameBoard);
       }
       else{
        setPlayer("O");
        updateGameBoard(data.gameBoard);
       }
    },[])
  const renderSquare = (index) => {
    return (
      <button
        className="square"
        onClick={() => handleClick(index)}
        disabled={waitingForOpponent || winner || board[index]==='X' || board[index]==='O'}
      >
        {board[index]=='-' ? '' : board[index]}
      </button>
    );
  };

  return (
    <div className={`game-board${waitingForOpponent ? " waiting" : ""}`}>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {winner && <div>Winner: {winner}</div>}
      {!winner && waitingForOpponent && <div>Waiting for opponent...</div>}
    </div>
  );
};

export default TicTacToe;
