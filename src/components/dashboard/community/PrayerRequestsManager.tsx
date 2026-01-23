'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PrayerRequestsManagerProps {
  orgId: string;
}

interface PrayerRequest {
  id: number;
  title: string;
  description: string;
  is_anonymous: boolean;
  user_name: string | null;
  prayer_count: number;
  created_at: string;
}

export default function PrayerRequestsManager({ orgId }: PrayerRequestsManagerProps) {
  const { toast } = useToast();
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
  }, [orgId]);

  const fetchPrayers = async () => {
    try {
      const response = await fetch(`/api/prayer-requests?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setPrayers(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load prayer requests',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prayer requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;

    try {
      const response = await fetch(`/api/prayer-requests?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Prayer request deleted successfully',
        });
        fetchPrayers();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete prayer request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting prayer request:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prayer request',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <div>Loading prayer requests...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">User Prayer Requests</h3>
        <p className="text-sm text-gray-500">Prayer requests submitted by church members</p>
      </div>

      <div className="space-y-2">
        {prayers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No prayer requests yet. Users can submit prayers from the church website.
          </p>
        ) : (
          prayers.map((prayer) => (
            <div key={prayer.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{prayer.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{prayer.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <span>
                    By: {prayer.is_anonymous ? 'Anonymous' : (prayer.user_name || 'Anonymous')}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {prayer.prayer_count} prayers
                  </span>
                  <span className="mx-2">•</span>
                  <span>{new Date(prayer.created_at).toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(prayer.id)}
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
