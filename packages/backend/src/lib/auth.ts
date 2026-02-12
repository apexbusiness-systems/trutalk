import { VercelRequest } from '@vercel/node';
import { supabase } from './supabase';
import { APIError } from '../../../shared/src/utils';

/**
 * Verifies the user's session using the Authorization header
 * @param req The Vercel request object
 * @returns The authenticated user's ID
 * @throws APIError if the token is missing, invalid, or expired
 */
export async function verifyUser(req: VercelRequest): Promise<string> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new APIError(401, 'Missing Authorization header', 'UNAUTHORIZED');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    throw new APIError(401, 'Invalid Authorization header format', 'UNAUTHORIZED');
  }

  const token = parts[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new APIError(401, 'Invalid or expired token', 'UNAUTHORIZED');
  }

  return user.id;
}
