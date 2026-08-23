import { createClient } from '@supabase/supabase-js';

// These must NEVER be VITE_ prefixed to ensure they do not leak to the client bundle.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('WARNING: Supabase server configuration is missing.');
}

// Create a single Supabase client for interacting with your database
// This uses the service role key, bypassing RLS. 
// It MUST only be used in server-side code (e.g. Vercel API functions).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
