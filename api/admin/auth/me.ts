import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminAuth } from '../../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // requireAdminAuth handles validating the cookie and returning 401 if invalid
  if (!requireAdminAuth(req, res)) {
    return;
  }

  return res.status(200).json({ success: true, user: { role: 'admin' } });
}
