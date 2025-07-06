/*
  # Policy Cleanup Migration
  
  This migration runs BEFORE the main schema migration to ensure all existing policies
  are properly cleaned up, preventing "already exists" errors.
  
  1. Cleanup
    - Remove all existing policies that might conflict
    - Ensure RLS is enabled on all tables
  
  2. Safety
    - Uses IF EXISTS to prevent errors if policies don't exist
    - Can be run multiple times safely
*/

-- Enable RLS on all tables first
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_colors ENABLE ROW LEVEL SECURITY;

-- Clean up all existing policies to prevent conflicts
DO $$
DECLARE
  _pol text;
  _table text;
BEGIN
  -- Clean up products policies
  FOR _pol IN
    SELECT polname
    FROM pg_policy
    WHERE polrelid = 'products'::regclass
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON products;', _pol);
  END LOOP;

  -- Clean up collections policies
  FOR _pol IN
    SELECT polname
    FROM pg_policy
    WHERE polrelid = 'collections'::regclass
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON collections;', _pol);
  END LOOP;

  -- Clean up hero policies
  FOR _pol IN
    SELECT polname
    FROM pg_policy
    WHERE polrelid = 'hero'::regclass
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON hero;', _pol);
  END LOOP;

  -- Clean up admins policies
  FOR _pol IN
    SELECT polname
    FROM pg_policy
    WHERE polrelid = 'admins'::regclass
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON admins;', _pol);
  END LOOP;

  -- Clean up product_colors policies (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_colors') THEN
    FOR _pol IN
      SELECT polname
      FROM pg_policy
      WHERE polrelid = 'product_colors'::regclass
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON product_colors;', _pol);
    END LOOP;
  END IF;

END $$;