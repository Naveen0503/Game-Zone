import React from "react";
import { useState } from "react";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    window.location.reload();
  }
    return (
        <div className="dashboard">
        {isLoggedIn && (
          <>
            <button className="dashboard-icon" title="Back to Home" onClick={handleBack}>
              BACK<FaArrowLeft />
            </button>
            <button onClick={handleLogout} className="dashboard-icon" title="Logout">
              {sessionStorage.getItem("userName")}<FaSignOutAlt />
            </button>
          </>
        )}
      </div>
    );
}

export default Dashboard;
