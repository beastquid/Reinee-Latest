import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Collection {
  id: string;
  name: string;
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('name');

      if (collectionsError) throw collectionsError;

      setCollections(data || []);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return { collections, loading, error, refetch: fetchCollections };
}