import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { rateLimiter } from '../utils/rateLimiter';

const AdminLogin: React.FC = () => {
  // — auth state —
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // — on mount, check session + subscribe —
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // — form state —
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // — handle input change —
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  // — validate —
  const validateForm = (): boolean => {
    const errs: any = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  // — submission —
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!validateForm()) return;
    if (rateLimiter.isRateLimited(cleanEmail)) {
      const min = Math.ceil(rateLimiter.getRemainingTime(cleanEmail) / 60000);
      setErrorMessage(`Too many attempts. Try again in ${min} min.`);
      return;
    }
    setIsLoading(true);
    try {
      // 1) sign in
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: formData.password,
        });
      if (signInError) {
        rateLimiter.recordAttempt(cleanEmail);
        const msg = signInError.message;
        setErrorMessage(
          msg.includes('Invalid login credentials')
            ? 'Invalid email or password.'
            : msg.includes('Email not confirmed')
            ? 'Please confirm your email.'
            : msg.includes('Too many requests')
            ? 'Too many login attempts. Try later.'
            : 'Login failed.'
        );
        return;
      }

      // 2) whitelist check
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id,email')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (adminError) {
        console.error(adminError);
        setErrorMessage('Server error. Try again.');
        return;
      }
      if (!adminData) {
        rateLimiter.recordAttempt(cleanEmail);
        setErrorMessage('You are not an authorized admin.');
        return;
      }

      // success
      // signInData.user exists -> useEffect redirect or fall through
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  // — 1) still loading? show loader —
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  // — 2) already signed in? redirect away —
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  // — 3) show login form —
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white mb-6">
            <Lock className="h-6 w-6 text-white dark:text-gray-900" />
          </div>
          <h2 className="text-3xl font-light text-gray-900 dark:text-white">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300 mr-2" />
                  <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md shadow-sm ${
                    errors.email
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 dark:text-white`}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-md shadow-sm ${
                    errors.password
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900 dark:text-white`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
