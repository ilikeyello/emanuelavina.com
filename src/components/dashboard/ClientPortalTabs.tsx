'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, MessageSquare, CreditCard } from 'lucide-react';
import ChurchInfoTab from './tabs/ChurchInfoTab';
import CommunityTab from './tabs/CommunityTab';
import BillingTab from './tabs/BillingTab';

interface ClientPortalTabsProps {
  orgId: string;
}

// Billing sits last on purpose — it's checked rarely compared to the day-to-day
// church info and content work.
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
        <TabsTrigger value="billing">
          <CreditCard className="h-4 w-4 shrink-0" />
          <span>Billing</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="church-info" className="mt-6">
        <ChurchInfoTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="community" className="mt-6">
        <CommunityTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <BillingTab />
      </TabsContent>
    </Tabs>
  );
}
