# Dynamic Pricing Architecture

## Overview
This document explains the Phase 3.5 transition from environment-based static pricing to dynamic, database-backed pricing.

## `products` and `product_price_history` Tables
Instead of a single environment variable (`BOOK_PRICE_KOBO`), prices are now managed within the `products` table in Supabase. 
The system identifies the active book via `is_active = true`. 
Any changes to the product price via the admin API automatically trigger a record in the `product_price_history` table, which retains the `old_price`, `new_price`, and `changed_at` timestamp. This allows administrators to audit pricing adjustments over time.

## Kobo Representation
All monetary values (prices and order totals) are stored as integers representing the smallest currency unit (e.g., kobo for NGN). 
Storing integers eliminates floating-point precision errors that occur when calculating financial data (e.g., `250000` kobo = `2,500 NGN`).

## Order Price Snapshot
When a customer creates an order, the server retrieves the current price from the `products` table, calculates the total, and stores a strict snapshot in the `orders` table (`unit_price`, `total_amount`, `currency`).

**Existing orders are NEVER repriced.** Even if the product price changes in the future, the `unit_price` on an already-created order remains permanently fixed to the price at the moment of checkout. This prevents historical financial records from being retroactively modified or corrupted by future price hikes/discounts.

## Future Admin Dashboard
The admin dashboard will call `PATCH /api/admin/product` to safely update the active product's price. The endpoint is protected by an admin authentication middleware which enforces authorization, meaning public users cannot manipulate the database price.

## Future Paystack Integration (Phase 4)
When Paystack is integrated, the client browser will NOT dictate the charge amount. The Paystack initialization payload will rely exclusively on the server-calculated `total_amount` saved securely in the `orders` table, ensuring exact alignment between the database and the payment gateway.
