import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { requireAdminAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!requireAdminAuth(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Fetch orders stats
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('payment_status, total_amount, quantity');

    if (ordersError) {
      console.error('Failed to fetch orders stats', ordersError);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    let totalPreorders = 0;
    let paidPreorders = 0;
    let pendingPayments = 0;
    let totalRevenue = 0;
    let copiesReserved = 0;

    orders.forEach(order => {
      totalPreorders++;
      if (order.payment_status === 'PAID') {
        paidPreorders++;
        totalRevenue += order.total_amount;
        copiesReserved += order.quantity;
      } else {
        pendingPayments++;
      }
    });

    // 2. Fetch active product
    // Fallback safely if preorders_open doesn't exist yet in the schema during migration
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (productError) {
      console.error('Failed to fetch product stats', productError);
      return res.status(500).json({ error: 'Failed to fetch product info' });
    }

    const releaseDate = process.env.RELEASE_DATE || 'Not set';

    return res.status(200).json({
      success: true,
      stats: {
        totalPreorders,
        paidPreorders,
        pendingPayments,
        totalRevenue,
        copiesReserved,
        currentBookPrice: product ? product.price : 0,
        currency: product ? product.currency : 'NGN',
        releaseDate,
        preordersOpen: product && product.preorders_open !== undefined ? product.preorders_open : true
      }
    });
  } catch (error) {
    console.error('Stats endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
