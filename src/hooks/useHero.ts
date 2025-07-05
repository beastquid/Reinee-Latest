import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface HeroData {
  id: string;
  title: string;
  subtitle?: string;
  background_image_url?: string;
}

export function useHero() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHero = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: heroError } = await supabase
        .from('hero')
        .select('*')
        .limit(1)
        .single();

      if (heroError && heroError.code !== 'PGRST116') {
        throw heroError;
      }

      setHero(data || null);
    } catch (err) {
      console.error('Error fetching hero:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch hero data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  return { hero, loading, error, refetch: fetchHero };
}