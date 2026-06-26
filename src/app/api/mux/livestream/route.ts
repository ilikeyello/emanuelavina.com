import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getMux } from '@/lib/mux';

// Mux's RTMP(S) ingest endpoint is the same for every stream; only the stream
// key differs. Encoders (OBS, etc.) point here and authenticate with the key.
export const MUX_RTMPS_URL = 'rtmps://global-live.mux.com:443/app';
export const MUX_RTMP_URL = 'rtmp://global-live.mux.com:5222/app';

/**
 * Creates a persistent Mux live stream and stores its stream key + playback id.
 * The same stream key is reused for every broadcast — the admin just starts
 * pushing RTMP from OBS and the webhook flips it to "live" automatically.
 */
export async function POST(request: Request) {
  try {
    const { orgId, userId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    const mux = getMux();
    const stream = await mux.video.liveStreams.create({
      playback_policy: ['public'],
      reduced_latency: true,
      // Save a recording of each broadcast as an on-demand asset.
      new_asset_settings: { playback_policy: ['public'] },
    });

    const playbackId = stream.playback_ids?.[0]?.id ?? null;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('livestreams')
      .insert([
        {
          organization_id: orgId,
          title: body.title || 'Sunday Service',
          scheduled_start: body.scheduled_start || null,
          is_live: false,
          mux_stream_id: stream.id,
          mux_stream_key: stream.stream_key,
          mux_playback_id: playbackId,
          mux_status: 'idle',
          created_by: userId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ...data,
      rtmps_url: MUX_RTMPS_URL,
      rtmp_url: MUX_RTMP_URL,
    });
  } catch (error) {
    console.error('Mux livestream create error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

/**
 * Deletes the Mux live stream (and the Supabase row). Optionally resets the
 * stream key if `?reset=1` is supplied instead of full deletion.
 */
export async function DELETE(request: Request) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: row } = await supabase
      .from('livestreams')
      .select('mux_stream_id')
      .eq('id', id)
      .eq('organization_id', orgId)
      .single();

    if (row?.mux_stream_id) {
      try {
        await getMux().video.liveStreams.delete(row.mux_stream_id);
      } catch (e) {
        console.warn('Mux stream delete failed (continuing):', e);
      }
    }

    const { error } = await supabase
      .from('livestreams')
      .delete()
      .eq('id', id)
      .eq('organization_id', orgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mux livestream delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
