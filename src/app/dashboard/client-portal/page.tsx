import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ClientPortalTabs from '@/components/dashboard/ClientPortalTabs';

export default async function ClientPortalPage() {
  const { orgId } = await auth();

  if (!orgId) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
        <p className="mt-2 text-gray-600">Manage your church site and content</p>
      </div>
      <ClientPortalTabs orgId={orgId} />
    </div>
  );
}
