'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Music, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MusicPlaylistsManagerProps {
  orgId: string;
}

interface MusicContent {
  id: string;
  title: string;
  youtube_playlist_url: string | null;
  description: string | null;
  created_at: string;
}

export default function MusicPlaylistsManager({ orgId }: MusicPlaylistsManagerProps) {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<MusicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    youtube_playlist_url: '',
    description: '',
  });

  useEffect(() => {
    fetchPlaylists();
  }, [orgId]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`/api/church-content?type=music`);
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load music playlists',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load music playlists',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/church-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'music',
          title: formData.title,
          youtube_playlist_url: formData.youtube_playlist_url,
          description: formData.description || null,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Music playlist added successfully',
        });
        setFormData({ title: '', youtube_playlist_url: '', description: '' });
        setShowForm(false);
        fetchPlaylists();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to add playlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add playlist',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, youtube_playlist_url: string) => {
    try {
      const response = await fetch('/api/church-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, youtube_playlist_url }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Playlist URL updated',
        });
        fetchPlaylists();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update playlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update playlist',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const response = await fetch(`/api/church-content?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Playlist deleted successfully',
        });
        fetchPlaylists();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete playlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete playlist',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading music playlists...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Music Playlists</h3>
          <p className="text-sm text-gray-500">
            Add YouTube playlist URLs for worship music on your church site
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Playlist
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Playlist Name *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Worship Playlist"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_playlist_url">YouTube Playlist URL *</Label>
            <Input
              id="youtube_playlist_url"
              type="url"
              value={formData.youtube_playlist_url}
              onChange={(e) => setFormData({ ...formData, youtube_playlist_url: e.target.value })}
              placeholder="https://www.youtube.com/playlist?list=PLxxxxxxx"
              required
            />
            <p className="text-xs text-gray-400">
              Paste the full YouTube playlist URL. The church site will automatically embed it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Playlist'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {playlists.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No music playlists yet. Add a YouTube playlist URL to display on your church site.
          </p>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-gray-500 shrink-0" />
                  <h4 className="font-semibold truncate">{playlist.title}</h4>
                </div>
                {playlist.description && (
                  <p className="text-sm text-gray-600 mt-1 break-words">{playlist.description}</p>
                )}
                {playlist.youtube_playlist_url && (
                  <a
                    href={playlist.youtube_playlist_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1 break-all"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="break-all">{playlist.youtube_playlist_url}</span>
                  </a>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(playlist.id)}
                  className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
