import React from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ...session & admin check logic...
  return <>{children}</>;
};

export default ProtectedRoute;