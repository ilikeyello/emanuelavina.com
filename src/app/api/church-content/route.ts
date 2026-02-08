import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let query = getSupabaseAdmin()
    .from('church_content')
    .select('*')
    .eq('church_id', orgId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from('church_content')
    .insert([{
      church_id: orgId,
      type: body.type,
      title: body.title || '',
      description: body.description || null,
      content: body.content || null,
      youtube_url: body.youtube_url || null,
      youtube_playlist_url: body.youtube_playlist_url || null,
      metadata: body.metadata || null,
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
  const updateData: Record<string, unknown> = {};

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.content !== undefined) updateData.content = body.content;
  if (body.youtube_url !== undefined) updateData.youtube_url = body.youtube_url;
  if (body.youtube_playlist_url !== undefined) updateData.youtube_playlist_url = body.youtube_playlist_url;
  if (body.metadata !== undefined) updateData.metadata = body.metadata;

  const { data, error } = await getSupabaseAdmin()
    .from('church_content')
    .update(updateData)
    .eq('id', body.id)
    .eq('church_id', orgId)
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
    .from('church_content')
    .delete()
    .eq('id', id)
    .eq('church_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
