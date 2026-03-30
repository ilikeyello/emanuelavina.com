'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Send } from 'lucide-react';

interface NotificationsManagerProps {
  orgId: string;
}

export default function NotificationsManager({ orgId }: NotificationsManagerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    url: '/'
  });

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.body) {
      toast({
        title: 'Error',
        description: 'Please fill in title and message',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Call Supabase Edge Function to send push notifications
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          url: formData.url,
          orgId: orgId,
          icon: '/icon-192x192.png'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send notification');
      }

      const result = await response.json();

      toast({
        title: 'Success',
        description: `Notification sent to ${result.success} subscriber(s)`,
      });

      // Reset form
      setFormData({
        title: '',
        body: '',
        url: '/'
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send notification',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-blue-500" />
        <div>
          <h3 className="text-lg font-semibold">Push Notifications</h3>
          <p className="text-sm text-gray-500">Send notifications to all subscribed users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Push Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendNotification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="e.g., New Sermon Available"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="e.g., Join us for this week's message on faith and hope"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Link (Optional)</Label>
              <Input
                id="url"
                placeholder="e.g., /sermons or /events"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                When users click the notification, they'll be taken to this page
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send Notification'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">💡 Tips for Effective Notifications</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Keep titles short and clear (under 50 characters)</li>
              <li>Messages should be concise but informative</li>
              <li>Use notifications sparingly to avoid overwhelming users</li>
              <li>Test with yourself first before sending to everyone</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
