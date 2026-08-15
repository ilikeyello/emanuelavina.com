'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';
import MultiImageUpload from '@/components/ui/MultiImageUpload';

interface AnnouncementsManagerProps {
  orgId: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  image_url: string | null;
  image_urls: string[] | null;
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
    title: '',
    content: '',
    priority: 'normal',
    image_urls: [] as string[],
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
          title: formData.title,
          content: formData.content,
          priority: formData.priority,
          image_urls: formData.image_urls,
          expires_at: formData.expires_at || null,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement created successfully',
        });
        setFormData({
          title: '',
          content: '',
          priority: 'normal',
          image_urls: [],
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
      case 'low': return 'bg-muted text-foreground';
      default: return 'bg-muted text-foreground';
    }
  };

  if (loading) return <div>Loading announcements...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Announcements</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium border-b pb-2">Create Announcement</h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content: content })}
                placeholder="Write your announcement..."
              />
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <MultiImageUpload
                value={formData.image_urls}
                onChange={(urls) => setFormData({ ...formData, image_urls: urls })}
                label="Announcement photo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>button]:w-full sm:[&>button]:w-auto">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Announcement'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {announcements.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No announcements yet.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="border rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div dangerouslySetInnerHTML={{ __html: announcement.content }} className="prose prose-sm max-w-none" />
                </div>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Created: {new Date(announcement.created_at).toLocaleString()}
                  {announcement.expires_at && ` | Expires: ${new Date(announcement.expires_at).toLocaleString()}`}
                </p>
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
