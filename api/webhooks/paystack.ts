import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import crypto from 'crypto';

// Disable default body parser to get raw body for HMAC verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('SERVER ERROR: PAYSTACK_SECRET_KEY is missing.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-paystack-signature'] as string;

    if (!signature) {
      return res.status(401).json({ error: 'Missing Paystack signature' });
    }

    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    // Timing-safe comparison to prevent timing attacks
    if (hash.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))) {
      console.warn('Invalid Paystack signature detected.');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse the verified event
    const event = JSON.parse(rawBody);

    if (event.event !== 'charge.success') {
      // Return 200 to acknowledge receipt of other events without processing
      return res.status(200).json({ received: true });
    }

    const { reference, amount, currency, status } = event.data;

    // Reject non-successful transactions
    if (status !== 'success') {
      return res.status(400).json({ error: 'Transaction not successful' });
    }

    // Retrieve order by payment_reference
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, currency, payment_status, customer_name, customer_email, quantity, payment_reference, confirmation_email_sent')
      .eq('payment_reference', reference)
      .single();

    if (fetchError || !order) {
      console.warn(`Webhook Error: Order not found for reference ${reference}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Idempotency check: if already paid, do not re-process
    if (order.payment_status === 'PAID') {
      return res.status(200).json({ success: true, message: 'Order already marked as PAID.' });
    }

    // Amount and currency verification (Paystack amount is always in Kobo)
    // Deterministic Transition Layer: Check if DB has been migrated to Naira
    // We check if the 'preorders_open' column exists in products. If not, DB is still in Kobo.
    const { error: schemaError } = await supabaseAdmin.from('products').select('preorders_open').limit(1);
    const isMigratedToNaira = !(schemaError && schemaError.code === '42703');

    const expectedAmountKobo = isMigratedToNaira ? order.total_amount * 100 : order.total_amount;
    if (amount !== expectedAmountKobo) {
      console.error(`Webhook Mismatch: Order ${order.id} expected ${expectedAmountKobo}, received ${amount}`);
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // Usually Paystack sends currency, but we can verify it if it's there
    if (currency && currency !== order.currency) {
      console.error(`Webhook Mismatch: Order ${order.id} expected ${order.currency}, received ${currency}`);
      return res.status(400).json({ error: 'Currency mismatch' });
    }

    // Update order status securely
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'PAID',
        order_status: 'PAID'
      })
      .eq('id', order.id);

    if (updateError) {
      console.error(`Webhook Error: Failed to update order ${order.id}`, updateError);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    // EMAIL 1 - PREORDER CONFIRMATION
    if (order.confirmation_email_sent !== true) {
      const { resend, getFromEmail } = await import('../_lib/resend.js');
      const { getPreorderConfirmationEmail } = await import('../_lib/email-templates.js');
      
      const releaseDate = process.env.RELEASE_DATE || 'Upcoming';
      const { subject, html } = await getPreorderConfirmationEmail(order.customer_name, 'Ramblings & Epiphanies', order.quantity, order.total_amount, order.payment_reference, releaseDate);

      const { error: emailError } = await resend.emails.send({
        from: getFromEmail(),
        to: order.customer_email,
        subject: subject,
        html: html
      });

      if (!emailError) {
        // Mark as sent in DB to guarantee idempotency
        await supabaseAdmin
          .from('orders')
          .update({ confirmation_email_sent: true })
          .eq('id', order.id);
      } else {
        console.error(`Webhook Email Error: Failed to send confirmation to ${order.customer_email}`, emailError);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
