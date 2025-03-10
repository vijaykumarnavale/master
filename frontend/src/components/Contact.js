import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="p-10 bg-gray-100 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h1>
      <div className="max-w-5xl mx-auto flex flex-wrap md:flex-nowrap gap-6 justify-between">
        
        {/* Left Side - Contact Info */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg text-gray-700 mb-2"><strong>Address:</strong> 123 Design Avenue, Architect City, AC 45678</p>
          <p className="text-lg text-gray-700 mb-2"><strong>Mobile:</strong> +123 456 7890</p>
          <p className="text-lg text-gray-700 mb-4"><strong>Email:</strong> contact@nanakarchitect.com</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Follow Us:</h3>
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-700 hover:text-blue-600 text-2xl">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-700 hover:text-blue-400 text-2xl">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-700 hover:text-pink-500 text-2xl">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-700 hover:text-blue-800 text-2xl">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form & Feedback */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form className="flex flex-col space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea placeholder="Your Message" className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-md text-lg transition duration-300">
                Send
              </button>
            </form>
          </div>
          
          {/* Feedback Section
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Feedback</h2>
            <textarea placeholder="Share your feedback..." className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-md text-lg transition duration-300 mt-4">
              Submit Feedback
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
