'use client';

import { useState } from 'react';
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
// across the Content and Community tabs. Sections are ordered by how often they
// get touched in a normal week, most-used first.
//
// Notifications, Prayer Requests, Bulletin Posts, and Flagged Content are
// intentionally not listed: the in-app Community (user-generated) section is
// off. Their manager components and API routes are still in the repo — add an
// entry here to bring one back.
const SECTIONS = [
  { value: 'livestreams', label: 'Livestream', icon: Radio },
  { value: 'sermons', label: 'Sermons', icon: Video },
  { value: 'verse', label: 'Verse', icon: BookOpen },
  { value: 'announcements', label: 'Announcements', icon: Megaphone },
  { value: 'events', label: 'Events', icon: CalendarDays },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'games', label: 'Games', icon: Gamepad2 },
] as const;

export default function CommunityTab({ orgId }: CommunityTabProps) {
  // Controlled so the phone layout can name the active section below the icon
  // row — the labels themselves are hidden at that width.
  const [active, setActive] = useState<string>(SECTIONS[0].value);
  const activeLabel = SECTIONS.find((s) => s.value === active)?.label ?? '';

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
        <Tabs value={active} onValueChange={setActive} className="w-full">
          {/* All seven icons fit across a phone in a single row, so the strip
              never needs to scroll sideways. Labels come back at sm and up. */}
          <TabsList className="grid grid-cols-7 gap-0.5 sm:flex sm:gap-1">
            {SECTIONS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                // The visible label is display:none below sm, which also removes
                // it from the accessibility tree — hence the explicit name.
                aria-label={label}
                title={label}
                className="min-w-0 px-0 py-2.5 sm:px-3 sm:py-2"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Names the active icon on phones. */}
          <p
            aria-hidden
            className="mt-2 text-center text-sm font-semibold text-[color:var(--foreground)] sm:hidden"
          >
            {activeLabel}
          </p>

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
