import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const supabase = getSupabaseAdmin();

  // Find all livestreams that are not live but have a scheduled start time that has passed
  const { data: streams, error: fetchError } = await supabase
    .from('livestreams')
    .select('id')
    .eq('is_live', false)
    .not('scheduled_start', 'is', null)
    .lte('scheduled_start', new Date().toISOString());

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!streams || streams.length === 0) {
    return NextResponse.json({ success: true, message: 'No streams to update' });
  }

  // Update them to live
  const updatePromises = streams.map(stream =>
    supabase
      .from('livestreams')
      .update({ is_live: true })
      .eq('id', stream.id)
  );

  await Promise.all(updatePromises);

  return NextResponse.json({ success: true, updated: streams.length });
}
