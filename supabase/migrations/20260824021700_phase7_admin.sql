DO $$ 
BEGIN
  -- 1. Idempotency Check
  -- If the column already exists, this migration was already run, so we skip execution safely.
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'preorders_open'
  ) THEN
    RAISE NOTICE 'Migration already applied. preorders_open column exists. Skipping.';
    RETURN;
  END IF;

  -- 2. Safety Bounds Check
  -- Ensure no prices have cents that would be lost by integer division by 100
  IF EXISTS (SELECT 1 FROM public.products WHERE price % 100 != 0) THEN
    RAISE EXCEPTION 'Cannot migrate: some products have prices not divisible by 100';
  END IF;
  IF EXISTS (SELECT 1 FROM public.orders WHERE unit_price % 100 != 0 OR total_amount % 100 != 0) THEN
    RAISE EXCEPTION 'Cannot migrate: some orders have prices not divisible by 100';
  END IF;

  -- 3. Schema Updates
  ALTER TABLE public.products ADD COLUMN preorders_open BOOLEAN NOT NULL DEFAULT true;

  -- 4. Kobo to Naira Value Updates
  UPDATE public.products SET price = price / 100;
  UPDATE public.orders SET unit_price = unit_price / 100, total_amount = total_amount / 100;
  UPDATE public.product_price_history SET old_price = old_price / 100, new_price = new_price / 100;
END $$;