import React from 'react';
import { useNavigate } from 'react-router-dom';

const collections = [
  {
    title: 'Heels Collection',
    description: 'Elegant heels for every occasion',
    image: '/collections/heels-collection.jpg',
    category: 'Heels'
  },
  {
    title: 'Mary Jane Flat Shoes Collection',
    description: 'Classic comfort meets modern style',
    image: '/collections/mary-jane-collection.jpg',
    category: 'Mary Jane Flat Shoes'
  },
  {
    title: 'Flat Sandals Collection',
    description: 'Effortless elegance for everyday',
    image: '/collections/sandals-collection.jpg',
    category: 'Flat Sandals'
  },
  {
    title: 'Platform / Dad Sandals Collection',
    description: 'Modern comfort with elevated style',
    image: '/collections/platform-collection.jpg',
    category: 'Platform Dad Sandals'
  }
];

const Collections = () => {
  const navigate = useNavigate();

  const handleCollectionClick = (category: string) => {
    const formattedCategory = category.toLowerCase().replace(/ /g, '-');
    navigate(`/products/${formattedCategory}`);
  };

  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="text-center py-8 sm:py-12 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wider mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">Collections</h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
          Explore our curated collections of elegant footwear, each piece crafted with precision and style.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {collections.map((collection, index) => (
            <button
              key={collection.title}
              onClick={() => handleCollectionClick(collection.category)}
              className={`group relative h-[50vh] sm:h-[60vh] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] ${
                index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-50 transition-all duration-500 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-40" />
              </div>
              <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-4 sm:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wider mb-2 sm:mb-4 transform transition-transform duration-500 group-hover:scale-105">
                  {collection.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base max-w-md opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {collection.description}
                </p>
                <span className="mt-4 sm:mt-6 inline-block border border-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm tracking-wider hover:bg-white hover:text-black dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-all duration-300 transform group-hover:scale-105">
                  View Collection
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;