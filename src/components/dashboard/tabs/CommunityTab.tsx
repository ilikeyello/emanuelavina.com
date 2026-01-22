'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Megaphone } from 'lucide-react';
import PrayerRequestsManager from '../community/PrayerRequestsManager';
import BulletinPostsManager from '../community/BulletinPostsManager';
import AnnouncementsManager from '../community/AnnouncementsManager';

interface CommunityTabProps {
  orgId: string;
}

export default function CommunityTab({ orgId }: CommunityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Management</CardTitle>
        <CardDescription>
          Manage prayer requests, bulletin posts, and announcements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prayers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prayers" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Prayer Requests
            </TabsTrigger>
            <TabsTrigger value="bulletin" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Bulletin Posts
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prayers" className="mt-6">
            <PrayerRequestsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="bulletin" className="mt-6">
            <BulletinPostsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementsManager orgId={orgId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
