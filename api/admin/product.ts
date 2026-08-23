import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase';
import { requireAdminAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-test-admin-bypass');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Enforce admin auth
  if (!requireAdminAuth(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Active product not found' });
      }

      const { data: history, error: historyError } = await supabaseAdmin
        .from('product_price_history')
        .select('*')
        .eq('product_id', product.id)
        .order('changed_at', { ascending: false });

      if (historyError) {
        return res.status(500).json({ error: 'Failed to fetch price history' });
      }

      return res.status(200).json({
        success: true,
        product,
        history
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { price } = req.body;

      if (price === undefined || typeof price !== 'number' || !Number.isInteger(price) || price < 0) {
        return res.status(400).json({ error: 'Valid price (integer >= 0) is required' });
      }

      // Fetch current active product
      const { data: product, error: fetchError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .single();

      if (fetchError || !product) {
        return res.status(404).json({ error: 'Active product not found' });
      }

      if (product.price === price) {
        return res.status(200).json({ success: true, message: 'Price is already set to this value', product });
      }

      // Update the product and insert history
      const oldPrice = product.price;

      const { data: updatedProduct, error: updateError } = await supabaseAdmin
        .from('products')
        .update({ price })
        .eq('id', product.id)
        .select()
        .single();

      if (updateError || !updatedProduct) {
        return res.status(500).json({ error: 'Failed to update product price' });
      }

      const { error: historyError } = await supabaseAdmin
        .from('product_price_history')
        .insert({
          product_id: product.id,
          old_price: oldPrice,
          new_price: price,
          currency: product.currency
        });

      if (historyError) {
        // We log it but do not fail the request if history insertion fails, though in a real system a transaction is better.
        // Supabase JS doesn't support transactions, so we rely on postgres functions if atomicity is strictly required.
        console.error('Failed to log price history:', historyError);
      }

      return res.status(200).json({
        success: true,
        product: updatedProduct
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
