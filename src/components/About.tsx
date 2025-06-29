import React from 'react';

const About = () => {
  return (
    <div className="pt-[60px] min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative w-full" style={{ height: '90vh' }}>
        <img
          src="/Reinee Model 2.jpg"
          alt="Reinee fashion model"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-50 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center p-[5%]">
          <h1 className="text-white font-light tracking-[0.3em] text-center" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            ABOUT US
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-[90%] max-w-3xl mx-auto py-[10%]">
        <div className="space-y-[5%] animate-fade-in-up animation-delay-300">
          <div className="text-center space-y-[3%]">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              At Reinee, we are more than just a footwear brand—we are curators of elegance, champions of confidence, and lovers of timeless beauty.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Born from a passion for sophisticated style, our journey began with a simple vision: to create shoes that empower women to walk with grace and confidence, without compromising on comfort. Every piece in our collection is thoughtfully designed to enhance your natural poise, blending modern aesthetics with classic refinement.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              With a commitment to quality, comfort, and impeccable design, we strive to offer you footwear that feels as exquisite as it looks. Whether you're stepping into a grand occasion or embracing everyday moments, Reinee is here to make sure you do it with elegance and ease.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Welcome to our world of timeless style. Welcome to Reinee.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-[10%] grid gap-[5%] animate-fade-in-up animation-delay-600" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-light tracking-wider mb-[3%] text-gray-900 dark:text-white transition-colors duration-300">Elegance</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>Timeless sophistication in every design</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-light tracking-wider mb-[3%] text-gray-900 dark:text-white transition-colors duration-300">Comfort</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>Luxurious comfort for every step</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-light tracking-wider mb-[3%] text-gray-900 dark:text-white transition-colors duration-300">Quality</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>Exceptional craftsmanship and materials</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;