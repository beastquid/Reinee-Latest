-- ███████████████████████████████████████████
-- 1. STRUCTURE CHANGES
-- ███████████████████████████████████████████

-- Add missing columns to products table
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS category text,
    ADD COLUMN IF NOT EXISTS shopee_link text;

-- Add created_at to hero table
ALTER TABLE hero
    ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Create product_colors table for normalized color data
CREATE TABLE IF NOT EXISTS product_colors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    color text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (product_id, color)
);

-- ███████████████████████████████████████████
-- 2. RLS POLICIES - DROP THEN CREATE
-- ███████████████████████████████████████████

-- Products policies
DROP POLICY IF EXISTS products_public_read ON products;
CREATE POLICY products_public_read
    ON products
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS products_admin_write ON products;
CREATE POLICY products_admin_write
    ON products
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM admins 
        WHERE admins.email = (jwt() ->> 'email'::text)
    ));

-- Collections policies
DROP POLICY IF EXISTS collections_public_read ON collections;
CREATE POLICY collections_public_read
    ON collections
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS collections_admin_write ON collections;
CREATE POLICY collections_admin_write
    ON collections
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM admins 
        WHERE admins.email = (jwt() ->> 'email'::text)
    ));

-- Hero policies
DROP POLICY IF EXISTS hero_public_read ON hero;
CREATE POLICY hero_public_read
    ON hero
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS hero_admin_write ON hero;
CREATE POLICY hero_admin_write
    ON hero
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM admins 
        WHERE admins.email = (jwt() ->> 'email'::text)
    ));

-- Product colors policies
DROP POLICY IF EXISTS product_colors_public_read ON product_colors;
CREATE POLICY product_colors_public_read
    ON product_colors
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS product_colors_admin_write ON product_colors;
CREATE POLICY product_colors_admin_write
    ON product_colors
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM admins 
        WHERE admins.email = (jwt() ->> 'email'::text)
    ));

-- ███████████████████████████████████████████
-- 3. DATA POPULATION
-- ███████████████████████████████████████████

-- Collections data
INSERT INTO collections (name) VALUES 
    ('Heels'),
    ('Mary Jane Flat Shoes'),
    ('Flat Sandals'),
    ('Platform Dad Sandals')
ON CONFLICT (name) DO NOTHING;

-- Products and colors data
DO $$
DECLARE
    heels_id uuid;
    mary_jane_id uuid;
    sandals_id uuid;
    platform_id uuid;
    new_product_id uuid;  -- RENAMED to avoid column ambiguity
BEGIN
    -- Get collection IDs
    SELECT id INTO heels_id FROM collections WHERE name = 'Heels';
    SELECT id INTO mary_jane_id FROM collections WHERE name = 'Mary Jane Flat Shoes';
    SELECT id INTO sandals_id FROM collections WHERE name = 'Flat Sandals';
    SELECT id INTO platform_id FROM collections WHERE name = 'Platform Dad Sandals';

    -- HEELS COLLECTION
    
    -- Alma
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Alma', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/alma', '/collections/products/heels/alma.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Silver'), (new_product_id, 'Nude'), (new_product_id, 'White'), (new_product_id, 'Black'), (new_product_id, 'Denim')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Kate
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Kate', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/kate', '/collections/products/heels/kate.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Silver'), (new_product_id, 'Nude'), (new_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Victoria
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Victoria', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/victoria', '/collections/products/heels/victoria.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Gold'), (new_product_id, 'Black'), (new_product_id, 'Silver')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Edith
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Edith', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/edith', '/collections/products/heels/edith.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'Cream'), (new_product_id, 'Silver')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Emma
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Emma', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/emma', '/collections/products/heels/emma.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'White'), (new_product_id, 'Silver')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Tiffany
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Tiffany', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/tiffany', '/collections/products/heels/tiffany.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Gold'), (new_product_id, 'Black'), (new_product_id, 'White'), (new_product_id, 'Silver')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Regina
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Regina', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/regina', '/collections/products/heels/regina.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'White'), (new_product_id, 'Silver')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Sophia
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Sophia', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/sophia', '/collections/products/heels/sophia.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Nude'), (new_product_id, 'Black'), (new_product_id, 'White'), (new_product_id, 'Maroon'), (new_product_id, 'Silver Chrome')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Luna Clear Wedges
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Luna Clear Wedges', 'Rp 89.900', 'Heels', 'https://shopee.co.id/product/1234567890/luna', '/collections/products/heels/Luna-Clear-Wedges.jpg', heels_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Nude'), (new_product_id, 'White'), (new_product_id, 'Silver'), (new_product_id, 'Red Wine')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- MARY JANE COLLECTION
    
    -- Moulin
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Moulin', 'Rp 64.900', 'Mary Jane Flat Shoes', 'https://shopee.co.id/product/1234567890/moulin', '/collections/products/mary-jane/moulin.jpg', mary_jane_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'Red Wine'), (new_product_id, 'Cherry Red'), (new_product_id, 'Broken White'), (new_product_id, 'Silver Chrome')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Poppy
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Poppy', 'Rp 64.900', 'Mary Jane Flat Shoes', 'https://shopee.co.id/product/1234567890/poppy', '/collections/products/mary-jane/poppy.jpg', mary_jane_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'Off White'), (new_product_id, 'Cherry Red'), (new_product_id, 'Silver Chrome')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Greta
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Greta', 'Rp 64.900', 'Mary Jane Flat Shoes', 'https://shopee.co.id/product/1234567890/greta', '/collections/products/mary-jane/greta.jpg', mary_jane_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'Cherry Red'), (new_product_id, 'Broken White')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Coco
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Coco', 'Rp 64.900', 'Mary Jane Flat Shoes', 'https://shopee.co.id/product/1234567890/coco', '/collections/products/mary-jane/coco.jpg', mary_jane_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Oat'), (new_product_id, 'Milk'), (new_product_id, 'Black'), (new_product_id, 'Cherry Red')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Charlotte
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Charlotte', 'Rp 64.900', 'Mary Jane Flat Shoes', 'https://shopee.co.id/product/1234567890/charlotte', '/collections/products/mary-jane/charlotte.jpg', mary_jane_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Oat'), (new_product_id, 'Black'), (new_product_id, 'Red Wine'), (new_product_id, 'Silver Chrome')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Solene
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Solene', 'Rp 64.900', 'Mary Jane Flat Shoes', 'https://shopee.co.id/product/1234567890/solene', '/collections/products/mary-jane/Solene.jpg', mary_jane_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Oat'), (new_product_id, 'Milk'), (new_product_id, 'Black'), (new_product_id, 'Taupe'), (new_product_id, 'Silver'), (new_product_id, 'Red Wine')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- SANDALS COLLECTION
    
    -- Colette
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Colette', 'Rp 64.900', 'Flat Sandals', 'https://shopee.co.id/product/1234567890/colette', '/collections/products/sandals/colette.jpg', sandals_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'Denim'), (new_product_id, 'Taupe'), (new_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Rhea
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Rhea', 'Rp 64.900', 'Flat Sandals', 'https://shopee.co.id/product/1234567890/rhea', '/collections/products/sandals/rhea.jpg', sandals_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Oat'), (new_product_id, 'Tan'), (new_product_id, 'Black'), (new_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Rosette
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Rosette', 'Rp 64.900', 'Flat Sandals', 'https://shopee.co.id/product/1234567890/rosette', '/collections/products/sandals/rosette.jpg', sandals_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'Cream'), (new_product_id, 'Taupe'), (new_product_id, 'Dusty Pink')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Alice Bow
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Alice Bow', 'Rp 64.900', 'Flat Sandals', 'https://shopee.co.id/product/1234567890/alice-bow', '/collections/products/sandals/alice-bow.jpg', sandals_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Black'), (new_product_id, 'White'), (new_product_id, 'Silver'), (new_product_id, 'Pink Pastel')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- Isla
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Isla', 'Rp 64.900', 'Flat Sandals', 'https://shopee.co.id/product/1234567890/isla', '/collections/products/sandals/Isla.jpg', sandals_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Tan'), (new_product_id, 'Black'), (new_product_id, 'White')
    ON CONFLICT (product_id, color) DO NOTHING;

    -- PLATFORM COLLECTION
    
    -- Rue
    INSERT INTO products (name, price, category, shopee_link, image_url, collections_id, availability)
    VALUES ('Rue', 'Rp 89.900', 'Platform Dad Sandals', 'https://shopee.co.id/product/1234567890/rue', '/collections/products/platform/rue.jpg', platform_id, 'available')
    ON CONFLICT (name) DO UPDATE SET
        price = EXCLUDED.price, category = EXCLUDED.category, shopee_link = EXCLUDED.shopee_link,
        image_url = EXCLUDED.image_url, collections_id = EXCLUDED.collections_id
    RETURNING id INTO new_product_id;
    
    INSERT INTO product_colors (product_id, color) VALUES
        (new_product_id, 'Oat'), (new_product_id, 'Tan'), (new_product_id, 'Black'), (new_product_id, 'White'), (new_product_id, 'Silver')
    ON CONFLICT (product_id, color) DO NOTHING;

END $$;

-- Hero section data
INSERT INTO hero (title, subtitle, background_image_url)
VALUES ('REINEE OFFICIAL', 'Elegant footwear for the modern woman', '/Luna-Hero-image.jpg')
ON CONFLICT (title) DO UPDATE SET
    subtitle = EXCLUDED.subtitle,
    background_image_url = EXCLUDED.background_image_url;