import React from "react";
import { useState } from "react";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { redirect, useNavigate } from "react-router-dom";

function Dashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("user") ? true : false);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    nav("/");
  };
  const nav = useNavigate();
  const handleBack = () => {
    nav("/");
  }
    return (
        <div className="dashboard">
        {isLoggedIn && (
          <>
            <a className="dashboard-icon" title="Back to Home" onClick={handleBack}>
              BACK<FaArrowLeft />
            </a>
            <a onClick={handleLogout} className="dashboard-icon" title="Logout">
              {sessionStorage.getItem("userName")}<FaSignOutAlt />
            </a>
          </>
        )}
      </div>
    );
}

export default Dashboard;