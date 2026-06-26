'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Copy, Check, Eye, EyeOff, Radio, Pencil, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LivestreamsManagerProps {
  orgId: string;
}

interface Livestream {
  id: number;
  title: string | null;
  is_live: boolean;
  scheduled_start: string | null;
  mux_stream_id: string | null;
  mux_stream_key: string | null;
  mux_playback_id: string | null;
  mux_status: string | null;
}

const RTMPS_URL = 'rtmps://global-live.mux.com:443/app';

export default function LivestreamsManager({ orgId }: LivestreamsManagerProps) {
  const { toast } = useToast();
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('Sunday Service');
  const [showKey, setShowKey] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  const fetchLivestreams = useCallback(async () => {
    try {
      const response = await fetch(`/api/livestreams?orgId=${orgId}`);
      if (response.ok) setLivestreams(await response.json());
    } catch (error) {
      console.error('Error fetching livestreams:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchLivestreams();
  }, [fetchLivestreams]);

  // Refresh periodically so the live indicator (driven by Mux webhooks) updates.
  useEffect(() => {
    const interval = setInterval(fetchLivestreams, 15000);
    return () => clearInterval(interval);
  }, [fetchLivestreams]);

  const createStream = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/mux/livestream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create livestream');
      }
      toast({ title: 'Livestream created', description: 'Copy the stream key into OBS to go live.' });
      fetchLivestreams();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this livestream? The Mux stream and its key will stop working.')) return;
    try {
      const res = await fetch(`/api/mux/livestream?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Deleted' });
        fetchLivestreams();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const toggleLive = async (stream: Livestream) => {
    try {
      const res = await fetch('/api/livestreams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: stream.id, is_live: !stream.is_live }),
      });
      if (res.ok) fetchLivestreams();
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const startEditTitle = (stream: Livestream) => {
    setEditingId(stream.id);
    setEditTitle(stream.title || '');
  };

  const cancelEditTitle = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveTitle = async (id: number) => {
    setSavingTitle(true);
    try {
      const res = await fetch('/api/livestreams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle.trim() || null }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchLivestreams();
      } else {
        toast({ title: 'Error', description: 'Failed to update title', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update title', variant: 'destructive' });
    } finally {
      setSavingTitle(false);
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading) return <div>Loading livestreams…</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold">Livestream</h3>
          <p className="text-sm text-gray-500">Broadcast with OBS (or any RTMP encoder) through Mux.</p>
        </div>
        {livestreams.length === 0 && (
          <div className="flex items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor="ls-title">Title</Label>
              <Input id="ls-title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-48" />
            </div>
            <Button onClick={createStream} disabled={creating}>
              <Plus className="h-4 w-4 mr-2" />
              {creating ? 'Creating…' : 'Create Livestream'}
            </Button>
          </div>
        )}
      </div>

      {livestreams.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No livestream yet. Create one to get your OBS stream key.</p>
      ) : (
        livestreams.map((stream) => {
          const keyVisible = showKey[stream.id];
          return (
            <div key={stream.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-gray-500" />
                  {editingId === stream.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTitle(stream.id);
                          if (e.key === 'Escape') cancelEditTitle();
                        }}
                        className="h-8 w-48"
                        autoFocus
                      />
                      <Button size="sm" variant="outline" disabled={savingTitle} onClick={() => saveTitle(stream.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditTitle}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold">{stream.title || 'Livestream'}</h4>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => startEditTitle(stream)}
                        aria-label="Edit title"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  {stream.is_live ? (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded animate-pulse">● LIVE</span>
                  ) : (
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Offline</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleLive(stream)}>
                    {stream.is_live ? 'Force Offline' : 'Force Live'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(stream.id)}
                    className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 border p-3 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">OBS / Encoder settings</p>

                <CopyRow label="Server (RTMPS URL)" value={RTMPS_URL}
                  onCopy={() => copy(RTMPS_URL, `url-${stream.id}`)} copied={copied === `url-${stream.id}`} />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Stream key</span>
                    <button type="button" className="text-xs text-gray-500 flex items-center gap-1"
                      onClick={() => setShowKey({ ...showKey, [stream.id]: !keyVisible })}>
                      {keyVisible ? <><EyeOff className="h-3 w-3" />Hide</> : <><Eye className="h-3 w-3" />Show</>}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white border rounded px-2 py-1 truncate">
                      {keyVisible ? (stream.mux_stream_key || '—') : '•'.repeat(28)}
                    </code>
                    <Button variant="outline" size="sm"
                      onClick={() => copy(stream.mux_stream_key || '', `key-${stream.id}`)}>
                      {copied === `key-${stream.id}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-[11px] text-gray-400">Keep this private. Anyone with the key can broadcast to your channel.</p>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed">
                  In OBS: <strong>Settings → Stream → Service: Custom</strong>. Paste the Server URL and Stream Key above,
                  then click <strong>Start Streaming</strong>. The app shows the stream automatically once Mux detects it
                  (no need to toggle manually).
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function CopyRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs bg-white border rounded px-2 py-1 truncate">{value}</code>
        <Button variant="outline" size="sm" onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
