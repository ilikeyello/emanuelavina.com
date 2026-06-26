'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as UpChunk from '@mux/upchunk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, UploadCloud, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SermonsManagerProps {
  orgId: string;
}

// Manages the church's video devotionals. Videos are uploaded directly to Mux;
// the `sermons` table stores the Mux asset/playback ids (youtube_url is legacy).
interface Sermon {
  id: number;
  title: string;
  description: string | null;
  speaker: string | null;
  sermon_date: string | null;
  mux_playback_id: string | null;
  mux_status: string | null;
  duration: number | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Uploading…',
  preparing: 'Processing…',
  ready: 'Ready',
  errored: 'Failed',
};

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSermons = useCallback(async () => {
    try {
      const response = await fetch(`/api/sermons?orgId=${orgId}`);
      if (response.ok) {
        setSermons(await response.json());
      }
    } catch (error) {
      console.error('Error fetching devotionals:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  // Poll while anything is still processing so webhook updates show up.
  useEffect(() => {
    const anyPending = sermons.some(
      (s) => s.mux_status && s.mux_status !== 'ready' && s.mux_status !== 'errored'
    );
    if (anyPending && !pollRef.current) {
      pollRef.current = setInterval(fetchSermons, 5000);
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
  }, [sermons, fetchSermons]);

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
    if (!confirm('Delete this devotional? This also removes the video from Mux.')) return;
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

  if (loading) return <div>Loading devotionals…</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Devotionals</h3>
          <p className="text-sm text-gray-500">Upload video devotionals. They stream through Mux in the app.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Devotional
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
          <p className="text-gray-500 text-center py-8">No devotionals yet. Upload your first video!</p>
        ) : (
          sermons.map((sermon) => (
            <div key={sermon.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                {sermon.mux_playback_id && sermon.mux_status === 'ready' ? (
                  <img
                    src={`https://image.mux.com/${sermon.mux_playback_id}/thumbnail.jpg?width=160&height=90&fit_mode=preserve`}
                    alt="" className="w-28 h-16 object-cover rounded bg-gray-100 shrink-0" />
                ) : (
                  <div className="w-28 h-16 rounded bg-gray-100 flex items-center justify-center shrink-0">
                    <StatusIcon status={sermon.mux_status} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{sermon.title}</h4>
                  {sermon.speaker && <p className="text-sm text-gray-600">Speaker: {sermon.speaker}</p>}
                  {sermon.description && <p className="text-sm text-gray-600 mt-1 break-words line-clamp-2">{sermon.description}</p>}
                  <StatusBadge status={sermon.mux_status} />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button variant="outline" size="sm" onClick={() => handleDelete(sermon.id)}
                  className="text-red-600 hover:text-red-700 flex-1 sm:flex-none">
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string | null }) {
  if (status === 'errored') return <AlertTriangle className="h-5 w-5 text-red-500" />;
  if (status === 'ready') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status || 'ready';
  const label = STATUS_LABEL[s] || s;
  const color =
    s === 'ready' ? 'bg-green-100 text-green-700'
      : s === 'errored' ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700';
  return <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${color}`}>{label}</span>;
}
