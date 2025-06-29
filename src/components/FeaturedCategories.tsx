import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ImageOptimizer from './ImageOptimizer';

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<typeof products>([]);

  // Function to get 3 random products with priority for Luna Clear Wedges, Isla, and Solene
  const getRandomProducts = () => {
    // Priority products that should appear first
    const priorityProducts = products.filter(
      product => ['Luna Clear Wedges', 'Isla', 'Solene'].includes(product.name) && product.price !== 'Coming Soon'
    );
    
    // Other products excluding priority ones and coming soon products
    const otherProducts = products.filter(
      product => !['Luna Clear Wedges', 'Isla', 'Solene'].includes(product.name) && product.price !== 'Coming Soon'
    );
    
    // Shuffle other products
    const shuffledOthers = [...otherProducts].sort(() => 0.5 - Math.random());
    
    // Combine priority products first, then fill with random others
    const selected = [...priorityProducts];
    
    // Fill remaining slots with other products
    while (selected.length < 3 && shuffledOthers.length > 0) {
      selected.push(shuffledOthers.shift()!);
    }
    
    // If we still need more products (shouldn't happen), repeat from priority
    while (selected.length < 3 && priorityProducts.length > 0) {
      selected.push(priorityProducts[selected.length % priorityProducts.length]);
    }
    
    return selected.slice(0, 3);
  };

  useEffect(() => {
    // Set initial products
    setFeaturedProducts(getRandomProducts());

    // Update products every 8 seconds
    const interval = setInterval(() => {
      setFeaturedProducts(getRandomProducts());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-gray-900 dark:text-white text-center mb-8 transition-colors duration-300">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-50 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
                <ImageOptimizer
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full group-hover:opacity-75 transition-opacity duration-500"
                />
              </div>
              <h3 className="mt-3 text-sm font-light tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{product.price}</p>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {product.colors.slice(0, 3).join(', ')}
                {product.colors.length > 3 && ' ...'}
              </div>
              <button
                className="mt-2 text-xs text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-light inline-block transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.shopeeLink || 'https://shopee.co.id/reineeofficial', '_blank');
                }}
              >
                Shop Now →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;