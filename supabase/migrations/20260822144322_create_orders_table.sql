-- Create ENUM types for statuses
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED');
CREATE TYPE order_status AS ENUM ('PENDING_PAYMENT', 'PAID', 'READY', 'FULFILLED');

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL CHECK (customer_email <> ''),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    payment_reference TEXT UNIQUE,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    order_status order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    release_email_sent BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Note: No RLS policies are created. 
-- This enforces a default-deny rule for all public/anon access.
-- The server-side API (Vercel functions) will use the Supabase Service Role key 
-- to bypass RLS for creating, verifying, and fetching orders.

-- Create Indexes for performance
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_reference ON orders(payment_reference);
