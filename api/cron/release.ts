import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { resend, getFromEmail } from '../_lib/resend.js';
import { getReleaseNotificationHtml } from '../_lib/email-templates.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Cron endpoints are usually protected by Vercel automatically via headers,
  // but we also rely on the idempotency and date checks.
  
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('CRON: CRON_SECRET is not configured.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
  }

  try {
    const configuredReleaseDateStr = process.env.RELEASE_DATE;
    
    if (!configuredReleaseDateStr) {
      console.warn('CRON: RELEASE_DATE not configured. Exiting safely.');
      return res.status(200).json({ status: 'ignored', reason: 'RELEASE_DATE not configured' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    
    if (todayStr !== configuredReleaseDateStr) {
      return res.status(200).json({ status: 'ignored', reason: `Today (${todayStr}) is not the release date (${configuredReleaseDateStr})` });
    }

    // Query unpaid orders? No, ONLY PAID orders where release_email_sent is false
    const { data: orders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, customer_name, customer_email')
      .eq('payment_status', 'PAID')
      .eq('release_email_sent', false);

    if (fetchError) {
      console.error('CRON: Failed to fetch orders', fetchError);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json({ status: 'completed', processed: 0 });
    }

    const { resend, getFromEmail } = await import('../_lib/resend.js');
    const { getReleaseNotificationEmail } = await import('../_lib/email-templates.js');

    const fromEmail = getFromEmail();
    let processedCount = 0;
    let failedCount = 0;

    // Send emails sequentially or in small batches to respect rate limits
    for (const order of orders) {
      const { subject, html } = await getReleaseNotificationEmail(order.customer_name, 'Ramblings & Epiphanies');

      const { error: emailError } = await resend.emails.send({
        from: fromEmail,
        to: order.customer_email,
        subject: subject,
        html: html
      });

      if (!emailError) {
        // Mark as sent only AFTER successful submission
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ release_email_sent: true })
          .eq('id', order.id);
          
        if (updateError) {
          console.error(`CRON: Email sent but DB update failed for order ${order.id}`, updateError);
        } else {
          processedCount++;
        }
      } else {
        console.error(`CRON: Failed to send release email to ${order.customer_email}`, emailError);
        failedCount++;
      }
    }

    return res.status(200).json({ 
      status: 'completed', 
      processed: processedCount,
      failed: failedCount 
    });
  } catch (error) {
    console.error('CRON Release Endpoint Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
