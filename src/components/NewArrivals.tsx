import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ImageOptimizer from './ImageOptimizer';

const NewArrivals = () => {
  const navigate = useNavigate();
  const [displayedProducts, setDisplayedProducts] = useState<typeof products>([]);

  // Function to get only Luna Clear Wedges, Isla, and Solene
  const getNewArrivals = () => {
    const newArrivals = products.filter(
      product => ['Luna Clear Wedges', 'Isla', 'Solene'].includes(product.name)
    );
    
    // Shuffle the three products for variety
    const shuffled = [...newArrivals].sort(() => 0.5 - Math.random());
    
    // Return all 3 products, filling the 4th slot with a repeat if needed
    const selected = [...shuffled];
    if (selected.length < 4 && shuffled.length > 0) {
      selected.push(shuffled[0]); // Add the first one again to fill 4 slots
    }
    
    return selected.slice(0, 4);
  };

  useEffect(() => {
    // Set initial products
    setDisplayedProducts(getNewArrivals());

    // Update products every 8 seconds
    const interval = setInterval(() => {
      setDisplayedProducts(getNewArrivals());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-8 sm:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-gray-900 dark:text-white text-center mb-8 sm:mb-12 transition-colors duration-300">
          New Arrivals
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {displayedProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`}
              className="group relative cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
                <ImageOptimizer
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full group-hover:opacity-75 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 sm:mt-4">
                <h3 className="text-xs sm:text-sm font-light text-gray-900 dark:text-white transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm font-light text-gray-900 dark:text-white transition-colors duration-300">{product.price}</p>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {product.colors.slice(0, 3).join(', ')}
                  {product.colors.length > 3 && ' ...'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;