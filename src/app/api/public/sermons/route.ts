import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { muxStreamUrl, muxThumbnailUrl } from '@/lib/mux';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Public sermon library for the app. Returns published, playable sermons —
 * both recorded livestreams (source = 'livestream') and admin-uploaded
 * devotionals (source = 'upload') — newest first.
 *
 * Query params:
 *   organization_id (required)
 *   source          optional filter: 'livestream' | 'upload'
 *   limit           optional, defaults to 50, capped at 100
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization_id');
    const source = searchParams.get('source');
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Missing required parameter: organization_id' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('sermons')
      .select(
        'id, title, description, speaker, sermon_date, source, duration, mux_playback_id, thumbnail_url, recorded_at, created_at'
      )
      .eq('organization_id', organizationId)
      .eq('published', true)
      // Only rows Mux has finished processing are actually watchable.
      .eq('mux_status', 'ready')
      .not('mux_playback_id', 'is', null)
      .order('sermon_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (source === 'livestream' || source === 'upload') {
      query = query.eq('source', source);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Public sermons query error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    // Hand the client ready-to-use URLs so it never has to know about Mux.
    const sermons = (data || []).map((s) => ({
      ...s,
      playback_url: s.mux_playback_id ? muxStreamUrl(s.mux_playback_id) : null,
      thumbnail_url:
        s.thumbnail_url ||
        (s.mux_playback_id ? muxThumbnailUrl(s.mux_playback_id) : null),
      is_recorded_service: s.source === 'livestream',
    }));

    return NextResponse.json(sermons, { headers: corsHeaders });
  } catch (error) {
    console.error('Public sermons route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
