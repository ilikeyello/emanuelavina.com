'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Radio, Music, Gamepad2, Bell } from 'lucide-react';
import SermonsManager from '../content/SermonsManager';
import LivestreamsManager from '../content/LivestreamsManager';
import MusicPlaylistsManager from '../content/MusicPlaylistsManager';
import GamesManager from '../content/GamesManager';
import NotificationsManager from '../content/NotificationsManager';

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
        <Tabs defaultValue="devotionals" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="devotionals" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Devotionals</span>
            </TabsTrigger>
            <TabsTrigger value="livestreams" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              <span className="hidden sm:inline">Livestream</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="devotionals" className="mt-6">
            <SermonsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="livestreams" className="mt-6">
            <LivestreamsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="music" className="mt-6">
            <MusicPlaylistsManager orgId={orgId} />
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
