import React from 'react';
import './About.css';
const About = () => {
  return (
    <div className="about-page">
      <h5 className="about-title">About Us</h5>
      <p className="about-description">
        Welcome to Nanak Architect, where we specialize in creating extraordinary designs that blend creativity, functionality, and innovation. Our passion is crafting spaces that inspire and elevate lifestyles.
      </p>

      <div className="about-map">
        <h2 className="about-map-title">Our Location</h2>
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509755!2d-122.41941548468107!3d37.77492927975957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085818c4e9fb3b3%3A0x9c7b7f0f9e1a6a27!2s123%20Design%20Ave%2C%20San%20Francisco%2C%20CA%2094103!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default About;
