'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Megaphone, CalendarDays, Flag } from 'lucide-react';
import PrayerRequestsManager from '../community/PrayerRequestsManager';
import BulletinPostsManager from '../community/BulletinPostsManager';
import AnnouncementsManager from '../community/AnnouncementsManager';
import EventsManager from '../content/EventsManager';
import FlaggedContentManager from '../community/FlaggedContentManager';

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="prayers" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Prayer Requests</span>
            </TabsTrigger>
            <TabsTrigger value="bulletin" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Bulletin Posts</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="flagged" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Flagged</span>
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

          <TabsContent value="events" className="mt-6">
            <EventsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="flagged" className="mt-6">
            <FlaggedContentManager orgId={orgId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
