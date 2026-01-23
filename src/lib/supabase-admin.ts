import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdmin: SupabaseClient | null = null;

export const getSupabaseAdmin = () => {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is missing');
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  console.log('Initializing Supabase admin client with URL:', supabaseUrl);

  supabaseAdmin = createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  return supabaseAdmin;
};
