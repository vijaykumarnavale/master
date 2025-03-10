import React from 'react';
import Img211 from '../components/images/211.png';
import Img212 from '../components/images/212.png';
import Img213 from '../components/images/213.png';

const Gallery = () => {
  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold mb-6">Gallery</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="w-1/3 p-2">
          <img className="w-full h-auto rounded-lg shadow-md" src={Img211} alt="Gallery img1" />
        </div>
        <div className="w-1/3 p-2">
          <img className="w-full h-auto rounded-lg shadow-md" src={Img212} alt="Gallery img2" />
        </div>
        <div className="w-1/3 p-2">
          <img className="w-full h-auto rounded-lg shadow-md" src={Img213} alt="Gallery img3" />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
