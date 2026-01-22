'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface LivestreamsManagerProps {
  orgId: string;
}

interface Livestream {
  id: number;
  stream_url: string;
  title: string | null;
  is_live: boolean;
  scheduled_start: string | null;
}

export default function LivestreamsManager({ orgId }: LivestreamsManagerProps) {
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    stream_url: '',
    title: '',
    is_live: false,
    scheduled_start: '',
  });

  useEffect(() => {
    fetchLivestreams();
  }, [orgId]);

  const fetchLivestreams = async () => {
    try {
      const response = await fetch(`/api/livestreams?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setLivestreams(data);
      }
    } catch (error) {
      console.error('Error fetching livestreams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/livestreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, organization_id: orgId }),
      });

      if (response.ok) {
        setFormData({ stream_url: '', title: '', is_live: false, scheduled_start: '' });
        setShowForm(false);
        fetchLivestreams();
      }
    } catch (error) {
      console.error('Error adding livestream:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this livestream?')) return;

    try {
      const response = await fetch(`/api/livestreams?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLivestreams();
      }
    } catch (error) {
      console.error('Error deleting livestream:', error);
    }
  };

  const toggleLive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/livestreams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_live: !currentStatus }),
      });

      if (response.ok) {
        fetchLivestreams();
      }
    } catch (error) {
      console.error('Error toggling live status:', error);
    }
  };

  if (loading) return <div>Loading livestreams...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Livestreams</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Livestream
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stream_url">Stream URL *</Label>
              <Input
                id="stream_url"
                type="url"
                value={formData.stream_url}
                onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                placeholder="https://youtube.com/live/..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sunday Service"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_start">Scheduled Start</Label>
            <Input
              id="scheduled_start"
              type="datetime-local"
              value={formData.scheduled_start}
              onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Livestream</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {livestreams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No livestreams configured.</p>
        ) : (
          livestreams.map((stream) => (
            <div key={stream.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{stream.title || 'Livestream'}</h4>
                  {stream.is_live && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</span>
                  )}
                </div>
                <a
                  href={stream.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {stream.stream_url}
                </a>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleLive(stream.id, stream.is_live)}
                >
                  {stream.is_live ? 'Set Offline' : 'Set Live'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(stream.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
