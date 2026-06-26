import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getMux } from '@/lib/mux';

export async function GET() {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from('music_tracks')
    .select('*')
    .eq('organization_id', orgId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PATCH(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.artist !== undefined) updateData.artist = body.artist;
  if (body.sort_order !== undefined) updateData.sort_order = body.sort_order;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await getSupabaseAdmin()
    .from('music_tracks')
    .update(updateData)
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

  const supabase = getSupabaseAdmin();
  const { data: row } = await supabase
    .from('music_tracks')
    .select('mux_asset_id')
    .eq('id', id)
    .eq('organization_id', orgId)
    .single();

  if (row?.mux_asset_id) {
    try {
      await getMux().video.assets.delete(row.mux_asset_id);
    } catch (e) {
      console.warn('Mux asset delete failed (continuing):', e);
    }
  }

  const { error } = await supabase
    .from('music_tracks')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
