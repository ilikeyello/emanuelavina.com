import Mux from '@mux/mux-node';

let muxClient: Mux | null = null;

/**
 * Server-only Mux client. Uses the API Access Token configured in the
 * environment. Never import this from client components.
 */
export function getMux(): Mux {
  if (muxClient) return muxClient;

  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error(
      'Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET environment variables'
    );
  }

  muxClient = new Mux({ tokenId, tokenSecret });
  return muxClient;
}

/** Build the public HLS playback URL for a Mux playback id. */
export function muxStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

/** Build a thumbnail (poster) URL for a Mux playback id. */
export function muxThumbnailUrl(playbackId: string, time = 1): string {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}`;
}
