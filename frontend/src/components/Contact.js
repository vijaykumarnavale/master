import React from 'react';
import './Contact.css'; // Make sure to create and link this CSS file
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <div className="contact-container">
        {/* Left Side - Contact Info */}
        <div className="contact-info">
          <p><strong>Address:</strong> 123 Design Avenue, Architect City, AC 45678</p>
          <p><strong>Mobile:</strong> +123 456 7890</p>
          <p><strong>Email:</strong> contact@nanakarchitect.com</p>

          <div className="contact-social-media">
            <h3>Follow Us:</h3>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="social-icon" />
            </a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-container">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" className="contact-input" />
            <input type="email" placeholder="Your Email" className="contact-input" />
            <textarea placeholder="Your Message" className="contact-textarea"></textarea>
            <button type="submit" className="contact-submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
