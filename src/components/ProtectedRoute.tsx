import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('Checking admin status...', { user, authLoading });
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/admin-login');
        return;
      }

      try {
        console.log('Checking if user is admin:', user.email);
        
        const { data, error } = await supabase
          .from('admins')
          .select('id, email')
          .eq('email', user.email)
          .maybeSingle();

        console.log('Admin check result:', { data, error });

        if (error) {
          console.error('Database error:', error);
          setError('Database connection error');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (!data) {
          console.log('User not found in admins table');
          setIsAdmin(false);
          await supabase.auth.signOut();
          navigate('/admin-login');
          return;
        }

        console.log('User is admin, granting access');
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check error:', error);
        setError('Failed to verify admin status');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Verifying admin access...</p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => navigate('/admin-login')}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Go to login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h2 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Access Error</h2>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/admin-login')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not admin, don't render anything (redirect should have happened)
  if (!isAdmin) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;