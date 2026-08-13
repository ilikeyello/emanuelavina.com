import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Supa = ReturnType<typeof getSupabaseAdmin>;

/**
 * Ignore recordings shorter than this — usually an accidental OBS start/stop
 * or a connection test, not an actual service.
 */
export const MIN_RECORDING_SECONDS = 60;

export interface RecordingInput {
  assetId: string;
  liveStreamId: string;
  playbackId: string | null;
  duration: number | null;
  createdAt?: string | number;
}

/**
 * Saves (or finalizes) the on-demand recording of a broadcast as a sermon so
 * the congregation can watch it after the stream ends.
 *
 * Called from two places:
 *   • the Mux webhook, on video.asset.live_stream_completed (the normal path)
 *   • the livestreams cron, which reconciles anything a missed webhook dropped
 *
 * Idempotent: the `sermons_mux_asset_id_key` unique index means a redelivered
 * webhook updates the existing row rather than creating a duplicate.
 */
export async function saveLivestreamRecording(
  supabase: Supa,
  opts: RecordingInput
): Promise<'created' | 'updated' | 'skipped'> {
  const { assetId, liveStreamId, playbackId, duration, createdAt } = opts;

  // Find the livestream this recording came from — it carries the org and title.
  const { data: stream } = await supabase
    .from('livestreams')
    .select('id, organization_id, title, created_by')
    .eq('mux_stream_id', liveStreamId)
    .maybeSingle();

  if (!stream) {
    console.warn(
      `Mux recording ${assetId} has no matching livestream (${liveStreamId}); skipping`
    );
    return 'skipped';
  }

  const { data: existing } = await supabase
    .from('sermons')
    .select('id')
    .eq('mux_asset_id', assetId)
    .maybeSingle();

  // Drop accidental starts/stops, but never touch a row that already exists.
  if (!existing && duration !== null && duration < MIN_RECORDING_SECONDS) {
    console.log(
      `Mux recording ${assetId} is ${duration}s (< ${MIN_RECORDING_SECONDS}s); not saving`
    );
    return 'skipped';
  }

  if (existing) {
    // Refresh playback/duration but leave any admin edits to the title alone.
    const { error } = await supabase
      .from('sermons')
      .update({
        mux_playback_id: playbackId ?? undefined,
        mux_status: 'ready',
        duration,
      })
      .eq('id', existing.id);
    if (error) console.error('Failed to finalize livestream recording:', error);
    return 'updated';
  }

  const recordedAt = toDate(createdAt);
  const dateLabel = recordedAt.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const { error } = await supabase.from('sermons').insert([
    {
      organization_id: stream.organization_id,
      title: `${stream.title || 'Servicio'} — ${dateLabel}`,
      description: null,
      sermon_date: toDateOnly(recordedAt),
      source: 'livestream',
      livestream_id: stream.id,
      mux_live_stream_id: liveStreamId,
      mux_asset_id: assetId,
      mux_playback_id: playbackId,
      mux_status: 'ready',
      duration,
      published: true,
      recorded_at: recordedAt.toISOString(),
      created_by: stream.created_by ?? null,
    },
  ]);

  if (error) {
    // 23505 = unique violation, i.e. a concurrent webhook already inserted it.
    if (error.code !== '23505') {
      console.error('Failed to save livestream recording:', error);
      return 'skipped';
    }
    return 'updated';
  }

  console.log(`Saved livestream recording ${assetId} as a sermon`);
  return 'created';
}

/** Mux sends created_at as an ISO string on assets and unix seconds elsewhere. */
export function toDate(value?: string | number | null): Date {
  if (value === undefined || value === null) return new Date();
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isNaN(num) && num > 0) return new Date(num * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/** YYYY-MM-DD in local time, so a Sunday-night service isn't dated Monday. */
function toDateOnly(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
