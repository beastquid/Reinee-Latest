import React from 'react';
import { Instagram } from 'lucide-react';

const TikTokIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#585454] dark:bg-gray-800 text-white py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-lg font-light tracking-[0.3em] mb-2">R E I N E E</h2>
            <p className="text-sm text-gray-300 dark:text-gray-400 transition-colors duration-300">
             Bringing elegance to every step, delivering comfort without compromise
            </p>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Shop</h3>
            <div className="space-y-2">
              <a 
                href="https://shopee.co.id/reineeofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="flex items-center">
                  <img src="/icons8-shopee-144.png" alt="Shopee" className="w-4 h-4 mr-2" />
                  Shopee
                </span>
              </a>
              <a 
                href="https://www.tokopedia.com/reineeofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="flex items-center">
                  <img src="/tokopedia-logo.png" alt="Tokopedia" className="w-4 h-4 mr-2" />
                  Tokopedia
                </span>
              </a>
            </div>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <div className="space-y-2">
              <a 
                href="https://www.instagram.com/reineeofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </span>
              </a>
              <a 
                href="https://www.tiktok.com/@reineeofficial" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-sm text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="flex items-center">
                  <TikTokIcon className="w-4 h-4 mr-2" />
                  TikTok
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-600 dark:border-gray-700 transition-colors duration-300">
          <p className="text-xs text-gray-300 dark:text-gray-400 text-center transition-colors duration-300">
            © {new Date().getFullYear()} R E I N E E. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;