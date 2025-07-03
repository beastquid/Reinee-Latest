import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Image, Grid3X3, Ruler, Home, Plus, Edit, Trash2, Upload, Save, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: string;
  image_url: string;
  availability: string;
  collections_id: string | null;
  created_at: string;
}

interface Collection {
  id: string;
  name: string;
}

interface HeroData {
  id: string;
  title: string;
  subtitle: string | null;
  background_image_url: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  
  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editingHero, setEditingHero] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);

  // Form data
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    availability: 'available',
    collections_id: '',
    image_url: ''
  });
  
  const [collectionForm, setCollectionForm] = useState({
    name: ''
  });
  
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    background_image_url: ''
  });

  // Handle authentication internally
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/admin-login');
          return;
        }
        setUser(session.user);
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin-login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        navigate('/admin-login');
      } else {
        setUser(session.user);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && !authLoading) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProducts(),
        loadCollections(),
        loadHeroData()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setProducts(data || []);
  };

  const loadCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('name');
    
    if (error) throw error;
    setCollections(data || []);
  };

  const loadHeroData = async () => {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (data) {
      setHeroData(data);
      setHeroForm({
        title: data.title || '',
        subtitle: data.subtitle || '',
        background_image_url: data.background_image_url || ''
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `admin-uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageUpload = async (file: File, type: 'product' | 'hero') => {
    try {
      setLoading(true);
      const imageUrl = await uploadImage(file);
      
      if (type === 'product') {
        setProductForm(prev => ({ ...prev, image_url: imageUrl }));
      } else {
        setHeroForm(prev => ({ ...prev, background_image_url: imageUrl }));
      }
      
      showMessage('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productForm)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        showMessage('success', 'Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productForm]);
        
        if (error) throw error;
        showMessage('success', 'Product created successfully');
      }
      
      await loadProducts();
      resetProductForm();
    } catch (error) {
      console.error('Save error:', error);
      showMessage('error', 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      showMessage('success', 'Product deleted successfully');
      await loadProducts();
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCollection = async () => {
    try {
      setLoading(true);
      
      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(collectionForm)
          .eq('id', editingCollection.id);
        
        if (error) throw error;
        showMessage('success', 'Collection updated successfully');
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([collectionForm]);
        
        if (error) throw error;
        showMessage('success', 'Collection created successfully');
      }
      
      await loadCollections();
      resetCollectionForm();
    } catch (error) {
      console.error('Save error:', error);
      showMessage('error', 'Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      showMessage('success', 'Collection deleted successfully');
      await loadCollections();
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete collection');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      setLoading(true);
      
      if (heroData) {
        const { error } = await supabase
          .from('hero')
          .update(heroForm)
          .eq('id', heroData.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero')
          .insert([heroForm]);
        
        if (error) throw error;
      }
      
      showMessage('success', 'Hero section updated successfully');
      await loadHeroData();
      setEditingHero(false);
    } catch (error) {
      console.error('Save error:', error);
      showMessage('error', 'Failed to update hero section');
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      availability: 'available',
      collections_id: '',
      image_url: ''
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const resetCollectionForm = () => {
    setCollectionForm({ name: '' });
    setEditingCollection(null);
    setShowAddCollection(false);
  };

  const startEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      availability: product.availability,
      collections_id: product.collections_id || '',
      image_url: product.image_url
    });
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const startEditCollection = (collection: Collection) => {
    setCollectionForm({ name: collection.name });
    setEditingCollection(collection);
    setShowAddCollection(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-light tracking-wider text-gray-900 dark:text-white transition-colors duration-300">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {user.email}
              </span>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        } transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <span className="text-sm">{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                    activeTab === 'products'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                    activeTab === 'hero'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span>Hero Section</span>
                </button>
                <button
                  onClick={() => setActiveTab('collections')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                    activeTab === 'collections'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Collections</span>
                </button>
                <button
                  onClick={() => setActiveTab('size-guide')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                    activeTab === 'size-guide'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                  <span>Size Guide</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                    Welcome to the Admin Dashboard
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
                    Manage your Reinee website content from this dashboard. You can add products, update the hero section, 
                    manage collections, and edit the size guide.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex items-center">
                        <Package className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Products</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">{products.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex items-center">
                        <Grid3X3 className="w-8 h-8 text-green-500 dark:text-green-400" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Collections</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">{collections.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex items-center">
                        <Image className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Hero Status</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">{heroData ? 'Set' : 'Empty'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex items-center">
                        <Ruler className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Size Guide</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">Products</h2>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                {/* Product Form Modal */}
                {showAddProduct && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                            {editingProduct ? 'Edit Product' : 'Add Product'}
                          </h3>
                          <button
                            onClick={resetProductForm}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                              Name
                            </label>
                            <input
                              type="text"
                              value={productForm.name}
                              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                              Price
                            </label>
                            <input
                              type="text"
                              value={productForm.price}
                              onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                              placeholder="e.g., Rp299.000"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                              Availability
                            </label>
                            <select
                              value={productForm.availability}
                              onChange={(e) => setProductForm(prev => ({ ...prev, availability: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            >
                              <option value="available">Available</option>
                              <option value="out_of_stock">Out of Stock</option>
                              <option value="coming_soon">Coming Soon</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                              Collection
                            </label>
                            <select
                              value={productForm.collections_id}
                              onChange={(e) => setProductForm(prev => ({ ...prev, collections_id: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                            >
                              <option value="">No Collection</option>
                              {collections.map(collection => (
                                <option key={collection.id} value={collection.id}>
                                  {collection.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                              Image
                            </label>
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'product');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                              />
                              {productForm.image_url && (
                                <img
                                  src={productForm.image_url}
                                  alt="Preview"
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3 mt-6">
                          <button
                            onClick={handleSaveProduct}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors duration-300"
                          >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={resetProductForm}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Collection
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-md object-cover mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                    {product.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-300">
                              {product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.availability === 'available'
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                  : product.availability === 'out_of_stock'
                                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                              } transition-colors duration-300`}>
                                {product.availability.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-300">
                              {collections.find(c => c.id === product.collections_id)?.name || 'None'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => startEditProduct(product)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Section Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">Hero Section</h2>
                  <button
                    onClick={() => setEditingHero(!editingHero)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{editingHero ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                  {editingHero ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={heroForm.title}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Subtitle
                        </label>
                        <textarea
                          value={heroForm.subtitle}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                          Background Image
                        </label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'hero');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                          />
                          {heroForm.background_image_url && (
                            <img
                              src={heroForm.background_image_url}
                              alt="Hero preview"
                              className="w-full h-40 object-cover rounded-md"
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveHero}
                          disabled={loading}
                          className="flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors duration-300"
                        >
                          <Save className="w-4 h-4" />
                          <span>{loading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => setEditingHero(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {heroData ? (
                        <>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                              Current Hero Section
                            </h3>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                <strong>Title:</strong> {heroData.title}
                              </p>
                              {heroData.subtitle && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                  <strong>Subtitle:</strong> {heroData.subtitle}
                                </p>
                              )}
                              {heroData.background_image_url && (
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                                    <strong>Background Image:</strong>
                                  </p>
                                  <img
                                    src={heroData.background_image_url}
                                    alt="Hero background"
                                    className="w-full h-40 object-cover rounded-md"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          No hero section configured. Click Edit to add one.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Collections Tab */}
            {activeTab === 'collections' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">Collections</h2>
                  <button
                    onClick={() => setShowAddCollection(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Collection</span>
                  </button>
                </div>

                {/* Collection Form Modal */}
                {showAddCollection && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transition-colors duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                            {editingCollection ? 'Edit Collection' : 'Add Collection'}
                          </h3>
                          <button
                            onClick={resetCollectionForm}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                              Collection Name
                            </label>
                            <input
                              type="text"
                              value={collectionForm.name}
                              onChange={(e) => setCollectionForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                              placeholder="e.g., Heels Collection"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-3 mt-6">
                          <button
                            onClick={handleSaveCollection}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors duration-300"
                          >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={resetCollectionForm}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collections List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Collection Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Products Count
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                        {collections.map((collection) => (
                          <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                              {collection.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white transition-colors duration-300">
                              {products.filter(p => p.collections_id === collection.id).length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => startEditCollection(collection)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCollection(collection.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Size Guide Tab */}
            {activeTab === 'size-guide' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">Size Guide</h2>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                  <div className="text-center">
                    <Ruler className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-300" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      Size Guide Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                      The size guide is currently managed through the static SizeGuide component. 
                      To make it editable, you would need to create a database table for size guide content.
                    </p>
                    <button
                      onClick={() => navigate('/size-guide')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Current Size Guide</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;