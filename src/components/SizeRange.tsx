import React from 'react';
import { Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

const SizeRange = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 py-8 sm:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Ruler className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-[#4a4a4a] dark:text-gray-300 transition-colors duration-300" />
          <h2 className="mt-2 text-2xl sm:text-3xl font-light tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
            Find Your Perfect Fit
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4 transition-colors duration-300">
            We offer an inclusive size range from 33 to 44, catering to both petite and wide feet.
            Every style is carefully crafted to ensure comfort without compromising on aesthetics.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-3">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-300">
            <h3 className="text-sm sm:text-lg font-light text-gray-900 dark:text-white transition-colors duration-300">Petite Sizes</h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Sizes 33-35</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Specially designed for smaller feet, maintaining perfect proportions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-300">
            <h3 className="text-sm sm:text-lg font-light text-gray-900 dark:text-white transition-colors duration-300">Standard Sizes</h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Sizes 36-40</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Our core size range with the perfect balance of style and comfort
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-300">
            <h3 className="text-sm sm:text-lg font-light text-gray-900 dark:text-white transition-colors duration-300">Extended Sizes</h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Sizes 41-44</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Larger sizes without compromising on style or comfort
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link
            to="/size-guide"
            className="inline-flex items-center text-[#4a4a4a] dark:text-gray-300 hover:text-[#3a3a3a] dark:hover:text-white text-sm sm:text-base font-light transition-colors duration-300"
          >
            View Size Guide
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SizeRange;