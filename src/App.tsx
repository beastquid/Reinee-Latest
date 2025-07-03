// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCategories from './components/FeaturedCategories';
import SizeRange from './components/SizeRange';
import NewArrivals from './components/NewArrivals';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';

import Concept from './components/Concept';
import About from './components/About';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Collections from './components/Collections';
import SizeGuide from './components/SizeGuide';

import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            {/* Admin routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <main>
                          <Hero />
                          <FeaturedCategories />
                          <SizeRange />
                          <NewArrivals />
                          <SocialProof />
                        </main>
                      }
                    />
                    <Route path="/concept" element={<Concept />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:category" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    {/* Catch-all: redirect unknown paths to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
