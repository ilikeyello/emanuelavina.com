'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MessageSquare, Users } from 'lucide-react';
import ChurchInfoTab from './tabs/ChurchInfoTab';
import CommunityTab from './tabs/CommunityTab';
import OrgTab from './tabs/OrgTab';

interface ClientPortalTabsProps {
  orgId: string;
}

// Org sits last on purpose — org settings and billing are checked rarely
// compared to the day-to-day church info and content work.
export default function ClientPortalTabs({ orgId }: ClientPortalTabsProps) {
  return (
    <Tabs defaultValue="church-info" className="w-full">
      <TabsList>
        <TabsTrigger value="church-info">
          <Building2 className="h-4 w-4 shrink-0" />
          <span>Church Info</span>
        </TabsTrigger>
        <TabsTrigger value="community">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span>Community</span>
        </TabsTrigger>
        <TabsTrigger value="org">
          <Users className="h-4 w-4 shrink-0" />
          <span>Org</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="church-info" className="mt-6">
        <ChurchInfoTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="community" className="mt-6">
        <CommunityTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="org" className="mt-6">
        <OrgTab />
      </TabsContent>
    </Tabs>
  );
}
