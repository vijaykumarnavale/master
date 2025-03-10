import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faImage, faPhoneAlt, faSignInAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import LogoImage from '../components/images/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-500 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={LogoImage} alt="Nanak Architect Logo" className="h-14 w-auto" />
          {/* <span className="text-2xl font-bold text-blue-600">Nanak Architect</span> */}
        </Link>
        
        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-blue-600 text-2xl">
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>

        {/* Navigation Links */}
        <nav className={`md:flex space-x-6 text-gray-700 font-medium absolute md:static bg-white w-full md:w-auto left-0 md:flex-row flex-col items-center md:items-center shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isOpen ? 'top-16' : '-top-96'}`}>
          <Link to="/" className="flex items-center py-2 px-5 md:px-0 hover:text-blue-600 transition duration-300">
            <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
          </Link>
          <Link to="/about" className="flex items-center py-2 px-5 md:px-0 hover:text-blue-600 transition duration-300">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> About
          </Link>
          <Link to="/gallery" className="flex items-center py-2 px-5 md:px-0 hover:text-blue-600 transition duration-300">
            <FontAwesomeIcon icon={faImage} className="mr-2" /> Gallery
          </Link>
          <Link to="/contact" className="flex items-center py-2 px-5 md:px-0 hover:text-blue-600 transition duration-300">
            <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" /> Contact
          </Link>
        </nav>
        
        {/* Login Button */}
        <div className="hidden md:block">
          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full hover:shadow-lg transition duration-300">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> Log In
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;