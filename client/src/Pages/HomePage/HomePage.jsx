import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./HomePage.css";

function HomePage() {

  const navigate = useNavigate();

  const handleStartNow = () => {
    const isLoggedIn = localStorage.getItem("token"); 
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  return (
    <div className="homepage">
      <Header />
      <h2 className="gallery-title">Explore Edited Photos</h2>
      <div className="start-now-container">
        <button className="start-now-button" onClick={handleStartNow}>
          Start Now
        </button>
      </div>
    </div>
  );
}

export default HomePage;

