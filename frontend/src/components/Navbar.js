import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Navbar = () => {
  return (
    <header className="header">
      <div>
        <Link to="/">
        <div className="logo1">Nanak Architect</div>
        </Link>
      </div>
      <nav className="nav">
        {/* Use Link for Home */}
        <Link to="/">Home</Link>
        <a href="#about">About</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="auth-buttons">
      <Link to="/login"><button className="login-btn">Log In</button></Link>
      </div>
    </header>
  );
};

export default Navbar;
