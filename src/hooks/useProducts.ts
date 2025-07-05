import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  availability: string;
  image_url: string;
  shopee_link?: string;
  collections_id?: string;
  colors: string[];
  collection?: {
    name: string;
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with collections and colors
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          collections:collections_id (
            name
          ),
          product_colors (
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Transform data to match expected format
      const transformedProducts: Product[] = (productsData || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category || '',
        availability: product.availability,
        image_url: product.image_url || '',
        shopee_link: product.shopee_link,
        collections_id: product.collections_id,
        colors: product.product_colors?.map((pc: any) => pc.color) || [],
        collection: product.collections
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}