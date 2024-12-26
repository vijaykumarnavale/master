import React from 'react';
import './Gallery.css';
import Img211 from '../components/images/211.png';
import Img212 from '../components/images/212.png';
import Img213 from '../components/images/213.png';

const Gallery = () => {
  return (
    <div className="gallery-page">
      <h1 className="gallery-title">Gallery</h1>
      <div className="gallery-content">
        <div className="gallery-item">
          <img src={Img211} alt="Gallery img1" />
        </div>
        <div className="gallery-item">
          <img src={Img212} alt="Gallery img2 "/>
        </div>
        <div className="gallery-item">
          <img src={Img213} alt="Gallery img3" />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
