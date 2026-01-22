'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface BulletinPostsManagerProps {
  orgId: string;
}

interface BulletinPost {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
}

export default function BulletinPostsManager({ orgId }: BulletinPostsManagerProps) {
  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_name: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [orgId]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/bulletin-posts?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching bulletin posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bulletin-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, organization_id: orgId }),
      });

      if (response.ok) {
        setFormData({ title: '', content: '', author_name: '' });
        setShowForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error adding bulletin post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/bulletin-posts?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting bulletin post:', error);
    }
  };

  if (loading) return <div>Loading bulletin posts...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bulletin Posts</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Post
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
              <Label htmlFor="author_name">Author Name *</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Post</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bulletin posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="text-sm text-gray-600">By: {post.author_name}</p>
                <p className="text-sm text-gray-700 mt-2">{post.content}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(post.id)}
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
