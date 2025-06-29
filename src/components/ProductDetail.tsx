import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { products } from '../data/products';
import ImageOptimizer from './ImageOptimizer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('');
  
  const product = products.find(p => p.id === id);
  
  useEffect(() => {
    if (product && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-900 dark:text-white transition-colors duration-300">Product not found</p>
        </div>
      </div>
    );
  }

  const getColorImage = (color: string) => {
    const baseImagePath = product.image.replace('.jpg', '');
    return `${baseImagePath}-${color.toLowerCase().replace(/ /g, '-')}.jpg`;
  };

  // Define size ranges for each product
  const getSizeRange = (productName: string) => {
    const sizeRanges: { [key: string]: number[] } = {
      'Alma': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Kate': Array.from({ length: 10 }, (_, i) => i + 33), // 33-42
      'Victoria': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Edith': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Emma': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Tiffany': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Regina': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Sophia': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Luna Clear Wedges': Array.from({ length: 10 }, (_, i) => i + 33), // 33-42
      'Moulin': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Poppy': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Greta': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Coco': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Charlotte': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Colette': Array.from({ length: 8 }, (_, i) => i + 35), // 35-42
      'Rhea': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Rosette': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Alice Bow': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
      'Rue': Array.from({ length: 8 }, (_, i) => i + 34), // 34-41
      'Solene': Array.from({ length: 11 }, (_, i) => i + 34), // 34-44
      'Isla': Array.from({ length: 12 }, (_, i) => i + 33), // 33-44
    };
    
    return sizeRanges[productName] || Array.from({ length: 12 }, (_, i) => i + 33);
  };

  const availableSizes = getSizeRange(product.name);

  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 sm:mb-8 transition-colors duration-300"
        >
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <ImageOptimizer
              src={selectedColor ? getColorImage(selectedColor) : product.image}
              alt={`${product.name} in ${selectedColor}`}
              className="w-full h-full hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">{product.name}</h1>
              <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-gray-900 dark:text-white transition-colors duration-300">{product.price}</p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Color</h3>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-300 hover:scale-105 ${
                      selectedColor === color
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Guide */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Size Guide</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Available sizes</span>
              </div>
              <div className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                {availableSizes.map((size) => (
                  <div
                    key={size}
                    className="border border-gray-300 dark:border-gray-600 rounded py-1.5 sm:py-2 text-xs sm:text-sm text-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    {size}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Please select your size on our Shopee or Tokopedia store
              </p>
            </div>

            {/* Shop Buttons */}
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
              {product.price === 'Coming Soon' ? (
                <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-300">
                  <p className="text-lg font-light text-gray-900 dark:text-white transition-colors duration-300">Coming Soon</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">This product will be available next week</p>
                </div>
              ) : (
                <>
                  {product.shopeeLink && (
                    <a
                      href={product.shopeeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#ee4d2d] hover:bg-[#d23f23] text-white py-2.5 sm:py-3 rounded-full flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <img src="/icons8-shopee-144.png" alt="Shopee" className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span>Buy on Shopee</span>
                    </a>
                  )}
                  <a
                    href="https://www.tokopedia.com/reineeofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#03ac0e] hover:bg-[#029c0c] text-white py-2.5 sm:py-3 rounded-full flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <img src="/tokopedia-logo.png" alt="Tokopedia" className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>Buy on Tokopedia</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;