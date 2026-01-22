'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit } from 'lucide-react';

interface SermonsManagerProps {
  orgId: string;
}

interface Sermon {
  id: number;
  title: string;
  youtube_url: string;
  description: string | null;
  speaker: string | null;
  sermon_date: string | null;
  created_at: string;
}

export default function SermonsManager({ orgId }: SermonsManagerProps) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    speaker: '',
    sermon_date: '',
  });

  useEffect(() => {
    fetchSermons();
  }, [orgId]);

  const fetchSermons = async () => {
    try {
      const response = await fetch(`/api/sermons?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setSermons(data);
      }
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, organization_id: orgId }),
      });

      if (response.ok) {
        setFormData({ title: '', youtube_url: '', description: '', speaker: '', sermon_date: '' });
        setShowForm(false);
        fetchSermons();
      }
    } catch (error) {
      console.error('Error adding sermon:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;

    try {
      const response = await fetch(`/api/sermons?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSermons();
      }
    } catch (error) {
      console.error('Error deleting sermon:', error);
    }
  };

  if (loading) return <div>Loading sermons...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sermons</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sermon
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL *</Label>
              <Input
                id="youtube_url"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon_date">Date</Label>
              <Input
                id="sermon_date"
                type="date"
                value={formData.sermon_date}
                onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Sermon</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {sermons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No sermons yet. Add your first sermon!</p>
        ) : (
          sermons.map((sermon) => (
            <div key={sermon.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{sermon.title}</h4>
                {sermon.speaker && <p className="text-sm text-gray-600">Speaker: {sermon.speaker}</p>}
                {sermon.description && <p className="text-sm text-gray-600 mt-1">{sermon.description}</p>}
                <a
                  href={sermon.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  Watch on YouTube
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(sermon.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
