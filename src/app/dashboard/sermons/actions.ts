'use server';

import { getSupabase } from '@/lib/supabase/user';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createSermon(prevState: { error: string | null } | null, formData: FormData): Promise<{ error: string | null }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return { error: 'No active organization found.' };
    }

    const supabase = await getSupabase();

    const { data: church, error: churchError } = await supabase
      .from('churches')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (churchError || !church) {
      console.error('Error fetching church:', churchError);
      return { error: 'Could not find a church associated with your organization.' };
    }

    const sermonData = {
      title: formData.get('title') as string,
      preacher: formData.get('preacher') as string,
      sermon_date: formData.get('sermon_date') as string,
      church_id: church.id,
    };

    const { error: sermonError } = await supabase.from('sermons').insert(sermonData);

    if (sermonError) {
      console.error('Error creating sermon:', sermonError);
      return { error: 'Failed to create sermon.' };
    }

    revalidatePath('/dashboard/sermons');
    return { error: null };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred.' };
  }
}
