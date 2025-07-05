import React from 'react';
import { useHero } from '../hooks/useHero';
import { Loader2 } from 'lucide-react';

const Hero = () => {
  const { hero, loading, error } = useHero();

  if (loading) {
    return (
      <div className="w-full relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading hero section...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load hero section</p>
        </div>
      </div>
    );
  }

  // Fallback to default if no hero data
  const heroData = hero || {
    title: 'REINEE OFFICIAL',
    subtitle: 'Elegant footwear for the modern woman',
    background_image_url: '/Luna-Hero-image.jpg'
  };

  return (
    <div className="w-full relative overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Image with fade-in animation */}
      <div className="w-full h-full animate-fade-in">
        <img
          src={heroData.background_image_url || '/Luna-Hero-image.jpg'}
          alt="Reinee Luna Clear Wedges - Elegant fashion model showcasing premium footwear collection"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      
      <div className="absolute top-0 left-0 right-0 pt-[20%] sm:pt-[15%] flex flex-col items-center text-center">
        {/* Buttons with staggered fade-in-up animation */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 px-4">
          <a
            href="https://shopee.co.id/reineeofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[110px] sm:w-36 bg-[#4a4a4a] dark:bg-gray-700 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-full text-center text-[10px] sm:text-sm hover:bg-[#3a3a3a] dark:hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105 opacity-0 animate-fade-in-up animation-delay-300"
          >
            <span className="flex items-center justify-center">
              <img src="/icons8-shopee-144.png" alt="Shopee logo" className="w-2.5 h-2.5 sm:w-4 sm:h-4 mr-1" />
              Shopee
            </span>
          </a>
          <a
            href="https://www.tokopedia.com/reineeofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[110px] sm:w-36 bg-[#4a4a4a] dark:bg-gray-700 text-white py-1 sm:py-2 px-2 sm:px-4 rounded-full text-center text-[10px] sm:text-sm hover:bg-[#3a3a3a] dark:hover:bg-gray-600 transition-all duration-300 ease-in-out hover:scale-105 opacity-0 animate-fade-in-up animation-delay-600"
          >
            <span className="flex items-center justify-center">
              <img src="/tokopedia-logo.png" alt="Tokopedia logo" className="w-2.5 h-2.5 sm:w-4 sm:h-4 mr-1" />
              Tokopedia
            </span>
          </a>
        </div>

        {/* Text with fade-in-up animation */}
        <p className="mt-2 text-[9px] sm:text-xs text-black dark:text-white px-4 opacity-0 animate-fade-in-up animation-delay-900 transition-colors duration-300">
          Enjoy Free Shipping on Shopee & Tokopedia!
        </p>
      </div>
    </div>
  );
};

export default Hero;