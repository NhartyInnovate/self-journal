import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase';

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
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('name, price, currency')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !product) {
      return res.status(500).json({ error: 'Pricing configuration error.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Unexpected API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
