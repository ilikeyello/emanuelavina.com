'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface EventsManagerProps {
  orgId: string;
}

interface ChurchEvent {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  max_attendees: number | null;
  created_at: string;
}

export default function EventsManager({ orgId }: EventsManagerProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_attendees: '',
  });

  // Helper function to format date correctly
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchEvents();
  }, [orgId]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load events',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
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
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          event_date: new Date(formData.event_date).toISOString(),
          location: formData.location || null,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Event created successfully',
        });
        setFormData({
          title: '',
          description: '',
          event_date: '',
          location: '',
          max_attendees: '',
        });
        setShowForm(false);
        fetchEvents();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to create event',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Event deleted successfully',
        });
        fetchEvents();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete event',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Events</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium border-b pb-2">Create Event</h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sunday Service"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                placeholder="Describe your event..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Date & Time *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Main Sanctuary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events yet. Add your first event!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold mb-2">{event.title}</h4>
                
                {event.description && (
                  <div className="text-sm text-gray-600 mb-3">
                    <div dangerouslySetInnerHTML={{ __html: event.description }} className="prose prose-sm max-w-none" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatEventDate(event.event_date)}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  {event.max_attendees && (
                    <span>Max: {event.max_attendees}</span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(event.id)}
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
