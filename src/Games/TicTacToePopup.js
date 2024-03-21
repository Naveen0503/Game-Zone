import React, { useState, useEffect } from "react";
import axios from 'axios';

const TicTacToePopup = ({ onjoinRoom }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userData, setUserData] = useState([]);
  const [isCreateRoom, setIsCreateRoom] = useState(true);
  const [joinRoomId, setJoinRoomId] = useState("");

  useEffect(() => {
    axios.get('https://game-zone-api-v1.azurewebsites.net/api/Gamers')
      .then((response) => {
        setUserData(response.data);
      });
  }, []);

  const handleCreateRoom = async () => {
    if (!selectedPlayer) {
      setError("Please select a player!");
      return;
    }
  
    setLoading(true);
  
    try {
      const roomId = await generateRoomId();
      setRoomId(roomId);
    } catch (error) {
      console.error("Error generating room ID:", error);
      setError("Error generating room ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const generateRoomId = async () => {
    try {
      const response = await axios.post('https://game-zone-api-v1.azurewebsites.net/api/tictactoesessions', {
        "player1Id": sessionStorage.getItem("user"),
        "player2Id": selectedPlayer,
        "currentPlayerId": getRandomChoice(sessionStorage.getItem("user"), selectedPlayer),
        "gameBoard": "---------",
        "gameStatus": "ongoing",
        "createdAt": new Date().toISOString()
      });
      console.log(response.data.sessionId);
      return response.data.sessionId;
    } catch (error) {
      console.error("Error generating room ID:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };
  

  function getRandomChoice(variable1, variable2) {
    const randomNumber = Math.random();
    return randomNumber < 0.5 ? variable1 : variable2;
  }
  

  const handleToggle = () => {
    setIsCreateRoom(!isCreateRoom);
  };

  const handleJoinRoom = () => {
    if (!joinRoomId) {
      setError("Please enter a room ID!");
      return;
    }

    try {
       axios.get(`https://game-zone-api-v1.azurewebsites.net/api/tictactoesessions/${joinRoomId}`)
       .then((response) => {
         if(response.data.player1Id == sessionStorage.getItem('user') || response.data.player2Id == sessionStorage.getItem('user')){
             onjoinRoom(joinRoomId, response.data.currentPlayerId == sessionStorage.getItem('user') ?  'X' : 'O',response.data.player1Id,response.data.player2Id)
         }
         else{
          setError("You are not part of this room!");
         }
        }) 
      }catch (error) {
      console.error("Error joining room:", error);
      setError("Error joining room. Please try again.");
    }
     
  };

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div
        className="modal fade show"
        style={{
          display: "block",
          position: "fixed",
          zIndex: "1050",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: "#3d2963", color: "white", textAlign: "center" }}>
            <div className="modal-header border-0" style={{ justifyContent: "center" }}>
              <h5 className="modal-title">Tic Tac Toe</h5>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="mb-2">
                <div className="btn-group" role="group" aria-label="Room Toggle">
                  <button
                    type="button"
                    className={`btn btn-lg ${isCreateRoom ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsCreateRoom(true)}
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    className={`btn btn-lg ${isCreateRoom ? 'btn-outline-primary' : 'btn-primary'}`}
                    onClick={() => setIsCreateRoom(false)}
                  >
                    Join Room
                  </button>
                </div>
              </div>
              {isCreateRoom ? (
                <div>
                  <select
                    className="form-select mb-2"
                    style={{ width: "150%", position: "relative", left: "-25%"}}
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                  >
                    <option value="">Select a player</option>
                    {userData.map((user) => {
                        if (user.id != sessionStorage.getItem('user')) {
                            return (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            );
                        }
                        return null; 
                    })}
                  </select>
                  {roomId && (
                    <div>
                      <p>Your Room ID:</p>
                      <p>{roomId}</p>
                    </div>
                  )}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {loading ? "Loading..." :
                    <button
                      className="btn btn-primary"
                      style={{ backgroundColor: "#800080", borderColor: "#800080" }}
                      onClick={handleCreateRoom}
                    >
                      Create Room
                    </button>
                  }
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter Room ID"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ backgroundColor: "#800080", borderColor: "#800080" }}
                    onClick={handleJoinRoom}
                  >
                    Join Room
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicTacToePopup;
