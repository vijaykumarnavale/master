import React from 'react';
import './Home.css';
import backgroundImage from './images/architect.png'; // Adjust the path if necessary

const Home = () => {
  return (
    <div >
      <main className="main-content" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="intro">
          <h1>Nanak Architect</h1>
          <p>Let's build your dream of having a home</p>
          <button className="more-info-btn">
            <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
            More Info
          </button>
        </div>
        <div className="features">
          <div className="feature">
            <p>Designing Dreams, Building Realities.</p>
          </div>
          <div className="feature">
            <p>Transforming Ideas into Iconic Designs.</p>
          </div>
          <div className="feature">
            <p>Where Vision Meets Structure.</p>
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
