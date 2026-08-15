'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BulletinPostsManagerProps {
  orgId: string;
}

interface BulletinPost {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_id: string | null;
  created_at: string;
}

export default function BulletinPostsManager({ orgId }: BulletinPostsManagerProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [orgId]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/bulletin-posts?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        const errorText = await response.text();
        console.error('Error fetching bulletin posts:', response.status, errorText);
        toast({
          title: 'Error',
          description: 'Failed to load bulletin posts',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching bulletin posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bulletin posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bulletin post?')) return;

    try {
      const response = await fetch(`/api/bulletin-posts?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Bulletin post deleted successfully',
        });
        fetchPosts();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete bulletin post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting bulletin post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete bulletin post',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading bulletin posts...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">User Bulletin Posts</h3>
        <p className="text-sm text-muted-foreground">
          Posts created by church members on the website
        </p>
      </div>

      <div className="space-y-2">
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No bulletin posts yet. Users can create posts from the church website.
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0 w-full">
                <h4 className="font-semibold truncate">{post.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 break-words">{post.content}</p>
                <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-x-2">
                   <span>By: {post.author_name}</span>
                   <span className="opacity-50">•</span>
                   <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
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
