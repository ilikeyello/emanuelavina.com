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
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="church-info" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Church Info</span>
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Billing</span>
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Content</span>
        </TabsTrigger>
        <TabsTrigger value="community" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Community</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="church-info" className="mt-6">
        <ChurchInfoTab orgId={orgId} />
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        <BillingTab orgId={orgId} />
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
