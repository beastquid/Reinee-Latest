import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Instagram, Search } from 'lucide-react';
import { products } from '../data/products';
import ThemeToggle from './ThemeToggle';

const TikTokIcon = () => (
  <svg
    width="20"
    height="20"
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.colors.some(color => color.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filtered);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsMenuOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <nav className={`bg-white dark:bg-gray-900 fixed w-full top-0 z-50 transition-all duration-300 ${
        isMenuOpen ? 'shadow-lg' : 'shadow-sm'
      } border-b border-gray-200 dark:border-gray-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-light tracking-[0.3em] text-gray-900 dark:text-white transition-colors duration-300">
                R E I N E E
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <a 
                href="https://www.instagram.com/reineeofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@reineeofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                <TikTokIcon />
              </a>
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu overlay with visual divider */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700">
            <div className="h-16 border-b border-gray-100 dark:border-gray-700" /> {/* Spacer to match navbar height */}
            <div className="h-[calc(100vh-64px)] flex flex-col">
              {/* Search Bar */}
              <div className="p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full py-2 pl-4 pr-10 border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-400 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  />
                  <Search className="absolute right-2 top-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scroll-smooth px-6">
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-4 mb-8">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-start space-x-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 text-left transform hover:scale-[1.02]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{product.price}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {product.colors.slice(0, 3).join(', ')}
                            {product.colors.length > 3 && ' ...'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
                    No products found for "{searchQuery}"
                  </p>
                )}

                {/* Menu Items */}
                <div className="space-y-6">
                  <Link 
                    to="/concept" 
                    className="block text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CONCEPT
                  </Link>
                  <Link 
                    to="/about" 
                    className="block text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ABOUT US
                  </Link>
                  <Link 
                    to="/products" 
                    className="block text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ALL ITEMS
                  </Link>
                  <Link 
                    to="/collections" 
                    className="block text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    COLLECTION
                  </Link>
                  <Link 
                    to="/size-guide" 
                    className="block text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SIZE GUIDE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;