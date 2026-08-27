import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../_lib/supabase.js';
import { requireAdminAuth } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!requireAdminAuth(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    const { data: templates, error } = await supabaseAdmin
      .from('email_templates')
      .select('template_type, subject, body_content')
      .order('template_type');

    if (error) {
      console.error('Error fetching email templates:', error);
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }

    return res.status(200).json({ templates });
  }

  if (req.method === 'PATCH') {
    const { template_type, subject, body_content } = req.body;

    if (!template_type || !subject || !body_content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabaseAdmin
      .from('email_templates')
      .update({ subject, body_content, updated_at: new Date().toISOString() })
      .eq('template_type', template_type);

    if (error) {
      console.error('Error updating template:', error);
      return res.status(500).json({ error: 'Failed to update template' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
