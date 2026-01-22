import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import ClientPortalTabs from '@/components/dashboard/ClientPortalTabs';

export default async function ClientPortalPage() {
  const { orgId } = await auth();

  if (!orgId) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Organization Required
          </h2>
          <p className="text-yellow-800 mb-4">
            Please select or create an organization to access the Client Portal.
          </p>
          <Link 
            href="/dashboard"
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
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
