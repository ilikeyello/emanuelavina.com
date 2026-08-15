'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Radio, Music, Gamepad2, Bell, BookOpen } from 'lucide-react';
import SermonsManager from '../content/SermonsManager';
import LivestreamsManager from '../content/LivestreamsManager';
import MusicPlaylistsManager from '../content/MusicPlaylistsManager';
import GamesManager from '../content/GamesManager';
import NotificationsManager from '../content/NotificationsManager';
import VersesOfTheDayManager from '../content/VersesOfTheDayManager';

interface ContentManagementTabProps {
  orgId: string;
}

export default function ContentManagementTab({ orgId }: ContentManagementTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>
          Upload and manage all content for your church site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sermons" className="w-full">
          <TabsList>
            <TabsTrigger value="sermons">
              <Video className="h-4 w-4 shrink-0" />
              <span>Sermons</span>
            </TabsTrigger>
            <TabsTrigger value="livestreams">
              <Radio className="h-4 w-4 shrink-0" />
              <span>Livestream</span>
            </TabsTrigger>
            <TabsTrigger value="music">
              <Music className="h-4 w-4 shrink-0" />
              <span>Music</span>
            </TabsTrigger>
            <TabsTrigger value="verse">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Verse</span>
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad2 className="h-4 w-4 shrink-0" />
              <span>Games</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 shrink-0" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sermons" className="mt-6">
            <SermonsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="livestreams" className="mt-6">
            <LivestreamsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="music" className="mt-6">
            <MusicPlaylistsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="verse" className="mt-6">
            <VersesOfTheDayManager />
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <GamesManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationsManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
