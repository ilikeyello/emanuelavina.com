'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, CreditCard, Upload, MessageSquare } from 'lucide-react';
import ChurchInfoTab from './tabs/ChurchInfoTab';
import BillingTab from './tabs/BillingTab';
import ContentManagementTab from './tabs/ContentManagementTab';
import CommunityTab from './tabs/CommunityTab';

interface ClientPortalTabsProps {
  orgId: string;
}

export default function ClientPortalTabs({ orgId }: ClientPortalTabsProps) {
  return (
    <Tabs defaultValue="church-info" className="w-full">
      <TabsList>
        <TabsTrigger value="church-info">
          <Building2 className="h-4 w-4 shrink-0" />
          <span>Church Info</span>
        </TabsTrigger>
        <TabsTrigger value="billing">
          <CreditCard className="h-4 w-4 shrink-0" />
          <span>Billing</span>
        </TabsTrigger>
        <TabsTrigger value="content">
          <Upload className="h-4 w-4 shrink-0" />
          <span>Content</span>
        </TabsTrigger>
        <TabsTrigger value="community">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span>Community</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="church-info" className="mt-6">
        <ChurchInfoTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <BillingTab />
      </TabsContent>

      <TabsContent value="content" className="mt-6">
        <ContentManagementTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="community" className="mt-6">
        <CommunityTab orgId={orgId} />
      </TabsContent>
    </Tabs>
  );
}
