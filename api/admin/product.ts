import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { requireAdminAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, cookie, x-test-admin-bypass');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

      return res.status(200).json({
        success: true,
        product,
        history: history || []
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { name, price, preorders_open } = req.body;

      // Validation
      if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        return res.status(400).json({ error: 'Valid name is required' });
      }
      
      if (price !== undefined && (typeof price !== 'number' || !Number.isInteger(price) || price <= 0)) {
        return res.status(400).json({ error: 'Valid price (positive integer in Naira) is required' });
      }

      if (preorders_open !== undefined && typeof preorders_open !== 'boolean') {
        return res.status(400).json({ error: 'preorders_open must be a boolean' });
      }

      const { data: product, error: fetchError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true)
        .single();

      if (fetchError || !product) {
        return res.status(404).json({ error: 'Active product not found' });
      }

      const updates: any = {};
      if (name !== undefined) updates.name = name.trim();
      if (price !== undefined) updates.price = price;
      if (preorders_open !== undefined) updates.preorders_open = preorders_open;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data: updatedProduct, error: updateError } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', product.id)
        .select()
        .single();

      if (updateError || !updatedProduct) {
        return res.status(500).json({ error: 'Failed to update product' });
      }

      // If price changed, log history
      if (price !== undefined && product.price !== price) {
        await supabaseAdmin
          .from('product_price_history')
          .insert({
            product_id: product.id,
            old_price: product.price,
            new_price: price,
            currency: product.currency
          });
      }

      return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
