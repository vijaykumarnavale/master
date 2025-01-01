import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faHome, faInfoCircle, faImage, faPhoneAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

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
