import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Diagnostic Payload
  const diagnostics = {
    env: {
      has_SUPABASE_URL: !!process.env.SUPABASE_URL,
      has_SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      has_BOOK_PRICE_KOBO: !!process.env.BOOK_PRICE_KOBO,
    },
    error: null as any
  };

  try {
    const { supabaseAdmin } = await import('./_lib/supabase');
    
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('name, price, currency')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !product) {
      diagnostics.error = error || 'No active product found';
      return res.status(500).json({ error: 'Pricing configuration error.', diagnostics });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    console.error('Unexpected API Error:', error);
    diagnostics.error = error?.message || String(error);
    return res.status(500).json({ error: 'Internal server error', diagnostics });
  }
}
