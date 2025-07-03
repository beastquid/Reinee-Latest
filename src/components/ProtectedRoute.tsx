// src/components/ProtectedRoute.tsx

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Status = 'loading' | 'authorized' | 'unauthorized' | 'error';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    // 1) Fetch current session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        if (!session) {
          // no user → redirect to login
          setStatus('unauthorized');
          return;
        }

        // 2) User is signed in → check admins whitelist
        const email = session.user.email!;
        supabase
          .from('admins')
          .select('id')
          .eq('email', email)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!mounted) return;
            if (error) {
              console.error('Admin lookup error', error);
              setErrorMsg('Server error verifying admin. Please retry.');
              setStatus('error');
            } else if (!data) {
              // user not in admins table
              setStatus('unauthorized');
            } else {
              // OK!
              setStatus('authorized');
            }
          });
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Session fetch error', err);
        setErrorMsg('Network error checking session. Please retry.');
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, []);

  // 3) Render based on status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Verifying access…</p>
      </div>
    );
  }
  if (status === 'unauthorized') {
    // not signed in or not an admin
    return <Navigate to="/admin-login" replace />;
  }
  if (status === 'error') {
    // show error + retry/login buttons
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <p className="mb-4 text-red-600 dark:text-red-300">{errorMsg}</p>
        <div className="space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Retry
          </button>
          <button
            onClick={() => (window.location.href = '/admin-login')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  // authorized!
  return <>{children}</>;
};

export default ProtectedRoute;
