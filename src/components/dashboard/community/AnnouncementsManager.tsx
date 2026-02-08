'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AnnouncementsManagerProps {
  orgId: string;
}

interface Announcement {
  id: number;
  title_en: string;
  title_es: string;
  content_en: string;
  content_es: string;
  priority: string;
  image_url: string | null;
  expires_at: string | null;
  created_at: string;
}

export default function AnnouncementsManager({ orgId }: AnnouncementsManagerProps) {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '',
    title_es: '',
    content_en: '',
    content_es: '',
    priority: 'normal',
    image_url: '',
    expires_at: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [orgId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/announcements?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load announcements',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
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
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: formData.title_en,
          title_es: formData.title_es || formData.title_en,
          content_en: formData.content_en,
          content_es: formData.content_es || formData.content_en,
          priority: formData.priority,
          image_url: formData.image_url || null,
          expires_at: formData.expires_at || null,
          organization_id: orgId,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement created successfully',
        });
        setFormData({
          title_en: '',
          title_es: '',
          content_en: '',
          content_es: '',
          priority: 'normal',
          image_url: '',
          expires_at: '',
        });
        setShowForm(false);
        fetchAnnouncements();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to create announcement',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement deleted successfully',
        });
        fetchAnnouncements();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete announcement',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading announcements...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Announcements</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_en">Title (English) *</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_es">Title (Spanish)</Label>
              <Input
                id="title_es"
                value={formData.title_es}
                onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                placeholder="Leave blank to use English title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content_en">Content (English) *</Label>
              <Textarea
                id="content_en"
                value={formData.content_en}
                onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_es">Content (Spanish)</Label>
              <Textarea
                id="content_es"
                value={formData.content_es}
                onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
                rows={4}
                placeholder="Leave blank to use English content"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expires At</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Announcement'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{announcement.title_en || announcement.title_es}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                {announcement.title_es && announcement.title_es !== announcement.title_en && (
                  <p className="text-sm text-gray-500 italic">{announcement.title_es}</p>
                )}
                <p className="text-sm text-gray-700 mt-2">{announcement.content_en || announcement.content_es}</p>
                {announcement.expires_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Expires: {new Date(announcement.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(announcement.id)}
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
