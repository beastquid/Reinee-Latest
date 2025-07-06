/*
  # Add Products with Colors

  1. New Tables
    - Products are inserted with their details
    - Product colors are added for each product
    - Collections are referenced properly

  2. Security
    - All tables already have RLS enabled
    - Policies are already in place

  3. Data
    - Adds all Reinee products with their color variants
    - Links products to appropriate collections
*/

DO $$
DECLARE
  heels_collection_id uuid;
  mary_jane_collection_id uuid;
  sandals_collection_id uuid;
  platform_collection_id uuid;
  new_product_id uuid;
BEGIN
  -- Get collection IDs
  SELECT id INTO heels_collection_id FROM collections WHERE name = 'Heels';
  SELECT id INTO mary_jane_collection_id FROM collections WHERE name = 'Mary Jane Flat Shoes';
  SELECT id INTO sandals_collection_id FROM collections WHERE name = 'Flat Sandals';
  SELECT id INTO platform_collection_id FROM collections WHERE name = 'Platform Dad Sandals';

  -- Insert Alma (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Alma', 'Rp 89.000', 'Heels', '/collections/products/heels/alma.jpg', 'https://shopee.co.id/ALMA-Sepatu-Heels-Wanita-3cm-i.1208922233.26588934086', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Nude'),
    (new_product_id, 'White'),
    (new_product_id, 'Black'),
    (new_product_id, 'Denim')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Kate (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Kate', 'Rp 89.000', 'Heels', '/collections/products/heels/kate.jpg', 'https://shopee.co.id/KATE-Sepatu-Heels-Wanita-3cm-i.1208922233.26088934159', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Nude'),
    (new_product_id, 'White')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Victoria (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Victoria', 'Rp 89.000', 'Heels', '/collections/products/heels/victoria.jpg', 'https://shopee.co.id/VICTORIA-Sepatu-Heels-Wanita-3cm-i.1208922233.26288934125', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Gold'),
    (new_product_id, 'Silver'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Edith (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Edith', 'Rp 89.000', 'Heels', '/collections/products/heels/edith.jpg', 'https://shopee.co.id/EDITH-Sepatu-Heels-Wanita-3cm-i.1208922233.26388934092', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Cream'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Emma (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Emma', 'Rp 89.000', 'Heels', '/collections/products/heels/emma.jpg', 'https://shopee.co.id/EMMA-Sepatu-Heels-Wanita-3cm-i.1208922233.26488934098', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Tiffany (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Tiffany', 'Rp 89.000', 'Heels', '/collections/products/heels/tiffany.jpg', 'https://shopee.co.id/TIFFANY-Sepatu-Heels-Wanita-3cm-i.1208922233.26688934104', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Gold'),
    (new_product_id, 'Silver'),
    (new_product_id, 'White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Regina (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Regina', 'Rp 89.000', 'Heels', '/collections/products/heels/regina.jpg', 'https://shopee.co.id/REGINA-Sepatu-Heels-Wanita-3cm-i.1208922233.26788934110', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Sophia (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Sophia', 'Rp 89.000', 'Heels', '/collections/products/heels/sophia.jpg', 'https://shopee.co.id/SOPHIA-Sepatu-Heels-Wanita-3cm-i.1208922233.26888934116', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver Chrome'),
    (new_product_id, 'Maroon'),
    (new_product_id, 'White'),
    (new_product_id, 'Black'),
    (new_product_id, 'Nude')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Luna Clear Wedges (Heels)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Luna Clear Wedges', 'Rp 99.000', 'Heels', '/collections/products/heels/Luna-Clear-Wedges.jpg', 'https://shopee.co.id/LUNA-CLEAR-WEDGES-Sepatu-Heels-Wanita-5cm-i.1208922233.27088934122', heels_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Red Wine'),
    (new_product_id, 'White'),
    (new_product_id, 'Nude')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Moulin (Mary Jane)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Moulin', 'Rp 89.000', 'Mary Jane Flat Shoes', '/collections/products/mary-jane/moulin.jpg', 'https://shopee.co.id/MOULIN-Sepatu-Flat-Mary-Jane-Wanita-i.1208922233.27188934128', mary_jane_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver Chrome'),
    (new_product_id, 'Cherry Red'),
    (new_product_id, 'Red Wine'),
    (new_product_id, 'Broken White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Poppy (Mary Jane)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Poppy', 'Rp 89.000', 'Mary Jane Flat Shoes', '/collections/products/mary-jane/poppy.jpg', 'https://shopee.co.id/POPPY-Sepatu-Flat-Mary-Jane-Wanita-i.1208922233.27288934134', mary_jane_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver Chrome'),
    (new_product_id, 'Cherry Red'),
    (new_product_id, 'Off White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Greta (Mary Jane)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Greta', 'Rp 89.000', 'Mary Jane Flat Shoes', '/collections/products/mary-jane/greta.jpg', 'https://shopee.co.id/GRETA-Sepatu-Flat-Mary-Jane-Wanita-i.1208922233.27388934140', mary_jane_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Cherry Red'),
    (new_product_id, 'Broken White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Coco (Mary Jane)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Coco', 'Rp 89.000', 'Mary Jane Flat Shoes', '/collections/products/mary-jane/coco.jpg', 'https://shopee.co.id/COCO-Sepatu-Flat-Mary-Jane-Wanita-i.1208922233.27488934146', mary_jane_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Cherry Red'),
    (new_product_id, 'Milk'),
    (new_product_id, 'Oat'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Charlotte (Mary Jane)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Charlotte', 'Rp 89.000', 'Mary Jane Flat Shoes', '/collections/products/mary-jane/charlotte.jpg', 'https://shopee.co.id/CHARLOTTE-Sepatu-Flat-Mary-Jane-Wanita-i.1208922233.27588934152', mary_jane_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver Chrome'),
    (new_product_id, 'Red Wine'),
    (new_product_id, 'Oat'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Solene (Mary Jane)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Solene', 'Rp 89.000', 'Mary Jane Flat Shoes', '/collections/products/mary-jane/Solene.jpg', 'https://shopee.co.id/SOLENE-Sepatu-Flat-Mary-Jane-Wanita-i.1208922233.27688934158', mary_jane_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Red Wine'),
    (new_product_id, 'Taupe'),
    (new_product_id, 'Oat'),
    (new_product_id, 'Milk'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Colette (Sandals)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Colette', 'Rp 89.000', 'Flat Sandals', '/collections/products/sandals/colette.jpg', 'https://shopee.co.id/COLETTE-Sandal-Flat-Wanita-i.1208922233.27788934164', sandals_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Taupe'),
    (new_product_id, 'White'),
    (new_product_id, 'Denim'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Rhea (Sandals)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Rhea', 'Rp 89.000', 'Flat Sandals', '/collections/products/sandals/rhea.jpg', 'https://shopee.co.id/RHEA-Sandal-Flat-Wanita-i.1208922233.27888934170', sandals_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Tan'),
    (new_product_id, 'White'),
    (new_product_id, 'Oat'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Rosette (Sandals)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Rosette', 'Rp 89.000', 'Flat Sandals', '/collections/products/sandals/rosette.jpg', 'https://shopee.co.id/ROSETTE-Sandal-Flat-Wanita-i.1208922233.27988934176', sandals_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Dusty Pink'),
    (new_product_id, 'Taupe'),
    (new_product_id, 'Cream'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Alice Bow (Sandals)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Alice Bow', 'Rp 89.000', 'Flat Sandals', '/collections/products/sandals/alice-bow.jpg', 'https://shopee.co.id/ALICE-BOW-Sandal-Flat-Wanita-i.1208922233.28088934182', sandals_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Pink Pastel'),
    (new_product_id, 'White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Isla (Sandals)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Isla', 'Rp 89.000', 'Flat Sandals', '/collections/products/sandals/Isla.jpg', 'https://shopee.co.id/ISLA-Sandal-Flat-Wanita-i.1208922233.28188934188', sandals_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Tan'),
    (new_product_id, 'White'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

  -- Insert Rue (Platform)
  INSERT INTO products (name, price, category, image_url, shopee_link, collections_id)
  VALUES ('Rue', 'Rp 99.000', 'Platform Dad Sandals', '/collections/products/platform/rue.jpg', 'https://shopee.co.id/RUE-Platform-Dad-Sandal-Wanita-i.1208922233.28288934194', platform_collection_id)
  RETURNING id INTO new_product_id;

  INSERT INTO product_colors (product_id, color) VALUES
    (new_product_id, 'Silver'),
    (new_product_id, 'Tan'),
    (new_product_id, 'White'),
    (new_product_id, 'Oat'),
    (new_product_id, 'Black')
  ON CONFLICT (product_id, color) DO NOTHING;

END $$;