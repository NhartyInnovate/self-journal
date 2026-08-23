import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Validates whether the incoming request is authorized to perform admin actions.
 * Currently returns 401 Unauthorized for all requests, until Phase 7.
 * Allows bypass during local API tests using `x-test-admin-bypass`.
 */
export function requireAdminAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers['x-test-admin-bypass'] === 'true' && process.env.NODE_ENV === 'test') {
    return true;
  }

  res.status(401).json({ error: 'Unauthorized. Admin authentication not yet implemented.' });
  return false;
}
