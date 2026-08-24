import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from './_lib/supabase.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { customer_name, customer_email, quantity } = req.body;

    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim() === '') {
      return res.status(400).json({ error: 'Valid customer_name is required' });
    }

    if (!customer_email || typeof customer_email !== 'string' || !/^\S+@\S+\.\S+$/.test(customer_email)) {
      return res.status(400).json({ error: 'Valid customer_email is required' });
    }

    if (quantity === undefined || typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity (>0) is required' });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('price, currency, preorders_open')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Deterministic deployment lock
    if (productError && productError.code === '42703') {
      return res.status(503).json({ error: 'System is undergoing maintenance. Please try again in a few minutes.' });
    }

    let unit_price: number;
    let currency: string;

    if (productError || !product) {
      // Fallback to environment variable if database product is missing or misconfigured
      const envPrice = process.env.BOOK_PRICE_NAIRA || (process.env.BOOK_PRICE_KOBO ? String(Number(process.env.BOOK_PRICE_KOBO) / 100) : null);
      if (envPrice && !isNaN(Number(envPrice))) {
        unit_price = Number(envPrice);
        currency = 'NGN';
      } else {
        console.error('SERVER ERROR: Could not retrieve active product pricing.');
        return res.status(500).json({ error: 'Pricing configuration error.' });
      }
    } else {
      if (product.preorders_open === false) {
        return res.status(403).json({ error: 'Preorders are currently closed.' });
      }
      unit_price = product.price;
      currency = product.currency;
    }

    const total_amount = unit_price * quantity;
    const order_id = crypto.randomUUID();

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        id: order_id,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim().toLowerCase(),
        quantity,
        unit_price,
        currency,
        total_amount,
        payment_status: 'PENDING',
        order_status: 'PENDING_PAYMENT',
        payment_reference: order_id,
        release_email_sent: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return res.status(500).json({ error: 'Database error while creating order.' });
    }

    return res.status(201).json({
      success: true,
      order: {
        id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        quantity: order.quantity,
        unit_price: order.unit_price,
        currency: order.currency,
        total_amount: order.total_amount,
        payment_status: order.payment_status,
        order_status: order.order_status,
        payment_reference: order.payment_reference,
        created_at: order.created_at
      }
    });
  } catch (error) {
    console.error('Unexpected API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
