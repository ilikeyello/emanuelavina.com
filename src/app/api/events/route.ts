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
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from('events')
    .insert([{
      organization_id: orgId,
      title_en: body.title || '',
      title_es: body.title || '',
      description_en: body.description || null,
      description_es: body.description || null,
      event_date: body.event_date,
      location: body.location || null,
      max_attendees: body.max_attendees || null,
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
  const { data, error } = await getSupabaseAdmin()
    .from('events')
    .update({
      title: body.title || body.title_en || '',
      description: body.description || body.description_en || null,
      event_date: body.event_date,
      location: body.location || null,
      max_attendees: body.max_attendees || null,
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
