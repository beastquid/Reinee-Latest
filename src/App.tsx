// src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

// Public components
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

// Admin components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Layout for all public pages
function PublicLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

// Home page itself
function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCategories />
      <SizeRange />
      <NewArrivals />
      <SocialProof />
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
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

          {/* All public routes share the PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="concept" element={<Concept />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:category" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="collections" element={<Collections />} />
            <Route path="size-guide" element={<SizeGuide />} />

            {/* Fallback: unknown URLs → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
