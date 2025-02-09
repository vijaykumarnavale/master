import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faImage, faPhoneAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import LogoImage from '../components/images/logo.png'; // Ensure the correct path

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={LogoImage} alt="Nanak Architect Logo" className="logo-image" />
        </Link>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-item">
          <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px' }} />
          Home
        </Link>
        <Link to="/about" className="nav-item">
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
          About
        </Link>
        <Link to="/gallery" className="nav-item">
          <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px' }} />
          Gallery
        </Link>
        <Link to="/contact" className="nav-item">
          <FontAwesomeIcon icon={faPhoneAlt} style={{ marginRight: '8px' }} />
          Contact
        </Link>
      </nav>

      <div className="auth-buttons">
        <Link to="/login">
          <button className="login-btn">
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '8px' }} />
            Log In
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
