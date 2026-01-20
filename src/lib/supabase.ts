import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// This is a server-side Supabase client
export const createSupabaseServerClient = async () => {
  const { getToken } = await auth();

  const supabaseToken = await getToken({ template: 'supabase' });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL or Anon Key is missing from environment variables.');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      },
    }
  );

  return supabase;
};
