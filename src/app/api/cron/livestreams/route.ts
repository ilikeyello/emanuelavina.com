import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getMux } from '@/lib/mux';
import { saveLivestreamRecording } from '@/lib/livestream-recordings';

export const dynamic = 'force-dynamic';

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

  // Update them to live
  const updatePromises = (streams || []).map(stream =>
    supabase
      .from('livestreams')
      .update({ is_live: true })
      .eq('id', stream.id)
  );

  await Promise.all(updatePromises);

  const recovered = await backfillRecordings(supabase);

  return NextResponse.json({
    success: true,
    updated: streams?.length ?? 0,
    recordings_recovered: recovered,
  });
}

/**
 * Safety net for the webhook. Mux normally tells us about a finished broadcast
 * via video.asset.live_stream_completed, but if that delivery is ever missed
 * the recording would silently never reach the Sermons section. Here we ask Mux
 * directly for each stream's recent assets and save any we don't already have.
 */
async function backfillRecordings(
  supabase: ReturnType<typeof getSupabaseAdmin>
): Promise<number> {
  const { data: streams } = await supabase
    .from('livestreams')
    .select('mux_stream_id')
    .not('mux_stream_id', 'is', null);

  if (!streams?.length) return 0;

  const mux = getMux();
  let recovered = 0;

  for (const { mux_stream_id: liveStreamId } of streams) {
    if (!liveStreamId) continue;
    try {
      const assets = await mux.video.assets.list({
        live_stream_id: liveStreamId,
        limit: 10,
      });

      for (const asset of assets.data ?? []) {
        if (asset.status !== 'ready') continue;

        const result = await saveLivestreamRecording(supabase, {
          assetId: asset.id,
          liveStreamId,
          playbackId: asset.playback_ids?.[0]?.id ?? null,
          duration: asset.duration ?? null,
          createdAt: asset.created_at,
        });
        if (result === 'created') recovered += 1;
      }
    } catch (err) {
      // A single bad stream shouldn't abort the whole cron run.
      console.error(`Backfill failed for live stream ${liveStreamId}:`, err);
    }
  }

  return recovered;
}
