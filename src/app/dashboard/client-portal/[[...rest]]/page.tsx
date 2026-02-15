import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import ClientPortalTabs from '@/components/dashboard/ClientPortalTabs';

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

export default async function ClientPortalPage() {
  const { orgId } = await auth();

  if (!orgId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-8 shadow-sm text-center">
          <h2 className="text-2xl font-serif font-semibold text-[color:var(--foreground)] mb-2">
            Organization Required
          </h2>
          <p className="text-[color:var(--muted-foreground)] mb-6">
            Please select or create an organization using the switcher in the navigation bar to access the Client Portal.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[color:var(--foreground)]/80 text-sm font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-sm transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
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
        <h1 className="text-3xl font-serif font-semibold text-[color:var(--foreground)]">Client Portal</h1>
        <p className="mt-1 text-[color:var(--muted-foreground)]">Manage your church site, content, and project tasks.</p>
      </div>
      <ClientPortalTabs orgId={orgId} />
    </div>
  );
}
