// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ───────────────
    // For Supabase JS v2+ (uses getSession()):
    // ───────────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // ───────────────
    // If instead you’re on Supabase JS v1, comment out the above block
    // and use this block instead:
    // ───────────────
    /*
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);
    */

    // ───────────────
    // Subscribe to auth state changes (both v1 & v2)
    // ───────────────
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
