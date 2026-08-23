-- 1. Create a function to automatically update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure only one active product exists for deterministic lookups (optional but requested for safety)
CREATE UNIQUE INDEX idx_single_active_product ON products(is_active) WHERE is_active = true;

-- Attach the updated_at trigger
CREATE TRIGGER update_products_modtime 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 3. Create product_price_history table
CREATE TABLE product_price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    old_price INTEGER NOT NULL CHECK (old_price >= 0),
    new_price INTEGER NOT NULL CHECK (new_price >= 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Secure tables with RLS (Default Deny)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_price_history ENABLE ROW LEVEL SECURITY;

-- 5. Modify orders table to permanently snapshot price
ALTER TABLE orders ADD COLUMN unit_price INTEGER;
ALTER TABLE orders ADD COLUMN currency TEXT DEFAULT 'NGN';

-- Migrate existing orders safely: assume 250000 kobo for existing orders
UPDATE orders SET unit_price = 250000, currency = 'NGN' WHERE unit_price IS NULL;

-- Enforce NOT NULL now that existing rows are populated
ALTER TABLE orders ALTER COLUMN unit_price SET NOT NULL;
ALTER TABLE orders ALTER COLUMN currency SET NOT NULL;

-- 6. Seed the initial product
INSERT INTO products (name, price, currency, is_active) 
VALUES ('Ramblings & Epiphanies', 250000, 'NGN', true);
