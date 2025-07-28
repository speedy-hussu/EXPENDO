import React, { useState } from "react";
import { Container } from "../../components/componentIndex";
import "./Home.css";
import heroImage from "../../assets/heroImg.png";
function Home() {
  
  return (
    <Container>
      <div className="home-page">
        <div className="left">
          <h1 id="header-text">Its time to manage expenses</h1>
          <p id="para-text">
            Track your daily expenses with ease. Stay organized, manage your
            budget, and gain insights into your spending patterns — all in one
            place.
          </p>
        </div>
        <div className="right">
          <img src={heroImage} />
        </div>
      </div>
    </Container>
  );
}

export default Home;
