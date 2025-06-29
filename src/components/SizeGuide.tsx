import React from 'react';
import { Ruler } from 'lucide-react';

const sizeData = [
  { size: '33', length: '21.5' },
  { size: '34', length: '22.0' },
  { size: '35', length: '22.5' },
  { size: '36', length: '23.0' },
  { size: '37', length: '23.5' },
  { size: '38', length: '24.0' },
  { size: '39', length: '24.5' },
  { size: '40', length: '25.0' },
  { size: '41', length: '25.5' },
  { size: '42', length: '26.0' },
  { size: '43', length: '26.5' },
  { size: '44', length: '27.0' },
];

const productSizeRanges = {
  heels: [
    { name: 'Alma', range: '33-44' },
    { name: 'Kate', range: '33-42' },
    { name: 'Victoria', range: '33-44' },
    { name: 'Edith', range: '33-44' },
    { name: 'Emma', range: '33-44' },
    { name: 'Tiffany', range: '33-44' },
    { name: 'Regina', range: '33-44' },
    { name: 'Sophia', range: '33-44' },
    { name: 'Luna Clear Wedges', range: '33-42' }
  ],
  maryJane: [
    { name: 'Moulin', range: '33-44' },
    { name: 'Poppy', range: '33-44' },
    { name: 'Greta', range: '33-44' },
    { name: 'Coco', range: '33-44' },
    { name: 'Charlotte', range: '33-44' },
    { name: 'Solene', range: '34-44' }
  ],
  sandals: [
    { name: 'Colette', range: '35-42' },
    { name: 'Rhea', range: '33-44' },
    { name: 'Rosette', range: '33-44' },
    { name: 'Alice Bow', range: '33-44' },
    { name: 'Isla', range: '33-44' }
  ],
  platform: [
    { name: 'Rue', range: '34-41' }
  ]
};

const SizeGuide = () => {
  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative w-full bg-gray-50 dark:bg-gray-800 py-16 sm:py-24 transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-90 transition-colors duration-300" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Ruler className="mx-auto h-12 w-12 text-gray-900 dark:text-white mb-6 transition-colors duration-300" />
          <h1 className="text-3xl sm:text-4xl font-light tracking-wider text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Size Guide
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            Find your perfect fit with our comprehensive size guide. We offer sizes from 33 to 44,
            ensuring comfort and style for every foot size.
          </p>
        </div>
      </div>

      {/* Size Chart Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <div className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Size</div>
            <div className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Insole Length (cm)</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {sizeData.map((item, index) => (
              <div
                key={item.size}
                className={`grid grid-cols-2 ${
                  index % 2 === 0 
                    ? 'bg-white dark:bg-gray-800' 
                    : 'bg-gray-50 dark:bg-gray-700'
                } hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300`}
              >
                <div className="py-4 px-6 text-sm text-gray-900 dark:text-white transition-colors duration-300">{item.size}</div>
                <div className="py-4 px-6 text-sm text-gray-900 dark:text-white transition-colors duration-300">{item.length} cm</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product-Specific Size Ranges */}
        <div className="mt-8 space-y-6">
          {/* Heels */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300 hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Heels Collection</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {productSizeRanges.heels.map((product) => (
                <div key={product.name} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{product.name}:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">{product.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mary Jane */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300 hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Mary Jane Collection</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {productSizeRanges.maryJane.map((product) => (
                <div key={product.name} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{product.name}:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">{product.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sandals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300 hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Sandals Collection</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {productSizeRanges.sandals.map((product) => (
                <div key={product.name} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{product.name}:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">{product.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300 hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Platform Collection</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {productSizeRanges.platform.map((product) => (
                <div key={product.name} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{product.name}:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">{product.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Measurement Guide */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-white mb-6 transition-colors duration-300">How to Measure</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
            <div className="space-y-6">
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Step 1: Prepare</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Stand on a piece of paper with your heel against a wall. Wear the type of socks you plan to wear with your shoes.
                </p>
              </div>
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Step 2: Mark</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Mark the tip of your longest toe and the back of your heel on the paper.
                </p>
              </div>
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Step 3: Measure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Measure the distance between the two marks in centimeters. This is your foot length.
                </p>
              </div>
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors duration-300">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Step 4: Select</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Find your measurement in the size chart above and choose the corresponding size.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors duration-300">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 transition-colors duration-300">
            <strong>Note:</strong> If you're between sizes, we recommend choosing the larger size for optimal comfort.
            For the best fit, measure both feet and use the larger measurement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;