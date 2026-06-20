import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from('events')
    .select('*')
    .eq('organization_id', orgId)
    .order('event_date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    (data || []).map((event) => ({
      ...event,
      title: event.title ?? event.title_en ?? event.title_es ?? '',
      description: event.description ?? event.description_en ?? event.description_es ?? '',
    }))
  );
}

export async function POST(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from('events')
    .insert([{
      organization_id: orgId,
      title: body.title || '',
      title_en: body.title || '',
      title_es: body.title || '',
      description: body.description || null,
      description_en: body.description || null,
      description_es: body.description || null,
      event_date: body.event_date,
      location: body.location || null,
      max_attendees: body.max_attendees || null,
      image_url: body.image_url || null,
      rsvp_fields: Array.isArray(body.rsvp_fields) ? body.rsvp_fields : [],
      created_by: 'admin',
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const title = body.title || body.title_en || '';
  const description = body.description || body.description_en || null;
  const { data, error } = await getSupabaseAdmin()
    .from('events')
    .update({
      // Keep the legacy and bilingual columns in sync — the apps read the
      // *_en/*_es columns, so updating only `title`/`description` left edits
      // invisible on the site and app.
      title,
      title_en: title,
      title_es: title,
      description,
      description_en: description,
      description_es: description,
      event_date: body.event_date,
      location: body.location || null,
      max_attendees: body.max_attendees || null,
      ...(body.image_url !== undefined ? { image_url: body.image_url || null } : {}),
      ...(Array.isArray(body.rsvp_fields) ? { rsvp_fields: body.rsvp_fields } : {}),
    })
    .eq('id', body.id)
    .eq('organization_id', orgId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await getSupabaseAdmin()
    .from('events')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
