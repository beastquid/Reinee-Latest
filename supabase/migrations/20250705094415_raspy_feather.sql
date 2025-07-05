/*
  # Database Migration: Convert Static Data to Supabase

  1. Schema Updates
    - Add missing columns to products table
    - Convert price column from numeric to text
    - Add unique constraints for conflict handling

  2. New Tables
    - `product_colors` table for normalized color storage

  3. Security
    - Enable RLS on all tables
    - Public read policies for browsing
    - Admin-only write policies for management

  4. Data Migration
    - Insert collections, hero, products, and colors
    - Proper relationship handling between products and collections
*/

-- Add missing columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category'
  ) THEN
    ALTER TABLE products ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'shopee_link'
  ) THEN
    ALTER TABLE products ADD COLUMN shopee_link text;
  END IF;
END $$;

-- Safely convert price column from numeric to text
DO $$
BEGIN
  -- Check if price column is numeric type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' 
    AND column_name = 'price' 
    AND data_type = 'numeric'
  ) THEN
    -- Add temporary text column
    ALTER TABLE products ADD COLUMN price_temp text;
    
    -- Convert existing numeric values to text with Rp prefix
    UPDATE products SET price_temp = 'Rp' || price::text WHERE price IS NOT NULL;
    
    -- Drop the old numeric column
    ALTER TABLE products DROP COLUMN price;
    
    -- Rename the temporary column to price
    ALTER TABLE products RENAME COLUMN price_temp TO price;
  END IF;
END $$;

-- Add unique constraint to products name if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'products' 
    AND constraint_name = 'products_name_key'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_name_key UNIQUE (name);
  END IF;
END $$;

-- Add unique constraint to collections name if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'collections' 
    AND constraint_name = 'collections_name_key'
  ) THEN
    ALTER TABLE collections ADD CONSTRAINT collections_name_key UNIQUE (name);
  END IF;
END $$;

-- Create product_colors table for normalized color storage
CREATE TABLE IF NOT EXISTS product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, color)
);

-- Add created_at to hero table if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE hero ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Enable RLS on product_colors
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "products_select_auth" ON products;
DROP POLICY IF EXISTS "collections_select_auth" ON collections;
DROP POLICY IF EXISTS "hero_select_auth" ON hero;
DROP POLICY IF EXISTS "products_modify_auth" ON products;
DROP POLICY IF EXISTS "collections_modify_auth" ON collections;
DROP POLICY IF EXISTS "hero_modify_auth" ON hero;

-- Create public read policies (no authentication required)
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "collections_public_read" ON collections FOR SELECT USING (true);
CREATE POLICY "hero_public_read" ON hero FOR SELECT USING (true);
CREATE POLICY "product_colors_public_read" ON product_colors FOR SELECT USING (true);

-- Create admin-only write policies
CREATE POLICY "products_admin_write" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "collections_admin_write" ON collections FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "hero_admin_write" ON hero FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE email = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "product_colors_admin_write" ON product_colors FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    WHERE email = auth.jwt() ->> 'email'
  )
);

-- Insert collections data
INSERT INTO collections (name) VALUES
  ('Heels'),
  ('Mary Jane Flat Shoes'),
  ('Flat Sandals'),
  ('Platform Dad Sandals')
ON CONFLICT (name) DO NOTHING;

-- Insert hero data (no unique constraint, so we'll check manually)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM hero WHERE title = 'REINEE OFFICIAL') THEN
    INSERT INTO hero (title, subtitle, background_image_url) VALUES
      ('REINEE OFFICIAL', 'Elegant footwear for the modern woman', '/Luna-Hero-image.jpg');
  END IF;
END $$;

-- Insert products data with collections reference
DO $$
DECLARE
  heels_collection_id uuid;
  mary_jane_collection_id uuid;
  sandals_collection_id uuid;
  platform_collection_id uuid;
  current_product_id uuid;
BEGIN
  -- Get collection IDs
  SELECT id INTO heels_collection_id FROM collections WHERE name = 'Heels';
  SELECT id INTO mary_jane_collection_id FROM collections WHERE name = 'Mary Jane Flat Shoes';
  SELECT id INTO sandals_collection_id FROM collections WHERE name = 'Flat Sandals';
  SELECT id INTO platform_collection_id FROM collections WHERE name = 'Platform Dad Sandals';

  -- Insert Heels products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Alma', 'Rp269.000', 'Heels', heels_collection_id, '/collections/products/heels/alma.jpg', 'https://id.shp.ee/yiVtA2z'),
    ('Kate', 'Rp399.000', 'Heels', heels_collection_id, '/collections/products/heels/kate.jpg', 'https://id.shp.ee/2jMMo7v'),
    ('Victoria', 'Rp299.000', 'Heels', heels_collection_id, '/collections/products/heels/victoria.jpg', 'https://id.shp.ee/TuCsXq8'),
    ('Edith', 'Rp259.000', 'Heels', heels_collection_id, '/collections/products/heels/edith.jpg', 'https://id.shp.ee/ZXGYCKx'),
    ('Emma', 'Rp259.000', 'Heels', heels_collection_id, '/collections/products/heels/emma.jpg', 'https://id.shp.ee/HKfKxuU'),
    ('Tiffany', 'Rp269.000', 'Heels', heels_collection_id, '/collections/products/heels/tiffany.jpg', 'https://id.shp.ee/GdATXLA'),
    ('Regina', 'Rp259.000', 'Heels', heels_collection_id, '/collections/products/heels/regina.jpg', 'https://id.shp.ee/KCjkZAD'),
    ('Sophia', 'Rp259.000', 'Heels', heels_collection_id, '/collections/products/heels/sophia.jpg', 'https://id.shp.ee/dyzZhZv'),
    ('Luna Clear Wedges', 'Rp399.000', 'Heels', heels_collection_id, '/collections/products/heels/Luna-Clear-Wedges.jpg', 'https://id.shp.ee/KKkvXh6')
  ON CONFLICT (name) DO NOTHING;

  -- Insert Mary Jane products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Moulin', 'Rp259.000', 'Mary Jane Flat Shoes', mary_jane_collection_id, '/collections/products/mary-jane/moulin.jpg', 'https://id.shp.ee/HfteHTh'),
    ('Poppy', 'Rp249.000', 'Mary Jane Flat Shoes', mary_jane_collection_id, '/collections/products/mary-jane/poppy.jpg', 'https://id.shp.ee/SAKjVua'),
    ('Greta', 'Rp249.000', 'Mary Jane Flat Shoes', mary_jane_collection_id, '/collections/products/mary-jane/greta.jpg', 'https://id.shp.ee/3a3JLQP'),
    ('Coco', 'Rp259.000', 'Mary Jane Flat Shoes', mary_jane_collection_id, '/collections/products/mary-jane/coco.jpg', 'https://id.shp.ee/degW7Ei'),
    ('Charlotte', 'Rp249.000', 'Mary Jane Flat Shoes', mary_jane_collection_id, '/collections/products/mary-jane/charlotte.jpg', 'https://id.shp.ee/JStfaya'),
    ('Solene', 'Rp259.000', 'Mary Jane Flat Shoes', mary_jane_collection_id, '/collections/products/mary-jane/Solene.jpg', 'https://id.shp.ee/Njvc157')
  ON CONFLICT (name) DO NOTHING;

  -- Insert Sandals products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Colette', 'Rp219.000', 'Flat Sandals', sandals_collection_id, '/collections/products/sandals/colette.jpg', 'https://id.shp.ee/NFZCyYv'),
    ('Rhea', 'Rp199.000', 'Flat Sandals', sandals_collection_id, '/collections/products/sandals/rhea.jpg', 'https://id.shp.ee/cgeqhxm'),
    ('Rosette', 'Rp219.000', 'Flat Sandals', sandals_collection_id, '/collections/products/sandals/rosette.jpg', 'https://id.shp.ee/b9fPykr'),
    ('Alice Bow', 'Rp219.000', 'Flat Sandals', sandals_collection_id, '/collections/products/sandals/alice-bow.jpg', 'https://id.shp.ee/kY1gwAL'),
    ('Isla', 'Rp219.000', 'Flat Sandals', sandals_collection_id, '/collections/products/sandals/Isla.jpg', 'https://id.shp.ee/P995Fqd')
  ON CONFLICT (name) DO NOTHING;

  -- Insert Platform products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Rue', 'Rp215.000', 'Platform Dad Sandals', platform_collection_id, '/collections/products/platform/rue.jpg', 'https://id.shp.ee/5JQGTbP')
  ON CONFLICT (name) DO NOTHING;

  -- Insert product colors with proper conflict handling
  -- Alma colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Alma';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Nude'), (current_product_id, 'White'), (current_product_id, 'Black'), (current_product_id, 'Denim')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Kate colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Kate';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Nude'), (current_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Victoria colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Victoria';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Black'), (current_product_id, 'Gold')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Edith colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Edith';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Black'), (current_product_id, 'Cream')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Emma colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Emma';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Black'), (current_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Tiffany colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Tiffany';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Black'), (current_product_id, 'White'), (current_product_id, 'Gold')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Regina colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Regina';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Silver'), (current_product_id, 'Black'), (current_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Sophia colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Sophia';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'White'), (current_product_id, 'Silver Chrome'), (current_product_id, 'Maroon'), (current_product_id, 'Nude')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Luna Clear Wedges colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Luna Clear Wedges';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Red Wine'), (current_product_id, 'Nude'), (current_product_id, 'Silver'), (current_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Moulin colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Moulin';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Red Wine'), (current_product_id, 'Cherry Red'), (current_product_id, 'Black'), (current_product_id, 'Broken White'), (current_product_id, 'Silver Chrome')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Poppy colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Poppy';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Cherry Red'), (current_product_id, 'Black'), (current_product_id, 'Silver Chrome'), (current_product_id, 'Off White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Greta colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Greta';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Cherry Red'), (current_product_id, 'Black'), (current_product_id, 'Broken White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Coco colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Coco';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Cherry Red'), (current_product_id, 'Black'), (current_product_id, 'Oat'), (current_product_id, 'Milk')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Charlotte colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Charlotte';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Red Wine'), (current_product_id, 'Black'), (current_product_id, 'Silver Chrome'), (current_product_id, 'Oat')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Solene colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Solene';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Red Wine'), (current_product_id, 'Black'), (current_product_id, 'Silver'), (current_product_id, 'Milk'), (current_product_id, 'Taupe'), (current_product_id, 'Oat')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Colette colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Colette';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'White'), (current_product_id, 'Denim'), (current_product_id, 'Taupe')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Rhea colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Rhea';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'Tan'), (current_product_id, 'Oat'), (current_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Rosette colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Rosette';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'Taupe'), (current_product_id, 'Cream'), (current_product_id, 'Dusty Pink')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Alice Bow colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Alice Bow';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'Silver'), (current_product_id, 'White'), (current_product_id, 'Pink Pastel')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Isla colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Isla';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'White'), (current_product_id, 'Tan')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

  -- Rue colors
  SELECT id INTO current_product_id FROM products WHERE name = 'Rue';
  IF current_product_id IS NOT NULL THEN
    INSERT INTO product_colors (product_id, color) VALUES
      (current_product_id, 'Black'), (current_product_id, 'White'), (current_product_id, 'Silver'), (current_product_id, 'Tan'), (current_product_id, 'Oat')
    ON CONFLICT (product_id, color) DO NOTHING;
  END IF;

END $$;