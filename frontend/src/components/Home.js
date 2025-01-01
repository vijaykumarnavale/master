import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <main className="main-content">
        <div className="intro">
          <h1>Architect</h1>
          <p>Let's build your dream of having a home</p>
          <button className="more-info-btn">
            <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
            More Info
          </button>
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
