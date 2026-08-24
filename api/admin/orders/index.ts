import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../_lib/supabase.js';
import { requireAdminAuth } from '../../_lib/auth.js';

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
    // Parse query params for search/filter/sort
    const search = req.query.search as string;
    const paymentStatus = req.query.payment_status as string;
    const orderStatus = req.query.order_status as string;
    const orderId = req.query.id as string;
    
    let query = supabaseAdmin
      .from('orders')
      .select('*');

    if (orderId) {
      query = query.eq('id', orderId);
    }

    if (search) {
      // Use or for customer_name, customer_email, payment_reference
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,payment_reference.ilike.%${search}%`);
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    if (orderStatus) {
      query = query.eq('order_status', orderStatus);
    }

    // Sort by newest by default
    query = query.order('created_at', { ascending: false });

    const { data: orders, error } = await query;

    if (error) {
      console.error('Failed to fetch orders:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Orders API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
