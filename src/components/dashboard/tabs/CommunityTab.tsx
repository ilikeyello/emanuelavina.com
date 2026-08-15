'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, Video, BookOpen, Megaphone, CalendarDays, Music, Gamepad2 } from 'lucide-react';
import LivestreamsManager from '../content/LivestreamsManager';
import SermonsManager from '../content/SermonsManager';
import VersesOfTheDayManager from '../content/VersesOfTheDayManager';
import AnnouncementsManager from '../community/AnnouncementsManager';
import EventsManager from '../content/EventsManager';
import MusicPlaylistsManager from '../content/MusicPlaylistsManager';
import GamesManager from '../content/GamesManager';

interface CommunityTabProps {
  orgId: string;
}

// Everything the church publishes to the app lives here — what used to be split
// across the Content and Community tabs. Sub-tabs are ordered by how often they
// get touched in a normal week, most-used first.
//
// Notifications, Prayer Requests, Bulletin Posts, and Flagged Content are
// intentionally not wired up: the in-app Community (user-generated) section is
// off. Their manager components and API routes are still in the repo — re-add a
// TabsTrigger/TabsContent pair here to bring one back.

export default function CommunityTab({ orgId }: CommunityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community</CardTitle>
        <CardDescription>
          Manage everything your congregation sees in the app — livestreams, sermons,
          verses, announcements, events, music, and games.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="livestreams" className="w-full">
          <TabsList>
            <TabsTrigger value="livestreams">
              <Radio className="h-4 w-4 shrink-0" />
              <span>Livestream</span>
            </TabsTrigger>
            <TabsTrigger value="sermons">
              <Video className="h-4 w-4 shrink-0" />
              <span>Sermons</span>
            </TabsTrigger>
            <TabsTrigger value="verse">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Verse</span>
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="h-4 w-4 shrink-0" />
              <span>Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="music">
              <Music className="h-4 w-4 shrink-0" />
              <span>Music</span>
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad2 className="h-4 w-4 shrink-0" />
              <span>Games</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="livestreams" className="mt-6">
            <LivestreamsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="sermons" className="mt-6">
            <SermonsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="verse" className="mt-6">
            <VersesOfTheDayManager />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="music" className="mt-6">
            <MusicPlaylistsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <GamesManager orgId={orgId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
