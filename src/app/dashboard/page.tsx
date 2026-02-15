import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { orgId, orgSlug, userId } = await auth();

  if (orgId) {
    redirect("/dashboard/client-portal");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 p-8 shadow-sm">
        <h2 className="text-3xl font-serif font-semibold text-[color:var(--foreground)] mb-4">
          Welcome to Your Dashboard
        </h2>
        
        {!orgId && (
          <div className="space-y-6">
            <div className="rounded-xl border border-blue-300 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-800">
                You're signed in, but not connected to a church organization yet.
              </p>
            </div>
            
            <div className="space-y-3 text-[color:var(--muted-foreground)]">
              <p className="font-semibold text-[color:var(--foreground)]">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Use the <strong>organization switcher</strong> in the navigation bar to select or create your church’s organization.</li>
                <li>Once your organization is active, you will be redirected to the Client Portal.</li>
                <li>There, you can manage your site’s content, view project updates, and handle billing.</li>
              </ol>
            </div>
            
            <div className="mt-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] p-4">
              <p className="text-sm text-[color:var(--muted-foreground)]">
                <strong>Note:</strong> If you've just purchased a package, your organization is being set up. You can manage everything from the Client Portal once you select your organization in the switcher.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
