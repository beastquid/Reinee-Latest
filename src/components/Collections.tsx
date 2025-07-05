import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections } from '../hooks/useCollections';
import { Loader2 } from 'lucide-react';

const Collections = () => {
  const navigate = useNavigate();
  const { collections, loading, error } = useCollections();

  const handleCollectionClick = (category: string) => {
    const formattedCategory = category.toLowerCase().replace(/ /g, '-');
    navigate(`/products/${formattedCategory}`);
  };

  // Static collection images mapping
  const collectionImages: { [key: string]: string } = {
    'Heels': '/collections/heels-collection.jpg',
    'Mary Jane Flat Shoes': '/collections/mary-jane-collection.jpg',
    'Flat Sandals': '/collections/sandals-collection.jpg',
    'Platform Dad Sandals': '/collections/platform-collection.jpg'
  };

  const collectionDescriptions: { [key: string]: string } = {
    'Heels': 'Elegant heels for every occasion',
    'Mary Jane Flat Shoes': 'Classic comfort meets modern style',
    'Flat Sandals': 'Effortless elegance for everyday',
    'Platform Dad Sandals': 'Modern comfort with elevated style'
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading collections...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center py-20">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load collections</p>
        </div>
      </div>
    );
  }

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
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">No collections available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {collections.map((collection, index) => (
              <button
                key={collection.id}
                onClick={() => handleCollectionClick(collection.name)}
                className={`group relative h-[50vh] sm:h-[60vh] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] ${
                  index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'
                }`}
              >
                <div className="absolute inset-0">
                  <img
                    src={collectionImages[collection.name] || '/collections/heels-collection.jpg'}
                    alt={`${collection.name} Collection`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-50 transition-all duration-500 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-40" />
                </div>
                <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-4 sm:p-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wider mb-2 sm:mb-4 transform transition-transform duration-500 group-hover:scale-105">
                    {collection.name} Collection
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base max-w-md opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {collectionDescriptions[collection.name] || 'Elegant footwear collection'}
                  </p>
                  <span className="mt-4 sm:mt-6 inline-block border border-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm tracking-wider hover:bg-white hover:text-black dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-all duration-300 transform group-hover:scale-105">
                    View Collection
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;