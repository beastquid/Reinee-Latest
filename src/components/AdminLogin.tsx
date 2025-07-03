import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { rateLimiter } from '../utils/rateLimiter';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Clear field‐specific errors when inputs change
  useEffect(() => {
    if (Object.keys(errors).length) setErrors({});
    if (errorMessage) setErrorMessage('');
  }, [formData.email, formData.password]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ sanitize email
    const cleanEmail = formData.email.trim().toLowerCase();

    // 2️⃣ validate inputs
    if (!validateForm()) return;

    // 3️⃣ rate limit
    if (rateLimiter.isRateLimited(cleanEmail)) {
      const rem = rateLimiter.getRemainingTime(cleanEmail);
      const minutes = Math.ceil(rem / 60000);
      setErrorMessage(`Too many failed attempts. Try again in ${minutes} min.`);
      return;
    }

    setIsLoading(true);
    try {
      // 4️⃣ try to sign in
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: formData.password,
        });

      if (signInError) {
        rateLimiter.recordAttempt(cleanEmail);
        const msg = signInError.message;
        if (msg.includes('Invalid login credentials'))
          setErrorMessage('Invalid email or password. Please try again.');
        else if (msg.includes('Email not confirmed'))
          setErrorMessage('Please confirm your email first.');
        else if (msg.includes('Too many requests'))
          setErrorMessage('Too many login attempts. Try again later.');
        else setErrorMessage('Login failed. Please try again.');
        return;
      }

      // 5️⃣ now that we're authenticated, check the whitelist
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (adminError) {
        console.error('Admin lookup error:', adminError);
        setErrorMessage('Server error. Please try again.');
        return;
      }
      if (!adminData) {
        rateLimiter.recordAttempt(cleanEmail);
        setErrorMessage('You are not an authorized admin.');
        return;
      }

      // 6️⃣ finally, redirect
      if (signInData.user) {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white mb-6">
            <Lock className="h-6 w-6 text-white dark:text-gray-900" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300 mr-2" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 dark:text-blue-300 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Admin Setup Required</p>
                  <p>Make sure you:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Created an Auth user in Supabase</li>
                    <li>Added that email to the <code>admins</code> table</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.email
                      ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.password
                      ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700'
                  } text-gray-900 dark:text-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
