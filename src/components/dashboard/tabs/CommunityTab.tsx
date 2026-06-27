'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Megaphone, CalendarDays, Flag, Ban } from 'lucide-react';
import AnnouncementsManager from '../community/AnnouncementsManager';
import EventsManager from '../content/EventsManager';

interface CommunityTabProps {
  orgId: string;
}

// Shown in place of the prayer/bulletin/flagged managers while the in-app
// Community section (user-generated content) is disabled. To bring these back,
// restore the original manager components and re-enable UGC in the app.
function DisabledNotice({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 px-6 py-16 text-center">
      <Ban className="mb-4 h-10 w-10 text-muted-foreground/60" />
      <h3 className="text-lg font-semibold text-foreground">
        {title} — Temporarily Disabled
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This feature is turned off while the in-app Community section is disabled.
        Nothing needs to be managed here for now.
      </p>
    </div>
  );
}

export default function CommunityTab({ orgId }: CommunityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Management</CardTitle>
        <CardDescription>
          Manage announcements and events. Prayer requests and bulletin posts are temporarily disabled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="prayers" className="flex items-center gap-2 opacity-60">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Prayer Requests</span>
            </TabsTrigger>
            <TabsTrigger value="bulletin" className="flex items-center gap-2 opacity-60">
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
            <TabsTrigger value="flagged" className="flex items-center gap-2 opacity-60">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Flagged</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prayers" className="mt-6">
            <DisabledNotice title="Prayer Requests" />
          </TabsContent>

          <TabsContent value="bulletin" className="mt-6">
            <DisabledNotice title="Bulletin Posts" />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="flagged" className="mt-6">
            <DisabledNotice title="Flagged Content" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
