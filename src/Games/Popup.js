import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Popup = ({ onNewUser, onExistingUser }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [UserData, setUserdata] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading

  useEffect(() => {
    axios.get('https://game-zone-api-v1.azurewebsites.net/api/Gamers')
      .then((response) => {
        setUserdata(response.data);
      });
  }, []);

  const handleNewUser = async () => {
    if (!userName || !password) {
      setError("Please enter both name and password!");
      return;
    }

    setLoading(true); // Set loading to true while waiting for response

    // Check if the username already exists
    const existingUser = await checkExistingUser(userName);
    if (existingUser) {
      setLoading(false); // Reset loading
      setError("Username already exists. Please choose a different one.");
      return;
    }

    // Create a new user
    const newUser = {
      "name": userName,
      "password": password
    };
    const user = await writeUserData(newUser);

    setLoading(false); // Reset loading
    // Clear input fields and error
    setUserName("");
    setPassword("");
    setError("");
    // Trigger the callback for new user
    onNewUser(user);
  };

  const handleExistingUser = async () => {
    if (!userName || !password) {
      setError("Please enter both name and password!");
      return;
    }

    setLoading(true); // Set loading to true while waiting for response

    // Check if the username exists
    const existingUser = await checkExistingUser(userName);
    if (!existingUser) {
      setLoading(false); // Reset loading
      setError("User does not exist. Please register as a new user.");
      return;
    }

    // Check if the password is correct
    if (existingUser.password !== password) {
      setLoading(false); // Reset loading
      setError("Incorrect password. Please try again.");
      return;
    }

    setLoading(false); // Reset loading
    // Clear input fields and error
    setUserName("");
    setPassword("");
    setError("");

    // Trigger the callback for existing user
    onExistingUser(existingUser);
  };

  const checkExistingUser = async (username) => {
    try {
      const existingUser = UserData.find((user) => user.name.toLowerCase() === username.toLowerCase());
      return existingUser;
    } catch (error) {
      console.error("Error checking existing user:", error);
      return null;
    }
  };

  const writeUserData = (newUser) => {
    try {
      return new Promise((resolve, reject) => {
        axios.post('https://game-zone-api-v1.azurewebsites.net/api/Gamers', newUser)
          .then((response) => {
            setUserdata([...UserData, response.data]);
            console.log(response.data);
            setTimeout(() => {
              resolve(response.data);
            }, 5000); // Wait for 5 seconds before resolving the promise
          })
          .catch(error => {
            reject(error);
          });
      });
    } catch (error) {
      console.error("Error writing user data:", error);
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
              <h5 className="modal-title">Login</h5>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <input
                style={{ width: "80%" }}
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="form-control mb-2"
              />
              <div className="input-group mb-2" style={{ width: "80%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="d-flex justify-content-around">
                { loading ? "Loading..." :<>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#800080", borderColor: "#800080", marginRight: "10px" }}
                  onClick={handleNewUser}
                >
                New User
                </button>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#800080", borderColor: "#800080", marginLeft: "10px" }}
                  onClick={handleExistingUser}
                >
                  Existing User
                </button>
                </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;
