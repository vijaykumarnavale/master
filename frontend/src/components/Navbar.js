import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './images/logo.png'; // Import your logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Login</Link>
   
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
