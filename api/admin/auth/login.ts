import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';


export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminPassword || !jwtSecret) {
      console.error('SERVER ERROR: Missing ADMIN_PASSWORD or JWT_SECRET.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!password || password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '12h' });
    const isProd = process.env.NODE_ENV === 'production' && !req.headers.host?.includes('localhost');

    const secureAttr = isProd ? 'Secure;' : '';
    const cookieStr = `admin_session=${token}; HttpOnly; ${secureAttr} SameSite=Strict; Path=/; Max-Age=43200`;
    res.setHeader('Set-Cookie', cookieStr);
    
    return res.status(200).json({ success: true, message: 'Authenticated successfully' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
