import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import ImageOptimizer from './ImageOptimizer';

const reviews = [
  {
    id: 1,
    rating: 5,
    image: '/customer-comment/customer 1.jpg'
  },
  {
    id: 2,
    rating: 5,
    image: '/customer-comment/customer 2.jpg'
  },
  {
    id: 3,
    rating: 5,
    image: '/customer-comment/customer 3.jpg'
  },
  {
    id: 4,
    rating: 5,
    image: '/customer-comment/customer 4.jpg'
  },
  {
    id: 5,
    rating: 5,
    image: '/customer-comment/customer 5.jpg'
  },
  {
    id: 6,
    rating: 5,
    image: '/customer-comment/customer 6.jpg'
  },
  {
    id: 7,
    rating: 5,
    image: '/customer-comment/customer 7.jpg'
  }
];

const SocialProof = () => {
  const [displayedReviews, setDisplayedReviews] = useState<typeof reviews>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRandomReviews = () => {
    const shuffled = [...reviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    // Set initial reviews
    setDisplayedReviews(getRandomReviews());
    setIsLoading(false);

    // Update reviews every 10 seconds
    const interval = setInterval(() => {
      setDisplayedReviews(getRandomReviews());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className="bg-gray-50 dark:bg-gray-800 py-8 sm:py-16 transition-colors duration-300">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 py-8 sm:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-gray-900 dark:text-white text-center mb-8 sm:mb-12 transition-colors duration-300">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {displayedReviews.map((review) => (
            <div
              key={`${review.id}-${Math.random()}`}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col h-full transition-colors duration-300"
            >
              <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-600 transition-colors duration-300">
                <ImageOptimizer
                  src={review.image}
                  alt="Customer review"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6 flex-grow flex items-center justify-center">
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProof;