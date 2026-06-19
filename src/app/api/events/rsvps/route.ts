import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });

  // Verify the event belongs to this org before returning RSVPs
  const { data: eventCheck, error: eventError } = await getSupabaseAdmin()
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('organization_id', orgId)
    .single();

  if (eventError || !eventCheck) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from('event_rsvps')
    .select('id, user_name, user_email, attendees, responses, created_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}
