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

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('ProtectedRoute: Checking admin status', { user, authLoading });
      
      if (authLoading) {
        console.log('ProtectedRoute: Still loading auth...');
        return;
      }

      if (!user) {
        console.log('ProtectedRoute: No user, redirecting to login');
        navigate('/admin-login');
        return;
      }

      try {
        console.log('ProtectedRoute: Checking if user is admin:', user.email);
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error('ProtectedRoute: Admin check error:', error);
          if (error.code === 'PGRST116') {
            // No rows returned - user is not an admin
            console.log('ProtectedRoute: User not found in admins table');
            setIsAdmin(false);
            await supabase.auth.signOut();
            navigate('/');
            return;
          }
          throw error;
        }

        if (!data) {
          console.log('ProtectedRoute: No admin data found');
          setIsAdmin(false);
          await supabase.auth.signOut();
          navigate('/');
          return;
        }

        console.log('ProtectedRoute: User is admin, allowing access');
        setIsAdmin(true);
      } catch (error) {
        console.error('ProtectedRoute: Error checking admin status:', error);
        setIsAdmin(false);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Verifying access...</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Auth loading: {authLoading ? 'true' : 'false'}, 
            Admin check loading: {loading ? 'true' : 'false'}
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;