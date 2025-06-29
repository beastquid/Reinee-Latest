import React from 'react';

const Concept = () => {
  return (
    <div className="pt-[60px] min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative w-full" style={{ height: '90vh' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Concept-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-50 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center p-[5%]">
          <h1 className="text-white font-light tracking-[0.3em] text-center" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            CONCEPT
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-[90%] max-w-3xl mx-auto py-[10%]">
        <div className="space-y-[5%] animate-fade-in-up animation-delay-300">
          <div className="text-center space-y-[3%]">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              At Reinee, we believe that elegance is more than just a look—it's a way of life. Every step you take should embody grace, confidence, and timeless beauty. Our collection is meticulously designed to blend sophistication with modern comfort, ensuring that each pair becomes an extension of your refined style.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              From delicate heels that elevate your presence to chic flats that define effortless luxury, Reinee is where craftsmanship meets artistry. Our carefully curated selection brings together the finest materials, impeccable attention to detail, and a touch of understated glamour—because you deserve nothing less.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
              Step into a world where elegance is effortless and style knows no limits. Welcome to Reinee.
            </p>
          </div>
        </div>

        {/* Visual Elements */}
        <div className="mt-[10%] grid grid-cols-1 gap-[5%] animate-fade-in-up animation-delay-600" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src="/devina-putri.jpg"
              alt="Devina Putri wearing Reinee shoes"
              className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 dark:to-transparent transition-all duration-300" />
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
              src="/yure-concept.jpg"
              alt="Yure concept showcase"
              className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 dark:to-transparent transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concept;