import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationHeader.scss";

function NavigationHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="nav-header">
      <div className="nav-left">
        <button onClick={() => navigate("/dashboard")} className="nav-button">
          Dashboard
        </button>
        <button onClick={() => navigate("/favourites")} className="nav-button">
          Favourites
        </button>
      </div>
      <div className="nav-right">
        <button onClick={handleLogout} className="nav-button logout-button">
          Logout
        </button>
      </div>
    </header>
  );
}

export default NavigationHeader;
