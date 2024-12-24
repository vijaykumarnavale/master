import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* <header className="header">
        <div className="logo">Nanak Architect</div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="auth-buttons">
          <button className="login-btn">Log In</button>
        </div>
      </header> */}

      <main className="main-content">
        <div className="intro">
          <h1>Architect</h1>
          <p>Let's build your dream of having a home</p>
          <button className="more-info-btn">More Info</button>
        </div>
        <div className="features">
          <div className="feature">
            <span>1</span>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
          </div>
          <div className="feature">
            <span>2</span>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
          </div>
          <div className="feature">
            <span>3</span>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Nanak Architect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
