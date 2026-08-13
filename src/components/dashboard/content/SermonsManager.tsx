'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as UpChunk from '@mux/upchunk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus, Trash2, UploadCloud, Loader2, CheckCircle2, AlertTriangle,
  Radio, Video, Pencil, Check, X, EyeOff,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SermonsManagerProps {
  orgId: string;
}

// Manages the church's sermon library. Two things land in the `sermons` table:
//   • source = 'livestream' — recordings Mux saves automatically when a
//     broadcast ends (see /api/webhooks/mux). Nobody has to upload these.
//   • source = 'upload'     — devotionals the admin uploads by hand.
// Both stream through Mux; `youtube_url` is legacy.
interface Sermon {
  id: number;
  title: string;
  description: string | null;
  speaker: string | null;
  sermon_date: string | null;
  source: 'upload' | 'livestream' | null;
  published: boolean | null;
  mux_playback_id: string | null;
  mux_status: string | null;
  duration: number | null;
  recorded_at: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Uploading…',
  preparing: 'Processing…',
  ready: 'Ready',
  errored: 'Failed',
};

function formatDuration(seconds: number | null): string | null {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

export default function SermonsManager({ orgId }: SermonsManagerProps) {
  const { toast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    sermon_date: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSermons = useCallback(async () => {
    try {
      const response = await fetch(`/api/sermons?orgId=${orgId}`);
      if (response.ok) {
        setSermons(await response.json());
      }
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  // Poll while anything is processing so webhook updates show up — this also
  // surfaces a livestream recording shortly after the broadcast ends.
  useEffect(() => {
    const anyPending = sermons.some(
      (s) => s.mux_status && s.mux_status !== 'ready' && s.mux_status !== 'errored'
    );
    const interval = anyPending ? 5000 : 60000;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(fetchSermons, interval);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [sermons, fetchSermons]);

  const patchSermon = async (id: number, patch: Record<string, unknown>) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/sermons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchSermons();
      return true;
    } catch {
      toast({ title: 'Error', description: 'Could not save changes', variant: 'destructive' });
      return false;
    } finally {
      setSavingId(null);
    }
  };

  const saveTitle = async (id: number) => {
    const title = editTitle.trim();
    if (!title) return;
    if (await patchSermon(id, { title })) setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: 'Pick a video file', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    setProgress(0);
    try {
      const res = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'devotional', ...formData }),
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

      toast({ title: 'Uploaded', description: 'Mux is processing the video. It will appear as “Ready” shortly.' });
      setFormData({ title: '', description: '', speaker: '', sermon_date: '' });
      setFile(null);
      setShowForm(false);
      fetchSermons();
    } catch (error) {
      console.error('Devotional upload failed:', error);
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
    if (!confirm('Delete this sermon? This also removes the video from Mux.')) return;
    try {
      const response = await fetch(`/api/sermons?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Deleted' });
        fetchSermons();
      } else {
        toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading sermons…</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Sermons</h3>
          <p className="text-sm text-gray-500">
            Livestreams are recorded and added here automatically when the broadcast ends.
            You can also upload a devotional by hand.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Devotional
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
              <Label htmlFor="speaker">Speaker</Label>
              <Input id="speaker" value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sermon_date">Date</Label>
            <Input id="sermon_date" type="date" value={formData.sermon_date}
              onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video file *</Label>
            <Input id="video" type="file" accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
            {file && <p className="text-xs text-gray-500">{file.name} ({(file.size / 1e6).toFixed(1)} MB)</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          {progress !== null && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-500">{progress}% uploaded</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</> : <><UploadCloud className="h-4 w-4 mr-2" />Upload</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {sermons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No sermons yet. Start a livestream and the recording will appear here, or upload a devotional.
          </p>
        ) : (
          sermons.map((sermon) => {
            const isRecording = sermon.source === 'livestream';
            const length = formatDuration(sermon.duration);
            const busy = savingId === sermon.id;
            return (
              <div key={sermon.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                  {sermon.mux_playback_id && sermon.mux_status === 'ready' ? (
                    <div className="relative shrink-0">
                      <img
                        src={`https://image.mux.com/${sermon.mux_playback_id}/thumbnail.jpg?width=160&height=90&fit_mode=preserve`}
                        alt="" className="w-28 h-16 object-cover rounded bg-gray-100" />
                      {length && (
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] px-1 rounded">
                          {length}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-28 h-16 rounded bg-gray-100 flex items-center justify-center shrink-0">
                      <StatusIcon status={sermon.mux_status} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {editingId === sermon.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveTitle(sermon.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="h-8"
                          autoFocus
                        />
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => saveTitle(sermon.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 min-w-0">
                        <h4 className="font-semibold truncate">{sermon.title}</h4>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600 shrink-0"
                          onClick={() => { setEditingId(sermon.id); setEditTitle(sermon.title); }}
                          aria-label="Rename"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {sermon.speaker && <p className="text-sm text-gray-600">Speaker: {sermon.speaker}</p>}
                    {sermon.description && <p className="text-sm text-gray-600 mt-1 break-words line-clamp-2">{sermon.description}</p>}
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <SourceBadge isRecording={isRecording} />
                      <StatusBadge status={sermon.mux_status} />
                      {sermon.published === false && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                          <EyeOff className="h-3 w-3" />Hidden
                        </span>
                      )}
                      {sermon.sermon_date && (
                        <span className="text-xs text-gray-500">
                          {new Date(`${sermon.sermon_date}T00:00:00`).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => patchSermon(sermon.id, { published: !(sermon.published ?? true) })}
                    className="flex-1 sm:flex-none"
                  >
                    {sermon.published === false ? 'Publish' : 'Hide'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(sermon.id)}
                    className="text-red-600 hover:text-red-700 flex-1 sm:flex-none">
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SourceBadge({ isRecording }: { isRecording: boolean }) {
  return isRecording ? (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
      <Radio className="h-3 w-3" />Recorded Service
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">
      <Video className="h-3 w-3" />Devotional
    </span>
  );
}

function StatusIcon({ status }: { status: string | null }) {
  if (status === 'errored') return <AlertTriangle className="h-5 w-5 text-red-500" />;
  if (status === 'ready') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status || 'ready';
  if (s === 'ready') return null; // "Ready" is the normal case; no need to shout it.
  const label = STATUS_LABEL[s] || s;
  const color =
    s === 'ready' ? 'bg-green-100 text-green-700'
      : s === 'errored' ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700';
  return <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${color}`}>{label}</span>;
}
