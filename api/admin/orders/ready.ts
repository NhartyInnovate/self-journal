import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../_lib/supabase.js';
import { requireAdminAuth } from '../../_lib/auth.js';
import { resend, getFromEmail } from '../../_lib/resend.js';
import { getCopyReadyHtml } from '../../_lib/email-templates.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-test-admin-bypass');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!requireAdminAuth(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { order_id } = req.body;

    if (!order_id || typeof order_id !== 'string') {
      return res.status(400).json({ error: 'order_id is required' });
    }

    // Retrieve order
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status, order_status, customer_name, customer_email, payment_reference, ready_email_sent')
      .eq('id', order_id)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.payment_status !== 'PAID') {
      return res.status(400).json({ error: 'Order must be PAID before marking as READY' });
    }

    // Update status to READY if not already
    if (order.order_status !== 'READY') {
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ order_status: 'READY' })
        .eq('id', order.id);

      if (updateError) {
        return res.status(500).json({ error: 'Failed to update order status' });
      }
    }

    // EMAIL 2 - COPY READY (Idempotent)
    if (order.ready_email_sent === false) {
      const html = getCopyReadyHtml(order.customer_name, 'Ramblings & Epiphanies', order.payment_reference);
      
      const { error: emailError } = await resend.emails.send({
        from: getFromEmail(),
        to: order.customer_email,
        subject: 'Your Copy is Ready - Ramblings & Epiphanies',
        html: html
      });

      if (!emailError) {
        await supabaseAdmin
          .from('orders')
          .update({ ready_email_sent: true })
          .eq('id', order.id);
      } else {
        console.error(`Ready Email Error: Failed to send to ${order.customer_email}`, emailError);
        return res.status(500).json({ error: 'Status updated, but failed to send email' });
      }
    }

    return res.status(200).json({ success: true, message: 'Order marked as READY and email sent' });
  } catch (error) {
    console.error('Ready Endpoint Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
