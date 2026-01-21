import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';

export const getSupabase = async () => {
  const { getToken } = await auth();
  const supabaseAccessToken = await getToken({ template: 'supabase' });

  if (!supabaseAccessToken) {
    throw new Error('Supabase access token not available.');
  }

  const client = await createClient();
  client.auth.setSession({ access_token: supabaseAccessToken, refresh_token: '' });

  return client;
};
