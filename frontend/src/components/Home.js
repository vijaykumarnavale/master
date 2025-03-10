import React from 'react';
import backgroundImage from './images/architect.png';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main
        className="flex flex-col flex-1 items-center justify-center text-center p-10 bg-cover bg-center bg-no-repeat bg-fixed relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black"></div>

        <div className="relative text-white flex flex-col items-center max-w-3xl p-6">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg animate-fade-in">
            Nanak Architect
          </h1>
          <p className="text-lg md:text-2xl text-blue-300 mb-6 animate-slide-in">
            Let's build your dream home together
          </p>

          {/* More Info Button */}
          <button className="mt-4 w-64 px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-orange-700 hover:scale-105 transition-transform flex items-center justify-center">
            <i className="fas fa-info-circle mr-2"></i>
            More Info
          </button>
        </div>

        {/* Card Section */}
        <div className="relative flex flex-wrap justify-center mt-12 gap-6 max-w-screen-lg">
          {[
            { text: 'Designing Dreams, Building Realities.', icon: '🏗️' },
            { text: 'Transforming Ideas into Iconic Designs.', icon: '🎨' },
            { text: 'Where Vision Meets Structure.', icon: '🏡' }
          ].map((item, index) => (
            <div key={index} className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl p-6 max-w-xs rounded-xl text-black text-center transition-transform hover:scale-105 flex flex-col items-center gap-3">
              <span className="text-4xl">{item.icon}</span>
              <p className="text-lg font-semibold">{item.text}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-6 text-sm">
        <p>© 2025 Nanak Architect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
