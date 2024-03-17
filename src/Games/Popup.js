import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PouchDB from 'pouchdb-browser';

const Popup = ({ onNewUser, onExistingUser }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [localDB, setLocalDB] = useState(null);

  useEffect(() => {
    const db = new PouchDB('userdb');
    setLocalDB(db);
  }, []);

  const handleNewUser = async () => {
    if (!userName || !password) {
      setError("Please enter both name and password!");
      return;
    }

    try {
      // Check if the username already exists in local database
      const existingUser = await getUserByName(userName);
      if (existingUser) {
        setError("Username already exists. Please choose a different one.");
        return;
      }

      // Create a new user
      const newUser = { name: userName, password, scores: [] };
      await createUser(newUser);

      // Clear input fields and error
      setUserName("");
      setPassword("");
      setError("");

      // Trigger the callback for new user
      onNewUser(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error creating user. Please try again.");
    }
  };

  const handleExistingUser = async () => {
    if (!userName || !password) {
      setError("Please enter both name and password!");
      return;
    }

    try {
      // Check if the username exists in local database
      const existingUser = await getUserByName(userName);
      if (!existingUser) {
        setError("User does not exist. Please register as a new user.");
        return;
      }

      // Check if the password is correct
      if (existingUser.password !== password) {
        setError("Incorrect password. Please try again.");
        return;
      }

      // Clear input fields and error
      setUserName("");
      setPassword("");
      setError("");

      // Trigger the callback for existing user
      onExistingUser(existingUser);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  const getUserByName = async (name) => {
    try {
      const response = await localDB.query((doc, emit) => {
        if (doc.name === name) emit(doc);
      }, { include_docs: true });
  
      if (response.rows.length > 0) {
        return response.rows[0].doc;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user by name:", error);
      throw error;
    }
  };
  

  const createUser = async (userData) => {
    try {
      const response = await localDB.post(userData);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
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
            <div className="modal-header border-0" style={{justifyContent: "center"}}>
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
              <input
                style={{ width: "80%" }}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-2"
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="d-flex justify-content-around">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;
