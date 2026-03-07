'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface AnnouncementsManagerProps {
  orgId: string;
}

interface Announcement {
  id: number;
  titleEn: string;
  titleEs: string;
  contentEn: string;
  contentEs: string;
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
  const [editingLanguage, setEditingLanguage] = useState<'en' | 'es'>('en');
  const [formData, setFormData] = useState({
    titleEn: '',
    titleEs: '',
    contentEn: '',
    contentEs: '',
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
          titleEn: formData.titleEn,
          titleEs: formData.titleEs,
          contentEn: formData.contentEn,
          contentEs: formData.contentEs,
          priority: formData.priority,
          image_url: formData.image_url || null,
          expires_at: formData.expires_at || null,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Announcement created successfully',
        });
        setFormData({
          titleEn: '',
          titleEs: '',
          contentEn: '',
          contentEs: '',
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
          {/* Language Toggle */}
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-medium">Create Announcement</h4>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={editingLanguage === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditingLanguage('en')}
              >
                <Globe className="h-4 w-4 mr-1" />
                English
              </Button>
              <Button
                type="button"
                variant={editingLanguage === 'es' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEditingLanguage('es')}
              >
                <Globe className="h-4 w-4 mr-1" />
                Español
              </Button>
            </div>
          </div>

          {/* English Fields */}
          {editingLanguage === 'en' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titleEn">English Title *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter title in English"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>English Content *</Label>
                <RichTextEditor
                  content={formData.contentEn}
                  onChange={(content) => setFormData({ ...formData, contentEn: content })}
                  placeholder="Write your announcement in English..."
                />
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {editingLanguage === 'es' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titleEs">Spanish Title *</Label>
                <Input
                  id="titleEs"
                  value={formData.titleEs}
                  onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                  placeholder="Ingrese el título en español"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Spanish Content *</Label>
                <RichTextEditor
                  content={formData.contentEs}
                  onChange={(content) => setFormData({ ...formData, contentEs: content })}
                  placeholder="Escribe tu anuncio en español..."
                />
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Announcement'}
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
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{announcement.titleEn}</h4>
                  <span className="text-xs text-gray-500">|</span>
                  <h4 className="font-medium text-gray-600">{announcement.titleEs}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <span className="font-medium">English:</span>
                    <div dangerouslySetInnerHTML={{ __html: announcement.contentEn }} className="mt-1 prose prose-sm max-w-none" />
                  </div>
                  <div>
                    <span className="font-medium">Spanish:</span>
                    <div dangerouslySetInnerHTML={{ __html: announcement.contentEs }} className="mt-1 prose prose-sm max-w-none" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
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
