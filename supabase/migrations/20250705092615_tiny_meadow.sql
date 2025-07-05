/*
  # Update Database Schema for E-commerce Shop

  1. Schema Updates
    - Add missing columns to products table (colors, category, shopee_link)
    - Add missing columns to hero table (created_at)
    - Create product_colors table for normalized color storage
    - Update RLS policies for public read access

  2. Data Migration
    - Insert existing static data into database tables
    - Populate collections, products, and hero data

  3. Security
    - Enable public read access for all shop data
    - Maintain admin-only write access
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

-- Create product_colors table for normalized color storage
CREATE TABLE IF NOT EXISTS product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
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
ON CONFLICT DO NOTHING;

-- Insert hero data
INSERT INTO hero (title, subtitle, background_image_url) VALUES
  ('REINEE OFFICIAL', 'Elegant footwear for the modern woman', '/Luna-Hero-image.jpg')
ON CONFLICT DO NOTHING;

-- Insert products data with collections reference
DO $$
DECLARE
  heels_id uuid;
  mary_jane_id uuid;
  sandals_id uuid;
  platform_id uuid;
  product_id uuid;
BEGIN
  -- Get collection IDs
  SELECT id INTO heels_id FROM collections WHERE name = 'Heels';
  SELECT id INTO mary_jane_id FROM collections WHERE name = 'Mary Jane Flat Shoes';
  SELECT id INTO sandals_id FROM collections WHERE name = 'Flat Sandals';
  SELECT id INTO platform_id FROM collections WHERE name = 'Platform Dad Sandals';

  -- Insert Heels products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Alma', 'Rp269.000', 'Heels', heels_id, '/collections/products/heels/alma.jpg', 'https://id.shp.ee/yiVtA2z'),
    ('Kate', 'Rp399.000', 'Heels', heels_id, '/collections/products/heels/kate.jpg', 'https://id.shp.ee/2jMMo7v'),
    ('Victoria', 'Rp299.000', 'Heels', heels_id, '/collections/products/heels/victoria.jpg', 'https://id.shp.ee/TuCsXq8'),
    ('Edith', 'Rp259.000', 'Heels', heels_id, '/collections/products/heels/edith.jpg', 'https://id.shp.ee/ZXGYCKx'),
    ('Emma', 'Rp259.000', 'Heels', heels_id, '/collections/products/heels/emma.jpg', 'https://id.shp.ee/HKfKxuU'),
    ('Tiffany', 'Rp269.000', 'Heels', heels_id, '/collections/products/heels/tiffany.jpg', 'https://id.shp.ee/GdATXLA'),
    ('Regina', 'Rp259.000', 'Heels', heels_id, '/collections/products/heels/regina.jpg', 'https://id.shp.ee/KCjkZAD'),
    ('Sophia', 'Rp259.000', 'Heels', heels_id, '/collections/products/heels/sophia.jpg', 'https://id.shp.ee/dyzZhZv'),
    ('Luna Clear Wedges', 'Rp399.000', 'Heels', heels_id, '/collections/products/heels/Luna-Clear-Wedges.jpg', 'https://id.shp.ee/KKkvXh6')
  ON CONFLICT DO NOTHING;

  -- Insert Mary Jane products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Moulin', 'Rp259.000', 'Mary Jane Flat Shoes', mary_jane_id, '/collections/products/mary-jane/moulin.jpg', 'https://id.shp.ee/HfteHTh'),
    ('Poppy', 'Rp249.000', 'Mary Jane Flat Shoes', mary_jane_id, '/collections/products/mary-jane/poppy.jpg', 'https://id.shp.ee/SAKjVua'),
    ('Greta', 'Rp249.000', 'Mary Jane Flat Shoes', mary_jane_id, '/collections/products/mary-jane/greta.jpg', 'https://id.shp.ee/3a3JLQP'),
    ('Coco', 'Rp259.000', 'Mary Jane Flat Shoes', mary_jane_id, '/collections/products/mary-jane/coco.jpg', 'https://id.shp.ee/degW7Ei'),
    ('Charlotte', 'Rp249.000', 'Mary Jane Flat Shoes', mary_jane_id, '/collections/products/mary-jane/charlotte.jpg', 'https://id.shp.ee/JStfaya'),
    ('Solene', 'Rp259.000', 'Mary Jane Flat Shoes', mary_jane_id, '/collections/products/mary-jane/Solene.jpg', 'https://id.shp.ee/Njvc157')
  ON CONFLICT DO NOTHING;

  -- Insert Sandals products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Colette', 'Rp219.000', 'Flat Sandals', sandals_id, '/collections/products/sandals/colette.jpg', 'https://id.shp.ee/NFZCyYv'),
    ('Rhea', 'Rp199.000', 'Flat Sandals', sandals_id, '/collections/products/sandals/rhea.jpg', 'https://id.shp.ee/cgeqhxm'),
    ('Rosette', 'Rp219.000', 'Flat Sandals', sandals_id, '/collections/products/sandals/rosette.jpg', 'https://id.shp.ee/b9fPykr'),
    ('Alice Bow', 'Rp219.000', 'Flat Sandals', sandals_id, '/collections/products/sandals/alice-bow.jpg', 'https://id.shp.ee/kY1gwAL'),
    ('Isla', 'Rp219.000', 'Flat Sandals', sandals_id, '/collections/products/sandals/Isla.jpg', 'https://id.shp.ee/P995Fqd')
  ON CONFLICT DO NOTHING;

  -- Insert Platform products
  INSERT INTO products (name, price, category, collections_id, image_url, shopee_link) VALUES
    ('Rue', 'Rp215.000', 'Platform Dad Sandals', platform_id, '/collections/products/platform/rue.jpg', 'https://id.shp.ee/5JQGTbP')
  ON CONFLICT DO NOTHING;

  -- Insert product colors
  -- Alma colors
  SELECT id INTO product_id FROM products WHERE name = 'Alma';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Nude'), (product_id, 'White'), (product_id, 'Black'), (product_id, 'Denim');

  -- Kate colors
  SELECT id INTO product_id FROM products WHERE name = 'Kate';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Nude'), (product_id, 'White');

  -- Victoria colors
  SELECT id INTO product_id FROM products WHERE name = 'Victoria';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Black'), (product_id, 'Gold');

  -- Edith colors
  SELECT id INTO product_id FROM products WHERE name = 'Edith';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Black'), (product_id, 'Cream');

  -- Emma colors
  SELECT id INTO product_id FROM products WHERE name = 'Emma';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Black'), (product_id, 'White');

  -- Tiffany colors
  SELECT id INTO product_id FROM products WHERE name = 'Tiffany';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Black'), (product_id, 'White'), (product_id, 'Gold');

  -- Regina colors
  SELECT id INTO product_id FROM products WHERE name = 'Regina';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Silver'), (product_id, 'Black'), (product_id, 'White');

  -- Sophia colors
  SELECT id INTO product_id FROM products WHERE name = 'Sophia';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'White'), (product_id, 'Silver Chrome'), (product_id, 'Maroon'), (product_id, 'Nude');

  -- Luna Clear Wedges colors
  SELECT id INTO product_id FROM products WHERE name = 'Luna Clear Wedges';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Red Wine'), (product_id, 'Nude'), (product_id, 'Silver'), (product_id, 'White');

  -- Moulin colors
  SELECT id INTO product_id FROM products WHERE name = 'Moulin';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Red Wine'), (product_id, 'Cherry Red'), (product_id, 'Black'), (product_id, 'Broken White'), (product_id, 'Silver Chrome');

  -- Poppy colors
  SELECT id INTO product_id FROM products WHERE name = 'Poppy';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Cherry Red'), (product_id, 'Black'), (product_id, 'Silver Chrome'), (product_id, 'Off White');

  -- Greta colors
  SELECT id INTO product_id FROM products WHERE name = 'Greta';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Cherry Red'), (product_id, 'Black'), (product_id, 'Broken White');

  -- Coco colors
  SELECT id INTO product_id FROM products WHERE name = 'Coco';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Cherry Red'), (product_id, 'Black'), (product_id, 'Oat'), (product_id, 'Milk');

  -- Charlotte colors
  SELECT id INTO product_id FROM products WHERE name = 'Charlotte';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Red Wine'), (product_id, 'Black'), (product_id, 'Silver Chrome'), (product_id, 'Oat');

  -- Solene colors
  SELECT id INTO product_id FROM products WHERE name = 'Solene';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Red Wine'), (product_id, 'Black'), (product_id, 'Silver'), (product_id, 'Milk'), (product_id, 'Taupe'), (product_id, 'Oat');

  -- Colette colors
  SELECT id INTO product_id FROM products WHERE name = 'Colette';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'White'), (product_id, 'Denim'), (product_id, 'Taupe');

  -- Rhea colors
  SELECT id INTO product_id FROM products WHERE name = 'Rhea';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'Tan'), (product_id, 'Oat'), (product_id, 'White');

  -- Rosette colors
  SELECT id INTO product_id FROM products WHERE name = 'Rosette';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'Taupe'), (product_id, 'Cream'), (product_id, 'Dusty Pink');

  -- Alice Bow colors
  SELECT id INTO product_id FROM products WHERE name = 'Alice Bow';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'Silver'), (product_id, 'White'), (product_id, 'Pink Pastel');

  -- Isla colors
  SELECT id INTO product_id FROM products WHERE name = 'Isla';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'White'), (product_id, 'Tan');

  -- Rue colors
  SELECT id INTO product_id FROM products WHERE name = 'Rue';
  INSERT INTO product_colors (product_id, color) VALUES
    (product_id, 'Black'), (product_id, 'White'), (product_id, 'Silver'), (product_id, 'Tan'), (product_id, 'Oat');

END $$;