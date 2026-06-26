import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getMux } from '@/lib/mux';

/**
 * Creates a Mux direct-upload URL for a devotional (video) or music (audio)
 * asset, and inserts a matching "pending" row in Supabase. The browser then
 * uploads the file straight to Mux via UpChunk. When Mux finishes processing,
 * the /api/webhooks/mux handler fills in the asset + playback ids.
 */
export async function POST(request: Request) {
  try {
    const { orgId, userId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const kind: 'devotional' | 'music' = body.kind;
    if (kind !== 'devotional' && kind !== 'music') {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
    }
    if (!body.title || !String(body.title).trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      '*';

    const mux = getMux();
    const upload = await mux.video.uploads.create({
      cors_origin: origin,
      new_asset_settings: {
        playback_policy: ['public'],
        // Optimize delivery; no separate MP4 renditions needed for streaming.
        mp4_support: 'none',
      },
    });

    const supabase = getSupabaseAdmin();

    if (kind === 'devotional') {
      const { data, error } = await supabase
        .from('sermons')
        .insert([
          {
            organization_id: orgId,
            title: body.title,
            description: body.description || null,
            speaker: body.speaker || null,
            sermon_date: body.sermon_date || null,
            mux_upload_id: upload.id,
            mux_status: 'pending',
            created_by: userId || null,
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({
        id: data.id,
        uploadId: upload.id,
        uploadUrl: upload.url,
      });
    }

    // kind === 'music'
    const { data, error } = await supabase
      .from('music_tracks')
      .insert([
        {
          organization_id: orgId,
          title: body.title,
          artist: body.artist || null,
          sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
          mux_upload_id: upload.id,
          mux_status: 'pending',
          created_by: userId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({
      id: data.id,
      uploadId: upload.id,
      uploadUrl: upload.url,
    });
  } catch (error) {
    console.error('Mux upload route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
