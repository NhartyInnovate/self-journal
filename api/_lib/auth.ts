import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';


/**
 * Validates whether the incoming request is authorized to perform admin actions.
 * Allows bypass during local API tests using `x-test-admin-bypass`.
 */
export function requireAdminAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers['x-test-admin-bypass'] === 'true' && process.env.NODE_ENV === 'test') {
    return true;
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    res.status(401).json({ error: 'Unauthorized: No session cookie' });
    return false;
  }

  const token = cookieHeader.split('; ').find(row => row.startsWith('admin_session='))?.split('=')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing admin session' });
    return false;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ error: 'Server configuration error' });
    return false;
  }

  try {
    jwt.verify(token, jwtSecret);
    return true;
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    return false;
  }
}
