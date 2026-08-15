'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar, MapPin, Users, ChevronDown, ChevronUp, Pencil, GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';
import MultiImageUpload from '@/components/ui/MultiImageUpload';

interface EventsManagerProps {
  orgId: string;
}

type RsvpFieldType = 'text' | 'number' | 'select' | 'boolean' | 'multiselect';

interface RsvpField {
  key: string;
  label: string;
  type: RsvpFieldType;
  required: boolean;
  options: string[];
}

// Builder-only shape: options edited as raw comma-separated text.
interface BuilderField {
  key: string;
  label: string;
  type: RsvpFieldType;
  required: boolean;
  optionsText: string;
}

interface EventRsvp {
  id: number;
  user_name: string | null;
  user_email: string | null;
  attendees: number | null;
  responses: Record<string, unknown> | null;
  created_at: string;
}

interface ChurchEvent {
  id: number;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  max_attendees: number | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  rsvp_fields?: RsvpField[] | null;
  created_at: string;
  rsvps?: EventRsvp[];
  rsvpsLoading?: boolean;
  rsvpsExpanded?: boolean;
}

const FIELD_TYPE_LABELS: Record<RsvpFieldType, string> = {
  text: 'Short text',
  number: 'Number',
  select: 'Dropdown (pick one)',
  boolean: 'Yes / No',
  multiselect: 'Checkboxes (pick several)',
};

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  location: '',
  max_attendees: '',
  image_urls: [] as string[],
};

const makeKey = () => `f_${Math.random().toString(36).slice(2, 9)}`;

const toBuilderFields = (fields?: RsvpField[] | null): BuilderField[] =>
  (fields ?? []).map((f) => ({
    key: f.key || makeKey(),
    label: f.label ?? '',
    type: (f.type as RsvpFieldType) ?? 'text',
    required: !!f.required,
    optionsText: Array.isArray(f.options) ? f.options.join(', ') : '',
  }));

const toStoredFields = (fields: BuilderField[]): RsvpField[] =>
  fields
    .filter((f) => f.label.trim().length > 0)
    .map((f) => ({
      key: f.key,
      label: f.label.trim(),
      type: f.type,
      required: f.required,
      options:
        f.type === 'select' || f.type === 'multiselect'
          ? f.optionsText.split(',').map((o) => o.trim()).filter(Boolean)
          : [],
    }));

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatAnswer = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return String(value);
};

export default function EventsManager({ orgId }: EventsManagerProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [fields, setFields] = useState<BuilderField[]>([]);

  const formatEventDate = (dateString: string) => new Date(dateString).toLocaleString();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/events?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.map((e: ChurchEvent) => ({ ...e, rsvps: undefined, rsvpsLoading: false, rsvpsExpanded: false })));
      } else {
        toast({ title: 'Error', description: 'Failed to load events', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load events', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [orgId, toast]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setFields([]);
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setFormData({ ...emptyForm });
    setFields([]);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (event: ChurchEvent) => {
    setEditingId(event.id);
    setFormData({
      title: event.title ?? '',
      description: event.description ?? '',
      event_date: toLocalInput(event.event_date),
      location: event.location ?? '',
      max_attendees: event.max_attendees != null ? String(event.max_attendees) : '',
      // Events created before galleries only have image_url — show it as the
      // first photo so editing one doesn't silently drop its image.
      image_urls: event.image_urls?.length
        ? event.image_urls
        : event.image_url
          ? [event.image_url]
          : [],
    });
    setFields(toBuilderFields(event.rsvp_fields));
    setShowForm(true);
  };

  // --- Question builder handlers ---
  const addField = () =>
    setFields((prev) => [...prev, { key: makeKey(), label: '', type: 'text', required: false, optionsText: '' }]);

  const updateField = (index: number, patch: Partial<BuilderField>) =>
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const removeField = (index: number) =>
    setFields((prev) => prev.filter((_, i) => i !== index));

  const toggleRsvps = async (eventId: number) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        if (e.rsvpsExpanded) return { ...e, rsvpsExpanded: false };
        if (e.rsvps !== undefined) return { ...e, rsvpsExpanded: true };
        return { ...e, rsvpsExpanded: true, rsvpsLoading: true };
      })
    );

    const event = events.find((e) => e.id === eventId);
    if (!event || event.rsvps !== undefined || event.rsvpsExpanded) return;

    try {
      const res = await fetch(`/api/events/rsvps?eventId=${eventId}`);
      const rsvps: EventRsvp[] = res.ok ? await res.json() : [];
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, rsvps, rsvpsLoading: false } : e))
      );
    } catch {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, rsvps: [], rsvpsLoading: false } : e))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const isEdit = editingId !== null;
    try {
      const payload = {
        ...(isEdit ? { id: editingId } : {}),
        title: formData.title,
        description: formData.description || null,
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location || null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        image_urls: formData.image_urls,
        rsvp_fields: toStoredFields(fields),
      };
      const response = await fetch('/api/events', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: 'Success', description: isEdit ? 'Event updated' : 'Event created successfully' });
        resetForm();
        fetchEvents();
      } else {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: 'Error', description: err.error || 'Failed to save event', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save event', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Success', description: 'Event deleted successfully' });
        fetchEvents();
      } else {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({ title: 'Error', description: err.error || 'Failed to delete event', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Events</h3>
        <Button onClick={() => (showForm ? resetForm() : startCreate())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium border-b pb-2">{editingId ? 'Edit Event' : 'Create Event'}</h4>
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
            <div className="space-y-2">
              <Label>Photos</Label>
              <MultiImageUpload
                value={formData.image_urls}
                onChange={(urls) => setFormData({ ...formData, image_urls: urls })}
                label="Event photo"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

          {/* --- Custom RSVP questions builder --- */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Label>Custom RSVP questions</Label>
                <p className="text-xs text-muted-foreground">
                  Asked in the app when someone RSVPs to this event. Name and party size are always collected.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addField} className="w-full shrink-0 sm:w-auto">
                <Plus className="h-4 w-4 mr-1" /> Add question
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground/70">No custom questions. Add one to collect extra info per event.</p>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.key} className="rounded-md border bg-muted/40 p-3 space-y-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-2.5 shrink-0" />
                      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Question</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            placeholder="e.g. Number of children"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Answer type</Label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, { type: e.target.value as RsvpFieldType })}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="mt-6 text-muted-foreground/70 hover:text-red-600 shrink-0"
                        aria-label="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {(field.type === 'select' || field.type === 'multiselect') && (
                      <div className="space-y-1 pl-6">
                        <Label className="text-xs">Options (comma-separated)</Label>
                        <Input
                          value={field.optionsText}
                          onChange={(e) => updateField(index, { optionsText: e.target.value })}
                          placeholder="e.g. 9am, 11am, 6pm"
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="h-4 w-4 rounded border-input"
                      />
                      Required
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>button]:w-full sm:[&>button]:w-auto">
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Event' : 'Save Event'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No events yet. Add your first event!</p>
        ) : (
          events.map((event) => {
            const customFields = event.rsvp_fields ?? [];
            return (
            <div key={event.id} className="border rounded-lg overflow-hidden">
              {/* Event row */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <h4 className="font-semibold mb-2 truncate">{event.title}</h4>
                  {event.description && (
                    <div className="text-sm text-muted-foreground mb-3 break-words overflow-hidden">
                      <div dangerouslySetInnerHTML={{ __html: event.description }} className="prose prose-sm max-w-none" />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>{formatEventDate(event.event_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    {event.max_attendees && (
                      <span className="shrink-0">Max: {event.max_attendees}</span>
                    )}
                    {customFields.length > 0 && (
                      <span className="shrink-0 text-muted-foreground/70">
                        {customFields.length} custom question{customFields.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRsvps(event.id)}
                    className="flex items-center gap-1"
                  >
                    <Users className="h-4 w-4" />
                    RSVPs
                    {event.rsvpsExpanded
                      ? <ChevronUp className="h-3.5 w-3.5" />
                      : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(event)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* RSVPs panel */}
              {event.rsvpsExpanded && (
                <div className="border-t bg-muted/40 px-4 py-3">
                  {event.rsvpsLoading ? (
                    <p className="text-sm text-muted-foreground">Loading RSVPs…</p>
                  ) : event.rsvps && event.rsvps.length > 0 ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                        {event.rsvps.length} RSVP{event.rsvps.length !== 1 ? 's' : ''}
                        {' · '}
                        {event.rsvps.reduce((sum, r) => sum + (r.attendees || 1), 0)} total attending
                      </p>
                      <div className="-mx-4 overflow-x-auto px-4">
                        <table className="w-full min-w-[520px] text-sm border-collapse">
                          <thead>
                            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground/70">
                              <th className="py-2 pr-4 font-semibold">Name</th>
                              <th className="py-2 pr-4 font-semibold">Email</th>
                              <th className="py-2 pr-4 font-semibold">Party</th>
                              {customFields.map((f) => (
                                <th key={f.key} className="py-2 pr-4 font-semibold whitespace-nowrap">{f.label}</th>
                              ))}
                              <th className="py-2 pr-4 font-semibold">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.rsvps.map((rsvp) => (
                              <tr key={rsvp.id} className="border-t bg-card">
                                <td className="py-2 pr-4 font-medium">{rsvp.user_name || 'Anonymous'}</td>
                                <td className="py-2 pr-4 text-muted-foreground">{rsvp.user_email || '—'}</td>
                                <td className="py-2 pr-4">{rsvp.attendees ?? 1}</td>
                                {customFields.map((f) => (
                                  <td key={f.key} className="py-2 pr-4 text-foreground/80">
                                    {formatAnswer(rsvp.responses ? rsvp.responses[f.key] : undefined)}
                                  </td>
                                ))}
                                <td className="py-2 pr-4 text-muted-foreground/70 whitespace-nowrap">
                                  {new Date(rsvp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No RSVPs yet.</p>
                  )}
                </div>
              )}
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
