import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Package, BarChart3, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    navigate('/admin-login');
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Users</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Products</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">23</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Orders</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">567</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-orange-500 dark:text-orange-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Settings</p>
                <p className="text-2xl font-light text-gray-900 dark:text-white transition-colors duration-300">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            You have successfully logged in as an administrator. From here you can manage products, 
            view analytics, and configure system settings.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              View Website
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;