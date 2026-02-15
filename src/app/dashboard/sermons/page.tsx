import { getSupabase } from '@/lib/supabase/user';
import { SermonsClient } from './sermons-client';

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

export default async function SermonsPage() {
  let supabase;
  try {
    supabase = await getSupabase();
  } catch (e) {
    console.error(e);
    return <div>Error initializing database. Please try again.</div>;
  }

  const { data: sermons, error } = await supabase.from('sermons').select('*');

  if (error) {
    console.error('Error fetching sermons:', error);
    return <div>Error loading sermons. Please try again.</div>;
  }

  return <SermonsClient sermons={sermons || []} />;
}
