import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getMux } from '@/lib/mux';

export async function GET(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabaseAdmin();
    // Newest first by the date the sermon happened, falling back to insert time
    // (uploads may have no date set).
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .eq('organization_id', orgId)
      .order('sermon_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('sermons')
      .insert([{ ...body, organization_id: orgId }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

/**
 * Edits a sermon's metadata. Used to rename auto-saved livestream recordings
 * and to show/hide them from the app. Mux fields are webhook-owned and are not
 * accepted here.
 */
export async function PATCH(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const EDITABLE = ['title', 'description', 'speaker', 'sermon_date', 'published'] as const;
    const patch: Record<string, unknown> = {};
    for (const field of EDITABLE) {
      if (field in body) patch[field] = body[field];
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('sermons')
      .update(patch)
      .eq('id', id)
      .eq('organization_id', orgId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const supabase = getSupabaseAdmin();
  const { data: row } = await supabase
    .from('sermons')
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
    .from('sermons')
    .delete()
    .eq('id', id)
    .eq('organization_id', orgId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
