-- Add tracking columns for email idempotency
ALTER TABLE orders ADD COLUMN confirmation_email_sent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE orders ADD COLUMN ready_email_sent BOOLEAN NOT NULL DEFAULT false;
