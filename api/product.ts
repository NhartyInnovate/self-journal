import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('name, price, currency, preorders_open')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Deterministic deployment lock: if preorders_open doesn't exist, migration hasn't run.
    if (productError && productError.code === '42703') {
      return res.status(503).json({ error: 'System is undergoing maintenance. Please try again in a few minutes.' });
    }

    if (productError || !product) {
      const envPrice = process.env.BOOK_PRICE_NAIRA || (process.env.BOOK_PRICE_KOBO ? String(Number(process.env.BOOK_PRICE_KOBO) / 100) : null);
      if (envPrice && !isNaN(Number(envPrice))) {
        return res.status(200).json({ name: 'Ramblings & Epiphanies', price: Number(envPrice), currency: 'NGN', preorders_open: true });
      }
      return res.status(500).json({ error: `Pricing configuration error. envPrice: ${envPrice}`, details: productError });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    console.error('Unexpected API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message || String(error) });
  }
}

