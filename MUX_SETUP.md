# Mux Migration — Setup & Operations

The church app and websites no longer use YouTube for the livestream, video
devotionals, or worship music. Everything now streams through **Mux**.

Pieces involved:

- **Admin dashboard** (`emanuel-web-design`) — uploads video/audio to Mux and
  creates the livestream. This is where you manage content.
- **Supabase** (`Church Database`) — stores Mux asset/playback ids alongside the
  existing content tables (`sermons`, `livestreams`, new `music_tracks`).
- **Mobile app** (`centro-de-nueva-esperanza/frontend`) and **web app**
  (`centro-de-nueva-esperanza/next-app`) — play content with the `<mux-player>`
  web component (loaded from the jsDelivr CDN).

---

## 1. Environment variables (required)

Add these to `emanuel-web-design/.env.local` (already stubbed with placeholders)
and to the project's hosting environment (e.g. Vercel → Settings → Environment
Variables):

```
MUX_TOKEN_ID=...            # Mux Dashboard → Settings → Access Tokens
MUX_TOKEN_SECRET=...        # shown only once when the token is created
MUX_WEBHOOK_SECRET=...      # Mux Dashboard → Settings → Webhooks (signing secret)
```

The token needs **Mux Video** read + write permission.

The mobile/web apps need no Mux secrets — they only use public playback ids,
which they already read from Supabase via the existing
`NEXT_PUBLIC_SUPABASE_*` / `VITE_SUPABASE_*` variables.

## 2. Configure the Mux webhook

So that "uploading…/processing…/ready" status updates automatically:

1. Mux Dashboard → **Settings → Webhooks → Create new webhook**.
2. URL: `https://www.emanuelavina.com/api/webhooks/mux`
3. Copy the **signing secret** into `MUX_WEBHOOK_SECRET`.

Handled events: `video.upload.asset_created`, `video.asset.ready`,
`video.asset.errored`, `video.live_stream.active`, `video.live_stream.idle`.

> If `MUX_WEBHOOK_SECRET` is not set, the webhook still works but signatures are
> not verified. Set it before going to production.

---

## 3. Uploading devotionals (video) and worship music (audio)

In the dashboard → **Content Management**:

- **Devotionals** tab → *Add Devotional* → fill in title/speaker/date and pick a
  video file. It uploads straight to Mux; the card shows
  *Uploading → Processing → Ready*. Once "Ready", it appears in the app.
- **Music** tab → *Add Track* → title/artist + an audio file (mp3, etc.). Use the
  ↑/↓ buttons to set play order.

Deleting an item also deletes the underlying Mux asset.

---

## 4. Livestreaming with OBS

In the dashboard → **Content Management → Livestream**:

1. Click **Create Livestream** (only needed once — the stream is reusable).
2. You'll see:
   - **Server (RTMPS URL):** `rtmps://global-live.mux.com:443/app`
   - **Stream key:** (click *Show* / *Copy*) — keep this private.
3. In **OBS → Settings → Stream**:
   - **Service:** Custom
   - **Server:** the RTMPS URL above
   - **Stream Key:** the key above
4. Click **Start Streaming** in OBS. Mux detects the feed and the app flips to
   **LIVE automatically** (via webhook). When you stop, it goes offline.

You can also force the state with **Force Live / Force Offline** if needed.
A recording of each broadcast is saved automatically as an on‑demand asset.

The same stream key works every week — no need to recreate the stream.

---

## 5. After deploying

- Redeploy `emanuel-web-design` with the new env vars.
- Mobile app: run `cd centro-de-nueva-esperanza/frontend && bun install` (restores
  the lockfile), then `bun run build` and `npx cap sync` before submitting the
  new build. YouTube domains were removed from `capacitor.config.ts` and Mux/CDN
  domains added.
