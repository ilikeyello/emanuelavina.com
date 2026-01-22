'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Radio, BookOpen, Music, Gamepad2 } from 'lucide-react';
import SermonsManager from '../content/SermonsManager';
import LivestreamsManager from '../content/LivestreamsManager';
import DevotionalsManager from '../content/DevotionalsManager';
import MusicPlaylistsManager from '../content/MusicPlaylistsManager';
import GamesManager from '../content/GamesManager';

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sermons" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Sermons</span>
            </TabsTrigger>
            <TabsTrigger value="livestreams" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              <span className="hidden sm:inline">Livestream</span>
            </TabsTrigger>
            <TabsTrigger value="devotionals" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Devotionals</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sermons" className="mt-6">
            <SermonsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="livestreams" className="mt-6">
            <LivestreamsManager orgId={orgId} />
          </TabsContent>

          <TabsContent value="devotionals" className="mt-6">
            <DevotionalsManager orgId={orgId} />
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
