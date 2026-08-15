'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as UpChunk from '@mux/upchunk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Music, UploadCloud, Loader2, CheckCircle2, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MusicPlaylistsManagerProps {
  orgId: string;
}

interface Track {
  id: number;
  title: string;
  artist: string | null;
  mux_playback_id: string | null;
  mux_status: string | null;
  duration: number | null;
  sort_order: number;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Uploading…',
  preparing: 'Processing…',
  ready: 'Ready',
  errored: 'Failed',
};

export default function MusicPlaylistsManager({ orgId }: MusicPlaylistsManagerProps) {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ title: '', artist: '' });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTracks = useCallback(async () => {
    try {
      const res = await fetch('/api/music-tracks');
      if (res.ok) setTracks(await res.json());
    } catch (e) {
      console.error('Error fetching tracks:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    const anyPending = tracks.some(
      (t) => t.mux_status && t.mux_status !== 'ready' && t.mux_status !== 'errored'
    );
    if (anyPending && !pollRef.current) {
      pollRef.current = setInterval(fetchTracks, 5000);
    } else if (!anyPending && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current && !anyPending) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [tracks, fetchTracks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: 'Pick an audio file', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setProgress(0);
    try {
      const res = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'music', ...formData, sort_order: tracks.length }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Could not start upload');
      }
      const { uploadUrl } = await res.json();

      await new Promise<void>((resolve, reject) => {
        const upload = UpChunk.createUpload({ endpoint: uploadUrl, file });
        upload.on('error', (err: { detail: unknown }) => reject(err.detail));
        upload.on('progress', (p: { detail: number }) => setProgress(Math.round(p.detail)));
        upload.on('success', () => resolve());
      });

      toast({ title: 'Uploaded', description: 'Mux is processing the track.' });
      setFormData({ title: '', artist: '' });
      setFile(null);
      setShowForm(false);
      fetchTracks();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this track? This also removes the audio from Mux.')) return;
    const res = await fetch(`/api/music-tracks?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: 'Deleted' });
      fetchTracks();
    } else {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= tracks.length) return;
    const a = tracks[index];
    const b = tracks[target];
    // Swap sort_order values.
    await Promise.all([
      fetch('/api/music-tracks', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a.id, sort_order: b.sort_order }),
      }),
      fetch('/api/music-tracks', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b.id, sort_order: a.sort_order }),
      }),
    ]);
    fetchTracks();
  };

  if (loading) return <div>Loading music…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Worship Music</h3>
          <p className="text-sm text-muted-foreground">Upload worship tracks. They stream as audio through Mux in the app.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Track
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={formData.title} required
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input id="artist" value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio">Audio file *</Label>
            <Input id="audio" type="file" accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
            {file && <p className="text-xs text-muted-foreground">{file.name} ({(file.size / 1e6).toFixed(1)} MB)</p>}
          </div>

          {progress !== null && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-muted overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{progress}% uploaded</p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row [&>button]:w-full sm:[&>button]:w-auto">
            <Button type="submit" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</> : <><UploadCloud className="h-4 w-4 mr-2" />Upload</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {tracks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tracks yet. Upload your first worship track!</p>
        ) : (
          tracks.map((track, i) => (
            <div key={track.id} className="border rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                  {track.mux_status === 'ready' ? <Music className="h-4 w-4 text-muted-foreground" />
                    : track.mux_status === 'errored' ? <AlertTriangle className="h-4 w-4 text-red-500" />
                    : <Loader2 className="h-4 w-4 text-muted-foreground/70 animate-spin" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold truncate">{track.title}</h4>
                  {track.artist && <p className="text-sm text-muted-foreground truncate">{track.artist}</p>}
                  <StatusBadge status={track.mux_status} />
                </div>
              </div>
              <div className="flex gap-1 items-center shrink-0">
                <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" disabled={i === tracks.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(track.id)}
                  className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status || 'ready';
  const label = STATUS_LABEL[s] || s;
  const color =
    s === 'ready' ? 'bg-green-100 text-green-700'
      : s === 'errored' ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700';
  return <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded ${color}`}>{label}</span>;
}
