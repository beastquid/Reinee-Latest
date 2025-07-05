import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Loader2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCollections } from '../hooks/useCollections';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { collections, loading: collectionsLoading } = useCollections();
  const [selectedCategory, setSelectedCategory] = useState(category ? category.split('-').join(' ') : 'All');
  const [showFilters, setShowFilters] = useState(false);

  // Create categories array from collections
  const categories = ['All', ...collections.map(c => c.name)];

  useEffect(() => {
    if (category && collections.length > 0) {
      const formattedCategory = category.split('-').join(' ');
      const validCategory = collections.find(cat => cat.name.toLowerCase() === formattedCategory.toLowerCase());
      if (validCategory) {
        setSelectedCategory(validCategory.name);
      }
    } else {
      setSelectedCategory('All');
    }
  }, [category, collections]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      navigate('/products');
    } else {
      const formattedCategory = cat.toLowerCase().replace(/ /g, '-');
      navigate(`/products/${formattedCategory}`);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (productsLoading || collectionsLoading) {
    return (
      <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center py-20">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wider mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
          Discover our collection of elegant footwear, crafted with precision and style for the modern woman.
        </p>
      </div>

      {/* Back to Collections */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button
          onClick={() => navigate('/collections')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Filters */}
      <div className="border-t border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
          >
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="mt-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105 ${
                      selectedCategory === cat
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-600 dark:text-gray-400">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group text-left hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-sm font-light text-gray-900 dark:text-white transition-colors duration-300">{product.name}</h3>
                  <p className="text-sm text-gray-900 dark:text-white transition-colors duration-300">{product.price}</p>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.map((color, index) => (
                      <span key={index} className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {color}{index < product.colors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;