import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable.");
}

if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable.");
}

declare global {
  // eslint-disable-next-line no-var
  var cachedSupabaseClient: SupabaseClient | undefined;
}

export const supabase =
  global.cachedSupabaseClient ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

if (!global.cachedSupabaseClient) {
  global.cachedSupabaseClient = supabase;
}
