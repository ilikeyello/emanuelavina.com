'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface DevotionalsManagerProps {
  orgId: string;
}

interface Devotional {
  id: number;
  title: string;
  content: string;
  scripture_reference: string | null;
  author: string | null;
  publish_date: string;
}

export default function DevotionalsManager({ orgId }: DevotionalsManagerProps) {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    scripture_reference: '',
    author: '',
    publish_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDevotionals();
  }, [orgId]);

  const fetchDevotionals = async () => {
    try {
      const response = await fetch(`/api/devotionals?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setDevotionals(data);
      }
    } catch (error) {
      console.error('Error fetching devotionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/devotionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, organization_id: orgId }),
      });

      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          scripture_reference: '',
          author: '',
          publish_date: new Date().toISOString().split('T')[0],
        });
        setShowForm(false);
        fetchDevotionals();
      }
    } catch (error) {
      console.error('Error adding devotional:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this devotional?')) return;

    try {
      const response = await fetch(`/api/devotionals?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchDevotionals();
      }
    } catch (error) {
      console.error('Error deleting devotional:', error);
    }
  };

  if (loading) return <div>Loading devotionals...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Devotionals</h3>
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
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scripture_reference">Scripture Reference</Label>
              <Input
                id="scripture_reference"
                value={formData.scripture_reference}
                onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                placeholder="John 3:16"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publish_date">Publish Date</Label>
              <Input
                id="publish_date"
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Devotional</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {devotionals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No devotionals yet.</p>
        ) : (
          devotionals.map((devotional) => (
            <div key={devotional.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{devotional.title}</h4>
                {devotional.scripture_reference && (
                  <p className="text-sm text-gray-600">Scripture: {devotional.scripture_reference}</p>
                )}
                {devotional.author && <p className="text-sm text-gray-600">By: {devotional.author}</p>}
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{devotional.content}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(devotional.id)}
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
