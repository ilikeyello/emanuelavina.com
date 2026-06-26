import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getMux } from '@/lib/mux';

// Webhooks must read the raw body for signature verification.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Receives Mux webhooks and keeps Supabase in sync:
 *  - video.upload.asset_created : link the asset id to the pending row
 *  - video.asset.ready          : store playback id + duration, mark "ready"
 *  - video.asset.errored        : mark "errored"
 *  - video.live_stream.active   : flip the livestream to live
 *  - video.live_stream.idle     : flip the livestream off
 *
 * Both `sermons` (devotionals) and `music_tracks` rows are matched by their
 * mux_upload_id / mux_asset_id, so one handler serves video and audio.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  const secret = process.env.MUX_WEBHOOK_SECRET;
  type MuxEvent = { type?: string; data?: Record<string, unknown> };
  let event: MuxEvent;

  try {
    if (secret) {
      event = (await getMux().webhooks.unwrap(rawBody, request.headers, secret)) as unknown as MuxEvent;
    } else {
      // No secret configured yet — accept but log. Set MUX_WEBHOOK_SECRET in prod.
      console.warn('MUX_WEBHOOK_SECRET not set; skipping signature verification');
      event = JSON.parse(rawBody);
    }
  } catch (err) {
    console.error('Mux webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const type = event.type;
  const data = (event.data || {}) as Record<string, unknown>;

  try {
    switch (type) {
      case 'video.upload.asset_created': {
        // data is the Upload object; data.asset_id is the new asset.
        const uploadId = data.id as string | undefined;
        const assetId = data.asset_id as string | undefined;
        if (uploadId && assetId) {
          await updateByUploadId(supabase, uploadId, {
            mux_asset_id: assetId,
            mux_status: 'preparing',
          });
        }
        break;
      }

      case 'video.asset.ready': {
        const assetId = data.id as string | undefined;
        const uploadId = data.upload_id as string | undefined;
        const playbackId =
          (Array.isArray(data.playback_ids) &&
            (data.playback_ids[0] as { id?: string })?.id) ||
          undefined;
        const duration = (data.duration as number | undefined) ?? null;

        const patch = {
          mux_asset_id: assetId ?? undefined,
          mux_playback_id: playbackId ?? undefined,
          mux_status: 'ready',
          duration,
        };

        let updated = assetId
          ? await updateByAssetId(supabase, assetId, patch)
          : 0;
        if (!updated && uploadId) {
          updated = await updateByUploadId(supabase, uploadId, patch);
        }
        break;
      }

      case 'video.asset.errored': {
        const assetId = data.id as string | undefined;
        const uploadId = data.upload_id as string | undefined;
        const patch = { mux_status: 'errored' };
        if (assetId) await updateByAssetId(supabase, assetId, patch);
        else if (uploadId) await updateByUploadId(supabase, uploadId, patch);
        break;
      }

      case 'video.live_stream.active': {
        const streamId = data.id as string | undefined;
        if (streamId) {
          await supabase
            .from('livestreams')
            .update({ is_live: true, mux_status: 'active' })
            .eq('mux_stream_id', streamId);
        }
        break;
      }

      case 'video.live_stream.idle':
      case 'video.live_stream.disconnected': {
        const streamId = data.id as string | undefined;
        if (streamId) {
          await supabase
            .from('livestreams')
            .update({ is_live: false, mux_status: 'idle' })
            .eq('mux_stream_id', streamId);
        }
        break;
      }

      default:
        // Ignore other event types.
        break;
    }
  } catch (err) {
    console.error('Mux webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type Supa = ReturnType<typeof getSupabaseAdmin>;

async function updateByUploadId(
  supabase: Supa,
  uploadId: string,
  patch: Record<string, unknown>
): Promise<number> {
  const clean = stripUndefined(patch);
  let count = 0;
  for (const table of ['sermons', 'music_tracks'] as const) {
    const { data } = await supabase
      .from(table)
      .update(clean)
      .eq('mux_upload_id', uploadId)
      .select('id');
    count += data?.length ?? 0;
  }
  return count;
}

async function updateByAssetId(
  supabase: Supa,
  assetId: string,
  patch: Record<string, unknown>
): Promise<number> {
  const clean = stripUndefined(patch);
  let count = 0;
  for (const table of ['sermons', 'music_tracks'] as const) {
    const { data } = await supabase
      .from(table)
      .update(clean)
      .eq('mux_asset_id', assetId)
      .select('id');
    count += data?.length ?? 0;
  }
  return count;
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}
